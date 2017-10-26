import Service from '@ember/service';
import config from '../config/environment';

const { serverApiEndpoint } = config.APP;

export default Service.extend({
  serverApiEndpoint,
  limiterTime: 50,
  cacheTime: 1000 * 60 * 60 // one hour
});
