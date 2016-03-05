import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import { waitFor } from '../../helpers/wait-for';

let server;
let date = new Date(Date.UTC(2012, 2, 23, 4, 55, 24, 778));

moduleForComponent('dependency-date', 'Integration | Component | dependency date', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;
  },
  afterEach() {
    server.shutdown();
  }
});

function waitForCalandar(context) {
  let cal = context.$('.date-time-picker');

  return waitFor(null, '.xdsoft_datetimepicker', 'body').then(() => {
    cal.mousedown();

    return waitFor(null, '.xdsoft_datetimepicker:visible', 'body');
  });
}

function waitForDateChange(context) {
  return waitForCalandar(context).then(() => {
    $('.xdsoft_date:not(.xdsoft_current):first').click();
  });
}

test('calendar pops up', function(assert) {
  assert.expect(0);

  this.set('date', date);

  this.render(hbs`
    {{dependency-date
      date
    }}
  `);

  return waitForCalandar(this);
});

test('can change date', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);

  this.on('dateChanged', d => {
    assert.notStrictEqual(d, date);

    done();
  });

  this.render(hbs`
    {{dependency-date
      date
      dateChanged="dateChanged"
    }}
  `);

  waitForDateChange(this);
});

test('calls github api for commits', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  server.get('https://api.github.com/repos/test-repo/commits', request => {
    assert.strictEqual(request.queryParams.until, '2012-03-23T04:55:24.778Z');

    done();
  });

  this.render(hbs`
    {{dependency-date
      date
      repo=repo
    }}
  `);

  waitForDateChange(this);
});

test('handles error retrieving commits', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  this.on('error', error => {
    assert.strictEqual(error, 'Error retrieving latest commit: Error: Ajax operation failed');

    done();
  });

  server.get('https://api.github.com/repos/test-repo/commits', () => {
    return [500, {}, {}];
  });

  this.render(hbs`
    {{dependency-date
      date
      repo=repo
      error="error"
    }}
  `);

  waitForDateChange(this);
});

test('sends latest commit data', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  this.on('foundCommitData', latestCommit => {
    assert.strictEqual(latestCommit, 12);

    done();
  });

  server.get('https://api.github.com/repos/test-repo/commits', () => {
    return [200, {}, [12]];
  });

  this.render(hbs`
    {{dependency-date
      date
      repo=repo
      foundCommitData="foundCommitData"
    }}
  `);

  waitForDateChange(this);
});
