# Lesson 14 — Modules and imports

This is the lesson that most changes what you can build. The game gave you one
file and a fixed set of functions. Python gives you a standard library of
hundreds of modules, an ecosystem of hundreds of thousands more, and the
ability to split your own code across files.

---

## What a module is

A module is just a `.py` file. Importing it runs it once and gives you access
to everything it defined.

> **NEW — `import module`**
> Loads a module and makes its contents available as `module.name`.
> ```python
> import math
> print(math.sqrt(16))     # 4.0
> ```
> **Use it when** you need code from the standard library or another file.
> **Watch out:** put imports at the **top of the file**, and only once —
> importing inside a loop is pointless (Python caches modules after the first
> import). You must use the prefix: bare `sqrt(16)` after `import math` is a
> `NameError`. And never name your own file after a module you import —
> a file called `random.py` in your folder will shadow the real `random`
> module and produce baffling errors.

### The four import forms

```python
# 1. the whole module — clearest, always safe
import math
math.sqrt(16)

# 2. with a shorter name
import datetime as dt
dt.date.today()

# 3. specific names — convenient for things used often
from math import sqrt, pi
sqrt(16)

# 4. everything — DON'T
from math import *
```

> **NEW — `from module import name`**
> Pulls specific names directly into your file, so no prefix is needed.
> ```python
> from pathlib import Path
> from collections import Counter
> p = Path("data.txt")
> ```
> **Use it when** you use one or two things from a module repeatedly, or when
> the module name is long.
> **Watch out:** it can silently overwrite your own names. `from math import
> pow` replaces the built-in `pow`. And `from module import *` imports
> everything, so you can no longer tell where any name came from and clashes
> happen invisibly — never use it outside the REPL.

> **NEW — `import module as alias`**
> Renames on import.
> ```python
> import numpy as np
> import datetime as dt
> ```
> **Use it when** a name is long or there's a community convention (`np`,
> `pd`, `plt`).
> **Watch out:** invent your own aliases sparingly — an unfamiliar alias makes
> code harder to read for everyone else.

---

## Writing your own modules

Two files in the same folder:

```python
# inventory.py
"""Helpers for managing stock levels."""

LOW_THRESHOLD = 5


def total_units(stock: dict) -> int:
    return sum(stock.values())


def low_items(stock: dict) -> list:
    return sorted(k for k, v in stock.items() if v <= LOW_THRESHOLD)
```

```python
# main.py
import inventory

stock = {"hay": 12, "wood": 3}
print(inventory.total_units(stock))     # 15
print(inventory.low_items(stock))       # ['wood']
print(inventory.LOW_THRESHOLD)          # 5
```

Run `python main.py` and it works — no configuration, no build step. That's
all a module is.

Splitting code into modules is how programs stay manageable past a few hundred
lines. A rough guide: one module per topic, and if you can't describe a file's
job in one sentence, it's doing too much.

---

## `if __name__ == "__main__"`

Here's a problem. Add a test line to `inventory.py`:

```python
# inventory.py
def total_units(stock):
    return sum(stock.values())

print(total_units({"hay": 1}))     # a quick check
```

Now `import inventory` from anywhere prints `1`, because importing **runs the
whole file**. Every module you import executes top to bottom.

The fix is a bit of Python boilerplate you'll see everywhere:

```python
# inventory.py
def total_units(stock):
    return sum(stock.values())


if __name__ == "__main__":
    # only runs when this file is run directly, not when imported
    print(total_units({"hay": 1}))
```

> **NEW — `__name__` and `if __name__ == "__main__":`**
> `__name__` is a variable Python sets in every module: it's `"__main__"` when
> the file is being run directly, and the module's name when it's being
> imported.
> ```python
> def main():
>     print("running the program")
>
> if __name__ == "__main__":
>     main()
> ```
> **Use it when** a file should both be importable *and* runnable — which is
> most scripts. Put your top-level code inside it.
> **Watch out:** the exact spelling matters (two underscores each side, and
> the string is `"__main__"`, not the filename). Code *outside* this guard
> runs on import, which is why module top-level should only define things, not
> do things.

---

## How Python finds modules

When you write `import x`, Python looks:

1. In the folder containing the script you ran.
2. In the standard library.
3. In installed third-party packages (`site-packages`).

If it can't find it: `ModuleNotFoundError: No module named 'x'`. The causes,
in order of likelihood: a typo, the package isn't installed, or you're running
from the wrong folder.

You can see the search path:

```python
import sys
print(sys.path)
```

---

## Packages — folders of modules

A folder containing an `__init__.py` file is a **package**:

```
myproject/
    main.py
    game/
        __init__.py
        units.py
        combat.py
```

```python
# main.py
from game import units
from game.combat import resolve_attack

units.spawn("archer")
```

`__init__.py` can be empty — its presence is what marks the folder as a
package. It runs when the package is first imported, so it's a place to
expose a tidy public interface:

```python
# game/__init__.py
from .units import spawn
from .combat import resolve_attack
```

The leading dot means "from this package" — a **relative import**. Now users
can write `from game import spawn` without knowing which file it lives in.

**Watch out:** relative imports (`from .units import spawn`) only work inside
a package being imported, not in a file you run directly. Running
`python game/units.py` when `units.py` has relative imports gives
`ImportError: attempted relative import with no known parent package`. Run
`python -m game.units` instead, or keep runnable scripts at the top level.

---

## Third-party packages and `pip`

Everything above is code that ships with Python. The rest of the world lives
on **PyPI** (the Python Package Index), and you install from it with `pip`.

```
python -m pip install requests
```

Then:

```python
import requests
r = requests.get("https://example.com")
print(r.status_code)
```

> **NEW — `pip`**
> Python's package installer. Run it as `python -m pip` so you know which
> Python you're installing into.
> ```
> python -m pip install rich
> python -m pip uninstall rich
> python -m pip list
> python -m pip install -r requirements.txt
> ```
> **Use it when** you need a library Python doesn't ship with.
> **Watch out:** installing globally eventually creates version conflicts
> between projects. Use a virtual environment per project (Lesson 19). Also,
> anything you `pip install` runs code from the internet on your machine —
> check the name carefully, since typo-squatted packages are a real attack.

A few worth knowing about:

| Package | For |
|---|---|
| `requests` | HTTP — fetching web pages and APIs |
| `rich` | Colourful terminal output, tables, progress bars |
| `pytest` | Testing (Lesson 19) |
| `pillow` | Image manipulation |
| `pygame` | 2D games |
| `pandas` | Tabular data analysis |
| `matplotlib` | Charts |
| `flask` / `fastapi` | Web servers |

---

## A worked example — splitting a program up

**`farmdata.py`** — data only, no logic:

```python
"""Static data tables for the farm simulator."""

CROPS = {
    "wheat":   {"grow_time": 3, "value": 2},
    "carrot":  {"grow_time": 5, "value": 4},
    "pumpkin": {"grow_time": 9, "value": 11},
}

STARTING_COINS = 20
```

**`farmlogic.py`** — functions, importing the data:

```python
"""Pure functions for farm calculations."""
from farmdata import CROPS


def profit_per_day(crop: str) -> float:
    """Return coins per day for a crop, or 0.0 if unknown."""
    data = CROPS.get(crop)
    if data is None:
        return 0.0
    return data["value"] / data["grow_time"]


def best_crop() -> str:
    """Return the name of the most profitable crop."""
    return max(CROPS, key=profit_per_day)


if __name__ == "__main__":
    for name in CROPS:
        print(f"{name:<10}{profit_per_day(name):.2f} coins/day")
```

**`main.py`** — the program:

```python
"""Farm advisor."""
from farmdata import CROPS, STARTING_COINS
from farmlogic import best_crop, profit_per_day


def main() -> None:
    print(f"You have {STARTING_COINS} coins.\n")
    for name in sorted(CROPS, key=profit_per_day, reverse=True):
        print(f"{name:<10}{profit_per_day(name):>6.2f} coins/day")
    print(f"\nPlant {best_crop()}.")


if __name__ == "__main__":
    main()
```

```
You have 20 coins.

pumpkin     1.22 coins/day
carrot      0.80 coins/day
wheat       0.67 coins/day

Plant pumpkin.
```

Three files, each with one job: data, logic, presentation. That separation is
the same rule this repo's game follows — data tables kept apart from logic, so
editing the data changes behaviour without touching code.

---

## Exercises

1. Create `helpers.py` with a `shout(text)` function that returns the text in
   capitals with an exclamation mark, then use it from `main.py`.
2. Add an `if __name__ == "__main__":` block to `helpers.py` that tests
   `shout`, and confirm it doesn't run when imported.
3. What's the difference between `import math` and `from math import sqrt`?
   When would you prefer each?
4. Why is `from module import *` discouraged?
5. Create a file called `random.py` containing `print("hi")`, then in another
   file in the same folder write `import random; print(random.randint(1, 6))`.
   Explain the error, then fix it.
6. Split the inventory functions from Lesson 10 into their own module and
   import them.
7. Use `python -m pip list` to see what you have installed.

---

## Solutions

**1.**
```python
# helpers.py
def shout(text: str) -> str:
    return text.upper() + "!"
```
```python
# main.py
from helpers import shout
print(shout("hay"))      # HAY!
```

**2.**
```python
# helpers.py
def shout(text: str) -> str:
    return text.upper() + "!"


if __name__ == "__main__":
    assert shout("hay") == "HAY!"
    print("helpers.py self-test passed")
```
`python helpers.py` prints the message; `import helpers` doesn't.

**3.** `import math` keeps everything behind the `math.` prefix, so there's
never a name clash and readers can see where `sqrt` came from.
`from math import sqrt` puts `sqrt` directly in your namespace — shorter to
type, and worth it for names you use many times. Prefer the first for
occasional use, the second for heavy use.

**4.** You lose track of where names come from, and it can silently overwrite
your own variables or built-ins. If two starred imports define the same name,
the later one wins with no warning.

**5.** `import random` finds *your* file first, because the script's own
folder is searched before the standard library. So `random.randint` doesn't
exist and you get `AttributeError: module 'random' has no attribute
'randint'`, plus a stray `hi`. Fix by renaming your file — and delete any
`__pycache__/random.pyc` left behind.

**6.**
```python
# inventory.py
def total_units(stock: dict) -> int:
    return sum(stock.values())

def low_stock(stock: dict, threshold: int = 5) -> list:
    return sorted(name for name, qty in stock.items() if qty <= threshold)
```
```python
# main.py
import inventory

stock = {"hay": 17, "wood": 3}
print(inventory.total_units(stock))     # 20
print(inventory.low_stock(stock))       # ['wood']
```
