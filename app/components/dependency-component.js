import Ember from 'ember';
import config from '../config/environment';
import moment from 'moment';
import pairs from 'lodash/object/pairs';

const {
  on,
  computed,
  computed: { readOnly },
  observer,
  RSVP: { Promise },
  $: { ajax }
} = Ember;
const { APP: { serverApiEndpoint } } = config;

export default Ember.Component.extend({
  _repoDate: new Date(),
  _firstDateToCheck: new Date(),
  _secondDateToCheck: new Date(),

  repoUrlObserver: on('init', observer('repoUrl', function() {
    this.set('_repoUrl', this.get('repoUrl'));
  })),
  repoDateObserver: on('init', observer('repoDate', function() {
    let repoDate = this.get('repoDate');
    if (!repoDate) {
      return;
    }

    this.set('_repoDate', repoDate);
  })),
  firstDateToCheckObserver: on('init', observer('firstDateToCheck', function() {
    let firstDateToCheck = this.get('firstDateToCheck');
    if (!firstDateToCheck) {
      return;
    }

    this.set('_firstDateToCheck', firstDateToCheck);
  })),
  secondDateToCheckObserver: on('init', observer('secondDateToCheck', function() {
    let secondDateToCheck = this.get('secondDateToCheck');
    if (!secondDateToCheck) {
      return;
    }

    this.set('_secondDateToCheck', secondDateToCheck);
  })),

  firstDateToCheckString: computed('_firstDateToCheck', function() {
    return moment(this.get('_firstDateToCheck'));
  }),
  secondDateToCheckString: computed('_secondDateToCheck', function() {
    return moment(this.get('_secondDateToCheck'));
  }),

  dependencies: computed('json.dependencies', function() {
    let dependencies = this.get('json.dependencies');
    if (!dependencies) {
      return;
    }

    return convertDependencies(dependencies);
  }),
  devDependencies: computed('json.devDependencies', function() {
    let dependencies = this.get('json.devDependencies');
    if (!dependencies) {
      return;
    }

    return convertDependencies(dependencies);
  }),

  json: computed('repo', 'commit', function() {
    let repo   = this.get('repo'),
        commit = this.get('commit');
    if (!repo || !commit) {
      return;
    }

    ajax({
      url: `https://raw.githubusercontent.com/${repo}/${commit}/package.json`,
      success: data => {
        let json = JSON.parse(data);
        this.set('json', json);
      },
      error() {
        console.log(arguments);
      }
    });
  }),

  commitDateString: readOnly('latestCommitData.commit.author.date'),
  commit: readOnly('latestCommitData.sha'),

  latestCommitData: computed('repo', 'until', function() {
    let repo  = this.get('repo'),
        until = this.get('until');
    if (!repo || !until) {
      return;
    }

    ajax({
      url: `https://api.github.com/repos/${repo}/commits?until=${until}`,
      success: data => {
        let [latestCommit] = data;
        this.set('latestCommitData', latestCommit);
      },
      error() {
        console.log(arguments);
      }
    });
  }),

  repo: computed('_repoUrl', function() {
    let url = this.get('_repoUrl');
    if (!url) {
      return;
    }

    if (url.indexOf('/', url.length - 1) !== -1) {
      url = url.substr(url.length - 1);
    }
    let fragments = url.split('/');
    if (fragments.length < 2) {
      return;
    }

    let [repo, user] = fragments.reverse();
    return `${user}/${repo}`;
  }),

  until: computed('_repoDate', function() {
    let date = this.get('_repoDate');
    if (!date) {
      return;
    }

    return moment(date).toJSON();
  }),

  actions: {
    changeRepoUrl(url) {
      this.set('_repoUrl', url);
      this.sendAction('repoUrlUpdated', url);
    },
    changeRepoDate(date) {
      this.set('_repoDate', date);
      this.sendAction('repoDateUpdated', date);
    },
    changeFirstDateToCheck(date) {
      this.set('_firstDateToCheck', date);
      this.sendAction('firstDateToCheckUpdated', date);
    },
    changeSecondDateToCheck(date) {
      this.set('_secondDateToCheck', date);
      this.sendAction('secondDateToCheckUpdated', date);
    }
  }
});

function convertDependencies(dependencies) {
  return pairs(dependencies).map(dep => {
    let [module, version] = dep;
    return {
      module,
      version,
      versionsPromise: new Promise((resolve, reject) => {
        ajax({
          url: `${serverApiEndpoint}/npm/${module}`,
          success: data => {
            delete data.modified;
            delete data.created;
            resolve(pairs(data));
          },
          error: reject
        });
      })
    };
  });
}
