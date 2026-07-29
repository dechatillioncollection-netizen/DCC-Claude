# Python, starting from *The Farmer Was Replaced*

A full beginner-to-competent Python course, written for someone whose Python
so far comes from the drone-farming game **The Farmer Was Replaced**.

You already know more than you think. In that game you wrote real Python
syntax: `while`, `for`, `if`, `def`, variables, lists, `range()`. What you
have *not* seen is everything the game deliberately left out — strings, real
input and output, files, imports, error handling, classes, and the enormous
standard library that comes free with Python.

This course closes that gap.

---

## How this course is written

Every time a new built-in function or piece of syntax appears, it gets a box
like this:

> **NEW — `print(value, ...)`**
> Writes its arguments to the screen, separated by spaces, then a newline.
> ```python
> print("dog")        # dog
> print("dog", 3)     # dog 3
> ```
> **Use it when** you want to see something — output for the user, or a value
> you're debugging.
> **Watch out:** it *shows* a value, it doesn't *give* it back. `x = print(5)`
> puts `None` in `x`. And a `print` placed after a `return` inside a function
> never runs at all.

So you never meet a function without being told what it does, seeing it used,
when to reach for it, and what mistake people make with it. Nothing is
assumed.

Each lesson ends with **Exercises**, and the answers are at the bottom of the
same file under **Solutions**. Do the exercises. Reading Python and writing
Python are different skills, and only one of them is the one you want.

---

## The lessons

| # | File | What it covers |
|---|------|----------------|
| 00 | [00-setup.md](00-setup.md) | Installing Python, running a file, the REPL, comments |
| 01 | [01-farm-to-real-python.md](01-farm-to-real-python.md) | What the game taught you, what it hid from you |
| 02 | [02-variables-and-types.md](02-variables-and-types.md) | Variables, `int`, `float`, `str`, `bool`, `None`, conversion |
| 03 | [03-strings.md](03-strings.md) | Text: quoting, f-strings, methods, slicing |
| 04 | [04-numbers-and-math.md](04-numbers-and-math.md) | Arithmetic, `//`, `%`, `**`, rounding, float traps |
| 05 | [05-booleans-and-if.md](05-booleans-and-if.md) | Comparisons, `and`/`or`/`not`, `if`/`elif`/`else`, truthiness |
| 06 | [06-loops.md](06-loops.md) | `while`, `for`, `range`, `break`, `continue`, `enumerate`, `zip` |
| 07 | [07-lists.md](07-lists.md) | Indexing, slicing, list methods, sorting, 2D grids |
| 08 | [08-tuples-and-unpacking.md](08-tuples-and-unpacking.md) | Tuples, unpacking, returning several values |
| 09 | [09-dicts-and-sets.md](09-dicts-and-sets.md) | Dictionaries, sets, counting, lookups |
| 10 | [10-functions.md](10-functions.md) | `def`, `return`, defaults, keyword args, `*args`, scope, type hints |
| 11 | [11-comprehensions.md](11-comprehensions.md) | List/dict/set comprehensions, generator expressions |
| 12 | [12-errors-and-exceptions.md](12-errors-and-exceptions.md) | Reading tracebacks, `try`/`except`, `raise` |
| 13 | [13-files-and-data.md](13-files-and-data.md) | Reading/writing files, `pathlib`, JSON, CSV |
| 14 | [14-modules-and-imports.md](14-modules-and-imports.md) | `import`, your own modules, `__main__`, packages |
| 15 | [15-standard-library.md](15-standard-library.md) | `math`, `random`, `datetime`, `collections`, `itertools`, `re` |
| 16 | [16-classes.md](16-classes.md) | Objects, `class`, `__init__`, methods, inheritance, dataclasses |
| 17 | [17-iterators-and-generators.md](17-iterators-and-generators.md) | `iter`/`next`, `yield`, lazy sequences |
| 18 | [18-handy-extras.md](18-handy-extras.md) | `lambda`, `sorted(key=)`, `map`/`filter`, unpacking, formatting |
| 19 | [19-debugging-and-testing.md](19-debugging-and-testing.md) | Tracebacks in anger, `assert`, `pytest`, `pdb`, venvs and `pip` |
| 20 | [20-capstone-projects.md](20-capstone-projects.md) | Five projects, ending with your own farm simulator |
| — | [cheatsheet.md](cheatsheet.md) | Everything on one page, for later |
| — | [examples/farm.py](examples/farm.py) | A runnable mini *Farmer Was Replaced*, in real Python |

The `examples/farm.py` file is the payoff — it re-creates the game's drone API
(`move`, `plant`, `harvest`, `can_harvest`) in plain Python you can read and
change. Run it with `python farm.py` once you've reached Lesson 16, then write
your own drone programs in it.

---

## Suggested pace

One lesson per sitting. Lessons 02–07 are the core and will feel mostly
familiar; 08–13 is the new material that makes Python useful outside a game;
14–18 is what separates "can write a script" from "can write a program";
19–20 is how you keep yourself honest.

If you only ever finish lessons 00–13, you can already write genuinely useful
programs. Everything after that makes them nicer.

---

## One rule

Type the examples out. Do not copy-paste them. The typos you make and fix are
the course.
