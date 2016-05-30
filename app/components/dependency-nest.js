import Ember from 'ember';
import { task } from 'ember-concurrency';
import sum from 'ember-cpm/macros/sum';
import promiseAll from 'ember-awesome-macros/promise-all';
import promiseArray from 'ember-awesome-macros/promise-array';
// import normalizeDependencies from '../utils/normalize-dependencies';
import mergeModules from '../utils/merge-modules';

const {
  Component,
  get,
  computed,
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: '',

  // semaphore:    service(),
  // requestCache: service(),
  task: service(),

  nestingLevel: sum('incomingNestingLevel', 1),

  _numberOfAwaitingRequests: 0,

  firstDependencies: computed('module', 'firstVersion', 'stopCrawling', function() {
    // return this._getDependencies('firstVersion');
    return this._getDependencies('firstVersion');
  }),
  secondDependencies: computed('module', 'secondVersion', 'stopCrawling', function() {
    // return this._getDependencies('secondVersion');
    return this._getDependencies('secondVersion');
  }),
  _getDependencies(versionProp) {
    return get(this, 'getDependenciesTask').perform(versionProp).catch(() => {
      // task was canceled
      return [];
    });
  },
  getDependenciesTask: task(function * (versionProp) {
    let module  = this.get('module');
    let version = this.get(versionProp);
    if (!module || !version || this.get('stopCrawling')) {
      return;
    }

    // this.incrementProperty('_numberOfAwaitingRequests');

    try {
      let dependencies = yield get(this, 'task.getDependencies').perform(module, version);

      // if (this.decrementProperty('_numberOfAwaitingRequests') === 0) {
        // this.sendAction('doneCrawling');
      // }

      return dependencies;
    } catch (e) {
      this.set('error', e);
    }
  }),
  // _getDependencies(versionProp) {
  //   return new Promise(resolve => {
  //     let semaphore = this.get('semaphore.moduleSemaphore');
  //     semaphore.take(() => {
  //       let module  = this.get('module');
  //       let version = this.get(versionProp);
  //       if (!module || !version || this.get('stopCrawling')) {
  //         resolve([]);
  //         return semaphore.leave();
  //       }
  //
  //       this.incrementProperty('numberOfAwaitingRequests');
  //
  //       let haveLeft;
  //       let path = `npm/${module}@${version}/dependencies`;
  //       this.get('requestCache').cacheRequest(path).then(data => {
  //         semaphore.leave();
  //         haveLeft = true;
  //         data = normalizeDependencies(data);
  //         // if (!this.get('isDestroying') && !this.get('isDestroyed')) {
  //           if (this.decrementProperty('numberOfAwaitingRequests') === 0) {
  //             this.sendAction('doneCrawling');
  //           }
  //         // }
  //         resolve(data);
  //       }).catch((jqXHR, textStatus, errorThrown) => {
  //         if (!haveLeft) {
  //           semaphore.leave();
  //         }
  //         // if (!this.get('isDestroying') && !this.get('isDestroyed')) {
  //           this.set('error', errorThrown);
  //         // }
  //         resolve([]);
  //       });
  //     });
  //   });
  // },

  dependenciesPromise: promiseAll('firstDependencies', 'secondDependencies'),

  dependencies: promiseArray('dependenciesPromise', function() {
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
