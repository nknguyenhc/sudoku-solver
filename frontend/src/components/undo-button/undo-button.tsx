import { useAppContext } from "../../app-context";

const UndoButton = (): JSX.Element => {
  const { undoGroup } = useAppContext();

  return (
    <button className="undo-button" onClick={undoGroup}>Undo</button>
  );
};

export default UndoButton;
