import Ember from 'ember';
import nodeRateLimiter from 'npm:limiter';

const {
  Service
} = Ember;
const { RateLimiter } = nodeRateLimiter;
const limiter = new RateLimiter(1, 50);

export default Service.extend({
  removeTokens() {
    return limiter.removeTokens(...arguments);
  }
});
