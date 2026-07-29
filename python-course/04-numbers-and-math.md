# Lesson 04 — Numbers and maths

You used `+`, `-`, `*`, `%` in the game. Here is the full set, plus the traps.

---

## The operators

```python
print(7 + 3)     # 10
print(7 - 3)     # 4
print(7 * 3)     # 21
print(7 / 3)     # 2.3333333333333335   <- always a float
print(7 // 3)    # 2      floor division — divide and round DOWN
print(7 % 3)     # 1      modulo — the remainder
print(7 ** 3)    # 343    power (7 cubed)
```

Two of these deserve attention.

### `/` always gives a float

```python
print(6 / 2)          # 3.0, not 3
print(type(6 / 2))    # <class 'float'>
```

If you want a whole number, use `//` or wrap in `int()`.

### `//` rounds **down**, not toward zero

```python
print(7 // 2)      # 3
print(-7 // 2)     # -4   <- surprised? down means down, past zero
print(int(-7 / 2)) # -3   <- int() truncates toward zero
```

### `%` — the remainder, and what it's for

You used this in the game for "every Nth tile" logic. Its three classic uses:

```python
# 1. Even or odd
if n % 2 == 0:
    print("even")

# 2. Every Nth iteration
for i in range(20):
    if i % 5 == 0:
        print(f"checkpoint at {i}")

# 3. Wrapping around (clock arithmetic, grid edges)
position = (position + 1) % world_size    # 9 -> 0 on a size-10 world
```

That third one is exactly the "walk off the east edge and appear on the west"
behaviour from the farm.

### Precedence

`**` first, then `*`, `/`, `//`, `%`, then `+`, `-`. Left to right within a
level. Use brackets when in doubt — nobody has ever been criticised for a
clear bracket.

```python
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20
print(2 ** 3 ** 2)    # 512  — powers group right-to-left: 2**(3**2)
```

---

## Built-in number functions

> **NEW — `abs(x)`**
> Absolute value — drops the minus sign.
> ```python
> print(abs(-7))     # 7
> print(abs(7))      # 7
> ```
> **Use it when** you care about size but not direction — distance between two
> values (`abs(a - b)`), or checking a difference is small enough.
> **Watch out:** it's not rounding. `abs(-3.7)` is `3.7`, still a float.

> **NEW — `round(x, digits)`**
> Rounds to the nearest whole number, or to `digits` decimal places.
> ```python
> print(round(3.7))        # 4
> print(round(3.14159, 2)) # 3.14
> print(round(2.5))        # 2   <- see the note below
> ```
> **Use it when** you need a genuinely rounded *number* for further maths.
> **Watch out:** two things. Python uses **banker's rounding** — exact halves
> go to the nearest *even* number, so `round(2.5)` is 2 while `round(3.5)` is
> 4. It's deliberate (it avoids upward bias across many values) but it
> surprises everyone once. Second, if you're only rounding *for display*,
> don't use this — use an f-string (`f"{x:.2f}"`), which keeps the full value
> intact and always shows the right number of decimals. `round(3.10, 2)`
> prints as `3.1`, not `3.10`.

> **NEW — `min(...)` / `max(...)`**
> Smallest / largest. Takes either several arguments or one collection.
> ```python
> print(min(3, 7, 2))        # 2
> print(max([3, 7, 2]))      # 7
> ```
> **Use it when** finding an extreme, or clamping a value (see below).
> **Watch out:** on an *empty* list both raise `ValueError` — guard with
> `if items:` first, or pass `default=0`. On strings they compare
> alphabetically, so `max("apple", "banana")` is `"banana"`. They also take a
> `key=` argument for custom comparisons (Lesson 18).

> **NEW — `sum(collection)`**
> Adds up a collection of numbers. Optional second argument is a starting
> value.
> ```python
> print(sum([1, 2, 3]))      # 6
> print(sum([1, 2, 3], 10))  # 16
> ```
> **Use it when** totalling numbers, or counting `True`s (booleans add up as
> 1 and 0, so `sum(x > 5 for x in nums)` counts how many exceed 5).
> **Watch out:** it only works on numbers — `sum(["a", "b"])` is a
> `TypeError`; joining strings is `"".join()`. `sum([])` is `0`, which is
> safe, but `sum([]) / len([])` still divides by zero.

> **NEW — `divmod(a, b)`**
> Returns both the floor-division result and the remainder, as a pair.
> ```python
> print(divmod(17, 5))       # (3, 2)
> minutes, seconds = divmod(125, 60)
> print(minutes, seconds)    # 2 5
> ```
> **Use it when** you need both halves of a division — splitting seconds into
> minutes and seconds, or bytes into units.
> **Watch out:** it returns a *pair*, so unpack it into two variables. And
> dividing by zero raises `ZeroDivisionError`, same as `/`.

> **NEW — `pow(a, b)`**
> Same as `a ** b`. With a third argument it does modular exponentiation
> efficiently (used in cryptography).
> ```python
> print(pow(2, 10))          # 1024
> ```
> **Use it when** you already have the numbers in variables and `**` would
> read oddly. Day to day, just write `a ** b`.
> **Watch out:** huge exponents are genuinely slow and eat memory —
> `2 ** 10_000_000` will hang your program, not error.

---

## Clamping — a pattern worth knowing

Keeping a value inside a range comes up constantly (health bars, volume,
coordinates):

```python
health = 130
health = max(0, min(100, health))
print(health)     # 100
```

Read it inside-out: cap at 100, then floor at 0.

---

## The `math` module

Some maths isn't built in and lives in a **module** you import. Lesson 14
explains imports properly; for now, `import math` at the top of your file and
then use `math.something`.

> **NEW — `import math`**
> Loads Python's maths module, making `math.xxx` available.
> ```python
> import math
> print(math.pi)          # 3.141592653589793
> print(math.sqrt(16))    # 4.0
> ```
> **Use it when** you need square roots, trigonometry, logs, or constants.
> **Watch out:** put `import` lines at the **top of the file**, once — not
> inside a loop or a function. After importing you must say `math.sqrt`, not
> bare `sqrt`; forgetting the prefix gives `NameError`. And `math.sqrt` of a
> negative number raises `ValueError` rather than returning a complex number.

The useful members:

```python
import math

math.pi                # 3.14159...
math.e                 # 2.71828...
math.inf               # infinity (bigger than any number)

math.sqrt(16)          # 4.0        square root
math.floor(3.7)        # 3          round down to an int
math.ceil(3.2)         # 4          round up to an int
math.trunc(-3.7)       # -3         chop toward zero
math.hypot(3, 4)       # 5.0        straight-line distance
math.dist((0,0), (3,4))# 5.0        distance between two points
math.factorial(5)      # 120
math.gcd(12, 18)       # 6          greatest common divisor
math.log(100, 10)      # 2.0        logarithm (base optional, defaults to e)
math.sin(math.pi / 2)  # 1.0        trig — arguments in RADIANS
math.degrees(math.pi)  # 180.0
math.radians(180)      # 3.14159...
math.isclose(0.1+0.2, 0.3)   # True — the fix for the float problem below
```

`math.hypot` and `math.dist` are how you measure distance on a grid — the
thing you were doing by hand in the farm.

---

## The float problem

```python
print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False
```

Floats are binary approximations of decimal numbers, and 0.1 has no exact
binary form — the same way 1/3 has no exact decimal form. This is true in
every programming language.

**The rules:**

1. **Never compare floats with `==`.** Use `math.isclose`:
   ```python
   import math
   print(math.isclose(0.1 + 0.2, 0.3))    # True
   ```
2. **Never use floats for money.** Use integer cents, or the `decimal`
   module:
   ```python
   from decimal import Decimal
   print(Decimal("0.1") + Decimal("0.2"))    # 0.3  — exact
   ```
3. **For display, round it**: `f"{value:.2f}"`.

---

## Random numbers

The other module you'll want early.

> **NEW — `import random`**
> Python's random-number module.
> **Use it when** you want dice, shuffling, sampling, or test data.
> **Watch out:** the two number pickers have different ends —
> `random.randint(1, 6)` **includes** 6, while `random.randrange(1, 6)` stops
> at 5 (it matches `range`). Mixing them up is an off-by-one bug that only
> shows up occasionally, which is the worst kind. Also: this is *not* secure
> randomness — for passwords or tokens use the `secrets` module instead.

```python
import random

random.randint(1, 6)              # a whole number 1..6, both ends included
random.randrange(0, 10)           # 0..9, excludes the top (like range)
random.random()                   # a float 0.0 <= x < 1.0
random.uniform(1.5, 3.5)          # a float in that range
random.choice(["hay", "wood"])    # one random item from a list
random.choices(["a","b"], k=3)    # 3 items, WITH repeats -> e.g. ['a','a','b']
random.sample([1,2,3,4], 2)       # 2 different items, no repeats
random.shuffle(my_list)           # shuffles the list IN PLACE, returns None
```

Note the last one — `shuffle` changes your list and returns `None`, so
`x = random.shuffle(lst)` gives you `None`. That's the "does it change or
return?" question from Lesson 01.

```python
import random

lst = [1, 2, 3, 4, 5]
random.shuffle(lst)
print(lst)                # e.g. [3, 1, 5, 2, 4]
```

> **NEW — `random.seed(n)`**
> Fixes the random sequence so you get the same "random" numbers every run.
> Essential for reproducing a bug.
> ```python
> random.seed(42)
> print(random.randint(1, 100))   # always the same number for seed 42
> ```
> **Use it when** you need repeatable results — reproducing a bug, or writing
> a test that must pass every time.
> **Watch out:** call it *once* at the start. Calling `seed()` inside a loop
> resets the generator every pass and you'll get the same "random" value over
> and over. Remove or comment it out before shipping anything that's supposed
> to feel random.

---

## Number bases and characters

Occasionally useful:

```python
print(bin(10))     # '0b1010'   binary text
print(hex(255))    # '0xff'     hexadecimal text
print(oct(8))      # '0o10'     octal text
print(int("ff", 16))   # 255    parse text in a given base

print(ord("A"))    # 65   character -> its number
print(chr(66))     # B    number -> its character
```

`ord` and `chr` are how you do letter arithmetic (e.g. Caesar ciphers).

---

## Exercises

1. Print the number of full hours and leftover minutes in 500 minutes, using
   `divmod`.
2. Ask for a radius and print the area of that circle to 2 decimal places.
3. Write a loop that prints the numbers 1 to 30, but only those divisible by
   both 3 and 5.
4. Compute the straight-line distance between (2, 3) and (10, 9) two ways:
   with `**` and `math.sqrt`, and with `math.dist`.
5. Simulate rolling two dice 1000 times and report how often the total was 7.
6. Explain why `0.1 + 0.2 == 0.3` is `False`, and write a check that gives
   `True`.
7. Clamp a variable `x` to the range 10..20 in one line.

---

## Solutions

**1.**
```python
hours, minutes = divmod(500, 60)
print(f"{hours}h {minutes}m")     # 8h 20m
```

**2.**
```python
import math
r = float(input("Radius: "))
print(f"Area: {math.pi * r ** 2:.2f}")
```

**3.**
```python
for n in range(1, 31):
    if n % 3 == 0 and n % 5 == 0:
        print(n)      # 15, 30
```

**4.**
```python
import math
dx, dy = 10 - 2, 9 - 3
print(math.sqrt(dx ** 2 + dy ** 2))     # 10.0
print(math.dist((2, 3), (10, 9)))       # 10.0
```

**5.**
```python
import random
sevens = 0
for _ in range(1000):
    if random.randint(1, 6) + random.randint(1, 6) == 7:
        sevens += 1
print(f"{sevens} sevens ({sevens / 10:.1f}%)")   # around 167 (16.7%)
```
(`_` is the conventional name for "a variable I don't care about".)

**6.** Neither 0.1 nor 0.2 can be stored exactly in binary, so their sum is a
hair above 0.3. Use `math.isclose(0.1 + 0.2, 0.3)`.

**7.** `x = max(10, min(20, x))`
