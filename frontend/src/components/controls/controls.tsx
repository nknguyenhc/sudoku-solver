import InputGroup from "../input-group/input-group";
import SolveButton from "../solve-button/solve-button";

const Controls = (): JSX.Element => {
  return (
    <div className="controls">
      <InputGroup />
      <SolveButton />
    </div>
  );
}

export default Controls;
