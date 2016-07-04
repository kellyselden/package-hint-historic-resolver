import Ember from 'ember';
import { task } from 'ember-concurrency';
import getResponseHeaders from '../utils/get-response-headers';

const {
  Service,
  get,
  computed: { readOnly },
  inject: { service }
} = Ember;

export default Service.extend({
  config: service(),
  cache: service(),
  limiter: service(),
  adapter: service(),
  ajax: service(),

  cacheTime: readOnly('config.cacheTime'),

  cacheRequestAjax: task(function * (url, ajax) {
    let cache = get(this, 'cache');

    // don't bother waiting for anything
    // if the cache has a value
    let data = cache.get(url);
    if (data) {
      return data;
    }

    return yield get(this, 'limiter.removeTokens').perform(1).then(() => {
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
      return data;
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

  cacheRequest: task(function * (url) {
    let cache = get(this, 'cache');

    // don't bother waiting for anything
    // if the cache has a value
    let data = cache.get(url);
    if (data) {
      return data;
    }

    return yield get(this, 'limiter.removeTokens').perform(1).then(() => {
      // while you were waiting in the limiter
      // the data could have since been cached
      // so check again
      data = cache.get(url);
      if (data) {
        return data;
      }

      return get(this, '_cacheRequest').perform(url);
    });
  }),
  _cacheRequest: task(function * (url) {
    let cache = get(this, 'cache');

    // while you were waiting in the task queue
    // the data could have since been cached
    // so check again
    let data = cache.get(url);
    if (data) {
      return data;
    }

    return yield get(this, 'adapter').ajax(url).then(response => {
      return cache.put(url, response, get(this, 'cacheTime'));
    });
  }).enqueue()
});
