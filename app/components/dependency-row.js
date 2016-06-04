import Ember from 'ember';
import { task } from 'ember-concurrency';
import sum from 'ember-cpm/macros/sum';
import promiseAll from 'ember-awesome-macros/promise-all';
import promiseArray from 'ember-awesome-macros/promise-array';
import getRealVersion from '../utils/get-real-version';
import mergeModules from '../utils/merge-modules';

const {
  Component,
  get, set,
  computed,
  computed: { not, readOnly, or, and },
  inject: { service },
  A: newArray
} = Ember;

export default Component.extend({
  tagName: '',

  task: service(),

  module:            readOnly('dependency.module'),
  firstVersionHint:  readOnly('dependency.firstVersionHint'),
  secondVersionHint: readOnly('dependency.secondVersionHint'),

  nestingLevel: 1,

  parentDependencies: newArray(),

  _numberOfAwaitingRequests: 0,

  childNestingLevel: sum('nestingLevel', 1),

  childDependencies: computed('parentDependencies.length', 'module', 'firstVersion', 'secondVersion', function() {
    let parentDependencies = get(this, 'parentDependencies');
    let module             = get(this, 'module');
    let firstVersion       = get(this, 'firstVersion');
    let secondVersion      = get(this, 'secondVersion');
    if (!module || !firstVersion || !secondVersion) {
      return parentDependencies;
    }

    let childDependencies = parentDependencies.slice();

    childDependencies.pushObject({
      module,
      firstVersion,
      secondVersion
    });

    return childDependencies;
  }),

  hasFirstCircularReferenceFromParent: false,
  hasSecondCircularReferenceFromParent: false,

  _hasCircularReference(circularReferenceFromParentProp, versionProp) {
    if (get(this, circularReferenceFromParentProp)) {
      return true;
    }

    let module       = get(this, 'module');
    let version = get(this, versionProp);
    if (!module || !version) {
      return false;
    }

    let parentDependencies = get(this, 'parentDependencies');

    let hasCircularReference = parentDependencies.filter(dep => {
      return dep.module       === module &&
             dep[versionProp] === version;
    }).length;

    if (hasCircularReference) {
      this.sendAction('doneCrawling');
    }

    return hasCircularReference;
  },

  hasFirstCircularReference: computed('hasFirstCircularReferenceFromParent', 'parentDependencies.length', 'module', 'firstVersion', function() {
    let hasFirstCircularReference = this._hasCircularReference('hasFirstCircularReferenceFromParent', 'firstVersion');

    return hasFirstCircularReference;
  }),

  hasSecondCircularReference: computed('hasSecondCircularReferenceFromParent', 'parentDependencies.length', 'module', 'secondVersion', function() {
    let hasSecondCircularReference = this._hasCircularReference('hasSecondCircularReferenceFromParent', 'secondVersion');

    return hasSecondCircularReference;
  }),

  hasBothCircularReference: and('hasFirstCircularReference', 'hasSecondCircularReference'),

  isFirstVersionHintMissing:  not('firstVersionHint'),
  isSecondVersionHintMissing: not('secondVersionHint'),
  isOneMissing: or('isFirstVersionHintMissing', 'isSecondVersionHintMissing'),
  areVersionHintsDifferent: computed('firstVersionHint', 'secondVersionHint', function() {
    let firstVersionHint  = get(this, 'firstVersionHint'),
        secondVersionHint = get(this, 'secondVersionHint');
    return firstVersionHint && secondVersionHint && firstVersionHint !== secondVersionHint;
  }),

  _areVersionsSame: not('areVersionsDifferent'),
  shouldHideRow: and('shouldOnlyShowDifferent', '_areVersionsSame'),
  versions: promiseArray('module', 'hasFirstCircularReferenceFromParent', 'stopCrawling', function() {
    let module       = get(this, 'module');
    let stopCrawling = get(this, 'stopCrawling');
    if (!module || stopCrawling) {
      return Ember.RSVP.resolve([]);
    }

    return get(this, 'getVersionsTask').perform(module);
  }),

  getVersionsTask: task(function * (path) {
    try {
      let versions = yield get(this, 'task.getVersions').perform(path);

      return versions;
    } catch (error) {
      set(this, 'error', `Error retrieving module from npm: ${error}`);

      return [];
    }
  }),

  firstVersion: computed('firstVersionHint', 'versions.length', 'repoWorkingDate', function() {
    let firstVersionHint = get(this, 'firstVersionHint');
    let repoWorkingDate  = get(this, 'repoWorkingDate');

    let realVersion = this._getRealVersion(
      firstVersionHint,
      repoWorkingDate
    );

    return realVersion;
  }),
  secondVersion: computed('secondVersionHint', 'versions.length', 'repoBrokenDate', function() {
    let secondVersionHint = get(this, 'secondVersionHint');
    let repoBrokenDate    = get(this, 'repoBrokenDate');

    let realVersion = this._getRealVersion(
      secondVersionHint,
      repoBrokenDate
    );

    return realVersion;
  }),
  _getRealVersion(
    versionHint,
    repoDate
  ) {
    let versions = get(this, 'versions');
    if (get(versions, 'isPending')) {
      return;
    }

    let realVersion = getRealVersion(
      versionHint,
      versions,
      repoDate
    );

    return realVersion;
  },

  areVersionsDifferent: computed('firstVersion', 'secondVersion', function() {
    let firstVersion  = get(this, 'firstVersion'),
        secondVersion = get(this, 'secondVersion');
    if (!firstVersion || !secondVersion) {
      return false;
    }

    return firstVersion !== secondVersion;
  }),

  firstDependencies: computed('module', 'firstVersion', 'hasFirstCircularReference', 'stopCrawling', function() {
    return get(this, 'getDependenciesTask').perform('firstVersion', 'hasFirstCircularReference');
  }),
  secondDependencies: computed('module', 'secondVersion', 'hasSecondCircularReference', 'stopCrawling', function() {
    return get(this, 'getDependenciesTask').perform('secondVersion', 'hasSecondCircularReference');
  }),
  getDependenciesTask: task(function * (versionProp, circularReferenceProp) {
    let module               = get(this, 'module');
    let version              = get(this, versionProp);
    let hasCircularReference = get(this, circularReferenceProp);
    let stopCrawling         = get(this, 'stopCrawling');
    if (!module || !version || hasCircularReference || stopCrawling) {
      return;
    }

    try {
      let dependencies = yield get(this, 'task.getDependencies').perform(module, version);

      return dependencies;
    } catch (e) {
      set(this, 'nestedError', e);
    }
  }),

  dependenciesPromise: promiseAll('firstDependencies', 'secondDependencies'),

  nestedDependencies: promiseArray('dependenciesPromise', function() {
    return get(this, 'dependenciesPromise').then(([
      firstDependencies,
      secondDependencies
    ]) => {
      if (!firstDependencies || !secondDependencies) {
        return [];
      }

      let dependencies = mergeModules(
        firstDependencies,
        secondDependencies
      );

      if (!dependencies.length) {
        this.sendAction('doneCrawling');
      } else {
        this.incrementProperty('_numberOfAwaitingRequests', dependencies.length);
      }

      return dependencies;
    }).catch(() => {
      // canceled task(s)
      return [];
    });
  }),

  actions: {
    doneCrawling() {
      if (this.decrementProperty('_numberOfAwaitingRequests') === 0) {
        this.sendAction('doneCrawling');
      }
    }
  }
});
