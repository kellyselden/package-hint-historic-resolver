import Ember from 'ember';
import computed from 'ember-computed-decorators';
import { gt } from 'ember-awesome-macros';
import { task } from 'ember-concurrency';
import config from '../config/environment';
import getRepo from '../utils/get-repo';

const {
  Controller,
  inject: { service },
  get, set, setProperties
} = Ember;

const {
  repository
} = config.APP;

export default Controller.extend({
  session: service(),
  task: service(),

  repository,

  queryParams: {
    repoUrl: 'repoUrl',
    repoWorkingDateSerialized: 'repoWorkingDate',
    repoBrokenDateSerialized: 'repoBrokenDate',
    shouldOnlyShowDifferent: 'shouldOnlyShowDifferent'
  },

  shouldOnlyShowDifferent: false,

  firstJson: {},
  secondJson: {},

  @computed('repoWorkingDateSerialized')
  repoWorkingDate(repoWorkingDateSerialized) {
    return deserializeDate(repoWorkingDateSerialized);
  },
  @computed('repoBrokenDateSerialized')
  repoBrokenDate(repoBrokenDateSerialized) {
    return deserializeDate(repoBrokenDateSerialized);
  },

  @computed('repoUrl')
  repo(repoUrl) {
    let repo = getRepo(repoUrl);
    return repo;
  },

  areDatesOutOfOrder: gt('repoWorkingDate', 'repoBrokenDate'),

  rebuild() {
    this._rebuildWorking();
    this._rebuildBroken();
  },
  _rebuildWorking() {
    let rebuild = get(this, '_rebuild');
    rebuild.perform(
      'repoWorkingDate',
      'firstCommit',
      'firstCommitError',
      'firstCommitDate',
      'repoWorkingDateError',
      'firstJson'
    );
  },
  _rebuildBroken() {
    let rebuild = get(this, '_rebuild');
    rebuild.perform(
      'repoBrokenDate',
      'secondCommit',
      'secondCommitError',
      'secondCommitDate',
      'repoBrokenDateError',
      'secondJson'
    );
  },
  _rebuild: task(function * (
    repoDateProp,
    commitProp,
    commitErrorProp,
    commitDateProp,
    packageErrorProp,
    jsonProp
  ) {
    let repo = get(this, 'repo');
    if (!repo) {
      return;
    }

    let areDatesOutOfOrder = get(this, 'areDatesOutOfOrder');
    if (areDatesOutOfOrder) {
      return;
    }

    let task = get(this, 'task');
    let repoDate = get(this, repoDateProp);

    let properties = {};
    properties[commitErrorProp] = undefined;
    properties[packageErrorProp] = undefined;
    setProperties(this, properties);

    let getCommit = get(task, 'getCommit');
    let response;
    try {
      response = yield getCommit.perform(repo, repoDate);
    } catch (error) {
      set(this, commitErrorProp, error);

      return;
    }

    let { responseHeaders, responseBody } = response;

    let [latestCommit] = responseBody;
    let { sha, commit } = latestCommit;

    properties = {};
    properties['githubRateLimit'] = responseHeaders['X-RateLimit-Limit'];
    properties['githubRateRemaining'] = responseHeaders['X-RateLimit-Remaining'];
    properties['githubRateReset'] = parseInt(responseHeaders['X-RateLimit-Reset']) * 1000;
    properties[commitProp] = sha;
    properties[commitDateProp] = commit.author.date;
    setProperties(this, properties);

    let getPackage = get(task, 'getPackage');
    let data;
    try {
      data = yield getPackage.perform(repo, sha);
    } catch (error) {
      set(this, packageErrorProp, error);

      return;
    }

    set(this, jsonProp, data);
  }),

  actions: {
    logIn() {
      get(this, 'session').authenticate('authenticator:torii', 'github');
    },
    logOut() {
      get(this, 'session').invalidate();
    },
    updateRepoUrl(url) {
      let oldUrl = get(this, 'repoUrl');
      if (url !== oldUrl) {
        set(this, 'repoUrl', url || undefined);

        this.rebuild();
      }
    },
    updateRepoWorkingDate(date) {
      let oldDate = get(this, 'repoWorkingDateSerialized');
      if (date !== oldDate) {
        set(this, 'repoWorkingDateSerialized', serializeDate(date));

        this._rebuildWorking();
      }
    },
    updateRepoBrokenDate(date) {
      let oldDate = get(this, 'repoBrokenDateSerialized');
      if (date !== oldDate) {
        set(this, 'repoBrokenDateSerialized', serializeDate(date));

        this._rebuildBroken();
      }
    }
  }
});

function deserializeDate(string) {
  return string ? new Date(string) : new Date();
}
function serializeDate(date) {
  if (date) {
    return date.toISOString();
  }
}
