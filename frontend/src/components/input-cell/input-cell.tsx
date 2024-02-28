import { useCallback } from "react";
import { useAppContext } from "../../app-context";

const InputCell = ({ num }: {
  num: number,
}): JSX.Element => {
  const { setNumber } = useAppContext();
  
  const handleClick = useCallback(() => {
    setNumber(num);
  }, [setNumber, num]);

  return (
    <div className="input-cell" onClick={handleClick}>{num}</div>
  );
};

export default InputCell;
