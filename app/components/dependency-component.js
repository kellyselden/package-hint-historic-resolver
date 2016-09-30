import Ember from 'ember';
import computed from 'ember-computed-decorators';
import { and, not } from 'ember-awesome-macros';

const {
  Component,
  inject: { service },
  get,
  computed: { readOnly }
} = Ember;

export default Component.extend({
  treeBuilder: service(),

  isRepoUrlInvalid: and('repoUrl', not('repo')),

  // watching dates because even though commits might not change,
  // nested versions might have
  @computed('firstJson', 'secondJson', 'repoWorkingDate', 'repoBrokenDate')
  dependencyGroups(firstJson, secondJson, repoWorkingDate, repoBrokenDate) {
    return get(this, 'treeBuilder').getDependencyGroups({
      firstJson,
      secondJson,
      repoWorkingDate,
      repoBrokenDate
    });
  },

  // to reuse the crawling logic
  dependencies: readOnly('dependencyGroups'),

  shouldShowTables: and(
    'repo',
    not('repoWorkingDateError'),
    not('repoBrokenDateError'),
    not('firstCommitError'),
    not('secondCommitError'),
    not('areDatesOutOfOrder')
  ),

  didInsertElement() {
    get(this, 'treeBuilder').setupComputeds(this, false);
  },

  willDestroyElement() {
    get(this, 'treeBuilder').cancelAll();
  },

  actions: {
    changeRepoUrl(url) {
      this.sendAction('repoUrlUpdated', url);
    },
    changeRepoWorkingDate(date) {
      this.sendAction('repoWorkingDateUpdated', date);
    },
    changeRepoBrokenDate(date) {
      this.sendAction('repoBrokenDateUpdated', date);
    },
    toggleCrawling() {
      let treeBuilder = get(this, 'treeBuilder');
      let stopCrawling = this.toggleProperty('stopCrawling');
      if (stopCrawling) {
        treeBuilder.cancelAll();
      } else {
        let repoWorkingDate = get(this, 'repoWorkingDate');
        let repoBrokenDate  = get(this, 'repoBrokenDate');
        treeBuilder.restartAll(this, repoWorkingDate, repoBrokenDate);
      }
    }
  }
});
