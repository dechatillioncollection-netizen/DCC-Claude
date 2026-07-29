# Lesson 20 — Capstone projects

Courses don't make you a programmer; finished projects do. Here are five, in
increasing order of difficulty. Each one lists what it exercises, a
specification, and hints — but not a full solution, because at this point
struggling productively *is* the lesson.

Do at least two. Finish them properly: handle bad input, split into functions,
write a few tests.

---

## Project 1 — Number guessing game (⭐)

**Exercises:** loops, conditionals, input validation, `random`.

A program that picks a secret number and gives higher/lower feedback.

**Requirements**
- Picks a random number 1–100.
- Loops until guessed, saying "higher" or "lower".
- Rejects non-numeric input without crashing.
- Counts guesses and reports the total at the end.
- Offers to play again.

**Stretch:** limited guesses; difficulty levels changing the range; save the
best score to a file and show the record.

**Hints**
- `random.randint(1, 100)`.
- The `ask_int` function from Lesson 12 does the validation for you.
- Play-again loop: wrap the whole game in `while True:` and `break` when the
  answer isn't `"y"`.

---

## Project 2 — Contact book (⭐⭐)

**Exercises:** dictionaries, files, JSON, functions, menus.

A command-line address book that remembers its contacts between runs.

**Requirements**
- Menu: add, list, search, delete, quit.
- Each contact has a name, phone and email.
- Data saves to `contacts.json` and loads on start.
- Search matches partial names, case-insensitively.
- A missing or corrupt save file must not crash it.

**Stretch:** edit an existing contact; sort the listing; export to CSV;
confirm before deleting.

**Hints**
- Store as `{"alex": {"phone": "...", "email": "..."}}` — lower-cased keys make
  searching easy.
- Save after every change, not just at quit; the program may be killed.
- Search: `[name for name in contacts if term.lower() in name]`.
- Lesson 13's to-do list is the template for the load/save half.

---

## Project 3 — Text analyser (⭐⭐)

**Exercises:** strings, `Counter`, files, `sys.argv`, formatting.

A tool that reports statistics on a text file, run from the command line.

**Requirements**
- Takes a filename as a command-line argument, with a usage message if
  missing.
- Reports: line count, word count, character count, unique words.
- Shows the 10 most common words as a bar chart of `#` characters.
- Ignores case and punctuation.
- Excludes common stop-words ("the", "and", "a"...) from the top list.

**Stretch:** average sentence length; estimated reading time; longest word;
compare two files; write the report to an output file.

**Hints**
- `re.findall(r"[a-z']+", text.lower())` gets clean words.
- `Counter(words).most_common(10)`.
- Bar chart: `"#" * int(count / biggest * 40)` scales bars to fit.
- Lesson 15's worked example is most of this.

---

## Project 4 — Inventory / shop system (⭐⭐⭐)

**Exercises:** classes, exceptions, JSON, testing, modules.

A stock management system, split across several files.

**Requirements**
- An `Item` class (or dataclass) with name, quantity, unit price.
- An `Inventory` class supporting add, remove, restock, total value,
  low-stock report.
- Custom exceptions: `OutOfStock`, `UnknownItem`.
- Saves and loads to JSON.
- Split into `models.py`, `storage.py`, `main.py`.
- At least six pytest tests, including the error cases.

**Stretch:** transaction history with timestamps; sales report by date;
`__len__`/`__contains__`/`__getitem__` on `Inventory`; a CSV export.

**Hints**
- `@dataclass` for `Item` saves a lot of typing.
- Converting a dataclass to JSON: `dataclasses.asdict(item)`.
- Test the errors: `with pytest.raises(OutOfStock):`.
- Keep the classes free of `print` — do all output in `main.py`. That's what
  makes it testable.

---

## Project 5 — The farm, rebuilt (⭐⭐⭐⭐)

**Exercises:** everything.

Recreate *The Farmer Was Replaced* in real Python, then write drone programs
against it — the full-circle project.

A working starting point is in **[`examples/farm.py`](examples/farm.py)**. Run
it:

```
python farm.py
```

```
tick 192   coins 720   pos (0, 0)
[P] P  P  P  P  P
 P  P  P  P  P  P
 P  P  P  P  P  P
 P  P  P  P  P  P
 P  P  P  P  P  P
 P  P  P  p  p  p

Finished after 192 ticks with 720 coins.

crop       count  value
pumpkin       36    720
```

Read that file — it's about 200 lines and uses nearly everything in this
course: a data table of crops, a `Tile` and `Farm` dataclass, a dictionary
keyed by `(x, y)` tuples, `%` for edge wrapping, f-string alignment for the
grid, `max(..., key=...)` to pick the best crop, and a `main()` behind an
`if __name__ == "__main__":` guard.

**Then extend it. In rough order of difficulty:**

1. **Write better drone programs.** Fill in `my_program()`. Can you beat 720
   coins in 192 ticks? Track coins-per-tick and compare strategies.
2. **Watch it run.** Call `farm.show(pause=0.2)` inside the loop for an
   animated grid.
3. **Add water.** Each tile has a moisture level that drops over time; dry
   tiles grow at half speed. Add a `farm.water()` action.
4. **Add an inventory and costs.** Seeds cost coins, so you must sell before
   you can plant more. Now strategy actually matters.
5. **Add obstacles.** Some tiles hold rocks that must be cleared before
   planting. Now you need pathfinding.
6. **Add a maze or a cave.** A grid with walls, and a drone that must find the
   exit — write breadth-first search using `collections.deque`.
7. **Save and load.** Persist the whole farm to JSON so a run can be resumed.
8. **Test it.** `test_farm.py` — does wrapping work at the edges? Does
   harvesting an unripe crop correctly return `None`? Does planting on an
   occupied tile return `False`?
9. **Make it a package.** Split into `farm/world.py`, `farm/crops.py`,
   `farm/programs.py`, with a `main.py` at the top.

**Stretch:** a `Program` class so you can register and compare several
strategies automatically; a leaderboard of coins-per-tick; a simple
`tkinter` window instead of terminal output.

---

## What to do after this

**Keep building.** The gap between "finished a course" and "can program" is
closed by projects you chose yourself, because only those force you to solve
problems nobody has pre-digested for you.

**Read other people's code.** This repository is a good target: `game.html`
is a real program with data tables, a state machine, and save/load handling.
The concepts transfer even though it's JavaScript.

**Pick a direction when something interests you:**

| If you liked... | Look at |
|---|---|
| The farm simulator | `pygame` — 2D games |
| The text analyser | `pandas`, `matplotlib` — data analysis |
| The inventory system | `sqlite3`, `flask`/`fastapi` — databases and web apps |
| Automating things | `requests`, `beautifulsoup4`, `openpyxl`, `playwright` |
| Making tools nicer | `rich`, `typer` — good-looking command-line programs |

**Sources worth your time:** the official tutorial at
<https://docs.python.org/3/tutorial/>, *Automate the Boring Stuff with Python*
(free online), and Exercism's Python track for practice with feedback.

**One habit above all:** when something confuses you, open the REPL and try
it. Three minutes of experimenting beats twenty minutes of reading about it.

---

## A final checklist

You can consider yourself past "beginner" when you can, without looking
things up:

- [ ] Read a traceback and go straight to the broken line
- [ ] Choose between a list, dict, set and tuple, and say why
- [ ] Write a function that takes arguments and returns a value
- [ ] Explain why `x = mylist.sort()` sets `x` to `None`
- [ ] Explain why code after a `return` never runs
- [ ] Read and write a file safely, including when it's missing
- [ ] Split a program across modules and import between them
- [ ] Write a class with `__init__` and a couple of methods
- [ ] Write a test that fails when you break the code
- [ ] Set up a virtual environment and install a package into it

Everything on that list appears in this course. If any of them feel shaky, the
lesson that covers it is in the [README](README.md) table.
