import { alerting } from './sendAlerts';
import 'regenerator-runtime/runtime';
import { createPoll } from './send';
import { addOption, getFormValues } from './view';

var count = 2;

$('.poll__btns').on('click', async function (e) {
  e.preventDefault();
  //console.log(1);
  if (e.target.id === 'add') {
    if (count > 2) {
      let removeEl = document.getElementById(`remove-${count}`);
      if (removeEl) removeEl.style.display = 'none';
    }
    addOption(count);
    count++;
  } else if (e.target.id === 'submit') {
    let obj = getFormValues(count);

    await createPoll(obj);

    $('.spin').remove();
    $('.cover').css('display', 'block');
  }
});

$('.poll__options').on('click', function (e) {
  let el = $(e.target);
  el = el.closest('.poll__option-removeIcon');
  if (el.hasClass('poll__option-removeIcon')) {
    const id = el.data('option');
    el = document.getElementById(id);
    el.parentNode.removeChild(el);
    count--;
  }
  if (count > 2) {
    let removeEl = document.getElementById(`remove-${count}`);
    if (removeEl) removeEl.style.display = 'inline-block';
  }
});

$('body').on('click', function (e) {
  let id = e.target.id;

  if (id === 'poll_link' || id === 'admin') {
    if (id === 'admin') {
      id = 'admin_link';
    }
    document.getElementById(id).select();
    document.execCommand('copy');
    alerting('Copied to clipboard', 'success');
  }
});
