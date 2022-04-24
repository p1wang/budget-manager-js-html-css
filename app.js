const form = document.querySelector(".expense-form");
const title = document.getElementById("expense-title-input");
const amount = document.getElementById("expense-amount-input");
const list = document.querySelector(".expense-list");
const clearBtn = document.querySelector(".clear-btn");
const deleteBtn = document.querySelector(".delete-btn");
const editBtn = document.querySelector(".edit-btn");
const total = document.getElementById("expense-total");
const timePeriodSelect = document.getElementById("time-period");
const submitBtn = document.querySelector(".submit-btn");

window.addEventListener("DOMContentLoaded", loadDOMContent);
form.addEventListener("submit", addExpense);
clearBtn.addEventListener("click", clearAll);

let isEditing = false;
let currentId = "";
let currentEleTitle;
let currentEleAmount;

// page load
function loadDOMContent() {
  let expenses = getLocalData();
  console.log(expenses);
  if (expenses.length > 0) {
    expenses.forEach(function (expense) {
      createExpense(
        expense.id,
        expense.title,
        expense.amount,
        expense.selectedTimePeriod
      );
    });
  }
  updateTotal();
}

// add expense
function addExpense(e) {
  e.preventDefault();
  let selectedTimePeriod =
    timePeriodSelect.options[timePeriodSelect.selectedIndex].value;
  const expenseTitle = title.value;
  const expenseAmount = amount.value;
  id = new Date().getTime().toString();

  if (expenseTitle !== "" && expenseAmount !== "" && !isEditing) {
    createExpense(id, expenseTitle, expenseAmount, selectedTimePeriod);
    saveToLocal(id, expenseTitle, expenseAmount, selectedTimePeriod);
    reset();
  } else if (expenseTitle !== "" && expenseAmount !== "" && isEditing) {
    editLocalData(currentId, expenseTitle, expenseAmount, selectedTimePeriod);
    currentEleTitle.innerHTML = expenseTitle;
    currentEleAmount.innerHTML = `$${expenseAmount} / ${selectedTimePeriod}`;
  } else {
    alert("Form is empty, enter your new expenses.");
  }
  updateTotal();
}

// delete expense
function deleteExpense(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  console.log(id);
  deleteFromLocal(id);
  reset();
}

// edit expense
function editExpense(e) {
  const element = e.currentTarget.parentElement.parentElement;
  currentId = element.dataset.id;
  isEditing = true;

  submitBtn.innerText = "update";

  currentEleTitle =
    e.currentTarget.parentElement.previousElementSibling.getElementsByTagName(
      "p"
    )[0];
  title.value = currentEleTitle.innerText;

  currentEleAmount =
    e.currentTarget.parentElement.previousElementSibling.getElementsByTagName(
      "p"
    )[1];

  amount.value = currentEleAmount.innerText.match(/[\d]+/g);

  timePeriodSelect.options[timePeriodSelect.selectedIndex].innerText =
    e.currentTarget.parentElement.previousElementSibling
      .getElementsByTagName("p")[1]
      .innerText.replace(/[0-9$/ ]/g, "");
}

// save to local storage
function saveToLocal(id, title, amount, selectedTimePeriod) {
  let expenses = getLocalData();
  expenses.push({ id, title, amount, selectedTimePeriod });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// helper functions

function reset() {
  title.value = "";
  amount.value = "";
  isEditing = false;
  submitBtn.innerText = "submit";
  currentId = "";
}

//
function getLocalData() {
  return localStorage.getItem("expenses")
    ? JSON.parse(localStorage.getItem("expenses"))
    : [];
}
//
function clearAll() {
  const expenses = document.querySelectorAll(".expense-item");
  if (expenses.length > 0) {
    expenses.forEach((expense) => {
      list.removeChild(expense);
    });
  }
  reset();
  localStorage.removeItem("expenses");
}
//
function createExpense(id, title, amount, selectedTimePeriod) {
  const element = document.createElement("div");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("expense-item");
  element.innerHTML = `<span class="expense-item-content">
    <p>${title}</p>
    <p>$${amount} / ${selectedTimePeriod}</p></span
  >
  <div class="btn-container">
    <button class="edit-btn" type="button">
      <i class="fa-solid fa-xl fa-pen-to-square"></i>
    </button>
    <button class="delete-btn" type="button">
      <i class="fa-solid fa-xl fa-trash-can"></i>
    </button>
  </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteExpense);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editExpense);

  list.appendChild(element);
}
//
function calcMonthlyTotal() {
  const expenses = getLocalData();
  let monthlyTotal = 0;
  if (expenses.length > 0) {
    expenses.forEach(function (expense) {
      if (expense.selectedTimePeriod == "monthly") {
        monthlyTotal = monthlyTotal + Number(expense.amount);
      } else {
        monthlyTotal = monthlyTotal + Number(expense.amount / 12);
      }
    });
  }
  return monthlyTotal;
}
//
function updateTotal() {
  let monthlyTotal = calcMonthlyTotal();
  let yearlyTotal = monthlyTotal * 12;
  total.innerText = `Total: $${monthlyTotal.toFixed(
    2
  )} / month, or $${yearlyTotal.toFixed(2)} / year`;
}
//
// function alterTimePeriodText(timePeriod) {
//   if (timePeriod == "monthly") {
//     return "month";
//   } else {
//     return "year";
//   }
// }
//
function deleteFromLocal(id) {
  console.log(id);
  let expenses = getLocalData();
  expenses = expenses.filter(function (expense) {
    if (expense.id !== id) {
      return expense;
    }
  });
  console.log(expenses);

  localStorage.setItem("expenses", JSON.stringify(expenses));
}
//
function editLocalData(id, expenseTitle, expenseAmount, selectedTimePeriod) {
  let expenses = getLocalData();

  expenses = expenses.map(function (expense) {
    if (expense.id === id) {
      expense.title = expenseTitle;
      expense.amount = expenseAmount;
      expense.selectedTimePeriod = selectedTimePeriod;
    }
    return expense;
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
