import { useEffect } from 'react';
import './App.scss';
import Board from './components/board/board';
import { useAppContext } from './app-context';
import Controls from './components/controls/controls';

function App() {
  const { setNumber, shiftHighlightCell } = useAppContext();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case '.':
        case 'Backspace':
        case 'Delete':
          setNumber(undefined);
          break;
        case 'ArrowRight':
        case 'd':
          shiftHighlightCell(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          shiftHighlightCell(0, -1);
          break;
        case 'ArrowUp':
        case 'w':
          shiftHighlightCell(-1, 0);
          break;
        case 'ArrowDown':
        case 's':
          shiftHighlightCell(1, 0);
          break;
        default:
          const number = Number(e.key);
          if (number) {
            setNumber(number);
          }
          break;
      }
    }
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [setNumber, shiftHighlightCell]);

  return (
    <div className="app">
      <Board />
      <Controls />
    </div>
  );
}

export default App;
