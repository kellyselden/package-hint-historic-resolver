import Ember from 'ember';
import config from '../config/environment';

const {
  Service
} = Ember;

const { serverApiEndpoint } = config.APP;

export default Service.extend({
  serverApiEndpoint,
  limiterTime: 50,
  cacheTime: 1000 * 60 * 60 // one hour
});
