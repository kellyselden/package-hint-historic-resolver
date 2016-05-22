import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  get, set,
  on, observer,
  inject: { service }
} = Ember;

const MyComponent = Component.extend({
  ajax: service(),

  classNames: ['dependency-date'],

  latestCommitDataObserver: on('init', observer('repo', 'date', function() {
    let repo = get(this, 'repo'),
        date = get(this, 'date');
    if (!repo || !date) {
      set(this, '_commit', undefined);
      return;
    }

    let until = moment(date).toJSON();
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
