import { test } from 'qunit';
import moduleForAcceptance from 'package-hint-historic-resolver/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | application');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
