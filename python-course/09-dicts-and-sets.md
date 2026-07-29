# Lesson 09 — Dictionaries and sets

The most useful data structure in Python, and the one the game barely let you
touch. If you learn one thing properly from this course, make it dictionaries.

---

## What a dictionary is

A list looks things up by **position**. A dictionary looks them up by
**name** — or by any fixed value you choose.

```python
inventory = {
    "hay": 12,
    "wood": 40,
    "carrot": 7,
}

print(inventory["wood"])      # 40
```

Each entry is a **key** (`"wood"`) paired with a **value** (`40`). Curly
braces, colon between key and value, comma between entries.

Why it beats a list: with a list of `(name, count)` pairs you'd have to scan
every item to find `"wood"`. A dictionary jumps straight to it, no matter how
many entries there are.

---

## Reading, adding, changing

```python
inventory = {"hay": 12}

inventory["wood"] = 40         # add a new key
inventory["hay"] = 15          # change an existing one
inventory["hay"] += 1          # arithmetic works as you'd expect

print(inventory)               # {'hay': 16, 'wood': 40}
print(len(inventory))          # 2
```

There's no `append` — assigning to a key that doesn't exist *is* how you add.

### The missing-key problem

```python
print(inventory["gold"])       # KeyError: 'gold'
```

Reading a key that isn't there crashes. Three ways to handle it:

```python
# 1. check first
if "gold" in inventory:
    print(inventory["gold"])

# 2. use .get() — the usual answer
print(inventory.get("gold"))        # None
print(inventory.get("gold", 0))     # 0

# 3. catch the error (Lesson 12)
```

> **NEW — `.get(key, default)`**
> Returns the value for a key, or the default (`None` if not given) when the
> key is absent. Never raises.
> ```python
> stock = {"hay": 12}
> print(stock.get("hay"))         # 12
> print(stock.get("gold"))        # None
> print(stock.get("gold", 0))     # 0
> ```
> **Use it when** a missing key is normal and you have a sensible fallback —
> counters, optional settings, user data.
> **Watch out:** it does *not* add the key. `stock.get("gold", 0)` leaves the
> dictionary unchanged; if you wanted the key created, use `.setdefault()`.
> Also, if a real stored value could be `None`, `.get()` can't tell you
> whether the key exists — use `in` for that.

> **NEW — `in`**
> Tests whether a **key** is present (not a value).
> ```python
> print("hay" in inventory)       # True
> print(12 in inventory)          # False — 12 is a value, not a key
> ```
> **Use it when** you need to branch on whether a key exists.
> **Watch out:** to search values, say `12 in inventory.values()`.

> **NEW — `.setdefault(key, default)`**
> Returns the value if the key exists; otherwise inserts the default and
> returns that.
> ```python
> groups = {}
> groups.setdefault("fruit", []).append("apple")
> groups.setdefault("fruit", []).append("pear")
> print(groups)      # {'fruit': ['apple', 'pear']}
> ```
> **Use it when** grouping items into lists under keys.
> **Watch out:** the default is built on every call even when unused, so avoid
> expensive defaults. `collections.defaultdict` (Lesson 15) is cleaner for
> heavy use.

---

## Removing

> **NEW — `.pop(key, default)`**
> Removes a key and returns its value.
> ```python
> stock = {"hay": 12, "wood": 40}
> print(stock.pop("hay"))         # 12
> print(stock)                    # {'wood': 40}
> print(stock.pop("gold", 0))     # 0 — no error, thanks to the default
> ```
> **Use it when** you want the value and want the entry gone.
> **Watch out:** without a default, popping a missing key raises `KeyError`.

`del inventory["hay"]` also works, and `.clear()` empties the whole thing.

---

## Looping over a dictionary

```python
inventory = {"hay": 12, "wood": 40}

for key in inventory:                    # keys by default
    print(key)                           # hay, wood

for value in inventory.values():
    print(value)                         # 12, 40

for key, value in inventory.items():     # the one you'll use most
    print(f"{key}: {value}")
```

> **NEW — `.keys()` / `.values()` / `.items()`**
> Views onto the dictionary's keys, values, and `(key, value)` pairs.
> ```python
> print(list(inventory.keys()))     # ['hay', 'wood']
> print(list(inventory.values()))   # [12, 40]
> print(list(inventory.items()))    # [('hay', 12), ('wood', 40)]
> ```
> **Use it when** looping — `.items()` with two loop variables is the standard
> way to walk a dictionary.
> **Watch out:** these are live *views*, not lists — they update if the dict
> changes, and you can't index them (`inventory.keys()[0]` is a `TypeError`;
> wrap in `list()` first). Never add or delete keys while looping over one, or
> you get `RuntimeError: dictionary changed size during iteration`. Loop over
> `list(d.items())` if you must modify as you go.

Dictionaries remember insertion order (guaranteed since Python 3.7), so loops
come out in the order you added things.

---

## What can be a key

Keys must be **immutable**: strings, numbers, tuples, booleans. Values can be
anything.

```python
scores = {"alex": 10}          # string keys — most common
by_id = {1: "alex"}            # number keys
world = {(3, 4): "wheat"}      # tuple keys — a sparse grid!

bad = {[1, 2]: "x"}            # TypeError: unhashable type: 'list'
```

That tuple-key trick is worth pausing on. Instead of a full 2D list, you can
store only the tiles that matter:

```python
world = {}
world[(3, 4)] = "wheat"
world[(7, 1)] = "pumpkin"

print(world.get((3, 4), "empty"))     # wheat
print(world.get((0, 0), "empty"))     # empty
```

Keys are also case- and type-sensitive: `"Hay"`, `"hay"`, and `1` vs `"1"` are
all different keys.

---

## Nesting

Values can be dictionaries or lists, which is how you model real data:

```python
units = {
    "archer": {"damage": 5, "range": 120, "cost": 50},
    "knight": {"damage": 12, "range": 20, "cost": 120},
}

print(units["archer"]["damage"])      # 5

for name, stats in units.items():
    print(f"{name}: {stats['damage']} dmg, {stats['cost']} coins")
```

Note the single quotes inside the f-string's braces — you can't reuse the same
quote character that opened the string.

This shape — a dictionary of dictionaries — is exactly what JSON files look
like (Lesson 13), and how the data tables in this repo's game are organised.

---

## Merging and copying

```python
a = {"x": 1}
b = {"y": 2}

merged = {**a, **b}          # {'x': 1, 'y': 2}
merged = a | b               # same thing, Python 3.9+
a.update(b)                  # modifies a in place

copy = a.copy()              # shallow copy — same reference trap as lists
```

> **NEW — `.update(other)`**
> Adds another dictionary's entries, overwriting on clashes.
> ```python
> settings = {"volume": 5, "fullscreen": False}
> settings.update({"volume": 8})
> print(settings)     # {'volume': 8, 'fullscreen': False}
> ```
> **Use it when** applying overrides on top of defaults.
> **Watch out:** later values silently win. It modifies in place and returns
> `None`.

---

## Counting — the classic dictionary job

```python
text = "the quick brown fox jumps over the lazy dog the end"

counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

print(counts["the"])      # 3
```

That `counts.get(word, 0) + 1` line is a genuine idiom — memorise it. It means
"whatever the count was, or zero if this is the first time, plus one".

Sorting the results by count:

```python
for word, n in sorted(counts.items(), key=lambda pair: pair[1], reverse=True):
    print(f"{n:>3}  {word}")
```

`key=` is covered properly in Lesson 18; for now, read it as "sort by the
second item of each pair".

---

## Sets

A **set** is an unordered collection with **no duplicates**.

```python
crops = {"hay", "wood", "hay"}
print(crops)          # {'hay', 'wood'}  — the duplicate vanished
print(len(crops))     # 2
```

> **NEW — `set(iterable)`**
> Builds a set. Also the only way to make an *empty* one.
> ```python
> print(set([1, 2, 2, 3]))     # {1, 2, 3}
> empty = set()                # {} would make an empty DICTIONARY
> ```
> **Use it when** removing duplicates or doing fast membership tests.
> **Watch out:** sets have **no order** and **no indexing** — `s[0]` is a
> `TypeError`. Converting a list to a set and back scrambles the order. Items
> must be immutable (no lists inside).

### Why sets are worth knowing

**Deduplicating:**
```python
names = ["a", "b", "a", "c"]
print(list(set(names)))       # ['a', 'b', 'c'] — order not guaranteed
```

**Fast membership.** Checking `x in my_list` scans the whole list; `x in
my_set` is effectively instant regardless of size. On a 100,000-item
collection checked in a loop, that's the difference between a second and an
hour.

**Set maths:**
```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)      # {1, 2, 3, 4, 5}   union — in either
print(a & b)      # {3}               intersection — in both
print(a - b)      # {1, 2}            difference — in a but not b
print(a ^ b)      # {1, 2, 4, 5}      symmetric difference — in one, not both
```

These answer real questions in one line: "which users are in both groups?",
"which files are new since last run?"

### Set methods

```python
s = {1, 2}
s.add(3)             # add one item        -> {1, 2, 3}
s.discard(9)         # remove if present, no error if absent
s.remove(9)          # KeyError if absent
s.update([4, 5])     # add many
```

> **NEW — `.add(item)` / `.discard(item)`**
> Add one item; remove one item without complaining if it's absent.
> ```python
> seen = set()
> seen.add("hay")
> seen.discard("gold")     # no error
> ```
> **Use it when** tracking "have I already handled this?" while looping.
> **Watch out:** it's `.add()` for sets and `.append()` for lists — mixing
> them up is an `AttributeError`. Use `.discard()` over `.remove()` unless you
> *want* the error.

---

## Choosing a structure

| Need | Use |
|---|---|
| Ordered items, may repeat, will change | `list` |
| Fixed group of related values | `tuple` |
| Look things up by name/id | `dict` |
| Unique items, fast "is it in there?" | `set` |

---

## A worked example

```python
# Tally a shop's sales and report the top sellers.
sales = [
    ("hay", 3), ("wood", 1), ("hay", 5),
    ("carrot", 2), ("wood", 4), ("hay", 1),
]

totals = {}
for item, qty in sales:
    totals[item] = totals.get(item, 0) + qty

print(f"{len(totals)} distinct items, {sum(totals.values())} units total\n")

for item, qty in sorted(totals.items(), key=lambda p: p[1], reverse=True):
    bar = "#" * qty
    print(f"{item:<8}{qty:>3}  {bar}")
```

```
3 distinct items, 16 units total

hay       9  #########
wood      5  #####
carrot    2  ##
```

---

## Exercises

1. Build a dictionary of three friends and their ages. Print each on its own
   line using `.items()`.
2. Ask the user for a name and print that person's age, or `"unknown"` if
   they're not in the dictionary — without crashing.
3. Count how many times each letter appears in a word the user types.
4. Given two lists, print the items that appear in both, using sets.
5. Given `units` (the nested dictionary above), print the name of the unit
   with the highest damage.
6. Invert a dictionary: turn `{"a": 1, "b": 2}` into `{1: "a", 2: "b"}`.
7. Why does `{"a", "b"}` make a set but `{}` make a dictionary? How do you
   make an empty set?
8. Use a dictionary with tuple keys to store a 3×3 noughts-and-crosses board,
   and print it as a grid.

---

## Solutions

**1.**
```python
ages = {"Alex": 30, "Ben": 25, "Ivy": 41}
for name, age in ages.items():
    print(f"{name} is {age}")
```

**2.**
```python
name = input("Name: ").strip()
print(ages.get(name, "unknown"))
```

**3.**
```python
word = input("Word: ")
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
for ch, n in sorted(counts.items()):
    print(f"{ch}: {n}")
```

**4.**
```python
a = ["hay", "wood", "carrot"]
b = ["wood", "gold", "hay"]
print(set(a) & set(b))      # {'hay', 'wood'}
```

**5.**
```python
best = None
for name, stats in units.items():
    if best is None or stats["damage"] > units[best]["damage"]:
        best = name
print(best)      # knight
```

**6.**
```python
original = {"a": 1, "b": 2}
flipped = {}
for key, value in original.items():
    flipped[value] = key
print(flipped)      # {1: 'a', 2: 'b'}
```
This only works cleanly if the values are unique and immutable — duplicates
collapse, keeping the last one.

**7.** `{}` was taken by dictionaries first, so it means "empty dict". A set
literal needs at least one item to be recognisable. Empty set: `set()`.

**8.**
```python
board = {}
for y in range(3):
    for x in range(3):
        board[(x, y)] = "."

board[(1, 1)] = "X"
board[(0, 2)] = "O"

for y in range(3):
    for x in range(3):
        print(board[(x, y)], end=" ")
    print()
```
