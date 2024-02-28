import { useAppContext } from "../../app-context";

const ClearButton = (): JSX.Element => {
  const { clear } = useAppContext();

  return (
    <button className="clear-button" onClick={clear}>Clear</button>
  );
};

export default ClearButton;
