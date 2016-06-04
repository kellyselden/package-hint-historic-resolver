import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('version-display', 'Integration | Component | version display', {
  integration: true
});

test('it has a class', function(assert) {
  this.render(hbs`{{version-display}}`);

  assert.strictEqual(this.$('.version-display').length, 1);
});

test('it shows version', function(assert) {
  this.render(hbs`{{version-display "test version"}}`);

  assert.strictEqual(this.$().text().trim(), 'test version');
});

test('it shows different versions class', function(assert) {
  this.render(hbs`
    {{version-display
      areVersionsDifferent=true
      areVersionsDifferentClass="test-class"
    }}
  `);

  assert.ok(this.$().find('.test-class').length);
});

test('it shows missing text', function(assert) {
  this.render(hbs`{{version-display isMissing=true}}`);

  assert.strictEqual(this.$().text().trim(), 'missing');
});

test('it has missing class', function(assert) {
  this.render(hbs`{{version-display isOneMissing=true}}`);

  assert.ok(this.$().find('.is-missing').length);
});
