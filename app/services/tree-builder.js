import Ember from 'ember';
import { task } from 'ember-concurrency';
import computed from 'ember-computed-decorators';
import { promiseArray } from 'ember-awesome-macros';
import normalizeDependencies from '../utils/normalize-dependencies';
import mergeModules from '../utils/merge-modules';
import getRealVersion from '../utils/get-real-version';

const {
  Service,
  inject: { service },
  computed: { not, or },
  get, set, setProperties,
  merge
} = Ember;

const groups = [
  ['Dependencies', 'dependencies'],
  ['Dev Dependencies', 'devDependencies'],
  ['Optional Dependencies', 'optionalDependencies']
];

export default Service.extend({
  task: service(),

  getDependencyGroups({
    firstJson,
    secondJson,
    repoWorkingDate,
    repoBrokenDate
  }) {
    // we are creating new dependency objects
    // so cancel all the promises that set values on the old dependency objects
    this.cancelAll();

    let dependencyGroups = groups.map(([title, prop]) => {
      let firstDependencies = normalizeDependencies(firstJson[prop]);
      let secondDependencies = normalizeDependencies(secondJson[prop]);

      let dependencies = this._getDependencies({
        firstDependencies,
        secondDependencies,
        repoWorkingDate,
        repoBrokenDate
      });

      let dependencyGroup = Ember.Object.create({
        title,
        dependencies
      });

      this.setupComputeds(dependencyGroup, false);

      return dependencyGroup;
    }).filter(dependencyGroup => get(dependencyGroup, 'dependencies').length);

    return dependencyGroups;
  },

  _getDependencies({
    firstDependencies,
    secondDependencies,
    repoWorkingDate,
    repoBrokenDate
  }) {
    let dependencies = mergeModules(firstDependencies, secondDependencies);

    for (let dependency of dependencies) {
      this._setupVersions(dependency, repoWorkingDate, repoBrokenDate);

      this.setupComputeds(dependency);
    }

    return dependencies;
  },

  _setupVersions(dependency, repoWorkingDate, repoBrokenDate) {
    let task = get(this, '_setupVersionsTask');
    setProperties(dependency, {
      versionsPromise: task.perform(dependency, repoWorkingDate, repoBrokenDate)
    });

    this._setupDependencies(dependency, repoWorkingDate, repoBrokenDate);
  },

  _setupVersionsTask: task(function * (dependency, repoWorkingDate, repoBrokenDate) {
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

    let firstVersion  = getRealVersion(firstVersionHint, versions, repoWorkingDate);
    let secondVersion = getRealVersion(secondVersionHint, versions, repoBrokenDate);

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

  _setupDependencies(dependency, repoWorkingDate, repoBrokenDate) {
    let task = get(this, '_setupDependenciesTask');
    let nestedDependenciesPromise = task.perform(dependency, repoWorkingDate, repoBrokenDate);

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

  _setupDependenciesTask: task(function * (dependency, repoWorkingDate, repoBrokenDate) {
    let wasErrorThrown = yield get(dependency, 'versionsPromise');
    if (wasErrorThrown) {
      return;
    }

    let task = get(this, 'getDependenciesTask');
    let firstDependencies = yield task.perform(dependency, 'firstVersion', 'firstDependenciesError', 'hasFirstCircularReference');
    let secondDependencies = yield task.perform(dependency, 'secondVersion', 'secondDependenciesError', 'hasSecondCircularReference');

    return this._getNestedDependencies({
      firstDependencies,
      secondDependencies,
      repoWorkingDate,
      repoBrokenDate,
      parentDependency: dependency
    });
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

  _getNestedDependencies({
    firstDependencies,
    secondDependencies,
    repoWorkingDate,
    repoBrokenDate,
    parentDependency
  }) {
    // error or cancel
    if (!firstDependencies || !secondDependencies) {
      return [];
    }

    let dependencies = this._getDependencies({
      firstDependencies,
      secondDependencies,
      repoWorkingDate,
      repoBrokenDate
    });

    for (let dependency of dependencies) {
      set(dependency, 'parent', parentDependency);
    }

    return dependencies;
  },

  setupComputeds(dependency, shouldSetupVersions = true) {
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

  cancelAll() {
    get(this, '_setupVersionsTask').cancelAll();
    get(this, '_setupDependenciesTask').cancelAll();
  },

  restartAll(dependency, repoWorkingDate, repoBrokenDate) {
    let versionsPromise           = get(dependency, 'versionsPromise');
    let nestedDependenciesPromise = get(dependency, 'nestedDependenciesPromise');

    if (versionsPromise && get(versionsPromise, 'isCanceled')) {
      this._setupVersions(dependency, repoWorkingDate, repoBrokenDate);
    } else if (nestedDependenciesPromise && get(nestedDependenciesPromise, 'isCanceled')) {
      this._setupDependencies(dependency, repoWorkingDate, repoBrokenDate);
    } else {
      get(dependency, 'dependencies').forEach(dependency => {
        this.restartAll.call(this, dependency, repoWorkingDate, repoBrokenDate);
      });
    }
  }
});
