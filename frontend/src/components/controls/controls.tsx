import { useLocation } from "react-router-dom";
import ClearButton from "../clear-button/clear-button";
import EraseButton from "../erase-button/erase-button";
import InputGroup from "../input-group/input-group";
import ResetButton from "../reset-button/reset-button";
import SolveButton from "../solve-button/solve-button";
import ShiftButton from "../shift-button/shift-button";

const Controls = (): JSX.Element => {
  const { pathname } = useLocation();

  return (
    <div className="controls">
      <div className="controls-buttons">
        <ClearButton />
        <ResetButton />
        <EraseButton />
        {pathname === '/killer' && <ShiftButton />}
      </div>
      <InputGroup />
      <SolveButton />
    </div>
  );
}

export default Controls;
