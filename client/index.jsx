/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import { fromJS } from 'immutable';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import Grid from './components/Grid';
import { SPACE, GOAL, SETUP, BOX, PLAYER, GOAL_BOX, level } from '../reducers/level';

// const grid = fromJS([[SPACE, GOAL, SPACE], [SPACE, SPACE, SPACE]]);
// const player = fromJS({ r: 1, c: 0 });
// const boxes = fromJS([{ r: 0, c: 1, goal: true }, { r: 0, c: 0, goal: false }]);

const store = createStore(level);
store.dispatch({
  type: SETUP,
  grid: fromJS([[PLAYER, BOX, SPACE, GOAL, GOAL_BOX], new Array(5).fill(SPACE)]) });

const root = document.getElementById('react-root');

document.addEventListener('keydown', (evt) => {
  if (evt.keyCode === 39) {
    store.dispatch({ type: 'EAST' });
  } else if (evt.keyCode === 37) {
    store.dispatch({ type: 'WEST' });
  } else if (evt.keyCode === 38) {
    store.dispatch({ type: 'NORTH' });
  } else if (evt.keyCode === 40) {
    store.dispatch({ type: 'SOUTH' });
  }
});

const BoundGrid = connect(state => ({
  grid: state.get('grid'),
  player: state.get('player'),
  boxes: state.get('boxes'),
  status: state.get('status'),
}), dispatch => ({
  goEast() {
    dispatch({ type: 'EAST' });
  },
}))(Grid);

render(<Provider store={store}>
  <BoundGrid />
</Provider>, root);
