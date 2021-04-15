export function setLink(host_name, poll_id, admin_id) {
  $('#poll_link').attr('value', `${host_name}/poll/${poll_id}`);
  $('#admin_link').attr(
    'value',
    `${host_name}/poll/admin/${poll_id}/${admin_id}`
  );
  $('#poll_anchor').attr('href', `${host_name}/poll/${poll_id}`);
  $('#admin_anchor').attr(
    'href',
    `${host_name}/poll/admin/${poll_id}/${admin_id}`
  );
}

export function addOption(count) {
  const markup = `<div class="poll__option-container" id="opt-container-${
    count + 1
  }"><label for="option-${count + 1}" class="poll__label">Option ${
    count + 1
  }</label><div class="poll__option-box"><input type="text" class="poll__option" id="option-${
    count + 1
  }" name="option-${count + 1}" placeholder="Option ${
    count + 1
  }"><svg class="poll__option-removeIcon" id="remove-${
    count + 1
  }" data-option="opt-container-${
    count + 1
  }"><use xlink:href="/svg/sprite.svg#icon-circle-with-cross"></use></svg></div></div>`;

  $('.poll__options').append(markup);
}

export function getFormValues(count) {
  let obj = {};
  const poll = $('#name').val();
  if (!poll) return alerting('Fill the required fields', 'fail');
  obj.name = poll;
  const markup = `<span class="spin"></span>`;
  $('#submit').append(markup);

  for (let i = 1; i <= count; i++) {
    let v = $(`#option-${i}`).val();
    obj[`option-${i}`] = v;
  }
  return obj;
}
