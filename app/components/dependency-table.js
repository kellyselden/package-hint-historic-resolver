import Ember from 'ember';

const {
  Component,
  computed: { readOnly }
} = Ember;

export default Component.extend({
  title:        readOnly('dependencyGroup.title'),
  dependencies: readOnly('dependencyGroup.dependencies')
});
