from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from functools import reduce

from model.solver import InvalidSudokuException, Sudoku, SudokuSolver

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


@app.post("/solve")
def solve(body: Puzzle):
    if len(body.puzzle) != 81:
        raise HTTPException(status_code=400, detail="Puzzle not of length 81")
    
    try:
        board = [[char_to_val(char) for char in body.puzzle[9 * i: 9 * i + 9]] for i in range(9)]
    except ValueError:
        raise HTTPException(status_code=400, detail="Puzzle contains an invalid character")
    
    try:
        sudoku = Sudoku(board)
        result = SudokuSolver().solve(sudoku)
    except InvalidSudokuException:
        result = None
    if result is None:
        return {
            "success": False,
        }

    result_string = reduce(
        lambda x, y: x + y,
        map(
            lambda row: reduce(
                lambda x, y: str(x) + str(y),
                row,
            ),
            result.board,
        ),
    )
    return {
        "success": True,
        "solution": result_string,
    }
