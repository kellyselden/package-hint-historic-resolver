import Ember from 'ember';
import { task } from 'ember-concurrency';
import moment from 'moment';
import pairs from 'lodash/object/pairs';
import normalizeDependencies from '../utils/normalize-dependencies';

const {
  Service,
  inject: { service },
  get
} = Ember;

export default Service.extend({
  requestCache: service(),
  githubAjax: service(),

  getCommit: task(function * (repo, date) {
    let task = get(this, 'requestCache.cacheRequest');
    let until = moment(date).toJSON();
    let url = `repos/${repo}/commits?until=${until}`;
    let ajax = get(this, 'githubAjax');

    let response = yield task.perform(url, ajax);

    return response;
  }),

  getPackage: task(function * (repo, commit) {
    let task = get(this, 'requestCache.cacheRequest');
    let url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;

    let { responseBody } = yield task.perform(url);

    return responseBody;
  }),

  getVersions: task(function * (module) {
    let task = get(this, 'requestCache.cacheRequest');
    let url = `npm/${module}/versions`;

    let { responseBody } = yield task.perform(url);

    let versions = pairs(responseBody);

    return versions;
  }),

  getDependencies: task(function * (module, version) {
    let task = get(this, 'requestCache.cacheRequest');
    let url = `npm/${module}@${version}/dependencies`;

    let { responseBody } = yield task.perform(url);

    let dependencies = normalizeDependencies(responseBody);

    return dependencies;
  })
});
