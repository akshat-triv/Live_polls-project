export function alerting(inner, type) {
  $('body').prepend(
    `<div class="alert alert--${type}" style="z-index:12000;">${inner}</div>`
  );
  setTimeout(() => {
    $('body').children().remove('.alert');
  }, 5000);
}
