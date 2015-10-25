import Ember from 'ember';

const { on, observer } = Ember;

export default Ember.Component.extend({
  classNameBindings: ['areVersionsDifferent:versions-are-different'],

  setRealVersion: on('init', observer('version', 'versionsPromise', 'dateCeiling', function() {
    let version         = this.get('version'),
        versionsPromise = this.get('versionsPromise'),
        dateCeiling     = this.get('dateCeiling');

    versionsPromise.then(versions => {
      versions = versions.filter(pair => {
        let [version, date] = pair;
        return semver.valid(version) && new Date(date) <= dateCeiling;
      }).map(([version]) => version);

      let realVersion = semver.maxSatisfying(versions, version);
      this.set('realVersion', realVersion);
      this.sendAction('action', realVersion);
    }).catch((jqXHR, textStatus, errorThrown) => {
      this.set('error', errorThrown);
    });
  }))
});
