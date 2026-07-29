# Lesson 19 — Debugging, testing, and project setup

Writing code is maybe half the job. This lesson is the other half: finding out
why it's wrong, proving it's right, and keeping your projects from
interfering with each other.

---

## Debugging: the actual method

When something's broken, resist the urge to change things at random. The
process:

1. **Read the error properly.** Bottom line first — the exception type and
   message. Then the bottom-most `File ... line ...`, which is where it broke.
   (Lesson 12.)
2. **Find the last point where things were still correct.** Print variables
   above and below the suspect line.
3. **Reduce it.** Cut the program down until you have the smallest thing that
   still misbehaves. Nine times out of ten, you find the bug while doing this.
4. **Check your assumptions, one at a time.** Is that variable really a list?
   Is it really non-empty? Is that function really being called?
5. **Change one thing.** Then re-test. Changing three things means you don't
   know which one mattered.

The bug is almost never where you think it is, and it's almost always a wrong
assumption rather than a wrong algorithm.

### Print debugging

Unfashionable and extremely effective. Use the f-string `=` form:

```python
print(f"{crops=} {total=} {len(items)=}")
# crops=12 total=59 len(items)=3
```

Label them if there are several:

```python
print(f"[before loop] {stock=}")
print(f"[in loop, i={i}] {value=}")
```

Delete them when you're done. Print statements left in shipped code are how
"weird debug text" ends up in production logs.

### `breakpoint()` — the real debugger

> **NEW — `breakpoint()`**
> Pauses the program at that line and drops you into an interactive debugger
> where you can inspect and change anything.
> ```python
> def average(nums):
>     breakpoint()
>     return sum(nums) / len(nums)
> ```
> **Use it when** printing isn't enough — you need to poke around the state,
> or step through line by line.
> **Watch out:** it *stops the program and waits for input*, so never leave one
> in code that runs unattended or in a loop over 10,000 items. Set the
> environment variable `PYTHONBREAKPOINT=0` to disable them all without
> editing.

Once stopped, the commands are:

| Command | Does |
|---|---|
| `n` | next line (step over) |
| `s` | step into a function call |
| `c` | continue until the next breakpoint |
| `l` | list the surrounding code |
| `p x` | print the value of `x` |
| `pp x` | pretty-print it |
| `w` | where am I — show the call stack |
| `q` | quit |

Typing any Python expression also works, so you can call functions and inspect
objects live.

### Logging instead of printing

For anything long-running, `logging` beats `print`: it has severity levels,
timestamps, and can be turned down without deleting lines.

```python
import logging

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

logging.debug("detailed internals")     # hidden at INFO level
logging.info("started run")
logging.warning("stock is low")
logging.error("could not open file")
```

**Use it when** the program runs unattended or for a long time. **Watch out:**
`basicConfig` only takes effect the first time it's called.

---

## Testing

A test is code that checks other code. Start with `assert` (Lesson 12) and
graduate to `pytest`.

### The `assert` version

```python
# calculations.py
def profit(revenue, cost):
    return revenue - cost


if __name__ == "__main__":
    assert profit(100, 40) == 60
    assert profit(0, 0) == 0
    assert profit(10, 25) == -15
    print("all tests passed")
```

Run the file; silence means success, `AssertionError` means a failure with the
line number. That's a real test suite, just a small one.

### `pytest` — the standard tool

```
python -m pip install pytest
```

Put tests in files named `test_*.py`, with functions named `test_*`:

```python
# test_calculations.py
from calculations import profit


def test_positive_profit():
    assert profit(100, 40) == 60


def test_loss():
    assert profit(10, 25) == -15


def test_zero():
    assert profit(0, 0) == 0
```

Run it:

```
python -m pytest
```

```
test_calculations.py ...                                        [100%]
3 passed in 0.01s
```

> **NEW — `pytest`**
> Finds and runs every `test_*` function it can, and reports failures with the
> actual values involved.
> ```
> python -m pytest              # run everything
> python -m pytest -v           # one line per test
> python -m pytest -k profit    # only tests matching "profit"
> python -m pytest -x           # stop at the first failure
> ```
> **Use it when** a project is big enough that you're re-checking old
> behaviour by hand. That's sooner than you'd think.
> **Watch out:** the naming rules are strict — files `test_*.py`, functions
> `test_*`. A function named `check_profit` is silently never run, which looks
> exactly like passing. Tests must be able to import your code, so run pytest
> from the project root.

When a test fails, pytest shows you the values:

```
E       assert 59 == 60
E        +  where 59 = profit(100, 41)
```

### Testing that something raises

```python
import pytest

def test_negative_withdrawal_rejected():
    with pytest.raises(ValueError):
        withdraw(100, -5)
```

### What makes a good test

- **One behaviour per test**, with a name that says what it checks.
- **Test the edges**: empty list, zero, negative, one item, the maximum.
- **Test what you got wrong before.** Every bug you fix deserves a test that
  would have caught it — that's how you stop it coming back.
- **Test functions that return, not functions that print.** Which is the real
  reason Lesson 10 pushed `return` so hard: a function that prints can barely
  be tested at all.

---

## Virtual environments

Every project eventually needs a different version of some library. Installing
everything globally means projects break each other. A **virtual environment**
is a private Python installation per project.

> **NEW — `python -m venv`**
> Creates an isolated environment in a folder.
> ```
> python -m venv .venv
> ```
> Then activate it:
> ```
> # Windows
> .venv\Scripts\activate
>
> # macOS / Linux
> source .venv/bin/activate
> ```
> Your prompt gains a `(.venv)` prefix. Now `pip install` goes into the
> project, not the system.
> **Use it when** starting any project that installs packages — which is all
> of them.
> **Watch out:** you must **activate it in every new terminal**; forgetting is
> why "the package I installed isn't found". Never commit the `.venv` folder
> to git — add it to `.gitignore` and commit `requirements.txt` instead.
> `deactivate` exits it.

### Recording dependencies

```
python -m pip freeze > requirements.txt      # save what's installed
python -m pip install -r requirements.txt    # recreate it elsewhere
```

That file is how someone else (or future you) reproduces your setup.

---

## Project layout

A reasonable small project:

```
myproject/
    .venv/                 # not committed
    .gitignore
    README.md
    requirements.txt
    main.py
    myproject/
        __init__.py
        logic.py
        data.py
    tests/
        test_logic.py
```

A `.gitignore` worth starting from:

```
.venv/
__pycache__/
*.pyc
.pytest_cache/
```

`__pycache__` holds compiled bytecode Python generates automatically. It's
disposable — never commit it, and deleting it is always safe.

---

## Code style and tools

Python has a style guide, **PEP 8**: 4-space indents, `snake_case` for
functions and variables, `CapitalCase` for classes, `UPPER_CASE` for
constants, lines under about 88 characters, two blank lines between top-level
definitions.

You don't have to apply it by hand:

```
python -m pip install ruff
python -m ruff format .      # reformat everything
python -m ruff check .       # find likely bugs and style issues
```

`ruff` is fast and covers what `black` and `flake8` used to do separately.
Running the formatter means never arguing about layout again.

For type checking:

```
python -m pip install mypy
python -m mypy myproject/
```

This actually verifies the type hints from Lesson 10, catching a real class of
bug before you run anything.

---

## Measuring speed

Before optimising, measure. Guesses about what's slow are usually wrong.

```python
import time

start = time.perf_counter()
result = do_work()
print(f"{time.perf_counter() - start:.3f}s")
```

For small comparisons:

```python
import timeit
print(timeit.timeit('"-".join(str(n) for n in range(100))', number=10000))
```

For finding the slow part of a whole program:

```
python -m cProfile -s cumtime myscript.py
```

That prints every function, how often it ran, and how long it took. The
answer is usually one line you weren't suspicious of.

---

## A worked example — code with its tests

```python
# stock.py
"""Stock level calculations."""


def reorder_amount(current: int, target: int, minimum_order: int = 10) -> int:
    """
    Return how many units to order to reach target.

    Returns 0 if no order is needed. Orders are rounded up to a multiple
    of minimum_order.
    """
    if current < 0 or target < 0:
        raise ValueError(f"levels must not be negative: {current=} {target=}")
    if minimum_order <= 0:
        raise ValueError(f"minimum_order must be positive: {minimum_order}")

    shortfall = target - current
    if shortfall <= 0:
        return 0

    batches = -(-shortfall // minimum_order)      # ceiling division
    return batches * minimum_order
```

```python
# test_stock.py
import pytest
from stock import reorder_amount


def test_no_order_when_stocked():
    assert reorder_amount(100, 50) == 0


def test_exact_target_needs_nothing():
    assert reorder_amount(50, 50) == 0


def test_rounds_up_to_minimum_order():
    assert reorder_amount(0, 25) == 30       # 25 needed -> 3 batches of 10


def test_exact_multiple_not_rounded_up():
    assert reorder_amount(0, 30) == 30


def test_custom_batch_size():
    assert reorder_amount(0, 10, minimum_order=4) == 12


def test_negative_input_rejected():
    with pytest.raises(ValueError):
        reorder_amount(-1, 10)


def test_zero_batch_size_rejected():
    with pytest.raises(ValueError):
        reorder_amount(0, 10, minimum_order=0)
```

Seven tests covering the normal case, both edges, the custom parameter, and
both error paths. Now you can rewrite `reorder_amount` however you like and
know instantly whether you broke it. That confidence is the entire point.

The `-(-a // b)` trick is ceiling division: negate, floor-divide, negate back.
It's the standard way to round up with integers.

---

## Exercises

1. Take a function you wrote earlier and add three `assert` checks below an
   `if __name__ == "__main__":` guard.
2. Install pytest and convert those asserts into a `test_*.py` file.
3. Deliberately break the function and confirm pytest reports it clearly.
4. Create a virtual environment for a new folder, activate it, install
   `pytest`, and produce a `requirements.txt`.
5. Add a test for an edge case you hadn't considered — empty input, zero,
   negative.
6. Put `breakpoint()` in a function, run it, and use `p`, `n` and `c`.
7. Write a `.gitignore` for a Python project.
8. Time two ways of building a 100,000-character string: `+=` in a loop versus
   `"".join()`. Explain the gap.

---

## Solutions

**1.**
```python
def clamp(value, low, high):
    return max(low, min(high, value))


if __name__ == "__main__":
    assert clamp(5, 0, 10) == 5
    assert clamp(-3, 0, 10) == 0
    assert clamp(99, 0, 10) == 10
    print("ok")
```

**2.**
```python
# test_clamp.py
from myfile import clamp

def test_within_range():
    assert clamp(5, 0, 10) == 5

def test_below_range():
    assert clamp(-3, 0, 10) == 0

def test_above_range():
    assert clamp(99, 0, 10) == 10
```

**5.**
```python
def test_low_equals_high():
    assert clamp(7, 5, 5) == 5
```

**7.**
```
.venv/
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
*.egg-info/
.DS_Store
```

**8.**
```python
import time

n = 100_000

start = time.perf_counter()
s = ""
for i in range(n):
    s += "x"
print(f"concat: {time.perf_counter() - start:.4f}s")

start = time.perf_counter()
s = "".join("x" for _ in range(n))
print(f"join:   {time.perf_counter() - start:.4f}s")
```
`join` wins because strings are immutable (Lesson 03): every `+=` builds a
brand-new string and copies everything so far, so the work grows with the
square of the length. `join` measures the total once, allocates once, and
copies each piece a single time.
