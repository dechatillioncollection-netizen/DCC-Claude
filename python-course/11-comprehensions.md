# Lesson 11 — Comprehensions

A short lesson about one piece of syntax that will change how your code looks.
Nothing here is *necessary* — every comprehension can be written as a loop —
but idiomatic Python uses them constantly, so you need to read and write them.

---

## The idea

You have written this shape many times already:

```python
squares = []
for n in range(10):
    squares.append(n ** 2)
```

Four lines to say "the squares of 0 to 9". A **list comprehension** says it in
one:

```python
squares = [n ** 2 for n in range(10)]
```

> **NEW — list comprehension `[expr for item in iterable]`**
> Builds a new list by evaluating `expr` for every item.
> ```python
> print([n * 2 for n in [1, 2, 3]])          # [2, 4, 6]
> print([c.upper() for c in "hay"])          # ['H', 'A', 'Y']
> print([len(w) for w in "a bb ccc".split()])# [1, 2, 3]
> ```
> **Use it when** you're transforming every item of a collection into a new
> list — the `append`-in-a-loop pattern.
> **Watch out:** it always builds the whole list in memory, so on millions of
> items use a generator expression instead (below). And it's for *building* a
> list — if you're only doing something with side effects, write a normal
> loop. `[print(x) for x in items]` "works" but creates a junk list of `None`s
> and confuses every reader.

Read it in the order the words appear: *for each `n` in `range(10)`, give me
`n ** 2`.* The expression comes first because that's what the list will
contain.

---

## Adding a filter

```python
evens = [n for n in range(20) if n % 2 == 0]
```

> **NEW — comprehension with `if`**
> Keeps only the items where the condition is `True`.
> ```python
> nums = [4, -2, 7, -9]
> print([n for n in nums if n > 0])              # [4, 7]
> print([n * 2 for n in nums if n > 0])          # [8, 14]
> ```
> **Use it when** filtering, or filtering and transforming together.
> **Watch out:** the `if` at the end filters items *out*. That's different
> from the `if/else` form below, which chooses between two values and keeps
> everything.

### Filtering vs. choosing

```python
nums = [1, 2, 3, 4]

# filter: keep some items — `if` goes at the END
print([n for n in nums if n % 2 == 0])                    # [2, 4]

# choose: keep all items, pick a value — `if/else` goes at the FRONT
print(["even" if n % 2 == 0 else "odd" for n in nums])    # ['odd','even',...]
```

That front form is the conditional expression from Lesson 05, used as the
value. The position of the `if` tells you which one you're looking at.

You can combine both, though at that point consider a loop:

```python
[n * 2 if n > 0 else 0 for n in nums if n != 3]
```

---

## Dictionary and set comprehensions

Same syntax, different brackets.

> **NEW — dict comprehension `{key: value for item in iterable}`**
> ```python
> words = ["hay", "wood", "carrot"]
> print({w: len(w) for w in words})
> # {'hay': 3, 'wood': 4, 'carrot': 6}
> ```
> **Use it when** building a lookup table — often inverting a dictionary or
> indexing a list of records by id.
> **Watch out:** duplicate keys silently overwrite, so you may end up with
> fewer entries than you started with.

```python
# invert a dictionary
original = {"a": 1, "b": 2}
print({v: k for k, v in original.items()})       # {1: 'a', 2: 'b'}

# index records by id
users = [{"id": 1, "name": "Alex"}, {"id": 2, "name": "Ben"}]
by_id = {u["id"]: u for u in users}
print(by_id[2]["name"])                          # Ben
```

> **NEW — set comprehension `{expr for item in iterable}`**
> ```python
> words = ["hay", "wood", "hay"]
> print({w[0] for w in words})       # {'h', 'w'}
> ```
> **Use it when** you want unique results.
> **Watch out:** the braces are shared with dict comprehensions — the presence
> of a `:` is the only difference.

---

## Generator expressions

Swap the brackets for round ones and nothing is built in memory; values are
produced one at a time, on demand.

> **NEW — generator expression `(expr for item in iterable)`**
> ```python
> total = sum(n ** 2 for n in range(1_000_000))
> print(total)
> ```
> **Use it when** you're feeding straight into `sum`, `max`, `any`, `all`, or
> `join` and never need the list itself. Also for anything too big to hold in
> memory.
> **Watch out:** it's **single-use** — once consumed it's empty:
> ```python
> gen = (n for n in range(3))
> print(list(gen))     # [0, 1, 2]
> print(list(gen))     # []  — already exhausted
> ```
> `print(gen)` shows `<generator object ...>`, not the values. When a
> generator is the only argument to a function you can drop the extra
> brackets: `sum(n for n in nums)`.

This is the fix for the `join` problem from Lesson 03:

```python
nums = [1, 2, 3]
print(", ".join(str(n) for n in nums))     # 1, 2, 3
```

Lesson 17 covers generators properly.

---

## Nested comprehensions

Two loops, written in the same order you'd write them normally:

```python
# a 3x3 grid — the safe way to build one (Lesson 07)
grid = [[0] * 3 for _ in range(3)]

# all coordinate pairs
pairs = [(x, y) for y in range(3) for x in range(3)]
print(pairs[:4])      # [(0, 0), (1, 0), (2, 0), (0, 1)]

# flatten a 2D list
grid = [[1, 2], [3, 4]]
flat = [cell for row in grid for cell in row]
print(flat)           # [1, 2, 3, 4]
```

The loop order reads left to right, outer to inner — exactly as if you'd
written:

```python
flat = []
for row in grid:
    for cell in row:
        flat.append(cell)
```

**Watch out:** the *expression* is still at the front even though its variable
comes from the last loop. That inversion is why nested comprehensions get hard
to read fast. Two levels is the sensible maximum; beyond that, write the loop.

---

## When not to use one

Comprehensions are for **building a collection from another collection**. If
any of these apply, write a normal loop:

- The body does more than one thing.
- You need `break`, or to keep running state between items.
- The line would wrap past about 80 characters.
- You had to think for more than a moment about what it does.

```python
# unreadable — don't
result = [transform(x) for sub in data for x in sub if check(x) and x.ok]

# fine
result = []
for sub in data:
    for x in sub:
        if check(x) and x.ok:
            result.append(transform(x))
```

Short and clear beats short and clever. The comprehension is a tool for
removing *noise*, not for compressing logic.

---

## A worked example

```python
sales = [
    {"item": "hay",    "qty": 3, "price": 2.0},
    {"item": "wood",   "qty": 1, "price": 5.0},
    {"item": "carrot", "qty": 9, "price": 1.5},
    {"item": "hay",    "qty": 5, "price": 2.0},
]

# every line's total
totals = [s["qty"] * s["price"] for s in sales]
print(totals)                                # [6.0, 5.0, 13.5, 10.0]

# grand total, without building a list
print(f"Revenue: {sum(s['qty'] * s['price'] for s in sales):.2f}")

# just the big orders
big = [s["item"] for s in sales if s["qty"] >= 5]
print(big)                                   # ['carrot', 'hay']

# unique item names
print({s["item"] for s in sales})            # {'hay', 'wood', 'carrot'}

# a price lookup table
prices = {s["item"]: s["price"] for s in sales}
print(prices)                                # {'hay': 2.0, 'wood': 5.0, ...}

# a printable report
lines = [f"{s['item']:<8}{s['qty']:>3} @ {s['price']:.2f}" for s in sales]
print("\n".join(lines))
```

Five different comprehensions, each doing one clear job. That's the idiom.

---

## Exercises

1. Build a list of the cubes of 1–10 with a comprehension.
2. From `["Hay", "wood", "Carrot"]`, build a list of the lower-cased names.
3. From `range(1, 51)`, build a list of the multiples of 7.
4. From a list of words, build a dictionary mapping each word to its length,
   but only for words longer than 3 letters.
5. Flatten `[[1, 2], [3, 4], [5]]` into `[1, 2, 3, 4, 5]`.
6. Use a generator expression with `sum()` to total the lengths of a list of
   words without building an intermediate list.
7. From `["a1", "b2", "c3"]`, build `{"a": 1, "b": 2, "c": 3}`.
8. Turn `[3, -1, 4, -1, 5]` into `["pos", "neg", "pos", "neg", "pos"]`.
9. Explain why this gives `[]` the second time:
   ```python
   g = (n for n in range(3))
   print(list(g))
   print(list(g))
   ```

---

## Solutions

**1.** `[n ** 3 for n in range(1, 11)]`

**2.** `[w.lower() for w in ["Hay", "wood", "Carrot"]]`

**3.** `[n for n in range(1, 51) if n % 7 == 0]`

**4.**
```python
words = ["hay", "wood", "carrot", "ox"]
print({w: len(w) for w in words if len(w) > 3})    # {'wood': 4, 'carrot': 6}
```

**5.** `[x for sub in [[1, 2], [3, 4], [5]] for x in sub]`

**6.**
```python
words = ["hay", "wood", "carrot"]
print(sum(len(w) for w in words))     # 13
```

**7.**
```python
codes = ["a1", "b2", "c3"]
print({c[0]: int(c[1]) for c in codes})
```

**8.** `["pos" if n > 0 else "neg" for n in [3, -1, 4, -1, 5]]`

**9.** A generator produces each value once and keeps no history. The first
`list(g)` consumes all three; by the second call the generator is exhausted, so
it yields nothing. If you need the values twice, store them in a list.
