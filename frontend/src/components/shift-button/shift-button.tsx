import { useAppContext } from "../../app-context";

const ShiftButton = (): JSX.Element => {
  const { switchHoldingShift } = useAppContext();

  return (
    <button className="shift-button" onClick={switchHoldingShift}>Shift</button>
  );
};

export default ShiftButton;
