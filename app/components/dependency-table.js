import Ember from 'ember';
import moment from 'moment';
import pairs from 'lodash/object/pairs';

const {
  computed,
  computed: { collect, readOnly },
  RSVP: { Promise },
  $: { ajax }
} = Ember;

export default Ember.Component.extend({
  repoDate: new Date(),
  firstDateToCheck: new Date(),
  secondDateToCheck: new Date(),

  datesToCheck: collect('firstDateToCheck', 'secondDateToCheck'),

  firstDateToCheckString: computed('firstDateToCheck', function() {
    return moment(this.get('firstDateToCheck'));
  }),
  secondDateToCheckString: computed('secondDateToCheck', function() {
    return moment(this.get('secondDateToCheck'));
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

  repo: computed('repoUrl', function() {
    let url = this.get('repoUrl');
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

  until: computed('repoDate', function() {
    let date = this.get('repoDate');
    if (!date) {
      return;
    }

    return moment(date).toJSON();
  }),

  actions: {
    changeRepoUrl(url) {
      this.set('repoUrl', url);
    },
    changeRepoDate(date) {
      this.set('repoDate', date);
    },
    changeFirstDateToCheck(date) {
      this.set('firstDateToCheck', date);
    },
    changeSecondDateToCheck(date) {
      this.set('secondDateToCheck', date);
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
          url: `http://localhost:3000/api/v1/time/${module}`,
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
