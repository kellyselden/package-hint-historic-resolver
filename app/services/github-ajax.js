import { inject as service } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import computed from 'ember-computed-decorators';

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
  }
});
