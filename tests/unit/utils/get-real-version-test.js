import getRealVersion from 'package-hint-historic-resolver/utils/get-real-version';
import { module, test } from 'qunit';

const versionHint = '^1.0.0';
const versions = [
  ['1.0.1', '1/1/2016'],
  ['1.1.0', '3/1/2016'],
  ['2.0.0', '5/1/2016']
];

module('Unit | Utility | get real version', function() {
  test('early exits', function(assert) {
    let result = getRealVersion();

    assert.notOk(result);
  });

  test('respects date ceiling', function(assert) {
    let dateCeiling = new Date('2/1/2016');

    let version = getRealVersion(versionHint, versions, dateCeiling);

    assert.strictEqual(version, '1.0.1');
  });

  test('version equal to date ceiling is valid', function(assert) {
    let dateCeiling = new Date('3/1/2016');

    let version = getRealVersion(versionHint, versions, dateCeiling);

    assert.strictEqual(version, '1.1.0');
  });

  test('respects version hint', function(assert) {
    let dateCeiling = new Date('6/1/2016');

    let version = getRealVersion(versionHint, versions, dateCeiling);

    assert.strictEqual(version, '1.1.0');
  });
});
