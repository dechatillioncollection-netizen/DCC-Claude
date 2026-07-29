# Lesson 07 — Lists

You used lists in the game to remember things between ticks. Here is the full
toolkit — and the one behaviour (references) that catches every beginner.

---

## Making a list

```python
crops = ["wheat", "carrot", "pumpkin"]
numbers = [4, 8, 15]
mixed = ["hay", 12, True, None]      # legal, though usually a design smell
empty = []
```

A list is **ordered**, **changeable**, and **can contain duplicates**.

---

## Indexing and slicing

Exactly like strings (Lesson 03):

```python
crops = ["wheat", "carrot", "pumpkin"]

print(crops[0])      # wheat
print(crops[-1])     # pumpkin
print(crops[0:2])    # ['wheat', 'carrot']
print(crops[::-1])   # ['pumpkin', 'carrot', 'wheat']
print(len(crops))    # 3
```

Unlike strings, lists **can** be changed in place:

```python
crops[0] = "barley"
print(crops)         # ['barley', 'carrot', 'pumpkin']
```

---

## Adding items

> **NEW — `.append(item)`**
> Adds one item to the end of the list.
> ```python
> crops = ["wheat"]
> crops.append("carrot")
> print(crops)     # ['wheat', 'carrot']
> ```
> **Use it when** building a list up inside a loop — the single most common
> list operation there is.
> **Watch out:** it changes the list and returns `None`, so
> `crops = crops.append("x")` destroys your list. Write `crops.append("x")` on
> its own line. And it appends *one* item: `crops.append([1, 2])` adds a
> nested list, not two items.

> **NEW — `.extend(other)`**
> Adds every item from another collection to the end.
> ```python
> a = [1, 2]
> a.extend([3, 4])
> print(a)         # [1, 2, 3, 4]
> ```
> **Use it when** merging one list into another you already have.
> **Watch out:** the difference from `append` matters. `a.append([3,4])` gives
> `[1, 2, [3, 4]]`; `a.extend([3,4])` gives `[1, 2, 3, 4]`. Also,
> `a.extend("hi")` adds `'h'` and `'i'` separately, because a string is a
> collection of characters.

> **NEW — `.insert(index, item)`**
> Puts an item at a given position, shifting the rest right.
> ```python
> a = ["b", "c"]
> a.insert(0, "a")
> print(a)         # ['a', 'b', 'c']
> ```
> **Use it when** position genuinely matters, e.g. adding to the front.
> **Watch out:** inserting at the front of a big list is slow — everything
> after it must shift. If you're doing that a lot, use
> `collections.deque` (Lesson 15).

`+` also works, but makes a **new** list rather than changing the old one:

```python
a = [1, 2]
b = a + [3]        # a is unchanged, b is [1, 2, 3]
a += [3]           # a itself becomes [1, 2, 3]
```

---

## Removing items

> **NEW — `.remove(value)`**
> Deletes the **first** item equal to the value.
> ```python
> crops = ["hay", "wood", "hay"]
> crops.remove("hay")
> print(crops)     # ['wood', 'hay']   <- only the first went
> ```
> **Use it when** you know *what* to remove but not where it is.
> **Watch out:** if the value isn't there it raises `ValueError` — check with
> `if x in crops:` first. And it removes only one occurrence, not all of them.

> **NEW — `.pop(index)`**
> Removes the item at that index **and returns it**. With no argument, pops
> the last item.
> ```python
> a = [1, 2, 3]
> last = a.pop()
> print(last, a)      # 3 [1, 2]
> first = a.pop(0)
> print(first, a)     # 1 [2]
> ```
> **Use it when** you want the value *and* want it gone — stacks, queues,
> processing a to-do list.
> **Watch out:** popping from an empty list raises `IndexError`. This is the
> one removal method that hands something back; `remove` and `del` return
> nothing.

> **NEW — `del`**
> A statement (not a method) that deletes an item, a slice, or a whole
> variable.
> ```python
> a = [1, 2, 3, 4]
> del a[0]          # [2, 3, 4]
> del a[0:2]        # [4]
> ```
> **Use it when** removing by position and you don't need the value.
> **Watch out:** `del a` deletes the variable itself, so using `a` afterwards
> is a `NameError`.

> **NEW — `.clear()`**
> Empties the list.
> ```python
> a = [1, 2, 3]
> a.clear()
> print(a)          # []
> ```
> **Use it when** you want to reuse the same list object.
> **Watch out:** this is not the same as `a = []`. `clear()` empties the list
> everyone else is also pointing at; `a = []` just points `a` at a fresh one.
> See the references section below.

### Never remove while looping forwards

```python
nums = [1, 2, 3, 4]
for n in nums:
    if n % 2 == 0:
        nums.remove(n)      # skips items — the loop's index slides
print(nums)                 # [1, 3] here, but the logic is broken
```

Build a new list instead:

```python
nums = [n for n in nums if n % 2 != 0]     # Lesson 11
# or
keep = []
for n in nums:
    if n % 2 != 0:
        keep.append(n)
```

---

## Searching

> **NEW — `in`**
> `True` if the value is in the list.
> ```python
> print("hay" in ["hay", "wood"])      # True
> ```
> **Use it when** checking membership before acting.
> **Watch out:** on a long list this checks every item one by one. If you're
> doing membership tests thousands of times, a `set` (Lesson 09) is
> dramatically faster.

> **NEW — `.index(value)`**
> Position of the first matching item.
> ```python
> print(["a", "b", "c"].index("b"))    # 1
> ```
> **Use it when** you need to know where something is.
> **Watch out:** raises `ValueError` if absent — unlike the string version,
> lists have no `.find()`. Guard with `in` first.

> **NEW — `.count(value)`**
> How many times a value appears.
> ```python
> print([1, 2, 2, 3].count(2))         # 2
> ```
> **Use it when** tallying one specific value.
> **Watch out:** counting many different values with this means scanning the
> list once per value — use `collections.Counter` (Lesson 15) instead.

---

## Sorting and reordering

> **NEW — `.sort()`**
> Sorts the list **in place**. Returns `None`.
> ```python
> a = [3, 1, 2]
> a.sort()
> print(a)                # [1, 2, 3]
> a.sort(reverse=True)
> print(a)                # [3, 2, 1]
> ```
> **Use it when** you own the list and don't need the original order.
> **Watch out:** `a = a.sort()` sets `a` to `None`. If you need a sorted copy,
> use `sorted(a)` instead. Only works when all items are comparable.

> **NEW — `.reverse()`**
> Flips the list in place. Returns `None`.
> ```python
> a = [1, 2, 3]
> a.reverse()
> print(a)                # [3, 2, 1]
> ```
> **Use it when** you want to permanently flip the order.
> **Watch out:** same `None` trap. For a reversed copy, use `a[::-1]` or
> `list(reversed(a))`.

The pattern is consistent and worth memorising:

| In place (returns `None`) | Makes a copy (returns the result) |
|---|---|
| `a.sort()` | `sorted(a)` |
| `a.reverse()` | `a[::-1]`, `reversed(a)` |

---

## The reference trap

This is the most important thing in the lesson.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)      # [1, 2, 3, 4]   <- a changed too!
```

`b = a` does **not** copy the list. It attaches a second label to the *same*
list. Both names point at one object.

Numbers and strings don't behave this way, because they can't be modified —
which is exactly why lists feel like a trap when you first meet it.

### Making a real copy

> **NEW — `.copy()` / `list(x)` / `x[:]`**
> Three ways to make an independent shallow copy.
> ```python
> a = [1, 2, 3]
> b = a.copy()
> b.append(4)
> print(a)     # [1, 2, 3]   — untouched
> ```
> **Use it when** you need to modify a list without disturbing the original —
> especially with a list that was passed into a function.
> **Watch out:** these are *shallow*. If the list contains other lists, the
> inner lists are still shared:
> ```python
> grid = [[0, 0], [0, 0]]
> copy = grid.copy()
> copy[0][0] = 9
> print(grid)      # [[9, 0], [0, 0]]  — the inner list was shared
> ```
> For a fully independent copy, use `copy.deepcopy(x)` from the `copy` module.

### Why it matters for functions

```python
def add_one(items):
    items.append(1)      # modifies the caller's list!

nums = []
add_one(nums)
print(nums)              # [1]
```

Sometimes that's what you want. Often it's a nasty surprise. The safe habit:
if a function shouldn't change its input, copy it first, or return a new list.

---

## 2D grids — the farm, rebuilt

You spent hours on a grid. Here's how to make your own:

```python
# a 3x3 grid of zeros
grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]

grid[1][2] = 5          # row 1, column 2
print(grid[1][2])       # 5

for row in grid:
    for cell in row:
        print(cell, end=" ")
    print()
```

Building one programmatically:

```python
size = 4
grid = []
for y in range(size):
    row = []
    for x in range(size):
        row.append(0)
    grid.append(row)
```

Or in one line with a comprehension (Lesson 11):

```python
grid = [[0] * size for _ in range(size)]
```

**Do not** write `grid = [[0] * size] * size`. The `* size` on the outer list
copies the *reference* to the same row four times, so changing `grid[0][0]`
changes the first cell of every row. This is the reference trap in its most
famous form.

```python
bad = [[0] * 3] * 3
bad[0][0] = 9
print(bad)      # [[9, 0, 0], [9, 0, 0], [9, 0, 0]]   <- all three rows
```

### A grid walker, farm-style

```python
grid = [[0] * 5 for _ in range(5)]
x, y = 0, 0

for step in range(12):
    grid[y][x] = step + 1
    x += 1
    if x >= 5:              # walked off the east edge
        x = 0
        y = (y + 1) % 5     # wrap to the next row

for row in grid:
    print(" ".join(f"{c:2}" for c in row))
```

That's your drone's serpentine harvest path, written with nothing but Python.

---

## Other useful built-ins

> **NEW — `list(iterable)`**
> Turns any collection into a list.
> ```python
> print(list("hay"))          # ['h', 'a', 'y']
> print(list(range(3)))       # [0, 1, 2]
> ```
> **Use it when** you need to see or index something lazy like `range`, `zip`,
> or `reversed`.
> **Watch out:** calling it on a generator consumes it — you can only do that
> once (Lesson 17).

> **NEW — `any(collection)` / `all(collection)`**
> `any` is `True` if at least one item is truthy; `all` is `True` if every
> item is (and `True` for an empty collection).
> ```python
> print(any([False, True]))       # True
> print(all([True, True]))        # True
> print(all([]))                  # True   <- vacuously true
> ```
> **Use it when** replacing a loop-with-a-flag: `if any(n < 0 for n in nums):`
> **Watch out:** `all([])` being `True` catches people out. And they test
> *truthiness*, so `any([0, ""])` is `False` while `any(["no"])` is `True`.

---

## Exercises

1. Build a list of the squares of 1–10 using a loop and `.append()`.
2. Ask the user for 5 words, store them in a list, then print them sorted and
   reversed.
3. Given `nums = [4, 8, 15, 16, 23, 42]`, print the largest, smallest,
   average, and the middle two items (as a slice).
4. Write code that removes all duplicates from a list while keeping order.
5. Explain, then fix:
   ```python
   a = [1, 2, 3]
   b = a
   b.sort(reverse=True)
   print(a)
   ```
6. Make a 5×5 grid of zeros, put a `1` on the diagonal, and print it as a
   square.
7. Given a list of names, print the ones that start with a vowel.
8. Merge two sorted lists into one sorted list without using `sorted()`.

---

## Solutions

**1.**
```python
squares = []
for n in range(1, 11):
    squares.append(n ** 2)
print(squares)
```

**2.**
```python
words = []
for i in range(5):
    words.append(input(f"Word {i + 1}: "))
print(sorted(words))
print(sorted(words, reverse=True))
```

**3.**
```python
nums = [4, 8, 15, 16, 23, 42]
print(max(nums), min(nums))
print(sum(nums) / len(nums))
print(nums[2:4])            # [15, 16]
```

**4.**
```python
items = ["hay", "wood", "hay", "carrot", "wood"]
seen = []
for item in items:
    if item not in seen:
        seen.append(item)
print(seen)      # ['hay', 'wood', 'carrot']
```
(With a `set` this is faster, but sets lose the order — Lesson 09.)

**5.** `b = a` makes both names point at the same list, so sorting through `b`
also sorts what `a` sees; it prints `[3, 2, 1]`. Fix with `b = a.copy()`, or
use `b = sorted(a, reverse=True)` which never touches `a`.

**6.**
```python
size = 5
grid = [[0] * size for _ in range(size)]
for i in range(size):
    grid[i][i] = 1
for row in grid:
    print(" ".join(str(c) for c in row))
```

**7.**
```python
names = ["Alex", "Ben", "Ivy", "Owen", "Sam"]
for name in names:
    if name[0].lower() in "aeiou":
        print(name)
```

**8.**
```python
a = [1, 4, 7]
b = [2, 3, 8]
merged = []
i = j = 0
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        merged.append(a[i])
        i += 1
    else:
        merged.append(b[j])
        j += 1
merged.extend(a[i:])
merged.extend(b[j:])
print(merged)      # [1, 2, 3, 4, 7, 8]
```
The two `extend` calls at the end pick up whatever's left in either list —
slicing past the end gives `[]`, so both are always safe to call.
