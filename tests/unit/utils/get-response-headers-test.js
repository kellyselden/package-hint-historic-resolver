import getResponseHeaders from 'package-hint-historic-resolver/utils/get-response-headers';
import { module, test } from 'qunit';

module('Unit | Utility | get response headers');

test('handles no headers', function(assert) {
  let jqXHR = {
    getAllResponseHeaders() {
      return '';
    }
  };

  let result = getResponseHeaders(jqXHR);

  assert.deepEqual(result, {});
});
