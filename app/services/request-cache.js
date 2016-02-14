import Ember from 'ember';
import values from 'lodash/object/values';

const {
  Service,
  run,
  RSVP: { Promise },
  inject: { service }
} = Ember;

export default Service.extend({
  config: service(),
  cache: service(),
  semaphore: service(),
  limiter: service(),
  requestSender: service(),

  cacheRequest(url) {
    return new Promise((resolve, reject) => {
      let cache = this.get('cache');

      let data = cache.get(url);
      if (data) {
        return resolve(data);
      }

      let { cacheTime } = this.get('config');
      let semaphore = this.get('semaphore.requestCacheSemaphore');

      semaphore.take(() => {
        this.get('limiter').removeTokens(1, () => {
          semaphore.leave();

          this.get('requestSender').sendRequest(url).then(data => {
            run(null, resolve, cache.put(url, data, cacheTime));
          }).catch(function() {
            run(null, reject, values(arguments));
          });
        });
      });
    });
  }
});
