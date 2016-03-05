import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  get, set,
  on, computed, observer,
  inject: { service }
} = Ember;

const MyComponent = Component.extend({
  ajax: service(),

  classNames: ['dependency-date'],

  _until: computed('date', function() {
    let date = get(this, 'date');
    if (!date) {
      return;
    }

    return moment(date).toJSON();
  }),

  latestCommitDataObserver: on('init', observer('repo', '_until', function() {
    let repo  = get(this, 'repo'),
        until = get(this, '_until');
    if (!repo || !until) {
      set(this, '_commit', undefined);
      return;
    }

    let url = `https://api.github.com/repos/${repo}/commits?until=${until}`;
    get(this, 'ajax').request(url).then(([latestCommit]) => {
      set(this, '_commit', latestCommit.sha);
      this.sendAction('foundCommitData', latestCommit);
    }).catch(error => {
      this.sendAction('error', `Error retrieving latest commit: ${error}`);
    });
  })),

  jsonObserver: observer('_commit', function() {
    let repo   = get(this, 'repo'),
        commit = get(this, '_commit');
    if (!repo || !commit) {
      set(this, '_commit', undefined);
      return;
    }

    let url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;
    get(this, 'ajax').request(url).then(data => {
      this.sendAction('receivedJson', data);
    }).catch(error => {
      this.sendAction('error', `Error retrieving package.json: ${error}`);
    });
  }),

  actions: {
    dateChanged(date) {
      this.sendAction('dateChanged', date);
    }
  }
});

MyComponent.reopenClass({
  positionalParams: ['date']
});

export default MyComponent;
