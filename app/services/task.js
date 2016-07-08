import Ember from 'ember';
import { task } from 'ember-concurrency';
import pairs from 'lodash/object/pairs';
import normalizeDependencies from '../utils/normalize-dependencies';

const {
  Service,
  inject: { service },
  get
} = Ember;

export default Service.extend({
  requestCache: service(),

  getVersions: task(function * (module) {
    let path = `npm/${module}/versions`;

    let { responseBody } = yield get(this, 'requestCache.cacheRequest').perform(path);

    let versions = pairs(responseBody);

    return versions;
  }),

  getDependencies: task(function * (module, version) {
    let path = `npm/${module}@${version}/dependencies`;

    let { responseBody } = yield get(this, 'requestCache.cacheRequest').perform(path);

    let dependencies = normalizeDependencies(responseBody);

    return dependencies;
  })
});
