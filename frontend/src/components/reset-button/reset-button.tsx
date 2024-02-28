import { useAppContext } from "../../app-context";

const ResetButton = (): JSX.Element => {
  const { resetSolution } = useAppContext();

  return (
    <button className="reset-button" onClick={resetSolution}>Reset solution</button>
  );
};

export default ResetButton;
