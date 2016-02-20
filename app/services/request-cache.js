import Ember from 'ember';

const {
  Service,
  get,
  RSVP: { Promise },
  inject: { service }
} = Ember;

export default Service.extend({
  config: service(),
  cache: service(),
  semaphore: service(),
  limiter: service(),
  adapter: service(),

  cacheRequest(url) {
    return new Promise(resolve => {
      let cache = get(this, 'cache');

      // don't bother waiting for the semaphore
      // if the cache has a value
      let data = cache.get(url);
      if (data) {
        return resolve(data);
      }

      let semaphore = get(this, 'semaphore.requestCacheSemaphore');

      semaphore.take(() => {
        // while you were waiting on the semaphore
        // the data could have since been cached
        // so check again
        let data = cache.get(url);
        if (data) {
          semaphore.leave();

          return resolve(data);
        }

        get(this, 'limiter').removeTokens(1, () => {
          let promise = get(this, 'adapter').ajax(url).then(response => {
            let { cacheTime } = get(this, 'config');
            return cache.put(url, response, cacheTime);
          }).finally(() => {
            semaphore.leave();
          });

          resolve(promise);
        });
      });
    });
  }
});
