# Lesson 12 — Errors and exceptions

In the game, broken code just stopped. Out here, Python tells you exactly
what went wrong and where — and lets you decide what to do about it. Learning
to read an error message properly is worth more than any single piece of
syntax.

---

## Reading a traceback

Run this:

```python
def average(numbers):
    return sum(numbers) / len(numbers)

print(average([]))
```

```
Traceback (most recent call last):
  File "test.py", line 4, in <module>
    print(average([]))
          ^^^^^^^^^^^
  File "test.py", line 2, in average
    return sum(numbers) / len(numbers)
           ~~~~~~~~~~~~~^~~~~~~~~~~~~~
ZeroDivisionError: division by zero
```

Three things to know:

1. **Read it from the bottom.** The last line is what actually went wrong:
   `ZeroDivisionError: division by zero`. Everything above is how you got
   there.
2. **The bottom-most `File` line is where it broke** — line 2, inside
   `average`. The lines above are the chain of calls that led there, oldest
   first.
3. **The `^^^^` markers** point at the exact expression that failed.

Beginners see a wall of text and panic. It's actually the most helpful output
in the language: it tells you the file, the line, the expression, and the
reason.

---

## The errors you'll actually hit

| Error | Means | Typical cause |
|---|---|---|
| `SyntaxError` | Python can't parse the file | Missing `:`, unclosed bracket, `=` instead of `==` |
| `IndentationError` | Blocks don't line up | Mixed tabs and spaces |
| `NameError` | No such variable | Typo, or used before assigning |
| `TypeError` | Wrong type of thing | `"2" + 2`, calling a non-function |
| `ValueError` | Right type, bad value | `int("abc")` |
| `IndexError` | Index past the end | `lst[5]` on a 3-item list |
| `KeyError` | No such dictionary key | `d["missing"]` |
| `AttributeError` | No such method/attribute | `"text".push()`, or calling a list method on `None` |
| `ZeroDivisionError` | Divided by zero | An empty collection's length |
| `FileNotFoundError` | No such file | Wrong path, wrong working directory |
| `ImportError` / `ModuleNotFoundError` | Can't find a module | Not installed, or typo |

A few worth expanding:

**`SyntaxError` points at the line *after* the mistake** surprisingly often —
an unclosed bracket isn't a problem until Python reaches something that can't
follow it. If line 12 looks fine, check line 11.

**`AttributeError: 'NoneType' object has no attribute 'append'`** almost
always means you wrote `x = something.sort()` or `x = something.append(y)` and
got `None` back. The Lesson 07 trap, showing up later.

---

## `try` / `except`

> **NEW — `try` / `except`**
> Runs risky code; if it raises an exception, run the handler instead of
> crashing.
> ```python
> try:
>     n = int(input("Number: "))
>     print(n * 2)
> except ValueError:
>     print("That wasn't a number.")
> ```
> **Use it when** a failure is *expected and recoverable* — bad user input, a
> missing file, a network hiccup.
> **Watch out:** always name the exception type you expect. A bare `except:`
> swallows everything, including your own typos and `Ctrl+C`, and turns a
> clear crash into a silent mystery. Keep the `try` block as small as
> possible; wrapping fifty lines means you can't tell which one failed.

### Catching several types

```python
try:
    value = int(data[0])
except (ValueError, IndexError):
    value = 0
```

Or handle them differently:

```python
try:
    with open("scores.txt") as f:
        score = int(f.read())
except FileNotFoundError:
    print("No scores file yet — starting at 0")
    score = 0
except ValueError:
    print("Scores file is corrupt — starting at 0")
    score = 0
```

### Seeing the error object

> **NEW — `except X as e`**
> Binds the exception to a variable so you can inspect or log it.
> ```python
> try:
>     int("abc")
> except ValueError as e:
>     print(f"Failed: {e}")     # Failed: invalid literal for int() ...
> ```
> **Use it when** you want the detail in your message or log.
> **Watch out:** `e` only exists inside the `except` block; using it afterwards
> is a `NameError`.

### `else` and `finally`

```python
try:
    f = open("data.txt")
except FileNotFoundError:
    print("missing")
else:
    print("opened fine")      # runs only if NO exception happened
    f.close()
finally:
    print("done")             # runs ALWAYS, error or not
```

`finally` is for cleanup that must happen either way — closing files, releasing
locks. In practice `with` (Lesson 13) handles most of that for you.

---

## Raising your own

> **NEW — `raise`**
> Triggers an exception deliberately.
> ```python
> def set_age(age):
>     if age < 0:
>         raise ValueError(f"age must be positive, got {age}")
>     return age
> ```
> **Use it when** your function is given something it cannot sensibly work
> with. Failing loudly at the source beats returning `None` and crashing
> confusingly three functions later.
> **Watch out:** raise the *specific* type (`ValueError` for a bad value,
> `TypeError` for a wrong type), not bare `Exception`. Include the offending
> value in the message — "invalid input" helps nobody. And like `return`,
> `raise` exits the function immediately; code after it never runs.

Re-raising after logging:

```python
try:
    risky()
except ValueError as e:
    print(f"logging: {e}")
    raise                # bare raise re-throws the same exception
```

### Your own exception types

```python
class InsufficientFunds(Exception):
    """Raised when an account can't cover a withdrawal."""

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"need {amount}, have {balance}")
    return balance - amount

try:
    withdraw(50, 100)
except InsufficientFunds as e:
    print(e)      # need 100, have 50
```

Classes are Lesson 16; that three-line definition is all a custom exception
needs.

---

## `assert` — checking your assumptions

> **NEW — `assert condition, message`**
> Raises `AssertionError` if the condition is false.
> ```python
> def average(numbers):
>     assert len(numbers) > 0, "average() needs at least one number"
>     return sum(numbers) / len(numbers)
> ```
> **Use it when** stating something you believe is always true — a sanity
> check for *your own* bugs, and the backbone of simple tests (Lesson 19).
> **Watch out:** assertions are **stripped out** when Python runs with `-O`,
> so never use them to validate user input or enforce security. Those need a
> real `if` and `raise`.

---

## Ask forgiveness, not permission

Python culture prefers trying and handling failure over checking first:

```python
# LBYL — "look before you leap"
if "gold" in inventory:
    value = inventory["gold"]
else:
    value = 0

# EAFP — "easier to ask forgiveness than permission"
try:
    value = inventory["gold"]
except KeyError:
    value = 0
```

Both are fine. EAFP wins when the check and the use could disagree — a file
that exists when you check but is deleted a millisecond later. For
dictionaries specifically, `.get()` beats both.

---

## Validating input properly

The pattern you'll reuse forever:

```python
def ask_int(prompt, low=None, high=None):
    """Keep asking until the user gives a whole number in range."""
    while True:
        raw = input(prompt).strip()
        try:
            value = int(raw)
        except ValueError:
            print("Please enter a whole number.")
            continue
        if low is not None and value < low:
            print(f"Must be at least {low}.")
            continue
        if high is not None and value > high:
            print(f"Must be at most {high}.")
            continue
        return value

age = ask_int("Age: ", low=0, high=130)
print(f"You are {age}")
```

`while True` + `try` + `continue` + `return`. That function is worth keeping.

---

## Exercises

1. Write code that asks for a number and prints its square, printing a polite
   message instead of crashing if the input isn't a number.
2. Write `safe_divide(a, b)` that returns `None` instead of raising when `b`
   is zero.
3. What error does each of these raise? Predict, then check.
   ```python
   [1, 2, 3][5]
   {"a": 1}["b"]
   int("hello")
   "2" + 2
   undefined_name
   None.append(1)
   ```
4. Write a function that reads an integer from a file, returning `0` if the
   file is missing or its contents aren't a number.
5. Write `withdraw(balance, amount)` that raises `ValueError` for a negative
   amount and a custom `InsufficientFunds` when the amount exceeds the
   balance.
6. Explain what's wrong with:
   ```python
   try:
       do_everything()
   except:
       pass
   ```
7. Use `assert` to check that a function's output is what you expect, and
   watch it fail when you break the function.

---

## Solutions

**1.**
```python
try:
    n = float(input("Number: "))
    print(n ** 2)
except ValueError:
    print("That wasn't a number.")
```

**2.**
```python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
```

**3.** `IndexError`, `KeyError`, `ValueError`, `TypeError`, `NameError`,
`AttributeError`.

**4.**
```python
def read_score(path):
    try:
        with open(path) as f:
            return int(f.read().strip())
    except (FileNotFoundError, ValueError):
        return 0
```

**5.**
```python
class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount < 0:
        raise ValueError(f"amount must be positive, got {amount}")
    if amount > balance:
        raise InsufficientFunds(f"need {amount}, have {balance}")
    return balance - amount
```

**6.** The bare `except` catches *everything* — including typos
(`NameError`), your own bugs, and `KeyboardInterrupt` when you press Ctrl+C.
Combined with `pass`, the error vanishes without a trace, so the program
carries on in a broken state and you get no clue why. Catch specific types,
and at minimum print the exception.

**7.**
```python
def double(n):
    return n * 2

assert double(5) == 10
assert double(0) == 0
assert double(-3) == -6
print("all checks passed")
```
Change `n * 2` to `n * 3` and the first assertion fails with
`AssertionError`, naming the line. That's a test, in miniature.
