import Ember from 'ember';

const {
  Route,
  run: { scheduleOnce }
} = Ember;

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);

    controller.rebuild();
  },

  actions: {
    queryParamsDidChange() {
      let { controller } = this;
      if (controller) {
        scheduleOnce('afterRender', () => {
          controller.rebuild();
        });
      }
    }
  }
});
