import Ember from 'ember';
import { task } from 'ember-concurrency';
import nodeRateLimiter from 'npm:limiter';
import config from '../config/environment';

const {
  Service,
  RSVP: { Promise },
  get,
  computed: { readOnly },
  inject: { service },
  run,
  run: { later, cancel }
} = Ember;
const { RateLimiter } = nodeRateLimiter;
const isTestEnvironment = config.environment === 'test';

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

  removeTokensTask: task(function * (count, callback) {
    return yield new Promise((resolve, reject) => {
      if (!limiter) {
        limiter = new RateLimiter(1, get(this, 'limiterTime'));
      }

      let timer, createDummyTimer, assignDummyTimer;
      if (isTestEnvironment) {
        createDummyTimer = () => {
          return later(assignDummyTimer);
        };

        assignDummyTimer = () => {
          timer = createDummyTimer();
        };

        assignDummyTimer();
      }

      return limiter.removeTokens(count, function() {
        if (isTestEnvironment) {
          cancel(timer);
        }

        run(() => {
          callback(arguments).then(resolve).catch(reject);
        });
      });
    });
  }),

  reset() {
    limiter = null;
  }
});
