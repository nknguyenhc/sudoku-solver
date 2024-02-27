import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext, useState } from "react";

export type CellCoordType = {
  i: number,
  j: number,
};

type AppContextType = {
  getNumber: (i: number, j: number) => number | undefined,
  setNumber: (value: number | undefined) => void,
  isHighlighted: (i: number, j: number) => boolean,
  isFocused: (i: number, j: number) => boolean,
  setHighlightCell: Dispatch<SetStateAction<CellCoordType>>,
  solve: () => void,
}

const useAppStates = (): AppContextType => {
  const [numbers, setNumbers] = useState<Array<Array<number | undefined>>>(
    Array<Array<number | undefined>>(9).fill(Array<number | undefined>(9).fill(undefined)));
  const [highlightCell, setHighlightCell] = useState<{i: number, j: number}>({
    i: 0,
    j: 0,
  });
  
  const setNumber = useCallback((value: number | undefined) => {
    setNumbers(numbers => {
      const newNumbers = numbers.map(row => [...row]);
      newNumbers[highlightCell.i][highlightCell.j] = value;
      return newNumbers;
    });
  }, [highlightCell]);

  const getNumber = useCallback((i: number, j: number) => numbers[i][j], [numbers]);

  const isHighlighted = useCallback((i: number, j: number) => {
    return i === highlightCell.i
      || j === highlightCell.j
      || (Math.floor(i / 3) === Math.floor(highlightCell.i / 3)
        && Math.floor(j / 3) === Math.floor(highlightCell.j / 3));
  }, [highlightCell]);

  const isFocused = useCallback((i: number, j: number) => {
    return highlightCell.i === i && highlightCell.j === j;
  }, [highlightCell]);

  const solve = useCallback(() => {
    const puzzleString = numbers.map(
      row => row.map(cell => cell ? String(cell) : ' ')
        .reduce((x, y) => x + y)).reduce((x, y) => x + y);
    fetch('/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puzzle: puzzleString,
      }),
    })
      .then(res => {
        if (res.status !== 200) {
          alert("Something went wrong ...");
          return;
        }
        res.json().then(res => {
          if (!res.success) {
            alert("Puzzle has no solution!");
            return;
          }
          const solution: string = res.solution;
          const solutionArr = Array.from(Array(9).keys())
            .map(i => solution.slice(9 * i, 9 * i + 9).split('').map(cell => Number(cell)));
          setNumbers(solutionArr);
        });
      });
  }, [numbers]);

  return {
    getNumber,
    setNumber,
    isHighlighted,
    isFocused,
    setHighlightCell,
    solve,
  };
};

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren<{}>): JSX.Element => (
  <AppContext.Provider value={useAppStates()}>{children}</AppContext.Provider>
);

export const useAppContext = (): AppContextType => useContext(AppContext) as AppContextType;