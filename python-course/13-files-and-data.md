# Lesson 13 — Files and data

Nothing you made in the game survived on its own. This lesson is how programs
remember things: reading and writing files, and the two data formats you'll
meet everywhere.

---

## Opening a file

> **NEW — `open(path, mode)` with `with`**
> Opens a file and gives you a file object. The `with` form closes it
> automatically, even if an error happens.
> ```python
> with open("notes.txt", "w") as f:
>     f.write("hello\n")
>
> with open("notes.txt") as f:
>     print(f.read())      # hello
> ```
> **Use it when** reading or writing any file — always use the `with` form.
> **Watch out:** mode `"w"` **erases the file immediately**, before you write
> anything. Opening the wrong path in `"w"` destroys it. Outside a `with`
> block you must call `f.close()` yourself, and forgetting means your writes
> may never reach disk. The file object is only usable *inside* the `with`.

### The modes

| Mode | Means |
|---|---|
| `"r"` | read (default). Errors if the file is missing. |
| `"w"` | write. **Creates or empties** the file. |
| `"a"` | append. Creates if missing, adds to the end. |
| `"x"` | create. Errors if the file already exists. |
| `"rb"` / `"wb"` | binary — images, archives, anything not text. |

Add `encoding="utf-8"` for text. It's the default on modern Linux/macOS but
not always on Windows, and specifying it prevents a whole class of
"weird characters" bugs:

```python
with open("notes.txt", encoding="utf-8") as f:
    ...
```

---

## Reading

Three ways, for three situations:

```python
# 1. the whole file as one string — fine for small files
with open("notes.txt") as f:
    text = f.read()

# 2. all lines as a list
with open("notes.txt") as f:
    lines = f.readlines()      # ['line one\n', 'line two\n']

# 3. one line at a time — the best default
with open("notes.txt") as f:
    for line in f:
        print(line.strip())
```

Option 3 never loads more than one line into memory, so it works on a 10 GB
file. It's the idiomatic choice.

> **NEW — `.read()` / `.readlines()` / looping over a file**
> Read everything as one string / as a list of lines / one line at a time.
> ```python
> with open("data.txt") as f:
>     for line in f:
>         print(line.strip())
> ```
> **Use it when** processing a text file line by line — logs, CSVs, word
> lists.
> **Watch out:** every line keeps its trailing `\n`, so `.strip()` it before
> comparing or converting. A file object can only be read **once** — after the
> loop it's exhausted, and reading again gives `""` unless you call
> `f.seek(0)`. And blank lines come through as `"\n"`, which is truthy;
> use `if not line.strip(): continue` to skip them.

---

## Writing

```python
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("Inventory report\n")
    f.write(f"hay: {12}\n")

    f.writelines(["a\n", "b\n"])       # no newlines added for you
```

> **NEW — `.write(text)`**
> Writes a string to the file. Returns the number of characters written.
> ```python
> with open("out.txt", "w") as f:
>     f.write("hay\n")
> ```
> **Use it when** producing output files — reports, exports, logs.
> **Watch out:** unlike `print`, it does **not** add a newline. Forget the
> `\n` and your whole file is one line. It also only accepts strings, so
> numbers need `str()` or an f-string.

A neat trick — `print` can write to a file directly, and it *does* add
newlines:

```python
with open("report.txt", "w") as f:
    print("Inventory report", file=f)
    print(f"hay: {12}", file=f)
```

### Appending

```python
with open("log.txt", "a") as f:
    f.write("event happened\n")
```

Use `"a"` for logs and anything you're adding to over time. `"w"` would wipe
the previous contents each run.

---

## Paths

> **NEW — `from pathlib import Path`**
> The modern way to handle file paths. Works on every OS without you thinking
> about slashes.
> ```python
> from pathlib import Path
>
> p = Path("data") / "scores.txt"      # data/scores.txt (or data\scores.txt)
> print(p.exists())
> print(p.name)        # scores.txt
> print(p.stem)        # scores
> print(p.suffix)      # .txt
> print(p.parent)      # data
> ```
> **Use it when** doing anything with paths — building them, checking
> existence, listing folders.
> **Watch out:** the `/` operator joining paths looks strange but is correct.
> Never build paths with string concatenation or hard-coded `\` — that breaks
> across operating systems and `"\n"` in a Windows path is a newline.

`Path` also does the reading and writing for simple cases:

```python
p = Path("notes.txt")
p.write_text("hello", encoding="utf-8")
print(p.read_text(encoding="utf-8"))
```

Useful members:

```python
Path("data").mkdir(exist_ok=True)          # make a folder, don't error if it exists
Path("old.txt").unlink(missing_ok=True)    # delete a file
list(Path(".").glob("*.py"))               # every .py file here
list(Path(".").rglob("*.png"))             # ...and in every subfolder
Path(".").resolve()                        # the absolute path
Path("x.txt").is_file()
Path("data").is_dir()
```

### The working directory

A relative path like `"notes.txt"` is relative to **wherever you ran python
from**, not where the script lives. This causes endless "but the file is right
there!" confusion. To be safe:

```python
from pathlib import Path
HERE = Path(__file__).parent          # the folder containing this script
data = (HERE / "notes.txt").read_text()
```

`__file__` is the path of the current script.

---

## JSON — saving structured data

JSON is how you save dictionaries and lists to disk. It's the format used by
config files, web APIs, and this repo's own save-export feature.

> **NEW — `import json`**
> Converts between Python objects and JSON text.
> ```python
> import json
>
> data = {"name": "Alex", "crops": ["hay", "wood"], "level": 3}
>
> with open("save.json", "w", encoding="utf-8") as f:
>     json.dump(data, f, indent=2)         # write to a file
>
> with open("save.json", encoding="utf-8") as f:
>     loaded = json.load(f)                # read from a file
>
> print(loaded["crops"][0])                # hay
> ```
> **Use it when** saving program state, settings, or anything you'll load back
> later.
> **Watch out:** the four function names are confusingly similar —
> `dump`/`load` work on **files**, `dumps`/`loads` work on **strings** (the
> `s` is for string). JSON only handles dicts, lists, strings, numbers,
> booleans and `None`: sets, tuples and dates all fail or change type (tuples
> come back as lists). Keys are always strings, so `{1: "a"}` saves and
> reloads as `{"1": "a"}`. And `indent=2` is what makes the file readable —
> without it you get one enormous line.

```python
import json

text = json.dumps({"a": 1})     # '{"a": 1}'  — to a string
back = json.loads(text)         # {'a': 1}    — from a string
```

Loading untrusted or hand-edited JSON should be wrapped in a `try`:

```python
try:
    with open("save.json", encoding="utf-8") as f:
        save = json.load(f)
except FileNotFoundError:
    save = {}                    # first run
except json.JSONDecodeError:
    print("Save file is corrupt, starting fresh")
    save = {}
```

That is exactly the "validate and sanitise imports; never overwrite a good
save with a bad file" rule this repo's game follows.

---

## CSV — spreadsheet data

> **NEW — `import csv`**
> Reads and writes comma-separated files, handling quotes and commas inside
> fields correctly.
> ```python
> import csv
>
> with open("stock.csv", "w", newline="", encoding="utf-8") as f:
>     writer = csv.writer(f)
>     writer.writerow(["item", "qty"])
>     writer.writerow(["hay", 12])
>
> with open("stock.csv", newline="", encoding="utf-8") as f:
>     for row in csv.reader(f):
>         print(row)          # ['item', 'qty'] then ['hay', '12']
> ```
> **Use it when** exchanging tabular data with spreadsheets.
> **Watch out:** always pass `newline=""` when opening a CSV, or you get blank
> lines between rows on Windows. Every value comes back as a **string**, so
> convert numbers yourself. And don't parse CSV by hand with `.split(",")` —
> it breaks the moment a field contains a comma inside quotes.

`DictReader` is nicer when there's a header row:

```python
import csv

with open("stock.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["item"], int(row["qty"]))     # hay 12
```

---

## A worked example — a persistent to-do list

```python
"""A to-do list that survives restarts."""
import json
from pathlib import Path

SAVE = Path(__file__).parent / "todo.json"


def load_tasks() -> list:
    """Return the saved tasks, or an empty list if there's no valid save."""
    try:
        return json.loads(SAVE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_tasks(tasks: list) -> None:
    SAVE.write_text(json.dumps(tasks, indent=2), encoding="utf-8")


def show(tasks: list) -> None:
    if not tasks:
        print("(nothing to do)")
        return
    for i, task in enumerate(tasks, 1):
        mark = "x" if task["done"] else " "
        print(f"{i}. [{mark}] {task['text']}")


tasks = load_tasks()

while True:
    print()
    show(tasks)
    command = input("\n[a]dd, [d]one, [q]uit: ").strip().lower()

    if command == "q":
        break
    elif command == "a":
        text = input("Task: ").strip()
        if text:
            tasks.append({"text": text, "done": False})
            save_tasks(tasks)
    elif command == "d":
        try:
            n = int(input("Number: "))
            tasks[n - 1]["done"] = True
            save_tasks(tasks)
        except (ValueError, IndexError):
            print("No such task.")
    else:
        print("Unknown command.")

print("Saved. Bye.")
```

That's a complete, genuinely useful program: functions that return, exceptions
handled where failure is expected, JSON persistence, and a path that works
regardless of where you run it from.

---

## Exercises

1. Write a file containing the numbers 1–10, one per line. Then read it back
   and print their sum.
2. Append a line to a log file each time your script runs, and print how many
   times it has run.
3. Read a text file and report the number of lines, words, and characters.
4. Save a dictionary of names and ages to JSON, then load it back and print
   the oldest person.
5. Write a program that reads a `.csv` of items and quantities and prints a
   total, handling the header row.
6. Why does `open("data.txt", "w")` sometimes lose your data? When should you
   use `"a"` instead?
7. Use `pathlib` to list every `.md` file in the current folder, sorted by
   name.
8. Make your JSON loader survive a corrupt file without crashing and without
   overwriting the original.

---

## Solutions

**1.**
```python
with open("numbers.txt", "w") as f:
    for n in range(1, 11):
        f.write(f"{n}\n")

with open("numbers.txt") as f:
    total = sum(int(line) for line in f if line.strip())
print(total)      # 55
```

**2.**
```python
from pathlib import Path

log = Path("runs.log")
with open(log, "a") as f:
    f.write("run\n")

print(f"Run number {len(log.read_text().splitlines())}")
```

**3.**
```python
with open("notes.txt") as f:
    text = f.read()
print(len(text.splitlines()), "lines")
print(len(text.split()), "words")
print(len(text), "characters")
```

**4.**
```python
import json

ages = {"Alex": 30, "Ben": 25, "Ivy": 41}
with open("ages.json", "w") as f:
    json.dump(ages, f, indent=2)

with open("ages.json") as f:
    loaded = json.load(f)

oldest = max(loaded, key=loaded.get)
print(f"{oldest} is {loaded[oldest]}")     # Ivy is 41
```

**5.**
```python
import csv

total = 0
with open("stock.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["qty"])
print(total)
```

**6.** `"w"` truncates the file to nothing the instant it opens, before you
write a single byte — so an interrupted or buggy run leaves you with an empty
file. Use `"a"` whenever you're adding to existing content, and for critical
saves write to a temporary file and rename it over the original only once the
write succeeded.

**7.**
```python
from pathlib import Path
for p in sorted(Path(".").glob("*.md")):
    print(p.name)
```

**8.**
```python
import json
from pathlib import Path

def load(path):
    p = Path(path)
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        p.rename(p.with_suffix(".corrupt"))     # keep it for inspection
        print(f"Corrupt save moved to {p.with_suffix('.corrupt')}")
        return {}
```
Renaming rather than deleting means a corrupt save can still be recovered by
hand — worth doing whenever the data is the user's, not yours.
