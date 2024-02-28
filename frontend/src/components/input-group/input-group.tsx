import InputCell from "../input-cell/input-cell";

const InputGroup = (): JSX.Element => {
  return (
    <div className="input-group">
      <div className="input-group-row">
        {[1, 2, 3].map((num) => (
          <InputCell num={num} key={num} />
        ))}
      </div>
      <div className="input-group-row">
        {[4, 5, 6].map((num) => (
          <InputCell num={num} key={num} />
        ))}
      </div>
      <div className="input-group-row">
        {[7, 8, 9].map((num) => (
          <InputCell num={num} key={num} />
        ))}
      </div>
    </div>
  );
};

export default InputGroup;
