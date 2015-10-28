import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    repoUrl: 'repoUrl',
    repoWorkingDateSerialized: 'repoWorkingDate',
    repoBrokenDateSerialized: 'repoBrokenDate'
  },

  repoWorkingDate: computed('repoWorkingDateSerialized', function() {
    let repoWorkingDate = this.get('repoWorkingDateSerialized');
    if (!repoWorkingDate) {
      return;
    }

    return this._deserializeDate(repoWorkingDate);
  }),
  repoBrokenDate: computed('repoBrokenDateSerialized', function() {
    let repoBrokenDate = this.get('repoBrokenDateSerialized');
    if (!repoBrokenDate) {
      return;
    }

    return this._deserializeDate(repoBrokenDate);
  }),

  _deserializeDate(string) {
    return new Date(string);
  },
  _serializeDate(date) {
    if (date) {
      return date.toISOString();
    }
  },

  actions: {
    updateRepoUrl(url) {
      this.set('repoUrl', url || undefined);
    },
    updateRepoWorkingDate(date) {
      this.set('repoWorkingDateSerialized', this._serializeDate(date));
    },
    updateRepoBrokenDate(date) {
      this.set('repoBrokenDateSerialized', this._serializeDate(date));
    }
  }
});
