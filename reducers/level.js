const { createReducer } = require('redux-create-reducer');
const { Map, List } = require('immutable');

const NOT_SET_UP = 'NOT_SET_UP';
const READY = 'READY';
const SETUP = 'LEVEL_SETUP';
const NORTH = 'NORTH';
const WEST = 'WEST';
const SOUTH = 'SOUTH';
const EAST = 'EAST';
const BLOCK = 'BLOCK';
const PLAYER = 'PLAYER';
const GOAL = 'GOAL';
const UP = 'UP';
const DOWN = 'DOWN';
const SPACE = 'SPACE';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const initialState = new Map({
  status: NOT_SET_UP,
});
module.exports = {
  level: createReducer(initialState, {
    [SETUP](state, { grid }) {
      if (state.get('status') !== NOT_SET_UP) return state;
      const filterGrid = symbol => grid.flatMap((row, r) => row.reduce((agg, cell, c) => {
        if (cell === symbol) {
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
      const blocks = filterGrid(BLOCK);
      const goals = filterGrid(GOAL);
      return new Map({
        status: READY,
        blocks,
        player,
        goals,
        grid,
      });
    },
    [UP](state) {
      if (state.get('status') !== READY) return state;
      const direction = state.getIn(['player', 'direction']);
      if (direction === EAST) {
        return state.setIn(['player', 'direction'], NORTH);
      }
      if (direction === SOUTH) {
        return state.setIn(['player', 'direction'], WEST);
      }
      return state;
    },
    [DOWN](state) {
      if (state.get('status') !== READY) return state;
      const direction = state.getIn(['player', 'direction']);
      if (direction === NORTH) {
        return state.setIn(['player', 'direction'], EAST);
      }
      if (direction === WEST) {
        return state.setIn(['player', 'direction'], SOUTH);
      }
      return state;
    },
    [LEFT](state) {
      if (state.get('status') !== READY) return state;
      const direction = state.getIn(['player', 'direction']);
      if (direction === NORTH) {
        return state.setIn(['player', 'direction'], WEST);
      }
      if (direction === EAST) {
        return state.setIn(['player', 'direction'], SOUTH);
      }
      return state;
    },
    [RIGHT](state) {
      if (state.get('status') !== READY) return state;
      const direction = state.getIn(['player', 'direction']);
      if (direction === WEST) {
        return state.setIn(['player', 'direction'], NORTH);
      }
      if (direction === SOUTH) {
        return state.setIn(['player', 'direction'], EAST);
      }
      return state;
    },
  }),
  NOT_SET_UP,
  READY,
  SETUP,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  BLOCK,
  PLAYER,
  GOAL,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPACE,
};
