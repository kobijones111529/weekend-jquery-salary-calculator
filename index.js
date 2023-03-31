$(document).ready(main);

function main () {
  $('#form').submit(formSubmit);
}

function formSubmit (e) {
  const form = $(e.target);
  const employee = {
    firstName: form.children('#form-first-name').val(),
    lastName: form.children('#form-last-name').val(),
    id: form.children('#form-id').val(),
    title: form.children('#form-title').val(),
    annualSalary: form.children('#form-annual-salary').val()
  };

  if (employee.firstName.length < 1) {
    console.log('Employee must have a name');
    return;
  }

  addEntry(employee);
  e.target.reset();
  form.children('*[autofocus]').focus();
}

function addEntry (employee) {
  const makeCell = data => $(`<td>${data}</td>`);
  const table = $('<tr></tr>')
    .append(makeCell(employee.firstName))
    .append(makeCell(employee.lastName))
    .append(makeCell(employee.id))
    .append(makeCell(employee.title))
    .append(makeCell(employee.annualSalary));
  $('#data').append(table);
  console.group(`${employee.firstName} ${employee.lastName}`);
  console.log('ID:', employee.id);
  console.log('Title:', employee.title);
  console.log('Salary:', employee.annualSalary);
  console.groupEnd();
}
