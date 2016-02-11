import Ember from 'ember';

const {
  Service,
  inject: { service }
} = Ember;

const prefixes = ['http://', 'https://'];

export default Service.extend({
  config: service(),
  ajax: service(),

  sendRequest(url) {
    let prefixMatches = prefixes.filter(s => url.indexOf(s) === 0);
    let didMatchPrefix = prefixMatches.length === 0;
    if (didMatchPrefix) {
      let { serverApiEndpoint } = this.get('config');
      url = `${serverApiEndpoint}/${url}`;
    }

    return this.get('ajax').request(url);
  }
});
