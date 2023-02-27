'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const divisionSign = '\xF7';
const multiplicationSign = '\xD7';
const screenBottom = document.querySelector('.screen-bottom');
const screenTop = document.querySelector('.screen-top');

/////////////////////////////////////////////////////////////////////
// Calculator Keys

const keyClearEntry = document.getElementById('key-clear-entry');
const keyClearCalculator = document.getElementById('key-clear-calculator');
const keyDelete = document.getElementById('key-delete');
const keyAdd = document.getElementById('key-add');
const keyNumbers = document.querySelectorAll('.number');
const keyBasicOperands = document.querySelectorAll('.operand-basic');
const keyPosNeg = document.getElementById('key-pos-neg');
const keyDecimal = document.getElementById('key-decimal');
const keySquared = document.getElementById('key-squared');
const keyEquals = document.getElementById('key-equals');

/////////////////////////////////////////////////////////////////////

let total = 0;
let previousTotal = false;
let numForEquals;

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
  previousTotal = total;
}

function storePreviousKey() {
  previousKey.text = event.target.textContent;
  previousKey.operand = event.target.classList[1];
  previousKey.operandType = event.target.classList[2];
}

function storePreviousBasicOperand() {
  previousBasicOperand.text = event.target.textContent;
  previousBasicOperand.operand = event.target.classList[1];
  previousBasicOperandType = event.target.classList[2];
}

function storePrevious() {
  storePreviousKey();
  storePreviousBasicOperand();
  numForEquals = +screenBottom.innerText;
}
// function evalOperations(inpt) {
//   // return array.reduce((acc, curr) => {
//   //   acc = objFunc[curr](acc);
//   //   console.log(acc, 'acc');
//   //   return acc;
//   // });
// }

const objFunc = {
  equals: function (event) {
    storeCurrentKey();

    // Prevents from being able to repeatedly press '=' in the beginning

    if (!previousBasicOperand.operand) {
      `${total} ${currentKey.text}`;
      screenBottom.innerText = total;
    }
    //   previousBasicOperand.text
    // } ${+screenBottom.innerText} ${currentKey.text}`;
    // screenBottom.innerText = total;

    // Repeatedly pressing the '='
    else if (previousKey.operandType === 'operand-equals') {
      objFunc[previousBasicOperand.operand](numForEquals);
      screenTop.innerText = `${previousTotal} ${previousBasicOperand.text} ${numForEquals} ${currentKey.text}`;
      screenBottom.innerText = total;
    } else {
      objFunc[previousBasicOperand.operand](+screenBottom.innerText);
      screenTop.innerText = `${previousTotal} ${
        previousBasicOperand.text
      } ${+screenBottom.innerText} ${currentKey.text}`;
      screenBottom.innerText = total;
    }

    storePreviousKey();
  },
  funcBasicOperands: function (event) {
    storeCurrentKey();

    // Prevents being able to repeatedly press a basic operand
    if (
      currentKey.operandType === 'operand-basic' &&
      previousKey.operandType === 'operand-basic'
    ) {
      previousKey.operand = currentKey.operand;
    } else if (previousKey.operandType === 'operand-equals') {
      screenTop.innerText = `${total} ${currentKey.text}`;
      screenBottom.innerText = total;
    } else {
      total = objFunc[previousBasicOperand.operand]
        ? objFunc[previousBasicOperand.operand](+screenBottom.innerText)
        : +screenBottom.innerText;

      screenTop.innerText = `${total} ${currentKey.text}`;
      screenBottom.innerText = total;
    }

    storePrevious();

    // if (screenBottom.innerText === '0' || screenBottom.innerText === 0) {
    //   screenTop.innerText = `0 ${textSelection}`;
    // }
    // // Basic operands must be followed by a number. Cannot repeatedly press a basic-operand key. However, it will change the symbol on the screen.
    // else if (operand === 'operand-basic' && lastOperand === 'operand-basic') {
    //   screenTop.innerText = `${total} ${textSelection}`;
    // }
    // // Basic operand at the beginning
    // else if (lastBasicOperand === false) {
    //   // If the initial number is a decimal, round to two decimal places
    //   total += +screenBottom.innerText;

    //   roundTotal();

    //   screenTop.innerText = `${total} ${textSelection}`;
    //   screenBottom.innerText = total;
    //   // If an operand advanced proceeds a basic operand
    // } else if (lastOperand === 'operand-advanced') {
    //   // If it already contains the following, make screenTop the total
    //   if (
    //     screenTop.innerText.includes('+') ||
    //     screenTop.innerText.includes('-') ||
    //     screenTop.innerText.includes(divisionSign) ||
    //     screenTop.innerText.includes(multiplicationSign)
    //   ) {
    //     total += +screenBottom.innerText;
    //     screenTop.innerText = `${total} ${textSelection}`;
    //     screenBottom.innerText = `${total}`;
    //   } else {
    //     screenTop.innerText += ` ${textSelection}`;
    //     total += +screenBottom.innerText;
    //   }
    // } else {
    //   // Call the appropriate function from objFunc based on lastBasicOperand
    //   console.log(lastBasicOperand);
    //   objFunc[lastBasicOperand](+screenBottom.innerText);

    //   // Check to see if divided by 0
    //   if (total === 'Cannot divide by zero') {
    //     screenTop.innerText = '';
    //     screenBottom.innerText = total;
    //   } else {
    //     screenTop.innerText = `${total} ${textSelection}`;
    //     screenBottom.innerText = total;
    //   }
    // }
  },

  add: function (num) {
    total += num;
    roundTotal();
    return total;
  },
  subtract: function (num) {
    total -= num;
    roundTotal();
    return total;
  },
  multiply: function (num) {
    total *= num;
    roundTotal();
    return total;
  },
  divide: function (num) {
    if (num === 0) {
      total = 'Cannot divide by zero';
      return total;
    } else {
      total /= num;
      roundTotal();

      return total;
    }
  },
  squareRoot: function (num) {
    return roundDecimals(Math.sqrt(num));
  },
  squared: function (event) {
    storeCurrentKey();

    // If squared is pressed repeatedly, keep adding sqr() to screen top
    if (lastOperand === 'operand-advanced') {
      screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
      screenBottom.innerText = `${
        +screenBottom.innerText * +screenBottom.innerText
      }`;
    } else {
      // If last operation was an operand-advanced, replace the text
      if (
        lastOperand === 'operand-advanced' &&
        operand === 'operand-advanced'
      ) {
        screenTop.innerText = `sqr(${+screenBottom.innerText})`;
        screenBottom.innerText = `${squared(+screenBottom.innerText)}`;
      } else {
        screenTop.innerText += ` sqr(${+screenBottom.innerText})`;
        screenBottom.innerText = `${
          +screenBottom.innerText * +screenBottom.innerText
        }`;
      }
    }

    lastBasicOperand = classSelection;
    lastOperand = operand;
  },
  fraction: function (num) {
    total = 1 / num;
    roundTotal();
    return total;
  },

  clear: function (event) {
    total = 0;
    previousTotal = false;
    numForEquals;
    screenBottom.innerText = 0;
    screenTop.innerText = '';

    for (key in currentKey) {
      currentKey[key] = '';
    }

    for (key in previousKey) {
      previousKey[key] = '';
    }

    for (key in previousBasicOperand) {
      previousBasicOperand[key] = '';
    }

    numForEquals = '';
  },
  // Clearing the current entry
  clearEntry: function (event) {
    screenBottom.innerText = 0;
  },
  // Delete a number
  delete: function () {
    if (screenBottom.innerText.length === 1) {
      screenBottom.innerText = 0;
    }

    // else if (
    //   lastOperand === 'operand-basic' ||
    //   lastOperand === 'operand-advanced'
    // ) {
    //   return;
    // }
    else {
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
      previousKey.operandType === 'operand-advanced'
    ) {
      screenBottom.innerText = +currentKey.text;
    } else {
      screenBottom.innerText += +currentKey.text;
    }
    numForEquals = +screenBottom.innerText;
    storePreviousKey();
  },
  // Decimal Functionality
  displayDecimal: function () {
    storeCurrentKey();
    // Only one decimal allowed
    if (screenBottom.innerText.includes('.')) return;
    else {
      screenBottom.innerText += '.';
    }
  },
};

//////////////////////////////////////////////////////////////////////
// Rounding Functions

function roundTotal() {
  Number.isInteger(total)
    ? (total = total)
    : (total = Number(+total.toFixed(2)));
  return total;
}

function roundDecimals(input) {
  Number.isInteger(input)
    ? (input = input)
    : (input = Number(+input.toFixed(2)));
  return input;
}
function calcFromBeginningState(event) {
  // If one of the basic operands is pressed (add, subtract, divide, multiply)
  if (operand === 'operand-basic') {
    // If the initial number is a decimal, round to two decimal places
    total = Number(screenBottom.innerText);
    roundDecimals(total);
    screenTop.innerText = `${total} ${textSelection}`;
    screenBottom.innerText = total;
  }
}

///////////////////////////////////////////////////////////////////////
// If there is a running total

function errorState(event) {
  if (total === 'Cannot divide by zero') {
  }
}

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

// Squared
keySquared.addEventListener('click', objFunc['squared']);

// Equals
keyEquals.addEventListener('click', objFunc['equals']);

function calcFromRunningState(event) {
  // Repeatedly pressing '=' will compute correctly
  if (textSelection === '=' && lastTextSelection === '=') {
    screenTop.innerText = `${total} ${operandForRepeatedEquals} ${multipleEqualSigns} ${textSelection}`;
    if (operandForRepeatedEquals === '+') {
      add(multipleEqualSigns);
    } else if (operandForRepeatedEquals === '-') {
      subtract(multipleEqualSigns);
    } else if (operandForRepeatedEquals === multiplicationSign) {
      multiply(multipleEqualSigns);
    } else if (operandForRepeatedEquals === divisonSign) {
      divide(multipleEqualSigns);
    }

    screenBottom.innerText = total;

    // If '=' is pressed, then display 'num + num = ' otherwise display only one number
    if (textSelection === '=') {
      if (textSelection === '=' && lastOperand === 'operand-advanced') {
        screenTop.innerText += ` ${textSelection}`;
        screenBottom.innerText = total;
      } else {
        if (total === 'Cannot divide by zero') {
          screenBottom.innerText = total;
          screenTop.innerText = '';
        } else {
          screenTop.innerText += ` ${screenBottom.innerText} ${textSelection}`;
          screenBottom.innerText = total;
        }
      }
    }

    // If the last operand was advanced, don't clear the top screen, unless there is already two numbers
    if (lastOperand === 'operand-advanced') {
      if (
        screenTop.innerText.includes('+') ||
        screenTop.innerText.includes('-') ||
        screenTop.innerText.includes(divisionSign) ||
        screenTop.innerText.includes(multiplicationSign)
      ) {
        screenTop.innerText = `${total} ${textSelection}`;
        screenBottom.innerText = total;
      } else {
        screenTop.innerText += ` ${textSelection}`;
      }
    }
    // If basic operands follow each other, only show one number
    else {
      screenBottom.innerText = total;
      screenTop.innerText = `${total} ${textSelection}`;
    }
  }
}

function calcIndependent(event) {
  // If an advanced operand is pressed
  if (operand === 'operand-advanced') {
    if (classSelection === 'fraction') {
      // Cannot divide by zero
      if (+screenBottom.innerText === 0) {
        screenBottom.innerText = 'Cannot divide by zero';
        screenTop.innerText = '';
      } else {
        screenTop.innerText = `1/(${screenBottom.innerText})`;
        fraction(+screenBottom.innerText);
        screenBottom.innerText = total;
      }
    }

    if (classSelection === 'square-root') {
      // If square root is pressed repeatedly, keep adding sqrt() to screen top

      if (lastClassBeginning === 'square-root') {
        screenTop.innerText =
          `${textSelection.slice(0, 1)}(` + screenTop.innerText + ')';
        screenBottom.innerText = `${squareRoot(+screenBottom.innerText)}`;
      }

      if (
        lastOperand === 'operand-advanced' &&
        operand === 'operand-advanced'
      ) {
        screenTop.innerText = `sqr(${+screenBottom.innerText})`;
        screenBottom.innerText = `${squareRoot(+screenBottom.innerText)}`;
      } else {
        screenTop.innerText += ` ${textSelection.slice(
          0,
          1
        )}(${+screenBottom.innerText})`;
        screenBottom.innerText = `${squareRoot(+screenBottom.innerText)}`;
      }
    }
  }
}
