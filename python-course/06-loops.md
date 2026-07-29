# Lesson 06 — Loops

Your strongest area coming in. This lesson mostly adds vocabulary: looping
over *things* rather than over *counts*, and the helpers that go with it.

---

## `while` — repeat while a condition holds

```python
hay = 10
while hay > 0:
    print(f"{hay} hay left")
    hay -= 1
print("out of hay")
```

The condition is checked **before** each pass. If it's false at the start, the
body never runs at all.

The classic bug — forgetting to change the variable the condition depends on:

```python
hay = 10
while hay > 0:
    print("still farming")     # forever. Ctrl+C to escape.
```

`Ctrl+C` interrupts a runaway program in the terminal. You will need it.

### `while True` with a break

Legitimate when you genuinely don't know the count up front — menus, input
validation, games:

```python
while True:
    answer = input("Command (or 'quit'): ")
    if answer == "quit":
        break
    print(f"You said {answer}")
```

---

## `for` — repeat over a collection

You know this shape:

```python
for i in range(10):
    print(i)
```

But `range` is only one of the things you can loop over. **A `for` loop walks
any collection**, one item at a time:

```python
for crop in ["wheat", "carrot", "pumpkin"]:
    print(crop)

for letter in "hay":
    print(letter)          # h, a, y

for key in {"hay": 12, "wood": 5}:
    print(key)             # hay, wood
```

This is the shift from game-Python to real Python. In the game you nearly
always looped over indices because you were walking a grid. Out here, if you
have a list of things, loop over the things:

```python
crops = ["wheat", "carrot"]

# game-brain
for i in range(len(crops)):
    print(crops[i])

# python-brain
for crop in crops:
    print(crop)
```

### `range` in full

> **NEW — `range(stop)` / `range(start, stop)` / `range(start, stop, step)`**
> Produces a sequence of whole numbers. `start` is included, `stop` is
> **excluded**.
> ```python
> list(range(5))          # [0, 1, 2, 3, 4]
> list(range(2, 6))       # [2, 3, 4, 5]
> list(range(0, 10, 2))   # [0, 2, 4, 6, 8]
> list(range(5, 0, -1))   # [5, 4, 3, 2, 1]   — counting down
> ```
> **Use it when** you need to repeat something a set number of times, or you
> genuinely need index numbers.
> **Watch out:** the top end is excluded, so `range(1, 10)` stops at 9 — to
> include 10 you write `range(1, 11)`. It only handles whole numbers
> (`range(0, 1, 0.1)` is a `TypeError`). And if you're looping over a list's
> items, don't use `range(len(x))` — loop the list directly, or use
> `enumerate` if you also need the position.
>
> `range` doesn't build the list in memory; it generates numbers on demand.
> That's why `print(range(5))` shows `range(0, 5)` rather than the numbers —
> wrap it in `list()` to see them.

---

## `break` and `continue`

> **NEW — `break`**
> Leaves the loop immediately.
> ```python
> for n in [3, 7, 12, 5]:
>     if n > 10:
>         print(f"found {n}")
>         break
> ```
> **Use it when** you've found what you were looking for and there's no point
> continuing — searching, or exiting a `while True` menu.
> **Watch out:** it escapes **one** loop only. Inside nested loops it leaves
> the inner one and the outer one carries on. Any code you write after `break`
> in the same block never runs, exactly like after a `return`. And `break`
> outside a loop is a `SyntaxError`.

> **NEW — `continue`**
> Skips the rest of this pass and starts the next one.
> ```python
> for n in range(10):
>     if n % 2 == 0:
>         continue
>     print(n)      # 1, 3, 5, 7, 9
> ```
> **Use it when** you want to skip bad or irrelevant items early, so the rest
> of the loop body doesn't need to be wrapped in a big `if`.
> **Watch out:** in a `while` loop, `continue` jumps straight back to the
> condition — if the line that increments your counter sits *below* the
> `continue`, it gets skipped and the loop runs forever. Increment before you
> `continue`.

Both affect only the innermost loop they're in.

### `for ... else`

A Python oddity worth knowing because it reads confusingly: the `else` on a
loop runs **only if the loop finished without hitting `break`**.

```python
for n in numbers:
    if n < 0:
        print("found a negative")
        break
else:
    print("all numbers were positive")
```

Think of it as "no break happened". Rarely used, but when you meet it in
someone's code you'll know.

---

## The loop helpers

These three are what make Python loops pleasant.

> **NEW — `enumerate(collection)`**
> Yields `(index, item)` pairs, so you get the position *and* the value.
> ```python
> for i, crop in enumerate(["wheat", "carrot"]):
>     print(i, crop)
> # 0 wheat
> # 1 carrot
> ```
> **Use it when** you need the position *and* the value — numbering output,
> or reporting "error on line 12".
> **Watch out:** the loop needs **two** variables. Writing
> `for item in enumerate(x):` gives you `(0, 'wheat')` pairs instead of the
> items, which then breaks in confusing ways further down. The `start`
> argument changes only the number shown, not which items you get:
> `enumerate(crops, 1)` still walks the whole list.

This replaces the `for i in range(len(x))` pattern whenever you need both.

> **NEW — `zip(a, b, ...)`**
> Walks several collections in lockstep, yielding tuples. Stops at the
> shortest one.
> ```python
> names = ["hay", "wood"]
> counts = [12, 40]
> for name, count in zip(names, counts):
>     print(f"{name}: {count}")
> # hay: 12
> # wood: 40
> ```
> **Use it when** two lists line up item for item and you need them together.
> **Watch out:** it silently stops at the shortest list. If one has 5 items
> and the other 3, you get 3 pairs and no warning — a real source of quietly
> lost data. Pass `strict=True` (Python 3.10+) to make mismatched lengths
> raise an error instead.

> **NEW — `reversed(collection)`**
> Walks a collection backwards.
> ```python
> for n in reversed([1, 2, 3]):
>     print(n)      # 3, 2, 1
> ```
> **Use it when** order matters and you want to go last-to-first — undoing
> steps, or safely removing items while looping.
> **Watch out:** it returns a lazy view, not a list. `print(reversed(x))`
> shows `<list_reverseiterator ...>`; wrap it in `list()` if you need an
> actual list. It also can't reverse a `set` or a plain generator.

> **NEW — `sorted(collection)`**
> Returns a **new** sorted list, leaving the original alone.
> ```python
> for n in sorted([3, 1, 2]):
>     print(n)      # 1, 2, 3
> for n in sorted([3, 1, 2], reverse=True):
>     print(n)      # 3, 2, 1
> ```
> **Use it when** you want things in order but need the original list left
> alone — printing a leaderboard, tidying output.
> **Watch out:** don't confuse it with the `.sort()` *method*, which reorders
> the list in place and returns `None`. `x = mylist.sort()` sets `x` to
> `None` — a classic. Also, sorting a mix of types
> (`sorted([1, "a"])`) is a `TypeError`, and text sorts with capitals first,
> so `["banana", "Apple"]` sorts as `Apple, banana`.

---

## Nested loops

Exactly like the farm's "walk every tile":

```python
for y in range(3):
    for x in range(3):
        print(f"({x}, {y})", end=" ")
    print()      # newline at the end of each row
```

```
(0, 0) (1, 0) (2, 0)
(0, 1) (1, 1) (2, 1)
(0, 2) (1, 2) (2, 2)
```

> **NEW — `print(..., end="...")`**
> By default `print` ends with a newline. `end=` replaces it, so you can keep
> writing on the same line.
> ```python
> print("a", end="")
> print("b")        # ab
> ```
> **Use it when** building a line piece by piece — a grid row, a progress bar,
> items separated by spaces.
> **Watch out:** having used `end=""`, you need a bare `print()` afterwards to
> finish the line, or your next output runs into it. There's also `sep=` to
> change what goes *between* the arguments:
> `print("a", "b", sep="-")` → `a-b`.

The cost of nesting: two loops of 1000 is 1,000,000 passes. Three is a
billion. Keep an eye on it.

### Breaking out of nested loops

`break` only escapes one level. The usual solutions are a flag, or — much
cleaner — put the loops in a function and `return` (Lesson 10).

```python
found = None
for row in grid:
    for cell in row:
        if cell == "gold":
            found = cell
            break
    if found:
        break
```

---

## Common loop patterns

Learn these shapes; you'll use them forever.

```python
numbers = [4, 8, 15, 16, 23, 42]

# accumulate a total
total = 0
for n in numbers:
    total += n

# count matches
evens = 0
for n in numbers:
    if n % 2 == 0:
        evens += 1

# find the biggest yourself
biggest = numbers[0]
for n in numbers:
    if n > biggest:
        biggest = n

# build a new list
doubled = []
for n in numbers:
    doubled.append(n * 2)

# search and stop
target = None
for n in numbers:
    if n > 20:
        target = n
        break
```

(Python has built-ins for several of these — `sum`, `max` — but knowing the
long form matters, because the day comes when the built-in doesn't fit.)

---

## A worked example

```python
# Simple number-guessing game.
import random

secret = random.randint(1, 100)
guesses = 0

while True:
    raw = input("Guess (1-100): ").strip()

    if not raw.isdigit():
        print("Please type a whole number.")
        continue

    guess = int(raw)
    guesses += 1

    if guess < secret:
        print("Higher")
    elif guess > secret:
        print("Lower")
    else:
        print(f"Correct in {guesses} guesses!")
        break
```

`continue` for bad input, `break` for success, a counter accumulating — all
three patterns in fifteen lines.

---

## Exercises

1. Print the 7 times table from 7×1 to 7×12, one per line, formatted like
   `7 x 3 = 21`.
2. Sum the numbers 1 to 100 with a loop. (Answer: 5050.)
3. Given `crops = ["wheat", "carrot", "pumpkin"]`, print each with its
   position starting at 1, using `enumerate`.
4. Given two lists `names` and `prices`, print `name: price` lines using
   `zip`.
5. Print a 5×5 square of `*` characters using nested loops and `end=`.
6. Ask the user for numbers repeatedly until they type `done`, then print how
   many they entered and their average.
7. Print the first 10 numbers of the Fibonacci sequence (each is the sum of
   the previous two, starting 0, 1).
8. Print every number from 1 to 50 that is prime. (A number > 1 is prime if
   nothing from 2 up to its square root divides it evenly.)

---

## Solutions

**1.**
```python
for i in range(1, 13):
    print(f"7 x {i} = {7 * i}")
```

**2.**
```python
total = 0
for n in range(1, 101):
    total += n
print(total)
```

**3.**
```python
crops = ["wheat", "carrot", "pumpkin"]
for i, crop in enumerate(crops, 1):
    print(f"{i}. {crop}")
```

**4.**
```python
names = ["hay", "wood", "carrot"]
prices = [2, 5, 3]
for name, price in zip(names, prices):
    print(f"{name}: {price}")
```

**5.**
```python
for row in range(5):
    for col in range(5):
        print("*", end="")
    print()
```

**6.**
```python
numbers = []
while True:
    raw = input("Number (or 'done'): ").strip()
    if raw == "done":
        break
    numbers.append(float(raw))

if numbers:
    print(f"{len(numbers)} numbers, average {sum(numbers) / len(numbers):.2f}")
else:
    print("No numbers entered")
```
The `if numbers:` guard stops a division by zero — always check before
dividing by a length.

**7.**
```python
a, b = 0, 1
for _ in range(10):
    print(a, end=" ")
    a, b = b, a + b
# 0 1 1 2 3 5 8 13 21 34
```
The simultaneous assignment `a, b = b, a + b` is doing real work here — both
right-hand values are computed before either is assigned.

**8.**
```python
for n in range(2, 51):
    is_prime = True
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            is_prime = False
            break
    if is_prime:
        print(n, end=" ")
print()
```
