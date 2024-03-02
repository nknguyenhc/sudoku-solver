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
  isManuallySet: (i: number, j: number) => boolean,
  setHighlightCell: Dispatch<SetStateAction<CellCoordType>>,
  shiftHighlightCell: (i: number, j: number) => void,
  solve: () => void,
  resetSolution: () => void,
  clear: () => void,
}

const useAppStates = (): AppContextType => {
  const [numbers, setNumbers] = useState<Array<Array<number | undefined>>>(
    Array<Array<number | undefined>>(9).fill(Array<number | undefined>(9).fill(undefined)));
  const [highlightCell, setHighlightCell] = useState<{i: number, j: number}>({
    i: 0,
    j: 0,
  });

  const [manuallySet, setManuallySet] = useState<Array<Array<boolean>>>(
    Array<Array<boolean>>(9).fill(Array<boolean>(9).fill(false)));
  
  const setNumber = useCallback((value: number | undefined) => {
    setNumbers(numbers => {
      const newNumbers = numbers.map(row => [...row]);
      newNumbers[highlightCell.i][highlightCell.j] = value;
      return newNumbers;
    });
    setManuallySet(manuallySet => {
      const newManuallySet = manuallySet.map(row => [...row]);
      newManuallySet[highlightCell.i][highlightCell.j] = value !== undefined;
      return newManuallySet;
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

  const isManuallySet = useCallback((i: number, j: number) => {
    return manuallySet[i][j];
  }, [manuallySet]);

  const shiftHighlightCell = useCallback((i: number, j: number) => {
    const newI = highlightCell.i + i;
    const newJ = highlightCell.j + j;
    if (newI >= 0 && newI < 9 && newJ >= 0 && newJ < 9) {
      setHighlightCell({
        i: newI,
        j: newJ,
      });
    }
  }, [highlightCell]);

  const solve = useCallback(() => {
    const puzzleString = numbers.map(
      (row, i) => row.map((cell, j) => manuallySet[i][j] && cell ? String(cell) : ' ')
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
  }, [numbers, manuallySet]);

  const resetSolution = useCallback(() => {
    setNumbers(numbers => {
      return numbers.map((row, rowIndex) => row.map((cell, cellIndex) =>
        manuallySet[rowIndex][cellIndex] ? cell : undefined));
    });
  }, [manuallySet]);

  const clear = useCallback(() => {
    setNumbers(Array<Array<number | undefined>>(9).fill(Array<number | undefined>(9).fill(undefined)));
    setManuallySet(Array<Array<boolean>>(9).fill(Array<boolean>(9).fill(false)));
  }, []);

  return {
    getNumber,
    setNumber,
    isHighlighted,
    isFocused,
    isManuallySet,
    setHighlightCell,
    shiftHighlightCell,
    solve,
    resetSolution,
    clear,
  };
};

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren<{}>): JSX.Element => (
  <AppContext.Provider value={useAppStates()}>{children}</AppContext.Provider>
);

export const useAppContext = (): AppContextType => useContext(AppContext) as AppContextType;
