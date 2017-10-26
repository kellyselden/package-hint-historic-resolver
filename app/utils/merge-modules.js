import { A as emberA } from '@ember/array';
import EmberObject, { set, get } from '@ember/object';

export default function mergeModules(firstDependencies, secondDependencies) {
  let dependencies = emberA();
  if (firstDependencies && secondDependencies) {
    firstDependencies.forEach(dep1 => {
      let module = get(dep1, 'module');
      let dep = EmberObject.create({
        module,
        firstVersionHint: get(dep1, 'version')
      });
      let dep2 = secondDependencies.filterBy('module', module)[0];
      if (dep2) {
        set(dep, 'secondVersionHint', get(dep2, 'version'));
      }
      dependencies.pushObject(dep);
    });
    secondDependencies.forEach(dep2 => {
      let module = get(dep2, 'module');
      let dep1 = firstDependencies.filterBy('module', module)[0];
      if (dep1) {
        return;
      }
      dependencies.pushObject(EmberObject.create({
        module,
        secondVersionHint: get(dep2, 'version')
      }));
    });
  }
  return dependencies;
}
