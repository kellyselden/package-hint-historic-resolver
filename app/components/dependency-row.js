import Ember from 'ember';
import { task } from 'ember-concurrency';
import promiseArray from 'ember-awesome-macros/promise-array';
import getRealVersion from '../utils/get-real-version';
// import pairs from 'lodash/object/pairs';

const {
  Component,
  get, set,
  computed,
  computed: { not, readOnly, or, and },
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: '',

  // semaphore:    service(),
  // requestCache: service(),
  task: service(),

  module:            readOnly('dependency.module'),
  firstVersionHint:  readOnly('dependency.firstVersionHint'),
  secondVersionHint: readOnly('dependency.secondVersionHint'),

  nestingLevel: 0,

  // _numberOfAwaitingRequests: 0,

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
  versions: promiseArray('module', 'stopCrawling', function() {
    let module = get(this, 'module');
    if (!module || get(this, 'stopCrawling')) {
      return Ember.RSVP.resolve([]);
    }

    // let semaphore = get(this, 'semaphore.moduleSemaphore');
    // semaphore.take(() => {
    //   if (get(this, 'versions')) {
    //     return semaphore.leave();
    //   }
    //
    // this.incrementProperty('_numberOfAwaitingRequests');

    return get(this, 'getVersionsTask').perform(module);
    // return get(this, 'requestCache').cacheRequest(path).then(data => {
    //   // if (this.decrementProperty('_numberOfAwaitingRequests') === 0) {
    //     this.sendAction('doneCrawling', get(this, 'dependency'));
    //   // }
    //
    //   return pairs(data);
    // }).catch(error => {
    //   set(this, 'error', `Error retrieving module from npm: ${error}`);
    // // }).finally(() => {
    // //   semaphore.leave();
    // });
  }),

  getVersionsTask: task(function * (path) {
    try {
      let versions = yield get(this, 'task.getVersions').perform(path);

      // if (this.decrementProperty('_numberOfAwaitingRequests') === 0) {
        // this.sendAction('doneCrawling', get(this, 'dependency'));
      // }

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

  actions: {
    doneCrawling() {
      // if (this.decrementProperty('_numberOfAwaitingRequests') === 0) {
        this.sendAction('doneCrawling', get(this, 'dependency'));
      // }
    }
  }
});
