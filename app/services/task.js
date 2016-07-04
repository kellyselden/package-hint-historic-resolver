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

    let data = yield get(this, 'requestCache.cacheRequest2').perform(path);

    let versions = pairs(data);

    return versions;
  }),

  getDependencies: task(function * (module, version) {
    let path = `npm/${module}@${version}/dependencies`;

    let data = yield get(this, 'requestCache.cacheRequest2').perform(path);

    let dependencies = normalizeDependencies(data);

    return dependencies;
  })
});
