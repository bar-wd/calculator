'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const screenTop = document.querySelector('.screen-top');
const screenBottom = document.querySelector('.screen-bottom');
let lastOperandText;
let lastOperand;
let lastClassSelection;
let percentNumber;
let total = false;
let numbers = [];

function displayKey(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];
  const operand = event.target.classList[2];

  if (screenBottom.innerText === '0' && operand === 'number') {
    screenBottom.innerText = textSelection;
  } else if (textSelection === 'CE') {
    screenBottom.innerText = '0';
  } else if (classSelection === 'percentage') {
    numbers.push(Number(screenBottom.innerText));
    numbers.push(classSelection);
    evaluate(numbers);
    screenTop.innerText = `${total} ${lastOperandText} ${percentNumber}`;
    screenBottom.innerText = `${total}`;
  } else if (classSelection === 'delete') {
    screenBottom.innerText = screenBottom.innerText.slice(0, -1);
    if (!screenBottom.innerText) screenBottom.innerText = '0';
  } else if (textSelection === 'C') {
    screenTop.innerText = '';
    screenBottom.innerText = '0';
    numbers = [];
  } else if (classSelection === 'squared') {
    if (lastClassSelection === 'squared') {
      screenTop.innerText = 'sqr(' + screenTop.innerText + ')';
    } else {
      screenTop.innerText = `sqr(${screenBottom.innerText})`;
    }
    numbers.push(Number(screenBottom.innerText));
    numbers.push(classSelection);
    evaluate(numbers);
    screenBottom.innerText = `${total}`;
  } else if (classSelection === 'fraction') {
    if (lastClassSelection === 'fraction') {
      screenTop.innerText = '1/(' + screenTop.innerText + ')';
    } else {
      screenTop.innerText = `1/((${screenBottom.innerText})`;
    }
    numbers.push(Number(screenBottom.innerText));
    numbers.push(classSelection);
    evaluate(numbers);
    screenBottom.innerText = `${total}`;
  } else if (classSelection === 'square-root') {
    if (lastClassSelection === 'square-root') {
      screenTop.innerText = `${textSelection.slice(0, 1)}(${
        screenTop.innerText
      })`;
    } else {
      screenTop.innerText = `${textSelection.slice(0, 1)}(${
        screenBottom.innerText
      })`;
    }
    numbers.push(Number(screenBottom.innerText));
    numbers.push(classSelection);
    evaluate(numbers);
    screenBottom.innerText = `${total}`;
  } else if (classSelection === 'negative-sign') {
    screenBottom.innerText = Number(screenBottom.innerText) * -1;
    posNeg = true;
  } else if (operand === 'operand') {
    numbers.push(Number(screenBottom.innerText));
    numbers.push(classSelection);
    evaluate(numbers);
    screenTop.innerText = `${total} ${textSelection}`;
    screenBottom.innerText = `${total}`;
  } else if (textSelection === '=') {
    numbers.push(Number(screenBottom.innerText));
    evaluate(numbers);
    screenTop.innerText += ` ${screenBottom.innerText} =`;
    screenBottom.innerText = total;
  } else if (lastOperand === 'operand') {
    screenBottom.innerText = textSelection;
  } else {
    screenBottom.innerText += textSelection;
  }
  lastOperand = event.target.classList[2];

  if (operand === 'operand') {
    lastOperandText = textSelection;
  }
  lastClassSelection = classSelection;
  console.log(lastOperandText);
}

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
  total = result;
}

keys.forEach(key => key.addEventListener('click', displayKey));
