import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const {
  RSVP,
  RSVP: { resolve, reject, Promise },
  run,
  get
} = Ember;

let getStub;
let putStub;
let removeTokensStub;
let ajaxResponse;
let ajaxStub;
let service;

moduleFor('service:request-cache', 'Unit | Service | request cache', {
  beforeEach() {
    getStub = sinon.stub().returns(null);
    putStub = sinon.stub().returns(45);
    removeTokensStub = sinon.stub().returns(resolve());
    ajaxResponse = 23;
    ajaxStub = sinon.stub().returns(resolve(ajaxResponse));
  }
});

function subject() {
  service = this.subject({
    config: {
      cacheTime: 34
    },
    cache: {
      get: getStub,
      put: putStub
    },
    limiter: {
      removeTokens: {
        perform: removeTokensStub
      }
    },
    adapter: {
      ajax: ajaxStub
    }
  });
}

function cacheRequest() {
  return new Promise((resolve, reject) => {
    run(() => {
      get(service, 'cacheRequest').perform('test-url').then(resolve).catch(reject);
    });
  });
}

test('tries to get cached data before entering limiter', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.ok(getStub.getCall(0).calledBefore(removeTokensStub.getCall(0)));
  });
});

test('tries to get cached data using key before entering limiter', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(getStub.args, [['test-url']]);
  });
});

test('returns cached data before entering limiter', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  subject.call(this);

  return cacheRequest().then(data => {
    assert.strictEqual(data, 12);
  });
});

test('doesn\'t enter limiter if cache has data', function(assert) {
  assert.expect(1);

  getStub.returns(12);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.notOk(removeTokensStub.called);
  });
});

test('tries to get cached data after entering limiter', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.ok(getStub.getCall(1).calledAfter(removeTokensStub.getCall(0)));
  });
});

test('tries to get cached data using key after entering limiter', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(getStub.args[1], ['test-url']);
  });
});

test('returns cached data after entering limiter', function(assert) {
  assert.expect(1);

  getStub.onCall(1).returns(12);

  subject.call(this);

  return cacheRequest().then(data => {
    assert.strictEqual(data, 12);
  });
});

test('removes one at a time from limiter', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(removeTokensStub.args, [[1]]);
  });
});

test('tries to get cached data using key after exiting queue', function(assert) {
  assert.expect(1);

  getStub.onCall(2).returns(12);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(getStub.args[2], ['test-url']);
  });
});

test('returns cached data after exiting queue', function(assert) {
  assert.expect(1);

  getStub.onCall(2).returns(12);

  subject.call(this);

  return cacheRequest().then(data => {
    assert.strictEqual(data, 12);
  });
});

test('sends request after third cache try', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.ok(ajaxStub.getCall(0).calledAfter(getStub.getCall(2)));
  });
});

test('sends request with url', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(ajaxStub.args, [['test-url']]);
  });
});

test('caches the data for a length of time', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(() => {
    assert.deepEqual(putStub.args, [['test-url', 23, 34]]);
  });
});

test('resolves with expected data', function(assert) {
  assert.expect(1);

  subject.call(this);

  return cacheRequest().then(data => {
    assert.strictEqual(data, 45);
  });
});

test('does\'t cache data if request rejects', function(assert) {
  assert.expect(1);

  ajaxStub.returns(reject());

  subject.call(this);

  return cacheRequest().catch(() => {
    assert.notOk(putStub.called);
  });
});

test('does\'t cache data if task cancels', function(assert) {
  assert.expect(1);

  ajaxStub.returns(RSVP.defer().promise);

  subject.call(this);

  run(() => {
    let task = get(service, 'cacheRequest').perform('test-url');

    task.cancel();

    task.catch(() => {
      assert.notOk(putStub.called);
    });
  });
});

test('queues requests', function(assert) {
  assert.expect(3);

  let deferred = RSVP.defer();

  ajaxStub.returns(deferred.promise);

  subject.call(this);

  cacheRequest();
  let secondPromise = cacheRequest();

  assert.equal(removeTokensStub.callCount, 2, 'both have passed the limiter');
  assert.equal(ajaxStub.callCount, 1, 'one should be stuck in the queue');

  deferred.resolve(ajaxResponse);

  getStub.returns(12);

  return secondPromise.then(() => {
    assert.equal(ajaxStub.callCount, 1, 'must have used the cache');
  });
});
