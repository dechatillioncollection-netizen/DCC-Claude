# Lesson 15 — A tour of the standard library

Python ships with a large collection of modules — "batteries included". You
don't need to memorise them; you need to know roughly what exists so you
recognise when a problem is already solved.

This is a tour, not a reference. Skim it, then come back when you hit a
problem it mentions.

---

## `collections` — better containers

### `Counter`

> **NEW — `Counter(iterable)`**
> A dictionary that counts things for you.
> ```python
> from collections import Counter
>
> words = "the quick the lazy the end".split()
> counts = Counter(words)
> print(counts["the"])            # 3
> print(counts["missing"])        # 0  — no KeyError
> print(counts.most_common(2))    # [('the', 3), ('quick', 1)]
> ```
> **Use it when** tallying anything — word frequencies, votes, item counts.
> It replaces the `d[x] = d.get(x, 0) + 1` idiom entirely.
> **Watch out:** missing keys return `0` instead of raising, which is usually
> a feature but hides typos. `most_common()` with no argument returns
> everything, sorted.

### `defaultdict`

> **NEW — `defaultdict(factory)`**
> A dictionary that creates a default value automatically for missing keys.
> ```python
> from collections import defaultdict
>
> groups = defaultdict(list)
> for word in ["apple", "avocado", "banana"]:
>     groups[word[0]].append(word)
>
> print(dict(groups))     # {'a': ['apple', 'avocado'], 'b': ['banana']}
> ```
> **Use it when** grouping items into lists or sets under keys.
> **Watch out:** you pass the *function*, not a value — `defaultdict(list)`,
> not `defaultdict([])`. Merely *reading* a missing key creates it, so
> `if x in d` still works but `d[x]` inside an `if` silently grows the dict.

### `deque`

> **NEW — `deque(iterable)`**
> A list-like container that's fast at *both* ends.
> ```python
> from collections import deque
>
> queue = deque([1, 2, 3])
> queue.append(4)          # add right
> queue.appendleft(0)      # add left — fast, unlike list.insert(0, x)
> print(queue.popleft())   # 0
> ```
> **Use it when** implementing a queue, or a fixed-length history
> (`deque(maxlen=10)` discards from the other end automatically).
> **Watch out:** indexing in the middle is slow. If you need random access,
> use a list.

---

## `datetime` — dates and times

```python
from datetime import datetime, date, timedelta

now = datetime.now()
print(now)                              # 2026-07-29 14:32:07.123456
print(now.year, now.month, now.day)

today = date.today()
print(today)                            # 2026-07-29

print(now.strftime("%Y-%m-%d %H:%M"))   # 2026-07-29 14:32

parsed = datetime.strptime("2026-01-15", "%Y-%m-%d")

tomorrow = today + timedelta(days=1)
gap = date(2026, 12, 25) - today
print(gap.days)                         # days until Christmas
```

> **NEW — `.strftime(format)` / `.strptime(text, format)`**
> Format a date as text / parse text into a date. The `f` is for *format*, the
> `p` is for *parse*.
> ```python
> print(datetime.now().strftime("%d/%m/%Y"))    # 29/07/2026
> ```
> **Use it when** displaying dates to people or reading dates from files.
> **Watch out:** the codes are cryptic — `%Y` is a 4-digit year, `%y` is 2;
> `%M` is minutes, `%m` is months. Getting them the wrong way round is the
> classic bug. `strptime` raises `ValueError` if the text doesn't match the
> format exactly.

Common codes: `%Y` year, `%m` month, `%d` day, `%H` hour (24h), `%M` minute,
`%S` second, `%A` weekday name, `%B` month name.

Subtracting two dates gives a `timedelta`, which has `.days` and
`.total_seconds()`.

---

## `time` — timing and pausing

```python
import time

start = time.perf_counter()
# ... do work ...
print(f"took {time.perf_counter() - start:.3f}s")

time.sleep(2)          # pause for 2 seconds
```

> **NEW — `time.sleep(seconds)`**
> Pauses the program.
> ```python
> for i in range(3, 0, -1):
>     print(i)
>     time.sleep(1)
> print("go!")
> ```
> **Use it when** pacing output, or waiting between retries.
> **Watch out:** it blocks *everything* — nothing else in your program runs,
> including responding to input. Accepts fractions (`time.sleep(0.1)`).
> Use `time.perf_counter()` for measuring durations, not `time.time()`, which
> can jump if the system clock changes.

---

## `os` and `sys` — the world outside

```python
import os, sys

print(sys.argv)                  # command-line arguments; argv[0] is the script
print(sys.version)               # Python version
sys.exit(1)                      # quit with an error code

print(os.getcwd())               # current working directory
print(os.environ.get("HOME"))    # environment variables
os.makedirs("data/out", exist_ok=True)
```

> **NEW — `sys.argv`**
> A list of the words typed after `python` on the command line.
> ```python
> # greet.py
> import sys
> name = sys.argv[1] if len(sys.argv) > 1 else "world"
> print(f"hello {name}")
> ```
> ```
> python greet.py Alex      ->  hello Alex
> ```
> **Use it when** writing a script that takes an argument.
> **Watch out:** `argv[0]` is the script name, so real arguments start at
> index 1 — and reading `argv[1]` when nothing was passed is an `IndexError`.
> Everything arrives as a string. For anything with more than one or two
> options, use the `argparse` module, which handles `--flags`, defaults and
> `--help` for you.

For file paths prefer `pathlib` (Lesson 13) over the older `os.path`.

---

## `itertools` — clever looping

```python
from itertools import count, cycle, chain, combinations, permutations, product

list(chain([1, 2], [3, 4]))        # [1, 2, 3, 4]  — one long sequence
list(combinations([1,2,3], 2))     # [(1,2), (1,3), (2,3)]  — order-blind pairs
list(permutations([1,2,3], 2))     # [(1,2), (1,3), (2,1), ...] — order matters
list(product([1,2], "ab"))         # [(1,'a'), (1,'b'), (2,'a'), (2,'b')]

for i in count(10):                # 10, 11, 12, ... forever
    if i > 12:
        break

colours = cycle(["red", "green"])  # loops round forever
```

> **NEW — `itertools.product(a, b)`**
> Every combination of items from each collection — a nested loop, flattened.
> ```python
> from itertools import product
> for x, y in product(range(3), range(3)):
>     print(x, y)      # all nine coordinates
> ```
> **Use it when** you'd otherwise write nested `for` loops purely to pair
> things up.
> **Watch out:** `count` and `cycle` are **infinite** — using them without a
> `break` or a limit hangs your program. Most itertools functions return
> single-use iterators, so wrap in `list()` if you need to reuse them.

---

## `re` — regular expressions

A miniature language for describing text patterns. Powerful and easy to
overuse.

```python
import re

text = "Order 123 shipped on 2026-07-29 for R450.00"

print(re.findall(r"\d+", text))             # ['123', '2026', '07', '29', ...]
print(re.search(r"\d{4}-\d{2}-\d{2}", text).group())   # 2026-07-29
print(re.sub(r"\d", "#", text))             # Order ### shipped on ...
print(bool(re.match(r"^Order", text)))      # True
```

> **NEW — `re.findall(pattern, text)` / `re.search` / `re.sub`**
> Find every match / find the first match / replace matches.
> ```python
> import re
> emails = re.findall(r"[\w.]+@[\w.]+", "a@b.com and c@d.org")
> print(emails)      # ['a@b.com', 'c@d.org']
> ```
> **Use it when** the pattern is genuinely irregular — extracting fields from
> messy text, validating formats.
> **Watch out:** always write patterns as raw strings (`r"\d+"`), or the
> backslashes get eaten by Python before `re` sees them. `re.search` returns
> `None` when there's no match, so `.group()` on it is an `AttributeError` —
> check first. And if `.split()` or `in` would do the job, use those instead:
> regexes are famously write-only.

Basic pieces: `\d` digit, `\w` word character, `\s` whitespace, `.` any
character, `+` one or more, `*` zero or more, `?` optional, `^` start, `$`
end, `[abc]` any of, `( )` capture group, `{3}` exactly three.

---

## `statistics`

```python
import statistics as stats

data = [4, 8, 15, 16, 23, 42]
print(stats.mean(data))       # 18.0
print(stats.median(data))     # 15.5
print(stats.stdev(data))      # 13.6...
print(stats.mode([1,1,2]))    # 1
```

**Watch out:** `mean([])` raises `StatisticsError`.

---

## `textwrap`, `pprint`, `string`

```python
import textwrap, pprint

print(textwrap.fill("a very long sentence " * 10, width=50))
pprint.pprint({"nested": {"data": [1, 2, 3]}})     # readable dict printing

import string
print(string.ascii_lowercase)     # abcdefghijklmnopqrstuvwxyz
print(string.punctuation)         # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

`pprint` is genuinely useful for debugging nested data that `print` renders as
one unreadable line.

---

## `dataclasses`, `enum`, `typing`

Previews of Lesson 16 and beyond:

```python
from dataclasses import dataclass

@dataclass
class Unit:
    name: str
    damage: int = 1

u = Unit("archer", 5)
print(u)              # Unit(name='archer', damage=5)
```

```python
from enum import Enum

class Direction(Enum):
    NORTH = 0
    EAST = 1

print(Direction.NORTH.name)     # NORTH
```

That `Enum` is exactly what the game's `North`/`East` constants were.

---

## `secrets` and `hashlib`

For anything security-related, `random` is the wrong tool:

```python
import secrets, hashlib

print(secrets.token_hex(16))       # a secure random token
print(secrets.choice(["a", "b"]))  # a secure random choice

print(hashlib.sha256(b"hello").hexdigest())   # a hash — note the b"" bytes
```

**Watch out:** hashing is not encryption and `sha256` alone is not suitable
for storing passwords — that needs a slow, salted algorithm. Use a library
built for it if you ever need to.

---

## Finding things

Two commands that beat searching the web:

```python
import math
print(dir(math))      # every name in the module
help(math.hypot)      # documentation for one function
```

The official docs at <https://docs.python.org/3/library/> are genuinely good.
The module index there is worth ten minutes of browsing — knowing that
`zipfile`, `sqlite3`, `http.server` and `unittest` all ship with Python saves
you from reinventing them.

---

## A worked example

```python
"""Analyse a text file: word frequencies, reading time, longest words."""
from collections import Counter
from pathlib import Path
import re
import sys

WORDS_PER_MINUTE = 200


def analyse(text: str) -> dict:
    words = re.findall(r"[a-z']+", text.lower())
    counts = Counter(words)
    return {
        "total": len(words),
        "unique": len(counts),
        "top": counts.most_common(5),
        "longest": max(words, key=len) if words else "",
        "minutes": len(words) / WORDS_PER_MINUTE,
    }


def main() -> None:
    if len(sys.argv) < 2:
        print("usage: python analyse.py <file>")
        sys.exit(1)

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"No such file: {path}")
        sys.exit(1)

    result = analyse(path.read_text(encoding="utf-8"))

    print(f"{result['total']} words, {result['unique']} unique")
    print(f"About {result['minutes']:.1f} minutes to read")
    print(f"Longest word: {result['longest']}")
    print("\nMost common:")
    for word, n in result["top"]:
        print(f"  {n:>4}  {word}")


if __name__ == "__main__":
    main()
```

`Counter`, `pathlib`, `re`, `sys.argv`, a `main()` guard, and a function that
returns data while `main` does the printing. That's a realistic small tool.

---

## Exercises

1. Use `Counter` to find the 3 most common letters in a sentence.
2. Print how many days until the end of the year.
3. Write a countdown from 5 to 1 with a one-second pause between each.
4. Use `defaultdict` to group a list of words by their first letter.
5. Use `itertools.combinations` to print every pair from a list of 4 names.
6. Use `re` to pull all the numbers out of `"a1 b22 c333"` as integers.
7. Write a script that takes a filename as a command-line argument and prints
   its line count, with a helpful message if no argument is given.
8. Use `random.seed` and `random.choice` to pick a reproducible "random" item.

---

## Solutions

**1.**
```python
from collections import Counter
text = input("Sentence: ").replace(" ", "").lower()
print(Counter(text).most_common(3))
```

**2.**
```python
from datetime import date
today = date.today()
print((date(today.year, 12, 31) - today).days)
```

**3.**
```python
import time
for n in range(5, 0, -1):
    print(n)
    time.sleep(1)
print("Go!")
```

**4.**
```python
from collections import defaultdict
words = ["apple", "avocado", "banana", "blueberry", "cherry"]
groups = defaultdict(list)
for w in words:
    groups[w[0]].append(w)
for letter, items in sorted(groups.items()):
    print(letter, items)
```

**5.**
```python
from itertools import combinations
names = ["Alex", "Ben", "Ivy", "Sam"]
for a, b in combinations(names, 2):
    print(f"{a} vs {b}")      # 6 pairings
```

**6.**
```python
import re
print([int(n) for n in re.findall(r"\d+", "a1 b22 c333")])     # [1, 22, 333]
```

**7.**
```python
import sys
from pathlib import Path

if len(sys.argv) < 2:
    print("usage: python count.py <file>")
    sys.exit(1)

path = Path(sys.argv[1])
if not path.exists():
    print(f"No such file: {path}")
    sys.exit(1)

print(len(path.read_text(encoding="utf-8").splitlines()), "lines")
```

**8.**
```python
import random
random.seed(1)
print(random.choice(["hay", "wood", "carrot"]))     # same every run
```
