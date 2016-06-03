import Ember from 'ember';
import normalizeDependencies from './normalize-dependencies';
import mergeModules from './merge-modules';

const {
  A: newArray
} = Ember;

export default function getDependencyGroups(firstJson, secondJson) {
  if (!firstJson || !secondJson) {
    return;
  }

  return newArray([
    ['Dependencies', 'dependencies'],
    ['Dev Dependencies', 'devDependencies'],
    ['Optional Dependencies', 'optionalDependencies']
  ].map(dep => {
    let firstDependencies = normalizeDependencies(firstJson[dep[1]]);
    let secondDependencies = normalizeDependencies(secondJson[dep[1]]);
    return Ember.Object.create({
      title: dep[0],
      dependencies: mergeModules(firstDependencies, secondDependencies)
    });
  }).filter(dep => dep.dependencies.length));
}
