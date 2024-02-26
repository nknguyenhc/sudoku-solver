# sudoku-solver

Solve sudoku puzzles.

## About

Do you know what is my biggest achievement in this project? Being able to build a brute-force machine!

I'm just kidding. Sudoku puzzles fall under the class of constraint-satisfaction problems (CSP). However, unlike a normal CSP which can have many solutions, each sudoku puzzle generally only has 1 solution.

To solve this problem, we programmatically state the problem with a `9x9` array. We also keep track of the domain of each cell, which is the set of possible values that the cell can have.

Given an initial board config, we first reduce the domains of the cells.

At each step, whenever we assign a cell with a value, we reduce the domains of the other cells. If one unfilled cell has empty domain, we raise an exception to notify that the configuration cannot be solved.

We use minimum-remaining-values heuristic to select the next cell to try out. This is because each cell has to be filled up with a value anyway, hence trying out cells with lower number of possible values means that it is more probable that we can skip some iterations.

After selecting the cell to try out, we iterate through all values. In each iteration, we try out the next cells. If one iteration finds a possible solution, we return that solution. If all iterations do not find a solution, we return `None` to indicate that the current sudoku config is not solvable.

## Try this out

If you wish to try out my algorithm,

1. Clone this repo.

```
git clone https://github.com/nknguyenhc/sudoku-solver.git
```

2. Redirect to the `model` folder.

```
cd model
```

3. Add your test case.

Test case inputs and outputs are located in `tests` folder.

The test case input file should contain 9 lines, each line contains the cells that are whitespace-separated. Empty cell should be represented by `_`. If you want to name your test as `my_test`, your input file should be named `my_test.in`.

Test case output file should similarly contain 9 lines, and should not have any empty cell. If you want to name your test as `my_test`, your input file should be named `my_test.out`.

4. Run your test.

Add your test case to `solver-test.py`. In `main` method, assuming that you want to name your test as `my_test`:

```py
test_solve_case("my_test")
```

And then, in `model` folder, run the following command:

```
python solver-test.py
```

If your test passes, it should only print out notification that the test case is running, and exit after a short moment.
