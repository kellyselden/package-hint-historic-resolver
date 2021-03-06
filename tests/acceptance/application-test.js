import { test } from 'qunit';
import moduleForAcceptance from 'package-hint-historic-resolver/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import { authenticateSession } from '../helpers/ember-simple-auth';

const user = 'test-user';
const repo = 'test-repo';
const userRepo = `${user}/${repo}`;
const sha = 'test-sha';
const commitDate = '2016-12-01T08:00:00.000Z';
const module = 'test-module';
const versionHint = '^1.0.0';
const version = '1.0.0';
const githubClientIdUrl = 'http://test-host/api/github/client-id';
const githubClientId = 'test-client-id';
const githubAuthCode = 'test-auth-code';
const githubAccessToken = 'test-access-token';
const githubRateLimit = '60';
const githubRateRemaining = '56';
const githubRateReset = (new Date().getTime() / 1000) + (60 * 60);

let server;
let githubRequestHeaders;
let githubApiHandler;

moduleForAcceptance('Acceptance | application', {
  beforeEach() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    server.get(githubClientIdUrl, () => {
      return [200, {}, {
        'client_id': githubClientId
      }];
    });

    githubApiHandler = server.get(`https://api.github.com/repos/${userRepo}/commits`, request => {
      githubRequestHeaders = request.requestHeaders;

      return [200, {
        'X-RateLimit-Limit': githubRateLimit,
        'X-RateLimit-Remaining': githubRateRemaining,
        'X-RateLimit-Reset': githubRateReset
      }, [{
        sha,
        commit: {
          author: {
            date: commitDate
          }
        }
      }]];
    });

    server.get(`https://raw.githubusercontent.com/${userRepo}/${sha}/package.json`, () => {
      let dependencies = {};
      dependencies[module] = versionHint;
      return [200, {}, { dependencies }];
    });

    server.get(`http://test-host/api/npm/${module}/versions`, () => {
      let versions = {};
      versions[version] = '2015-01-01T00:00:00.000Z';
      return [200, {}, versions];
    });

    server.get(`http://test-host/api/npm/${module}@${version}/dependencies`, () => {
      return [200, {}, {}];
    });
  },
  afterEach() {
    server.shutdown();
  }
});

let testName;

testName = 'loads a fresh page';
test(testName, function(assert) {
  visit('/');

  percySnapshot(testName);

  andThen(function() {
    assert.equal(find('#header').text().trim(), 'Why is CI Broken?');
  });
});

test('handles api auth error', function(assert) {
  server.get(githubClientIdUrl, () => {
    return [500, {}, {}];
  });

  visit('/');

  andThen(function() {
    assert.equal(find('.gtihub-client-id').text().trim(), 'GitHub client ID: The backend responded with an error');
    assert.equal(find('.gtihub-auth').length, 0);
  });
});

test('loads a populated page', function(assert) {
  let repoWorkingDate = encodeURI(new Date(2016, 5, 1).toISOString());
  let repoBrokenDate  = encodeURI(new Date(2016, 5, 1).toISOString());
  visit(`/?repoWorkingDate=${repoWorkingDate}&repoBrokenDate=${repoBrokenDate}&repoUrl=${user}%2F${repo}`);

  authenticateSession(this.application, {
    authorizationCode: githubAuthCode,
    accessToken: githubAccessToken
  });

  andThen(function() {
    assert.equal(find('.gtihub-client-id').text().trim(), `GitHub client ID: ${githubClientId}`);
    assert.equal(find('.repo-url').val(), userRepo);
    assert.equal(find('.repo').text(), userRepo);
    assert.equal(find('.repo-working-date .date-time-picker').val(), '2016/06/01 0:00');
    assert.equal(find('.repo-working-date .commit').text(), `Latest commit ${sha} on ${commitDate}`);
  });

  andThen(function() {
    assert.equal(find('.repo-broken-date .date-time-picker').val(), '2016/06/01 0:00');
    assert.equal(find('.repo-broken-date .commit').text(), `Latest commit ${sha} on ${commitDate}`);
    assert.equal(githubApiHandler.numberOfCalls, 1, 'identical calls to github api are consolidated');
    assert.equal(find('.github-auth-code').text().trim(), `GitHub authorization code: ${githubAuthCode}`);
    assert.equal(find('.github-access-token').text().trim(), `GitHub access token: ${githubAccessToken}`);
    assert.equal(find('.github-rate-limit').text().trim(), `GitHub API rate limit: ${githubRateLimit}`);
    assert.equal(find('.github-rate-remaining').text().trim(), `GitHub API rate remaining: ${githubRateRemaining}`);
    assert.equal(find('.github-rate-reset').text().trim(), `GitHub API rate reset: in an hour`);
    assert.equal(githubRequestHeaders['Authorization'], `token ${githubAccessToken}`);

    assert.equal(find(`.dependency-row.${module}.depth-0 .module`).text().trim(), module);
    assert.equal(find(`.dependency-row.${module}.depth-0 .first-version-hint`).text().trim(), versionHint);
    assert.equal(find(`.dependency-row.${module}.depth-0 .second-version-hint`).text().trim(), versionHint);
    assert.equal(find(`.dependency-row.${module}.depth-0 .first-version`).text().trim(), version);
    assert.equal(find(`.dependency-row.${module}.depth-0 .second-version`).text().trim(), version);
  });
});
