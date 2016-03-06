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

    server.get('https://api.github.com/repos/test-repo/commits', () => {
      return [200, {}, [{
        sha: 35345
      }]];
    });
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

test('shows input', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{dependency-date}}
  `);

  assert.strictEqual(this.$('.date-time-picker').length, 1);
});

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
    assert.deepEqual(latestCommit, {
      sha: 35345
    });

    done();
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

test('calls github api for package.json', function(assert) {
  assert.expect(0);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  server.get('https://raw.githubusercontent.com/test-repo/35345/package.json', () => {
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

test('sends package.json contents', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  this.on('receivedJson', data => {
    assert.deepEqual(data, {
      contents: 'test-contents'
    });

    done();
  });

  server.get('https://raw.githubusercontent.com/test-repo/35345/package.json', () => {
    return [200, {}, {
      contents: 'test-contents'
    }];
  });

  this.render(hbs`
    {{dependency-date
      date
      repo=repo
      receivedJson="receivedJson"
    }}
  `);

  waitForDateChange(this);
});

test('handles error retrieving package.json', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.set('date', date);
  this.set('repo', 'test-repo');

  this.on('error', error => {
    assert.strictEqual(error, 'Error retrieving package.json: Error: Ajax operation failed');

    done();
  });

  server.get('https://raw.githubusercontent.com/test-repo/35345/package.json', () => {
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
