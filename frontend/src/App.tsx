import { useEffect } from 'react';
import './App.scss';
import Board from './components/board/board';
import { AppContextProvider, useAppContext } from './app-context';
import Controls from './components/controls/controls';
import VariantSelector from './components/variant-selector/variant-selector';

const App = () => (
  <AppContextProvider>
    <MainApp />
  </AppContextProvider>
)

const MainApp = (): JSX.Element => {
  const {
    setNumber,
    shiftHighlightCell,
    switchHoldingShift,
    switchHoldingShiftWithEnter,
  } = useAppContext();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case '.':
        case 'Backspace':
        case 'Delete':
          setNumber(undefined);
          break;
        case 'Shift':
          switchHoldingShift();
          break;
        case 'Enter':
          switchHoldingShiftWithEnter();
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
  }, [setNumber, shiftHighlightCell, switchHoldingShift, switchHoldingShiftWithEnter]);

  return (
    <div className="main">
      <VariantSelector />
      <div className="app">
        <Board />
        <Controls />
      </div>
    </div>
  );
}

export default App;
