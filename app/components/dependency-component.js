import Ember from 'ember';
import computed from 'ember-computed-decorators';
import { task } from 'ember-concurrency';
import promiseArray from 'ember-awesome-macros/promise-array';
import normalizeDependencies from '../utils/normalize-dependencies';
import mergeModules from '../utils/merge-modules';
import getRealVersion from '../utils/get-real-version';

const {
  Component,
  RSVP: { all },
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

  _getVersionsPromise(module) {
    return get(this, 'getVersionsTask').perform(module);
  },

  getVersionsTask: task(function * (path) {
    let versions = yield get(this, 'task.getVersions').perform(path);

    return versions;
  }),

  @computed('firstJson', 'secondJson')
  dependencyGroups(firstJson, secondJson) {
    // we are creating new dependency objects
    // so cancel all the promises that set values on the old dependency objects
    get(this, 'getVersionsTask').cancelAll();
    get(this, 'getDependenciesTask').cancelAll();

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

  _getDependencies(firstDependencies, secondDependencies) {
    let dependencies = mergeModules(firstDependencies, secondDependencies);

    for (let dependency of dependencies) {
      this._setupVersions(dependency);

      this._setupComputeds(dependency);
    }

    return dependencies;
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

  _getFirstDependencies(dependency) {
    return get(this, 'getDependenciesTask').perform(dependency, 'firstVersion', 'firstDependenciesError', 'hasFirstCircularReference');
  },
  _getSecondDependencies(dependency) {
    return get(this, 'getDependenciesTask').perform(dependency, 'secondVersion', 'secondDependenciesError', 'hasSecondCircularReference');
  },
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
        dependencies = yield get(this, 'task.getDependencies').perform(module, version);
      }
    }

    return dependencies;
  }),

  _getNestedDependencies(dependenciesPromise, parentDependency) {
    return dependenciesPromise.then(([
      firstDependencies,
      secondDependencies
    ]) => {
      // error or cancel
      if (!firstDependencies || !secondDependencies) {
        return [];
      }

      let dependencies = this._getDependencies(firstDependencies, secondDependencies);

      for (let dependency of dependencies) {
        set(dependency, 'parent', parentDependency);
      }

      return dependencies;
    });
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

  @computed('repoUrl', 'repo')
  isRepoUrlInvalid(repoUrl, repo) {
    return repoUrl && !repo;
  },

  // to reuse the crawling logic
  dependencies: readOnly('dependencyGroups'),

  didInsertElement() {
    this._setupComputeds(this, false);
  },

  _setupVersions(dependency) {
    let module            = get(dependency, 'module');
    let firstVersionHint  = get(dependency, 'firstVersionHint');
    let secondVersionHint = get(dependency, 'secondVersionHint');

    let versionsPromise = this._getVersionsPromise(module).then(versions => {
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
    }).catch(error => {
      set(dependency, 'versionsError', error);

      return true;
    });

    setProperties(dependency, {
      versionsPromise
    });

    this._setupDependencies(dependency);
  },

  _setupDependencies(dependency) {
    let versionsPromise = get(dependency, 'versionsPromise');

    let nestedDependenciesPromise = versionsPromise.then(wasErrorThrown => {
      if (wasErrorThrown) {
        return;
      }

      let firstDependenciesPromise = this._getFirstDependencies(dependency).catch(e => {
        set(dependency, 'firstDependenciesError', e);
      });
      let secondDependenciesPromise = this._getSecondDependencies(dependency).catch(e => {
        set(dependency, 'secondDependenciesError', e);
      });

      let dependenciesPromise = all([firstDependenciesPromise, secondDependenciesPromise]);

      return this._getNestedDependencies(dependenciesPromise, dependency);
    });

    setProperties(dependency, {
      dependencies: promiseArray(() => nestedDependenciesPromise)
    });
  },

  _recurse(dependency) {
    let versionsError           = get(dependency, 'versionsError');
    let firstDependenciesError  = get(dependency, 'firstDependenciesError');
    let secondDependenciesError = get(dependency, 'secondDependenciesError');

    if (versionsError && versionsError.name === 'TaskCancelation') {
      set(dependency, 'versionsError', undefined);

      this._setupVersions(dependency);
    } else if (
      (firstDependenciesError && firstDependenciesError.name === 'TaskCancelation') ||
      (secondDependenciesError && secondDependenciesError.name === 'TaskCancelation')
    ) {
      setProperties(dependency, {
        firstDependenciesError: undefined,
        secondDependenciesError: undefined
      });

      this._setupDependencies(dependency);
    } else {
      get(dependency, 'dependencies').forEach(this._recurse.bind(this));
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
        get(this, 'getVersionsTask').cancelAll();
        get(this, 'getDependenciesTask').cancelAll();
      } else {
        this._recurse(this);
      }
    }
  }
});
