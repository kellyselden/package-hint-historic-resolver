import Ember from 'ember';
import cache from 'npm:memory-cache';

const {
  Service
} = Ember;

export default Service.extend({
  get() {
    return cache.get(...arguments);
  },
  put() {
    return cache.put(...arguments);
  }
});
