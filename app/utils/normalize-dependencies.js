import EmberObject from '@ember/object';
import { A as emberA } from '@ember/array';
import toPairs from 'lodash/toPairs';

export default function normalizeDependencies(dependencies) {
  if (dependencies) {
    dependencies = toPairs(dependencies).map(([module, version]) => {
      return EmberObject.create({
        module,
        version
      });
    });
  } else {
    dependencies = [];
  }

  return emberA(dependencies);
}
