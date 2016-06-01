import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);

    controller.rebuild();
  }
});
