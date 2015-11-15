import Ember from 'ember';
import config from '../config/environment';

const {
  run,
  RSVP: { Promise },
  $: { getJSON }
} = Ember;
const { APP: { serverApiEndpoint } } = config;

export default function sendRequest(url) {
  if (url.indexOf('http') !== 0) {
    url = `${serverApiEndpoint}/${url}`;
  }
  return new Promise((resolve, reject) => {
    getJSON(url).then(data => {
      run(null, resolve, data);
    }, function() {
      run(null, reject, ...arguments);
    });
  });
}
