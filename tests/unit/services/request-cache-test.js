import RSVP, { reject, resolve } from 'rsvp';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { setupService } from 'ember-test-setup';

module('Unit | Service | request cache', function(hooks) {
  setupTest(hooks);

  let getStub;
  let putStub;
  let removeTokensStub;
  let defaultRawResponseBody;
  let defaultRawResponse;
  let defaultRawStub;
  let service;

  hooks.beforeEach(function() {
    getStub = sinon.stub().returns(null);
    putStub = sinon.stub().returns(45);
    removeTokensStub = sinon.stub().returns(resolve());
    defaultRawResponseBody = 'test response';
    defaultRawResponse = {
      jqXHR: {
        getAllResponseHeaders() {
          return 'test-header: test value';
        }
      },
      response: defaultRawResponseBody
    };
    defaultRawStub = sinon.stub().returns(resolve(Object.assign({}, defaultRawResponse)));
  });

  setupService(hooks, {
    beforeService() {
      this.owner.register('service:config', Service.extend({
        cacheTime: 34
      }));
      this.owner.register('service:cache', Service.extend({
        get: getStub,
        put: putStub
      }));
      this.owner.register('service:limiter', Service.extend({
        // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
        removeTokens: {
          perform: removeTokensStub
        }
      }));
      this.owner.register('service:defaultAjax', Service.extend({
        raw: defaultRawStub
      }));
    },
    service: 'request-cache',
    afterService(_service) {
      service = _service;
    }
  });

  function cacheRequest(ajax) {
    return run(() => {
      return get(service, 'cacheRequest').perform('test-url', ajax);
    });
  }

  test('tries to get cached data before entering limiter', async function(assert) {
    assert.expect(1);

    this.service();

    await cacheRequest();

    assert.ok(getStub.getCall(0).calledBefore(removeTokensStub.getCall(0)));
  });

  test('tries to get cached data using key before entering limiter', async function(assert) {
    assert.expect(1);

    getStub.returns(12);

    this.service();

    await cacheRequest();

    assert.deepEqual(getStub.args, [['test-url']]);
  });

  test('returns cached data before entering limiter', async function(assert) {
    assert.expect(1);

    getStub.returns(12);

    this.service();

    let data = await cacheRequest();

    assert.strictEqual(data, 12);
  });

  test('doesn\'t enter limiter if cache has data', async function(assert) {
    assert.expect(1);

    getStub.returns(12);

    this.service();

    await cacheRequest();

    assert.notOk(removeTokensStub.called);
  });

  test('tries to get cached data after entering limiter', async function(assert) {
    assert.expect(1);

    getStub.onCall(1).returns(12);

    this.service();

    await cacheRequest();

    assert.ok(getStub.getCall(1).calledAfter(removeTokensStub.getCall(0)));
  });

  test('tries to get cached data using key after entering limiter', async function(assert) {
    assert.expect(1);

    getStub.onCall(1).returns(12);

    this.service();

    await cacheRequest();

    assert.deepEqual(getStub.args[1], ['test-url']);
  });

  test('returns cached data after entering limiter', async function(assert) {
    assert.expect(1);

    getStub.onCall(1).returns(12);

    this.service();

    let data = await cacheRequest();

    assert.strictEqual(data, 12);
  });

  test('removes one at a time from limiter', async function(assert) {
    assert.expect(1);

    this.service();

    await cacheRequest();

    assert.deepEqual(removeTokensStub.args, [[1]]);
  });

  test('tries to get cached data using key after exiting queue', async function(assert) {
    assert.expect(1);

    getStub.onCall(2).returns(12);

    this.service();

    await cacheRequest();

    assert.deepEqual(getStub.args[2], ['test-url']);
  });

  test('returns cached data after exiting queue', async function(assert) {
    assert.expect(1);

    getStub.onCall(2).returns(12);

    this.service();

    let data = await cacheRequest();

    assert.strictEqual(data, 12);
  });

  test('sends request after third cache try', async function(assert) {
    assert.expect(1);

    this.service();

    await cacheRequest();

    assert.ok(defaultRawStub.getCall(0).calledAfter(getStub.getCall(2)));
  });

  test('sends request with url', async function(assert) {
    assert.expect(1);

    this.service();

    await cacheRequest();

    assert.deepEqual(defaultRawStub.args, [['test-url']]);
  });

  test('allows a custom ajax service', async function(assert) {
    assert.expect(1);

    this.service();

    let rawStub = sinon.stub().returns(resolve(defaultRawResponse));

    let ajax = {
      raw: rawStub
    };

    await cacheRequest(ajax);

    assert.deepEqual(rawStub.args, [['test-url']]);
  });

  test('caches the data for a length of time', async function(assert) {
    assert.expect(1);

    this.service();

    await cacheRequest();

    assert.deepEqual(putStub.args, [
      [
        'test-url',
        {
          responseHeaders: {
            'test-header': 'test value'
          },
          responseBody: defaultRawResponseBody
        },
        34
      ]
    ]);
  });

  test('resolves with expected data', async function(assert) {
    assert.expect(1);

    this.service();

    let data = await cacheRequest();

    assert.strictEqual(data, 45);
  });

  test('doesn\'t cache data if request rejects', async function(assert) {
    assert.expect(1);

    defaultRawStub.returns(reject());

    this.service();

    try {
      await cacheRequest();
    } catch (err) {
      assert.notOk(putStub.called);
    }
  });

  test('doesn\'t cache data if task cancels', function(assert) {
    assert.expect(1);

    defaultRawStub.returns(RSVP.defer().promise);

    this.service();

    let task = get(service, 'cacheRequest').perform('test-url');

    task.cancel();

    task.catch(() => {
      assert.notOk(putStub.called);
    });
  });

  test('queues requests', async function(assert) {
    assert.expect(3);

    let deferred = RSVP.defer();

    defaultRawStub.returns(deferred.promise);

    this.service();

    cacheRequest();
    let secondPromise = cacheRequest();

    assert.equal(removeTokensStub.callCount, 2, 'both have passed the limiter');
    assert.equal(defaultRawStub.callCount, 1, 'one should be stuck in the queue');

    deferred.resolve(defaultRawResponse);

    getStub.returns(12);

    await secondPromise;

    assert.equal(defaultRawStub.callCount, 1, 'must have used the cache');
  });
});
