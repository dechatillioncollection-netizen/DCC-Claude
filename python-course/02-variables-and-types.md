# Lesson 02 — Variables and types

---

## Variables are labels

```python
hay = 10
```

That does not mean "hay equals 10" in a maths sense. It means: make the value
`10`, and stick the label `hay` on it. Later you can move the label:

```python
hay = 10
hay = hay + 5
print(hay)     # 15
```

The right-hand side is worked out **first**, then the label is reattached. So
`hay = hay + 5` means "compute 10 + 5, then point `hay` at the result".

### Naming rules

- Letters, digits, underscores. No spaces. Cannot start with a digit.
- Case matters: `hay` and `Hay` are two different variables.
- Convention: `lower_case_with_underscores` for variables and functions.
- Don't use Python's own words (`for`, `if`, `list`, `print`, `class`, …).
  Naming a variable `list` is legal and will ruin your afternoon.

Good names are the cheapest documentation there is. `n` is fine for a loop
counter; `d` for "the number of days until renewal" is not.

### Shorthand assignment

```python
hay = 10
hay += 5     # same as hay = hay + 5   -> 15
hay -= 3     # 12
hay *= 2     # 24
hay /= 4     # 6.0   (note: division always gives a float, see Lesson 04)
```

---

## The five types you need first

Python values have **types**. The type decides what you can do with the value.

| Type | Name | Example |
|---|---|---|
| Whole number | `int` | `10`, `-3`, `0` |
| Decimal number | `float` | `3.14`, `-0.5`, `2.0` |
| Text | `str` | `"wheat"`, `'a'`, `""` |
| True/false | `bool` | `True`, `False` |
| Nothing | `NoneType` | `None` |

> **NEW — `type(value)`**
> Tells you what type a value is. Mostly a learning and debugging tool.
> ```python
> print(type(10))       # <class 'int'>
> print(type(3.14))     # <class 'float'>
> print(type("dog"))    # <class 'str'>
> print(type(True))     # <class 'bool'>
> print(type(None))     # <class 'NoneType'>
> ```
> **Use it when** a `TypeError` has you confused and you want to know what a
> variable actually holds.
> **Watch out:** it belongs in debugging, not in finished logic. To test a
> type in real code use `isinstance()` (below), not `type(x) == int`.

### `int` — whole numbers

No size limit. Python handles enormous integers natively:

```python
print(2 ** 1000)    # a 302-digit number, printed in full
```

### `float` — numbers with a decimal point

```python
speed = 1.5
```

A float is stored as an approximation, which occasionally shows:

```python
print(0.1 + 0.2)    # 0.30000000000000004
```

That is not a Python bug, it is how binary fractions work in every language.
Lesson 04 covers what to do about it.

### `str` — text

```python
crop = "wheat"
crop = 'wheat'     # single quotes are identical
```

Quotes are how Python tells text from code. `wheat` is a variable name;
`"wheat"` is the word wheat. Full details in Lesson 03.

### `bool` — `True` / `False`

Capitalised. `true` is a `NameError`.

```python
ready = True
if ready:
    print("go")
```

### `None` — the absence of a value

`None` means "no value here". A function that doesn't return anything returns
`None`. It is not `0` and not `""` — it is *nothing*.

```python
result = print("dog")
print(result)      # None   <- print displays text but hands back nothing
```

---

## Converting between types

> **NEW — `int(value)`**
> Converts to a whole number. Truncates floats *toward zero* (it does not
> round). Errors if the text isn't a number.
> ```python
> print(int("42"))     # 42
> print(int(3.9))      # 3
> print(int(-3.9))     # -3
> print(int(True))     # 1
> ```
> **Use it when** you need to do maths on something that arrived as text —
> almost always right after `input()`.
> **Watch out:** it refuses decimal text. `int("3.5")` raises `ValueError`;
> you need `int(float("3.5"))`. And it chops rather than rounds, so
> `int(3.99)` is 3 — if you wanted 4, use `round()`.

> **NEW — `float(value)`**
> Converts to a decimal number.
> ```python
> print(float("3.5"))  # 3.5
> print(float(7))      # 7.0
> ```
> **Use it when** the value can have a decimal part — prices, measurements,
> averages.
> **Watch out:** floats are approximate, so never compare two of them with
> `==` and never use them for money (Lesson 04 explains why).

> **NEW — `str(value)`**
> Converts anything to its text form.
> ```python
> print(str(42))       # 42       (but it's now text, not a number)
> print(str(3.5))      # 3.5
> print(str(None))     # None
> ```
> **Use it when** you need to glue a number into text with `+`, or write it to
> a file.
> **Watch out:** once converted, maths stops working — `str(2) + str(2)` is
> `"22"`. For building messages, prefer an f-string (Lesson 03), which calls
> `str()` for you.

> **NEW — `bool(value)`**
> Converts to `True`/`False`. Zero, empty text, and empty collections are
> `False`; almost everything else is `True`. (More in Lesson 05.)
> ```python
> print(bool(0))       # False
> print(bool(5))       # True
> print(bool(""))      # False
> print(bool("no"))    # True   <- careful! any non-empty text is True
> ```
> **Use it when** you want to explicitly turn a value into `True`/`False`.
> **Watch out:** you rarely need to call it — `if x:` already does this
> conversion for you. And it will not read the *meaning* of text:
> `bool("False")` and `bool("no")` are both `True`, because all it checks is
> whether the string is empty.

### Why you need this

Text that looks like a number is not a number:

```python
print("2" + "2")        # 22    <- joins the text
print(2 + 2)            # 4     <- adds the numbers
print(int("2") + 2)     # 4
print("2" + 2)          # TypeError: can only concatenate str to str
```

That `TypeError` is one of the most common beginner errors, and it always
means the same thing: you mixed text and numbers. The fix is `int()`,
`float()`, or `str()` on one side.

---

## Getting input from the user

The game had no way to ask you anything. Real Python does.

> **NEW — `input(prompt)`**
> Prints the prompt, waits for the user to type a line and press Enter, and
> returns what they typed **as a string** — always, even if they typed digits.
> ```python
> name = input("What's your name? ")
> print("Hello", name)
> ```
> **Use it when** a script needs something from the person running it.
> **Watch out:** three things. It always returns a *string*, so wrap it in
> `int()`/`float()` for numbers. It halts the program until Enter is pressed,
> so never put one inside a long loop you want to run unattended. And users
> type stray spaces, so `.strip()` the result before comparing it to
> anything.

The "always a string" part trips everyone up:

```python
age = input("Age? ")     # user types 30
print(age + 1)           # TypeError!  age is the text "30"

age = int(input("Age? "))
print(age + 1)           # 31
```

A complete tiny program:

```python
# greet.py
name = input("Name: ")
age = int(input("Age: "))
print("Hi", name + ",", "next year you'll be", age + 1)
```

```
Name: Alex
Age: 30
Hi Alex, next year you'll be 31
```

---

## Several variables at once

```python
x, y = 3, 4
print(x)    # 3
print(y)    # 4
```

And the classic swap, which in most languages needs a temporary variable:

```python
a, b = 1, 2
a, b = b, a
print(a, b)    # 2 1
```

This is called **unpacking** and Lesson 08 goes into it properly.

---

## Checking what you have

> **NEW — `isinstance(value, type)`**
> Returns `True` if the value is of that type. Preferred over comparing
> `type(x) == int`.
> ```python
> print(isinstance(5, int))       # True
> print(isinstance(5, str))       # False
> print(isinstance(5, (int, float)))   # True — accepts a tuple of types
> ```
> **Use it when** a function can accept more than one kind of value and has to
> behave differently for each.
> **Watch out:** `isinstance(True, int)` is `True`, because `bool` is
> technically a kind of `int` in Python. If you're checking for a number and
> want to exclude booleans, test for `bool` first.

---

## Exercises

1. Set a variable `crops` to 12, then add 8 using `+=`, then print it.
2. Predict the output, then check:
   ```python
   print(type(5 / 1))
   ```
3. Write a program that asks for two numbers and prints their sum. Make sure
   it prints `7` and not `34` when given 3 and 4.
4. What does `int("3.5")` do? Try it. Why? What works instead?
5. Ask the user for their name and a number `n`, then print their name and
   their age in `n` years. Handle the conversions correctly.
6. Predict each: `bool(0)`, `bool("0")`, `bool([])`, `bool(" ")`.

---

## Solutions

**1.**
```python
crops = 12
crops += 8
print(crops)     # 20
```

**2.** `<class 'float'>`. The `/` operator *always* produces a float, even
when it divides evenly. `5 / 1` is `5.0`.

**3.**
```python
a = int(input("First number: "))
b = int(input("Second number: "))
print(a + b)
```
Without the `int()` calls you'd get `"3" + "4"` = `"34"`.

**4.** It raises `ValueError: invalid literal for int() with base 10: '3.5'`.
`int()` will not parse a decimal point out of text. Use `float("3.5")`, or
`int(float("3.5"))` if you want the whole part (3).

**5.**
```python
name = input("Name: ")
n = int(input("Years from now: "))
age = int(input("Current age: "))
print(name, "will be", age + n)
```

**6.** `False`, `True` (non-empty text), `False` (empty list), `True` (a space
is a character, so the string isn't empty). The `"0"` and `" "` cases catch
people out constantly.
