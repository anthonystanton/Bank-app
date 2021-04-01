"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2021-03-27T10:51:36.790Z",
  ],
  locale: "pt-PT",
  currency: "EUR",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  locale: "en-US",
  currency: "USD",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  locale: "pt-PT",
  currency: "EUR",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  locale: "en-US",
  currency: "USD",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// FORMATTING THE TIMES FOR THE MOVEMENTS SECTION
const formatMovementDate = (date) => {
  const calcDate = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDate(new Date(), date);

  if (daysPassed < 1) return `Today`;
  else if ((daysPassed >= 1) & (daysPassed < 7))
    return `${daysPassed} days ago`;
  else if (daysPassed === 7) return `1 Week ago`;

  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
};

// CHANGING THE CURRENCIES BASED ON EACH USER
const formatCurrency = (amount) => {
  const options = {
    style: "currency",
    currency: currentAccount.currency,
  };
  return new Intl.NumberFormat(currentAccount.locale, options).format(amount);
};

// DISPLAYING TRANSACTIONS ON THE ACCOUNT
const displayMovements = (acc) => {
  containerMovements.innerHTML = "";

  acc.movements.forEach((mov, i) => {
    // GETTING DATES
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    // GETTING CURRENCY
    const amount = formatCurrency(mov.toFixed(2));
    // WITHDRAWL OR DEPOSIT?
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements">
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${amount}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// CREATING USERNAMES FOR EACH USER
const createUsername = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

// DISPLAYING BALANCE
const displayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const amount = formatCurrency(acc.balance.toFixed(2));
  labelBalance.textContent = `${amount}`;
};

// DISPLAYING DEPOSITS, WITHDRAWALS AND INTEREST
const displaySummary = (accs) => {
  // CREATING AND FORMATTING DATE
  const date = new Date();
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: "true",
  };

  const formatDate = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(date);
  // CALCULATING THE DEPOSITS
  const positive = accs.movements
    .filter((acc) => acc > 0)
    .reduce((acc, num) => acc + num, 0);
  // CALCULATING THE WITHDRAWALS
  const negative = accs.movements
    .filter((acc) => acc < 0)
    .reduce((acc, num) => acc + num, 0);
  // CALCULATING THE INTEREST
  const interest = accs.movements
    .filter((acc) => acc > 0)
    .map((acc) => acc * (accs.interestRate / 100))
    .filter((acc) => acc >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${formatCurrency(positive.toFixed(2))}`;
  labelSumOut.textContent = `${formatCurrency(Math.abs(negative).toFixed(2))}`;
  labelSumInterest.textContent = `${formatCurrency(interest.toFixed(2))}`;
  labelDate.textContent = formatDate;
};

// CREATING GLOBAL VARIABLES
let currentAccount, timer;

// CHECKING IF LOGIN DETAILS ARE CORRECT
const checkLogin = (e) => {
  e.preventDefault();
  const user = inputLoginUsername.value;
  const pin = parseInt(inputLoginPin.value);
  currentAccount = accounts.find((acc) => acc.username === user);
  setTimeout(() => {
    if (pin === currentAccount?.pin) {
      updateUI(currentAccount);

      if (timer) clearInterval(timer);
      timer = logoutTimer();
      labelWelcome.textContent = `Welcome, ${
        currentAccount.owner.split(" ")[0]
      }`;
      containerApp.style.opacity = 1;
      inputLoginUsername.value = "";
      inputLoginPin.value = "";
    } else {
      alert("not correct");
    }
  }, 1000);
};

// MAKING A TRANSFER
const makeTransfer = (e) => {
  // currentAccount = accounts[0];
  e.preventDefault();

  // GETTING TRANSFER TO AND AMOUNT DETAILS
  const transferTo = inputTransferTo.value;
  const transferAmount = parseInt(inputTransferAmount.value);

  // GETTING THE ACCOUNT MAKING THE TRANSFER TO
  const receiverAcc = accounts.find((acc) => acc.username === transferTo);

  // RESETTING THE TIMER
  clearInterval(timer);
  timer = logoutTimer();

  setTimeout(() => {
    // CHCECKING IF THE TRANSFER AMOUNT IS LESS OR EQUAL TO THE TRANSFER AMOUNT
    if (
      transferAmount <= currentAccount.balance &&
      transferAmount > 0 &&
      receiverAcc &&
      receiverAcc?.username !== currentAccount.username
    ) {
      // PUSHING THE TRANSFER TO THE ACCOUNT
      receiverAcc.movements.push(transferAmount);

      // PUSHING THE REMOVAL OF FUNDS FROM THE ACCOUNT ITS TRANSFERRED FROM
      currentAccount.movements.push(-transferAmount);

      // CREATING TIME STAMP
      const date = new Date().toISOString();
      currentAccount.movementsDates.push(date);
      receiverAcc.movementsDates.push(date);

      // RELOADING THE DETAILS OF THE USER
      updateUI(currentAccount);
    } else {
      alert("Error in the transfer");
    }
    inputTransferTo.value = inputTransferAmount.value = "";
  }, 2500);
};

// CLOSING ACCOUNT
const closeAccount = (e) => {
  e.preventDefault();
  currentAccount = accounts[0];

  // COLLECTING USER AND PIN
  const usernameDelete = inputCloseUsername.value;
  const pinDelete = parseInt(inputClosePin.value);

  const deleteUser = accounts.find((acc) => acc.username === usernameDelete);
  setTimeout(() => {
    if (
      inputCloseUsername.value === currentAccount.username &&
      parseInt(inputClosePin.value) === deleteUser.pin
    ) {
      // FIND INDEX OF ACCOUNT TO BE DELETED
      const index = accounts.findIndex(
        (acc) => acc.username === usernameDelete
      );

      // DELETE ACCOUNT
      accounts.splice(index, 1);

      // HIDE UI
      containerApp.style.opacity = 0;

      // CONFIRM ACCOUNT DELETED
      alert("Account has been deleted");
    } else {
      alert("Error");
    }
    inputCloseUsername.value = inputClosePin.value = "";
  }, 3000);
};

// REQUESTING LOAN
const requestLoan = (e) => {
  e.preventDefault();
  // GETTING LOAN AMOUNT
  const loanAmount = Math.floor(inputLoanAmount.value);

  // RESETTING THE TIMER
  clearInterval(timer);
  timer = logoutTimer();

  setTimeout(() => {
    if (
      loanAmount > 0 &&
      currentAccount.movements.some((mov) => mov >= 0.1 * loanAmount)
    ) {
      const date = new Date().toISOString();
      currentAccount.movementsDates.push(date);
      currentAccount.movements.push(loanAmount);
      updateUI(currentAccount);
    }
    inputLoanAmount.value = "";
  }, 2500);
};

// UPDATING THE UI
const updateUI = (acc) => {
  displayBalance(acc);
  displaySummary(acc);
  displayMovements(acc);
};

const logoutTimer = () => {
  // SETTING TIMER TO 5 MINS
  let time = 300;
  const tick = () => {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;
    // IF TIMER GETS TO 0, LOG THE USER OUT
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = ``;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  // CALLING TIMER EVERY SECOND
  const timer = setInterval(tick, 1000);
  return timer;
};

// EVENT LISTENER
btnLogin.addEventListener("click", checkLogin);
btnTransfer.addEventListener("click", makeTransfer);
btnClose.addEventListener("click", closeAccount);
btnLoan.addEventListener("click", requestLoan);
