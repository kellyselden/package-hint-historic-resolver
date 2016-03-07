import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import cache from 'npm:memory-cache';
import wait from 'ember-test-helpers/wait';

let server;

moduleForComponent('dependency-row', 'Integration | Component | dependency row', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    this.set('repoWorkingDate', new Date(Date.UTC(2015, 1, 1)));
    this.set('repoBrokenDate',  new Date(Date.UTC(2015, 3, 1)));
  },
  afterEach() {
    server.shutdown();

    cache.clear();
  }
});

test('hides row when same', function(assert) {
  assert.expect(1);

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0',
    secondVersionHint: '^1.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
      shouldOnlyShowDifferent=true
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$().text().trim(), '');
  });
});

test('shows module', function(assert) {
  assert.expect(1);

  this.set('dep', {
    module: 'test-module'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.module').text().trim(), 'test-module');
  });
});

test('handles failed request', function(assert) {
  assert.expect(2);

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0',
    secondVersionHint: '^1.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [500, {}, {}];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version').text().trim(), 'Error: Adapter operation failed');
    assert.strictEqual(this.$('.second-version').text().trim(), 'Error: Adapter operation failed');
  });
});

test('handles missing versions', function(assert) {
  assert.expect(4);

  this.set('dep', {
    module: 'test-module'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z",
      "2.0.1": "2015-03-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version').text().trim(), 'missing');
  });
});

test('handles first version missing', function(assert) {
  assert.expect(4);

  this.set('dep', {
    module: 'test-module',
    secondVersionHint: '^1.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.first-version').text().trim(), 'missing');
    assert.strictEqual(this.$('.second-version .is-missing').length, 1);
  });
});

test('handles second version missing', function(assert) {
  assert.expect(4);

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version-hint').text().trim(), 'missing');
    assert.strictEqual(this.$('.first-version .is-missing').length, 1);
    assert.strictEqual(this.$('.second-version').text().trim(), 'missing');
  });
});

test('it renders', function(assert) {
  assert.expect(4);

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0',
    secondVersionHint: '^2.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z",
      "2.0.1": "2015-03-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
    }}
  `);

  return wait().then(() => {
    assert.strictEqual(this.$('.first-version-hint').text().trim(), '^1.0.0');
    assert.strictEqual(this.$('.second-version-hint').text().trim(), '^2.0.0');
    assert.strictEqual(this.$('.first-version').text().trim(), '1.0.1');
    assert.strictEqual(this.$('.second-version').text().trim(), '2.0.1');
  });
});

test('sends action when done', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0',
    secondVersionHint: '^2.0.0'
  });

  server.get('http://test-host/api/npm/test-module/versions', () => {
    return [200, {}, {
      "1.0.1": "2015-01-01T00:00:00.000Z",
      "2.0.1": "2015-03-01T00:00:00.000Z"
    }];
  });

  this.render(hbs`
    {{dependency-row
      dep=dep
      repoWorkingDate=repoWorkingDate
      repoBrokenDate=repoBrokenDate
      doneCrawling="doneCrawling"
    }}
  `);

  this.on('doneCrawling', dep => {
    assert.deepEqual(dep, {
      module: 'test-module',
      firstVersionHint: '^1.0.0',
      secondVersionHint: '^2.0.0'
    });

    done();
  });
});
