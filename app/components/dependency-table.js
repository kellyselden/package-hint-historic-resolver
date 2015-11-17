import Ember from 'ember';

const { computed: { readOnly } } = Ember;

export default Ember.Component.extend({
  title:        readOnly('dep.title'),
  dependencies: readOnly('dep.dependencies'),

  _checkIfAllDoneCrawling() {
    let dependencies = this.get('dependencies');
    let areAllDoneCrawling = !dependencies.filterBy('isDoneCrawling', undefined).length;
    if (areAllDoneCrawling) {
      this.sendAction('doneCrawling', this.get('dep'));
    }
  },

  actions: {
    doneCrawling(dep) {
      dep.set('isDoneCrawling', true);

      this._checkIfAllDoneCrawling();
    }
  }
});
