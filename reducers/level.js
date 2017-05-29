const { createReducer } = require('redux-create-reducer');


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

module.exports = {
  level: createReducer({ blocks: [], status: NOT_SET_UP, player: {}, grid: [[]] }, {
    [SETUP](state, { grid }) {
      if (state.status !== NOT_SET_UP) return state;
      const filterGrid = (symbol) => {
        const filterInRow = (agg, r) => {
          if (r >= grid.length) return agg;
          const row = grid[r];
          const filterInCell = (subAgg, c) => {
            if (c >= row.length) return subAgg;
            if (row[c] === symbol) {
              return filterInCell(subAgg.concat({ r, c }), c + 1);
            }
            return filterInCell(subAgg, c + 1);
          };

          return filterInRow(filterInCell(agg, 0), r + 1);
        };
        return filterInRow([], 0);
      };
      const find = (symbol) => {
        const findInRow = (r) => {
          if (r >= grid.length) return undefined;
          const row = grid[r];
          const findInCell = (c) => {
            if (c >= row.length) return undefined;
            if (row[c] === symbol) return { r, c };
            return findInCell(c + 1);
          };
          return findInCell(0) || findInRow(r + 1);
        };
        return findInRow(0);
      };
      const player = find(PLAYER);
      player.direction = NORTH;
      const blocks = filterGrid(BLOCK);
      const goals = filterGrid(GOAL);
      return {
        status: READY,
        blocks,
        player,
        goals,
        grid,
      };
    },
    [UP](state) {
      if (state.status !== READY) return state;
      if (state.player.direction === EAST) {
        const player = Object.assign({}, state.player, { direction: NORTH });
        return Object.assign({}, state, { player });
      }
      if (state.player.direction === SOUTH) {
        const player = Object.assign({}, state.player, { direction: WEST });
        return Object.assign({}, state, { player });
      }
      return state;
    },
    [DOWN](state) {
      if (state.status !== READY) return state;
      if (state.player.direction === NORTH) {
        return Object.assign({}, state, {
          player: Object.assign({}, state.player, { direction: EAST }),
        });
      }
      if (state.player.direction === WEST) {
        return Object.assign({}, state, {
          player: Object.assign({}, state.player, {
            direction: SOUTH,
          }),
        });
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
};
