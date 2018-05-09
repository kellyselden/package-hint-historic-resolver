import Component from '@ember/component';
import { conditional, raw } from 'ember-awesome-macros';

const MyComponent = Component.extend({
  classNames: ['version-display'],
  classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],

  areDifferent: conditional(
    'areVersionsDifferent',
    'areVersionsDifferentClass',
    raw('')
  )
});

MyComponent.reopenClass({
  positionalParams: ['version']
});

export default MyComponent;
