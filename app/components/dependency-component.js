import Ember from 'ember';
import computed from 'ember-computed-decorators';
import { task } from 'ember-concurrency';
import promiseArray from 'ember-awesome-macros/promise-array';
import normalizeDependencies from '../utils/normalize-dependencies';
import mergeModules from '../utils/merge-modules';
import getRealVersion from '../utils/get-real-version';

const {
  Component,
  inject: { service },
  get, set, setProperties,
  computed: { not, or, readOnly },
  merge
} = Ember;

const groups = [
  ['Dependencies', 'dependencies'],
  ['Dev Dependencies', 'devDependencies'],
  ['Optional Dependencies', 'optionalDependencies']
];

export default Component.extend({
  task: service(),

  @computed('repoUrl', 'repo')
  isRepoUrlInvalid(repoUrl, repo) {
    return repoUrl && !repo;
  },

  @computed('firstJson', 'secondJson')
  dependencyGroups(firstJson, secondJson) {
    // we are creating new dependency objects
    // so cancel all the promises that set values on the old dependency objects
    this._cancelAll();

    let dependencyGroups = groups.map(([title, prop]) => {
      let firstDependencies = normalizeDependencies(firstJson[prop]);
      let secondDependencies = normalizeDependencies(secondJson[prop]);

      let dependencies = this._getDependencies(firstDependencies, secondDependencies);

      let dependencyGroup = Ember.Object.create({
        title,
        dependencies
      });

      this._setupComputeds(dependencyGroup, false);

      return dependencyGroup;
    }).filter(dependencyGroup => get(dependencyGroup, 'dependencies').length);

    return dependencyGroups;
  },

  // to reuse the crawling logic
  dependencies: readOnly('dependencyGroups'),

  _getDependencies(firstDependencies, secondDependencies) {
    let dependencies = mergeModules(firstDependencies, secondDependencies);

    for (let dependency of dependencies) {
      this._setupVersions(dependency);

      this._setupComputeds(dependency);
    }

    return dependencies;
  },

  _setupVersions(dependency) {
    setProperties(dependency, {
      versionsPromise: get(this, '_setupVersionsTask').perform(dependency)
    });

    this._setupDependencies(dependency);
  },

  _setupVersionsTask: task(function * (dependency) {
    let module            = get(dependency, 'module');
    let firstVersionHint  = get(dependency, 'firstVersionHint');
    let secondVersionHint = get(dependency, 'secondVersionHint');

    let versions;
    try {
       versions = yield get(this, 'task.getVersions').perform(module);
    } catch (error) {
      set(dependency, 'versionsError', error.errorThrown);

      return true;
    }

    let firstVersion  = this._getFirstVersion(versions, firstVersionHint);
    let secondVersion = this._getSecondVersion(versions, secondVersionHint);

    setProperties(dependency, {
      firstVersion,
      secondVersion,
      isFirstVersionMissing:  not('firstVersion'),
      isSecondVersionMissing: not('secondVersion'),
      isOneMissing: or('isFirstVersionMissing', 'isSecondVersionMissing')
    });

    this._checkForCircularReference(dependency, 'firstVersion',  'hasFirstCircularReference');
    this._checkForCircularReference(dependency, 'secondVersion', 'hasSecondCircularReference');

    return false;
  }),

  _getFirstVersion(versions, firstVersionHint) {
    return this._getRealVersion(versions, firstVersionHint, 'repoWorkingDate');
  },
  _getSecondVersion(versions, secondVersionHint) {
    return this._getRealVersion(versions, secondVersionHint, 'repoBrokenDate');
  },
  _getRealVersion(versions, versionHint, repoDateProp) {
    let repoDate = get(this, repoDateProp);

    let realVersion = getRealVersion(
      versionHint,
      versions,
      repoDate
    );

    return realVersion;
  },

  _checkForCircularReference(dependency, versionProp, hasCircularReferenceProp) {
    let module  = get(dependency, 'module');
    let version = get(dependency, versionProp);
    let parent  = get(dependency, 'parent');
    while (parent) {
      let parentModule  = get(parent, 'module');
      let parentVersion = get(parent, versionProp);
      if (parentModule  == module &&
          parentVersion == version) {
        set(dependency, hasCircularReferenceProp, true);

        break;
      }

      parent = get(parent, 'parent');
    }
  },

  _setupDependencies(dependency) {
    let nestedDependenciesPromise = get(this, '_setupDependenciesTask').perform(dependency);

    setProperties(dependency, {
      nestedDependenciesPromise,
      dependencies: promiseArray(() => {
        return nestedDependenciesPromise.catch(() => {
          // catch means task was canceled, return empty array to continue
          return [];
        });
      })
    });
  },

  _setupDependenciesTask: task(function * (dependency) {
    let wasErrorThrown = yield get(dependency, 'versionsPromise');
    if (wasErrorThrown) {
      return;
    }

    let getDependenciesTask = get(this, 'getDependenciesTask');
    let firstDependencies = yield getDependenciesTask.perform(dependency, 'firstVersion', 'firstDependenciesError', 'hasFirstCircularReference');
    let secondDependencies = yield getDependenciesTask.perform(dependency, 'secondVersion', 'secondDependenciesError', 'hasSecondCircularReference');

    return this._getNestedDependencies(firstDependencies, secondDependencies, dependency);
  }),

  getDependenciesTask: task(function * (dependency, versionProp, errorProp, hasCircularReferenceProp) {
    let dependencies;

    let hasCircularReference = get(dependency, hasCircularReferenceProp);
    if (hasCircularReference) {
      dependencies = [];
    } else {
      let module  = get(dependency, 'module');
      let version = get(dependency, versionProp);

      // missing from either side
      if (!version) {
        dependencies = [];
      } else {
        try {
          dependencies = yield get(this, 'task.getDependencies').perform(module, version);
        } catch (error) {
          set(dependency, errorProp, error.errorThrown);
        }
      }
    }

    return dependencies;
  }),

  _getNestedDependencies(firstDependencies, secondDependencies, parentDependency) {
    // error or cancel
    if (!firstDependencies || !secondDependencies) {
      return [];
    }

    let dependencies = this._getDependencies(firstDependencies, secondDependencies);

    for (let dependency of dependencies) {
      set(dependency, 'parent', parentDependency);
    }

    return dependencies;
  },

  _setupComputeds(dependency, shouldSetupVersions = true) {
    let props = {
      @computed('firstVersion', 'secondVersion')
      areVersionsDifferent(firstVersion, secondVersion) {
        if (!firstVersion || !secondVersion) {
          return false;
        }

        return firstVersion !== secondVersion;
      },

      @computed('isSomethingWrong', 'dependencies.@each.numberOfDifferences')
      numberOfDifferences(isSomethingWrong, dependencies) {
        let initialValue = isSomethingWrong ? 1 : 0;

        if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
          return initialValue;
        }

        let numberOfDifferences = dependencies.reduce((previousValue, currentValue) => {
          return previousValue + get(currentValue, 'numberOfDifferences');
        }, initialValue);

        return numberOfDifferences;
      },

      @computed('dependencies.@each.isDoneCrawling')
      isDoneCrawling(dependencies) {
        if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
          return false;
        }

        let areChildrenDoneCrawling = !dependencies.filterBy('isDoneCrawling', false).length;
        let stopCrawling = get(this, 'stopCrawling');

        return areChildrenDoneCrawling && !stopCrawling;
      }
    };

    if (shouldSetupVersions) {
      merge(props, {
        isFirstVersionHintMissing:  not('firstVersionHint'),
        isSecondVersionHintMissing: not('secondVersionHint'),
        isOneHintMissing: or('isFirstVersionHintMissing', 'isSecondVersionHintMissing'),
        isSomethingWrong: or('isOneMissing', 'areVersionsDifferent')
      });
    }

    setProperties(dependency, props);
  },

  @computed(
    'repo',
    'repoWorkingDateError',
    'repoBrokenDateError',
    'firstCommitError',
    'secondCommitError',
    'areDatesOutOfOrder'
  )
  shouldShowTables(
    repo,
    repoWorkingDateError,
    repoBrokenDateError,
    firstCommitError,
    secondCommitError,
    areDatesOutOfOrder
  ) {
    return repo &&
    !repoWorkingDateError &&
    !repoBrokenDateError &&
      !firstCommitError &&
      !secondCommitError &&
      !areDatesOutOfOrder;
  },

  didInsertElement() {
    this._setupComputeds(this, false);
  },

  _cancelAll() {
    get(this, '_setupVersionsTask').cancelAll();
    get(this, '_setupDependenciesTask').cancelAll();
  },

  _restartAll(dependency) {
    let versionsPromise           = get(dependency, 'versionsPromise');
    let nestedDependenciesPromise = get(dependency, 'nestedDependenciesPromise');

    if (versionsPromise && get(versionsPromise, 'isCanceled')) {
      this._setupVersions(dependency);
    } else if (nestedDependenciesPromise && get(nestedDependenciesPromise, 'isCanceled')) {
      this._setupDependencies(dependency);
    } else {
      get(dependency, 'dependencies').forEach(this._restartAll.bind(this));
    }
  },

  actions: {
    changeRepoUrl(url) {
      this.sendAction('repoUrlUpdated', url);
    },
    changeRepoWorkingDate(date) {
      this.sendAction('repoWorkingDateUpdated', date);
    },
    changeRepoBrokenDate(date) {
      this.sendAction('repoBrokenDateUpdated', date);
    },
    toggleCrawling() {
      let stopCrawling = this.toggleProperty('stopCrawling');
      if (stopCrawling) {
        this._cancelAll();
      } else {
        this._restartAll(this);
      }
    }
  }
});
