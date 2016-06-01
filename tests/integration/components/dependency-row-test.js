import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';
import waitWithoutTimeoutsAndIntervals from 'ember-test-helpers/wait';

function wait() {
  return waitWithoutTimeoutsAndIntervals({ waitForTimersAndIntervals: false });
}

let server;
let versionsCallback, versionsBody, versionsResponse;
let firstDependenciesCallback, firstDependenciesBody, firstDependenciesResponse;
let secondDependenciesCallback, secondDependenciesBody, secondDependenciesResponse;
let childVersionsCallback, childVersionsCallBody, childVersionsResponse;
let firstChildDependenciesCallback, firstChildDependenciesBody, firstChildDependenciesResponse;
let secondChildDependenciesCallback, secondChildDependenciesBody, secondChildDependenciesResponse;
let dependency, nestingLevel, shouldOnlyShowDifferent, stopCrawling;
let onDoneCrawling;

let testFirstVersion, testSecondVersion, testFirstVersionHint, testSecondVersionHint;
let testChildFirstVersion, testChildSecondVersion;

moduleForComponent('dependency-row', 'Integration | Component | dependency row', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    versionsCallback                = () => {};
    firstDependenciesCallback       = () => {};
    secondDependenciesCallback      = () => {};
    childVersionsCallback           = () => {};
    firstChildDependenciesCallback  = () => {};
    secondChildDependenciesCallback = () => {};

    testFirstVersion  = '1.2.1';
    testSecondVersion = '1.5.0';
    versionsBody = {};
    versionsBody[testFirstVersion]  = '2015-01-01T00:00:00.000Z';
    versionsBody[testSecondVersion] = '2015-03-01T00:00:00.000Z';

    firstDependenciesBody = {
      'test-child-module': '^1.0.0'
    };
    secondDependenciesBody = {
      'test-child-module': '^1.1.0'
    };

    testChildFirstVersion  = '1.2.1';
    testChildSecondVersion = '1.5.0';
    childVersionsCallBody = {};
    childVersionsCallBody[testChildFirstVersion]  = '2015-01-01T00:00:00.000Z';
    childVersionsCallBody[testChildSecondVersion] = '2015-03-01T00:00:00.000Z';

    firstChildDependenciesBody = {
      'test-module': '^1.0.0'
    };
    secondChildDependenciesBody = {
      'test-module': '^1.1.0'
    };

    versionsResponse                = () => [200, {}, versionsBody];
    firstDependenciesResponse       = () => [200, {}, firstDependenciesBody];
    secondDependenciesResponse      = () => [200, {}, secondDependenciesBody];
    childVersionsResponse           = () => [200, {}, childVersionsCallBody];
    firstChildDependenciesResponse  = () => [200, {}, firstChildDependenciesBody];
    secondChildDependenciesResponse = () => [200, {}, secondChildDependenciesBody];

    testFirstVersionHint  = '^1.0.0';
    testSecondVersionHint = '^1.1.0';
    dependency = {
      module: 'test-module',
      firstVersionHint: testFirstVersionHint,
      secondVersionHint: testSecondVersionHint
    };
    nestingLevel = 2;
    shouldOnlyShowDifferent = false;
    stopCrawling = false;

    this.set('repoWorkingDate', new Date(Date.UTC(2015, 1, 1)));
    this.set('repoBrokenDate',  new Date(Date.UTC(2015, 3, 1)));

    onDoneCrawling = () => {};

    this.inject.service('config', { as: 'config' });
    // this.set('config.cacheTime', 10);
    this.set('config.limiterTime', 0);
  },
  afterEach() {
    server.shutdown();

    cache.clear();
  }
});

function render() {
  this.set('dependency', dependency);
  this.set('nestingLevel', nestingLevel);
  this.set('shouldOnlyShowDifferent', shouldOnlyShowDifferent);
  this.set('stopCrawling', stopCrawling);

  server.get('http://test-host/api/npm/test-module/versions', function() {
    versionsCallback(...arguments);
    return versionsResponse(...arguments);
  });
  server.get(`http://test-host/api/npm/test-module@${testFirstVersion}/dependencies`, function() {
    firstDependenciesCallback(...arguments);
    return firstDependenciesResponse(...arguments);
  });
  server.get(`http://test-host/api/npm/test-module@${testSecondVersion}/dependencies`, function() {
    secondDependenciesCallback(...arguments);
    return secondDependenciesResponse(...arguments);
  });
  server.get('http://test-host/api/npm/test-child-module/versions', function() {
    childVersionsCallback(...arguments);
    return childVersionsResponse(...arguments);
  });
  server.get(`http://test-host/api/npm/test-child-module@${testChildFirstVersion}/dependencies`, function() {
    firstChildDependenciesCallback(...arguments);
    return firstChildDependenciesResponse(...arguments);
  });
  server.get(`http://test-host/api/npm/test-child-module@${testChildSecondVersion}/dependencies`, function() {
    secondChildDependenciesCallback(...arguments);
    return secondChildDependenciesResponse(...arguments);
  });

  this.on('doneCrawling', onDoneCrawling);

  this.render(hbs`
    {{dependency-row
      dependency=dependency
      nestingLevel=nestingLevel
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
      shouldOnlyShowDifferent=shouldOnlyShowDifferent
      stopCrawling=stopCrawling
      doneCrawling="doneCrawling"
    }}
  `);
}

test('hides when parent and children are same', function(assert) {
  assert.expect(1);

  delete versionsBody[testSecondVersion];
  delete childVersionsCallBody[testChildSecondVersion];
  firstChildDependenciesBody = {};
  shouldOnlyShowDifferent = true;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$().text().trim(), '');
  });
});

test('doesn\'t hide when parent and children are different', function(assert) {
  assert.expect(2);

  shouldOnlyShowDifferent = true;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2').length, 1);
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3').length, 1);
  });
});

// test('doesn\'t hide same parent when children different', function(assert) {
//   assert.expect(1);
//
//   delete versionsBody[testSecondVersion];
//   shouldOnlyShowDifferent = true;
//
//   render.call(this);
//
//   return wait().then(() => {
//     assert.strictEqual(this.$('.dependency-row.test-module.depth-2').length, 1);
//   });
// });

test('respects nesting level', function(assert) {
  assert.expect(1);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .module')[0].style.paddingLeft, '2em');
  });
});

test('shows module', function(assert) {
  assert.expect(1);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .module').text().trim(), 'test-module');
  });
});

test('doesn\'t make request if no module', function(assert) {
  assert.expect(1);

  delete dependency['module'];

  let called = false;
  versionsCallback = () => {
    called = true;
  };

  render.call(this);

  return wait().then(() => {
    assert.notOk(called);
  });
});

test('doesn\'t make request if stop crawling', function(assert) {
  assert.expect(1);

  stopCrawling = true;

  let called = false;
  versionsCallback = () => {
    called = true;
  };

  render.call(this);

  return wait().then(() => {
    assert.notOk(called);
  });
});

test('handles failed request', function(assert) {
  assert.expect(3);

  versionsResponse = () => {
    return [500, {}, {}];
  };

  let called = false;
  onDoneCrawling = () => {
    called = true;
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version').text().trim(), 'Error retrieving module from npm: Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version').text().trim(), 'Error retrieving module from npm: Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
    assert.notOk(called);
  });
});

test('handles missing versions', function(assert) {
  assert.expect(4);

  delete dependency['firstVersionHint'];
  delete dependency['secondVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version').text().trim(), 'missing');
  });
});

test('handles first version missing', function(assert) {
  assert.expect(8);

  delete dependency['firstVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version-hint').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version .is-missing').length, 1);
  });
});

test('handles second version missing', function(assert) {
  assert.expect(8);

  delete dependency['secondVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.notStrictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version-hint').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .first-version .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module.depth-2 > .second-version .is-missing').length, 1);
  });
});

test('hints display correctly', function(assert) {
  assert.expect(2);

  delete versionsBody[testSecondVersion];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version-hint').text().trim(), testFirstVersionHint);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version-hint').text().trim(), testSecondVersionHint);
  });
});

test('hints are same', function(assert) {
  assert.expect(2);

  dependency.secondVersionHint = testFirstVersionHint;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version-hint .hints-are-different').length, 0);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version-hint .hints-are-different').length, 0);
  });
});

test('hints are different', function(assert) {
  assert.expect(2);

  delete versionsBody[testSecondVersion];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version-hint .hints-are-different').length, 1);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version-hint .hints-are-different').length, 1);
  });
});

test('versions display correctly', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version').text().trim(), testFirstVersion);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version').text().trim(), testSecondVersion);
  });
});

test('versions are same', function(assert) {
  assert.expect(2);

  delete versionsBody[testSecondVersion];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version .versions-are-different').length, 0);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version .versions-are-different').length, 0);
  });
});

test('versions are different', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .first-version .versions-are-different').length, 1);
    assert.strictEqual(this.$('.dependency-row.test-module.depth-2 > .second-version .versions-are-different').length, 1);
  });
});

test('sends action when done', function(assert) {
  assert.expect(1);

  onDoneCrawling = dependency => {
    assert.deepEqual(dependency, {
      module: 'test-module',
      firstVersionHint: testFirstVersionHint,
      secondVersionHint: testSecondVersionHint
    });
  };

  render.call(this);

  return wait();
});

test('shows child dependencies', function(assert) {
  assert.expect(5);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3 > .module').text().trim(), 'test-child-module');
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3 > .first-version-hint').text().trim(), testFirstVersionHint);
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3 > .second-version-hint').text().trim(), testSecondVersionHint);
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3 > .first-version').text().trim(), testFirstVersion);
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-3 > .second-version').text().trim(), testSecondVersion);
  });
});

test('stops on circular reference', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module.depth-4 > .first-version .circular-reference').text().trim(), 'circular reference');
    assert.strictEqual(this.$('.dependency-row.test-module.depth-4 > .second-version .circular-reference').text().trim(), 'circular reference');
  });
});
