import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import sinon from 'sinon';
import testDateChange from '../../helpers/test-date-change';

let title;
let repoDate;
let repoDateError;
let commit;
let commitDate;
let commitError;
let changeRepoDate;

moduleForComponent('repo-date-row', 'Integration | Component | repo date row', {
  integration: true,
  beforeEach() {
    title = 'test title';
    repoDate = new Date(2015, 1, 2);
    repoDateError = undefined;
    commit = 'test first commit';
    commitDate = new Date(2015, 1, 1);
    commitError = undefined;

    changeRepoDate = sinon.spy();
  }
});

function render() {
  this.set('title', title);
  this.set('repoDate', repoDate);
  this.set('repoDateError', repoDateError);
  this.set('commit', commit);
  this.set('commitDate', commitDate);
  this.set('commitError', commitError);

  this.on('changeRepoDate', changeRepoDate);

  this.render(hbs`
    {{repo-date-row
      title=title
      repoDate=repoDate
      repoDateError=repoDateError
      commit=commit
      commitDate=commitDate
      commitError=commitError
      changeRepoDate=(action "changeRepoDate")
    }}
  `);
}

test('shows defaults', function(assert) {
  assert.expect(3);

  render.call(this);

  assert.strictEqual(this.$('.title').text().trim(), title);
  assert.strictEqual(this.$('.date-time-picker').val(), '2015/02/02 0:00');
  assert.strictEqual(this.$('.commit').text().trim(), `Latest commit ${commit} on ${commitDate}`);
});

test('shows commit error', function(assert) {
  assert.expect(2);

  commitError = 'test commit error';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.commit-error').text().trim(), `Error getting commit: ${commitError}`);
    assert.strictEqual(this.$('.commit').length, 0);
  });
});

test('shows repo working date error', function(assert) {
  assert.expect(1);

  repoDateError = 'test repo date error';

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(this.$('.repo-date-error').text().trim(), `Error getting package.json: ${repoDateError}`);
  });
});

test('sends date update event', function(assert) {
  return testDateChange(
    assert,
    render.bind(this),
    '.date-time-picker',
    repoDate,
    changeRepoDate
  );
});
