import Ember from 'ember';
import sum from 'ember-cpm/macros/sum';

const {
  Component,
  get,
  computed,
  computed: { not, readOnly, and }
} = Ember;

export default Component.extend({
  tagName: '',

  module:                     readOnly('dependency.module'),
  versionsError:              readOnly('dependency.versionsError'),
  firstVersionHint:           readOnly('dependency.firstVersionHint'),
  secondVersionHint:          readOnly('dependency.secondVersionHint'),
  firstVersion:               readOnly('dependency.firstVersion'),
  secondVersion:              readOnly('dependency.secondVersion'),
  hasFirstCircularReference:  readOnly('dependency.hasFirstCircularReference'),
  hasSecondCircularReference: readOnly('dependency.hasSecondCircularReference'),
  firstDependenciesError:     readOnly('dependency.firstDependenciesError'),
  secondDependenciesError:    readOnly('dependency.secondDependenciesError'),
  dependencies:               readOnly('dependency.dependencies'),
  areVersionsDifferent:       readOnly('dependency.areVersionsDifferent'),
  isFirstVersionHintMissing:  readOnly('dependency.isFirstVersionHintMissing'),
  isSecondVersionHintMissing: readOnly('dependency.isSecondVersionHintMissing'),
  isFirstVersionMissing:      readOnly('dependency.isFirstVersionMissing'),
  isSecondVersionMissing:     readOnly('dependency.isSecondVersionMissing'),
  isOneHintMissing:           readOnly('dependency.isOneHintMissing'),
  isOneMissing:               readOnly('dependency.isOneMissing'),
  isSomethingWrong:           readOnly('dependency.isSomethingWrong'),
  numberOfDifferences:        readOnly('dependency.numberOfDifferences'),

  nestingLevel: 1,

  childNestingLevel: sum('nestingLevel', 1),

  areVersionHintsDifferent: computed('firstVersionHint', 'secondVersionHint', function() {
    let firstVersionHint  = get(this, 'firstVersionHint'),
        secondVersionHint = get(this, 'secondVersionHint');
    return firstVersionHint && secondVersionHint && firstVersionHint !== secondVersionHint;
  }),

  _isEverythingOk: not('isSomethingWrong'),
  _hasNoDifferences: not('numberOfDifferences'),
  shouldHideRow: and('shouldOnlyShowDifferent', '_isEverythingOk', '_hasNoDifferences')
});
