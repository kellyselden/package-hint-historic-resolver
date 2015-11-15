import Ember from 'ember';
import conditional from 'ember-cpm/macros/conditional';
import normalizeDependencies from '../utils/normalize-dependencies';
import mergeModules from '../utils/merge-modules';

const {
  on,
  computed,
  computed: { and, not },
  observer
} = Ember;

export default Ember.Component.extend({
  _repoWorkingDate: new Date(),
  _repoBrokenDate: new Date(),

  repoUrlObserver: on('init', observer('repoUrl', function() {
    this.set('_repoUrl', this.get('repoUrl'));
  })),
  repoWorkingDateObserver: on('init', observer('repoWorkingDate', function() {
    let repoWorkingDate = this.get('repoWorkingDate');
    if (!repoWorkingDate) {
      return;
    }

    this.set('_repoWorkingDate', repoWorkingDate);
  })),
  repoBrokenDateObserver: on('init', observer('repoBrokenDate', function() {
    let repoBrokenDate = this.get('repoBrokenDate');
    if (!repoBrokenDate) {
      return;
    }

    this.set('_repoBrokenDate', repoBrokenDate);
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

  dependencyGroups: computed('firstJson', 'secondJson', function() {
    let firstJson  = this.get('firstJson');
    let secondJson = this.get('secondJson');
    if (!firstJson || !secondJson) {
      return;
    }

    return [
      ['Dependencies', 'dependencies'],
      ['Dev Dependencies', 'devDependencies'],
      ['Optional Dependencies', 'optionalDependencies']
    ].map(dep => {
      let firstDependencies = normalizeDependencies(firstJson[dep[1]]);
      let secondDependencies = normalizeDependencies(secondJson[dep[1]]);
      return {
        title: dep[0],
        dependencies: mergeModules(firstDependencies, secondDependencies)
      };
    }).filter(dep => dep.dependencies.length);
  }),

  toggleCrawlingText: conditional('stopCrawling', 'Start Crawling', 'Stop Crawling'),

  // Ember.computed.gt doesn't work with dates
  areDatesOutOfOrder: computed('_repoWorkingDate', '_repoBrokenDate', function() {
    return this.get('_repoWorkingDate') > this.get('_repoBrokenDate');
  }),

  areDatesInOrder: not('areDatesOutOfOrder'),
  shouldShowTable: and('repoUrl', 'areDatesInOrder'),

  actions: {
    changeRepoUrl(url) {
      this.set('_repoUrl', url);
      this.sendAction('repoUrlUpdated', url);
    },
    changeRepoWorkingDate(date) {
      this.set('_repoWorkingDate', date || new Date());
      this.sendAction('repoWorkingDateUpdated', date);
    },
    changeRepoBrokenDate(date) {
      this.set('_repoBrokenDate', date || new Date());
      this.sendAction('repoBrokenDateUpdated', date);
    },
    updateFirstCommitData(commitData) {
      this.set('firstCommitDate', commitData.commit.author.date);
      this.set('firstCommit', commitData.sha);
    },
    updateSecondCommitData(commitData) {
      this.set('secondCommitDate', commitData.commit.author.date);
      this.set('secondCommit', commitData.sha);
    },
    updateFirstJson(json) {
      this.set('firstJson', json);
    },
    updateSecondJson(json) {
      this.set('secondJson', json);
    },
    toggleCrawling() {
      this.toggleProperty('stopCrawling');
    }
  }
});
