import { useCallback, useMemo } from "react";
import { CellCoordType, useAppContext } from "../../app-context";

const Cell = ({ i, j }: CellCoordType): JSX.Element => {
  const { getNumber, setHighlightCell, isFocused, isHighlighted } = useAppContext();
  const content = useMemo(() => getNumber(i, j), [getNumber, i, j]);
  const isThisFocused = useMemo(() => isFocused(i, j), [isFocused, i, j]);
  const isThisHighlighted = useMemo(() => isHighlighted(i, j), [isHighlighted, i, j]);

  const handleClick = useCallback(() => {
    setHighlightCell({ i, j });
  }, [setHighlightCell, i, j]);

  return (
    <div
      className={"cell" + (
        isThisFocused
        ? " cell-focused"
        : isThisHighlighted
        ? " cell-highlighted"
        : ""
      )}
      onClick={handleClick}
    >
      {content ? content : ''}
    </div>
  );
};

export default Cell;
