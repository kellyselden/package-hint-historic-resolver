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
  limiter:      service(),
  requestCache: service(),

  getVersions: task(function * (module) {
    let path = `npm/${module}/versions`;

    let data = yield this._limitRequest(path);

    let versions = pairs(data);

    return versions;
  }).enqueue(),

  getDependencies: task(function * (module, version) {
    let path = `npm/${module}@${version}/dependencies`;

    let data = yield this._limitRequest(path);

    let dependencies = normalizeDependencies(data);

    return dependencies;
  }).enqueue(),

  _limitRequest(path) {
    return get(this, 'limiter.removeTokens').perform(1, () => {
      return get(this, 'requestCache').cacheRequestRaw(path);
    });
  }
});
