import Ember from 'ember';
import computed from 'ember-computed-decorators';
import getRepo from '../utils/get-repo';

const {
  Controller,
  inject: { service },
  get, set, setProperties
} = Ember;

export default Controller.extend({
  session: service(),
  treeBuilder: service(),

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

  // Ember.computed.gt doesn't work with dates
  @computed('repoWorkingDate', 'repoBrokenDate')
  areDatesOutOfOrder(repoWorkingDate, repoBrokenDate) {
    return repoWorkingDate > repoBrokenDate;
  },

  rebuild() {
    this._rebuildWorking();
    this._rebuildBroken();
  },
  _rebuildWorking() {
    this._rebuild(
      'repoWorkingDate',
      'firstCommit',
      'firstCommitError',
      'firstCommitDate',
      'repoWorkingDateError',
      'firstJson'
    );
  },
  _rebuildBroken() {
    this._rebuild(
      'repoBrokenDate',
      'secondCommit',
      'secondCommitError',
      'secondCommitDate',
      'repoBrokenDateError',
      'secondJson'
    );
  },
  _rebuild(
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

    let treeBuilder = get(this, 'treeBuilder');
    let repoDate = get(this, repoDateProp);

    let properties = {};
    properties[commitErrorProp] = undefined;
    properties[packageErrorProp] = undefined;
    setProperties(this, properties);

    let promise = get(treeBuilder, 'getCommit').perform(repo, repoDate);

    promise.then(({ responseHeaders, response }) => {
      let [latestCommit] = response;
      let { sha, commit } = latestCommit;

      let properties = {};
      properties['githubRateLimit'] = responseHeaders['X-RateLimit-Limit'];
      properties['githubRateRemaining'] = responseHeaders['X-RateLimit-Remaining'];
      properties[commitProp] = sha;
      properties[commitDateProp] = commit.author.date;
      setProperties(this, properties);

      return get(treeBuilder, 'getPackage').perform(repo, sha);
    }).catch(error => {
      set(this, commitErrorProp, error);
    }).then(data => {
      if (!data) {
        // the above failed
        return;
      }

      set(this, jsonProp, data);
    }).catch(error => {
      set(this, packageErrorProp, error);
    });
  },

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
