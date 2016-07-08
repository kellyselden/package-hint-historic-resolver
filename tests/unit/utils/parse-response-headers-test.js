import parseResponseHeaders from 'package-hint-historic-resolver/utils/parse-response-headers';
import { module, test } from 'qunit';

module('Unit | Utility | parse response headers');

test('handles no headers', function(assert) {
  let result = parseResponseHeaders('');

  assert.deepEqual(result, {});
});
