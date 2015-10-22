import Ember from 'ember';
import moment from 'moment';
import pairs from 'lodash/object/pairs';

const {
  computed,
  computed: { collect },
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

  _lookUpPackage() {
    let repo   = this.get('repo'),
        commit = this.get('commit');
    ajax({
      url: `https://raw.githubusercontent.com/${repo}/${commit}/package.json`,
      success: data => {
        let json = JSON.parse(data);
        this.setProperties({
          dependencies: convertDependencies(json.dependencies),
          devDependencies: convertDependencies(json.devDependencies)
        });
      },
      error() {
        console.log(arguments);
      }
    });
  },

  _getCommit() {
    let repo  = this.get('repo'),
        until = this.get('until');
    if (!repo || !until) {
      return;
    }

    ajax({
      url: `https://api.github.com/repos/${repo}/commits?until=${until}`,
      success: data => {
        let [latestCommit] = data;
        if (latestCommit) {
          let { sha, commit: { author: { date } } } = latestCommit;
          this.set('commit', sha);
          this._lookUpPackage();

          this.set('commitDateString', date);
        }
      },
      error() {
        console.log(arguments);
      }
    });
  },

  actions: {
    changeRepoUrl(url) {
      this.set('repoUrl', url);

      if (url.indexOf('/', url.length - 1) !== -1) {
        url = url.substr(url.length - 1);
      }
      let fragments = url.split('/');
      if (fragments.length < 2) {
        return;
      }

      let [repo, user] = fragments.reverse();
      this.set('repo', `${user}/${repo}`);

      this._getCommit();
    },
    changeRepoDate(date) {
      this.set('repoDate', date);
      this.set('until', moment(date).toJSON());

      this._getCommit();
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
