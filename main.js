'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const screenTop = document.querySelector('.screen-top');
const screenBottom = document.querySelector('.screen-bottom');
const divisionSign = '\xF7';
const multiplicationSign = '\xD7';

let lastOperand;
let lastClassSelection;
let lastTextSelection = false;
let lastBasicOperand;
let previousNumber = false;
let percentNumber;
let total = false;
let multipleEqualSigns;
let operandForRepeatedEquals;
let lastClassBeginning;

// function saveState() {
//   lastTextSelection = textSelection;
//   lastOperand = operand;
//   lastClassSelection = classSelection;
//   previousNumber = Number(screenBottom.innerText);

//   // Stores which operand was pressed
//   if (operand === 'operand-basic') {
//     lastBasicOperand = classSelection;
//   }
// }

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

function add(num) {
  total += num;
  roundTotal();
  operandForRepeatedEquals = '+';

  return total;
}

function subtract(num) {
  total -= num;
  roundTotal();
  operandForRepeatedEquals = '-';
  return total;
}

function multiply(num) {
  total *= num;
  roundTotal();
  operandForRepeatedEquals = multiplicationSign;
  return total;
}

function divide(num) {
  total /= num;
  roundTotal();
  operandForRepeatedEquals = divisionSign;
  return total;
}

function squareRoot(num) {
  return roundDecimals(Math.sqrt(num));
}

function squared(num) {
  return roundDecimals(num * num);
}

function percent(num1, num2) {
  return roundDecimals(num1 * (num2 / 100));
}

function calcIndependent(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];
  let currentNum = Number(event.target.textContent);

  ///////////////////////////////////////////////////////////////////////
  // Operations independent of the state
  ///////////////////////////////////////////////////////////////////////

  // Clearing the calculator completely

  if (textSelection === 'C') {
    screenTop.innerText = '';
    screenBottom.innerText = 0;
    lastTextSelection = '';
    lastOperand = '';
    lastClassSelection = '';
    lastBasicOperand = '';
    total = false;
    multipleEqualSigns = '';
    operandForRepeatedEquals = '';
  }

  // Clearing the current entry
  if (textSelection === 'CE') {
    screenBottom.innerText = 0;
  }

  // Decimal functionality
  if (classSelection === 'decimal') {
    // Only one decimal allowed
    if (screenBottom.innerText.includes('.')) return;
    // If current operation is an operand
    else if (operand === 'operand-basic') {
      screenBottom.innerText = `0.`;
    } else {
      screenBottom.innerText += textSelection;
    }
  }

  // Delete functionality
  if (classSelection === 'delete') {
    if (screenBottom.innerText.length === 1) {
      screenBottom.innerText = 0;
    } else if (
      lastOperand === 'operand-basic' ||
      lastOperand === 'operand-advanced'
    ) {
      return;
    } else {
      screenBottom.innerText = screenBottom.innerText.slice(0, -1);
    }
  }

  // +/- Functionality
  if (textSelection === '+/-') {
    screenBottom.innerText = previousNumber * -1;
  }

  // If an advanced operand is pressed
  if (operand === 'operand-advanced') {
    if (classSelection === 'squared') {
      // If squared is pressed repeatedly, keep adding sqr() to screen top
      if (lastClassBeginning === 'squared') {
        screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
        screenBottom.innerText = `${squared(+screenBottom.innerText)}`;
      } else {
        screenTop.innerText += ` sqr(${+screenBottom.innerText})`;
        screenBottom.innerText = `${squared(+screenBottom.innerText)}`;
      }
    } else if (classSelection === 'square-root') {
      // If square root is pressed repeatedly, keep adding sqrt() to screen top

      if (lastClassBeginning === 'square-root') {
        console.log('bug');
        screenTop.innerText =
          `${textSelection.slice(0, 1)}(` + screenTop.innerText + ')';
        screenBottom.innerText = `${squareRoot(+screenBottom.innerText)}`;
      } else {
        screenTop.innerText += ` ${textSelection.slice(
          0,
          1
        )}(${+screenBottom.innerText})`;
        screenBottom.innerText = `${squareRoot(+screenBottom.innerText)}`;
      }
    } else if (classSelection === 'percentage') {
      // If percentage is pressed repeatedly
      if (lastClassBeginning === 'percentage') {
        screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
        screenBottom.innerText = `${percent(+screenBottom.innerText)}`;
      } else {
        screenTop.innerText += ` ${percent(total, +screenBottom.innerText)}`;
        screenBottom.innerText = `${percent(total, +screenBottom.innerText)}`;
      }
    }

    // Initiate the total if no running total
    if (total === false) {
      total = +screenBottom.innerText;
    }
  }

  lastTextSelection = textSelection;
  lastOperand = operand;
  lastClassSelection = classSelection;
  lastClassBeginning = classSelection;
  previousNumber = Number(screenBottom.innerText);

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

function calcFromBeginningState(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];
  let currentNum = Number(event.target.textContent);
  /////////////////////////////////////////////////////////////////////
  // If there is no total (at the beginning or after a clear)
  /////////////////////////////////////////////////////////////////////

  if (total === false) {
    // If one of the number keys is pressed with no running total
    if (operand === 'number') {
      if (screenBottom.innerText === '0') {
        screenBottom.innerText = +textSelection;
      } else {
        screenBottom.innerText += +textSelection;
      }
    }

    // If one of the basic operands is pressed (add, subtract, divide, multiply)
    else if (operand === 'operand-basic') {
      // If the initial number is a decimal, round to two decimal places
      total = Number(screenBottom.innerText);
      roundDecimals(total);
      screenTop.innerText = `${total} ${textSelection}`;
      screenBottom.innerText = total;
    }
  }
  lastTextSelection = textSelection;
  lastOperand = operand;
  lastClassSelection = classSelection;
  previousNumber = Number(screenBottom.innerText);

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

///////////////////////////////////////////////////////////////////////
// If there is a running total
///////////////////////////////////////////////////////////////////////
function calcFromRunningState(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];
  let currentNum = Number(event.target.textContent);

  // If one of the number keys is pressed with a running total
  if (total !== false) {
    if (operand === 'number') {
      if (lastOperand === 'number' || lastClassSelection === 'decimal') {
        screenBottom.innerText += currentNum;
      } else {
        screenBottom.innerText = currentNum;
      }
    }

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
    }

    // Basic operands must be followed by a number. Cannot repeatedly press a basic-operand key. However, it will change the symbol on the screen.
    else if (operand === 'operand-basic' && lastOperand === 'operand-basic') {
      screenTop.innerText = `${total} ${textSelection}`;
    }

    // If one of the basic operands is pressed (add, subtract, divide, multiply) with a running total
    // Executes the previously stored basic operand
    else if (operand === 'operand-basic') {
      multipleEqualSigns = +screenBottom.innerText;

      if (lastBasicOperand === 'add') {
        add(+screenBottom.innerText);
      } else if (lastBasicOperand === 'subtract') {
        subtract(+screenBottom.innerText);
      } else if (lastBasicOperand === 'multiply') {
        multiply(+screenBottom.innerText);
      } else if (lastBasicOperand === 'divide') {
        // Prevent from dividing by 0

        if (+screenBottom.innerText === 0) {
          total = 'Cannot divide by zero';
        } else {
          divide(+screenBottom.innerText);
        }
      }

      // If '=' is pressed, then display 'num + num = ' otherwise display only one number
      if (textSelection === '=') {
        if (textSelection === '=' && lastOperand === 'operand-advanced') {
          screenTop.innerText += ` ${textSelection}`;
          screenBottom.innerText = total;
        } else {
          if ((total = 'Cannot divide by zero')) {
            screenBottom.innerText = total;
            screenTop.innerText = '';
          } else {
            screenTop.innerText += ` ${screenBottom.innerText} ${textSelection}`;
            screenBottom.innerText = total;
          }
        }
      }

      // If the last operand was advanced, don't clear the top screen, unless there is already two numbers
      else if (lastOperand === 'operand-advanced') {
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
  lastTextSelection = textSelection;
  lastOperand = operand;
  lastClassSelection = classSelection;
  previousNumber = Number(screenBottom.innerText);

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

keys.forEach(key => key.addEventListener('click', calcFromRunningState));

keys.forEach(key => key.addEventListener('click', calcIndependent));

keys.forEach(key => key.addEventListener('click', calcFromBeginningState));
