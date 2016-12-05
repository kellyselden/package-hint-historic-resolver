import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

let dependency, shouldOnlyShowDifferent;

let testFirstVersion, testSecondVersion, testFirstVersionHint, testSecondVersionHint;
let testChildFirstVersion, testChildSecondVersion;

moduleForComponent('dependency-row', 'Integration | Component | dependency row', {
  integration: true,
  beforeEach() {
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
  }
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

  return wait().then(() => {
    assert.strictEqual(this.$('.dependency-row.test-child-module.depth-1 > .module')[0].style.paddingLeft, '1em');
  });
});
