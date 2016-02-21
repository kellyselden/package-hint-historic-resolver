import Ember from 'ember';
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

  cacheTime: readOnly('config.limiterTime'),

  removeTokens() {
    if (!limiter) {
      limiter = new RateLimiter(1, get(this, 'limiterTime'));
    }

    return limiter.removeTokens(...arguments);
  },

  reset() {
    limiter = null;
  }
});
