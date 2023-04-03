const currency = Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

addEventListener('DOMContentLoaded', () => {
  const formElem = document.querySelector('#form');
  const autofocusElem = document.querySelector('#form .field input[autofocus]');
  const fieldElems = document.querySelectorAll('.field');
  const inputElems = document.querySelectorAll('.field input');
  const tableElem = document.querySelector('#data');
  const totalMonthlyElem = document.querySelector('#total-monthly');

  // Init total montly salary to $0
  totalMonthlyElem.dataset.amount = 0;

  // Display and focus first form input
  autofocusElem.style.display = 'inline-block';
  autofocusElem.focus();

  // Forward focus from container to input
  fieldElems.forEach(elem => elem.addEventListener('focus', e => {
    const inputElem = e.target.querySelector('input');
    inputElem.style.display = 'inline-block';
    inputElem.focus();
  }));

  inputElems.forEach(elem => elem.addEventListener('focus', e => {
    const fieldElem = e.target.closest('.field');
    // Prevent containing field from being focused by keyboard
    fieldElem.setAttribute('tabindex', -1);
    // Show label when input focused
    fieldElem.querySelector('label').style.display = 'inline-block';
  }));
  inputElems.forEach(elem => elem.addEventListener('blur', e => {
    const fieldElem = e.target.closest('.field');
    const labelElem = fieldElem.querySelector('label');

    // Allow container to be focused by keyboard
    fieldElem.removeAttribute('tabindex');

    const input = e.target.value;
    if (input.length < 1) {
      e.target.style.display = 'none';
    } else {
      labelElem.style.display = 'none';
    }
  }));

  inputElems.forEach(elem => elem.addEventListener('input', e => {
    const minSize = 1;
    const maxSize = 20;
    const length = e.target.value.length;
    // Dynamically set size based on input length
    e.target.setAttribute('size', Math.max(minSize, Math.min(length || e.target.placeholder.length, maxSize)));
  }));

  formElem.addEventListener('submit', e => {
    e.preventDefault();

    const formElem = e.target;
    const firstNameElem = formElem.querySelector('#form-first-name');
    const lastNameElem = formElem.querySelector('#form-last-name');
    const idElem = formElem.querySelector('#form-id');
    const titleElem = formElem.querySelector('#form-title');
    const annualSalaryElem = formElem.querySelector('#form-annual-salary');

    const input = {
      firstName: firstNameElem.value,
      lastName: lastNameElem.value,
      id: Number(idElem.value),
      title: titleElem.value,
      annualSalary: annualSalaryElem.value
    };

    if (input.firstName.length < 1) {
      console.log('Employee must have first name');
      return;
    }

    const annualSalary = Number(input.annualSalary);
    if (input.annualSalary.length < 1 || Number.isNaN(annualSalary) || annualSalary < 0) {
      console.log('Invalid annual salary');
      return;
    }

    addEntry({
      firstName: input.firstName,
      lastName: input.lastName,
      id: input.id,
      title: input.title,
      annualSalary
    });

    formElem.reset();

    resetForm(formElem);
  });

  tableElem.addEventListener('click', e => {
    if (e.target.matches('.delete')) {
      removeEntry(e.target);
    }
  });
});

const resetForm = form => {
  const fieldElems = form.querySelectorAll('.field');
  fieldElems.forEach(elem => {
    elem.querySelector('label').style.display = 'inline-block';

    const inputElem = elem.querySelector('input');
    inputElem.style.display = 'none';
    inputElem.size = Math.min(1, Math.max(inputElem.placeholder.length, 20));
  });

  const autofocusElem = form.querySelector('.field input[autofocus]');
  autofocusElem.style.display = 'inline-block';
  autofocusElem.focus();
};

const addEntry = data => {
  const tableElem = document.querySelector('#data');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.append('Delete');

  const dataCells = [
    data.firstName,
    data.lastName,
    data.id,
    data.title,
    currency.format(data.annualSalary),
    deleteButton
  ]
    .map(contents => {
      const elem = document.createElement('td');
      elem.append(contents);
      return elem;
    });
  const rowElem = dataCells
    .reduce((row, cell) => {
      row.append(cell);
      return row;
    }, (() => {
      const elem = document.createElement('tr');
      elem.dataset.annualSalary = data.annualSalary;
      return elem;
    })());

  tableElem.append(rowElem);

  const totalMonthlyElem = document.querySelector('#total-monthly');
  totalMonthlyElem.dataset.amount = Number(totalMonthlyElem.dataset.amount) + data.annualSalary / 12;
  totalMonthlyElem.textContent = currency.format(totalMonthlyElem.dataset.amount);
};

const removeEntry = elem => {
  const rowElem = elem.closest('tr');

  const totalMonthlyElem = document.querySelector('#total-monthly');
  totalMonthlyElem.dataset.amount = Number(totalMonthlyElem.dataset.amount) -
    Number(rowElem.dataset.annualSalary) / 12;
  totalMonthlyElem.textContent = currency.format(totalMonthlyElem.dataset.amount);

  rowElem.remove();
};
