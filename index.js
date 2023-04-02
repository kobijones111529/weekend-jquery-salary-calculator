$(document).ready(main);

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

function main () {
  // Init total monthly salary to 0
  $('#total-monthly').data('amount', 0);

  // Open (display) and focus form autofocus
  $('#form .field input[autofocus]').css('display', 'inline-block').focus();

  $('.field input').blur(function (e) { $(e.target).parents('.field').attr('tabindex', 0); });

  $('.field').focus(function (e) {
    $(e.target).find('input').css('display', 'inline-block').focus();
  });
  $('.field').blur(function (e) { $(e.target).attr('tabindex', -1); });

  $('.field input').focus(function (e) {
    $(e.target).parents('.field').attr('tabindex', -1);
    $(e.target).parents('.field').find('label').css('display', 'inline-block');
  });
  $('.field input').blur(function (e) {
    const input = $(e.target).val();
    if (input.length < 1) {
      $(e.target).css('display', 'none');
    } else {
      $(e.target).parent('.field').find('label').css('display', 'none');
    }
  });

  $('.field input').on('input', function (e) {
    const minSize = 1;
    const maxSize = 20;
    const length = $(e.target).val().length;
    $(e.target).attr('size', Math.max(minSize, Math.min(length || e.target.placeholder.length, maxSize)));
  });

  $('#form').submit(formSubmit);

  $('#data').on('click', '.delete', function (e) {
    const annualSalary = $(e.target).parents('tr').data('salary');
    const monthlyTotal = $('#total-monthly').data('amount') - annualSalary / 12;
    $(e.target).parents('tr').remove();
    $('#total-monthly').text(currencyFormatter.format(monthlyTotal));
  });
}

function formSubmit (e) {
  e.preventDefault();

  const form = $(e.target);
  const input = {
    firstName: form.find('#form-first-name').val(),
    lastName: form.find('#form-last-name').val(),
    id: form.find('#form-id').val(),
    title: form.find('#form-title').val(),
    annualSalary: form.find('#form-annual-salary').val()
  };

  if (input.firstName.length < 1) {
    console.log('Employee must have a first name');
    return;
  }

  if (input.lastName.length < 1) {
    console.log('Employee must have a last name');
    return;
  }

  const id = Number(input.id);
  if (input.id.length < 1 || !Number.isInteger(id) || id < 0) {
    console.log('Invalid employee id');
    return;
  }

  const annualSalary = Number(input.annualSalary);
  if (
    input.annualSalary.length < 1 ||
    Number.isNaN(annualSalary) ||
    !Number.isFinite(annualSalary) ||
    annualSalary < 0
  ) {
    console.log('Invalid annual salary');
    return;
  }

  addEntry({
    firstName: input.firstName,
    lastName: input.lastName,
    id: Number(id),
    title: input.title,
    annualSalary: Number(annualSalary)
  });

  formReset(e.target);
}

function formReset (form) {
  $(form).find('.field label').css('display', 'inline-block');
  // TODO calculate correct size
  $(form).find('.field input').css('display', 'none').val('').attr('size', 1);
  $(form).find('.field input[autofocus]').css('display', 'inline-block').focus();
  form.reset();
}

function addEntry (employee) {
  const makeCell = data => $(`<td>${data}</td>`);
  const row = $('<tr></tr>')
    .append(makeCell(employee.firstName))
    .append(makeCell(employee.lastName))
    .append(makeCell(employee.id))
    .append(makeCell(employee.title))
    .append(makeCell(currencyFormatter.format(employee.annualSalary)))
    .append(makeCell('<button class="delete">Delete</button>'))
    .data('salary', employee.annualSalary);
  $('#data').append(row);

  const totalMonthlyElem = $('#total-monthly');
  const totalMonthly = totalMonthlyElem.data('amount') + employee.annualSalary / 12;
  totalMonthlyElem.data('amount', totalMonthly);
  totalMonthlyElem.text(currencyFormatter.format(totalMonthly));

  console.group(`${employee.firstName} ${employee.lastName}`);
  console.log('ID:', employee.id);
  console.log('Title:', employee.title);
  console.log('Salary:', employee.annualSalary);
  console.groupEnd();
}
