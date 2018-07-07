'use strict';

const fs = require('fs');

module.exports = function(environment) {
  let contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self'",
    'font-src': "'self'",
    'connect-src': "'self'",
    'img-src': "'self'",
    'style-src': "'self'",
    'media-src': "'self'"
  };
  contentSecurityPolicy['script-src'] +=
    ' https://www.google-analytics.com';
  contentSecurityPolicy['connect-src'] +=
    ' https://api.github.com' +
    ' https://raw.githubusercontent.com';
  contentSecurityPolicy['img-src'] +=
    ' https://www.google-analytics.com';
  contentSecurityPolicy['style-src'] +=
    ' https://cdnjs.cloudflare.com';

  let packageJson = fs.readFileSync('package.json');
  packageJson = JSON.parse(packageJson);

  let ENV = {
    modulePrefix: 'package-hint-historic-resolver',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    contentSecurityPolicy: contentSecurityPolicy,
    APP: {
      repository: packageJson.repository
    },
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-69333483-1'
        }
      }
    ],
    moment: {
      allowEmpty: true
    },
    torii: {
      sessionServiceName: 'session',
      providers: {
        'github-oauth2': {
          scope: 'user:email'
        }
      }
    }
  };

  let host;
  let namespace = 'api/v1';

  let testHost = 'http://test-host';

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // https://github.com/xdan/datetimepicker/pull/241
    contentSecurityPolicy['script-src'] += " 'unsafe-eval'";

    // /tests
    contentSecurityPolicy['script-src'] += " 'unsafe-inline'";

    host = 'http://localhost:3000';

    contentSecurityPolicy['connect-src'] += ` ${testHost}`;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    host = testHost;
    namespace = 'api';
  }

  if (environment === 'production') {
    host = process.env.HOST;
  }

  contentSecurityPolicy['connect-src'] +=
    ` ${host}`;

  ENV.APP.host = host;
  ENV.APP.namespace = namespace;
  ENV.APP.serverApiEndpoint = `${host}/${namespace}`;

  return ENV;
};
