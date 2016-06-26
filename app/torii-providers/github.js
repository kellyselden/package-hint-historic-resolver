import Ember from 'ember';
import GithubOauth2Provider from 'torii/providers/github-oauth2';

const {
  inject: { service },
  get
} = Ember;

export default GithubOauth2Provider.extend({
  adapter: service(),

  fetch(data) {
    return data;
  },

  open() {
    return this._super(...arguments).then(authorization => {
      let { authorizationCode } = authorization;
      let url = `github/auth?code=${authorizationCode}`;

      return get(this, 'adapter').ajax(url, 'POST').then(response => {
        authorization.accessToken = response['access_token'];

        return authorization;
      });
    });
  }
});
