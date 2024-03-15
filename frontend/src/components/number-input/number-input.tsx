import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { useAppContext } from "../../app-context";

const NumberInput = (): JSX.Element => {
  const { numberInput, setNumberInput, showCellForInput } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: ChangeEvent) => {
    setNumberInput(Number((e.target as HTMLInputElement).value))
  }, [setNumberInput]);

  useEffect(() => {
    if (!showCellForInput) {
      return;
    }
    (inputRef.current as HTMLInputElement).select();
  }, [showCellForInput]);

  return (
    <input
      type="number"
      value={numberInput}
      onChange={handleChange}
      className="number-input"
      ref={inputRef}
    />
  )
};

export default NumberInput;
