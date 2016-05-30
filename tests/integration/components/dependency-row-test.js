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

    versionsBody = {
      '1.0.1': '2015-01-01T00:00:00.000Z',
      '2.0.1': '2015-03-01T00:00:00.000Z'
    };
    firstDependenciesBody = {
      'test-child-module': '^1.0.0'
    };
    secondDependenciesBody = {
      'test-child-module': '^2.0.0'
    };
    childVersionsCallBody = {
      '1.1.0': '2015-01-01T00:00:00.000Z',
      '2.1.0': '2015-03-01T00:00:00.000Z'
    };
    firstChildDependenciesBody = {};
    secondChildDependenciesBody = {};

    versionsResponse                = () => [200, {}, versionsBody];
    firstDependenciesResponse       = () => [200, {}, firstDependenciesBody];
    secondDependenciesResponse      = () => [200, {}, secondDependenciesBody];
    childVersionsResponse           = () => [200, {}, childVersionsCallBody];
    firstChildDependenciesResponse  = () => [200, {}, firstChildDependenciesBody];
    secondChildDependenciesResponse = () => [200, {}, secondChildDependenciesBody];

    dependency = {
      module: 'test-module',
      firstVersionHint: '^1.0.0',
      secondVersionHint: '^2.0.0'
    };
    nestingLevel = 2;
    shouldOnlyShowDifferent = false;
    stopCrawling = false;

    this.set('repoWorkingDate', new Date(Date.UTC(2015, 1, 1)));
    this.set('repoBrokenDate',  new Date(Date.UTC(2015, 3, 1)));

    onDoneCrawling = () => {};

    // this.inject.service('config', { as: 'config' });
    // this.set('config.cacheTime', 10);
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
  server.get('http://test-host/api/npm/test-module@1.0.1/dependencies', function() {
    firstDependenciesCallback(...arguments);
    return firstDependenciesResponse(...arguments);
  });
  server.get('http://test-host/api/npm/test-module@2.0.1/dependencies', function() {
    secondDependenciesCallback(...arguments);
    return secondDependenciesResponse(...arguments);
  });
  server.get('http://test-host/api/npm/test-child-module/versions', function() {
    childVersionsCallback(...arguments);
    return childVersionsResponse(...arguments);
  });
  server.get('http://test-host/api/npm/test-child-module@1.1.0/dependencies', function() {
    firstChildDependenciesCallback(...arguments);
    return firstChildDependenciesResponse(...arguments);
  });
  server.get('http://test-host/api/npm/test-child-module@2.1.0/dependencies', function() {
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

test('hides row when same', function(assert) {
  assert.expect(1);

  dependency.secondVersionHint = '^1.0.0';
  shouldOnlyShowDifferent = true;

  versionsBody = {
    "1.0.1": "2015-01-01T00:00:00.000Z"
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$().text().trim(), '');
  });
});

test('doesn\'t hide row when same', function(assert) {
  assert.expect(1);

  dependency.secondVersionHint = '^1.0.0';

  versionsBody = {
    "1.0.1": "2015-01-01T00:00:00.000Z"
  };

  render.call(this);

  return wait().then(() => {
    assert.notStrictEqual(this.$().text().trim(), '');
  });
});

test('respects nesting level', function(assert) {
  assert.expect(1);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .module')[0].style.paddingLeft, '2em');
  });
});

test('doesn\'t show unnecessary nesting level', function(assert) {
  assert.expect(1);

  nestingLevel = 0;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .module')[0].style.paddingLeft, '');
  });
});

test('shows module', function(assert) {
  assert.expect(1);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .module').text().trim(), 'test-module');
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
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version').text().trim(), 'Error retrieving module from npm: Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version').text().trim(), 'Error retrieving module from npm: Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
    assert.notOk(called);
  });
});

test('handles missing versions', function(assert) {
  assert.expect(4);

  delete dependency['firstVersionHint'];
  delete dependency['secondVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version').text().trim(), 'missing');
  });
});

test('handles first version missing', function(assert) {
  assert.expect(8);

  delete dependency['firstVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module > .second-version-hint').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module > .second-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version .is-missing').length, 1);
  });
});

test('handles second version missing', function(assert) {
  assert.expect(8);

  delete dependency['secondVersionHint'];

  render.call(this);

  return wait().then(() => {
    assert.notStrictEqual(this.$('.dependency-row.test-module > .first-version-hint').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.dependency-row.test-module > .first-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version').text().trim(), 'missing');
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version-hint .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .first-version .is-missing').length, 1);
    assert.strictEqual(   this.$('.dependency-row.test-module > .second-version .is-missing').length, 1);
  });
});

test('hints display correctly', function(assert) {
  assert.expect(2);

  versionsBody = {
    "1.0.1": "2015-01-01T00:00:00.000Z"
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version-hint').text().trim(), '^1.0.0');
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version-hint').text().trim(), '^2.0.0');
  });
});

test('hints are same', function(assert) {
  assert.expect(2);

  dependency.secondVersionHint = '^1.0.0';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version-hint .hints-are-different').length, 0);
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version-hint .hints-are-different').length, 0);
  });
});

test('hints are different', function(assert) {
  assert.expect(2);

  versionsBody = {
    "1.0.1": "2015-01-01T00:00:00.000Z"
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version-hint .hints-are-different').length, 1);
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version-hint .hints-are-different').length, 1);
  });
});

test('versions display correctly', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version').text().trim(), '1.0.1');
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version').text().trim(), '2.0.1');
  });
});

test('versions are same', function(assert) {
  assert.expect(2);

  dependency.secondVersionHint = '^1.0.0';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version .versions-are-different').length, 0);
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version .versions-are-different').length, 0);
  });
});

test('versions are different', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-module > .first-version .versions-are-different').length, 1);
    assert.strictEqual(this.$('.dependency-row.test-module > .second-version .versions-are-different').length, 1);
  });
});

test('sends action when done', function(assert) {
  assert.expect(1);

  onDoneCrawling = dependency => {
    assert.deepEqual(dependency, {
      module: 'test-module',
      firstVersionHint: '^1.0.0',
      secondVersionHint: '^2.0.0'
    });
  };

  render.call(this);

  return wait();
});

test('shows child dependencies', function(assert) {
  assert.expect(5);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-child-module > .module').text().trim(), 'test-child-module');
    assert.strictEqual(this.$('.dependency-row.test-child-module > .first-version-hint').text().trim(), '^1.0.0');
    assert.strictEqual(this.$('.dependency-row.test-child-module > .second-version-hint').text().trim(), '^2.0.0');
    assert.strictEqual(this.$('.dependency-row.test-child-module > .first-version').text().trim(), '1.1.0');
    assert.strictEqual(this.$('.dependency-row.test-child-module > .second-version').text().trim(), '2.1.0');
  });
});
