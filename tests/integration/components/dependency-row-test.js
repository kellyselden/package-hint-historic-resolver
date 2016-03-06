import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import wait from 'ember-test-helpers/wait';

let server;

moduleForComponent('dependency-row', 'Integration | Component | dependency row', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;
  },
  afterEach() {
    server.shutdown();
  }
});

test('it renders', function(assert) {
  assert.expect(4);

  this.set('dep', {
    module: 'test-module',
    firstVersionHint: '^1.0.0',
    secondVersionHint: '^2.0.0'
  });
  this.set('repoWorkingDate', new Date(Date.UTC(2015, 1, 1)));
  this.set('repoBrokenDate',  new Date(Date.UTC(2015, 3, 1)));

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
    assert.equal(this.$('.first-version-hint').text().trim(), '^1.0.0');
    assert.equal(this.$('.second-version-hint').text().trim(), '^2.0.0');
    assert.equal(this.$('.first-version').text().trim(), '1.0.1');
    assert.equal(this.$('.second-version').text().trim(), '2.0.1');
  });
});
