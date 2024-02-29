from killer import KillerConstraint, KillerSudoku
from solver import SudokuSolver

def test_constraints_0():
    constraint = KillerConstraint({}, 7)
    assert constraint.available_values == set()

def test_constraints_1():
    constraint = KillerConstraint({(0, 0)}, 6)
    assert constraint.available_values == {6}
    constraint = KillerConstraint({(0, 0)}, 10)
    assert constraint.available_values == set()

def test_constraints_2():
    constraint = KillerConstraint({(0, 0), (0, 1)}, 2)
    assert constraint.available_values == set()
    constraint = KillerConstraint({(0, 0), (0, 1)}, 6)
    assert constraint.available_values == {1, 2, 4, 5}
    constraint = KillerConstraint({(0, 0), (0, 1)}, 11)
    assert constraint.available_values == {2, 3, 4, 5, 6, 7, 8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1)}, 17)
    assert constraint.available_values == {8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1)}, 18)
    assert constraint.available_values == set()

def test_constraints_3():
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 5)
    assert constraint.available_values == set()
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 6)
    assert constraint.available_values == {1, 2, 3}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 15)
    assert constraint.available_values == {1, 2, 3, 4, 5, 6, 7, 8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 20)
    assert constraint.available_values == {3, 4, 5, 6, 7, 8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 23)
    assert constraint.available_values == {6, 8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 25)
    assert constraint.available_values == set()

def test_constraints_more():
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)}, 45)
    assert constraint.available_values == {1, 2, 3, 4, 5, 6, 7, 8, 9}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)}, 46)
    assert constraint.available_values == set()
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)}, 44)
    assert constraint.available_values == set()
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1)}, 35)
    assert constraint.available_values == set()
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1)}, 37)
    assert constraint.available_values == {1, 2, 3, 4, 5, 6, 7, 9}

def test_contains():
    constraint = KillerConstraint({(0, 0), (2, 2)}, 3)
    assert constraint.contains((0, 0))
    assert not constraint.contains((2, 0))

def test_remove_cell():
    constraint = KillerConstraint({(0, 0), (2, 2)}, 5)
    constraint = constraint.remove_cell((0, 0), 2)
    assert constraint.coords == {(2, 2)}
    assert constraint.value == 3
    assert constraint.available_values == {3}
    constraint = KillerConstraint({(0, 0), (0, 1), (0, 2)}, 10)
    constraint = constraint.remove_cell((0, 0), 2)
    assert constraint.coords == {(0, 1), (0, 2)}
    assert constraint.value == 8
    assert constraint.available_values == {1, 2, 3, 5, 6, 7}

def read_constraint(string):
    """Read the constraint from the string representation
    The string representation is as follows:
    "x0 y0 x1 y1 ... xn yn v", where (xi, yi) are coordinates of the cells,
    and v is the sum of the cells"""
    nums = string.split(" ")
    coords = set()
    for i in range(len(nums) // 2):
        x = int(nums[2 * i])
        y = int(nums[2 * i + 1])
        coords.add((x, y))
    v = int(nums[-1])
    return KillerConstraint(coords, v)

def read_file(filename):
    """Returns an instance of KillerSudoku from the file"""
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
        board = [readline(f) for i in range(9)]
        line = f.readline()
        constraints = []
        while line:
            line = line.strip()
            constraint = read_constraint(line)
            constraints.append(constraint)
            line = f.readline()
        return KillerSudoku(board, constraints)

def test_solve_case(casename):
    print(f"Testing case {casename}")
    in_sudoku = read_file(f"killer.{casename}.in")
    result = SudokuSolver().solve(in_sudoku)
    out_sudoku = read_file(f"killer.{casename}.out")
    assert out_sudoku == result

def main():
    test_constraints_0()
    test_constraints_1()
    test_constraints_2()
    test_constraints_3()
    test_constraints_more()
    test_contains()
    test_remove_cell()
    test_solve_case("easy")
    test_solve_case("medium")
    test_solve_case("hard")
    test_solve_case("expert")

if __name__ == '__main__':
    main()
