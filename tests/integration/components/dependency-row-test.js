import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';
import wait from 'ember-test-helpers/wait';

let server;
let versionsRequest;
let dep, shouldOnlyShowDifferent;
let onDoneCrawling;

moduleForComponent('dependency-row', 'Integration | Component | dependency row', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    versionsRequest = () => {
      return [200, {}, {
        "1.0.1": "2015-01-01T00:00:00.000Z",
        "2.0.1": "2015-03-01T00:00:00.000Z"
      }];
    };

    dep = {
      module: 'test-module',
      firstVersionHint: '^1.0.0',
      secondVersionHint: '^2.0.0'
    };
    shouldOnlyShowDifferent = false;

    this.set('repoWorkingDate', new Date(Date.UTC(2015, 1, 1)));
    this.set('repoBrokenDate',  new Date(Date.UTC(2015, 3, 1)));

    onDoneCrawling = () => {};
  },
  afterEach() {
    server.shutdown();

    cache.clear();
  }
});

function render() {
  this.set('dep', dep);
  this.set('shouldOnlyShowDifferent', shouldOnlyShowDifferent);

  server.get('http://test-host/api/npm/test-module/versions', versionsRequest);

  this.on('doneCrawling', onDoneCrawling);

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
      shouldOnlyShowDifferent=shouldOnlyShowDifferent
      doneCrawling="doneCrawling"
    }}
  `);
}

test('hides row when same', function(assert) {
  assert.expect(1);

  dep.secondVersionHint = '^1.0.0';
  shouldOnlyShowDifferent = true;

  versionsRequest = () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$().text().trim(), '');
  });
});

test('doesn\'t hide row when same', function(assert) {
  assert.expect(1);

  dep.secondVersionHint = '^1.0.0';

  versionsRequest = () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  };

  render.call(this);

  return wait().then(() => {
    assert.notStrictEqual(this.$().text().trim(), '');
  });
});

test('shows module', function(assert) {
  assert.expect(1);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.module').text().trim(), 'test-module');
  });
});

test('handles failed request', function(assert) {
  assert.expect(2);

  versionsRequest = () => {
    return [500, {}, {}];
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version').text().trim(), 'Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
    assert.strictEqual(this.$('.second-version').text().trim(), 'Error: Ember Data Request undefined http://test-host/api/npm/test-module/versions returned a 500\nPayload (Empty Content-Type)\n[object Object]');
  });
});

test('handles missing versions', function(assert) {
  assert.expect(4);

  dep.firstVersionHint  = undefined;
  dep.secondVersionHint = undefined;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version').text().trim(), 'missing');
  });
});

test('handles first version missing', function(assert) {
  assert.expect(8);

  dep.firstVersionHint = undefined;

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.second-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.first-version .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version .is-missing').length, 1);
  });
});

test('handles second version missing', function(assert) {
  assert.expect(8);

  dep.secondVersionHint = undefined;

  render.call(this);

  return wait().then(() => {
    assert.notStrictEqual(this.$('.first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version-hint').text().trim(), 'missing');
    assert.notStrictEqual(this.$('.first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.first-version .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version .is-missing').length, 1);
  });
});

test('hints display correctly', function(assert) {
  assert.expect(2);

  versionsRequest = () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), '^1.0.0');
    assert.strictEqual(this.$('.second-version-hint').text().trim(), '^2.0.0');
  });
});

test('hints are same', function(assert) {
  assert.expect(2);

  dep.secondVersionHint = '^1.0.0';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint .hints-are-different').length, 0);
    assert.strictEqual(this.$('.second-version-hint .hints-are-different').length, 0);
  });
});

test('hints are different', function(assert) {
  assert.expect(2);

  versionsRequest = () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint .hints-are-different').length, 1);
    assert.strictEqual(this.$('.second-version-hint .hints-are-different').length, 1);
  });
});

test('versions display correctly', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version').text().trim(), '1.0.1');
    assert.strictEqual(this.$('.second-version').text().trim(), '2.0.1');
  });
});

test('versions are same', function(assert) {
  assert.expect(2);

  dep.secondVersionHint = '^1.0.0';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version .versions-are-different').length, 0);
    assert.strictEqual(this.$('.second-version .versions-are-different').length, 0);
  });
});

test('versions are different', function(assert) {
  assert.expect(2);

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version .versions-are-different').length, 1);
    assert.strictEqual(this.$('.second-version .versions-are-different').length, 1);
  });
});

test('sends action when done', function(assert) {
  assert.expect(1);

  onDoneCrawling = dep => {
    assert.deepEqual(dep, {
      module: 'test-module',
      firstVersionHint: '^1.0.0',
      secondVersionHint: '^2.0.0'
    });
  };

  render.call(this);

  return wait();
});
