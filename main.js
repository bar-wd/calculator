'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const screenTop = document.querySelector('.screen-top');
const screenBottom = document.querySelector('.screen-bottom');

let lastOperandText;
let lastOperand;
let lastClassSelection;
let lastTextSelection = false;
let lastBasicOperand;
let percentNumber;
let total = false;
let numbers = [];

function add(num) {
  total += num;
  return total;
}

function subtract(num) {
  total -= num;
  return total;
}

function multiply(num) {
  total *= num;
  return total;
}

function divide(num) {
  total /= num;
  return total;
}

function squareRoot(num) {
  return Math.sqrt(num);
}

function squared(num1) {
  return num1 * num1;
}

function percent(num1, num2) {
  return num1 * (num2 / 100);
}

function displayKey(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];
  let currentNum = Number(event.target.textContent);

  ///////////////////////////////////////////////////////////////////////
  // Code that is independent of the beginning state and running total state
  ///////////////////////////////////////////////////////////////////////

  // Decimal functionality
  if (classSelection === 'decimal') {
    // Only one decimal allowed
    if (screenBottom.innerText.includes('.')) return;
    // If current operation is an operand
    else if (operand === 'operand-basic') {
      console.log(operand);
      screenBottom.innerText = `0.`;
    } else {
      screenBottom.innerText += textSelection;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // If there is no total (at the beginning or after a clear)
  ///////////////////////////////////////////////////////////////////////

  if (!total) {
    // If one of the number keys is pressed with no running total
    if (operand === 'number') {
      if (screenBottom.innerText === '0') {
        screenBottom.innerText = +textSelection;
      } else {
        screenBottom.innerText += +textSelection;
      }

      // If one of the basic operands is pressed (add, subtract, divide, multiply)
    } else if (operand === 'operand-basic') {
      total = +screenBottom.innerText;

      screenTop.innerText = `${total} ${textSelection}`;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // If there is a running total
  ///////////////////////////////////////////////////////////////////////

  // If one of the number keys is pressed with a running total
  else if (total) {
    if (operand === 'number') {
      if (lastOperand === 'number' || lastClassSelection === 'decimal') {
        screenBottom.innerText += currentNum;
      } else {
        screenBottom.innerText = currentNum;
      }
    }

    // If one of the basic operands is pressed (add, subtract, divide, multiply) with a running total
    // Executes the previously stored basic operand
    else if (operand === 'operand-basic') {
      if (lastBasicOperand === 'add') {
        add(+screenBottom.innerText);
      } else if (lastBasicOperand === 'subtract') {
        subtract(+screenBottom.innerText);
      } else if (lastBasicOperand === 'multiply') {
        multiply(+screenBottom.innerText);
      } else if (lastBasicOperand === 'divide') {
        divide(+screenBottom.innerText);
      }
      screenBottom.innerText = total;
      screenTop.innerText = `${total} ${textSelection}`;
    }
  }
  lastTextSelection = textSelection;
  lastOperand = operand;
  lastClassSelection = classSelection;

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

keys.forEach(key => key.addEventListener('click', displayKey));
