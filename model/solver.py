from copy import deepcopy

class InvalidSudokuException(Exception):
    def __init__(self, i, j):
        super().__init__(f"No value available at ({i}, {j})")

class Sudoku:
    """A class to store the board, list of assignments and reduced domains"""
    def __init__(self, board, domains=None):
        """Assume that board and domains are already copied and is not used elsewhere
        The board is a 9x9 board, where filled numbers are ints, and unfilled are None.
        Domains is a dictionary of keys of coordinates and values are the corresponding domain.
        Eg: {(0, 1): {1, 2, 3}}
        """
        self.board = board
        if domains:
            self.domains = domains
        else:
            self.domains = Sudoku.generate_default_domains(board)
    
    def generate_default_domains(board):
        """Generate the default domain for unfilled cells for the given board,
        when domain is not given
        """
        domains = dict()
        for i in range(9):
            for j in range(9):
                if board[i][j] is not None:
                    continue
                domain = {1, 2, 3, 4, 5, 6, 7, 8, 9}
                domain = Sudoku.reduce_domain(domain, board, i, j)
                domains[(i, j)] = domain
        return domains
    
    def reduce_domain(domain, board, i, j):
        domain = Sudoku.reduce_domain_in_row(domain, board, i)
        domain = Sudoku.reduce_domain_in_column(domain, board, j)
        domain = Sudoku.reduce_domain_in_group(domain, board, i, j)
        if len(domain) == 0:
            raise InvalidSudokuException(i, j)
        return domain
    
    def reduce_domain_in_row(domain, board, i):
        for j in range(9):
            if board[i][j] in domain:
                domain.remove(board[i][j])
        return domain
    
    def reduce_domain_in_column(domain, board, j):
        for i in range(9):
            if board[i][j] in domain:
                domain.remove(board[i][j])
        return domain
    
    def reduce_domain_in_group(domain, board, row, col):
        start_i = 3 * (row // 3)
        start_j = 3 * (col // 3)
        for i in range(start_i, start_i + 3):
            for j in range(start_j, start_j + 3):
                if board[i][j] in domain:
                    domain.remove(board[i][j])
        return domain
    
    def assign(self, cell, value):
        """Assign the cell to the value,
        returning a new instance of Sudoku and leave this instance intact
        """
        board = deepcopy(self.board)
        domains = deepcopy(self.domains)
        domains.pop(cell, None)
        board[cell[0]][cell[1]] = value
        sudoku = Sudoku(board, domains)
        sudoku.propagate_constraints()
        return sudoku
    
    def propagate_constraints(self):
        """Update the domains based on the board"""
        for cell, domain in self.domains.items():
            updated_domain = Sudoku.reduce_domain(
                domain, self.board, cell[0], cell[1])
            self.domains[cell] = updated_domain
    
    def __eq__(self, other):
        if not isinstance(other, Sudoku):
            return False
        return self.board == other.board
    
    def is_terminal(self):
        """Check if the board is completed
        This means that the domains dict is empty.
        """
        return len(self.domains) == 0
    
    def minimum_domain_cell(self):
        min_cell = None
        domain_size = 10
        for cell, domain in self.domains.items():
            curr_size = len(domain)
            if curr_size == 1:
                return cell
            if curr_size < domain_size:
                domain_size = curr_size
                min_cell = cell
        return min_cell


class SudokuSolver:
    """An agent to solve Sudoku, as CSP"""
    def __init__(self):
        pass
    
    def solve(self, sudoku):
        if sudoku.is_terminal():
            return sudoku
        cell = sudoku.minimum_domain_cell()
        for value in sudoku.domains[cell]:
            try:
                new_sudoku = sudoku.assign(cell, value)
            except InvalidSudokuException:
                continue
            result = self.solve(new_sudoku)
            if result is not None:
                return result
        return None
