import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function formatDateTime([date]) {
  return moment(date).format('lll');
});
