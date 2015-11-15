import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: {
    repoUrl: 'repoUrl',
    repoWorkingDateSerialized: 'repoWorkingDate',
    repoBrokenDateSerialized: 'repoBrokenDate'
  },

  repoWorkingDate: computed('repoWorkingDateSerialized', function() {
    return deserializeDate(this.get('repoWorkingDateSerialized'));
  }),
  repoBrokenDate: computed('repoBrokenDateSerialized', function() {
    return deserializeDate(this.get('repoBrokenDateSerialized'));
  }),

  actions: {
    updateRepoUrl(url) {
      this.set('repoUrl', url || undefined);
    },
    updateRepoWorkingDate(date) {
      this.set('repoWorkingDateSerialized', serializeDate(date));
    },
    updateRepoBrokenDate(date) {
      this.set('repoBrokenDateSerialized', serializeDate(date));
    }
  }
});

function deserializeDate(string) {
  return string ? new Date(string) : new Date();
}
function serializeDate(date) {
  if (date) {
    return date.toISOString();
  }
}
