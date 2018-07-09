import $ from 'jquery';
import wait from 'ember-test-helpers/wait';
import { waitFor } from 'ember-wait-for-test-helper/wait-for';

const context = 'body';
const datePickerSelector = '.xdsoft_datetimepicker:visible';
const differentDaySelector = `${datePickerSelector} .xdsoft_date:not(.xdsoft_other_month):not(.xdsoft_current):first`;

function openDatePicker(input) {
  $(input).trigger('focus');

  return waitFor(datePickerSelector, context);
}

function updateDate(date) {
  let el = $(differentDaySelector);
  el.click();

  let day = el.attr('data-date');
  date.setDate(day);
}

// for some reason I can't get the date picker to hide
// so I can't test both at once
async function testDateChange(assert, render, input, date, spy) {
  assert.expect(1);

  await render();

  return openDatePicker(input).then(() => {
    updateDate(date);

    return wait();
  }).then(() => {
    assert.deepEqual(spy.args, [[date]]);
  });
}

export default testDateChange;
