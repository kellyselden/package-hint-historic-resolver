import AjaxService from 'ember-ajax/services/ajax';
import config from '../config/environment';

const {
  host,
  namespace
} = config.APP;

export default AjaxService.extend({
  host,
  namespace
});
