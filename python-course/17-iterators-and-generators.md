# Lesson 17 — Iterators and generators

A short lesson explaining something you've been using since Lesson 06 without
knowing it: how `for` loops actually work, and how to write things that
produce values lazily.

---

## What `for` really does

When you write:

```python
for x in [1, 2, 3]:
    print(x)
```

Python does this behind the scenes:

```python
it = iter([1, 2, 3])       # get an iterator
while True:
    try:
        x = next(it)       # ask for the next value
    except StopIteration:  # the iterator says "no more"
        break
    print(x)
```

> **NEW — `iter(collection)` / `next(iterator)`**
> `iter` gets an iterator from a collection; `next` pulls the next value out
> of it.
> ```python
> it = iter(["a", "b"])
> print(next(it))     # a
> print(next(it))     # b
> print(next(it))     # StopIteration
> ```
> **Use it when** you need to peek at one value, or process a stream by hand
> rather than with a loop.
> **Watch out:** `next` raises `StopIteration` when exhausted — pass a default
> to avoid it: `next(it, None)`. An iterator is consumed as you go and cannot
> be rewound or reused.

**Iterable** = something you can loop over (list, string, dict, file).
**Iterator** = the thing that tracks where you are in it.

That distinction explains behaviour you've already hit: a file object and a
generator expression are iterators, so they empty out after one pass; a list is
an iterable that hands out a fresh iterator each time, so you can loop it
repeatedly.

---

## Generators — functions that pause

> **NEW — `yield`**
> Turns a function into a **generator**: instead of computing everything and
> returning once, it hands back one value at a time and pauses, keeping its
> state, until asked for the next.
> ```python
> def countdown(n):
>     while n > 0:
>         yield n
>         n -= 1
>
> for x in countdown(3):
>     print(x)      # 3, 2, 1
> ```
> **Use it when** producing a long or infinite sequence, reading a big file, or
> when the caller may not need every value.
> **Watch out:** calling the function does **not** run it — you get a
> generator object, and nothing happens until you iterate it. `print(countdown(3))`
> shows `<generator object ...>`. A generator is single-use: loop it twice and
> the second loop sees nothing. And you can't `len()` it or index it; wrap in
> `list()` if you need that (which discards the memory advantage).

Compare:

```python
# builds the whole list in memory
def squares_list(n):
    result = []
    for i in range(n):
        result.append(i ** 2)
    return result

# produces one at a time, uses almost no memory
def squares_gen(n):
    for i in range(n):
        yield i ** 2

print(sum(squares_list(10_000_000)))   # works, but eats hundreds of MB
print(sum(squares_gen(10_000_000)))    # same answer, constant memory
```

### Why "pauses" matters

```python
def noisy():
    print("starting")
    yield 1
    print("between")
    yield 2
    print("done")

g = noisy()
print("created")
print(next(g))      # prints "starting" then 1
print(next(g))      # prints "between" then 2
```

```
created
starting
1
between
2
```

Nothing ran until the first `next`. The function's local state — variables,
position in the loop — survives between calls. That's what makes generators
different from anything else in the language.

### Infinite generators

Because values are produced on demand, a generator can be endless:

```python
def naturals():
    n = 0
    while True:
        yield n
        n += 1

for n in naturals():
    if n > 5:
        break
    print(n)        # 0..5
```

**Watch out:** `list(naturals())` hangs forever. Always pair an infinite
generator with a `break`, or with `itertools.islice`:

```python
from itertools import islice
print(list(islice(naturals(), 5)))     # [0, 1, 2, 3, 4]
```

### `yield from`

> **NEW — `yield from iterable`**
> Yields every value from another iterable, saving a loop.
> ```python
> def chain(a, b):
>     yield from a
>     yield from b
>
> print(list(chain([1, 2], [3])))     # [1, 2, 3]
> ```
> **Use it when** a generator delegates to another generator or collection —
> common when flattening nested structures.
> **Watch out:** `yield from x` is not the same as `yield x`; the latter would
> hand back the whole collection as one item.

---

## Generator expressions, again

From Lesson 11 — the compact form:

```python
squares = (n ** 2 for n in range(10))       # generator
squares = [n ** 2 for n in range(10)]       # list
```

Same rules apply: single-use, lazy, memory-light.

**Choosing between them:** if you'll use the values once and immediately (feed
them to `sum`, `max`, `join`, or a loop), use a generator. If you need to keep
them, index them, count them, or use them twice, build a list.

---

## A practical example: reading a huge file

```python
def parse_log(path):
    """Yield (level, message) for each valid line — never loads the whole file."""
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split(":", 1)
            if len(parts) != 2:
                continue
            yield parts[0].strip().upper(), parts[1].strip()


# Count errors in a 5 GB log without ever holding more than one line
errors = sum(1 for level, _ in parse_log("app.log") if level == "ERROR")
print(f"{errors} errors")
```

The `with` block stays open across yields and closes when the generator is
exhausted — one of the neater things about this design.

---

## Chaining generators

Generators compose into pipelines, each stage lazy:

```python
def read_numbers(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

def to_ints(lines):
    for line in lines:
        if line.isdigit():
            yield int(line)

def evens(numbers):
    for n in numbers:
        if n % 2 == 0:
            yield n


pipeline = evens(to_ints(read_numbers("data.txt")))
print(sum(pipeline))
```

No stage builds a list. Data flows through one item at a time, however big the
file is. This is the same idea as Unix pipes.

---

## Making your own class iterable

Give a class `__iter__` and it works in a `for` loop:

```python
class Deck:
    def __init__(self):
        self.cards = ["A", "K", "Q"]

    def __iter__(self):
        yield from self.cards          # simplest possible implementation


for card in Deck():
    print(card)
```

Because `__iter__` uses `yield`, it's a generator, and Python needs nothing
else. (The longer form returns an object with `__next__`, but you rarely need
it.)

---

## Exercises

1. Write a generator `evens(limit)` yielding even numbers up to a limit.
2. Write a generator that yields the Fibonacci sequence forever, then print
   the first 10 values.
3. Convert this to a generator, and explain the memory difference:
   ```python
   def loud(words):
       result = []
       for w in words:
           result.append(w.upper())
       return result
   ```
4. Explain why the second `sum` prints `0`:
   ```python
   g = (n for n in range(5))
   print(sum(g))
   print(sum(g))
   ```
5. Write a generator that reads a file and yields only lines containing a
   given word.
6. Use `itertools.islice` to take the first 5 values from an infinite
   generator.
7. Make a class `Countdown(n)` that can be used directly in a `for` loop.

---

## Solutions

**1.**
```python
def evens(limit):
    for n in range(limit):
        if n % 2 == 0:
            yield n

print(list(evens(10)))     # [0, 2, 4, 6, 8]
```

**2.**
```python
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fib(), 10)))     # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**3.**
```python
def loud(words):
    for w in words:
        yield w.upper()
```
The original builds a complete second list, so peak memory holds both the
input and the output. The generator holds one word at a time, so memory stays
flat no matter how many words there are. The trade-off: you can only walk the
result once.

**4.** The first `sum` consumes the generator completely. Generators keep no
history and cannot restart, so the second call finds nothing left and sums an
empty sequence, which is `0`.

**5.**
```python
def matching_lines(path, word):
    with open(path, encoding="utf-8") as f:
        for line in f:
            if word in line:
                yield line.rstrip("\n")
```

**6.**
```python
from itertools import islice
print(list(islice(fib(), 5)))     # [0, 1, 1, 2, 3]
```

**7.**
```python
class Countdown:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        n = self.n
        while n > 0:
            yield n
            n -= 1


print(list(Countdown(3)))     # [3, 2, 1]
```
Note the local `n` — using `self.n` directly would make the object single-use,
since the counter would be consumed permanently on the first loop.
