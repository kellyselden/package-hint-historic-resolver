import Ember from 'ember';

const { computed } = Ember;

const Component = Ember.Component.extend({
  classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],
  areDifferent: computed('areVersionsDifferent', 'areVersionsDifferentClass', function() {
    return this.get('areVersionsDifferent') ? this.get('areVersionsDifferentClass') : '';
  }),
});

Component.reopenClass({
  positionalParams: ['version']
});

export default Component;
