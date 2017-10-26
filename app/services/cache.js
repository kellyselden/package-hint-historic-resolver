import Service from '@ember/service';
import cache from 'npm:memory-cache';

export default Service.extend({
  get() {
    return cache.get(...arguments);
  },
  put() {
    return cache.put(...arguments);
  }
});
