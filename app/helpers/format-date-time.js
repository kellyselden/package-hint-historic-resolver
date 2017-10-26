import { helper } from '@ember/component/helper';
import moment from 'moment';

export function formatDateTime([date]) {
  return moment(date).format('lll');
}

export default helper(formatDateTime);
