import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import nodeRateLimiter from 'npm:limiter';

const {
  Service,
  get,
  computed: { readOnly },
  inject: { service }
} = Ember;
const { RateLimiter } = nodeRateLimiter;

let limiter;

export default Service.extend({
  config: service(),

  limiterTime: readOnly('config.limiterTime'),

  removeTokens() {
    if (!limiter) {
      limiter = new RateLimiter(1, get(this, 'limiterTime'));
    }

    return limiter.removeTokens(...arguments);
  },

  run: task(function * (fn) {
    let result = yield fn();
    yield timeout(get(this, 'limiterTime'));
    return result;
  }).maxConcurrency(1).enqueue(),

  reset() {
    limiter = null;
  }
});
