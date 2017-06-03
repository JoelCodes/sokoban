/* eslint-env browser */

const { createStore } = require('redux');
const { List, is } = require('immutable');
const { level, SETUP, GOAL, GOAL_BOX, BOX, SPACE, PLAYER } = require('../reducers/level');


const app = createStore(level);
let state = app.getState();

const grid = document.querySelector('#root .grid');
const squaresDiv = grid.querySelector('.squares');
const boxesDiv = grid.querySelector('.boxes');
const playerDiv = grid.querySelector('.player');

app.subscribe(() => {
  const newState = app.getState();
  if (!is(state.get('grid'), newState.get('grid'))) {
    while (squaresDiv.firstChild) squaresDiv.firstChild.remove();
    newState.get('grid').forEach((row) => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      squaresDiv.appendChild(rowDiv);
      row.forEach((cell) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('square');
        if (cell === GOAL) cellDiv.classList.add('goal');
        rowDiv.appendChild(cellDiv);
      });
    });
  }
  if (!is(state.get('boxes'), newState.get('boxes'))) {
    while (boxesDiv.firstChild) boxesDiv.firstChild.remove();
    newState.get('boxes').forEach((box) => {
      const boxDiv = document.createElement('div');
      boxesDiv.appendChild(boxDiv);
      boxDiv.classList.add('box');
      boxDiv.style.transform = `translate(${box.get('c') * 100}%, ${box.get('r') * 100}%)`;
    });
  }
  if (!is(state.get('player'), newState.get('player'))) {
    playerDiv.style.transform = `translate(${newState.getIn(['player', 'c']) * 100}%, ${newState.getIn(['player', 'r']) * 100}%)`;
  }
  state = newState;
});
app.dispatch({ type: SETUP,
  grid: List([
    List([SPACE, PLAYER, BOX, GOAL, GOAL_BOX]),
    List([SPACE, SPACE, SPACE, SPACE, SPACE]),
  ]),
});

document.addEventListener('keydown', (evt) => {
  if (evt.keyCode === 37) {
    app.dispatch({ type: 'WEST' });
  } else if (evt.keyCode === 38) {
    app.dispatch({ type: 'NORTH' });
  } else if (evt.keyCode === 39) {
    app.dispatch({ type: 'EAST' });
  } else if (evt.keyCode === 40) {
    app.dispatch({ type: 'SOUTH' });
  } else if (evt.key === 'z') {
    app.dispatch({ type: 'UNDO' });
  }
});
