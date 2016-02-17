import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const {
  RSVP: { Promise }
} = Ember;

let service;

moduleFor('service:request-cache', 'Unit | Service | request cache', {
  beforeEach() {
    service = this.subject({
      config: {
        cacheTime: 34
      },
      cache: {
        get: sinon.stub().returns(null),
        put: sinon.stub().returns(45)
      },
      semaphore: {
        requestCacheSemaphore: {
          take: sinon.stub().callsArg(0),
          leave: sinon.spy()
        }
      },
      limiter: {
        removeTokens: sinon.stub().callsArg(1)
      },
      adapter: {
        ajax: sinon.stub().returns(Promise.resolve(23))
      }
    });
  }
});

test('tries to get cached data before entering semaphore', function(assert) {
  assert.expect(1);

  service.cache.get.returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(service.cache.get.args, [['test-url']]);
  });
});

test('returns cached data before entering semaphore', function(assert) {
  assert.expect(1);

  service.cache.get.returns(12);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 12);
  });
});

test('doesn\'t enter the semaphore if the cache has data', function(assert) {
  assert.expect(1);

  service.cache.get.returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.notOk(service.semaphore.requestCacheSemaphore.take.called);
  });
});

test('enters the semaphore', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(service.semaphore.requestCacheSemaphore.take.calledOnce);
  });
});

test('tries to get cached data after entering semaphore', function(assert) {
  assert.expect(1);

  service.cache.get.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(service.cache.get.args, [['test-url'], ['test-url']]);
  });
});

test('leaves the semaphore after finding cached data', function(assert) {
  assert.expect(1);

  service.cache.get.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(service.semaphore.requestCacheSemaphore.leave.calledOnce);
  });
});

test('returns cached data after entering semaphore', function(assert) {
  assert.expect(1);

  service.cache.get.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 12);
  });
});

test('enters the limiter', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(service.limiter.removeTokens.calledOnce);
  });
});

test('removes one at a time from the limiter', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.strictEqual(service.limiter.removeTokens.args[0][0], 1);
  });
});

test('leaves the semaphore', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(service.semaphore.requestCacheSemaphore.leave.calledOnce);
  });
});

test('sends request with url', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(service.adapter.ajax.args, [['test-url']]);
  });
});

test('caches the data for a length of time', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(service.cache.put.args, [['test-url', 23, 34]]);
  });
});

test('resolves with expected data', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 45);
  });
});

test('rejects with request arguments', function(assert) {
  assert.expect(1);

  service.adapter.ajax.returns(Promise.reject(56));

  return service.cacheRequest('test-url').catch(data => {
    assert.deepEqual(data, [56]);
  });
});

test('does\'t cache data if request rejects', function(assert) {
  assert.expect(1);

  service.adapter.ajax.returns(Promise.reject());

  return service.cacheRequest('test-url').catch(() => {
    assert.notOk(service.cache.put.called);
  });
});
