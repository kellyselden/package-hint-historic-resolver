import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

const MyComponent = Component.extend({
  classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],

  areDifferent: computed('areVersionsDifferent', 'areVersionsDifferentClass', function() {
    return this.get('areVersionsDifferent') ? this.get('areVersionsDifferentClass') : '';
  })
});

MyComponent.reopenClass({
  positionalParams: ['version']
});

export default MyComponent;
