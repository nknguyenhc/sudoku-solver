import { useEffect } from 'react';
import './App.scss';
import Board from './components/board/board';
import { useAppContext } from './app-context';
import Controls from './components/controls/controls';

function App() {
  const { setNumber } = useAppContext();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '.' || e.key === 'Backspace' || e.key === 'Delete') {
        setNumber(undefined);
        return;
      }
      const number = Number(e.key);
      if (number) {
        setNumber(number);
      }
    }
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [setNumber]);

  return (
    <div className="app">
      <Board />
      <Controls />
    </div>
  );
}

export default App;
