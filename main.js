'use-strict';

const keys = document.querySelectorAll('.key');
const screen = document.querySelector('.screen');
const screenTop = document.querySelector('.screen-top');
const screenBottom = document.querySelector('.screen-bottom');

function displayKey(event) {
  const textSelection = event.target.textContent;
  const classSelection = event.target.classList[1];

  if (textSelection === 'C') {
    screenBottom.innerText = '';
    screenTop.innerText = '';
  } else if (textSelection === 'CE') {
    screenBottom.innerText = '';
  } else if (classSelection === 'delete') {
    screenBottom.innerText = screenBottom.innerText.slice(0, -1);
  } else {
    screenBottom.innerText += textSelection;
  }
}

keys.forEach(key => key.addEventListener('click', displayKey));
