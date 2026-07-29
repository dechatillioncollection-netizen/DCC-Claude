# Lesson 08 — Tuples and unpacking

A short lesson, but it unlocks a lot of Python that otherwise looks like
magic — including how a function returns two things at once.

---

## A tuple is a list that can't change

```python
point = (3, 4)
print(point[0])      # 3
print(len(point))    # 2

point[0] = 5         # TypeError: 'tuple' object does not support item assignment
```

Round brackets instead of square ones. Everything you can *read* from a list
works: indexing, slicing, `in`, `len`, looping. Everything that *modifies* —
`append`, `sort`, `remove` — does not exist.

### The brackets are optional

The comma is what makes a tuple, not the brackets:

```python
point = 3, 4
print(point)         # (3, 4)
print(type(point))   # <class 'tuple'>
```

Which explains something you've already been doing:

```python
a, b = 1, 2          # this is really: a, b = (1, 2)
```

### The one-item gotcha

```python
not_a_tuple = (5)      # just the number 5 in brackets
yes_a_tuple = (5,)     # a one-item tuple — note the trailing comma
print(type(not_a_tuple))   # <class 'int'>
print(type(yes_a_tuple))   # <class 'tuple'>
```

An empty tuple is `()`.

---

## Why bother?

Three real reasons:

1. **Safety.** If a value shouldn't change, make it impossible to change.
   Coordinates, RGB colours, database rows, configuration.
2. **Speed and memory.** Tuples are slightly smaller and faster than lists.
   Rarely decisive, occasionally useful.
3. **They can be dictionary keys.** Lists cannot (Lesson 09). This matters
   enormously for grids:
   ```python
   world = {}
   world[(3, 4)] = "wheat"       # a coordinate as a key — very handy
   ```

The rule of thumb: **list for a collection of similar things you'll change**
(`["hay", "wood", "carrot"]`), **tuple for a fixed group of related things**
(`(x, y)`, `(name, age, city)`).

---

## Unpacking

Splitting a collection into separate variables.

```python
point = (3, 4)
x, y = point
print(x, y)      # 3 4
```

It works on lists and strings too:

```python
a, b, c = [1, 2, 3]
first, second = "hi"
```

The counts must match exactly:

```python
a, b = (1, 2, 3)     # ValueError: too many values to unpack (expected 2)
```

### Starred unpacking

> **NEW — `*name` in unpacking**
> Collects "all the remaining items" into a list.
> ```python
> first, *rest = [1, 2, 3, 4]
> print(first, rest)      # 1 [2, 3, 4]
>
> *start, last = [1, 2, 3, 4]
> print(start, last)      # [1, 2, 3] 4
>
> first, *middle, last = [1, 2, 3, 4]
> print(middle)           # [2, 3]
> ```
> **Use it when** you care about the first or last item and want the rest in
> one go — splitting a command from its arguments, say.
> **Watch out:** only one `*` per unpacking, and the starred variable is
> always a **list**, even when the source was a tuple and even when it catches
> nothing (then it's `[]`).

### Ignoring values with `_`

```python
name, _, city = ("Alex", 30, "Cape Town")
```

`_` is an ordinary variable name that programmers use by convention to mean "I
don't care about this one". Nothing enforces it; it just signals intent.

### Unpacking in a loop

You've already seen this with `enumerate` and `zip`:

```python
points = [(0, 0), (3, 4), (6, 8)]
for x, y in points:
    print(f"x={x} y={y}")
```

Each item is a tuple, and the loop unpacks it into two names automatically.
Without unpacking you'd write `point[0]` and `point[1]` everywhere.

---

## Swapping

```python
a, b = 1, 2
a, b = b, a
print(a, b)      # 2 1
```

The right side is built into a tuple `(2, 1)` **first**, then unpacked. That's
why no temporary variable is needed, and why the Fibonacci line from Lesson 06
works:

```python
a, b = b, a + b      # both new values computed from the OLD a and b
```

---

## Returning several values

This is the payoff. A Python function returns one object — but that object can
be a tuple, and the caller can unpack it:

```python
def min_max(numbers):
    return min(numbers), max(numbers)      # a tuple

low, high = min_max([4, 8, 15, 16])
print(low, high)      # 4 16
```

You will use this constantly. In the game, a function that needed to report
two things had to stash them somewhere; here it just returns both.

You've already met a built-in that does it — `divmod(17, 5)` returns `(3, 2)`.

---

## Tuple methods

Only two, since nothing can change:

```python
point = (3, 4, 3)
print(point.count(3))     # 2
print(point.index(4))     # 1
```

> **NEW — `tuple(iterable)`**
> Converts a collection into a tuple.
> ```python
> print(tuple([1, 2, 3]))     # (1, 2, 3)
> print(tuple("hay"))         # ('h', 'a', 'y')
> ```
> **Use it when** you need an unchangeable version of a list, usually to use
> it as a dictionary key.
> **Watch out:** it's a shallow conversion. A tuple *containing* a list still
> lets you modify that inner list — the tuple only fixes which objects it
> holds, not what's inside them.

---

## Named tuples — a preview

When a tuple has more than about three fields, remembering that `person[2]` is
the city gets old. There's a fix:

```python
from collections import namedtuple

Person = namedtuple("Person", ["name", "age", "city"])
p = Person("Alex", 30, "Cape Town")

print(p.name)      # Alex   — much clearer than p[0]
print(p[0])        # Alex   — still works like a tuple
```

More on this and its modern replacement (`dataclass`) in Lessons 15 and 16.

---

## Exercises

1. Write a function `stats(numbers)` that returns the count, sum and average
   as a tuple, then unpack the result at the call site.
2. Swap two variables without a temporary.
3. Given `data = ("Alex", 30, "Cape Town", "engineer")`, unpack it so `name`
   holds the first item and `rest` holds the other three.
4. Loop over `[(1, "hay"), (2, "wood")]` printing `1: hay` style lines.
5. Why does `x = (5)` not give a tuple? Fix it.
6. Write a function `divide(a, b)` that returns both the quotient and
   remainder, without using `divmod`.
7. Given a list of `(name, score)` pairs, find the name with the highest
   score, using a plain loop.

---

## Solutions

**1.**
```python
def stats(numbers):
    return len(numbers), sum(numbers), sum(numbers) / len(numbers)

count, total, average = stats([4, 8, 15])
print(f"{count} items, total {total}, average {average:.2f}")
```

**2.** `a, b = b, a`

**3.** `name, *rest = data` → `rest` is `[30, 'Cape Town', 'engineer']`.

**4.**
```python
for number, item in [(1, "hay"), (2, "wood")]:
    print(f"{number}: {item}")
```

**5.** Brackets alone just group an expression; the comma makes a tuple. Write
`x = (5,)`.

**6.**
```python
def divide(a, b):
    return a // b, a % b

q, r = divide(17, 5)
print(q, r)      # 3 2
```

**7.**
```python
scores = [("Alex", 42), ("Ben", 87), ("Ivy", 65)]
best_name = None
best_score = None
for name, score in scores:
    if best_score is None or score > best_score:
        best_name, best_score = name, score
print(f"{best_name} with {best_score}")
```
The `best_score is None` check handles the first pass without having to guess
a starting value — better than seeding with `0`, which breaks on negative
scores.
