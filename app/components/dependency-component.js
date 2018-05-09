import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import autoComputed from '@ember-decorators/auto-computed';
import { and, not, hash } from 'ember-awesome-macros';

export default Component.extend({
  treeBuilder: service(),

  isRepoUrlInvalid: and('repoUrl', not('repo')),

  // watching dates because even though commits might not change,
  // nested versions might have
  @autoComputed(hash(
    'firstJson',
    'secondJson',
    'repoWorkingDate',
    'repoBrokenDate'
  ))
  dependencyGroups(hash) {
    return get(this, 'treeBuilder').getDependencyGroups(hash);
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
