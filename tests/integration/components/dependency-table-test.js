import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let dependencyGroup, firstCommitDate, secondCommitDate, repoWorkingDate, repoBrokenDate;

module('Integration | Component | dependency table', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    dependencyGroup = {
      title: 'test title'
    };
    firstCommitDate  = new Date(2012, 2, 23, 4, 55);
    secondCommitDate = new Date(2013, 2, 23, 4, 55);
    repoWorkingDate  = new Date(2012, 3, 23, 4, 55);
    repoBrokenDate   = new Date(2013, 3, 23, 4, 55);
  });

  function render() {
    this.set('dependencyGroup', dependencyGroup);
    this.set('firstCommitDate', firstCommitDate);
    this.set('secondCommitDate', secondCommitDate);
    this.set('repoWorkingDate', repoWorkingDate);
    this.set('repoBrokenDate', repoBrokenDate);

    this.render(hbs`
      {{dependency-table
        dependencyGroup=dependencyGroup
        firstCommitDate=firstCommitDate
        secondCommitDate=secondCommitDate
        repoWorkingDate=repoWorkingDate
        repoBrokenDate=repoBrokenDate
      }}
    `);
  }

  test('it renders', function(assert) {
    assert.expect(5);

    render.call(this);

    assert.equal(find('.group-title').textContent.trim(), 'test title');
    assert.equal(find('.first-commit-date').textContent.trim(),  'Mar 23, 2012 4:55 AM');
    assert.equal(find('.second-commit-date').textContent.trim(), 'Mar 23, 2013 4:55 AM');
    assert.equal(find('.repo-working-date').textContent.trim(),  'Apr 23, 2012 4:55 AM');
    assert.equal(find('.repo-broken-date').textContent.trim(),   'Apr 23, 2013 4:55 AM');
  });
});
