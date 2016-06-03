import Ember from 'ember';
import getDependencyGroups from '../utils/get-dependency-groups';

const {
  Component,
  get, set,
  computed,
  computed: { and, not }
} = Ember;

export default Component.extend({
  // repoWorkingDate: new Date(),
  // repoBrokenDate: new Date(),

  dependencyGroups: computed('firstJson', 'secondJson', function() {
    let firstJson  = get(this, 'firstJson');
    let secondJson = get(this, 'secondJson');

    let dependencyGroups = getDependencyGroups(firstJson, secondJson);

    return dependencyGroups;
  }),

  // Ember.computed.gt doesn't work with dates
  areDatesOutOfOrder: computed('repoWorkingDate', 'repoBrokenDate', function() {
    return get(this, 'repoWorkingDate') > get(this, 'repoBrokenDate');
  }),

  areDatesInOrder: not('areDatesOutOfOrder'),
  shouldShowTable: and('repoUrl', 'areDatesInOrder'),

  isDoneCrawling: computed('dependencyGroups.@each.isDoneCrawling', function() {
    let dependencyGroups = get(this, 'dependencyGroups');
    if (!dependencyGroups) {
      return false;
    }

    let areAllDoneCrawling = !dependencyGroups.filterBy('isDoneCrawling', undefined).length;

    return areAllDoneCrawling;
  }),

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
      this.toggleProperty('stopCrawling');
    },
    doneCrawling(dep) {
      set(dep, 'isDoneCrawling', true);
    }
  }
});
