import { useCallback, useMemo } from "react";
import { CellCoordType, useAppContext } from "../../app-context";
import { useLocation } from "react-router-dom";

const Cell = ({ i, j }: CellCoordType): JSX.Element => {
  const {
    getNumber,
    setHighlightCell,
    isFocused,
    isManuallySet,
    isHighlighted,
    isInGroup,
    getBorders,
  } = useAppContext();
  const content = useMemo(() => getNumber(i, j), [getNumber, i, j]);
  const isThisFocused = useMemo(() => isFocused(i, j), [isFocused, i, j]);
  const isThisHighlighted = useMemo(() => isHighlighted(i, j), [isHighlighted, i, j]);
  const isThisManuallySet = useMemo(() => isManuallySet(i, j), [isManuallySet, i, j]);
  const isThisInGroup = useMemo(() => isInGroup(i, j), [isInGroup, i, j]);
  const thisBorder = useMemo(() => getBorders(i, j), [getBorders, i, j]);
  const { pathname } = useLocation();
  const shouldBorderShow = useMemo(() => pathname === '/killer', [pathname]);

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
      ) + (isThisManuallySet ? "" : " cell-solution")
      + (isThisInGroup ? " cell-in-group" : "")}
      onClick={handleClick}
    >
      {content ? content : ''}
      {shouldBorderShow && thisBorder.top && <div className="cell-border cell-top-border" />}
      {shouldBorderShow && thisBorder.right && <div className="cell-border cell-right-border" />}
      {shouldBorderShow && thisBorder.bottom && <div className="cell-border cell-bottom-border" />}
      {shouldBorderShow && thisBorder.left && <div className="cell-border cell-left-border" />}
    </div>
  );
};

export default Cell;
