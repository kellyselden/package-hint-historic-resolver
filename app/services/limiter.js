import { Promise } from 'rsvp';
import { set, get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { cancel, later, run } from '@ember/runloop';
import { task } from 'ember-concurrency';
import nodeRateLimiter from 'npm:limiter';
import config from '../config/environment';

const { RateLimiter } = nodeRateLimiter;
const isTestEnvironment = config.environment === 'test';

export default Service.extend({
  config: service(),

  _limiterTime: readOnly('config.limiterTime'),

  removeTokens: task(function * (count) {
    return yield new Promise(resolve => {
      let limiter = get(this, '_limiter');
      if (!limiter) {
        limiter = new RateLimiter(1, get(this, '_limiterTime'));

        set(this, '_limiter', limiter);
      }

      // we need a run loop open during testing for the wait helper to work
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

        run(resolve);
      });
    });
  })
});
