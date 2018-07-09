import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import testDateChange from '../../helpers/test-date-change';
import { setupRender } from 'ember-test-setup';

module('Integration | Component | repo date row', function(hooks) {
  setupRenderingTest(hooks);

  let title;
  let repoDate;
  let repoDateError;
  let commit;
  let commitDate;
  let commitError;
  let changeRepoDate;

  hooks.beforeEach(function() {
    title = 'test title';
    repoDate = new Date(2015, 1, 2);
    repoDateError = undefined;
    commit = 'test first commit';
    commitDate = new Date(2015, 1, 1);
    commitError = undefined;

    changeRepoDate = sinon.spy();
  });

  let render = setupRender(hooks, {
    beforeRender() {
      this.set('title', title);
      this.set('repoDate', repoDate);
      this.set('repoDateError', repoDateError);
      this.set('commit', commit);
      this.set('commitDate', commitDate);
      this.set('commitError', commitError);

      this.set('changeRepoDate', changeRepoDate);
    },
    template: hbs`
      {{repo-date-row
        title=title
        repoDate=repoDate
        repoDateError=repoDateError
        commit=commit
        commitDate=commitDate
        commitError=commitError
        changeRepoDate=(action changeRepoDate)
      }}
    `
  });

  test('shows defaults', async function(assert) {
    assert.expect(3);

    await render();

    assert.strictEqual(find('.title').textContent.trim(), title);
    assert.strictEqual(find('.date-time-picker').value, '2015/02/02 0:00');
    assert.strictEqual(find('.commit').textContent.trim(), `Latest commit ${commit} on ${commitDate}`);
  });

  test('shows commit error', async function(assert) {
    assert.expect(2);

    commitError = 'test commit error';

    await render();

    assert.strictEqual(find('.commit-error').textContent.trim(), `Error getting commit: ${commitError}`);
    assert.notOk(find('.commit'));
  });

  test('shows repo working date error', async function(assert) {
    assert.expect(1);

    repoDateError = 'test repo date error';

    await render();

    assert.strictEqual(find('.repo-date-error').textContent.trim(), `Error getting package.json: ${repoDateError}`);
  });

  test('sends date update event', function(assert) {
    return testDateChange(
      assert,
      render,
      '.date-time-picker',
      repoDate,
      changeRepoDate
    );
  });
});
