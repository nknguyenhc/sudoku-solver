import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type CellCoordType = {
  i: number,
  j: number,
};

type GroupSumType = {
  cells: Array<CellCoordType>,
  sum: number,
};

export type BordersType = {
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
};

const defaultBorder: BordersType = {
  top: false,
  right: false,
  bottom: false,
  left: false,
};

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
};

enum ShiftStateType {
  NORMAL,
  HOLDING,
  CONFIRMING,
  RELEASED,
}

type AppContextType = {
  getNumber: (i: number, j: number) => number | undefined,
  setNumber: (value: number | undefined) => void,
  isHighlighted: (i: number, j: number) => boolean,
  isFocused: (i: number, j: number) => boolean,
  isManuallySet: (i: number, j: number) => boolean,
  isInGroup: (i: number, j: number) => boolean,
  getBorders: (i: number, j: number) => BordersType,
  setHighlightCell: Dispatch<SetStateAction<CellCoordType>>,
  switchHoldingShift: () => void,
  shiftHighlightCell: (i: number, j: number) => void,
  numberInput: number,
  setNumberInput: Dispatch<SetStateAction<number>>,
  showCellForInput: boolean,
  solve: () => void,
  resetSolution: () => void,
  clear: () => void,
}

const useAppStates = (): AppContextType => {
  const [numbers, setNumbers] = useState<Array<Array<number | undefined>>>(
    Array<Array<number | undefined>>(9).fill(Array<number | undefined>(9).fill(undefined)));
  const [highlightCell, setHighlightCell] = useState<CellCoordType>({
    i: 0,
    j: 0,
  });

  const [manuallySet, setManuallySet] = useState<Array<Array<boolean>>>(
    Array<Array<boolean>>(9).fill(Array<boolean>(9).fill(false)));
  
  const [shiftState, setShiftState] = useState<ShiftStateType>(ShiftStateType.NORMAL);
  const [groupNumbers, setGroupNumbers] = useState<Array<Array<boolean>>>(
    Array<Array<boolean>>(9).fill(Array<boolean>(9).fill(false)));
  const [groupSums, setGroupSums] = useState<Array<GroupSumType>>([]);
  const [borders, setBorders] = useState<Array<Array<BordersType>>>(
    Array<Array<BordersType>>(9).fill(Array<undefined>(9).fill(undefined).map(
      () => ({...defaultBorder}))));
  const [numberInput, setNumberInput] = useState<number>(0);
  const [showCellForInput, setShowCellForInput] = useState<boolean>(false);

  const { pathname } = useLocation();
  
  const setNumber = useCallback((value: number | undefined) => {
    if (shiftState !== ShiftStateType.NORMAL) {
      return;
    }
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
  }, [highlightCell, shiftState]);

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

  const switchHoldingShift = useCallback(() => {
    if (pathname !== '/killer') {
      return;
    }
    switch (shiftState) {
      case ShiftStateType.NORMAL:
      case ShiftStateType.RELEASED:
        setShiftState(ShiftStateType.HOLDING);
        break;
      case ShiftStateType.CONFIRMING:
        setShiftState(ShiftStateType.RELEASED);
        break;
      case ShiftStateType.HOLDING:
        setShiftState(ShiftStateType.CONFIRMING);
        break;
    }
  }, [shiftState, pathname]);

  const isInGroup = useCallback((i: number, j: number) => {
    return groupNumbers[i][j];
  }, [groupNumbers]);

  const getBorders = useCallback((i: number, j: number) => {
    return borders[i][j]
  }, [borders]);

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

  const addGroup = useCallback(() => {
    if (!groupNumbers[highlightCell.i][highlightCell.j]) {
      return;
    }
    const cells: Array<CellCoordType> = [highlightCell];
    var currLowest: CellCoordType = highlightCell;
    var pointer: number = 0;
    while (pointer < cells.length) {
      const currCell = cells[pointer];
      if (currCell.i > 0 && groupNumbers[currCell.i - 1][currCell.j]
        && !cells.find(x => x.i === currCell.i - 1 && x.j === currCell.j)) {
        const newCell = {
          i: currCell.i - 1,
          j: currCell.j,
        };
        cells.push(newCell);
        if (newCell.i < currLowest.i) {
          currLowest = newCell;
        }
      }
      if (currCell.i < 8 && groupNumbers[currCell.i + 1][currCell.j]
        && !cells.find(x => x.i === currCell.i + 1 && x.j === currCell.j)) {
        cells.push({
          i: currCell.i + 1,
          j: currCell.j,
        });
      }
      if (currCell.j > 0 && groupNumbers[currCell.i][currCell.j - 1]
        && !cells.find(x => x.i === currCell.i && x.j === currCell.j - 1)) {
        cells.push({
          i: currCell.i,
          j: currCell.j - 1,
        });
      }
      if (currCell.j < 8 && groupNumbers[currCell.i][currCell.j + 1]
        && !cells.find(x => x.i === currCell.i && x.j === currCell.j + 1)) {
        cells.push({
          i: currCell.i,
          j: currCell.j + 1,
        });
      }
      pointer++;
    }
    setGroupSums(groupSums => [...groupSums, {
      cells: cells,
      sum: numberInput,
    }]);

    if (cells.length === 1) {
      setBorders(borders => {
        const newBorders = borders.map(row => [...row]);
        newBorders[cells[0].i][cells[0].j] = {
          top: true,
          right: true,
          bottom: true,
          left: true,
        };
        return newBorders;
      });
      return;
    }

    // travel clockwise in one round
    setBorders(borders => {
      var currCell: CellCoordType = currLowest;
      var currDirection: Direction = Direction.RIGHT;
      const newBorders = borders.map(row => [...row]);
      var firstDirection: Direction | undefined = undefined;
      const moveUp = (currCell: CellCoordType): [Direction, CellCoordType] => {
        return [
          Direction.UP,
          {
            i: currCell.i - 1,
            j: currCell.j,
          },
        ];
      };
      const moveRight = (currCell: CellCoordType): [Direction, CellCoordType] => {
        return [
          Direction.RIGHT,
          {
            i: currCell.i,
            j: currCell.j + 1,
          },
        ];
      };
      const moveDown = (currCell: CellCoordType): [Direction, CellCoordType] => {
        return [
          Direction.DOWN,
          {
            i: currCell.i + 1,
            j: currCell.j,
          },
        ];
      };
      const moveLeft = (currCell: CellCoordType): [Direction, CellCoordType] => {
        return [
          Direction.LEFT,
          {
            i: currCell.i,
            j: currCell.j - 1,
          },
        ];
      };
      const considerNext = (currDirection: Direction, currCell: CellCoordType, thisBorder: BordersType): [Direction, CellCoordType] => {
        switch (currDirection) {
          case Direction.RIGHT:
            if (!thisBorder.top) {
              return moveUp(currCell);
            } else if (!thisBorder.right) {
              return moveRight(currCell);
            } else if (!thisBorder.bottom) {
              return moveDown(currCell);
            } else {
              return moveLeft(currCell);
            }
          case Direction.DOWN:
            if (!thisBorder.right) {
              return moveRight(currCell);
            } else if (!thisBorder.bottom) {
              return moveDown(currCell);
            } else if (!thisBorder.left) {
              return moveLeft(currCell);
            } else {
              return moveUp(currCell);
            }
          case Direction.LEFT:
            if (!thisBorder.bottom) {
              return moveDown(currCell);
            } else if (!thisBorder.left) {
              return moveLeft(currCell);
            } else if (!thisBorder.top) {
              return moveUp(currCell);
            } else {
              return moveRight(currCell);
            }
          case Direction.UP:
            if (!thisBorder.left) {
              return moveLeft(currCell);
            } else if (!thisBorder.top) {
              return moveUp(currCell);
            } else if (!thisBorder.right) {
              return moveRight(currCell);
            } else {
              return moveDown(currCell);
            }
        }
      }
      while (true) {
        const thisBorder: BordersType = {
          top: currCell.i === 0 || !groupNumbers[currCell.i - 1][currCell.j],
          right: currCell.j === 8 || !groupNumbers[currCell.i][currCell.j + 1],
          bottom: currCell.i === 8 || !groupNumbers[currCell.i + 1][currCell.j],
          left: currCell.j === 0 || !groupNumbers[currCell.i][currCell.j - 1],
        };
        newBorders[currCell.i][currCell.j] = thisBorder;
        var nextCell: CellCoordType;
        [currDirection, nextCell] = considerNext(currDirection, currCell, thisBorder);
        if (!firstDirection) {
          firstDirection = currDirection;
        } else if (currCell.i === currLowest.i && currCell.j === currLowest.j && currDirection === firstDirection) {
          break;
        }
        currCell = nextCell;
      }
      return newBorders;
    });
  }, [highlightCell, groupNumbers, numberInput]);

  const resetShiftState = useCallback(() => {
    setShiftState(ShiftStateType.NORMAL);
    setGroupNumbers(Array<Array<boolean>>(9).fill(Array<boolean>(9).fill(false)));
    setNumberInput(0);
  }, []);

  useEffect(() => {
    console.log(groupSums);
  }, [groupSums]);

  useEffect(() => {
    if (pathname !== '/killer') {
      resetShiftState();
    }
  }, [pathname, resetShiftState]);

  useEffect(() => {
    if (shiftState !== ShiftStateType.HOLDING) {
      return;
    }
    setGroupNumbers((groupNumbers) => {
      const newGroupNumbers = groupNumbers.map(row => [...row]);
      newGroupNumbers[highlightCell.i][highlightCell.j] = true;
      return newGroupNumbers;
    });
  }, [shiftState, highlightCell]);

  useEffect(() => {
    if (shiftState !== ShiftStateType.RELEASED) {
      return;
    }
    addGroup();
    resetShiftState();
  }, [shiftState, addGroup, resetShiftState]);

  useEffect(() => {
    if (shiftState !== ShiftStateType.CONFIRMING) {
      setShowCellForInput(false);
      return;
    }
    setShowCellForInput(true);
  }, [shiftState]);

  return {
    getNumber,
    setNumber,
    isHighlighted,
    isFocused,
    isManuallySet,
    isInGroup,
    getBorders,
    setHighlightCell,
    switchHoldingShift,
    shiftHighlightCell,
    numberInput,
    setNumberInput,
    showCellForInput,
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
