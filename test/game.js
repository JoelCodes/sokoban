/* eslint-env mocha */
const expect = require('chai').expect;
const game = require('../reducers/game');

describe('#game(state, action)', () => {
  it('returns the initial state', () => {
    const initialState = game(undefined, {});
    expect(initialState).to.deep.eq({});
  });
  describe('Game Setup Logic', () => {
  });
});
