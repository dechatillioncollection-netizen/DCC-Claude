# Python cheat sheet

Everything from the course on one page. For looking things up, not learning
from — each entry links back to the lesson that explains it.

---

## Running things

```
python file.py            run a file
python                    open the REPL (scratchpad)
python -m pytest          run tests
python -m pip install x   install a package
python -m venv .venv      create a virtual environment
```

In a **file**, an expression on its own prints nothing — use `print()`.
In the **REPL**, it prints automatically.

---

## Types (Lesson 02)

```python
10          int        whole number, unlimited size
3.14        float      decimal, approximate
"hay"       str        text
True        bool       True / False
None        NoneType   nothing
[1, 2]      list       ordered, changeable
(1, 2)      tuple      ordered, fixed
{"a": 1}    dict       key -> value
{1, 2}      set        unique, unordered

int(x)  float(x)  str(x)  bool(x)  list(x)  tuple(x)  set(x)
type(x)             what type is it
isinstance(x, int)  is it this type
```

`input()` always returns a **string** — wrap it in `int()` for numbers.

---

## Operators

```python
+  -  *  /        / always gives a float
//                floor division (rounds DOWN, even for negatives)
%                 remainder — even/odd, every-Nth, wrapping
**                power

==  !=  <  >  <=  >=
and  or  not      short-circuit: the right side may never run
in  not in        membership
is  is not        same object — only use for None/True/False

x += 1   x -= 1   x *= 2   x /= 2
```

**Falsy:** `False None 0 0.0 "" [] {} () set()` — everything else is truthy.
Note `"0"` and `"False"` are **truthy**.

---

## Strings (Lesson 03)

```python
f"{name} has {n} crops"      f-string — the way to build text
f"{v:.2f}"    2 decimals         f"{v:,}"     thousands separators
f"{v:>10}"    right-align 10     f"{v:<10}"   left     f"{v:^10}"  centre
f"{v:05d}"    zero-pad           f"{v:.1%}"   percentage
f"{v=}"       prints  v=value    (debugging)

s[0]  s[-1]  s[1:4]  s[::-1]     index, slice, reverse
len(s)

.upper() .lower() .title() .capitalize()
.strip() .lstrip() .rstrip()     remove whitespace/characters at the ends
.split(sep)  .splitlines()       text  -> list
sep.join(list)                   list  -> text  (items must be strings)
.replace(old, new)
.find(x)   -1 if absent          .index(x)  raises if absent
.startswith(x)  .endswith(x)  .count(x)
.isdigit()  .isalpha()  .isspace()
```

Strings are **immutable** — every method returns a new one. Assign the result.

---

## Lists (Lesson 07)

```python
lst.append(x)        add one to the end
lst.extend(other)    add many
lst.insert(i, x)     add at a position
lst.remove(x)        delete first match (ValueError if absent)
lst.pop()            remove and RETURN last;  .pop(0) for first
del lst[i]           delete by index
lst.clear()

lst.sort()           in place, returns None
sorted(lst)          returns a NEW list
lst.reverse()        in place        lst[::-1]  a reversed copy
lst.index(x)  lst.count(x)  x in lst
lst.copy()           independent (shallow) copy
```

**`b = a` does not copy** — both names point at the same list.
**In place returns `None`:** `x = lst.sort()` sets `x` to `None`.

2D grid: `[[0] * w for _ in range(h)]` — **never** `[[0] * w] * h`.

---

## Dicts and sets (Lesson 09)

```python
d["key"]                  KeyError if missing
d.get("key", default)     safe
d["key"] = value          add or change
d.pop("key", default)
"key" in d                checks KEYS

for k in d:               keys
for v in d.values():
for k, v in d.items():    the usual one

d.keys()  d.values()  d.items()  d.update(other)  d.setdefault(k, [])

s = {1, 2}   set()        empty set — {} is an empty DICT
s.add(x)  s.discard(x)
a | b   union      a & b   intersection
a - b   difference a ^ b   in one but not both
```

Keys must be immutable (str, int, tuple — not list).
Counting idiom: `d[k] = d.get(k, 0) + 1`, or use `Counter`.

---

## Control flow (Lessons 05–06)

```python
if x > 0:
    ...
elif x < 0:
    ...
else:
    ...

value = "yes" if cond else "no"       conditional expression

while cond:
    ...
for item in collection:
    ...
for i in range(start, stop, step):    stop is EXCLUDED

break        leave the loop (innermost only)
continue     skip to the next pass
pass         do nothing (placeholder)

for i, x in enumerate(items, 1):      index + value
for a, b in zip(list1, list2):        two lists in step (stops at shortest)
for x in reversed(items):
for x in sorted(items, key=len, reverse=True):
```

---

## Functions (Lesson 10)

```python
def name(a, b=default, *args, **kwargs) -> ReturnType:
    """What it returns."""
    return value
```

- `return` **exits immediately** — code after it never runs, including
  `print`.
- No `return` means the function gives back `None`.
- `print` shows a value; `return` hands it back. Prefer `return`.
- Never use `[]` or `{}` as a default — use `None` and build it inside.
- Assigning to an outer variable makes a local one; pass it in and return it
  instead of using `global`.

```python
low, high = min_max(nums)      returning several values (a tuple)
f(*list)   f(**dict)           spreading arguments
```

---

## Comprehensions (Lesson 11)

```python
[expr for x in it]                 list
[expr for x in it if cond]         filter  (if at the END)
[a if cond else b for x in it]     choose  (if/else at the FRONT)
{k: v for x in it}                 dict
{expr for x in it}                 set
(expr for x in it)                 generator — lazy, single-use
[x for sub in grid for x in sub]   flatten (outer loop first)
```

---

## Errors (Lesson 12)

```python
try:
    risky()
except ValueError as e:
    print(f"failed: {e}")
except (TypeError, KeyError):
    ...
else:
    ...            # ran without error
finally:
    ...            # always runs

raise ValueError(f"bad value: {x}")
assert cond, "message"       # debugging only — stripped with -O
```

Read tracebacks **from the bottom**. Never use a bare `except:`.

| Error | Usual cause |
|---|---|
| `NameError` | typo, or used before assigned |
| `TypeError` | mixing text and numbers; calling a non-function |
| `ValueError` | `int("abc")` |
| `IndexError` | index past the end |
| `KeyError` | missing dict key |
| `AttributeError: 'NoneType'...` | you used the result of an in-place method |

---

## Files (Lesson 13)

```python
with open(path, encoding="utf-8") as f:    "r" read (default)
    for line in f:                          "w" write — ERASES the file
        print(line.strip())                 "a" append
                                            "x" create only
with open(path, "w", encoding="utf-8") as f:
    f.write("text\n")            # no newline added for you
    print("text", file=f)        # newline added

from pathlib import Path
p = Path("data") / "file.txt"
p.exists()  p.read_text()  p.write_text(s)  p.name  p.stem  p.suffix
Path(".").glob("*.py")       Path(__file__).parent

import json
json.dump(obj, f, indent=2)   json.load(f)      # files
json.dumps(obj)               json.loads(s)     # strings
```

---

## Modules (Lesson 14)

```python
import math                 math.sqrt(16)
import datetime as dt
from pathlib import Path
# never:  from x import *

if __name__ == "__main__":
    main()                  # runs only when this file is run directly
```

Don't name your files after standard modules (`random.py`, `json.py`).

---

## Standard library (Lesson 15)

```python
math.sqrt floor ceil pi inf dist hypot isclose
random.randint(1,6)  randrange(0,6)  choice(lst)  shuffle(lst)  sample  seed
collections.Counter(items).most_common(3)
collections.defaultdict(list)      collections.deque(maxlen=10)
datetime.now()  date.today()  timedelta(days=1)  .strftime("%Y-%m-%d")
itertools.combinations  permutations  product  chain  islice  count  cycle
re.findall(r"\d+", s)  re.search  re.sub  re.match      (raw strings!)
sys.argv   sys.exit(1)
statistics.mean median stdev
time.sleep(1)   time.perf_counter()
```

---

## Classes (Lesson 16)

```python
class Unit:
    def __init__(self, name, hp=10):
        self.name = name
        self.hp = hp

    def is_alive(self):
        return self.hp > 0

    def __repr__(self):
        return f"Unit({self.name!r}, hp={self.hp})"


class Archer(Unit):
    def __init__(self, name, hp, rng):
        super().__init__(name, hp)
        self.range = rng


from dataclasses import dataclass, field

@dataclass
class Unit:
    name: str
    hp: int = 10
    tags: list = field(default_factory=list)    # not = []
```

Every method needs `self` as its first parameter; you never pass it yourself.
Dunders: `__len__ __contains__ __getitem__ __setitem__ __iter__ __eq__`.

---

## Generators (Lesson 17)

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = (x ** 2 for x in range(10))     # lazy, single-use
yield from other_iterable
next(it, default)
```

Single-use: loop it twice and the second pass sees nothing.

---

## Extras (Lesson 18)

```python
sorted(people, key=lambda p: p[1])            by one field
sorted(words, key=lambda w: (len(w), w))      by two (tuple key)
max(units, key=lambda u: u["dmg"])
list(map(int, s.split()))      list(filter(func, items))
any(...)   all(...)

@functools.cache      memoise a pure function
@property             method that reads like an attribute
@dataclass            generate __init__/__repr__/__eq__

while (line := input()) != "quit":            walrus
```

---

## Testing and setup (Lesson 19)

```
python -m venv .venv                  create
source .venv/bin/activate             activate (macOS/Linux)
.venv\Scripts\activate                activate (Windows)
python -m pip freeze > requirements.txt

python -m pytest -v                   run tests (files test_*.py, funcs test_*)
python -m ruff format .               auto-format
python -m ruff check .                lint
python -m cProfile -s cumtime x.py    find the slow part
```

```python
breakpoint()      # debugger: n=next s=step c=continue p x=print l=list q=quit
print(f"{x=}")    # print debugging
```

---

## Things that catch everyone

1. `x = mylist.sort()` → `None`. In-place methods return nothing.
2. `b = a` doesn't copy a list. Use `a.copy()`.
3. Code after `return` (or `break`, or `raise`) never runs.
4. `input()` gives a string. `"2" + 2` is a `TypeError`.
5. `range(1, 10)` stops at **9**.
6. `[[0]*3]*3` shares one row three times.
7. `def f(items=[])` shares one list across all calls.
8. `0.1 + 0.2 != 0.3`. Use `math.isclose`.
9. Generators and file objects empty after one pass.
10. Don't modify a list or dict while looping over it.
