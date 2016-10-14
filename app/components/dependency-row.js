import Ember from 'ember';
import sum from 'ember-cpm/macros/sum';
import { and, not, equal } from 'ember-awesome-macros';

const {
  Component,
  computed: { readOnly }
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

  areVersionHintsDifferent: and(
    'firstVersionHint',
    'secondVersionHint',
    not(equal('firstVersionHint', 'secondVersionHint'))
  ),

  shouldHideRow: and(
    'shouldOnlyShowDifferent',
    not('isSomethingWrong'),
    not('numberOfDifferences')
  )
});
