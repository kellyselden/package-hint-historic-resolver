import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import EmberMetricsRouterMixin from 'ember-metrics-mixins/mixins/router';

const Router = EmberRouter.extend(EmberMetricsRouterMixin, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
});

export default Router;
