import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

let dependencyGroup, firstCommitDate, secondCommitDate, repoWorkingDate, repoBrokenDate;

moduleForComponent('dependency-table', 'Integration | Component | dependency table', {
  integration: true,
  beforeEach() {
    dependencyGroup = {
      title: 'test title'
    };
    firstCommitDate  = new Date(2012, 2, 23, 4, 55);
    secondCommitDate = new Date(2013, 2, 23, 4, 55);
    repoWorkingDate  = new Date(2012, 3, 23, 4, 55);
    repoBrokenDate   = new Date(2013, 3, 23, 4, 55);
  }
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

  assert.equal(this.$('.group-title').text().trim(), 'test title');
  assert.equal(this.$('.first-commit-date').text().trim(),  'Mar 23, 2012 4:55 AM');
  assert.equal(this.$('.second-commit-date').text().trim(), 'Mar 23, 2013 4:55 AM');
  assert.equal(this.$('.repo-working-date').text().trim(),  'Apr 23, 2012 4:55 AM');
  assert.equal(this.$('.repo-broken-date').text().trim(),   'Apr 23, 2013 4:55 AM');
});
