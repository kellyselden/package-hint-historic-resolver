import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { setProperties, get } from '@ember/object';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { task } from 'ember-concurrency';
import config from '../config/environment';

export default Route.extend(ApplicationRouteMixin, {
  adapter: service(),

  setupController(controller) {
    this._super(...arguments);

    controller.rebuild();

    get(this, 'getGithubClientId').perform(controller);
  },

  getGithubClientId: task(function * (controller) {
    let clientId, error;
    try {
      let data = yield get(this, 'adapter').ajax('github/client-id');
      clientId = data['client_id'];

      config.torii.providers['github-oauth2'].apiKey = clientId;
    } catch (err) {
      error = err.errors[0].title;
    } finally {
      setProperties(controller, {
        githubClientId: clientId,
        githubClientIdError: error
      });
    }
  }),

  actions: {
    queryParamsDidChange() {
      let { controller } = this;
      if (controller) {
        scheduleOnce('afterRender', () => {
          // controller.rebuild();
        });
      }
    }
  }
});
