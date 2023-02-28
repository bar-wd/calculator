'use-strict';

const divisionSign = '\xF7';
const multiplicationSign = '\xD7';
const additionSign = '+';
const subtractionSign = '-';
const squaredSign = '\ud835\udc65' + '\xB2';
const squareRootSign = '\u221A' + '\ud835\udc65';
const fractionSign = '\xB9' + '/' + '\ud835\udc65';
const screenBottom = document.querySelector('.screen-bottom');
const screenTop = document.querySelector('.screen-top');

/////////////////////////////////////////////////////////////////////
// Calculator Keys

const keyClearEntry = document.getElementById('key-clear-entry');
const keyClearCalculator = document.getElementById('key-clear-calculator');
const keyDelete = document.getElementById('key-delete');
const keyNumbers = document.querySelectorAll('.number');
const keyBasicOperands = document.querySelectorAll('.operand-basic');
const keyPosNeg = document.getElementById('key-pos-neg');
const keyDecimal = document.getElementById('key-decimal');
const keyEquals = document.getElementById('key-equals');
const keyAdvancedOperands = document.querySelectorAll('.operand-advanced');

/////////////////////////////////////////////////////////////////////

let operationsArray = [];

const currentKey = {
  text: '',
  // Either 'one', 'add', or 'square'
  operand: '',
  // Either 'number', 'operand-basic', 'operand-advanced', 'operand-equals'
  operandType: '',
};

const previousKey = {
  text: '',
  // Either 'one', 'add', or 'square'
  operand: '',
  // Either 'number', 'operand-basic', 'operand-advanced', 'operand-equals'
  operandType: '',
};

const previousBasicOperand = {
  text: '',
  // Either 'one', 'add', or 'square'
  operand: '',
  // Either 'number', 'operand-basic', 'operand-advanced', 'operand-equals'
  operandType: '',
};

/////////////////////////////////////////////////////////////////////
// State of Calculator

function storeCurrentKey() {
  currentKey.text = event.target.textContent;
  currentKey.operand = event.target.classList[1];
  currentKey.operandType = event.target.classList[2];
}

function storePreviousKey() {
  previousKey.text = event.target.textContent;
  previousKey.operand = event.target.classList[1];
  previousKey.operandType = event.target.classList[2];
}

function storePreviousBasicOperand() {
  previousBasicOperand.text = event.target.textContent;
  previousBasicOperand.operand = event.target.classList[1];
  previousBasicOperand.operandType = event.target.classList[2];
}

function evalOperations(array) {
  return array.reduce((acc, curr, index) => {
    if (objFunc[curr]) {
      return (acc = objFunc[curr](acc, array[index + 1]));
    }

    if (acc === Infinity) {
      acc = 'Cannot divide by zero';
    } else {
      acc = objFunc.roundDecimals(acc);
    }
    return acc;
  });
}

/////////////////////////////////////////////////////////////////////
// Object of Functions

const objFunc = {
  equals: function (event) {
    storeCurrentKey();

    // Round input number
    screenBottom.innerText = objFunc.roundDecimals(+screenBottom.innerText);

    // Allows for repeated '=' pressing
    if (previousKey.operandType === 'operand-equals') {
      // Formatting with only one number
      if (operationsArray.length === 1) {
      } else {
        // Prevents multiple '=' from appearing in the array
        operationsArray.splice(-1, 1, '=');
        screenTop.innerText = operationsArray.join(' ');

        // Evaluate
        let result = evalOperations(operationsArray);
        // Splice in the result leaving the current operand for repeated '=' presses
        operationsArray.splice(0, 1, result);

        screenBottom.innerText = result;
      }
    }
    // Formatting when followed by an 'operand-advanced'
    else if (operationsArray.length > 3) {
      operationsArray.splice(0, 5, +screenBottom.innerText);
      screenTop.innerText = operationsArray.join(' ');
    }

    // Doesn't push num if followed by 'operand-advanced'
    else if (operationsArray.length === 3) {
      operationsArray.push('=');
      screenTop.innerText = operationsArray.join(' ');

      // Evaluate
      let result = evalOperations(operationsArray);
      // Splice in the result leaving the current operand for repeated '=' presses
      operationsArray.splice(0, 1, result);

      screenBottom.innerText = result;
    }

    // 'operand-advanced' Formatting
    else if (previousKey.operandType === 'operand-advanced') {
      screenTop.innerText += ' =';
    } else {
      operationsArray.push(+screenBottom.innerText);
      operationsArray.push('=');
      screenTop.innerText = operationsArray.join(' ');

      // Evaluate
      let result = evalOperations(operationsArray);

      // Splice in the result leaving the current operand for repeated '=' presses

      operationsArray.splice(0, 1, result);
      screenBottom.innerText = result;

      // If divided by 0
      if (isNaN(result)) {
        objFunc.clear();
        screenBottom.innerText = 'Cannot divide by zero';
      }
    }

    storePreviousKey();
  },
  funcBasicOperands: function (event) {
    storeCurrentKey();

    // Round input number
    screenBottom.innerText = objFunc.roundDecimals(+screenBottom.innerText);

    if (operationsArray.length === 0) {
      // Push to operationsArray
      operationsArray.push(+screenBottom.innerText);
      operationsArray.push(currentKey.text);
      // Set the top screen display
      screenTop.innerText = operationsArray.join(' ');
    }
    // Switches the basic operand and prevents repeated pressing
    else if (
      previousKey.operandType === 'operand-basic' &&
      currentKey.operandType === 'operand-basic'
    ) {
      operationsArray.splice(1, 1, currentKey.text);
      screenTop.innerText = operationsArray.join(' ');
    }
    // Following an '='
    else if (operationsArray.includes('=')) {
      operationsArray.splice(1, 3, currentKey.text);
      screenTop.innerText = operationsArray.join(' ');
      screenBottom.innerText = operationsArray[0];
    } else {
      operationsArray.push(+screenBottom.innerText);

      // Evaluate
      let result = evalOperations(operationsArray);
      operationsArray = [result, currentKey.text];
      screenTop.innerText = operationsArray.join(' ');
      screenBottom.innerText = result;
    }

    // Check if divided by zero
    if (screenBottom.innerText === 'Cannot divide by zero') {
      objFunc.clear();
      screenBottom.innerText = 'Cannot divide by zero';
    }

    storePreviousKey();
    storePreviousBasicOperand();
  },

  [additionSign]: function (num1, num2) {
    return num1 + num2;
  },
  [subtractionSign]: function (num1, num2) {
    return num1 - num2;
  },
  [multiplicationSign]: function (num1, num2) {
    return num1 * num2;
  },
  [divisionSign]: function (num1, num2) {
    return num1 / num2;
  },
  [squareRootSign]: function (num) {
    return objFunc.roundDecimals(Math.sqrt(num));
  },

  [squaredSign]: function (num) {
    return num * num;
  },
  squared: function (event) {
    storeCurrentKey();

    // Repeated squared presses
    if (previousKey.operandType === 'operand-advanced') {
      operationsArray.splice(
        -1,
        1,
        objFunc[currentKey.text](+screenBottom.innerText)
      );
    }
    // Squaring after an '=' or a number key
    else if (
      previousKey.operandType === 'operand-equals' ||
      previousKey.operandType === 'number'
    ) {
      if (operationsArray.length === 4) {
        operationsArray.splice(
          0,
          4,
          objFunc[currentKey.text](+screenBottom.innerText)
        );
      }
      // If number key after a 'operand-basic'
      else if (operationsArray.length === 2) {
        operationsArray.push(objFunc[currentKey.text](+screenBottom.innerText));
      } else {
        operationsArray.splice(
          -1,
          1,
          objFunc[currentKey.text](+screenBottom.innerText)
        );
      }
    }
    // Pressing squared once
    else {
      operationsArray.push(objFunc[currentKey.text](+screenBottom.innerText));
    }

    // Display bottom screen
    screenBottom.innerText = objFunc[currentKey.text](+screenBottom.innerText);

    // Display top screen
    screenTop.innerText = operationsArray.join(' ');

    storePreviousKey();
  },
  [fractionSign]: function (num) {
    return 1 / num;
  },

  clear: function (event) {
    screenBottom.innerText = 0;
    screenTop.innerText = '';
    operationsArray = [];

    for (key in currentKey) {
      currentKey[key] = '';
    }

    for (key in previousKey) {
      previousKey[key] = '';
    }

    for (key in previousBasicOperand) {
      previousBasicOperand[key] = '';
    }
  },
  // Clearing the current entry
  clearEntry: function (event) {
    // Following an '='  or 'operand-basic' it clears the calculator
    if (previousKey.operandType === 'operand-equals') {
      objFunc.clear();
    }
    // Following an 'operand-advanced'
    else if (previousKey.operandType === 'operand-advanced') {
      operationsArray.splice(-1, 1);

      screenTop.innerText = operationsArray.join(' ');
      screenBottom.innerText = 0;
    } else {
      screenBottom.innerText = 0;
    }
    storePreviousKey();
  },
  // Delete a number
  delete: function () {
    if (screenBottom.innerText.length === 1) {
      screenBottom.innerText = 0;
    }
    // Can't delete following a 'operand'
    else if (
      previousKey.operandType === 'operand-basic' ||
      previousKey.operandType === 'operand-advanced'
    ) {
      return;
    }
    // Delete clears screenTop.innerText following '='
    else if (previousKey.operandType === 'operand-equals') {
      screenTop.innerText = '';
    } else {
      screenBottom.innerText = screenBottom.innerText.slice(0, -1);
    }
  },
  funcPosNeg: function (event) {
    screenBottom.innerText = +screenBottom.innerText * -1;
  },

  inputNum: function () {
    storeCurrentKey();
    if (
      screenBottom.innerText === '0' ||
      previousKey.operandType === 'operand-basic' ||
      previousKey.operandType === 'operand-advanced' ||
      screenBottom.innerText === 'Cannot divide by zero'
    ) {
      screenBottom.innerText = +currentKey.text;
    }
    // Following an '='
    else if (previousKey.operandType === 'operand-equals') {
      objFunc.clear();
      storeCurrentKey();
      screenBottom.innerText = +currentKey.text;
    } else {
      screenBottom.innerText += +currentKey.text;
    }
    storePreviousKey();
  },
  // Decimal Functionality
  displayDecimal: function () {
    storeCurrentKey();
    // Only one decimal allowed
    if (screenBottom.innerText.includes('.')) {
      if (previousKey.operandType === 'operand-equals') {
        objFunc.clear();
        screenBottom.innerText += '.';
      }
      // Following 'operand-advanced' with a decimal already
      else if (previousKey.operandType === 'operand-advanced') {
        if (operationsArray.length <= 2) {
          operationsArray.splice(-1, 1);
          screenBottom.innerText = '0.';
        } else {
          operationsArray.splice(-1, 1);
          screenBottom.innerText = '0.';
          screenTop.innerText = operationsArray.join(' ');
        }
      }
      // Following 'operand-basic' with a decimal
      else if (previousKey.operandType === 'operand-basic') {
        screenBottom.innerText = '0.';
      } else {
        return;
      }
    } else if (previousKey.operandType === 'operand-equals') {
      objFunc.clear();
      screenBottom.innerText += '.';
    }
    // Following 'operand-advanced'
    else if (previousKey.operandType === 'operand-advanced') {
      if (operationsArray.length === 3) {
        operationsArray.splice(-1, 1);
        screenTop.innerText = operationsArray.join(' ');
        screenBottom.innerText = '0.';
      } else {
        operationsArray.splice(-1, 1);
        screenBottom.innerText = '0.';
      }
    }
    // Following 'operand-basic' with a decimal
    else if (previousKey.operandType === 'operand-basic') {
      screenBottom.innerText = '0.';
    } else {
      screenBottom.innerText += '.';
    }
    storePreviousKey();
  },

  roundDecimals: function (input) {
    return Number.isInteger(input) ? input : Number((+input).toFixed(2));
  },
};

///////////////////////////////////////////////////////////////////////
// Event Listeners

// Numbers
keyNumbers.forEach(num => num.addEventListener('click', objFunc['inputNum']));

// Addition, subtraction, multiplication, division
keyBasicOperands.forEach(key =>
  key.addEventListener('click', objFunc['funcBasicOperands'])
);

// Change the sign of the number
keyPosNeg.addEventListener('click', objFunc['funcPosNeg']);

// Clear entire calculator
keyClearCalculator.addEventListener('click', objFunc['clear']);

// Clear entry
keyClearEntry.addEventListener('click', objFunc['clearEntry']);

// Delete
keyDelete.addEventListener('click', objFunc['delete']);

// Decimal
keyDecimal.addEventListener('click', objFunc['displayDecimal']);

// Squared, square root, fraction
keyAdvancedOperands.forEach(key =>
  key.addEventListener('click', objFunc['squared'])
);

// Equals
keyEquals.addEventListener('click', objFunc['equals']);
