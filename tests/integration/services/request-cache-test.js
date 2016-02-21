import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';

const {
  Service,
  set,
  RSVP: { all }
} = Ember;

const config = Service.extend({
  limiterTime: 1
}).create();

let server;
let limiter;
let service;

moduleFor('service:request-cache', 'Integration | Service | request cache', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    this.register('service:config', config, { instantiate: false });
    this.inject.service('config', { as: 'config' });

    // https://github.com/jquery/qunit/pull/919
    if (!limiter) {
      limiter = this.container.lookup('service:limiter');
    }

    service = this.subject();
  },
  afterEach() {
    server.shutdown();
    limiter.reset();
    cache.clear();
  }
});

test('gets cached data', function(assert) {
  assert.expect(1);

  cache.put('test-url', 12);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 12);
  });
});

test('resolves data from request', function(assert) {
  assert.expect(1);

  server.get('http://test-host/api/test-url', () => {
    return [200, {}, [12]];
  });

  return service.cacheRequest('test-url').then(data => {
    assert.deepEqual(data, [12]);
  });
});

test('caches data from request', function(assert) {
  assert.expect(1);

  server.get('http://test-host/api/test-url', () => {
    return [200, {}, [12]];
  });

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(cache.get('test-url'), [12]);
  });
});

test('doesn\'t cache data when request fails', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').catch(() => {
    assert.strictEqual(cache.get('test-url'), null);
  });
});

test('second call uses cached data after entering semaphore', function(assert) {
  assert.expect(1);

  server.get('http://test-host/api/test-url', () => {
    return [200, {}, [12]];
  });

  let promise1 = service.cacheRequest('test-url');
  let promise2 = service.cacheRequest('test-url');

  let didRunOnce;

  function handlePromise(promise) {
    return promise.then(data => {
      if (didRunOnce) {
        return assert.deepEqual(data, [12]);
      }

      // changing response value to verify the cached value is used
      server.get('http://test-host/api/test-url', () => {
        return [200, {}, [23]];
      });

      didRunOnce = true;
    });
  }

  return all([
    handlePromise(promise1),
    handlePromise(promise2)
  ]);
});

test('cache invalidates after given time', function(assert) {
  assert.expect(1);

  let cacheTime = 1;
  set(config, 'cacheTime', cacheTime);

  server.get('http://test-host/api/test-url', () => {
    return [200, {}, [12]];
  });

  return service.cacheRequest('test-url').then(() => {
    let timeCacheWasSet = Date.now();
    while (Date.now() - timeCacheWasSet <= cacheTime) {}

    // changing response value to verify the cached value is used
    server.get('http://test-host/api/test-url', () => {
      return [200, {}, [23]];
    });

    return service.cacheRequest('test-url').then(data => {
      assert.deepEqual(data, [23]);
    });
  });
});
