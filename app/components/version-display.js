import Component from '@ember/component';
import raw from 'ember-macro-helpers/raw';
import { conditional } from 'ember-awesome-macros';

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
