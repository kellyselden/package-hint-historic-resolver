import Ember from 'ember';
import pairs from 'lodash/object/pairs';
import cacheRequst from '../utils/cache-request';

const {
  on,
  observer,
  computed,
  computed: { not, readOnly },
  inject: { service }
} = Ember;

export default Ember.Component.extend({
  tagName: '',

  apiSemaphore: service(),

  module:            readOnly('dep.module'),
  firstVersionHint:  readOnly('dep.firstVersionHint'),
  secondVersionHint: readOnly('dep.secondVersionHint'),

  nestingLevel: 0,

  numberOfAwaitingRequests: 0,

  isFirstVersionHintMissing: not('firstVersionHint'),
  isSecondVersionHintMissing: not('secondVersionHint'),
  isOneMissing: computed('firstVersionHint', 'secondVersionHint', function() {
    return !this.get('firstVersionHint') || !this.get('secondVersionHint');
  }),
  areVersionHintsDifferent: computed('firstVersionHint', 'secondVersionHint', function() {
    let firstVersionHint  = this.get('firstVersionHint'),
        secondVersionHint = this.get('secondVersionHint');
    return firstVersionHint && secondVersionHint && firstVersionHint !== secondVersionHint;
  }),

  shouldHideRow: computed('shouldOnlyShowDifferent', 'areVersionsDifferent', function() {
    return this.get('shouldOnlyShowDifferent') && !this.get('areVersionsDifferent');
  }),

  getVersions: on('init', observer('module', 'stopCrawling', function() {
    let sem = this.get('apiSemaphore.sem');
    sem.take(() => {
      let module = this.get('module');
      if (!module || this.get('stopCrawling') || this.get('versions')) {
        return sem.leave();
      }

      this.incrementProperty('numberOfAwaitingRequests');

      let haveLeft;
      return cacheRequst(`npm/${module}/versions`).then(data => {
        sem.leave();
        haveLeft = true;
        Ember.run(() => {
          if (!this.get('isDestroying') && !this.get('isDestroyed')) {
            this.set('versions', pairs(data));
            if (this.decrementProperty('numberOfAwaitingRequests') === 0) {
              this.sendAction('doneCrawling', this.get('dep'));
            }
          }
        });
      }).catch((jqXHR, textStatus, errorThrown) => {
        if (!haveLeft) {
          sem.leave();
        }
        Ember.run(() => {
          if (!this.get('isDestroying') && !this.get('isDestroyed')) {
            this.set('error', errorThrown);
          }
        });
      });
    });
  })),

  firstVersion: computed('firstVersionHint', 'versions.length', 'repoWorkingDate', function() {
    return getRealVersion(
      this.get('firstVersionHint'),
      this.get('versions'),
      this.get('repoWorkingDate')
    );
  }),
  secondVersion: computed('secondVersionHint', 'versions.length', 'repoBrokenDate', function() {
    return getRealVersion(
      this.get('secondVersionHint'),
      this.get('versions'),
      this.get('repoBrokenDate')
    );
  }),

  areVersionsDifferent: computed('firstVersion', 'secondVersion', function() {
    let firstVersion  = this.get('firstVersion'),
        secondVersion = this.get('secondVersion');
    if (!firstVersion || !secondVersion) {
      return false;
    }

    return firstVersion !== secondVersion;
  }),

  actions: {
    // doneCrawling() {
    //   if (this.decrementProperty('numberOfAwaitingRequests') === 0) {
    //     this.sendAction('doneCrawling', this.get('dep'));
    //   }
    // }
  }
});

function getRealVersion(version, versions, dateCeiling) {
  if (!versions) {
    return;
  }

  versions = versions.filter(pair => {
    let [version, date] = pair;
    return semver.valid(version) && new Date(date) <= dateCeiling;
  }).map(([version]) => version);

  return semver.maxSatisfying(versions, version);
}
