const { createReducer } = require('redux-create-reducer');
const { Map, List } = require('immutable');

const NOT_SET_UP = 'NOT_SET_UP';
const READY = 'READY';
const SETUP = 'LEVEL_SETUP';
const NORTH = 'NORTH';
const WEST = 'WEST';
const SOUTH = 'SOUTH';
const EAST = 'EAST';
const BOX = 'BOX';
const PLAYER = 'PLAYER';
const GOAL = 'GOAL';
const UP = 'UP';
const DOWN = 'DOWN';
const SPACE = 'SPACE';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const FINISHED = 'FINISHED';
const GOAL_BOX = 'GOAL_BOX';
const UNDO = 'UNDO';

const initialState = new Map({
  status: NOT_SET_UP,
});
function setup(state, { grid }) {
  if (state.get('status') !== NOT_SET_UP) return state;

  const filterGrid = pred => grid.flatMap((row, r) => row.reduce((agg, cell, c) => {
    if (pred(cell)) {
      return agg.push(new Map({ r, c }));
    }
    return agg;
  }, new List()));

  const find = (symbol) => {
    const searchRows = (remainingRows, r) => {
      if (remainingRows.size === 0) return undefined;
      const searchCells = (remainingCells, c) => {
        if (remainingCells.size === 0) return undefined;
        if (remainingCells.first() === symbol) return new Map({ r, c });
        return searchCells(remainingCells.slice(1), c + 1);
      };
      const result = searchCells(remainingRows.first(), 0);
      return result || searchRows(remainingRows.slice(1), r + 1);
    };
    return searchRows(grid, 0);
  };

  const player = find(PLAYER).set('direction', NORTH);
  const freeBoxes = filterGrid(cell => cell === BOX).map(box => box.set('goal', false));
  const goalBoxes = filterGrid(cell => cell === GOAL_BOX).map(box => box.set('goal', true));
  const boxes = freeBoxes.concat(goalBoxes);
  const goals = filterGrid(cell => cell === GOAL || cell === GOAL_BOX);
  const newGrid = grid.map(row => row.map((cell) => {
    if (cell === PLAYER || cell === BOX) {
      return SPACE;
    }
    if (cell === GOAL_BOX) return GOAL;
    return cell;
  }));
  return new Map({
    status: READY,
    boxes,
    player,
    goals,
    moves: new List(),
    grid: newGrid,
  });
}

function moveMaker(directionHandlers) {
  return (state) => {
    if (state.get('status') !== READY) return state;
    const direction = state.getIn(['player', 'direction']);
    const directionHandler = directionHandlers[direction];
    if (typeof directionHandler === 'function') {
      return directionHandler(state);
    }
    return state;
  };
}

function turn(direction) {
  return state => state.setIn(['player', 'direction'], direction);
}

function advance(dimension, advanceBy, direction) {
  return (state) => {
    if (state.get('status') !== READY) return state;
    const currentPlayer = state.get('player');
    const nextPlayer = currentPlayer
      .update(dimension, x => x + advanceBy)
      .set('direction', direction);
    if (nextPlayer.get(dimension) < 0) return state;

    const nextSpace = state.getIn(['grid', nextPlayer.get('r'), nextPlayer.get('c')]);
    if (nextSpace !== SPACE && nextSpace !== GOAL) {
      return state;
    }

    const indexOfBoxInNextSpace = state
          .get('boxes')
          .findIndex(box => box.get('r') === nextPlayer.get('r') && box.get('c') === nextPlayer.get('c'));

    if (indexOfBoxInNextSpace === -1) {
      const newMoves = state
        .get('moves')
        .push(new Map({ player: currentPlayer }));
      return state
        .set('player', nextPlayer)
        .set('moves', newMoves);
    }


    const coordBehindBox = state.getIn(['boxes', indexOfBoxInNextSpace]).update(dimension, x => x + advanceBy);
    if (coordBehindBox.get(dimension) < 0) return state;
    const spaceBehindBox = state.getIn(['grid', coordBehindBox.get('r'), coordBehindBox.get('c')]);

    if (spaceBehindBox !== SPACE && spaceBehindBox !== GOAL) {
      return state;
    }
    if (state.get('boxes').some(box => box.get('r') === coordBehindBox.get('r') && box.get('c') === coordBehindBox.get('c'))) {
      return state;
    }
    const newBox = state
      .getIn(['boxes', indexOfBoxInNextSpace])
      .update(dimension, x => x + advanceBy)
      .set('goal', spaceBehindBox === GOAL);
    const newMove = new Map({
      player: state.get('player'),
      boxes: state.get('boxes'),
    });
    const updatedState = state
          .set('player', nextPlayer)
          .setIn(['boxes', indexOfBoxInNextSpace], newBox)
          .set('moves', state.get('moves').push(newMove));
    if (spaceBehindBox === GOAL && !updatedState
      .get('boxes')
      .some(box => state.getIn(['grid', box.get('r'), box.get('c')]) !== GOAL)) {
      return updatedState.set('status', FINISHED);
    }
    return updatedState;
  };
}

const advancers = {
  [NORTH]: advance('r', -1, NORTH),
  [WEST]: advance('c', -1, WEST),
  [SOUTH]: advance('r', 1, SOUTH),
  [EAST]: advance('c', 1, EAST),
};

function undo(state) {
  if (state.get('status') !== READY) return state;
  if (state.get('moves').size === 0) return state;
  const lastMove = state.get('moves').last();
  const newPlayer = lastMove.get('player');
  const newState = state
    .set('player', newPlayer)
    .set('moves', state
      .get('moves')
      .pop());
  if (lastMove.has('boxes')) {
    return newState.set('boxes', lastMove.get('boxes'));
  }
  return newState;
}

module.exports = {
  level: createReducer(initialState, Object.assign({}, {
    [SETUP]: setup,
    [UNDO]: undo,
  }, {
    [UP]: moveMaker({
      [EAST]: turn(NORTH),
      [SOUTH]: turn(WEST),
    }),
    [DOWN]: moveMaker({
      [NORTH]: turn(EAST),
      [WEST]: turn(SOUTH),
    }),
    [LEFT]: moveMaker({
      [NORTH]: turn(WEST),
      [EAST]: turn(SOUTH),
      [SOUTH]: advancers[SOUTH],
      [WEST]: advancers[WEST],
    }),
    [RIGHT]: moveMaker({
      [NORTH]: advancers[NORTH],
      [EAST]: advancers[EAST],
      [SOUTH]: turn(EAST),
      [WEST]: turn(NORTH),
    }),
  }, advancers)),
  NOT_SET_UP,
  READY,
  SETUP,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  BOX,
  PLAYER,
  GOAL,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPACE,
  FINISHED,
  GOAL_BOX,
  UNDO,
};
