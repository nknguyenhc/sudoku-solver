from solver import InvalidSudokuException, Sudoku, SudokuSolver

def get_empty_sudoku():
    board = list(list(None for i in range(9)) for j in range(9))
    return Sudoku(board)

def read_file(filename):
    """Returns the board from the file"""
    def read_char(char):
        if char == '_':
            return None
        else:
            return int(char)
        
    def readline(f):
        line = f.readline().strip()
        cells = [read_char(char) for char in line.split(' ')]
        return cells

    with open(f"tests/{filename}", 'r') as f:
        return [readline(f) for i in range(9)]

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

def test_minimum_domain_cell():
    sudoku = get_empty_sudoku()
    sudoku = (
        sudoku.assign((1, 0), 1)
        .assign((1, 1), 3)
        .assign((6, 2), 4)
        .assign((2, 7), 8)
    )
    assert sudoku.minimum_domain_cell() == (2, 2)

def test_solve_case(casename):
    print(f"Testing case {casename}")
    in_board = read_file(f"{casename}.in")
    result = SudokuSolver().solve(Sudoku(in_board))
    out_board = read_file(f"{casename}.out")
    assert Sudoku(out_board) == result

def main():
    test_empty_board()
    test_reduced_domain()
    test_not_reduced_domain()
    test_minimum_domain_cell()
    test_solve_case("easy")
    test_solve_case("medium")
    test_solve_case("hard")
    test_solve_case("expert")
    test_solve_case("master")

if __name__ == '__main__':
    main()
