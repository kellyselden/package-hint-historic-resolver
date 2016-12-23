import Ember from 'ember';
import toPairs from 'lodash/toPairs';

const {
  A: emberA
} = Ember;

export default function normalizeDependencies(dependencies) {
  if (dependencies) {
    dependencies = toPairs(dependencies).map(([module, version]) => {
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
