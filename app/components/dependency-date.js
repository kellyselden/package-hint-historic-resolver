import Ember from 'ember';
import moment from 'moment';
import sendRequst from '../utils/send-request';

const {
  on,
  computed,
  observer
} = Ember;

const Component = Ember.Component.extend({
  until: computed('date', function() {
    let date = this.get('date');
    if (!date) {
      return;
    }

    return moment(date).toJSON();
  }),

  latestCommitDataObserver: on('init', observer('repo', 'until', function() {
    let repo  = this.get('repo'),
        until = this.get('until');
    if (!repo || !until) {
      this.set('commitData', undefined);
      return;
    }

    var url = `https://api.github.com/repos/${repo}/commits?until=${until}`;
    sendRequst(url).then(data => {
      let [latestCommit] = data;
      this.set('commit', latestCommit.sha);
      this.sendAction('foundCommitData', latestCommit);
    }).catch(function() {
      console.log(arguments);
    });
  })),

  jsonObserver: observer('commit', function() {
    let repo   = this.get('repo'),
        commit = this.get('commit');
    if (!repo || !commit) {
      this.set('commit', undefined);
      return;
    }

    var url = `https://raw.githubusercontent.com/${repo}/${commit}/package.json`;
    sendRequst(url).then(data => {
      this.sendAction('receivedJson', data);
    }).catch(function() {
      console.log(arguments);
    });
  }),

  actions: {
    dateChanged(date) {
      this.sendAction('dateChanged', date);
    }
  }
});

Component.reopenClass({
  positionalParams: ['date']
});

export default Component;
