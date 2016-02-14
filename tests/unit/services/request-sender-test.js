import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const {
  RSVP: { Promise }
} = Ember;

let requestStub, service;

moduleFor('service:request-sender', 'Unit | Service | request sender', {
  beforeEach() {
    requestStub = sinon.stub().returns(Promise.resolve(12));

    service = this.subject({
      config: {
        serverApiEndpoint: 'test-api'
      },
      ajax: {
        request: requestStub
      }
    });
  }
});

test('calls request without prefix if full http url', function(assert) {
  assert.expect(1);

  return service.sendRequest('http://test').then(() => {
    assert.deepEqual(requestStub.args, [['http://test']]);
  });
});

test('calls request without prefix if full https url', function(assert) {
  assert.expect(1);

  return service.sendRequest('https://test').then(() => {
    assert.deepEqual(requestStub.args, [['https://test']]);
  });
});

test('partial url starting with http isn\'t ignored', function(assert) {
  assert.expect(1);

  return service.sendRequest('http-test').then(() => {
    assert.deepEqual(requestStub.args, [['test-api/http-test']]);
  });
});

test('partial url starting with https isn\'t ignored', function(assert) {
  assert.expect(1);

  return service.sendRequest('https-test').then(() => {
    assert.deepEqual(requestStub.args, [['test-api/https-test']]);
  });
});

test('calls request with partial url', function(assert) {
  assert.expect(1);

  return service.sendRequest('test-path').then(() => {
    assert.deepEqual(requestStub.args, [['test-api/test-path']]);
  });
});

test('returns response', function(assert) {
  assert.expect(1);

  return service.sendRequest('test-path').then(response => {
    assert.equal(response, 12);
  });
});
