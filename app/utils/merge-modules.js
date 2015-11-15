export default function mergeModules(firstDependencies, secondDependencies) {
  let dependencies = [];
  if (firstDependencies && secondDependencies) {
    firstDependencies.forEach(dep1 => {
      let dep = {
        module: dep1.module,
        firstVersionHint: dep1.version
      };
      let dep2 = secondDependencies.filter(dep2 => dep1.module === dep2.module)[0];
      if (dep2) {
        dep.secondVersionHint = dep2.version;
      }
      dependencies.push(dep);
    });
    secondDependencies.forEach(dep2 => {
      let dep1 = firstDependencies.filter(dep1 => dep1.module === dep2.module)[0];
      if (dep1) {
        return;
      }
      dependencies.push({
        module: dep2.module,
        secondVersionHint: dep2.version
      });
    });
  }
  return dependencies;
}
