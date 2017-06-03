/* eslint-env mocha */
const expect = require('chai').expect;
const { fromJS } = require('immutable');
const {
  level,
  NOT_SET_UP, READY, FINISHED,
  NORTH, WEST, EAST, SOUTH,
  SETUP, UP, DOWN, LEFT, RIGHT,
  BOX, PLAYER, SPACE, GOAL, WALL, GOAL_BOX,
  UNDO,
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
        const grid = fromJS([[GOAL, SPACE, BOX, PLAYER, GOAL_BOX]]);
        const setupState = level(initialState, {
          type: SETUP,
          grid,
        });

        expect(setupState.toJS()).to.deep.eq({
          status: READY,
          boxes: [{ r: 0, c: 2, goal: false }, { r: 0, c: 4, goal: true }],
          player: { r: 0, c: 3, direction: NORTH },
          goals: [{ r: 0, c: 0 }, { r: 0, c: 4 }],
          moves: [],
          grid: [[GOAL, SPACE, SPACE, SPACE, GOAL]],
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
      it('moves a SOUTH facing player further SOUTH', () => {
        const roomToMoveSouth = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [],
        });

        expect(level(roomToMoveSouth, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH, r: 1, c: 0 },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [{ player: { r: 0, c: 0, direction: SOUTH } }],
        });
      });
      it('moves a WEST facing player further WEST', () => {
        const roomToMoveWest = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 1 },
          boxes: [],
          moves: [],
          grid: [[SPACE, SPACE]],
        });

        expect(level(roomToMoveWest, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: WEST, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE, SPACE]],
          moves: [{ player: { r: 0, c: 1, direction: WEST } }],
        });
      });
      it('prevents movement into walls', () => {
        const noRoomSouth = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 1, c: 0 },
          boxes: [],
          grid: [[SPACE], [SPACE]],
        });
        expect(level(noRoomSouth, { type: LEFT })).to.eq(noRoomSouth);

        const noRoomWest = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE, SPACE]],
        });
        expect(level(noRoomWest, { type: LEFT })).to.eq(noRoomWest);

        const wallToSouth = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE], [WALL], [SPACE]],
        });
        expect(level(wallToSouth, { type: LEFT })).to.eq(wallToSouth);

        const wallToWest = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 2 },
          boxes: [],
          grid: [[SPACE, WALL, SPACE]],
        });
        expect(level(wallToWest, { type: LEFT })).to.eq(wallToWest);
      });
      it('moves a box straight ahead if it has an opening on the other side', () => {
        const boxSouth = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [{ r: 1, c: 0, goal: false }],
          grid: [[SPACE], [SPACE], [SPACE]],
          moves: [],
        });
        expect(level(boxSouth, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH, r: 1, c: 0 },
          boxes: [{ r: 2, c: 0, goal: false }],
          grid: [[SPACE], [SPACE], [SPACE]],
          moves: [{
            player: { direction: SOUTH, r: 0, c: 0 },
            boxes: [{ r: 1, c: 0, goal: false }],
          }],
        });

        const boxWest = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 2 },
          boxes: [{ r: 0, c: 1, goal: false }],
          grid: [[SPACE, SPACE, SPACE]],
          moves: [],
        });
        expect(level(boxWest, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: WEST, r: 0, c: 1 },
          boxes: [{ r: 0, c: 0, goal: false }],
          grid: [[SPACE, SPACE, SPACE]],
          moves: [{
            player: { direction: WEST, r: 0, c: 2 },
            boxes: [{ r: 0, c: 1, goal: false }],
          }],
        });
      });
      it('does not move a box whose path is blocked', () => {
        const boxAtSouthEdge = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [{ r: 1, c: 0, goal: false }],
          grid: [[SPACE], [SPACE]],
        });
        expect(level(boxAtSouthEdge, { type: LEFT })).to.eq(boxAtSouthEdge);

        const boxAtWestEdge = fromJS({
          status: READY,
          player: { direction: WEST, r: 1, c: 0 },
          boxes: [{ r: 0, c: 0 }],
          grid: [[SPACE, SPACE]],
        });
        expect(level(boxAtWestEdge, { type: LEFT })).to.eq(boxAtWestEdge);

        const boxAtSouthWall = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [{ r: 1, c: 0 }],
          grid: [[SPACE], [SPACE], [WALL]],
        });
        expect(level(boxAtSouthWall, { type: LEFT })).to.eq(boxAtSouthWall);

        const boxAtWestWall = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 2 },
          boxes: [{ r: 0, c: 1 }],
          grid: [[WALL, SPACE, SPACE]],
        });
        expect(level(boxAtWestWall, { type: LEFT })).to.eq(boxAtWestWall);

        const boxBehindBoxToSouth = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [{ r: 1, c: 0 }, { r: 2, c: 0 }],
          grid: [[SPACE], [SPACE], [SPACE], [SPACE]],
        });

        expect(level(boxBehindBoxToSouth, { type: LEFT })).to.eq(boxBehindBoxToSouth);

        const boxBehindBoxToWest = fromJS({
          status: READY,
          player: { direction: WEST, r: 0, c: 3 },
          boxes: [{ r: 0, c: 1 }, { r: 0, c: 2 }],
          grid: [[SPACE, SPACE, SPACE, SPACE]],
        });

        expect(level(boxBehindBoxToWest, { type: LEFT })).to.eq(boxBehindBoxToWest);
      });

      it('does not move adjacent boxes not directly ahead', () => {
        const manyBoxes = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 2, c: 2 },
          boxes: [{ r: 1, c: 2 }, { r: 2, c: 1 }, { r: 3, c: 2 }, { r: 2, c: 3 }],
          grid: [
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
          ],
          moves: [],
        });
        expect(level(manyBoxes, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH, r: 3, c: 2 },
          boxes: [{ r: 1, c: 2 }, { r: 2, c: 1 }, { r: 4, c: 2, goal: false }, { r: 2, c: 3 }],
          grid: [
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
          ],
          moves: [{
            player: { direction: SOUTH, r: 2, c: 2 },
            boxes: [{ r: 1, c: 2 }, { r: 2, c: 1 }, { r: 3, c: 2 }, { r: 2, c: 3 }],
          }],
        });
        expect(level(manyBoxes.setIn(['player', 'direction'], WEST), { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: WEST, r: 2, c: 1 },
          boxes: [{ r: 1, c: 2 }, { r: 2, c: 0, goal: false }, { r: 3, c: 2 }, { r: 2, c: 3 }],
          grid: [
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
            [SPACE, SPACE, SPACE, SPACE, SPACE],
          ],
          moves: [{
            player: { direction: WEST, r: 2, c: 2 },
            boxes: [{ r: 1, c: 2 }, { r: 2, c: 1 }, { r: 3, c: 2 }, { r: 2, c: 3 }],
          }],
        });
      });
      it('permits movement onto a goal', () => {
        const movementToGoal = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          boxes: [{ r: 1, c: 0, goal: false }, { r: 1, c: 1, goal: false }],
          grid: [
            [SPACE], [SPACE], [GOAL],
          ],
          moves: [],
        });
        expect(level(movementToGoal, { type: LEFT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: SOUTH, r: 1, c: 0 },
          boxes: [{ r: 2, c: 0, goal: true }, { r: 1, c: 1, goal: false }],
          grid: [
            [SPACE], [SPACE], [GOAL],
          ],
          moves: [{
            player: { direction: SOUTH, r: 0, c: 0 },
            boxes: [{ r: 1, c: 0, goal: false }, { r: 1, c: 1, goal: false }],
          }],
        });
      });
      it('recognizes a victory condition', () => {
        const singleGoal = fromJS({
          status: READY,
          player: { direction: SOUTH, r: 0, c: 0 },
          grid: [
            [SPACE], [SPACE], [GOAL],
          ],
          boxes: [{ r: 1, c: 0, goal: false }],
          moves: [],
        });

        expect(level(singleGoal, { type: LEFT }).toJS()).to.deep.eq({
          status: FINISHED,
          player: { direction: SOUTH, r: 1, c: 0 },
          grid: [
            [SPACE], [SPACE], [GOAL],
          ],
          boxes: [{ r: 2, c: 0, goal: true }],
          moves: [{
            player: { direction: SOUTH, r: 0, c: 0 },
            boxes: [{ r: 1, c: 0, goal: false }],
          }],
        });
      });
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
      it('moves a NORTH facing player further NORTH', () => {
        const roomToMoveNorth = fromJS({
          status: READY,
          player: { direction: NORTH, r: 1, c: 0 },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [],
        });

        expect(level(roomToMoveNorth, { type: RIGHT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: NORTH, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [{ player: { r: 1, c: 0, direction: NORTH } }],
        });
      });
      it('moves an EAST facing player further EAST', () => {
        const roomToMoveEast = fromJS({
          status: READY,
          player: { direction: EAST, r: 0, c: 0 },
          boxes: [],
          grid: [[SPACE, SPACE]],
          moves: [],
        });

        expect(level(roomToMoveEast, { type: RIGHT }).toJS()).to.deep.eq({
          status: READY,
          player: { direction: EAST, r: 0, c: 1 },
          boxes: [],
          grid: [[SPACE, SPACE]],
          moves: [{
            player: { c: 0, r: 0, direction: EAST },
          }],
        });
      });
    });
    describe('{type: NORTH}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: NORTH, r: 1, c: 0 },
          grid: [[SPACE], [SPACE]],
        });
        expect(level(notReady, { type: NORTH })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: NORTH },
        });
        expect(level(finished, { type: NORTH })).to.eq(finished);
      });
      it('moves a player NORTH, forcing their direction NORTH', () => {
        const facingNorth = fromJS({
          status: READY,
          player: {
            direction: NORTH,
            r: 1,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [],
        });
        const final = {
          status: READY,
          player: {
            direction: NORTH,
            r: 0,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE], [SPACE]],
        };

        [NORTH, EAST, SOUTH, WEST].forEach((dir) => {
          const face = facingNorth.setIn(['player', 'direction'], dir);
          expect(level(face, { type: NORTH }).toJS()).to.deep.eq(Object.assign({}, final, {
            moves: [{ player: { r: 1, c: 0, direction: dir } }],
          }));
        });
      });
    });
    describe('{type: SOUTH}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: SOUTH },
        });
        expect(level(notReady, { type: SOUTH })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: SOUTH },
        });
        expect(level(finished, { type: SOUTH })).to.eq(finished);
      });
      it('moves a player SOUTH, forcing their direction SOUTH', () => {
        const facingSouth = fromJS({
          status: READY,
          player: {
            direction: SOUTH,
            r: 0,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE], [SPACE]],
          moves: [],
        });
        const final = {
          status: READY,
          player: {
            direction: SOUTH,
            r: 1,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE], [SPACE]],
        };

        [NORTH, EAST, SOUTH, WEST].forEach((dir) => {
          const face = facingSouth.setIn(['player', 'direction'], dir);
          expect(level(face, { type: SOUTH }).toJS()).to.deep.eq(Object.assign({}, final, {
            moves: [{ player: { r: 0, c: 0, direction: dir } }],
          }));
        });
      });
    });
    describe('{type: WEST}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: WEST },
        });
        expect(level(notReady, { type: WEST })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: WEST },
        });
        expect(level(finished, { type: WEST })).to.eq(finished);
      });
      it('moves a player WEST, forcing their direction WEST', () => {
        const facingWest = fromJS({
          status: READY,
          player: {
            direction: WEST,
            r: 0,
            c: 1,
          },
          boxes: [],
          grid: [[SPACE, SPACE]],
          moves: [],
        });
        const final = {
          status: READY,
          player: {
            direction: WEST,
            r: 0,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE, SPACE]],
        };

        [NORTH, EAST, SOUTH, WEST].forEach((dir) => {
          const face = facingWest.setIn(['player', 'direction'], dir);
          expect(level(face, { type: WEST }).toJS()).to.deep.eq(Object.assign({}, final, {
            moves: [{ player: { r: 0, c: 1, direction: dir } }],
          }));
        });
      });
    });
    describe('{type: EAST}', () => {
      it('does nothing if status is not READY', () => {
        const notReady = fromJS({
          status: NOT_SET_UP,
          player: { direction: EAST },
        });
        expect(level(notReady, { type: EAST })).to.eq(notReady);

        const finished = fromJS({
          status: FINISHED,
          player: { direction: EAST },
        });
        expect(level(finished, { type: EAST })).to.eq(finished);
      });
      it('moves a player EAST, forcing their direction EAST', () => {
        const facingEast = fromJS({
          status: READY,
          player: {
            direction: EAST,
            r: 0,
            c: 0,
          },
          boxes: [],
          grid: [[SPACE, SPACE]],
          moves: [],
        });
        const final = {
          status: READY,
          player: {
            direction: EAST,
            r: 0,
            c: 1,
          },
          boxes: [],
          grid: [[SPACE, SPACE]],
        };

        [NORTH, EAST, SOUTH, WEST].forEach((dir) => {
          const face = facingEast.setIn(['player', 'direction'], dir);
          expect(level(face, { type: EAST }).toJS()).to.deep.eq(Object.assign({}, final, {
            moves: [{ player: { r: 0, c: 0, direction: dir } }],
          }));
        });
      });
    });
  });

  describe('{type: UNDO}', () => {
    it('doesnt move a user at the beginning of the level', () => {
      const noHistory = fromJS({
        status: READY,
        player: {
          direction: EAST,
          r: 0,
          c: 0,
        },
        boxes: [],
        grid: [[SPACE, SPACE]],
        moves: [],
      });
      expect(level(noHistory, { type: UNDO })).to.eq(noHistory);
    });
    it('doesnt move a user if the game status is not READY', () => {
      const notSetUp = fromJS({
        status: NOT_SET_UP,
      });

      expect(level(notSetUp, { type: UNDO })).to.eq(notSetUp);
      const finished = fromJS({
        status: FINISHED,
        player: {
          direction: EAST,
          r: 0,
          c: 0,
        },
        boxes: [],
        grid: [[SPACE, SPACE]],
        moves: [{ player: { r: 0, c: 1 } }],
      });
      expect(level(finished, { type: UNDO })).to.eq(finished);
    });
    it('moves a user back if possible', () => {
      const hasBackup = fromJS({
        status: READY,
        player: {
          direction: EAST,
          r: 0,
          c: 1,
        },
        boxes: [],
        grid: [[SPACE, SPACE]],
        moves: [{
          player: {
            direction: EAST,
            r: 0,
            c: 1,
          },
        }, { player: { r: 0, c: 0, direction: SOUTH } }],
      });

      expect(level(hasBackup, { type: UNDO }).toJS()).to.deep.eq({
        status: READY,
        player: {
          direction: SOUTH,
          r: 0,
          c: 0,
        },
        boxes: [],
        grid: [[SPACE, SPACE]],
        moves: [{ player: {
          direction: EAST,
          r: 0,
          c: 1,
        } }],
      });
    });
    it('moves any box that the player had moved', () => {
      const hasBoxesToBackUp = fromJS({
        status: READY,
        player: { direction: EAST, r: 0, c: 2 },
        boxes: [{ r: 0, c: 3, goal: false }],
        grid: [[SPACE, SPACE, SPACE, SPACE]],
        moves: [{
          player: { direction: EAST, r: 0, c: 0 },
          boxes: [{ r: 0, c: 1, goal: false }],
        }, {
          player: { direction: EAST, r: 0, c: 1 },
          boxes: [{ r: 0, c: 2, goal: false }],
        }],
      });

      expect(level(hasBoxesToBackUp, { type: UNDO }).toJS()).to.deep.eq({
        status: READY,
        player: { direction: EAST, r: 0, c: 1 },
        boxes: [{ r: 0, c: 2, goal: false }],
        grid: [[SPACE, SPACE, SPACE, SPACE]],
        moves: [{
          player: { direction: EAST, r: 0, c: 0 },
          boxes: [{ r: 0, c: 1, goal: false }],
        }],
      });
    });
  });
});
