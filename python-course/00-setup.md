# Lesson 00 — Getting Python running

In the game, your code ran because the game ran it. Out here you need to
supply the thing that runs it. That thing is called **the Python
interpreter**, and it is a program you install.

---

## 1. Install Python

Go to <https://www.python.org/downloads/> and get the latest version (3.12 or
newer is ideal; anything 3.10+ is fine for this course).

**On Windows**, during the installer there is a checkbox at the bottom:

> ☑ Add python.exe to PATH

**Tick it.** If you do not, your computer will not know what the word
`python` means later. If you already installed without it, just run the
installer again and choose "Modify".

**On macOS**, the installer from python.org is fine. (macOS ships an old
Python that you should ignore.)

**On Linux**, you almost certainly already have it: `python3 --version`.

### Check it worked

Open a terminal — Command Prompt or PowerShell on Windows, Terminal on
macOS/Linux — and type:

```
python --version
```

You want to see something like `Python 3.12.4`. If Windows says "not
recognised", the PATH box was not ticked. If macOS/Linux says "command not
found", try `python3 --version` instead.

> **Note on `python` vs `python3`**
> On macOS and Linux the command is usually `python3`. On Windows it is
> usually `python`. Everywhere in this course where you see `python`, use
> whichever one works on your machine. They are the same program.

---

## 2. Get an editor

You could write Python in Notepad, but don't. Install **Visual Studio Code**
(<https://code.visualstudio.com/>), then install the extension called
**Python** by Microsoft from the Extensions panel (the icon that looks like
four squares in the sidebar).

That gives you syntax colouring, error underlines, and a Run button.

---

## 3. The two ways to run Python

### Way one: the REPL (a scratchpad)

Type `python` on its own in a terminal. You get:

```
Python 3.12.4 (main, ...)
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Those `>>>` are Python waiting for a line. Type an expression and it answers
immediately:

```python
>>> 2 + 2
4
>>> "dog"
'dog'
```

This is called the **REPL** (Read–Eval–Print Loop). It is the single most
useful tool you have while learning: whenever you are unsure what something
does, go here and try it. Nothing you do can break anything.

Type `exit()` or press `Ctrl+D` (`Ctrl+Z` then Enter on Windows) to leave.

> **NEW — `exit()`**
> Quits the REPL.
> ```python
> >>> exit()
> ```
> **Use it when** you're done in the interactive shell.
> **Watch out:** don't put it in a `.py` file to end a program early — a file
> ends on its own when it runs out of lines. (If you genuinely need to stop a
> script mid-way, that's `sys.exit()`, Lesson 15.)

### Way two: a `.py` file (a real program)

Make a folder somewhere, e.g. `Documents/python`. Inside it, create a file
called `hello.py` containing exactly one line:

```python
print("dog")
```

Then in the terminal, from that folder:

```
python hello.py
```

Output:

```
dog
```

That is your first Python program. It is a file of instructions, run top to
bottom, exactly like your farm scripts were.

> **NEW — `print(value, ...)`**
> Writes its arguments to the screen, separated by spaces, and moves to the
> next line. Takes any number of arguments, of any type.
> ```python
> print("dog")           # dog
> print("dog", "cat")    # dog cat
> print(7)               # 7
> print()                # (a blank line)
> ```
> **Use it when** you want to show something to the user, or to check what a
> variable holds while you're debugging.
> **Watch out:** `print` *displays* a value, it doesn't *hand it back*.
> `x = print(5)` leaves `x` as `None`. And once you learn functions
> (Lesson 10), remember a `print` written after a `return` never runs — the
> `return` ends the function on the spot.
>
> You met `print` in the game, but there it wrote to the game's log panel.
> Here it writes to your terminal, which is the main way a program talks to
> you until you build something fancier.

**The difference between the two ways matters.** In the REPL, an expression
on its own prints its value automatically. In a file, it does not:

```python
# in the REPL
>>> 2 + 2
4

# in a file — this runs, computes 4, and silently throws it away
2 + 2

# in a file — this shows you the 4
print(2 + 2)
```

Beginners lose hours to this. In a file, if you want to see it, `print` it.

---

## 4. Comments

Anything after a `#` on a line is ignored by Python. It is a note for humans.

```python
# This whole line is a note.
print("dog")   # This part is a note too.
```

Use them to explain *why*, not *what*. `x = x + 1  # add one to x` is
useless. `x = x + 1  # skip the header row` is worth writing.

---

## 5. Whitespace is syntax

You already know this from the game, but it is worth naming. Python has no
`{ }` braces. Indentation — the spaces at the start of a line — is how Python
knows what is inside what.

```python
if True:
    print("inside the if")
    print("also inside the if")
print("outside the if")
```

The rule: **4 spaces per level**, and be consistent. VS Code will do this for
you when you press Tab. Mixing tabs and spaces in one file causes an error
called `IndentationError`, which is Python's way of saying "I cannot tell
which block this line belongs to".

---

## Exercises

1. Get `python --version` to print a version number in your terminal.
2. In the REPL, work out what `17 * 23` is without using a calculator app.
3. Create `hello.py` that prints your name, then on a second line prints your
   favourite number.
4. Add a comment to `hello.py` explaining what the file is for.
5. Predict what this file prints, then run it and check:
   ```python
   print("a")
   # print("b")
   print("c")
   ```

---

## Solutions

**2.** `391`.

**3.**
```python
# hello.py — my first Python program
print("Alex")
print(7)
```

**5.** It prints `a` then `c`. The middle line is a comment, so it never runs.
