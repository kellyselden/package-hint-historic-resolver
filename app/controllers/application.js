import Ember from 'ember';
import getRepo from '../utils/get-repo';

const {
  Controller,
  inject: { service },
  get, set,
  computed
} = Ember;

export default Controller.extend({
  treeBuilder: service(),

  queryParams: {
    repoUrl: 'repoUrl',
    repoWorkingDateSerialized: 'repoWorkingDate',
    repoBrokenDateSerialized: 'repoBrokenDate'
  },

  repoWorkingDate: computed('repoWorkingDateSerialized', function() {
    return deserializeDate(get(this, 'repoWorkingDateSerialized'));
  }),
  repoBrokenDate: computed('repoBrokenDateSerialized', function() {
    return deserializeDate(get(this, 'repoBrokenDateSerialized'));
  }),

  repo: computed('repoUrl', function() {
    let repoUrl = get(this, 'repoUrl');
    let repo = getRepo(repoUrl);
    return repo;
  }),

  rebuild() {
    this._rebuildWorking();
    this._rebuildBroken();
  },
  _rebuildWorking() {
    this._rebuild(
      'repoWorkingDate',
      'firstCommitError',
      'firstCommitDate',
      'repoWorkingDateError',
      'firstJson'
    );
  },
  _rebuildBroken() {
    this._rebuild(
      'repoBrokenDate',
      'secondCommitError',
      'secondCommitDate',
      'repoBrokenDateError',
      'secondJson'
    );
  },
  _rebuild(
    repoDateProp,
    commitErrorProp,
    commitDateProp,
    packageErrorProp,
    jsonProp
  ) {
    let treeBuilder = get(this, 'treeBuilder');
    let repo = get(this, 'repo');
    let repoDate = get(this, repoDateProp);

    return get(treeBuilder, 'getCommit').perform(repo, repoDate).catch(error => {
      set(this, commitErrorProp, error);
    }).then(({ commit, sha }) => {
      set(this, commitDateProp, commit.author.date);

      return get(treeBuilder, 'getPackage').perform(repo, sha);
    }).catch(error => {
      set(this, packageErrorProp, error);
    }).then(data => {
      set(this, jsonProp, data);
    });
  },

  actions: {
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
