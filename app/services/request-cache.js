import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import parseResponseHeaders from '../utils/parse-response-headers';

export default Service.extend({
  config: service(),
  cache: service(),
  limiter: service(),
  adapter: service(),
  defaultAjax: service(),

  cacheTime: readOnly('config.cacheTime'),

  cacheRequest: task(function * (url, ajax) {
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

      return get(this, '_cacheRequest').perform(url, ajax);
    });
  }),
  _cacheRequest: task(function * (url, ajax) {
    let cache = get(this, 'cache');

    // while you were waiting in the task queue
    // the data could have since been cached
    // so check again
    let data = cache.get(url);
    if (data) {
      return data;
    }

    ajax = ajax || get(this, 'defaultAjax');
    return yield ajax.raw(url).then(({ jqXHR, response }) => {
      let responseHeaders = jqXHR.getAllResponseHeaders();
      responseHeaders = parseResponseHeaders(responseHeaders);
      let data = {
        responseHeaders,
        responseBody: response
      };
      return cache.put(url, data, get(this, 'cacheTime'));
    });
  }).enqueue()
});
