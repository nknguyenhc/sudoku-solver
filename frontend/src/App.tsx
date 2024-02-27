import { useEffect } from 'react';
import './App.scss';
import Board from './components/board/board';
import { useAppContext } from './app-context';

function App() {
  const { setNumber } = useAppContext();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '.') {
        setNumber(undefined);
        return;
      }
      const number = Number(e.key);
      if (number) {
        setNumber(number);
      }
    }
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [setNumber]);

  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
