import Ember from 'ember';

const {
  Component,
  get, set,
  computed: { readOnly }
} = Ember;

export default Component.extend({
  title:        readOnly('dependencyGroup.title'),
  dependencies: readOnly('dependencyGroup.dependencies'),

  _checkIfAllDoneCrawling() {
    let dependencies = get(this, 'dependencies');
    let areAllDoneCrawling = !dependencies.filterBy('isDoneCrawling', undefined).length;
    if (areAllDoneCrawling) {
      this.sendAction('doneCrawling', get(this, 'dependencyGroup'));
    }
  },

  actions: {
    doneCrawling(dependencyGroup) {
      set(dependencyGroup, 'isDoneCrawling', true);

      this._checkIfAllDoneCrawling();
    }
  }
});
