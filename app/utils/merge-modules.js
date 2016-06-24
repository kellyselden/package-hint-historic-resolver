import Ember from 'ember';

const {
  A: newArray,
  get, set
} = Ember;

export default function mergeModules(firstDependencies, secondDependencies) {
  let dependencies = newArray();
  if (firstDependencies && secondDependencies) {
    firstDependencies.forEach(dep1 => {
      let module = get(dep1, 'module');
      let dep = Ember.Object.create({
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
      dependencies.pushObject(Ember.Object.create({
        module,
        secondVersionHint: get(dep2, 'version')
      }));
    });
  }
  return dependencies;
}
