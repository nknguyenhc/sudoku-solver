from solver import Sudoku, InvalidSudokuException

def get_empty_sudoku():
    board = list(list(None for i in range(9)) for j in range(9))
    return Sudoku(board)

def test_empty_board():
    sudoku = get_empty_sudoku()
    for i in range(9):
        for j in range(9):
            assert sudoku.domains[(i, j)] == {1, 2, 3, 4, 5, 6, 7, 8, 9}

def test_reduced_domain():
    sudoku = get_empty_sudoku()
    sudoku = (
        sudoku.assign((0, 0), 1)
        .assign((0, 1), 2)
        .assign((1, 0), 3)
        .assign((1, 1), 5)
        .assign((2, 1), 7)
        .assign((0, 5), 3)
        .assign((7, 2), 8)
    )
    assert sudoku.domains[(0, 2)] == {4, 6, 9}

def test_not_reduced_domain():
    sudoku = get_empty_sudoku()
    sudoku = (
        sudoku.assign((0, 0), 1)
        .assign((0, 1), 3)
        .assign((1, 3), 5)
        .assign((2, 3), 6)
        .assign((5, 1), 9)
    )
    assert sudoku.domains[(0, 2)] == {2, 4, 5, 6, 7, 8, 9}

def exception_raised():
    sudoku = get_empty_sudoku()
    sudoku = (
        sudoku.assign((0, 0), 1)
        .assign((0, 1), 2)
        .assign((1, 0), 3)
        .assign((1, 1), 4)
        .assign((1, 2), 5)
        .assign((2, 1), 6)
        .assign((2, 2), 7)
        .assign((0, 5), 8)
    )
    try:
        sudoku.assign((0, 8), 9)
        assert False
    except Exception as e:
        assert isinstance(e, InvalidSudokuException)
    try:
        sudoku.assign((2, 0), 9)
        assert False
    except Exception as e:
        assert isinstance(e, InvalidSudokuException)
    try:
        sudoku.assign((7, 2), 9)
        assert False
    except Exception as e:
        assert isinstance(e, InvalidSudokuException)

def main():
    test_empty_board()
    test_reduced_domain()
    test_not_reduced_domain()

if __name__ == '__main__':
    main()
