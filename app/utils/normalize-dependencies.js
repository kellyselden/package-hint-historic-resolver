import pairs from 'lodash/object/pairs';

export default function normalizeDependencies(dependencies) {
  if (!dependencies) {
    return [];
  }

  return pairs(dependencies).map(dep => {
    let [module, version] = dep;
    return {
      module,
      version
    };
  });
}
