import Ember from 'ember';
import conditional from 'ember-cpm/macros/conditional';

const {
  Component
} = Ember;

const MyComponent = Component.extend({
  classNames: ['version-display'],
  classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],

  _emptyClass: '',
  areDifferent: conditional(
    'areVersionsDifferent',
    'areVersionsDifferentClass',
    '_emptyClass'
  )
});

MyComponent.reopenClass({
  positionalParams: ['version']
});

export default MyComponent;
