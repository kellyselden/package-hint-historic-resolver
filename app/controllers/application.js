import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    repoUrl: 'repoUrl',
    repoDateSerialized: 'repoDate',
    dateWentBadSerialized: 'dateWentBad'
  },

  repoDate: computed('repoDateSerialized', function() {
    let repoDate = this.get('repoDateSerialized');
    if (!repoDate) {
      return;
    }

    return this._deserializeDate(repoDate);
  }),
  dateWentBad: computed('dateWentBadSerialized', function() {
    let dateWentBad = this.get('dateWentBadSerialized');
    if (!dateWentBad) {
      return;
    }

    return this._deserializeDate(dateWentBad);
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
    updateDateWentBad(date) {
      this.set('dateWentBadSerialized', this._serializeDate(date));
    }
  }
});
