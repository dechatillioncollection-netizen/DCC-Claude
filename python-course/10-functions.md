# Lesson 10 — Functions

You wrote functions in the game, but they were mostly "do this sequence of
actions". Real Python functions take input and give back output, and that
difference is most of what makes code reusable.

---

## The basic shape

> **NEW — `def`**
> Defines a function: a named block of code you can run later, as many times
> as you like.
> ```python
> def greet():
>     print("hello")
>
> greet()      # hello
> greet()      # hello
> ```
> **Use it when** you're about to write the same thing twice, or when a chunk
> of code deserves a name to explain what it does.
> **Watch out:** defining a function doesn't run it — you need the `()` to
> call it. Writing `greet` on its own just refers to the function object and
> does nothing visible. And a function must be defined *before* the line that
> calls it runs, so put your `def`s above your main code.

### Parameters — giving it input

```python
def greet(name):
    print(f"hello {name}")

greet("Alex")      # hello Alex
greet("Ben")       # hello Ben
```

`name` is a **parameter** (the slot in the definition). `"Alex"` is an
**argument** (the value you pass in). Nobody will mind if you mix the terms.

Multiple parameters are comma-separated, and are matched by position:

```python
def describe(name, age):
    print(f"{name} is {age}")

describe("Alex", 30)      # Alex is 30
describe(30, "Alex")      # 30 is Alex   — legal, and wrong
```

---

## `return` — giving back output

> **NEW — `return`**
> Ends the function immediately and hands a value back to whoever called it.
> ```python
> def double(n):
>     return n * 2
>
> result = double(5)
> print(result)      # 10
> print(double(3))   # 6
> ```
> **Use it when** the function *computes* something rather than *displays*
> something — which is most of the time.
> **Watch out — this is the big one:** `return` exits the function on the
> spot. **Any code after a `return` in the same block never runs**, including
> a `print`:
> ```python
> def double(n):
>     return n * 2
>     print("done")      # DEAD CODE — never runs, no error, no warning
> ```
> A function with no `return` at all gives back `None`, so if you `print()`
> inside a function but forget to `return`, the caller gets `None`:
> ```python
> def double(n):
>     print(n * 2)       # shows it...
>
> x = double(5)          # ...but hands back nothing
> print(x)               # None
> ```
> Also: `return` outside a function is a `SyntaxError`, and a bare `return`
> with no value returns `None` (used to exit early).

### `print` vs `return` — the distinction that matters most

```python
def add_printing(a, b):
    print(a + b)

def add_returning(a, b):
    return a + b

add_printing(2, 3)              # shows 5
add_returning(2, 3)             # shows nothing! the 5 is discarded

total = add_returning(2, 3) + add_returning(4, 5)
print(total)                    # 14  — you can build on returned values

total = add_printing(2, 3) + add_printing(4, 5)
# TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'
```

`print` is for talking to a human. `return` is for talking to the rest of your
program. A function that prints is a dead end; a function that returns can be
reused, tested, and combined.

**Rule of thumb:** functions should `return`. Do your printing in one place,
usually the main body of the script.

### Returning several values

```python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 9, 1])
print(low, high)      # 1 9
```

That's a tuple being returned and unpacked (Lesson 08).

### Early return

Using `return`'s "exit now" behaviour deliberately keeps code flat:

```python
# nested
def grade(score):
    if score >= 0:
        if score >= 50:
            return "pass"
        else:
            return "fail"
    else:
        return "invalid"

# flat — guard clauses first, then the main path
def grade(score):
    if score < 0:
        return "invalid"
    if score >= 50:
        return "pass"
    return "fail"
```

The second version is easier to read and easier to add cases to. No `else` is
needed after a `return`, because if the `return` ran, nothing below it can.

---

## Default values

```python
def greet(name, greeting="hello"):
    print(f"{greeting} {name}")

greet("Alex")               # hello Alex
greet("Alex", "morning")    # morning Alex
```

Parameters with defaults must come **after** ones without, or it's a
`SyntaxError`.

### The mutable default trap

This is a genuine Python wart and it will bite you one day:

```python
def add_item(item, basket=[]):     # DON'T
    basket.append(item)
    return basket

print(add_item("hay"))       # ['hay']
print(add_item("wood"))      # ['hay', 'wood']   <- the same list, still there!
```

The default is created **once**, when the function is defined, not each time
it's called. The fix:

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
```

Never use a list, dict, or set as a default value. Use `None` and build it
inside.

---

## Keyword arguments

You can pass arguments by name, in any order:

```python
def describe(name, age, city):
    print(f"{name}, {age}, from {city}")

describe(age=30, city="Cape Town", name="Alex")
describe("Alex", city="Cape Town", age=30)     # mixed — positional first
```

**Use them when** a call has several arguments and the meaning isn't obvious
from position. `create_unit("archer", 5, 120, True)` tells you nothing;
`create_unit("archer", damage=5, range=120, flying=True)` tells you everything.

**Watch out:** once you use a keyword argument, everything after it must also
be a keyword argument.

---

## `*args` and `**kwargs`

For functions that accept any number of arguments.

> **NEW — `*args`**
> Collects all extra positional arguments into a tuple.
> ```python
> def total(*numbers):
>     return sum(numbers)
>
> print(total(1, 2))         # 3
> print(total(1, 2, 3, 4))   # 10
> print(total())             # 0
> ```
> **Use it when** the count genuinely varies, like `print` itself.
> **Watch out:** the name `args` is only convention — the `*` is what matters.
> Inside the function it's a *tuple*, not separate variables. If your caller
> already has a list, unpack it at the call site: `total(*my_list)`.

> **NEW — `**kwargs`**
> Collects all extra keyword arguments into a dictionary.
> ```python
> def describe(**details):
>     for key, value in details.items():
>         print(f"{key}: {value}")
>
> describe(name="Alex", age=30)
> # name: Alex
> # age: 30
> ```
> **Use it when** writing wrappers that pass options through to another
> function.
> **Watch out:** it's a dictionary inside the function, so you access
> `details["name"]`, not `details.name`. Order in the signature is fixed:
> normal parameters, then `*args`, then keyword-only parameters, then
> `**kwargs`.

The `*` and `**` also work at the call site to spread a collection out:

```python
def add(a, b):
    return a + b

nums = [3, 4]
print(add(*nums))                    # 7

opts = {"a": 3, "b": 4}
print(add(**opts))                   # 7
```

---

## Scope — where variables live

Variables made inside a function are **local**: they exist only during the
call.

```python
def f():
    x = 10       # local to f
    print(x)

f()              # 10
print(x)         # NameError: name 'x' is not defined
```

A function can *read* variables from outside, but assigning to one makes a new
local variable instead of changing the outer one:

```python
count = 0

def increment():
    count = count + 1     # UnboundLocalError

increment()
```

Python sees the assignment, decides `count` is local, then finds it has no
value yet. Two fixes:

```python
# preferred: take it in, hand it back
def increment(count):
    return count + 1

count = increment(count)

# possible but usually a bad idea
def increment():
    global count
    count = count + 1
```

> **NEW — `global`**
> Declares that a name inside a function refers to the module-level variable.
> ```python
> total = 0
> def add(n):
>     global total
>     total += n
> ```
> **Use it when** you genuinely need shared mutable state and have no better
> option — a counter in a small script, say.
> **Watch out:** it makes functions depend on hidden state, which is exactly
> the habit Lesson 01 asked you to drop. It also makes testing hard, because
> the function's behaviour depends on what ran before it. Prefer parameters
> and return values; reach for `global` maybe once a year.

Note that *modifying* (rather than reassigning) a mutable object doesn't need
`global` — and this is why the reference trap from Lesson 07 matters:

```python
items = []

def add(x):
    items.append(x)      # works — we're not rebinding the name

add("hay")
print(items)             # ['hay']
```

---

## Docstrings

A string on the first line of a function documents it:

```python
def area(width, height):
    """Return the area of a rectangle."""
    return width * height

print(area.__doc__)      # Return the area of a rectangle.
help(area)               # shows the signature and the docstring
```

> **NEW — `help(thing)`**
> Prints the documentation for anything — your functions, built-ins, modules.
> ```python
> help(len)
> help(str.split)
> ```
> **Use it when** you half-remember how a function works and don't want to
> open a browser. Works in the REPL; `dir(thing)` lists what's available on an
> object.
> **Watch out:** in a script it prints a wall of text; it's a REPL tool.

Write docstrings saying **what the function returns**, not how it works.

---

## Type hints

Optional annotations describing the types involved:

```python
def area(width: float, height: float) -> float:
    return width * height
```

Python **does not enforce these** — passing strings still "works" until
something breaks. They exist for editors (which will then autocomplete and
warn you) and for tools like `mypy`. They're worth adding to anything you'll
keep, because they document intent precisely.

```python
def first_name(full: str) -> str:
    return full.split()[0]

def totals(items: list) -> dict:
    ...
```

---

## Functions are values

A function name without `()` is the function itself, and can be passed around:

```python
def double(n):
    return n * 2

f = double
print(f(5))       # 10

def apply_twice(func, value):
    return func(func(value))

print(apply_twice(double, 3))    # 12
```

This is how `sorted(key=...)` works (Lesson 18), and it's a genuinely powerful
idea once it clicks.

---

## A worked example

```python
"""Inventory helpers — every function returns, nothing prints."""

def add_stock(inventory: dict, item: str, qty: int) -> dict:
    """Return a NEW inventory with qty added to item."""
    updated = inventory.copy()
    updated[item] = updated.get(item, 0) + qty
    return updated


def total_units(inventory: dict) -> int:
    """Return the total number of units held."""
    return sum(inventory.values())


def low_stock(inventory: dict, threshold: int = 5) -> list:
    """Return the names of items at or below the threshold, alphabetically."""
    return sorted(name for name, qty in inventory.items() if qty <= threshold)


def format_report(inventory: dict) -> str:
    """Return a printable multi-line report."""
    lines = [f"{name:<10}{qty:>4}" for name, qty in sorted(inventory.items())]
    lines.append(f"{'TOTAL':<10}{total_units(inventory):>4}")
    return "\n".join(lines)


# The only place that prints:
stock = {}
stock = add_stock(stock, "hay", 12)
stock = add_stock(stock, "wood", 3)
stock = add_stock(stock, "hay", 5)

print(format_report(stock))
print()
print("Low stock:", low_stock(stock))
```

```
hay         17
wood         3
TOTAL       20

Low stock: ['wood']
```

Every function returns a value, none of them print, and the whole thing is
therefore easy to test. That's the target shape.

---

## Exercises

1. Write `is_even(n)` that returns `True` or `False`. Note: `return n % 2 == 0`
   is enough — no `if` needed.
2. Write `greet(name, greeting="Hello")` and call it both ways.
3. Explain why this prints `None`, and fix it:
   ```python
   def add(a, b):
       print(a + b)
   print(add(2, 3))
   ```
4. Explain what's wrong here and fix it:
   ```python
   def check(n):
       return n > 10
       print("checked", n)
   ```
5. Write `word_stats(text)` returning the word count, the longest word, and
   the average word length, as a tuple.
6. Write `clamp(value, low, high)` returning the value limited to that range.
7. Write `count_matching(items, func)` that returns how many items make `func`
   return `True`. Test it with `is_even`.
8. Fix this so each call starts with a fresh list:
   ```python
   def collect(item, into=[]):
       into.append(item)
       return into
   ```
9. Rewrite this with early returns so there's no nesting:
   ```python
   def describe(n):
       if n is not None:
           if n > 0:
               return "positive"
           else:
               return "not positive"
       else:
           return "missing"
   ```

---

## Solutions

**1.**
```python
def is_even(n):
    return n % 2 == 0
```
`n % 2 == 0` is already `True` or `False`. Writing
`if n % 2 == 0: return True else: return False` works but marks you as new.

**2.**
```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alex"))
print(greet("Alex", greeting="Morning"))
```

**3.** `add` prints but never returns, so it hands back `None` and the outer
`print` displays that. Fix: `return a + b` inside, and print at the call site.

**4.** The `print` is after the `return`, so it's dead code that never runs.
Move it above the `return`:
```python
def check(n):
    print("checked", n)
    return n > 10
```

**5.**
```python
def word_stats(text):
    words = text.split()
    if not words:
        return 0, "", 0.0
    longest = max(words, key=len)
    average = sum(len(w) for w in words) / len(words)
    return len(words), longest, average

count, longest, avg = word_stats("the quick brown fox")
print(count, longest, f"{avg:.1f}")     # 4 quick 3.8
```
The empty-input guard matters — without it, `max()` and the division both
crash on `""`.

**6.**
```python
def clamp(value, low, high):
    return max(low, min(high, value))
```

**7.**
```python
def count_matching(items, func):
    count = 0
    for item in items:
        if func(item):
            count += 1
    return count

print(count_matching([1, 2, 3, 4], is_even))     # 2
```
Note `is_even` is passed **without** brackets — you're handing over the
function, not calling it.

**8.**
```python
def collect(item, into=None):
    if into is None:
        into = []
    into.append(item)
    return into
```

**9.**
```python
def describe(n):
    if n is None:
        return "missing"
    if n > 0:
        return "positive"
    return "not positive"
```
