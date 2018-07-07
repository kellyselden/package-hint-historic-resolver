import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { settled, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let dependency, shouldOnlyShowDifferent;

let testFirstVersion, testSecondVersion, testFirstVersionHint, testSecondVersionHint;
let testChildFirstVersion, testChildSecondVersion;

module('Integration | Component | dependency row', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    testFirstVersion  = '1.2.1';
    testSecondVersion = '1.5.0';

    testChildFirstVersion  = '1.2.1';
    testChildSecondVersion = '1.5.0';

    testFirstVersionHint  = '^1.0.0';
    testSecondVersionHint = '^1.1.0';
    dependency = {
      module: 'test-module',
      firstVersionHint: testFirstVersionHint,
      secondVersionHint: testSecondVersionHint,
      firstVersion: testFirstVersion,
      secondVersion: testSecondVersion,
      dependencies: [
        {
          module: 'test-child-module',
          firstVersionHint: '^1.0.0',
          secondVersionHint: '^1.1.0',
          firstVersion: testChildFirstVersion,
          secondVersion: testChildSecondVersion,
          dependencies: [
            {
              module: 'test-module',
              firstVersionHint: testFirstVersionHint,
              secondVersionHint: testSecondVersionHint,
              firstVersion: testChildFirstVersion,
              secondVersion: testChildSecondVersion
            }
          ]
        }
      ]
    };
    shouldOnlyShowDifferent = false;
  });

  function render() {
    this.set('dependency', dependency);
    this.set('shouldOnlyShowDifferent', shouldOnlyShowDifferent);

    this.render(hbs`
      {{dependency-row
        dependency=dependency
        shouldOnlyShowDifferent=shouldOnlyShowDifferent
      }}
    `);
  }

  test('respects nesting level', function(assert) {
    assert.expect(1);

    render.call(this);

    return settled().then(() => {
      assert.strictEqual(findAll('.dependency-row.test-module.depth-2 > .module .nesting-item').length, 2);
    });
  });
});
