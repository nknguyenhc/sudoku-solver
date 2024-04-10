from copy import deepcopy
from model.solver import Sudoku, InvalidSudokuException

class KillerConstraint():
    def __init__(self, coords, value):
        """Instantiate a new constraint
        Coords is a set of coordinates, each is a tuple of 2 elements representing the cell coordinates.
        Value is an integer represent sum of the cells."""
        self.coords = coords
        self.value = value
        self.available_values = self.calc_available_values()
    
    def calc_available_values(self):
        """Calculate the possible values that can be used to fulfil the sum
        Each number must be unique."""
        count = len(self.coords)
        if count == 0:
            return set()
        elif count == 1:
            return set([self.value]) if (self.value >= 1 and self.value <= 9) else set()

        values = [i for i in range(count - 1)]
        i = 0
        domain = set()
        while True:
            if i == 0:
                if values[i] == 9 - count + 1:
                    break
                else:
                    values[i] += 1
                    i += 1
            elif i < count - 1:
                if values[i] == 9 - count + i + 1:
                    values[i] = 0
                    i -= 1
                elif values[i] == 0:
                    values[i] = values[i - 1] + 1
                    i += 1
                else:
                    values[i] += 1
                    i += 1
            else:
                last_value = self.value - sum(values)
                if last_value > values[i - 1] and last_value <= 9:
                    new_domain = set(values)
                    new_domain.add(last_value)
                    domain = domain.union(new_domain)
                i -= 1
        return domain
    
    def contains(self, coord):
        return coord in self.coords
    
    def remove_cell(self, cell, value):
        coords = deepcopy(self.coords)
        coords.remove(cell)
        if len(coords) == 0:
            return None
        return KillerConstraint(coords, self.value - value)
    
    def __hash__(self):
        return hash(self.coords)
    
    def __eq__(self, other):
        if not isinstance(other, KillerConstraint):
            return False
        return self.coords == other.coords
    
    def __str__(self):
        return f"Coords: {self.coords}, Sum: {self.value}, Possible values: {self.available_values}"


class KillerSudoku(Sudoku):
    """A class to store the board, list of assignments, reduced domains and the constraints"""
    def __init__(self, board, constraints, domains=None, is_updated=False):
        """Assume that the board, domains and constraints are already copied and is not used elsewhere
        The constraints is a list of instances of KillerConstraint class above"""
        super().__init__(board, domains=domains)
        self.constraints = constraints
        if not is_updated:
            self.domains = KillerSudoku.update_domains_from_constraints(self.domains, self.constraints)
            self.domains = KillerSudoku.reduce_domains_in_constraint_groups(self.domains, self.board, self.constraints)
    
    def update_domains_from_constraints(domains, constraints):
        """Update the domains of the cells based on the constraints"""
        for constraint in constraints:
            for cell in constraint.coords:
                if cell not in domains:
                    continue
                domains[cell] = domains[cell].intersection(constraint.available_values)
                if len(domains[cell]) == 0:
                    raise InvalidSudokuException(cell[0], cell[1])
        return domains
    
    def reduce_domains_in_constraint_groups(domains, board, constraints):
        for constraint in constraints:
            for value_cell in constraint.coords:
                if value_cell in domains:
                    continue
                for cell in constraint.coords:
                    if cell not in domains:
                        continue
                    domains[cell].discard(board[value_cell[0]][value_cell[1]])
                    if len(domains[cell]) == 0:
                        raise InvalidSudokuException(cell[0], cell[1])
        return domains
    
    def reduce_domain_in_constraint_group(domains, constraints, value):
        for constraint in constraints:
            for cell in constraint.coords:
                if cell not in domains:
                    continue
                domains[cell].discard(value)
                if len(domains[cell]) == 0:
                    raise InvalidSudokuException(cell[0], cell[1])
        return domains
    
    def assign(self, cell, value):
        board = deepcopy(self.board)
        board[cell[0]][cell[1]] = value

        domains = deepcopy(self.domains)
        domains.pop(cell, None)

        constraints = list(filter(
            lambda constraint: not constraint.contains(cell),
            self.constraints))
        removed_constraints = filter(
            lambda constraint: constraint.contains(cell),
            self.constraints)
        new_constraints = list(filter(
            lambda constraint: constraint is not None,
            map(lambda constraint: constraint.remove_cell(cell, value),
                removed_constraints)))
        
        domains = KillerSudoku.reduce_domain_in_constraint_group(domains, new_constraints, value)
        domains = KillerSudoku.update_domains_from_constraints(domains, new_constraints)
        constraints = constraints + new_constraints
        
        sudoku = KillerSudoku(board, constraints, domains=domains, is_updated=True)
        sudoku.propagate_constraints()
        return sudoku
    
    def __eq__(self, other):
        if not isinstance(other, KillerSudoku):
            return False
        return self.board == other.board
    
    def __str__(self):
        return f"Board:{self.board}\nDomains:{self.domains}\n"
