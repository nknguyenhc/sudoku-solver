import { useMemo } from 'react';
import Group from '../group/group';
import { CellCoordType } from '../../app-context';

const Board = (): JSX.Element => {
  const groupCoords = useMemo<Array<Array<CellCoordType>>>(() => (
    Array.from(Array(3).keys()).map((row) => (
      Array.from(Array(3).keys()).map((col) => ({
        i: row,
        j: col,
      }))
    ))
  ), []);

  return (
    <div className="board">
      {groupCoords.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((groupCoord, groupIndex) => (
            <Group i={groupCoord.i} j={groupCoord.j} key={groupIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
