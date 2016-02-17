import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';

let service;
let server;

moduleFor('service:request-cache', 'Integration | Service | request cache', {
  integration: true,
  beforeEach() {
    service = this.subject({
      config: {
        cacheTime: 34
      }
    });

    server = new Pretender();
    server.prepareBody = JSON.stringify;
  },
  afterEach() {
    cache.clear();

    server.shutdown();
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
