from killer import KillerConstraint

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

def main():
    test_constraints_0()
    test_constraints_1()
    test_constraints_2()
    test_constraints_3()
    test_constraints_more()
    test_contains()
    test_remove_cell()

if __name__ == '__main__':
    main()
