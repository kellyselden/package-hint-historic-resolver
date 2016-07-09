import getRepo from 'package-hint-historic-resolver/utils/get-repo';
import { module, test } from 'qunit';

module('Unit | Utility | get repo');

test('it handles just user and repo', function(assert) {
  let result = getRepo('test-user/test-repo');

  assert.strictEqual(result, 'test-user/test-repo');
});

test('it ignores anything before user', function(assert) {
  let result = getRepo('ignore/test-user/test-repo');

  assert.strictEqual(result, 'test-user/test-repo');
});

test('it returns undefined if falsy', function(assert) {
  let result = getRepo();

  assert.strictEqual(result, undefined);
});

test('it returns undefined if no slashes', function(assert) {
  let result = getRepo('test-repo');

  assert.strictEqual(result, undefined);
});

test('it handles leading slash', function(assert) {
  let result = getRepo('/test-user/test-repo');

  assert.strictEqual(result, 'test-user/test-repo');
});

test('it handles trailing slash', function(assert) {
  let result = getRepo('test-user/test-repo/');

  assert.strictEqual(result, 'test-user/test-repo');
});
