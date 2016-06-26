import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

const {
  inject: { service },
  computed,
  get
} = Ember;

export default AjaxService.extend({
  session: service(),

  host: 'https://api.github.com',

  headers: computed('session.data.authenticated.accessToken', function() {
    let headers = {};

    let accessToken = get(this, 'session.data.authenticated.accessToken');
    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }

    return headers;
  })
});
