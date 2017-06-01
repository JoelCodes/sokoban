/* eslint react/prop-types: 0 */
import React from 'react';
import { List } from 'immutable';

import { GOAL } from '../../reducers/level';

const Cell = ({ cell }) => (
  <div className={cell === GOAL ? 'square goal' : 'square'} />);

const Row = ({ row }) => (
  <div className="row">
    {row.map(cell => <Cell cell={cell} />)}
  </div>);

const Player = ({ player }) => player && (
  <div
    className="player"
    style={{
      transform: `translate(${player.get('c') * 100}%, ${player.get('r') * 100}%)`,
    }}
  />);

const Box = ({ box }) => {
  const className = `box${box.get('goal') ? ' goal' : ''}`;
  const style = {
    transform: `translate(${box.get('c') * 100}%, ${box.get('r') * 100}%)`,
  };
  return (
    <div
      className={className}
      style={style}
    />);
};

const Grid = ({ grid, player, boxes, status }) => (
  <div className="grid">
    {grid.map(row => <Row row={row} />)}
    <Player player={player} />
    {boxes.map(box => <Box box={box} />)}
    <p>{status}</p>
  </div>);

Grid.defaultProps = {
  grid: List(),
  player: undefined,
  boxes: List(),
};

export default Grid;
