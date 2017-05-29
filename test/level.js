/* eslint-env mocha */
const expect = require('chai').expect;
const { fromJS } = require('immutable');
const {
  level,
  NOT_SET_UP, READY, FINISHED,
  NORTH, WEST, EAST, SOUTH,
  SETUP, UP, DOWN, LEFT, RIGHT,
  BLOCK, PLAYER, SPACE, GOAL,
} = require('../reducers/level');

describe('#level(state, action)', () => {
  describe('Initial State And Level Setup', () => {
    it('returns the correct initial state', () => {
      const initialState = level(undefined, {});
      expect(initialState.toJS()).to.deep.eq({
        status: NOT_SET_UP,
      });
    });
    describe('{type: SETUP, grid: block[][]}', () => {
      it('does nothing if the level status is other than NOT_SET_UP', () => {
        const ready = fromJS({ status: READY });
        expect(level(ready, { type: SETUP, grid: fromJS([[]]) })).to.eq(ready);
        const finished = fromJS({ status: FINISHED });
        expect(level(finished, { type: SETUP, grid: fromJS([[]]) })).to.eq(finished);
      });
      it('sets up the grid, player position, and blocks', () => {
        const initialState = level(undefined, {});
        const grid = fromJS([[GOAL, SPACE, BLOCK, PLAYER]]);
        const setupState = level(initialState, {
          type: SETUP,
          grid,
        });

        expect(setupState.toJS()).to.deep.eq({
          status: READY,
          blocks: [{ r: 0, c: 2 }],
          player: { r: 0, c: 3, direction: NORTH },
          goals: [{ r: 0, c: 0 }],
          grid: grid.toJS(),
        });
      });
    });
  });

  describe('Player Movement', () => {
    describe('{type: UP}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: SOUTH },
        });

        expect(level(notReady, { type: UP })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: SOUTH },
        });

        expect(level(finished, { type: UP })).to.eq(finished);
      });
      it('does nothing if the player is already facing NORTH or WEST', () => {
        const alreadyNorth = fromJS({
          status: READY,
          player: { direction: NORTH },
        });
        expect(level(alreadyNorth, { type: UP })).to.eq(alreadyNorth);

        const alreadyWest = fromJS({
          status: READY,
          player: { direction: WEST },
        });
        expect(level(alreadyWest, { type: UP })).to.eq(alreadyWest);
      });
      it('sets player direction to NORTH if the player is facing EAST', () => {
        const isEast = fromJS({
          status: READY,
          player: { direction: EAST },
        });
        expect(level(isEast, { type: UP }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: NORTH },
        });
      });
      it('sets player direction to WEST if the player is facing SOUTH', () => {
        const isSouth = fromJS({
          status: READY,
          player: { direction: SOUTH },
        });
        expect(level(isSouth, { type: UP }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: WEST },
        });
      });
    });
    describe('{type: DOWN}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: NORTH },
        });
        expect(level(notReady, { type: DOWN })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: NORTH },
        });
        expect(level(finished, { type: DOWN })).to.eq(finished);
      });
      it('does nothing if the player is already facing EAST or SOUTH', () => {
        const alreadyEast = fromJS({
          status: READY,
          player: { direction: EAST },
        });
        expect(level(alreadyEast, { type: DOWN })).to.eq(alreadyEast);

        const alreadySouth = fromJS({
          status: READY,
          player: { direction: SOUTH },
        });
        expect(level(alreadySouth, { type: DOWN })).to.eq(alreadySouth);
      });
      it('sets player direction to EAST if the player is facing NORTH', () => {
        const isNorth = fromJS({
          status: READY,
          player: { direction: NORTH },
        });
        expect(level(isNorth, { type: DOWN }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: EAST },
        });
      });
      it('sets player direction to SOUTH if the player is facing WEST', () => {
        const isWest = fromJS({
          status: READY,
          player: { direction: WEST },
        });
        expect(level(isWest, { type: DOWN }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH },
        });
      });
    });
    describe('{type: LEFT}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: NORTH },
        });
        expect(level(notReady, { type: LEFT })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: NORTH },
        });
        expect(level(finished, { type: LEFT })).to.eq(finished);
      });
      it('turns a NORTH facing player WEST', () => {
        const north = fromJS({
          status: READY,
          player: { direction: NORTH },
        });
        expect(level(north, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: WEST },
        });
      });
      it('turns an EAST facing player SOUTH', () => {
        const east = fromJS({
          status: READY,
          player: { direction: EAST },
        });
        expect(level(east, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH },
        });
      });
      it('moves a SOUTH facing player further SOUTH');
      it('moves a WEST facing player further WEST');
      it('prevents movement into walls');
      it('moves a box straight ahead if it has an opening on the other side');
      it('does not move a box whose path is blocked');
      it('does not move adjacent boxes not directly ahead');
      it('permits movement onto a goal');
      it('recognizes a victory condition');
    });
    describe('{type: RIGHT}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: WEST },
        });
        expect(level(notReady, { type: RIGHT })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: WEST },
        });
        expect(level(finished, { type: RIGHT })).to.eq(finished);
      });
      it('turns a WEST facing player NORTH', () => {
        const west = fromJS({
          status: READY,
          player: {
            direction: WEST,
          },
        });
        expect(level(west, { type: RIGHT }).toJS()).to.deep.eq({
          status: READY,
          player: {
            direction: NORTH,
          },
        });
      });
      it('turns a SOUTH facing player EAST', () => {
        const south = fromJS({
          status: READY,
          player: {
            direction: SOUTH,
          },
        });
        expect(level(south, { type: RIGHT }).toJS()).to.deep.eq({
          status: READY,
          player: {
            direction: EAST,
          },
        });
      });
      it('moves a NORTH facing player further NORTH');
      it('moves an EAST facing player further EAST');
    });
    describe('{type: NORTH}', () => {
      it('does nothing if status is not READY');
      it('moves a NORTH facing player further NORTH');
      it('turns a player facing other directions NORTH');
    });
    describe('{type: SOUTH}', () => {
      it('does nothing if status is not READY');
      it('moves a SOUTH facing player further SOUTH');
      it('turns a player facing other directions SOUTH');
    });
    describe('{type: WEST}', () => {
      it('does nothing if status is not READY');
      it('moves a WEST facing player further WEST');
      it('turns a player facing other directions WEST');
    });
    describe('{type: EAST}', () => {
      it('does nothing if status is not READY');
      it('moves an EAST facing player further EAST');
      it('turns a player facing other directions EAST');
    });
  });
});
