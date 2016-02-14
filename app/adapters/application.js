import DS from 'ember-data';
import config from '../config/environment';

const {
  JSONAPIAdapter
} = DS;

const {
  host,
  namespace
} = config.APP;

export default JSONAPIAdapter.extend({
  host,
  namespace
});
