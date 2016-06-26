import Ember from 'ember';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

const {
  inject: { service }
} = Ember;

export default ToriiAuthenticator.extend({
  torii: service()
});
