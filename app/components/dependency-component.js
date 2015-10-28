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
  _dateWentBad: new Date(),

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
  dateWentBadObserver: on('init', observer('dateWentBad', function() {
    let dateWentBad = this.get('dateWentBad');
    if (!dateWentBad) {
      return;
    }

    this.set('_dateWentBad', dateWentBad);
  })),

  repoDateString: computed('_repoDate', function() {
    return moment(this.get('_repoDate'));
  }),
  dateWentBadString: computed('_dateWentBad', function() {
    return moment(this.get('_dateWentBad'));
  }),

  dependencyGroups: computed('json', function() {
    let json = this.get('json');
    if (!json) {
      return;
    }

    return [
      ['Dependencies', 'dependencies'],
      ['Dev Dependencies', 'devDependencies'],
      ['Optional Dependencies', 'optionalDependencies']
    ].map(dep => {
      return {
        title: dep[0],
        dependencies: convertDependencies(json[dep[1]])
      };
    }).filter(dep => dep.dependencies);
  }),

  jsonObserver: observer('commit', function() {
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

  latestCommitDataObserver: on('init', observer('repo', 'until', function() {
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
  })),

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
    changeDateWentBad(date) {
      this.set('_dateWentBad', date);
      this.sendAction('dateWentBadUpdated', date);
    }
  }
});

function convertDependencies(dependencies) {
  if (!dependencies) {
    return;
  }

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
