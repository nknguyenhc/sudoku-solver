import { useAppContext } from "../../app-context";

const SolveButton = (): JSX.Element => {
  const { solve } = useAppContext();
  
  return (
    <button className="solve-button" onClick={solve}>Solve!</button>
  );
};

export default SolveButton;
