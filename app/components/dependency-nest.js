import Ember from 'ember';
import { task } from 'ember-concurrency';
import sum from 'ember-cpm/macros/sum';
import promiseAll from 'ember-awesome-macros/promise-all';
import promiseArray from 'ember-awesome-macros/promise-array';
import mergeModules from '../utils/merge-modules';

const {
  Component,
  get, set,
  computed,
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: '',

  task: service(),

  nestingLevel: sum('incomingNestingLevel', 1),

  _numberOfAwaitingRequests: 0,

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
      set(this, 'error', e);
    }
  }),

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
