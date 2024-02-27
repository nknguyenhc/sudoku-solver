import { useMemo } from "react";
import { CellCoordType } from "../../app-context";
import Cell from "../cell/cell";

const Group = ({ i, j }: CellCoordType): JSX.Element => {
  const cellCoords = useMemo<Array<Array<CellCoordType>>>(() => (
    Array.from(Array(3).keys()).map((row) => (
      Array.from(Array(3).keys()).map((col) => ({
        i: 3 * i + row,
        j: 3 * j + col,
      }))
    ))
  ), [i, j]);

  return (
    <div className="group">
      {cellCoords.map((row, rowIndex) => (
        <div className="group-row" key={rowIndex}>
          {row.map((cellCoord, cellIndex) => (
            <Cell i={cellCoord.i} j={cellCoord.j} key={cellIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Group;
