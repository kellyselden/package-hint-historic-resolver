import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: [
    'repoUrl',
    'repoDate',
    'firstDateToCheck',
    'secondDateToCheck'
  ],

  repoDateDeserialized: computed('repoDate', function() {
    let repoDate = this.get('repoDate');
    if (!repoDate) {
      return;
    }

    return this._deserializeDate(repoDate);
  }),
  firstDateToCheckDeserialized: computed('firstDateToCheck', function() {
    let firstDateToCheck = this.get('firstDateToCheck');
    if (!firstDateToCheck) {
      return;
    }

    return this._deserializeDate(firstDateToCheck);
  }),
  secondDateToCheckDeserialized: computed('secondDateToCheck', function() {
    let secondDateToCheck = this.get('secondDateToCheck');
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
      this.set('repoDate', this._serializeDate(date));
    },
    updateFirstDateToCheck(date) {
      this.set('firstDateToCheck', this._serializeDate(date));
    },
    updateSecondDateToCheck(date) {
      this.set('secondDateToCheck', this._serializeDate(date));
    }
  }
});
