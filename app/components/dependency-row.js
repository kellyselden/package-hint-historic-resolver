import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'tr',

  areVersionsDifferent: computed('firstVersion', 'secondVersion', function() {
    let firstVersion  = this.get('firstVersion'),
        secondVersion = this.get('secondVersion');
    if (!firstVersion || !secondVersion) {
      return false;
    }

    return firstVersion !== secondVersion;
  }),

  actions: {
    firstVersionFound(version) {
      this.set('firstVersion', version);
    },
    secondVersionFound(version) {
      this.set('secondVersion', version);
    }
  }
});
