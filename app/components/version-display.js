import Component from '@ember/component';
import { conditional } from 'ember-awesome-macros';

export default Component.extend({
  classNames: ['version-display'],
  classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],

  areDifferent: conditional(
    'areVersionsDifferent',
    'areVersionsDifferentClass'
  )
}).reopenClass({
  positionalParams: ['version']
});
