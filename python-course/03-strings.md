# Lesson 03 — Strings (text)

The game barely had text. Real programs are drowning in it: names, file
contents, user input, error messages, web pages. This is a big lesson because
strings are a big deal.

---

## Making a string

```python
a = "wheat"
b = 'wheat'          # identical
c = "it's fine"      # single quote inside double quotes — no problem
d = 'say "hi"'       # double inside single — also fine
e = "she said \"hi\""   # or escape it with a backslash
```

### Multi-line strings

Triple quotes keep line breaks:

```python
message = """Dear farmer,

The drone has escaped.
"""
print(message)
```

### Escape characters

Inside a string, `\` starts a special code:

| Code | Means |
|---|---|
| `\n` | newline |
| `\t` | tab |
| `\\` | a literal backslash |
| `\"` | a literal double quote |

```python
print("line one\nline two")
# line one
# line two
```

On Windows paths this bites: `"C:\new\table"` contains a newline and a tab.
Use a **raw string**, where `\` means nothing special:

```python
print(r"C:\new\table")     # C:\new\table
```

---

## Joining and repeating

```python
first = "wheat"
second = "field"
print(first + " " + second)     # wheat field
print("ha" * 3)                 # hahaha
```

`+` only joins string to string. `"age: " + 30` is a `TypeError` — you need
`"age: " + str(30)`, or better, the f-string below.

---

## f-strings — the way to build text

Put an `f` before the quote, and anything in `{ }` is evaluated and inserted.

> **NEW — f-strings**
> A string literal prefixed with `f` whose `{...}` sections are replaced by
> the value of the expression inside.
> ```python
> name = "Alex"
> crops = 12
> print(f"{name} harvested {crops} crops")   # Alex harvested 12 crops
> print(f"{crops} * 2 = {crops * 2}")        # 12 * 2 = 24
> ```
> **Use it when** you're building any message out of variables — which is
> most of the time.
> **Watch out:** the `f` is mandatory. `print("{name}")` without it prints the
> literal text `{name}`, which is the single most common f-string mistake. To
> print a real brace, double it: `f"{{}}"` → `{}`.

This is how modern Python builds text. Use it instead of `+` almost always.

### Formatting inside an f-string

After a `:` you can control how the value is displayed:

```python
pi = 3.14159265
print(f"{pi:.2f}")        # 3.14      — 2 decimal places
print(f"{pi:10.3f}")      # <blank>3.142   — width 10, right-aligned
print(f"{42:05}")         # 00042     — pad with zeros to width 5
print(f"{1234567:,}")     # 1,234,567 — thousands separators
print(f"{0.85:.1%}")      # 85.0%     — as a percentage
print(f"{255:x}")         # ff        — hexadecimal
```

Alignment: `<` left, `>` right, `^` centre.

```python
for name in ["hay", "wood", "carrot"]:
    print(f"{name:<10}|")
# hay       |
# wood      |
# carrot    |
```

That is how you print a tidy table without any library.

### The debugging `=` trick

```python
crops = 12
print(f"{crops=}")     # crops=12
```

Prints the expression *and* its value. Enormously handy when hunting bugs.

---

## Strings are sequences

A string is an ordered sequence of characters, and you index it with `[ ]`
starting at **0**:

```python
word = "wheat"
print(word[0])    # w
print(word[1])    # h
print(word[4])    # t
print(word[5])    # IndexError: string index out of range
```

Negative indices count from the end:

```python
print(word[-1])   # t   (last)
print(word[-2])   # a   (second last)
```

### Slicing — `[start:stop:step]`

`start` is included, `stop` is **excluded**.

```python
word = "wheat"
print(word[0:3])    # whe
print(word[:3])     # whe    (start defaults to 0)
print(word[2:])     # eat    (stop defaults to the end)
print(word[:])      # wheat  (a full copy)
print(word[::2])    # wet    (every 2nd character)
print(word[::-1])   # taehw  (reversed — a classic trick)
```

Slicing never errors on out-of-range values; it just gives you what exists:

```python
print(word[0:99])   # wheat
```

### Length

> **NEW — `len(thing)`**
> Returns how many items are in a string, list, dict, or any collection.
> ```python
> print(len("wheat"))         # 5
> print(len([1, 2, 3]))       # 3
> print(len(""))              # 0
> ```
> **Use it when** you need a size — loop bounds, validation, checking a list
> isn't empty.
> **Watch out:** the last valid index is `len(x) - 1`, not `len(x)` —
> `word[len(word)]` is always an `IndexError`. It also doesn't work on
> numbers: `len(42)` is a `TypeError`.

---

## Strings cannot be changed

```python
word = "wheat"
word[0] = "c"      # TypeError: 'str' object does not support item assignment
```

Strings are **immutable**. Every "modification" actually makes a new string:

```python
word = "c" + word[1:]
print(word)        # cheat
```

This matters later: string methods never change the original, they return a
new string. If you don't catch the result, nothing happened.

```python
name = "alex"
name.upper()          # computes "ALEX", throws it away
print(name)           # alex

name = name.upper()   # this is what you meant
print(name)           # ALEX
```

---

## String methods

A **method** is a function that belongs to a value, called with a dot:
`value.method(args)`. Here are the ones you will actually use.

### Case

> **NEW — `.upper()` / `.lower()`**
> Return a new string in upper or lower case.
> ```python
> print("Wheat".upper())    # WHEAT
> print("Wheat".lower())    # wheat
> ```
> **Use it when** comparing text the user typed — `answer.lower() == "yes"`
> accepts `YES`, `Yes` and `yes` in one line.
> **Watch out:** like every string method, it returns a new string and leaves
> the original untouched. You must assign the result: `name = name.upper()`.

> **NEW — `.title()` / `.capitalize()`**
> Title Case Each Word / Capitalize only the first letter.
> ```python
> print("wheat field".title())        # Wheat Field
> print("wheat field".capitalize())   # Wheat field
> ```
> **Use it when** tidying up names for display.
> **Watch out:** `.title()` is naive about apostrophes and prefixes —
> `"o'brien".title()` gives `O'Brien` but `"mcdonald".title()` gives
> `Mcdonald`. Don't use it on real people's names without checking.

### Trimming

> **NEW — `.strip()` / `.lstrip()` / `.rstrip()`**
> Remove whitespace from both ends / the left / the right. With an argument,
> remove those characters instead.
> ```python
> print("  hay  ".strip())        # 'hay'
> print("xxhayxx".strip("x"))     # 'hay'
> ```
> **Use it when** handling anything a human typed or anything read from a file
> — file lines arrive with a `\n` on the end, and `.strip()` removes it.
> **Watch out:** with an argument it strips *any of those characters*, not
> that exact word. `"README".strip("RE")` gives `"ADM"`, not `"ADME"` —
> it keeps eating from both ends while it finds an `R` or an `E`.

### Searching

> **NEW — `in`**
> Not a method — an operator. `True` if one string appears inside another.
> ```python
> print("hea" in "wheat")     # True
> print("z" in "wheat")       # False
> print("z" not in "wheat")   # True
> ```
> **Use it when** you only care *whether* something appears, not where. It
> also works on lists and dictionaries (Lessons 07 and 09).
> **Watch out:** it's case-sensitive, so `"Hay" in "hayfield"` is `False`.
> Lower-case both sides first if that matters.

> **NEW — `.startswith(s)` / `.endswith(s)`**
> `True` if the string starts/ends with the given text.
> ```python
> print("wheat.png".endswith(".png"))    # True
> ```
> **Use it when** checking file extensions, prefixes, or command words.
> **Watch out:** these are clearer than slicing (`name[-4:] == ".png"`) and
> can't go wrong on short strings. They accept a tuple to check several at
> once: `name.endswith((".png", ".jpg"))`.

> **NEW — `.find(s)` / `.index(s)`**
> Return the position of the first occurrence. `.find` returns `-1` if absent;
> `.index` raises an error.
> ```python
> print("wheat".find("ea"))    # 2
> print("wheat".find("z"))     # -1
> ```
> **Use it when** you need the *position* of something, usually to slice
> around it.
> **Watch out:** `-1` is a real index in Python (the last character), so
> `word[word.find("z")]` silently gives you the wrong character instead of
> failing. Always test `if pos != -1:` before using the result.

> **NEW — `.count(s)`**
> How many non-overlapping times `s` appears.
> ```python
> print("banana".count("a"))   # 3
> ```
> **Use it when** tallying occurrences — letters in a word, commas in a line.
> **Watch out:** overlaps don't count. `"aaaa".count("aa")` is 2, not 3,
> because it carries on from the end of each match.

### Changing

> **NEW — `.replace(old, new)`**
> Returns a new string with every `old` swapped for `new`.
> ```python
> print("wheat field".replace(" ", "_"))   # wheat_field
> print("aaa".replace("a", "b", 2))        # bba  — optional count limit
> ```
> **Use it when** cleaning data — stripping currency symbols, swapping
> separators, deleting characters (replace with `""`).
> **Watch out:** it replaces *every* occurrence unless you pass a count, and
> it returns a new string — `text.replace(...)` on its own line does nothing.
> Chaining several replaces can undo itself: replacing `a`→`b` then `b`→`c`
> turns the original `a`s into `c`s too.

### Splitting and joining — the two most useful of all

> **NEW — `.split(sep)`**
> Cuts a string into a **list** of pieces. With no argument it splits on any
> run of whitespace and discards empties.
> ```python
> print("hay wood carrot".split())          # ['hay', 'wood', 'carrot']
> print("a,b,c".split(","))                 # ['a', 'b', 'c']
> print("a,b,c".split(",", 1))              # ['a', 'b,c']  — max 1 split
> ```
> **Use it when** breaking up a line of data — words in a sentence, fields in
> a record, a path into folders.
> **Watch out:** bare `.split()` and `.split(" ")` behave differently.
> `"a  b".split()` gives `['a', 'b']`; `"a  b".split(" ")` gives
> `['a', '', 'b']` — the double space produces an empty piece. Use the bare
> form for human text. Also, the pieces are always strings, so convert any
> numbers with `int()`.

> **NEW — `.splitlines()`**
> Splits on line breaks.
> ```python
> print("one\ntwo".splitlines())    # ['one', 'two']
> ```
> **Use it when** you've read a whole file into one string and want its lines.
> **Watch out:** it drops the line endings, unlike `.split("\n")`, which
> leaves you with a stray empty item if the text ends in a newline (files
> usually do).

> **NEW — `sep.join(list_of_strings)`**
> The opposite of split: glues a list of strings together with `sep` between
> them. Note the odd shape — the separator is the thing you call it on.
> ```python
> print(", ".join(["hay", "wood"]))    # hay, wood
> print("".join(["a", "b", "c"]))      # abc
> print("\n".join(["one", "two"]))     # one<newline>two
> ```
> **Use it when** turning a list back into displayable text, or building a
> file's contents before writing it.
> **Watch out:** every item must already be a string. `", ".join([1, 2])` is a
> `TypeError` — use `", ".join(str(x) for x in [1, 2])` (Lesson 11). And the
> separator goes *between* items only, so joining one item adds nothing and
> joining zero items gives `""`. Prefer this over building text with `+=` in
> a loop; on long lists `join` is dramatically faster.

### Checking content

> **NEW — `.isdigit()` / `.isalpha()` / `.isspace()`**
> `True` if every character is a digit / a letter / whitespace (and the string
> isn't empty).
> ```python
> print("123".isdigit())     # True
> print("12a".isdigit())     # False
> ```
> **Use it when** validating input *before* calling `int()`, so you can print
> a friendly message instead of crashing.
> **Watch out:** `"-5".isdigit()` and `"3.5".isdigit()` are both `False` — the
> minus sign and the dot aren't digits. And `"".isdigit()` is `False`, which
> is usually what you want but is worth knowing.

---

## A worked example

```python
# Parse a line of inventory data into a tidy report.
line = "  hay:12, wood:40 , carrot:7  "

items = line.strip().split(",")          # ['hay:12', ' wood:40 ', ' carrot:7']

total = 0
for item in items:
    name, amount = item.strip().split(":")
    amount = int(amount)
    total += amount
    print(f"{name:<8}{amount:>5}")

print(f"{'TOTAL':<8}{total:>5}")
```

```
hay        12
wood       40
carrot      7
TOTAL      59
```

Read that until every line makes sense. It uses `.strip()`, `.split()`,
unpacking, `int()`, `+=`, and f-string alignment — a realistic mix.

---

## Exercises

1. Ask for a word and print it reversed.
2. Ask for a full name and print the initials, e.g. `Alex de Vries` → `AdV`.
3. Print a right-aligned column of the numbers 1, 10, 100, 1000 in width 6.
4. Given `path = "sprites/units/archer.png"`, extract just `archer` using
   split and slicing.
5. Ask for a sentence and report how many words it has, and how many of them
   are longer than 4 letters.
6. Write a program that asks for a temperature in Celsius and prints it in
   Fahrenheit to one decimal place. (`F = C * 9/5 + 32`)
7. Why does this print nothing useful, and how do you fix it?
   ```python
   s = "  hay  "
   s.strip()
   print(f"[{s}]")
   ```

---

## Solutions

**1.**
```python
word = input("Word: ")
print(word[::-1])
```

**2.**
```python
name = input("Full name: ")
initials = ""
for part in name.split():
    initials += part[0]
print(initials)
```

**3.**
```python
for n in [1, 10, 100, 1000]:
    print(f"{n:>6}")
```

**4.**
```python
path = "sprites/units/archer.png"
filename = path.split("/")[-1]     # 'archer.png'
print(filename[:-4])               # 'archer'
# or: print(filename.split(".")[0])
```

**5.**
```python
sentence = input("Sentence: ")
words = sentence.split()
long_words = 0
for w in words:
    if len(w) > 4:
        long_words += 1
print(f"{len(words)} words, {long_words} longer than 4 letters")
```

**6.**
```python
c = float(input("Celsius: "))
print(f"{c}C = {c * 9 / 5 + 32:.1f}F")
```

**7.** `.strip()` returns a new string and leaves `s` alone — the result is
discarded. Fix: `s = s.strip()`. This is the immutability rule biting.
