import Ember from 'ember';

const {
  Service,
  get,
  computed: { readOnly },
  RSVP: { Promise },
  inject: { service }
} = Ember;

export default Service.extend({
  config: service(),
  cache: service(),
  semaphore: service(),
  limiter: service(),
  adapter: service(),

  mySemaphore: readOnly('semaphore.requestCacheSemaphore'),
  cacheTime: readOnly('config.cacheTime'),

  cacheRequest(url) {
    return new Promise(resolve => {
      let cache = get(this, 'cache');

      // don't bother waiting for the semaphore
      // if the cache has a value
      let data = cache.get(url);
      if (data) {
        return resolve(data);
      }

      let semaphore = get(this, 'mySemaphore');

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
            return cache.put(url, response, get(this, 'cacheTime'));
          }).finally(() => {
            semaphore.leave();
          });

          resolve(promise);
        });
      });
    });
  },
  cacheRequestLimiter(url) {
    return new Promise(resolve => {
      let cache = get(this, 'cache');
      let data = cache.get(url);
      if (data) {
        return resolve(data);
      }

      get(this, 'limiter').removeTokens(1, () => {
        get(this, 'adapter').ajax(url).then(response => {
          let data = cache.put(url, response, get(this, 'cacheTime'));

          resolve(data);
        });
      });
    });
  },
  cacheRequestRaw(url) {
    let cache = get(this, 'cache');
    let data = cache.get(url);
    if (data) {
      return Promise.resolve(data);
    }

    return get(this, 'adapter').ajax(url).then(response => {
      return cache.put(url, response, get(this, 'cacheTime'));
    });
  }
});
