from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from functools import reduce
from typing import List

from model.solver import InvalidSudokuException, Sudoku, SudokuSolver
from model.killer import KillerConstraint, KillerSudoku

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

@app.get("/")
@app.get("/normal")
@app.get("/killer")
def root():
    return FileResponse("frontend/build/index.html")


@app.get("/favicon.ico")
@app.get("/logo.png")
def logo():
    return FileResponse("frontend/build/logo.png")


@app.get("/manifest.json")
def manifest():
    return FileResponse("frontend/build/manifest.json")


class Puzzle(BaseModel):
    """`puzzle` must be of length 81 representing the cells of a puzzle,
    each character is a number, or a whitespace if empty"""
    puzzle: str


def char_to_val(char):
    if char == ' ':
        return None
    else:
        return int(char)


def read_board(puzzle_string):
    try:
        return [[char_to_val(char) for char in puzzle_string[9 * i: 9 * i + 9]] for i in range(9)]
    except ValueError:
        raise HTTPException(status_code=400, detail="Puzzle contains an invalid character")


def result_string_from_sudoku(sudoku):
    return reduce(
        lambda x, y: x + y,
        map(
            lambda row: reduce(
                lambda x, y: str(x) + str(y),
                row,
            ),
            sudoku.board,
        ),
    )


@app.post("/solve")
def solve(body: Puzzle):
    if len(body.puzzle) != 81:
        raise HTTPException(status_code=400, detail="Puzzle not of length 81")
    
    board = read_board(body.puzzle)
    
    try:
        sudoku = Sudoku(board)
        result = SudokuSolver().solve(sudoku)
    except InvalidSudokuException:
        result = None
    if result is None:
        return {
            "success": False,
        }

    result_string = result_string_from_sudoku(result)
    return {
        "success": True,
        "solution": result_string,
    }

class KillerPuzzle(BaseModel):
    puzzle: str
    constraints: List[str]


def read_constraint(constraint_string):
    coords_string, value_string = constraint_string.split(" ")
    if len(coords_string) % 2 != 0:
        raise HTTPException(status_code=400, detail="Invalid constraint string encountered")
    coords = set()
    for i in range(len(coords_string) // 2):
        x = int(constraint_string[2 * i])
        y = int(constraint_string[2 * i + 1])
        coords.add((x, y))
    v = int(value_string)
    return KillerConstraint(coords, v)


@app.post("/solve-killer")
def solve_killer(body: KillerPuzzle):
    if len(body.puzzle) != 81:
        raise HTTPException(status_code=400, detail="Puzzle not of length 81")
    
    board = read_board(body.puzzle)
    
    constraints = []
    for constraint_string in body.constraints:
        try:
            constraints.append(read_constraint(constraint_string))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid constraint string encountered")
    
    try:
        sudoku = KillerSudoku(board, constraints)
        result = SudokuSolver().solve(sudoku)
    except InvalidSudokuException:
        result = None
    
    if result is None:
        return {
            "success": False,
        }
    
    result_string = result_string_from_sudoku(result)
    return {
        "success": True,
        "solution": result_string,
    }
