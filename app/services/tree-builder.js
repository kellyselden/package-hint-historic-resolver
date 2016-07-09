import Ember from 'ember';
import computed from 'ember-computed-decorators';

const {
  Service,
  computed: { not, or },
  get, setProperties,
  merge
} = Ember;

export default Service.extend({
  setupComputeds(dependency, shouldSetupVersions = true) {
    let props = {
      @computed('firstVersion', 'secondVersion')
      areVersionsDifferent(firstVersion, secondVersion) {
        if (!firstVersion || !secondVersion) {
          return false;
        }

        return firstVersion !== secondVersion;
      },

      @computed('isSomethingWrong', 'dependencies.@each.numberOfDifferences')
      numberOfDifferences(isSomethingWrong, dependencies) {
        let initialValue = isSomethingWrong ? 1 : 0;

        if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
          return initialValue;
        }

        let numberOfDifferences = dependencies.reduce((previousValue, currentValue) => {
          return previousValue + get(currentValue, 'numberOfDifferences');
        }, initialValue);

        return numberOfDifferences;
      },

      @computed('dependencies.@each.isDoneCrawling')
      isDoneCrawling(dependencies) {
        if (get(dependencies, 'promise') && !get(dependencies, 'isFulfilled')) {
          return false;
        }

        let areChildrenDoneCrawling = !dependencies.filterBy('isDoneCrawling', false).length;
        let stopCrawling = get(this, 'stopCrawling');

        return areChildrenDoneCrawling && !stopCrawling;
      }
    };

    if (shouldSetupVersions) {
      merge(props, {
        isFirstVersionHintMissing:  not('firstVersionHint'),
        isSecondVersionHintMissing: not('secondVersionHint'),
        isOneHintMissing: or('isFirstVersionHintMissing', 'isSecondVersionHintMissing'),
        isSomethingWrong: or('isOneMissing', 'areVersionsDifferent')
      });
    }

    setProperties(dependency, props);
  }
});
