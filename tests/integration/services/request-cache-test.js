import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';
import AjaxService from 'ember-ajax/services/ajax';

const {
  $,
  Service,
  RSVP: { all, Promise },
  run,
  get, set
} = Ember;

const ConfigService = Service.extend({
  limiterTime: 1
});

const CustomAjaxService = AjaxService.extend({
  host: 'https://my-custom-host',

  headers: {
    'my-custom-header': 'my custom value'
  }
});

let server;
let service;

let responseHeaders;
let responseBody;
let response;

moduleFor('service:request-cache', 'Integration | Service | request cache', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    this.register('service:config', ConfigService);
    this.inject.service('config', { as: 'config' });

    service = this.subject();

    responseHeaders = {
      'test-header': 'test value'
    };
    responseBody = [12];
    response = {
      responseHeaders,
      responseBody
    };

    server.get('http://test-host/api/test-url', () => {
      return [
        200,
        $.extend(true, {}, responseHeaders),
        responseBody.slice()
      ];
    });
  },
  afterEach() {
    server.shutdown();
    cache.clear();
  }
});

function cacheRequest(ajax) {
  return new Promise((resolve, reject) => {
    run(() => {
      get(service, 'cacheRequest').perform('test-url', ajax).then(resolve).catch(reject);
    });
  });
}

test('gets cached data', function(assert) {
  assert.expect(1);

  cache.put('test-url', 12);

  return cacheRequest().then(data => {
    assert.strictEqual(data, 12);
  });
});

test('resolves data from request', function(assert) {
  assert.expect(1);

  return cacheRequest().then(data => {
    assert.deepEqual(data, response);
  });
});

test('allows a custom ajax service', function(assert) {
  assert.expect(2);

  server.get('http://my-custom-host/test-url', ({ requestHeaders }) => {
    assert.strictEqual(requestHeaders['my-custom-header'], 'my custom value');

    return [200, {}, [56]];
  });

  let ajax = CustomAjaxService.create();

  return cacheRequest(ajax).then(data => {
    assert.deepEqual(data, {
      responseHeaders: {},
      responseBody: [56]
    });
  });
});

test('caches data from request', function(assert) {
  assert.expect(1);

  return cacheRequest().then(() => {
    assert.deepEqual(cache.get('test-url'), response);
  });
});

test('doesn\'t cache data when request fails', function(assert) {
  assert.expect(1);

  server.get('http://test-host/api/test-url', () => {
    return [500, {}, {}];
  });

  return cacheRequest().catch(() => {
    assert.strictEqual(cache.get('test-url'), null);
  });
});

test('doesn\'t cache data when task cancels', function(assert) {
  assert.expect(1);

  run(() => {
    let task = get(service, 'cacheRequest').perform('test-url');

    task.cancel();

    task.catch(() => {
      assert.strictEqual(cache.get('test-url'), null);
    });
  });
});

test('second call uses cached data after queuing', function(assert) {
  assert.expect(1);

  let promise1 = cacheRequest();
  let promise2 = cacheRequest();

  let didRunOnce;

  function handlePromise(promise) {
    return promise.then(data => {
      if (didRunOnce) {
        return assert.deepEqual(data, response);
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
  set(this, 'config.cacheTime', cacheTime);

  return cacheRequest().then(() => {
    let timeCacheWasSet = Date.now();

    // eslint-disable-next-line no-empty
    while (Date.now() - timeCacheWasSet <= cacheTime) {}

    server.get('http://test-host/api/test-url', () => {
      return [200, {}, [23]];
    });

    return cacheRequest().then(data => {
      assert.deepEqual(data, {
        responseHeaders: {},
        responseBody: [23]
      });
    });
  });
});

test('limits calls', function(assert) {
  assert.expect(1);

  let limiterTime = 100;
  set(this, 'config.limiterTime', limiterTime);

  let timeLimiterWasStarted = Date.now();

  return cacheRequest().then(() => {
    cache.clear();

    return cacheRequest().then(() => {
      assert.ok(Date.now() - timeLimiterWasStarted > limiterTime);
    });
  });
});
