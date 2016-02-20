import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const {
  RSVP: { Promise }
} = Ember;

let getStub, putStub, takeStub, leaveSpy, removeTokensStub, ajaxStub;
let service;

moduleFor('service:request-cache', 'Unit | Service | request cache', {
  beforeEach() {
    getStub = sinon.stub().returns(null);
    putStub = sinon.stub().returns(45);
    takeStub = sinon.stub().callsArg(0);
    leaveSpy = sinon.spy();
    removeTokensStub = sinon.stub().callsArg(1);
    ajaxStub = sinon.stub().returns(Promise.resolve(23));

    service = this.subject({
      config: {
        cacheTime: 34
      },
      cache: {
        get: getStub,
        put: putStub
      },
      semaphore: {
        requestCacheSemaphore: {
          take: takeStub,
          leave: leaveSpy
        }
      },
      limiter: {
        removeTokens: removeTokensStub
      },
      adapter: {
        ajax: ajaxStub
      }
    });
  }
});

test('tries to get cached data before entering semaphore', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(getStub.calledBefore(takeStub));
  });
});

test('tries to get cached data using key before entering semaphore', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(getStub.args, [['test-url']]);
  });
});

test('returns cached data before entering semaphore', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 12);
  });
});

test('doesn\'t enter semaphore if cache has data', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.notOk(takeStub.called);
  });
});

test('enters semaphore', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(takeStub.calledOnce);
  });
});

test('tries to get cached data after entering semaphore', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(getStub.calledAfter(takeStub));
  });
});

test('tries to get cached data using key after entering semaphore', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(getStub.args[1], ['test-url']);
  });
});

test('leaves semaphore after finding cached data', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(leaveSpy.calledOnce);
  });
});

test('returns cached data after entering semaphore', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 12);
  });
});

test('enters limiter after entering semaphore', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(removeTokensStub.calledAfter(takeStub));
  });
});

test('removes one at a time from limiter', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.strictEqual(removeTokensStub.args[0][0], 1);
  });
});

test('sends request after limiter', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(ajaxStub.calledAfter(removeTokensStub));
  });
});

test('sends request with url', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(ajaxStub.args, [['test-url']]);
  });
});

test('caches the data for a length of time', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.deepEqual(putStub.args, [['test-url', 23, 34]]);
  });
});

test('resolves with expected data', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(data => {
    assert.strictEqual(data, 45);
  });
});

test('does\'t cache data if request rejects', function(assert) {
  assert.expect(1);

  ajaxStub.returns(Promise.reject());

  return service.cacheRequest('test-url').catch(() => {
    assert.notOk(putStub.called);
  });
});

test('leaves semaphore after request resolves', function(assert) {
  assert.expect(1);

  return service.cacheRequest('test-url').then(() => {
    assert.ok(leaveSpy.calledAfter(ajaxStub));
  });
});

test('leaves semaphore after request rejects', function(assert) {
  assert.expect(1);

  ajaxStub.returns(Promise.reject());

  return service.cacheRequest('test-url').catch(() => {
    assert.ok(leaveSpy.calledAfter(ajaxStub));
  });
});
