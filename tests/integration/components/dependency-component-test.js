import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import waitWithoutTimeoutsAndIntervals from 'ember-test-helpers/wait';
import cache from 'npm:memory-cache';
import Pretender from 'pretender';
import sinon from 'sinon';
import testDateChange from '../../helpers/test-date-change';

function wait() {
  return waitWithoutTimeoutsAndIntervals({ waitForTimersAndIntervals: false });
}

let server;

let repoUrl;
let repo;
let repoWorkingDate;
let repoWorkingDateError;
let repoBrokenDate;
let repoBrokenDateError;
let firstCommit;
let firstCommitDate;
let firstCommitError;
let secondCommit;
let secondCommitDate;
let secondCommitError;
let areDatesOutOfOrder;
let firstJson;
let secondJson;
let shouldOnlyShowDifferent;

let firstDependencies;
let secondDependencies;

let updateRepoUrl;
let updateRepoWorkingDate;
let updateRepoBrokenDate;
let updateShouldOnlyShowDifferent;

let sameModule;
let sameVersionHint;
let sameVersion;
let sameVersionsUrl;
let sameVersionsCallback;
let sameVersionsBody;
let sameVersionsResponse;
let sameDependenciesUrl;
let sameDependenciesCallback;
let sameDependenciesBody;
let sameDependenciesResponse;

let diffModule;
let diffFirstVersionHint;
let diffSecondVersionHint;
let diffFirstVersion;
let diffSecondVersion;
let diffVersionsUrl;
let diffVersionsCallback;
let diffVersionsBody;
let diffVersionsResponse;
let diffFirstDependenciesUrl;
let diffFirstDependenciesCallback;
let diffFirstDependenciesBody;
let diffFirstDependenciesResponse;
let diffSecondDependenciesUrl;
let diffSecondDependenciesCallback;
let diffSecondDependenciesBody;
let diffSecondDependenciesResponse;

let sameChildModule;
let sameChildVersionHint;
let sameChildVersion;
let sameChildVersionsUrl;
let sameChildVersionsCallback;
let sameChildVersionsBody;
let sameChildVersionsResponse;
let sameChildDependenciesUrl;
let sameChildDependenciesCallback;
let sameChildDependenciesBody;
let sameChildDependenciesResponse;

let diffChildModule;
let diffChildFirstVersionHint;
let diffChildSecondVersionHint;
let diffChildFirstVersion;
let diffChildSecondVersion;
let diffChildVersionsUrl;
let diffChildVersionsCallback;
let diffChildVersionsBody;
let diffChildVersionsResponse;
let diffChildFirstDependenciesUrl;
let diffChildFirstDependenciesCallback;
let diffChildFirstDependenciesBody;
let diffChildFirstDependenciesResponse;
let diffChildSecondDependenciesUrl;
let diffChildSecondDependenciesCallback;
let diffChildSecondDependenciesBody;
let diffChildSecondDependenciesResponse;

moduleForComponent('dependency-component', 'Integration | Component | dependency component', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    repoUrl = 'test repo url';
    repo    = 'test repo';
    repoWorkingDate  = new Date(2015, 1, 2);
    repoBrokenDate   = new Date(2015, 3, 2);
    firstCommitDate  = new Date(2015, 1, 1);
    secondCommitDate = new Date(2015, 3, 1);
    firstCommit  = 'test first commit';
    secondCommit = 'test second commit';
    repoWorkingDateError = undefined;
    repoBrokenDateError  = undefined;
    firstCommitError     = undefined;
    secondCommitError    = undefined;
    areDatesOutOfOrder = false;
    firstJson  = {};
    secondJson = {};
    shouldOnlyShowDifferent = false;

    sameModule      = 'test-same-module';
    diffModule      = 'test-diff-module';
    sameChildModule = 'test-child-same-module';
    diffChildModule = 'test-child-diff-module';

    sameVersionHint        = '^2.0.0';
    diffFirstVersionHint       = '^1.0.0';
    diffSecondVersionHint      = '^1.1.0';
    sameChildVersionHint   = '^2.0.0';
    diffChildFirstVersionHint  = '^1.0.0';
    diffChildSecondVersionHint = '^1.1.0';

    sameVersion        = '2.0.1';
    diffFirstVersion       = '1.2.1';
    diffSecondVersion      = '1.5.0';
    sameChildVersion   = '2.0.1';
    diffChildFirstVersion  = '1.2.1';
    diffChildSecondVersion = '1.5.0';

    sameVersionsBody            = {};
    sameDependenciesBody        = {};
    diffVersionsBody            = {};
    diffFirstDependenciesBody       = {};
    diffSecondDependenciesBody      = {};
    sameChildVersionsBody       = {};
    sameChildDependenciesBody   = {};
    diffChildVersionsBody       = {};
    diffChildFirstDependenciesBody  = {};
    diffChildSecondDependenciesBody = {};

    sameVersionsBody[sameVersion]             = '2015-01-01T00:00:00.000Z';
    diffVersionsBody[diffFirstVersion]            = '2015-01-01T00:00:00.000Z';
    diffVersionsBody[diffSecondVersion]           = '2015-03-01T00:00:00.000Z';
    sameChildVersionsBody[sameChildVersion]   = '2015-01-01T00:00:00.000Z';
    diffChildVersionsBody[diffChildFirstVersion]  = '2015-01-01T00:00:00.000Z';
    diffChildVersionsBody[diffChildSecondVersion] = '2015-03-01T00:00:00.000Z';

    sameDependenciesBody[sameChildModule]   = sameChildVersionHint;
    sameDependenciesBody[diffChildModule]   = diffChildFirstVersionHint;
    diffFirstDependenciesBody[diffChildModule]  = diffChildFirstVersionHint;
    diffSecondDependenciesBody[diffChildModule] = diffChildSecondVersionHint;
    diffChildFirstDependenciesBody[diffModule]  = diffFirstVersionHint;
    diffChildSecondDependenciesBody[diffModule] = diffSecondVersionHint;

    firstDependencies  = {};
    secondDependencies = {};
    firstDependencies[sameModule]  = sameVersionHint;
    secondDependencies[sameModule] = sameVersionHint;
    firstDependencies[diffModule]  = diffFirstVersionHint;
    secondDependencies[diffModule] = diffSecondVersionHint;
    firstJson.dependencies  = firstDependencies;
    secondJson.dependencies = secondDependencies;

    updateRepoUrl                 = sinon.spy();
    updateRepoWorkingDate         = sinon.spy();
    updateRepoBrokenDate          = sinon.spy();
    updateShouldOnlyShowDifferent = sinon.spy();

    sameVersionsUrl = `http://test-host/api/npm/${sameModule}/versions`;
    sameDependenciesUrl = `http://test-host/api/npm/${sameModule}@${sameVersion}/dependencies`;
    diffVersionsUrl = `http://test-host/api/npm/${diffModule}/versions`;
    diffFirstDependenciesUrl = `http://test-host/api/npm/${diffModule}@${diffFirstVersion}/dependencies`;
    diffSecondDependenciesUrl = `http://test-host/api/npm/${diffModule}@${diffSecondVersion}/dependencies`;
    sameChildVersionsUrl = `http://test-host/api/npm/${sameChildModule}/versions`;
    sameChildDependenciesUrl = `http://test-host/api/npm/${sameChildModule}@${sameChildVersion}/dependencies`;
    diffChildVersionsUrl = `http://test-host/api/npm/${diffChildModule}/versions`;
    diffChildFirstDependenciesUrl = `http://test-host/api/npm/${diffChildModule}@${diffChildFirstVersion}/dependencies`;
    diffChildSecondDependenciesUrl = `http://test-host/api/npm/${diffChildModule}@${diffChildSecondVersion}/dependencies`;

    sameVersionsCallback = () => {};
    sameDependenciesCallback = () => {};
    diffVersionsCallback            = () => {};
    diffFirstDependenciesCallback       = () => {};
    diffSecondDependenciesCallback      = () => {};
    sameChildVersionsCallback   = () => {};
    sameChildDependenciesCallback = () => {};
    diffChildVersionsCallback       = () => {};
    diffChildFirstDependenciesCallback  = () => {};
    diffChildSecondDependenciesCallback = () => {};

    sameVersionsResponse            = () => [200, {}, sameVersionsBody];
    sameDependenciesResponse        = () => [200, {}, sameDependenciesBody];
    diffVersionsResponse            = () => [200, {}, diffVersionsBody];
    diffFirstDependenciesResponse       = () => [200, {}, diffFirstDependenciesBody];
    diffSecondDependenciesResponse      = () => [200, {}, diffSecondDependenciesBody];
    sameChildVersionsResponse       = () => [200, {}, sameChildVersionsBody];
    sameChildDependenciesResponse   = () => [200, {}, sameChildDependenciesBody];
    diffChildVersionsResponse       = () => [200, {}, diffChildVersionsBody];
    diffChildFirstDependenciesResponse  = () => [200, {}, diffChildFirstDependenciesBody];
    diffChildSecondDependenciesResponse = () => [200, {}, diffChildSecondDependenciesBody];

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
  this.set('repoUrl', repoUrl);
  this.set('repo', repo);
  this.set('repoWorkingDate', repoWorkingDate);
  this.set('repoWorkingDateError', repoWorkingDateError);
  this.set('repoBrokenDate', repoBrokenDate);
  this.set('repoBrokenDateError', repoBrokenDateError);
  this.set('firstCommit', firstCommit);
  this.set('firstCommitDate', firstCommitDate);
  this.set('firstCommitError', firstCommitError);
  this.set('secondCommit', secondCommit);
  this.set('secondCommitDate', secondCommitDate);
  this.set('secondCommitError', secondCommitError);
  this.set('areDatesOutOfOrder', areDatesOutOfOrder);
  this.set('firstJson', firstJson);
  this.set('secondJson', secondJson);
  this.set('shouldOnlyShowDifferent', shouldOnlyShowDifferent);

  this.on('updateRepoUrl', updateRepoUrl);
  this.on('updateRepoWorkingDate', updateRepoWorkingDate);
  this.on('updateRepoBrokenDate', updateRepoBrokenDate);
  this.on('updateShouldOnlyShowDifferent', updateShouldOnlyShowDifferent);

  server.get(sameVersionsUrl, function() {
    sameVersionsCallback(...arguments);
    return sameVersionsResponse(...arguments);
  });
  server.get(sameDependenciesUrl, function() {
    sameDependenciesCallback(...arguments);
    return sameDependenciesResponse(...arguments);
  });
  server.get(diffVersionsUrl, function() {
    diffVersionsCallback(...arguments);
    return diffVersionsResponse(...arguments);
  });
  server.get(diffFirstDependenciesUrl, function() {
    diffFirstDependenciesCallback(...arguments);
    return diffFirstDependenciesResponse(...arguments);
  });
  server.get(diffSecondDependenciesUrl, function() {
    diffSecondDependenciesCallback(...arguments);
    return diffSecondDependenciesResponse(...arguments);
  });
  server.get(sameChildVersionsUrl, function() {
    sameChildVersionsCallback(...arguments);
    return sameChildVersionsResponse(...arguments);
  });
  server.get(sameChildDependenciesUrl, function() {
    sameChildDependenciesCallback(...arguments);
    return sameChildDependenciesResponse(...arguments);
  });
  server.get(diffChildVersionsUrl, function() {
    diffChildVersionsCallback(...arguments);
    return diffChildVersionsResponse(...arguments);
  });
  server.get(diffChildFirstDependenciesUrl, function() {
    diffChildFirstDependenciesCallback(...arguments);
    return diffChildFirstDependenciesResponse(...arguments);
  });
  server.get(diffChildSecondDependenciesUrl, function() {
    diffChildSecondDependenciesCallback(...arguments);
    return diffChildSecondDependenciesResponse(...arguments);
  });

  this.render(hbs`
    {{dependency-component
      repoUrl=repoUrl
      repo=repo
      repoWorkingDate=repoWorkingDate
      repoWorkingDateError=repoWorkingDateError
      repoBrokenDate=repoBrokenDate
      repoBrokenDateError=repoBrokenDateError
      firstCommit=firstCommit
      firstCommitDate=firstCommitDate
      firstCommitError=firstCommitError
      secondCommit=secondCommit
      secondCommitDate=secondCommitDate
      secondCommitError=secondCommitError
      areDatesOutOfOrder=areDatesOutOfOrder
      firstJson=firstJson
      secondJson=secondJson
      shouldOnlyShowDifferent=shouldOnlyShowDifferent
      repoUrlUpdated="updateRepoUrl"
      repoWorkingDateUpdated="updateRepoWorkingDate"
      repoBrokenDateUpdated="updateRepoBrokenDate"
      shouldOnlyShowDifferentUpdated=(action "updateShouldOnlyShowDifferent")
    }}
  `);
}

function testDefault(assert) {
  assert.expect(63);

  return wait().then(() => {
    assert.strictEqual(this.$('.repo-url').val(), repoUrl);
    assert.strictEqual(this.$('.repo').text().trim(), repo);
    assert.strictEqual(this.$('.repo-error').length, 0);
    assert.strictEqual(this.$('.repo-working-date .date-time-picker').val(), '2015/02/02 0:00');
    assert.strictEqual(this.$('.repo-broken-date .date-time-picker').val(), '2015/04/02 0:00');
    assert.strictEqual(this.$('.repo-working-date .commit').text().trim(), `Latest commit ${firstCommit} on ${firstCommitDate}`);
    assert.strictEqual(this.$('.repo-broken-date .commit').text().trim(), `Latest commit ${secondCommit} on ${secondCommitDate}`);
    assert.strictEqual(this.$('.crawling-section').length, 1);
    let testRow = (
      prefix,
      module,
      firstVersionHint,
      secondVersionHint,
      firstVersion,
      secondVersion
    ) => {
      assert.strictEqual(this.$(`${prefix} > .module`).text().trim(), module);
      assert.strictEqual(this.$(`${prefix} > .first-version-hint`).text().trim(), firstVersionHint);
      assert.strictEqual(this.$(`${prefix} > .second-version-hint`).text().trim(), secondVersionHint);
      assert.strictEqual(this.$(`${prefix} > .first-version`).text().trim(), firstVersion);
      assert.strictEqual(this.$(`${prefix} > .second-version`).text().trim(), secondVersion);
      assert.strictEqual(this.$(`${prefix} > .first-version-hint .is-missing`).length, 0);
      assert.strictEqual(this.$(`${prefix} > .second-version-hint .is-missing`).length, 0);
      assert.strictEqual(this.$(`${prefix} > .first-version .is-missing`).length, 0);
      assert.strictEqual(this.$(`${prefix} > .second-version .is-missing`).length, 0);
      assert.strictEqual(this.$(`${prefix} > .first-version-hint .hints-are-different`).length, firstVersionHint === secondVersionHint ? 0 : 1);
      assert.strictEqual(this.$(`${prefix} > .second-version-hint .hints-are-different`).length, firstVersionHint === secondVersionHint ? 0 : 1);
      assert.strictEqual(this.$(`${prefix} > .first-version .versions-are-different`).length, firstVersion === secondVersion ? 0 : 1);
      assert.strictEqual(this.$(`${prefix} > .second-version .versions-are-different`).length, firstVersion === secondVersion ? 0 : 1);
    };
    testRow(`.dependency-row.${sameModule}.depth-1`, sameModule, sameVersionHint, sameVersionHint, sameVersion, sameVersion);
    testRow(`.dependency-row.${diffModule}.depth-1`, diffModule, diffFirstVersionHint, diffSecondVersionHint, diffFirstVersion, diffSecondVersion);
    testRow(`.dependency-row.${sameChildModule}.depth-2`, sameChildModule, sameChildVersionHint, sameChildVersionHint, sameChildVersion, sameChildVersion);
    testRow(`.dependency-row.${diffChildModule}.depth-2:last`, diffChildModule, diffChildFirstVersionHint, diffChildSecondVersionHint, diffChildFirstVersion, diffChildSecondVersion);
    assert.strictEqual(this.$(`.dependency-row.${diffModule}.depth-3 > .first-version .circular-reference`).length, 1);
    assert.strictEqual(this.$(`.dependency-row.${diffModule}.depth-3 > .second-version .circular-reference`).length, 1);
    assert.strictEqual(this.$('.done-crawling').length, 1);
  });
}

test('shows defaults', function(assert) {
  render.call(this);

  return testDefault.call(this, assert);
});

test('shows repo error', function(assert) {
  assert.expect(3);

  repo = null;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.repo-error').text().trim(), `Could not parse Repo URL: ${repoUrl}`);
    assert.strictEqual(this.$('.repo').length, 0);
    assert.strictEqual(this.$('.crawling-section').length, 0);
  });
});

test('sends repo updated event', function(assert) {
  assert.expect(1);

  render.call(this);

  repoUrl += ' new';
  this.$('.repo-url').val(repoUrl).trigger('change');

  return wait().then(() => {
    assert.deepEqual(updateRepoUrl.args, [[repoUrl]]);
  });
});

test('sends working date update event', function(assert) {
  return testDateChange(
    assert,
    render.bind(this),
    '.repo-working-date .date-time-picker',
    repoWorkingDate,
    updateRepoWorkingDate
  );
});

test('sends working date update event', function(assert) {
  return testDateChange(
    assert,
    render.bind(this),
    '.repo-broken-date .date-time-picker',
    repoBrokenDate,
    updateRepoBrokenDate
  );
});

test('sends show different event', function(assert) {
  assert.expect(1);

  render.call(this);

  this.$('.checkbox-with-label').click();

  return wait().then(() => {
    assert.deepEqual(updateShouldOnlyShowDifferent.args, [[true]]);
  });
});

function testRepoDateError(assert, render, repoDateError, cssClass) {
  assert.expect(2);

  render();

  return wait().then(() => {
    assert.strictEqual(this.$(`${cssClass} .repo-date-error`).text().trim(), `Error getting package.json: ${repoDateError}`);
    assert.strictEqual(this.$('.crawling-section').length, 0);
  });
}

test('shows repo working date error', function(assert) {
  repoWorkingDateError = 'test repo working date error';

  return testRepoDateError(
    assert,
    render.bind(this),
    repoWorkingDateError,
    '.repo-working-date'
  );
});

test('shows repo broken date error', function(assert) {
  repoBrokenDateError = 'test repo broken date error';

  return testRepoDateError(
    assert,
    render.bind(this),
    repoBrokenDateError,
    '.repo-broken-date'
  );
});

function testCommitError(assert, render, commitError, cssClass) {
  assert.expect(3);

  render();

  return wait().then(() => {
    assert.strictEqual(this.$(`${cssClass} .commit-error`).text().trim(), `Error getting commit: ${commitError}`);
    assert.strictEqual(this.$(`${cssClass} .commit`).length, 0);
    assert.strictEqual(this.$('.crawling-section').length, 0);
  });
}

test('shows first commit error', function(assert) {
  firstCommitError = 'test first commit error';

  return testCommitError(
    assert,
    render.bind(this),
    firstCommitError,
    '.repo-working-date'
  );
});

test('shows second commit error', function(assert) {
  secondCommitError = 'test second commit error';

  return testCommitError(
    assert,
    render.bind(this),
    secondCommitError,
    '.repo-broken-date'
  );
});

test('shows dates out of order', function(assert) {
  assert.expect(2);

  areDatesOutOfOrder = true;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.dates-out-of-order').length, 1);
    assert.strictEqual(this.$('.crawling-section').length, 0);
  });
});

test('shows versions error', function(assert) {
  assert.expect(1);

  sameVersionsResponse = () => {
    return [500, {}, {}];
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .module`).text().trim().replace(/\s\s+/g, ' '), `${sameModule} Error getting versions: Error: Ember Data Request undefined ${sameVersionsUrl} returned a 500\nPayload (Empty Content-Type)\n[object Object]`);
  });
});

function testVersionMissing(assert, render, isFirst, isSecond) {
  assert.expect(8);

  render.call(this);

  return wait().then(() => {
    function getEqualityFunction(isEqual) { return (isEqual ? assert.strictEqual : assert.notStrictEqual).bind(assert); }
    let assertStrictEqual1 = getEqualityFunction(isFirst);
    let assertStrictEqual2 = getEqualityFunction(isSecond);

    assertStrictEqual1(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version-hint`).text().trim(), 'missing');
    assertStrictEqual2(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version-hint`).text().trim(), 'missing');
    assertStrictEqual1(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version`).text().trim(), 'missing');
    assertStrictEqual2(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version`).text().trim(), 'missing');
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version-hint .is-missing`).length, 1);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version-hint .is-missing`).length, 1);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version .is-missing`).length, 1);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version .is-missing`).length, 1);
  });
}

test('handles first version missing', function(assert) {
  delete firstDependencies[sameModule];

  return testVersionMissing(
    assert,
    render.bind(this),
    true,
    false
  );
});

test('handles second version missing', function(assert) {
  delete secondDependencies[sameModule];

  return testVersionMissing(
    assert,
    render.bind(this),
    false,
    true
  );
});

test('hints and versions are same', function(assert) {
  assert.expect(4);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version-hint .hints-are-different`).length, 0);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version-hint .hints-are-different`).length, 0);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .first-version .versions-are-different`).length, 0);
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .second-version .versions-are-different`).length, 0);
  });
});

test('stop crawling at versions shows error', function(assert) {
  assert.expect(1);

  sameVersionsCallback = () => this.$('.stop-crawling').click();

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1 > .module`).text().trim().replace(/\s\s+/g, ' '), `${sameModule} Error getting versions: TaskCancelation: TaskCancelation`);
  });
});

test('stop crawling at first dependencies shows error', function(assert) {
  assert.expect(1);

  diffFirstDependenciesCallback = () => this.$('.stop-crawling').click();

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${diffModule}.depth-1 > .first-version-hint .error`).text().trim(), 'Error getting dependencies: TaskCancelation: TaskCancelation');
  });
});

test('stop crawling at second dependencies shows error', function(assert) {
  assert.expect(1);

  diffSecondDependenciesCallback = () => this.$('.stop-crawling').click();

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${diffModule}.depth-1 > .second-version-hint .error`).text().trim(), 'Error getting dependencies: TaskCancelation: TaskCancelation');
  });
});

test('can resume crawling', function(assert) {
  sameVersionsCallback = () => this.$('.stop-crawling').click();

  render.call(this);

  return wait().then(() => {
    this.$('.stop-crawling').click();

    return testDefault.call(this, assert);
  });
});

test('can show only different', function(assert) {
  assert.expect(2);

  shouldOnlyShowDifferent = true;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$(`.dependency-row.${sameModule}.depth-1`).length, 1, 'show same when child is different');
    assert.strictEqual(this.$(`.dependency-row.${sameChildModule}.depth-2`).length, 0, 'hides same when no child is different');
  });
});
