'use strict';

// Setting Node Elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const btnRoll = document.querySelector('.btn--roll');

// Form Node Elements
const settingsForm = document.querySelector('.form-settings');
const defaultPoints = document.getElementById('points--50');

// Modal Node Elements
const btnRules = document.querySelector('.btn--rules');
const btnSettings = document.querySelector('.btn--settings');
const btnCloseModal = document.querySelectorAll('.close--modal');
const modalRules = document.querySelector('.modal--rules');
const modalSettings = document.querySelector('.modal--settings');
const overlay = document.querySelector('.overlay');

// Variables
let score, currentScore, activePlayer, playing, duration;

// Game Settings - Setting game duration
// 1) Adding event listener to form
settingsForm.addEventListener('change', gameDuration);

function gameDuration() {
  // 2) Going through all radio buttons
  for (let i = 0; i < settingsForm.length; i++) {
    // 3) Checking which option is checked and setting game duration to that option
    if (settingsForm[i].checked) duration = Number(settingsForm[i].value);
  }
}

// Initalization of new game - reset game logic
function init() {
  // Starting conditions
  score = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true; // game state
  duration = 50;
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  defaultPoints.checked = true;
  btnRoll.textContent = '🎲 Start';
  btnRules.classList.remove('hidden');
  btnSettings.classList.remove('hidden');
  btnNew.classList.add('hidden');
  diceEl.classList.add('hidden');
  btnRoll.removeAttribute('disabled', true);
  btnHold.removeAttribute('disabled', true);
  player0El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--winner');
  player1El.classList.remove('player--active');
}

init();

// Adding event listener to new game button - reseting the game
btnNew.addEventListener('click', init);

// Switching player turns
function switchPlayer() {
  // 1) Setting current score to 0
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  // 2) Changing active player status to other player
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
}

// Rolling a dice logic
// 1) Adding event listener to roll button
btnRoll.addEventListener('click', rollDice);

function rollDice() {
  // 2) Check the game state
  if (playing) {
    // 3) Creating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    // console.log(dice);

    // 4) Displaying the dice and hiding Rules and Settings buttons
    btnRoll.textContent = '🎲 Roll dice';
    btnRules.classList.add('hidden');
    btnSettings.classList.add('hidden');
    btnNew.classList.remove('hidden');
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // 5) Check for rolled 1
    if (dice !== 1) {
      // 6) Add dice roll to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // 7) Switch to other player
      switchPlayer();
    }
  }
}

// Hold button logic
// 1) Adding event listener to hold button
btnHold.addEventListener('click', holdScore);

function holdScore() {
  // 2) Check the game state
  if (playing) {
    // 3) Add current score to total score and display it
    score[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      score[activePlayer];

    // 4) Check if the game is over
    if (score[activePlayer] >= duration) {
      // 5) Finish the game
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      // 6) Disabling buttons
      btnRoll.setAttribute('disabled', true);
      btnHold.setAttribute('disabled', true);
    } else {
      // 7) Swith to other player
      switchPlayer();
    }
  }
}

// Setting up Modal logic
// 1) Adding event listeners to modal buttons
btnRules.addEventListener('click', openRules);
btnSettings.addEventListener('click', openSettings);
overlay.addEventListener('click', closeModal);
for (let i = 0; i < btnCloseModal.length; i++)
  btnCloseModal[i].addEventListener('click', closeModal);

// 2) Opening Rules Modal
function openRules() {
  modalRules.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

// 3) Opening Settings Modal
function openSettings() {
  modalSettings.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

// 4) Closing Modal
function closeModal() {
  modalRules.classList.add('hidden');
  modalSettings.classList.add('hidden');
  overlay.classList.add('hidden');
}

// 5) Closing Modal on Escape
document.addEventListener('keydown', function (event) {
  const escKey = event.key;
  if (
    (escKey === 'Escape' && !modalRules.classList.contains('hidden')) ||
    !modalSettings.classList.contains('hidden')
  ) {
    closeModal();
  }
});

// FIXME Setting screen orientation for Mobile devices
//When device width is less than 608px it should automaticaly set screen orientation of the device to landscape
const width = document.documentElement.clientWidth;
console.log(width);
function changeOrientation() {
  if (width < 608) {
    screen.orientation.lock('landscape');
  }
}
changeOrientation();
