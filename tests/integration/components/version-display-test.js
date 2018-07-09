import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | version display', function(hooks) {
  setupRenderingTest(hooks);

  test('it has a class', async function(assert) {
    await render(hbs`{{version-display}}`);

    assert.strictEqual(findAll('.version-display').length, 1);
  });

  test('it shows version', async function(assert) {
    await render(hbs`{{version-display "test version"}}`);

    assert.strictEqual(this.element.textContent.trim(), 'test version');
  });

  test('it shows different versions class', async function(assert) {
    await render(hbs`
      {{version-display
        areVersionsDifferent=true
        areVersionsDifferentClass="test-class"
      }}
    `);

    assert.ok(find('.test-class'));
  });

  test('it shows missing text', async function(assert) {
    await render(hbs`{{version-display isMissing=true}}`);

    assert.strictEqual(this.element.textContent.trim(), 'missing');
  });

  test('it has missing class', async function(assert) {
    await render(hbs`{{version-display isOneMissing=true}}`);

    assert.ok(find('.is-missing'));
  });
});
