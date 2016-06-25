import { test } from 'qunit';
import moduleForAcceptance from 'package-hint-historic-resolver/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';

let server;
let user;
let repo;
let userRepo;
let sha;
let commitDate;

moduleForAcceptance('Acceptance | application', {
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    user = 'test-user';
    repo = 'test-repo';
    userRepo = `${user}/${repo}`;
    sha = 'test-sha';
    commitDate = 'test date';

    server.get(`https://api.github.com/repos/${userRepo}/commits`, function() {
      return [200, {}, [{
        sha,
        commit: {
          author: {
            date: commitDate
          }
        }
      }]];
    });

    server.get(`https://raw.githubusercontent.com/${userRepo}/${sha}/package.json`, function() {
      return [200, {}, {
        dependencies: {
          'test-module': '^1.0.0'
        }
      }];
    });
  },
  afterEach() {
    server.shutdown();
  }
});

test('visiting /', function(assert) {
  let repoWorkingDate = encodeURI(new Date(2016, 5, 1).toISOString());
  let repoBrokenDate  = encodeURI(new Date(2016, 5, 1).toISOString());
  visit(`/?repoWorkingDate=${repoWorkingDate}&repoBrokenDate=${repoBrokenDate}&repoUrl=${user}%2F${repo}`);

  andThen(function() {
    assert.equal(find('.repo-url').val(), userRepo);
    assert.equal(find('.repo').text(), userRepo);
    assert.equal(find('.repo-working-date .date-time-picker').val(), '2016/06/01 0:00');
    assert.equal(find('.repo-working-date .commit').text(), 'Latest commit test-sha on test date');
  });

  andThen(function() {
    assert.equal(find('.repo-broken-date .date-time-picker').val(), '2016/06/01 0:00');
    assert.equal(find('.repo-broken-date .commit').text(), 'Latest commit test-sha on test date');
    assert.equal(server.handlers[0].numberOfCalls, 1, 'identical calls to github api are consolidated');
  });
});
