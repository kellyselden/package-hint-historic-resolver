import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import { waitFor } from '../../helpers/wait-for';
import wait from 'ember-test-helpers/wait';

let server;
let commitsCallback, packageCallback;
let commitsResponse, packageResponse;
let testDate, testRepo, testCommit;
let onDateChanged, onFoundCommitData, onReceivedJson, onError;
let commitRequestCount, packageRequestCount;

moduleForComponent('dependency-date', 'Integration | Component | dependency date', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    testDate = new Date(Date.UTC(2012, 2, 23, 4, 55, 24, 778));
    testRepo = 'test-repo';
    testCommit = '35345';

    onDateChanged = () => {};
    onFoundCommitData = () => {};
    onReceivedJson = () => {};
    onError = () => {};

    commitsCallback = () => {};
    packageCallback = () => {};

    commitsResponse = () => ([200, {}, [{
      sha: testCommit
    }]]);
    packageResponse = () => ([200, {}, {
      contents: 'test-contents'
    }]);

    commitRequestCount = 0;
    packageRequestCount = 0;
    server.handledRequest = (verb, path) => {
      if (path.indexOf('https://api.github.com/') !== -1) {
        commitRequestCount++;
      }
      if (path.indexOf('https://raw.githubusercontent.com/') !== -1) {
        packageRequestCount++;
      }
    };
  },
  afterEach() {
    server.shutdown();
  }
});

function render() {
  this.set('date', testDate);
  this.set('repo', testRepo);

  this.on('dateChanged', onDateChanged);
  this.on('foundCommitData', onFoundCommitData);
  this.on('receivedJson', onReceivedJson);
  this.on('error', onError);

  server.get('https://api.github.com/repos/:repo/commits', function() {
    commitsCallback(...arguments);
    return commitsResponse(...arguments);
  });
  server.get('https://raw.githubusercontent.com/:repo/:commit/package.json', function() {
    packageCallback(...arguments);
    return packageResponse(...arguments);
  });

  this.render(hbs`
    {{dependency-date
      date=date
      repo=repo
      dateChanged="dateChanged"
      foundCommitData="foundCommitData"
      receivedJson="receivedJson"
      error="error"
    }}
  `);
}

function waitForCalandar(context) {
  let cal = context.$('.date-time-picker');

  return waitFor(null, '.xdsoft_datetimepicker', 'body').then(() => {
    cal.mousedown();

    return waitFor(null, '.xdsoft_datetimepicker:visible', 'body');
  });
}

test('renders', function(assert) {
  assert.expect(2);

  // date can be a positional param
  this.render(hbs`
    {{dependency-date
      date
    }}
  `);

  // shows input
  assert.strictEqual(this.$('.date-time-picker').length, 1);

  // has unique class
  assert.strictEqual(this.$('.dependency-date').length, 1);

  // calendar pops up
  return waitForCalandar(this);
});

test('can change date', function(assert) {
  assert.expect(1);

  onDateChanged = d => {
    assert.notStrictEqual(d, testDate);
  };

  render.call(this);

  return waitForCalandar(this).then(() => {
    $('.xdsoft_date:not(.xdsoft_current):first').click();
  });
});

test('calls github api for commits', function(assert) {
  assert.expect(2);

  commitsCallback = ({ params: { repo }, queryParams: { until } }) => {
    assert.strictEqual(repo, testRepo);
    assert.strictEqual(until, '2012-03-23T04:55:24.778Z');
  };

  render.call(this);

  return wait();
});

test('calls github api again if repo changes', function(assert) {
  assert.expect(2);

  commitsCallback = ({ params: { repo } }) => {
    if (repo === testRepo) {
      this.set('repo', 'kjllkjasdlfkj');
    }
    if (repo === 'kjllkjasdlfkj') {
      assert.ok(true);
    }
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(commitRequestCount, 2);
  });
});

test('calls github api again if date changes', function(assert) {
  assert.expect(2);

  commitsCallback = ({ queryParams: { until } }) => {
    if (until === '2012-03-23T04:55:24.778Z') {
      this.set('date', new Date(Date.UTC(2013, 2, 23, 4, 55, 24, 778)));
    }
    if (until === '2013-03-23T04:55:24.778Z') {
      assert.ok(true);
    }
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(commitRequestCount, 2);
  });
});

test('doesn\'t call github api again if repo is removed', function(assert) {
  assert.expect(1);

  commitsCallback = () => {
    this.set('repo', null);
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(commitRequestCount, 1);
  });
});

test('doesn\'t call github api again if date is removed', function(assert) {
  assert.expect(1);

  commitsCallback = () => {
    this.set('date', null);
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(commitRequestCount, 1);
  });
});

test('handles error retrieving commits', function(assert) {
  assert.expect(2);

  let called = false;
  onFoundCommitData = () => {
    called = true;
  };

  onError = error => {
    assert.strictEqual(error, 'Error retrieving latest commit: Error: Ajax operation failed');
  };

  commitsResponse = () => [500, {}, {}];

  render.call(this);

  return wait().then(() => {
    assert.notOk(called);
  });
});

test('sends latest commit data', function(assert) {
  assert.expect(1);

  onFoundCommitData = latestCommit => {
    assert.deepEqual(latestCommit, {
      sha: testCommit
    });
  };

  render.call(this);

  return wait();
});

test('calls github api for package.json', function(assert) {
  assert.expect(2);

  packageCallback = ({ params: { repo, commit } }) => {
    assert.strictEqual(repo, testRepo);
    assert.strictEqual(commit, testCommit);
  };

  render.call(this);

  return wait();
});

test('gets new package.json if repo and commit changes', function(assert) {
  assert.expect(2);

  packageCallback = ({ params: { commit } }) => {
    if (commit === testCommit) {
      testCommit = '95670';
      this.set('repo', 'kjllkjasdlfkj');
    }
    if (commit === '95670') {
      assert.ok(true);
    }
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 2);
  });
});

test('gets new package.json if date and commit changes', function(assert) {
  assert.expect(2);

  packageCallback = ({ params: { commit } }) => {
    if (commit === testCommit) {
      testCommit = '95670';
      this.set('date', new Date(Date.UTC(2013, 2, 23, 4, 55, 24, 778)));
    }
    if (commit === '95670') {
      assert.ok(true);
    }
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 2);
  });
});

test('doesn\'t get new package.json if repo becomes empty', function(assert) {
  assert.expect(1);

  packageCallback = () => {
    testCommit = '95670';
    this.set('repo', null);
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 1);
  });
});

test('doesn\'t get new package.json if date becomes empty', function(assert) {
  assert.expect(1);

  packageCallback = () => {
    testCommit = '95670';
    this.set('date', null);
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 1);
  });
});

test('doesn\'t get new package.json if commit is same after date change', function(assert) {
  assert.expect(1);

  packageCallback = () => {
    this.set('date', new Date(Date.UTC(2013, 2, 23, 4, 55, 24, 778)));
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 1);
  });
});

test('sends package.json contents', function(assert) {
  assert.expect(1);

  onReceivedJson = data => {
    assert.deepEqual(data, {
      contents: 'test-contents'
    });
  };

  render.call(this);

  return wait();
});

test('handles error retrieving package.json', function(assert) {
  assert.expect(2);

  let called = false;
  onReceivedJson = () => {
    called = true;
  };

  onError = error => {
    assert.strictEqual(error, 'Error retrieving package.json: Error: Ajax operation failed');
  };

  packageResponse = () => [500, {}, {}];

  render.call(this);

  return wait().then(() => {
    assert.notOk(called);
  });
});
