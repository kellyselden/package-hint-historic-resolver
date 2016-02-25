import Ember from 'ember';

const {
  Test: { registerAsyncHelper },
  RSVP: { Promise }
} = Ember;

export function waitFor(app, selector, context,
  {
    count = 1,
    interval = 1
  } = {}) {
  return new Promise(resolve => {
    (function restart() {
      setTimeout(() => {
        if (Ember.$(selector).length === count) {
          resolve();
        } else {
          restart();
        }
      }, interval);
    })();
  });
}

export default registerAsyncHelper('waitFor', waitFor);
