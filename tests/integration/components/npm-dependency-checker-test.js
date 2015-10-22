import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('npm-dependency-checker', 'Integration | Component | npm dependency checker', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{npm-dependency-checker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#npm-dependency-checker}}
      template block text
    {{/npm-dependency-checker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
