# Lesson 18 — Handy extras

A grab-bag of the remaining things you'll meet constantly in real Python code.
None of them are hard; they just tend to be skipped by beginner tutorials and
then show up everywhere.

---

## `lambda` — a function with no name

> **NEW — `lambda args: expression`**
> Creates a small function inline. The result of the expression is returned
> automatically.
> ```python
> double = lambda n: n * 2
> print(double(5))      # 10
>
> # equivalent to:
> def double(n):
>     return n * 2
> ```
> **Use it when** you need a throwaway one-expression function to pass to
> something else — almost always as a `key=` argument.
> **Watch out:** it can only hold **one expression**, so no statements, no
> `if/elif` blocks, no loops. Assigning a lambda to a name (as above) is
> considered poor style — if it needs a name, use `def`, which also gives
> better error messages. Save lambdas for the inline case.

---

## `sorted(key=...)` — sorting by something

This is where lambdas earn their keep.

> **NEW — `key=` on `sorted`, `min`, `max`, `.sort()`**
> A function applied to each item to decide what to sort or compare by.
> ```python
> words = ["banana", "fig", "cherry"]
> print(sorted(words, key=len))            # ['fig', 'banana', 'cherry']
> print(max(words, key=len))               # banana
> ```
> **Use it when** the natural order isn't what you want — sorting people by
> age, files by size, tuples by their second element.
> **Watch out:** pass the function **without brackets** (`key=len`, not
> `key=len()`). The key function takes exactly one argument. It's called once
> per item, so keep it cheap.

```python
people = [("Alex", 30), ("Ben", 25), ("Ivy", 41)]

print(sorted(people, key=lambda p: p[1]))               # by age
print(sorted(people, key=lambda p: p[1], reverse=True)) # oldest first

units = [{"name": "archer", "dmg": 5}, {"name": "knight", "dmg": 12}]
print(max(units, key=lambda u: u["dmg"])["name"])       # knight

# case-insensitive sort
print(sorted(["banana", "Apple"], key=str.lower))       # ['Apple', 'banana']

# sort by two things: age, then name
print(sorted(people, key=lambda p: (p[1], p[0])))
```

That last one is worth remembering: returning a **tuple** from the key sorts
by the first element, then the second as a tie-breaker.

For sorting objects by an attribute, there's a faster, clearer option:

```python
from operator import attrgetter, itemgetter

sorted(units, key=itemgetter("dmg"))        # dicts / sequences
sorted(unit_objects, key=attrgetter("hp"))  # objects
```

---

## `map` and `filter`

> **NEW — `map(func, iterable)` / `filter(func, iterable)`**
> Apply a function to every item / keep only the items where it's true.
> ```python
> nums = [1, 2, 3, 4]
> print(list(map(str, nums)))                    # ['1', '2', '3', '4']
> print(list(filter(lambda n: n % 2 == 0, nums)))# [2, 4]
> ```
> **Use it when** you already have a named function to apply — `map(str, x)`
> and `map(int, x)` are genuinely tidy.
> **Watch out:** both return lazy iterators, so wrap in `list()` to see them,
> and they're single-use. With a lambda, a comprehension is almost always
> clearer: `[n * 2 for n in nums]` beats `list(map(lambda n: n * 2, nums))`.

A common real use — converting a whole line of input:

```python
nums = list(map(int, input("Numbers: ").split()))
```

---

## Unpacking with `*` and `**`

Covered in Lessons 08 and 10; collected here because they appear everywhere.

```python
# spreading into a function call
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add(*nums))                      # 6

opts = {"a": 1, "b": 2, "c": 3}
print(add(**opts))                     # 6

# merging collections
a, b = [1, 2], [3, 4]
print([*a, *b])                        # [1, 2, 3, 4]
print({**{"x": 1}, **{"y": 2}})        # {'x': 1, 'y': 2}

# swallowing the middle
first, *rest = [1, 2, 3, 4]
```

**Watch out:** `*` spreads a sequence into positional arguments, `**` spreads a
dict into keyword arguments. Mixing them up gives
`TypeError: argument after ** must be a mapping`.

---

## Ternary, chained comparisons, `in`

Quick recap of the compact forms:

```python
label = "even" if n % 2 == 0 else "odd"        # conditional expression
if 0 <= n <= 100:                              # chained comparison
if answer in ("y", "yes", "yeah"):             # membership beats three ors
```

That last one is a real readability win over
`if answer == "y" or answer == "yes" or answer == "yeah":`.

---

## `is` vs `==`

```python
a = [1, 2]
b = [1, 2]
print(a == b)      # True  — same contents
print(a is b)      # False — different objects
```

> **NEW — `is`**
> Tests whether two names point at the *same object*, not whether they're
> equal.
> ```python
> if value is None:
>     ...
> ```
> **Use it when** comparing to `None`, `True`, or `False` — `x is None` is the
> correct idiom.
> **Watch out:** never use it for numbers or strings. `x is 5` sometimes works
> because Python reuses small integers, and then mysteriously fails for larger
> ones. Use `==` for values, `is` for identity.

---

## `enumerate`, `zip`, `any`, `all` — recap

You've met these; here they are as a group, since together they replace most
manual index bookkeeping:

```python
for i, item in enumerate(items, 1): ...
for a, b in zip(list1, list2): ...
if any(n < 0 for n in nums): ...
if all(w.isalpha() for w in words): ...
```

---

## Decorators

> **NEW — `@decorator`**
> A function that wraps another function to add behaviour, applied with `@`
> above the `def`.
> ```python
> import time
>
> def timed(func):
>     def wrapper(*args, **kwargs):
>         start = time.perf_counter()
>         result = func(*args, **kwargs)
>         print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
>         return result
>     return wrapper
>
> @timed
> def slow_sum(n):
>     return sum(range(n))
>
> slow_sum(1_000_000)      # slow_sum took 0.0231s
> ```
> **Use it when** the same wrapping applies to many functions — timing,
> logging, caching, access checks. You'll *use* decorators far more often than
> you write them.
> **Watch out:** the wrapper must return `func`'s result, or your decorated
> function silently returns `None` — an easy bug to introduce. Use
> `@functools.wraps(func)` on the wrapper to preserve the original's name and
> docstring, or debugging gets confusing.

Ones you'll meet in the wild: `@dataclass`, `@property`, `@staticmethod`,
`@classmethod`, `@functools.cache`, `@pytest.fixture`.

> **NEW — `@functools.cache`**
> Remembers a function's results so repeated calls with the same arguments are
> instant.
> ```python
> from functools import cache
>
> @cache
> def fib(n):
>     return n if n < 2 else fib(n - 1) + fib(n - 2)
>
> print(fib(100))     # instant; without @cache this never finishes
> ```
> **Use it when** a pure function is called repeatedly with the same inputs —
> recursion especially.
> **Watch out:** the cache grows forever (use `@lru_cache(maxsize=1000)` to
> bound it), arguments must be hashable (no lists), and it's wrong for any
> function whose result can change over time.

---

## `@property` — a method that looks like an attribute

```python
class Unit:
    def __init__(self, hp, max_hp):
        self.hp = hp
        self.max_hp = max_hp

    @property
    def health_percent(self):
        return self.hp / self.max_hp * 100


u = Unit(15, 20)
print(u.health_percent)      # 75.0   — no brackets!
```

**Use it when** a value is derived from others and you'd rather callers didn't
have to know it's computed. **Watch out:** it's read-only unless you add a
setter, and hiding expensive work behind what looks like an attribute
surprises people — keep properties cheap.

---

## Recursion

A function that calls itself. You may have used it for pathfinding in the
game.

```python
def factorial(n):
    if n <= 1:            # base case — MUST exist
        return 1
    return n * factorial(n - 1)

print(factorial(5))       # 120
```

**Watch out:** every recursive function needs a base case that stops the
recursion, and each call must move toward it. Without that you get
`RecursionError: maximum recursion depth exceeded` (Python's limit is about
1000 frames). Python has no tail-call optimisation, so deep recursion is
genuinely limited — for anything that could go thousands deep, use a loop and
an explicit stack.

Where recursion genuinely shines is tree-shaped data:

```python
def total_size(item):
    """Sum every number in an arbitrarily nested list."""
    if isinstance(item, list):
        return sum(total_size(x) for x in item)
    return item

print(total_size([1, [2, [3, 4]], 5]))     # 15
```

---

## Walrus operator `:=`

> **NEW — `:=`**
> Assigns a value *and* returns it, inside an expression.
> ```python
> while (line := input("> ")) != "quit":
>     print(f"you said {line}")
> ```
> **Use it when** it saves you from calling something twice or duplicating a
> line before and inside a loop.
> **Watch out:** it makes code denser, which is not always clearer. Needs
> brackets in most contexts. Python 3.8+. Use sparingly.

```python
# without
data = get_data()
while data:
    process(data)
    data = get_data()

# with
while data := get_data():
    process(data)
```

---

## f-string formatting recap

The mini-language from Lesson 03, all in one place:

```python
v = 1234.5678
f"{v:.2f}"       # 1234.57      2 decimals
f"{v:,.2f}"      # 1,234.57     thousands separator
f"{v:>12.2f}"    # '     1234.57'  right-aligned, width 12
f"{v:<12.2f}"    # left
f"{v:^12.2f}"    # centred
f"{v:+.1f}"      # +1234.6      always show the sign
f"{0.85:.1%}"    # 85.0%
f"{42:05d}"      # 00042
f"{255:#x}"      # 0xff
f"{name!r}"      # calls repr()
f"{v=}"          # v=1234.5678  (debugging)
```

---

## Exercises

1. Sort a list of `(name, score)` tuples by score, highest first.
2. Sort a list of words by length, then alphabetically for ties.
3. Use `map` to convert `["1", "2", "3"]` to integers and sum them.
4. Write a decorator `@announce` that prints the function's name before
   calling it.
5. Rewrite `total = 0; for n in nums: total += n if n > 0 else 0` using a
   generator expression and `sum`.
6. Explain why `if x is 1000:` may be `False` even when `x` equals 1000.
7. Use `@cache` to make a naive recursive Fibonacci fast, and time both.
8. Write a recursive function that counts every file in a nested dictionary
   representing a folder tree.

---

## Solutions

**1.**
```python
scores = [("Alex", 42), ("Ben", 87), ("Ivy", 65)]
print(sorted(scores, key=lambda p: p[1], reverse=True))
```

**2.**
```python
words = ["fig", "banana", "kiwi", "date"]
print(sorted(words, key=lambda w: (len(w), w)))
# ['fig', 'date', 'kiwi', 'banana']
```

**3.** `print(sum(map(int, ["1", "2", "3"])))` → `6`

**4.**
```python
import functools

def announce(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@announce
def greet(name):
    return f"hi {name}"

print(greet("Alex"))
# calling greet
# hi Alex
```
The `return func(*args, **kwargs)` line is the important one — drop the
`return` and `greet("Alex")` gives back `None`.

**5.** `total = sum(n for n in nums if n > 0)`

**6.** `is` compares identity, not value. Python pre-creates and reuses small
integers (roughly −5 to 256), so `is` accidentally works for those, but 1000
is built fresh each time and two separate 1000s are different objects. Always
use `==` for numbers.

**7.**
```python
import time
from functools import cache

def fib_slow(n):
    return n if n < 2 else fib_slow(n - 1) + fib_slow(n - 2)

@cache
def fib_fast(n):
    return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)

start = time.perf_counter()
fib_slow(30)
print(f"slow: {time.perf_counter() - start:.3f}s")

start = time.perf_counter()
fib_fast(30)
print(f"fast: {time.perf_counter() - start:.6f}s")
```
Roughly 0.3 s versus 0.00002 s — the naive version recomputes the same values
about a million times.

**8.**
```python
tree = {
    "src": {"main.py": 1, "utils": {"a.py": 1, "b.py": 1}},
    "README.md": 1,
}

def count_files(node):
    if not isinstance(node, dict):
        return 1
    return sum(count_files(child) for child in node.values())

print(count_files(tree))     # 4
```
