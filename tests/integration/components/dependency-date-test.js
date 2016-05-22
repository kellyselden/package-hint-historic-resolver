import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import { waitFor } from '../../helpers/wait-for';
import wait from 'ember-test-helpers/wait';

let server;
let commitsCallback, packageCallback;
let commitsRequest,  packageRequest;
let getCommitsResponse, getPackageResponse;
let date, repo, commit;
let onDateChanged, onFoundCommitData, onReceivedJson, onError;
let commitRequestCount, packageRequestCount;

moduleForComponent('dependency-date', 'Integration | Component | dependency date', {
  integration: true,
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    date = new Date(Date.UTC(2012, 2, 23, 4, 55, 24, 778));
    repo = 'test-repo';
    commit = '35345';

    onDateChanged = () => {};
    onFoundCommitData = () => {};
    onReceivedJson = () => {};
    onError = () => {};

    commitsCallback = () => {};
    packageCallback = () => {};

    getCommitsResponse = () => ([200, {}, [{
      sha: commit
    }]]);
    getPackageResponse = () => ([200, {}, {
      contents: 'test-contents'
    }]);

    commitsRequest = function() {
      commitsCallback(...arguments);
      return getCommitsResponse(...arguments);
    };
    packageRequest = function() {
      packageCallback(...arguments);
      return getPackageResponse(...arguments);
    };

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
  this.set('date', date);
  this.set('repo', repo);

  this.on('dateChanged', onDateChanged);
  this.on('foundCommitData', onFoundCommitData);
  this.on('receivedJson', onReceivedJson);
  this.on('error', onError);

  server.get('https://api.github.com/repos/:repo/commits', commitsRequest);
  server.get('https://raw.githubusercontent.com/:repo/:commit/package.json', packageRequest);

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

function waitForDateChange(context) {
  return waitForCalandar(context).then(() => {
    $('.xdsoft_date:not(.xdsoft_current):first').click();
  });
}

test('renders', function(assert) {
  assert.expect(1);

  // date can be a positional param
  this.render(hbs`
    {{dependency-date
      date
    }}
  `);

  // shows input
  assert.strictEqual(this.$('.date-time-picker').length, 1);

  // calendar pops up
  return waitForCalandar(this);
});

test('can change date', function(assert) {
  assert.expect(1);

  let done = assert.async();

  onDateChanged = d => {
    assert.notStrictEqual(d, date);

    done();
  };

  render.call(this);

  waitForDateChange(this);
});

test('calls github api for commits', function(assert) {
  assert.expect(2);

  let done = assert.async();

  commitsCallback = ({ params, queryParams }) => {
    assert.strictEqual(params.repo, repo);
    assert.strictEqual(queryParams.until, '2012-03-23T04:55:24.778Z');

    done();
  };

  render.call(this);
});

test('calls github api again if repo changes', function(assert) {
  assert.expect(2);

  commitsCallback = ({ params }) => {
    if (params.repo === repo) {
      this.set('repo', 'kjllkjasdlfkj');
    }
    if (params.repo === 'kjllkjasdlfkj') {
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

  commitsCallback = ({ queryParams }) => {
    if (queryParams.until === '2012-03-23T04:55:24.778Z') {
      this.set('date', new Date(Date.UTC(2013, 2, 23, 4, 55, 24, 778)));
    }
    if (queryParams.until === '2013-03-23T04:55:24.778Z') {
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
  assert.expect(1);

  let done = assert.async();

  onError = error => {
    assert.strictEqual(error, 'Error retrieving latest commit: Error: Ajax operation failed');

    done();
  };

  getCommitsResponse = () => [500, {}, {}];

  render.call(this);
});

test('sends latest commit data', function(assert) {
  assert.expect(1);

  let done = assert.async();

  onFoundCommitData = latestCommit => {
    assert.deepEqual(latestCommit, {
      sha: commit
    });

    done();
  };

  render.call(this);
});

test('calls github api for package.json', function(assert) {
  assert.expect(2);

  let done = assert.async();

  packageCallback = ({ params }) => {
    assert.strictEqual(params.repo, repo);
    assert.strictEqual(params.commit, commit);

    done();
  };

  render.call(this);
});

test('gets new package.json if repo and commit changes', function(assert) {
  assert.expect(2);

  packageCallback = ({ params }) => {
    if (params.commit === commit) {
      commit = '95670';
      this.set('repo', 'kjllkjasdlfkj');
    }
    if (params.commit === '95670') {
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

  packageCallback = ({ params }) => {
    if (params.commit === commit) {
      commit = '95670';
      this.set('date', new Date(Date.UTC(2013, 2, 23, 4, 55, 24, 778)));
    }
    if (params.commit === '95670') {
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
    commit = '95670';
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
    commit = '95670';
    this.set('date', null);
  };

  render.call(this);

  return wait().then(() => {
    assert.strictEqual(packageRequestCount, 1);
  });
});

test('sends package.json contents', function(assert) {
  assert.expect(1);

  let done = assert.async();

  onReceivedJson = data => {
    assert.deepEqual(data, {
      contents: 'test-contents'
    });

    done();
  };

  render.call(this);
});

test('handles error retrieving package.json', function(assert) {
  assert.expect(1);

  let done = assert.async();

  onError = error => {
    assert.strictEqual(error, 'Error retrieving package.json: Error: Ajax operation failed');

    done();
  };

  getPackageResponse = () => [500, {}, {}];

  render.call(this);
});
