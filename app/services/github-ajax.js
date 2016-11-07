import Ember from 'ember';
import computed from 'ember-computed-decorators';
import AjaxService from 'ember-ajax/services/ajax';

const {
  inject: { service },
  computed,
  get
} = Ember;

export default AjaxService.extend({
  session: service(),

  host: 'https://api.github.com',

  @computed('session.data.authenticated.accessToken')
  headers(accessToken) {
    let headers = {};

    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }

    return headers;
  })
});
