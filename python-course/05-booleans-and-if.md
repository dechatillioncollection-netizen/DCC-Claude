# Lesson 05 — Booleans, comparisons and `if`

You used `if can_harvest():` a hundred times. This lesson makes the machinery
underneath it explicit, because the details are where the bugs live.

---

## Comparisons produce booleans

```python
print(5 > 3)      # True
print(5 == 3)     # False
```

A comparison is an expression whose value is `True` or `False`. It is not
magic that only works inside `if` — you can store it:

```python
is_ready = crops >= 10
if is_ready:
    print("harvest time")
```

### The operators

| Operator | Means |
|---|---|
| `==` | equal to |
| `!=` | not equal to |
| `<` `>` | less / greater than |
| `<=` `>=` | less / greater than or equal |

**`=` assigns, `==` compares.** Writing `if x = 5:` is a `SyntaxError`, which
is Python doing you a favour — in some languages it silently compiles.

### Chaining

Python lets you chain comparisons the way maths does. Most languages don't.

```python
age = 25
print(18 <= age < 65)      # True
# instead of: age >= 18 and age < 65
```

### Comparing strings

Strings compare alphabetically, by character code — so uppercase sorts before
lowercase:

```python
print("apple" < "banana")   # True
print("Zebra" < "apple")    # True  (Z is 90, a is 97)
print("apple" == "Apple")   # False
```

For case-insensitive comparison, normalise first:
`a.lower() == b.lower()`.

---

## `and`, `or`, `not`

```python
print(True and False)    # False — both must be true
print(True or False)     # True  — at least one must be true
print(not True)          # False — flips it
```

```python
if hay >= 10 and wood >= 5:
    print("can build")

if hay < 5 or wood < 5:
    print("running low")

if not ready:
    print("wait")
```

### Short-circuiting

`and` stops as soon as it sees a `False`; `or` stops as soon as it sees a
`True`. The rest is never evaluated. This is a feature you can rely on:

```python
if len(names) > 0 and names[0] == "alex":
    ...
```

If `names` is empty, the first half is `False`, so `names[0]` is never run and
you never get an `IndexError`. Ordering the checks correctly is a real
technique, not an accident.

### Precedence

`not` binds tightest, then `and`, then `or`. So
`a or b and c` means `a or (b and c)`. Bracket it if there's any doubt.

---

## Truthiness

Every value can be used where a boolean is expected. Python calls the empty
and zero-like things **falsy** and everything else **truthy**.

**Falsy:** `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `()`, `set()`

**Truthy:** everything else — including `"0"`, `"False"`, `[0]`, `-1`.

```python
names = []
if names:
    print("we have names")
else:
    print("empty")        # this runs
```

That is the idiomatic way to test for an empty list. `if len(names) > 0:`
works but reads worse.

The trap:

```python
answer = input("Continue? ")     # user types "no"
if answer:
    print("continuing")          # runs! "no" is a non-empty string
```

You wanted `if answer.lower() == "yes":`.

---

## `if` / `elif` / `else`

```python
score = 75

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")
```

Key points:

- The branches are checked **in order**, and **only the first match runs**.
  That's why `score >= 70` doesn't need to also say `and score < 80`.
- `elif` is short for "else if". You can have any number.
- `else` is optional, and takes no condition.
- Every branch needs its body indented. The colon is mandatory.

### Nesting vs. combining

```python
# nested — sometimes necessary, often noise
if logged_in:
    if is_admin:
        print("welcome, boss")

# flatter — usually better
if logged_in and is_admin:
    print("welcome, boss")
```

Deep nesting is the main thing that makes code hard to read. When you find
yourself four levels in, look for an early exit (Lesson 10) or a combined
condition.

### The conditional expression (ternary)

For picking between two values, there's a one-line form:

```python
status = "ready" if crops >= 10 else "growing"
```

Reads left to right: *this value, if the condition, otherwise that value.*
Use it for short choices; use a real `if` when the branches do work.

---

## `pass` — a placeholder

> **NEW — `pass`**
> Does nothing. It exists because Python requires an indented body, so you
> need something to write while a block is still empty.
> ```python
> if crops > 100:
>     pass      # TODO: handle overflow
> else:
>     harvest()
> ```
> **Use it when** you're sketching structure and haven't written a block yet,
> so the file still runs.
> **Watch out:** it's a placeholder, not a control statement — it does *not*
> skip to the next loop iteration (that's `continue`) and it does *not* exit
> anything. Leaving `pass` in finished code usually means a branch you forgot
> to fill in.

---

## `match` — multi-way branching (Python 3.10+)

Modern Python has a `switch`-like statement. You don't need it, but you'll see
it:

```python
command = input("> ")

match command:
    case "north":
        print("going north")
    case "south":
        print("going south")
    case "quit" | "exit":          # | means "or"
        print("bye")
    case _:                        # _ is the catch-all
        print("unknown command")
```

For simple value matching, a chain of `elif` is just as good. `match` earns
its keep for structural patterns, which is beyond this course.

---

## A worked example

```python
# Grade a harvest report.
crops = int(input("Crops harvested: "))
days = int(input("Days spent: "))

if days <= 0:
    print("Invalid: days must be positive")
else:
    rate = crops / days
    if rate >= 50:
        grade = "excellent"
    elif rate >= 20:
        grade = "good"
    elif rate >= 5:
        grade = "acceptable"
    else:
        grade = "poor"
    print(f"{rate:.1f} crops/day — {grade}")
```

Notice the validation happens first, and the rest is inside the `else` so the
division can never divide by zero. Guarding before computing is a habit worth
building now.

---

## Exercises

1. Ask for a number and print whether it is positive, negative, or zero.
2. Ask for a year and print whether it's a leap year. (Divisible by 4, except
   centuries, unless divisible by 400.)
3. Rewrite this without nesting:
   ```python
   if a > 0:
       if b > 0:
           print("both positive")
   ```
4. Predict each, then check: `bool([])`, `bool([[]])`, `bool("False")`,
   `bool(0.0)`, `bool(None)`.
5. Ask for a password and accept it only if it's at least 8 characters, has a
   digit, and has a letter. Report which rule failed.
6. Why does this crash, and how does short-circuiting fix it?
   ```python
   items = []
   if items[0] == "hay" and len(items) > 0:
       print("yes")
   ```
7. Write a one-line conditional expression that sets `label` to `"even"` or
   `"odd"` based on `n`.

---

## Solutions

**1.**
```python
n = float(input("Number: "))
if n > 0:
    print("positive")
elif n < 0:
    print("negative")
else:
    print("zero")
```

**2.**
```python
year = int(input("Year: "))
if year % 400 == 0:
    leap = True
elif year % 100 == 0:
    leap = False
elif year % 4 == 0:
    leap = True
else:
    leap = False
print(f"{year} is{'' if leap else ' not'} a leap year")
```
Order matters: the most specific rule (400) is checked first.

**3.**
```python
if a > 0 and b > 0:
    print("both positive")
```

**4.** `False`, `True` (a list containing one empty list is not itself empty),
`True` (non-empty string), `False`, `False`.

**5.**
```python
pw = input("Password: ")
has_digit = False
has_letter = False
for ch in pw:
    if ch.isdigit():
        has_digit = True
    if ch.isalpha():
        has_letter = True

if len(pw) < 8:
    print("Too short")
elif not has_digit:
    print("Needs a digit")
elif not has_letter:
    print("Needs a letter")
else:
    print("Accepted")
```

**6.** `items[0]` runs first and raises `IndexError` because the list is
empty. Swap the order — `if len(items) > 0 and items[0] == "hay":` — and `and`
short-circuits on the `False`, so the indexing never happens.

**7.** `label = "even" if n % 2 == 0 else "odd"`
