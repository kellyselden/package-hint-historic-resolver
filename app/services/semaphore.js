import Ember from 'ember';
import semaphore from 'npm:semaphore';

const {
  Service
} = Ember;

export default Service.extend({
  requestCacheSemaphore: semaphore(1),
  noNameYetSemaphore: semaphore(3)
});
