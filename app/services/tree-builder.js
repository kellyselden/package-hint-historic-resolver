import Ember from 'ember';
import { task } from 'ember-concurrency';
import moment from 'moment';

const {
  Service,
  inject: { service },
  get
} = Ember;

export default Service.extend({
  ajax: service(),

  getCommit: task(function * (repo, date) {
    let until = moment(date).toJSON();
    let url = `https://api.github.com/repos/${repo}/commits?until=${until}`;
    let [latestCommit] = yield get(this, 'ajax').request(url);

    return latestCommit;
  }),

  getPackage: task(function * (repo, commit) {
    let url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;
    let data = yield get(this, 'ajax').request(url);

    return data;
  })
});
