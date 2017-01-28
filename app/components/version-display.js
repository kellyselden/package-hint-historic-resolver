import Ember from 'ember';
import raw from 'ember-macro-helpers/raw';
import { conditional } from 'ember-awesome-macros';

const {
  Component
} = Ember;

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
