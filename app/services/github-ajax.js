import { inject as service } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import autoComputed from '@ember-decorators/auto-computed';

export default AjaxService.extend({
  session: service(),

  host: 'https://api.github.com',

  @autoComputed('session.data.authenticated.accessToken')
  headers(accessToken) {
    let headers = {};

    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }

    return headers;
  }
});
