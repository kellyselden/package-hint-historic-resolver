import Ember from 'ember';
import { task } from 'ember-concurrency';
import moment from 'moment';

const {
  Service,
  inject: { service },
  get
} = Ember;

export default Service.extend({
  requestCache: service(),
  githubAjax: service(),

  getCommit: task(function * (repo, date) {
    let until = moment(date).toJSON();
    let url = `repos/${repo}/commits?until=${until}`;
    let ajax = get(this, 'githubAjax');
    let response = yield get(this, 'requestCache.cacheRequest').perform(url, ajax);

    return response;
  }),

  getPackage: task(function * (repo, commit) {
    let url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;
    let { responseBody } = yield get(this, 'requestCache.cacheRequest').perform(url);

    return responseBody;
  })
});
