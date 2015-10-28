import Ember from 'ember';
import moment from 'moment';

export function formatDateTime([date]) {
  return moment(date).format('lll');
}

export default Ember.Helper.helper(formatDateTime);
