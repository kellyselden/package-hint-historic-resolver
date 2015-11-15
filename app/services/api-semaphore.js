import Ember from 'ember';
import semaphore from 'npm:semaphore';

export default Ember.Service.extend({
  sem: semaphore(3)
});
