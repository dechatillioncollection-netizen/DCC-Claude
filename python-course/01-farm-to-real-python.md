# Lesson 01 — From the farm to real Python

Before learning anything new, let's take stock. You know more Python than you
give yourself credit for, and you also have some habits the game gave you that
need adjusting.

---

## What you already know (and it's real Python)

Everything in this list is genuine, standard Python. It works identically in
the game and outside it:

```python
# variables
n = 10
name = "wheat"

# while loops
while n > 0:
    n = n - 1

# for loops over a range
for i in range(10):
    harvest()

# if / elif / else
if can_harvest():
    harvest()
else:
    plant(Entities.Bush)

# functions
def do_row():
    for i in range(get_world_size()):
        harvest()
        move(North)

# lists
crops = []
crops.append("wheat")

# operators
a + b, a - b, a * b, a / b, a % b, a == b, a != b, a < b
and, or, not
```

That is a substantial chunk of the language core. You are not starting from
zero — you are starting from "knows control flow, has never seen a library".

---

## What the game gave you that doesn't exist out here

The game handed you a world to act on. Functions like these are **not Python**
— they are the game's API, and they vanish the moment you leave it:

| Game function | Exists in real Python? |
|---|---|
| `move(North)` | No |
| `harvest()` | No |
| `plant(Entities.Bush)` | No |
| `can_harvest()` | No |
| `get_pos_x()`, `get_pos_y()` | No |
| `get_world_size()` | No |
| `num_items(Items.Hay)` | No |
| `trade(Items.Carrot)` | No |
| `measure()` | No |
| `do_a_flip()` | Sadly no |
| `quick_print()` | No (it's `print`) |
| `Entities.Bush`, `Items.Wood`, `North` | No |

Out here, **you** provide the world. If you want a grid to walk around, you
build the grid (Lesson 07). If you want something to control, you write it or
you import a library that talks to it.

This is the single biggest mental shift. In the game the interesting stuff was
already there and you wrote the logic. In real Python, you write both — but
you also get to import 200,000 other people's interesting stuff for free
(Lessons 14–15).

---

## What the game hid from you

The game's Python was deliberately cut down. Here is the material it never
showed you, in the order this course teaches it:

- **Real text handling.** Strings, formatting, searching, splitting. The game
  barely had strings. Real programs are mostly text. → Lesson 03
- **Input.** The game had no way to ask the user anything. → Lesson 02
- **Data structures beyond lists.** Dictionaries, sets, tuples. Dictionaries
  in particular will change how you write code. → Lessons 08–09
- **Errors and exceptions.** In the game, bad code just stopped. Real Python
  raises exceptions you can catch and handle. → Lesson 12
- **Files.** Saving and loading. Nothing you did in the game survived a
  restart unless the game saved it. → Lesson 13
- **Imports and the standard library.** The enormous free toolbox. → 14–15
- **Classes and objects.** How real programs are organised once they get
  bigger than one screen. → Lesson 16
- **Comprehensions, generators, decorators.** The idiomatic shorthand that
  makes Python code look like Python. → Lessons 11, 17, 18

---

## Three habits to unlearn

### 1. Infinite `while True` loops

In the game, `while True:` around your whole program was correct — the drone
should farm forever. Out here, a program that never ends is usually a bug.
Most scripts should start, do a thing, and finish.

```python
# game-brain
while True:
    harvest()

# real-world-brain
for crop in field:
    harvest(crop)
print("done")
```

### 2. Global state everywhere

The game had one drone with one position, so globals were fine. Real programs
pass data in and get data out:

```python
# game-brain: the function reads and changes hidden world state
def farm_row():
    for i in range(10):
        harvest()

# real-world-brain: the function takes what it needs, returns what it made
def total(prices):
    result = 0
    for p in prices:
        result = result + p
    return result
```

Lesson 10 covers this properly. It is the habit that most improves your code.

### 3. Ignoring return values

The game's functions mostly *did* things. Python's mostly *make* things, and
if you don't catch what they make, it's gone:

```python
names = ["zoe", "ana"]

names.sort()            # changes names in place, returns nothing
best = sorted(names)    # leaves names alone, RETURNS a new sorted list

sorted(names)           # computes a sorted list and throws it away — a bug
```

Whenever you meet a new function, the question to ask is: *does it change
something, or does it hand something back?*

---

## The one thing that is genuinely the same

Programming is still: keep track of some state, loop over things, make
decisions, wrap the repeated bits in functions. You did all of that to
automate a farm. Everything from here is more vocabulary, not a new way of
thinking.

---

## Exercises

1. Write out, from memory, a `for` loop that prints the numbers 0 to 9.
   Run it. (`for i in range(10):` — the body is up to you.)
2. Here is a game-style snippet. Rewrite it so it doesn't depend on a hidden
   world: make it a function that takes a list of numbers and returns how many
   of them are even.
   ```python
   def count_ready():
       count = 0
       for i in range(10):
           if can_harvest():
               count = count + 1
       return count
   ```
3. Name three things you did in the game that you now know were the *game's*
   functions, not Python's.

---

## Solutions

**1.**
```python
for i in range(10):
    print(i)
```

**2.**
```python
def count_even(numbers):
    count = 0
    for n in numbers:
        if n % 2 == 0:
            count = count + 1
    return count

print(count_even([1, 2, 3, 4, 5, 6]))   # 3
```
Note the two changes: the data comes in as an argument instead of being
fetched from a hidden world, and the loop walks the list directly rather than
counting indices.

**3.** Any three of: `move`, `harvest`, `plant`, `can_harvest`, `measure`,
`trade`, `num_items`, `get_world_size`, `get_pos_x`, `get_pos_y`, `do_a_flip`,
`Entities.*`, `Items.*`, `North`/`East`/`South`/`West`.
