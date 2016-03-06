import Ember from 'ember';
import semver from 'npm:semver';
import pairs from 'lodash/object/pairs';

const {
  Component,
  get, set,
  on, observer, computed,
  computed: { not, readOnly, or, and },
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: '',

  semaphore:    service(),
  requestCache: service(),

  module:            readOnly('dep.module'),
  firstVersionHint:  readOnly('dep.firstVersionHint'),
  secondVersionHint: readOnly('dep.secondVersionHint'),

  // nestingLevel: 0,

  numberOfAwaitingRequests: 0,

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

  getVersions: on('init', observer('module', 'stopCrawling', function() {
    let semaphore = get(this, 'semaphore.noNameYetSemaphore');
    semaphore.take(() => {
      let module = get(this, 'module');
      if (!module || get(this, 'stopCrawling') || get(this, 'versions')) {
        return semaphore.leave();
      }

      this.incrementProperty('numberOfAwaitingRequests');

      let haveLeft;
      let path = `npm/${module}/versions`;
      return get(this, 'requestCache').cacheRequest(path).then(data => {
        semaphore.leave();
        haveLeft = true;
        if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
          set(this, 'versions', pairs(data));
          if (this.decrementProperty('numberOfAwaitingRequests') === 0) {
            this.sendAction('doneCrawling', get(this, 'dep'));
          }
        }
      }).catch(error => {
        if (!haveLeft) {
          semaphore.leave();
        }
        if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
          set(this, 'error', error);
        }
      });
    });
  })),

  firstVersion: computed('firstVersionHint', 'versions.length', 'repoWorkingDate', function() {
    return getRealVersion(
      get(this, 'firstVersionHint'),
      get(this, 'versions'),
      get(this, 'repoWorkingDate')
    );
  }),
  secondVersion: computed('secondVersionHint', 'versions.length', 'repoBrokenDate', function() {
    return getRealVersion(
      get(this, 'secondVersionHint'),
      get(this, 'versions'),
      get(this, 'repoBrokenDate')
    );
  }),

  areVersionsDifferent: computed('firstVersion', 'secondVersion', function() {
    let firstVersion  = get(this, 'firstVersion'),
        secondVersion = get(this, 'secondVersion');
    if (!firstVersion || !secondVersion) {
      return false;
    }

    return firstVersion !== secondVersion;
  }),

  actions: {
    // doneCrawling() {
    //   if (this.decrementProperty('numberOfAwaitingRequests') === 0) {
    //     this.sendAction('doneCrawling', get(this, 'dep'));
    //   }
    // }
  }
});

function getRealVersion(version, versions, dateCeiling) {
  if (!versions) {
    return;
  }

  versions = versions.filter(([version, date]) => {
    return semver.valid(version) && new Date(date) <= dateCeiling;
  }).map(([version]) => version);

  return semver.maxSatisfying(versions, version);
}
