import Ember from 'ember';
import { task } from 'ember-concurrency';
import getResponseHeaders from '../utils/get-response-headers';

const {
  Service,
  get,
  computed: { readOnly },
  RSVP: { Promise },
  inject: { service },
  run
} = Ember;

export default Service.extend({
  config: service(),
  cache: service(),
  semaphore: service(),
  limiter: service(),
  adapter: service(),
  ajax: service(),

  mySemaphore: readOnly('semaphore.requestCacheSemaphore'),
  cacheTime: readOnly('config.cacheTime'),

  cacheRequestAjax: task(function * (url, ajax) {
    let cache = get(this, 'cache');

    // don't bother waiting for anything
    // if the cache has a value
    let data = cache.get(url);
    if (data) {
      return yield Promise.resolve(data);
    }

    return yield get(this, 'limiter.removeTokens').perform(1, () => {
      // while you were waiting in the limiter
      // the data could have since been cached
      // so check again
      data = cache.get(url);
      if (data) {
        return data;
      }

      return get(this, '_cacheRequestAjax').perform(url, ajax);
    });
  }),
  _cacheRequestAjax: task(function * (url, ajax) {
    let cache = get(this, 'cache');

    // while you were waiting in the task queue
    // the data could have since been cached
    // so check again
    let data = cache.get(url);
    if (data) {
      return yield Promise.resolve(data);
    }

    ajax = ajax || get(this, 'ajax');
    return yield ajax.raw(url).then(({ jqXHR, response }) => {
      let responseHeaders = getResponseHeaders(jqXHR);
      let data = {
        responseHeaders,
        response
      };
      return cache.put(url, data, get(this, 'cacheTime'));
    });
  }).enqueue(),

  cacheRequest2: task(function * (url) {
    let cache = get(this, 'cache');
    let data = cache.get(url);
    if (data) {
      return yield Promise.resolve(data);
    }

    return yield get(this, 'limiter.removeTokens').perform(1, () => {
      data = cache.get(url);
      if (data) {
        return data;
      }

      return get(this, '_cacheRequest2').perform(url);
    });
  }),
  _cacheRequest2: task(function * (url) {
    let cache = get(this, 'cache');
    let data = cache.get(url);
    if (data) {
      return yield Promise.resolve(data);
    }

    return yield get(this, 'adapter').ajax(url).then(response => {
      return cache.put(url, response, get(this, 'cacheTime'));
    });
  }).enqueue(),

  cacheRequest(url) {
    return new Promise((resolve, reject) => {
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

          return run(() => {
            resolve(data);
          });
        }

        run(() => {
          get(this, 'limiter.removeTokens').perform(1, () => {
            let promise = get(this, 'adapter').ajax(url).then(response => {
              return cache.put(url, response, get(this, 'cacheTime'));
            }).finally(() => {
              semaphore.leave();
            });

            return promise.then(resolve).catch(reject);
          });
        });
      });
    });
  }
});
