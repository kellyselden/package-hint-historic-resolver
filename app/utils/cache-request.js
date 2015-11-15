import Ember from 'ember';
import cache from 'npm:memory-cache';
import sendRequest from './send-request';

import semaphore from 'npm:semaphore';
const sem = semaphore(1);

import nodeRateLimiter from 'npm:limiter';
const { RateLimiter } = nodeRateLimiter;
const limiter = new RateLimiter(1, 250);

const {
  run,
  RSVP: { Promise }
} = Ember;

const CACHE_TIME = 1000 * 60 * 60; // one hour

export default function cacheRequest(url) {
  let data = cache.get(url);
  if (data) {
    return Promise.resolve(data);
  }

  return new Promise((resolve, reject) => {
    sem.take(() => {
      limiter.removeTokens(1, () => {
        sem.leave();

        sendRequest(url).then(data => {
          run(null, resolve, cache.put(url, data, CACHE_TIME));
        }).catch(function() {
          run(null, reject, arguments);
        });
      });
    });
  });
}
