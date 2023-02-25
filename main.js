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
let currentNum = 0;

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
      if (lastOperand === 'number') {
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

  // Stores which operand was pressed
  if (operand === 'operand-basic') {
    lastBasicOperand = classSelection;
  }
}

// if (classSelection === 'add') {
//     if(screenBottom.innerText = '0') {
//         screenTop.innerText = `${add(+screenBottom.innerText)} ${textSelection}`;
//     } else {

//     }

// }
//   if (classSelection === 'subtract') {
//     screenTop.innerText = `${subtract(
//       +screenBottom.innerText
//     )} ${textSelection}`;
//   }

//   else if (textSelection === 'CE') {
//     screenBottom.innerText = '0';
//   } else if (classSelection === 'percentage') {
//     numbers.push(Number(screenBottom.innerText));
//     numbers.push(classSelection);
//     evaluate(numbers);
//     screenTop.innerText = `${total} ${lastOperandText} ${percentNumber}`;
//     screenBottom.innerText = `${total}`;
//   } else if (classSelection === 'delete') {
//     screenBottom.innerText = screenBottom.innerText.slice(0, -1);
//     if (!screenBottom.innerText) screenBottom.innerText = '0';
//   } else if (textSelection === 'C') {
//     screenTop.innerText = '';
//     screenBottom.innerText = '0';
//     numbers = [];
//   } else if (classSelection === 'squared') {
//     if (lastClassSelection === 'squared') {
//       screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
//     } else {
//       screenTop.innerText = `sqr(${screenBottom.innerText})`;
//     }
//     // numbers.push(Number(screenBottom.innerText));
//     // numbers.push(classSelection);
//     // evaluate(numbers);
//     screenBottom.innerText = squared(Number(screenBottom.innerText));
//   } else if (classSelection === 'fraction') {
//     if (screenBottom.innerText === '0') {
//       screenBottom.innerText = 'Cannot divide by zero';
//     } else {
//       if (lastClassSelection === 'fraction') {
//         screenTop.innerText = '1/(' + screenTop.innerText + ')';
//       } else {
//         screenTop.innerText = `1/((${screenBottom.innerText})`;
//       }
//       numbers.push(Number(screenBottom.innerText));
//       numbers.push(classSelection);
//       evaluate(numbers);
//       screenBottom.innerText = `${total}`;
//     }
//   } else if (classSelection === 'square-root') {
//     if (lastClassSelection === 'square-root') {
//       screenTop.innerText = `${textSelection.slice(0, 1)}(${
//         screenTop.innerText
//       })`;
//     } else {
//       screenTop.innerText = `${textSelection.slice(0, 1)}(${
//         screenBottom.innerText
//       })`;
//     }
//     numbers.push(Number(screenBottom.innerText));
//     numbers.push(classSelection);
//     evaluate(numbers);
//     screenBottom.innerText = `${total}`;
//   } else if (classSelection === 'negative-sign') {
//     screenBottom.innerText = Number(screenBottom.innerText) * -1;
//     posNeg = true;
//   } else if (operand === 'operand') {
//     if (screenBottom.innerText === '0' && lastOperand === 'operand') {
//       screenTop.innerText = `${total} ${textSelection}`;
//     } else {
//       numbers.push(Number(screenBottom.innerText));
//       numbers.push(classSelection);
//       evaluate(numbers);
//       screenTop.innerText = `${total} ${textSelection}`;
//       screenBottom.innerText = `${total}`;
//     }
//   } else if (textSelection === '=') {
//     if (screenTop.innerText === '0 =' || lastOperand === 'operand') {
//       return;
//     } else {
//       numbers.push(Number(screenBottom.innerText));
//       evaluate(numbers);
//       screenTop.innerText += ` ${screenBottom.innerText} =`;
//       screenBottom.innerText = total;
//     }
//   } else if (lastOperand === 'operand') {
//     screenBottom.innerText = textSelection;
//   } else {
//     screenBottom.innerText += textSelection;
//   }
//   lastOperand = event.target.classList[2];
//   if (operand === 'operand') {
//     lastOperandText = textSelection;
//   }
//   lastClassSelection = classSelection;

// function displayKey(event) {
//   const textSelection = event.target.textContent;
//   const classSelection = event.target.classList[1];
//   const operand = event.target.classList[2];

//   if (screenBottom.innerText === '0' && operand === 'number') {
//     screenBottom.innerText = textSelection;
//   } else if (textSelection === 'CE') {
//     screenBottom.innerText = '0';
//   } else if (classSelection === 'percentage') {
//     numbers.push(Number(screenBottom.innerText));
//     numbers.push(classSelection);
//     evaluate(numbers);
//     screenTop.innerText = `${total} ${lastOperandText} ${percentNumber}`;
//     screenBottom.innerText = `${total}`;
//   } else if (classSelection === 'delete') {
//     screenBottom.innerText = screenBottom.innerText.slice(0, -1);
//     if (!screenBottom.innerText) screenBottom.innerText = '0';
//   } else if (textSelection === 'C') {
//     screenTop.innerText = '';
//     screenBottom.innerText = '0';
//     numbers = [];
//   } else if (classSelection === 'squared') {
//     if (lastClassSelection === 'squared') {
//       screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
//     } else {
//       screenTop.innerText = `sqr(${screenBottom.innerText})`;
//     }
//     numbers.push(Number(screenBottom.innerText));
//     numbers.push(classSelection);
//     evaluate(numbers);
//     screenBottom.innerText = `${total}`;
//   } else if (classSelection === 'fraction') {
//     if (screenBottom.innerText === '0') {
//       screenBottom.innerText = 'Cannot divide by zero';
//     } else {
//       if (lastClassSelection === 'fraction') {
//         screenTop.innerText = '1/(' + screenTop.innerText + ')';
//       } else {
//         screenTop.innerText = `1/((${screenBottom.innerText})`;
//       }
//       numbers.push(Number(screenBottom.innerText));
//       numbers.push(classSelection);
//       evaluate(numbers);
//       screenBottom.innerText = `${total}`;
//     }
//   } else if (classSelection === 'square-root') {
//     if (lastClassSelection === 'square-root') {
//       screenTop.innerText = `${textSelection.slice(0, 1)}(${
//         screenTop.innerText
//       })`;
//     } else {
//       screenTop.innerText = `${textSelection.slice(0, 1)}(${
//         screenBottom.innerText
//       })`;
//     }

//     numbers.push(Number(screenBottom.innerText));
//     numbers.push(classSelection);
//     evaluate(numbers);

//     screenBottom.innerText = `${total}`;
//   } else if (classSelection === 'negative-sign') {
//     screenBottom.innerText = Number(screenBottom.innerText) * -1;
//     posNeg = true;
//   } else if (operand === 'operand') {
//     if (screenBottom.innerText === '0' && lastOperand === 'operand') {
//       screenTop.innerText = `${total} ${textSelection}`;
//     } else {
//       numbers.push(Number(screenBottom.innerText));
//       numbers.push(classSelection);
//       evaluate(numbers);
//       screenTop.innerText = `${total} ${textSelection}`;
//       screenBottom.innerText = `${total}`;
//     }
//   } else if (textSelection === '=') {
//     if (screenTop.innerText === '0 =' || lastOperand === 'operand') {
//       return;
//     } else {
//       numbers.push(Number(screenBottom.innerText));
//       evaluate(numbers);
//       screenTop.innerText += ` ${screenBottom.innerText} =`;
//       screenBottom.innerText = total;
//     }
//   } else if (lastOperand === 'operand') {
//     screenBottom.innerText = textSelection;
//   } else {
//     screenBottom.innerText += textSelection;
//   }
//   lastOperand = event.target.classList[2];

//   if (operand === 'operand') {
//     lastOperandText = textSelection;
//   }
//   lastClassSelection = classSelection;
// }

function evaluate(input) {
  const result = input.reduce((acc, curr, indx) => {
    if (input[indx + 1] === 'percentage') {
      curr = acc * (curr / 100);
      percentNumber = curr;
    }
    if (input[indx] === 'squared') {
      acc = acc * acc;
    } else if (input[indx] === 'square-root') {
      acc = Math.sqrt(acc);
    } else if (input[indx] === 'fraction') {
      acc = 1 / acc;
    } else if (input[indx - 1] === 'addition') {
      acc += curr;
    } else if (input[indx - 1] === 'subtraction') {
      acc -= curr;
    } else if (input[indx - 1] === 'multiplication') {
      acc *= curr;
    } else if (input[indx - 1] === 'division') {
      acc /= curr;
    }
    return acc;
  });
  total = +result.toFixed(2);
}

keys.forEach(key => key.addEventListener('click', displayKey));
