import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { waitFor } from '../../helpers/wait-for';

moduleForComponent('dependency-date', 'Integration | Component | dependency date', {
  integration: true
});

test('calendar pops up', function(assert) {
  assert.expect(0);

  this.set('date', new Date());

  this.render(hbs`
    {{dependency-date
      date
      dateChanged="dateChanged"
    }}
  `);

  return waitFor(null, '.xdsoft_datetimepicker', 'body').then(() => {
    this.$('.date-time-picker').mousedown();

    return waitFor(null, '.xdsoft_datetimepicker:visible', 'body');
  });
});

test('can change date', function(assert) {
  assert.expect(1);

  let done = assert.async();

  let date = new Date();

  this.on('dateChanged', d => {
    assert.notStrictEqual(d, date);
    done();
  });

  this.set('date', date);

  this.render(hbs`
    {{dependency-date
      date
      dateChanged="dateChanged"
    }}
  `);

  waitFor(null, '.xdsoft_datetimepicker', 'body').then(() => {
    this.$('.date-time-picker').mousedown();

    waitFor(null, '.xdsoft_datetimepicker:visible', 'body').then(() => {
      $('.xdsoft_date:not(.xdsoft_current):first').click();
    });
  });
});
