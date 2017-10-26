import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  title:        readOnly('dependencyGroup.title'),
  dependencies: readOnly('dependencyGroup.dependencies')
});
