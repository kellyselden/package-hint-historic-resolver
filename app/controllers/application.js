import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    repoUrl: 'repoUrl',
    repoDateSerialized: 'repoDate',
    firstDateToCheckSerialized: 'firstDateToCheck',
    secondDateToCheckSerialized: 'secondDateToCheck'
  },

  repoDate: computed('repoDateSerialized', function() {
    let repoDate = this.get('repoDateSerialized');
    if (!repoDate) {
      return;
    }

    return this._deserializeDate(repoDate);
  }),
  firstDateToCheck: computed('firstDateToCheckSerialized', function() {
    let firstDateToCheck = this.get('firstDateToCheckSerialized');
    if (!firstDateToCheck) {
      return;
    }

    return this._deserializeDate(firstDateToCheck);
  }),
  secondDateToCheck: computed('secondDateToCheckSerialized', function() {
    let secondDateToCheck = this.get('secondDateToCheckSerialized');
    if (!secondDateToCheck) {
      return;
    }

    return this._deserializeDate(secondDateToCheck);
  }),

  _deserializeDate(string) {
    return new Date(string);
  },
  _serializeDate(date) {
    return date.toISOString();
  },

  actions: {
    updateRepoUrl(url) {
      this.set('repoUrl', url);
    },
    updateRepoDate(date) {
      this.set('repoDateSerialized', this._serializeDate(date));
    },
    updateFirstDateToCheck(date) {
      this.set('firstDateToCheckSerialized', this._serializeDate(date));
    },
    updateSecondDateToCheck(date) {
      this.set('secondDateToCheckSerialized', this._serializeDate(date));
    }
  }
});
