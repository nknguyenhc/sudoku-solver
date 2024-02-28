import { useCallback } from "react";
import { useAppContext } from "../../app-context";

const EraseButton = (): JSX.Element => {
  const { setNumber } = useAppContext();

  const handleErase = useCallback(() => {
    setNumber(undefined);
  }, [setNumber]);

  return (
    <button className="erase-button" onClick={handleErase}>Erase</button>
  );
};

export default EraseButton;
