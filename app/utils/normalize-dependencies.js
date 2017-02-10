import Ember from 'ember';
import pairs from 'lodash/object/pairs';

const {
  A: emberA
} = Ember;

export default function normalizeDependencies(dependencies) {
  if (dependencies) {
    dependencies = pairs(dependencies).map(([module, version]) => {
      return Ember.Object.create({
        module,
        version
      });
    });
  } else {
    dependencies = [];
  }

  return emberA(dependencies);
}
