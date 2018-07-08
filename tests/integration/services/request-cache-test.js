import Service from '@ember/service';
import { run } from '@ember/runloop';
import { set, get } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';
import AjaxService from 'ember-ajax/services/ajax';

const ConfigService = Service.extend({
  limiterTime: 1
});

const CustomAjaxService = AjaxService.extend({
  host: 'https://my-custom-host',

  init() {
    this._super();

    set(this, 'headers', {
      'my-custom-header': 'my custom value'
    })
  }
});

module('Integration | Service | request cache', function(hooks) {
  setupTest(hooks);

  let server;
  let service;

  let responseHeaders;
  let responseBody;
  let response;

  hooks.beforeEach(function() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    this.owner.register('service:config', ConfigService);
    this.config = this.owner.lookup('service:config');

    service = this.owner.lookup('service:request-cache');

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
        Object.assign({}, responseHeaders),
        responseBody.slice()
      ];
    });
  });

  hooks.afterEach(function() {
    server.shutdown();
    cache.clear();
  });

  function cacheRequest(ajax) {
    return run(() => {
      return get(service, 'cacheRequest').perform('test-url', ajax);
    });
  }

  test('gets cached data', async function(assert) {
    assert.expect(1);

    cache.put('test-url', 12);

    let data = await cacheRequest();

    assert.strictEqual(data, 12);
  });

  test('resolves data from request', async function(assert) {
    assert.expect(1);

    let data = await cacheRequest();

    assert.deepEqual(data, response);
  });

  test('allows a custom ajax service', async function(assert) {
    assert.expect(2);

    server.get('http://my-custom-host/test-url', ({ requestHeaders }) => {
      assert.strictEqual(requestHeaders['my-custom-header'], 'my custom value');

      return [200, {}, [56]];
    });

    let ajax = CustomAjaxService.create();

    let data = await cacheRequest(ajax);

    assert.deepEqual(data, {
      responseHeaders: {},
      responseBody: [56]
    });
  });

  test('caches data from request', async function(assert) {
    assert.expect(1);

    await cacheRequest();

    assert.deepEqual(cache.get('test-url'), response);
  });

  test('doesn\'t cache data when request fails', async function(assert) {
    assert.expect(1);

    server.get('http://test-host/api/test-url', () => {
      return [500, {}, {}];
    });

    try {
      await cacheRequest();
    } catch (err) {
      assert.strictEqual(cache.get('test-url'), null);
    }
  });

  test('doesn\'t cache data when task cancels', function(assert) {
    assert.expect(1);

    let task = get(service, 'cacheRequest').perform('test-url');

    task.cancel();

    task.catch(() => {
      assert.strictEqual(cache.get('test-url'), null);
    });
  });

  test('second call uses cached data after queuing', function(assert) {
    assert.expect(1);

    let promise1 = cacheRequest();
    let promise2 = cacheRequest();

    let didRunOnce;

    async function handlePromise(promise) {
      let data = await promise;

      if (didRunOnce) {
        return assert.deepEqual(data, response);
      }

      // changing response value to verify the cached value is used
      server.get('http://test-host/api/test-url', () => {
        return [200, {}, [23]];
      });

      didRunOnce = true;
    }

    return Promise.all([
      handlePromise(promise1),
      handlePromise(promise2)
    ]);
  });

  test('cache invalidates after given time', async function(assert) {
    assert.expect(1);

    let cacheTime = 1;
    set(this.config, 'cacheTime', cacheTime);

    await cacheRequest();

    let timeCacheWasSet = Date.now();

    // eslint-disable-next-line no-empty
    while (Date.now() - timeCacheWasSet <= cacheTime) {}

    server.get('http://test-host/api/test-url', () => {
      return [200, {}, [23]];
    });

    let data = await cacheRequest();

    assert.deepEqual(data, {
      responseHeaders: {},
      responseBody: [23]
    });
  });

  test('limits calls', async function(assert) {
    assert.expect(1);

    let limiterTime = 100;
    set(this.config, 'limiterTime', limiterTime);

    let timeLimiterWasStarted = Date.now();

    await cacheRequest();

    cache.clear();

    await cacheRequest();

    assert.ok(Date.now() - timeLimiterWasStarted > limiterTime);
  });
});
