import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import { waitFor } from 'ember-wait-for-test-helper/wait-for';

const {
  $
} = Ember;

let context = 'body';
let datePickerSelector = '.xdsoft_datetimepicker:visible';
let differentDaySelector = `${datePickerSelector} .xdsoft_date:not(.xdsoft_other_month):not(.xdsoft_current):first`;

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
export default (assert, render, input, date, spy) => {
  assert.expect(1);

  render();

  return openDatePicker(input).then(() => {
    updateDate(date);

    return wait();
  }).then(() => {
    assert.deepEqual(spy.args, [[date]]);
  });
};
