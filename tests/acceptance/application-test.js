import { find, findAll, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import { authenticateSession } from '../helpers/ember-simple-auth';
import { percySnapshot } from 'ember-percy';

let server;
let user;
let repo;
let userRepo;
let sha;
let commitDate;
let _module;
let versionHint;
let version;
let githubClientIdUrl;
let githubClientId;
let githubAuthCode;
let githubAccessToken;
let githubRateLimit;
let githubRateRemaining;
let githubRateReset;
let githubRequestHeaders;
let githubApiHandler;

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server = new Pretender();
    server.prepareBody = JSON.stringify;

    user = 'test-user';
    repo = 'test-repo';
    userRepo = `${user}/${repo}`;
    sha = 'test-sha';
    commitDate = '2016-12-01T08:00:00.000Z';
    _module = 'test-module';
    versionHint = '^1.0.0';
    version = '1.0.0';
    githubClientId = 'test-client-id';
    githubAuthCode = 'test-auth-code';
    githubAccessToken = 'test-access-token';
    githubRateLimit = '60';
    githubRateRemaining = '56';
    githubRateReset = (new Date().getTime() / 1000) + (60 * 60);

    githubClientIdUrl = 'http://test-host/api/github/client-id';
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
      dependencies[_module] = versionHint;
      return [200, {}, { dependencies }];
    });

    server.get(`http://test-host/api/npm/${_module}/versions`, () => {
      let versions = {};
      versions[version] = '2015-01-01T00:00:00.000Z';
      return [200, {}, versions];
    });

    server.get(`http://test-host/api/npm/${_module}@${version}/dependencies`, () => {
      return [200, {}, {}];
    });
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  let testName;

  testName = 'loads a fresh page';
  test(testName, async function(assert) {
    await visit('/');

    // percySnapshot(testName);

    assert.equal(find('#header').textContent.trim(), 'Why is CI Broken?');
  });

  test('handles api auth error', async function(assert) {
    server.get(githubClientIdUrl, () => {
      return [500, {}, {}];
    });

    await visit('/');

    assert.equal(find('.gtihub-client-id').textContent.trim(), 'GitHub client ID: The backend responded with an error');
    assert.equal(findAll('.gtihub-auth').length, 0);
  });

  test('loads a populated page', async function(assert) {
    let repoWorkingDate = encodeURI(new Date(2016, 5, 1).toISOString());
    let repoBrokenDate  = encodeURI(new Date(2016, 5, 1).toISOString());
    await visit(`/?repoWorkingDate=${repoWorkingDate}&repoBrokenDate=${repoBrokenDate}&repoUrl=${user}%2F${repo}`);

    authenticateSession(this.application, {
      authorizationCode: githubAuthCode,
      accessToken: githubAccessToken
    });

    assert.equal(find('.gtihub-client-id').textContent.trim(), `GitHub client ID: ${githubClientId}`);
    assert.equal(find('.repo-url').value, userRepo);
    assert.equal(find('.repo').textContent, userRepo);
    assert.equal(find('.repo-working-date .date-time-picker').value, '2016/06/01 0:00');
    assert.equal(find('.repo-working-date .commit').textContent, `Latest commit ${sha} on ${commitDate}`);
    assert.equal(find('.repo-broken-date .date-time-picker').value, '2016/06/01 0:00');
    assert.equal(find('.repo-broken-date .commit').textContent, `Latest commit ${sha} on ${commitDate}`);
    assert.equal(githubApiHandler.numberOfCalls, 1, 'identical calls to github api are consolidated');
    assert.equal(find('.github-auth-code').textContent.trim(), `GitHub authorization code: ${githubAuthCode}`);
    assert.equal(find('.github-access-token').textContent.trim(), `GitHub access token: ${githubAccessToken}`);
    assert.equal(find('.github-rate-limit').textContent.trim(), `GitHub API rate limit: ${githubRateLimit}`);
    assert.equal(find('.github-rate-remaining').textContent.trim(), `GitHub API rate remaining: ${githubRateRemaining}`);
    assert.equal(find('.github-rate-reset').textContent.trim(), `GitHub API rate reset: in an hour`);
    assert.equal(githubRequestHeaders['Authorization'], `token ${githubAccessToken}`);

    assert.equal(find(`.dependency-row.${_module}.depth-0 .module`).textContent.trim(), _module);
    assert.equal(find(`.dependency-row.${_module}.depth-0 .first-version-hint`).textContent.trim(), versionHint);
    assert.equal(find(`.dependency-row.${_module}.depth-0 .second-version-hint`).textContent.trim(), versionHint);
    assert.equal(find(`.dependency-row.${_module}.depth-0 .first-version`).textContent.trim(), version);
    assert.equal(find(`.dependency-row.${_module}.depth-0 .second-version`).textContent.trim(), version);
  });
});
