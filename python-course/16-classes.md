# Lesson 16 — Classes and objects

You've been using objects since Lesson 03. Every time you wrote
`"hay".upper()` or `my_list.append(x)`, you called a **method** on an
**object**. This lesson is about making your own.

---

## The problem classes solve

Say you're tracking units in a game. With what you know now:

```python
archer = {"name": "archer", "hp": 20, "damage": 5}
knight = {"name": "knight", "hp": 60, "damage": 12}

def take_damage(unit, amount):
    unit["hp"] -= amount
    if unit["hp"] < 0:
        unit["hp"] = 0

take_damage(archer, 8)
```

That works. It gets uncomfortable when there are twenty functions all taking a
`unit` dict, nothing stops you passing the wrong kind of dict, and a typo like
`unit["hpp"]` fails silently on write.

A class bundles the data and the functions that operate on it into one thing.

---

## Your first class

> **NEW — `class`**
> Defines a new type. Calling the class creates an **instance** (an object) of
> that type.
> ```python
> class Unit:
>     def __init__(self, name, hp):
>         self.name = name
>         self.hp = hp
>
> archer = Unit("archer", 20)
> print(archer.name)     # archer
> print(archer.hp)       # 20
> ```
> **Use it when** you have data and behaviour that belong together, and you'll
> have several of them.
> **Watch out:** class names use `CapitalCase` by convention. Defining a class
> creates nothing on its own — you must call it to get an instance. And each
> instance has its own copy of the attributes set in `__init__`.

### `__init__` and `self`

> **NEW — `__init__(self, ...)`**
> The setup method. Python calls it automatically when you create an instance,
> passing the new object as `self`.
> ```python
> class Unit:
>     def __init__(self, name, hp=10):
>         self.name = name      # store on THIS object
>         self.hp = hp
> ```
> **Use it when** an object needs starting values — nearly always.
> **Watch out:** it must be spelled with two underscores each side. It
> **returns nothing** — `return self` or any other value raises `TypeError`.
> Assigning to a plain local (`name = name` instead of `self.name = name`)
> silently throws the value away when `__init__` ends.

> **NEW — `self`**
> The first parameter of every method: the particular object the method was
> called on.
> ```python
> class Unit:
>     def __init__(self, name):
>         self.name = name
>
>     def describe(self):
>         return f"a unit called {self.name}"
>
> print(Unit("archer").describe())     # a unit called archer
> ```
> **Use it when** — always, as the first parameter of every normal method.
> **Watch out:** you never pass it yourself. `archer.describe()` supplies it
> automatically; that's why the definition has one parameter and the call has
> none. Forgetting `self` in the definition gives
> `TypeError: describe() takes 0 positional arguments but 1 was given` — the
> most common class error there is. The name `self` is only a convention, but
> break it and every Python programmer will wince.

---

## Methods

Functions that live in a class:

```python
class Unit:
    def __init__(self, name, hp, damage):
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.damage = damage

    def take_damage(self, amount):
        """Reduce hp, never below zero. Return True if the unit died."""
        self.hp = max(0, self.hp - amount)
        return self.hp == 0

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)

    def is_alive(self):
        return self.hp > 0

    def attack(self, other):
        """Attack another unit. Returns True if the target died."""
        return other.take_damage(self.damage)


archer = Unit("archer", 20, 5)
knight = Unit("knight", 60, 12)

archer.attack(knight)
print(knight.hp)            # 55
print(knight.is_alive())    # True

while archer.is_alive() and knight.is_alive():
    archer.attack(knight)
    if knight.is_alive():
        knight.attack(archer)

print(f"{archer.name}: {archer.hp}, {knight.name}: {knight.hp}")
```

Note `attack` takes another `Unit` — objects interacting with objects is where
this approach starts paying off.

---

## Class attributes vs instance attributes

```python
class Unit:
    total_created = 0          # CLASS attribute — shared by all instances

    def __init__(self, name):
        self.name = name       # INSTANCE attribute — one per object
        Unit.total_created += 1

a = Unit("archer")
b = Unit("knight")
print(Unit.total_created)      # 2
```

**Watch out:** the mutable-default trap from Lesson 10 returns here. A class
attribute that's a list is shared by every instance:

```python
class Bad:
    items = []                 # DON'T — every instance shares this list

class Good:
    def __init__(self):
        self.items = []        # each instance gets its own
```

---

## Dunder methods

Methods with double underscores let your objects work with Python's built-in
syntax.

> **NEW — `__str__` / `__repr__`**
> `__str__` is what `print()` shows; `__repr__` is what the REPL and debuggers
> show. If you only write one, write `__repr__` — it's used as a fallback.
> ```python
> class Unit:
>     def __init__(self, name, hp):
>         self.name, self.hp = name, hp
>
>     def __repr__(self):
>         return f"Unit({self.name!r}, hp={self.hp})"
>
> print(Unit("archer", 20))     # Unit('archer', hp=20)
> ```
> **Use it when** you want readable output instead of
> `<__main__.Unit object at 0x7f...>` — which is what you get by default, and
> which makes debugging miserable.
> **Watch out:** both must **return a string**, not print one. The `!r` in the
> f-string calls `repr()` on the value, which is why the name comes out
> quoted.

Others worth knowing:

```python
class Inventory:
    def __init__(self):
        self.items = {}

    def __len__(self):                       # len(inv)
        return len(self.items)

    def __contains__(self, key):             # "hay" in inv
        return key in self.items

    def __getitem__(self, key):              # inv["hay"]
        return self.items.get(key, 0)

    def __setitem__(self, key, value):       # inv["hay"] = 5
        self.items[key] = value

    def __iter__(self):                      # for x in inv
        return iter(self.items)

    def __eq__(self, other):                 # inv == other
        return self.items == other.items


inv = Inventory()
inv["hay"] = 12
print(inv["hay"], len(inv), "hay" in inv)    # 12 1 True
```

This is what people mean by "Pythonic": your class behaves like the built-in
types, so nobody has to learn a special interface.

**Watch out:** if you define `__eq__` you should usually define `__hash__`
too, or your objects can't go in sets or be used as dict keys.

---

## Inheritance

A class can build on another, taking everything it has and adding or changing
parts.

> **NEW — `class Child(Parent)`**
> Inherits all of the parent's methods and attributes.
> ```python
> class Unit:
>     def __init__(self, name, hp):
>         self.name, self.hp = name, hp
>     def describe(self):
>         return f"{self.name} ({self.hp} hp)"
>
> class Flyer(Unit):
>     def describe(self):
>         return super().describe() + " [flying]"
>
> print(Flyer("hawk", 12).describe())     # hawk (12 hp) [flying]
> ```
> **Use it when** several types genuinely share behaviour and differ in
> details.
> **Watch out:** deep inheritance chains are a classic way to make code
> impossible to follow. Two levels is plenty. Often "has a" (storing another
> object as an attribute) beats "is a" — a `Unit` that *has* a `Weapon` is
> usually simpler than a `SwordUnit` subclass.

> **NEW — `super()`**
> Calls the parent class's version of a method.
> ```python
> class Archer(Unit):
>     def __init__(self, name, hp, range_):
>         super().__init__(name, hp)      # let Unit set name and hp
>         self.range = range_
> ```
> **Use it when** extending rather than replacing the parent's behaviour —
> especially in `__init__`.
> **Watch out:** forget `super().__init__(...)` and the parent's attributes
> are never set, so you get `AttributeError` later, far from the real cause.

---

## `@dataclass` — the shortcut

Most classes exist to hold a few fields. `dataclass` writes the boilerplate.

> **NEW — `@dataclass`**
> Generates `__init__`, `__repr__` and `__eq__` from annotated fields.
> ```python
> from dataclasses import dataclass, field
>
> @dataclass
> class Unit:
>     name: str
>     hp: int = 10
>     tags: list = field(default_factory=list)
>
>     def is_alive(self) -> bool:
>         return self.hp > 0
>
> u = Unit("archer", 20)
> print(u)                    # Unit(name='archer', hp=20, tags=[])
> print(u == Unit("archer", 20))   # True — compares by value
> ```
> **Use it when** the class is mostly data. It's shorter and less error-prone
> than writing `__init__` yourself.
> **Watch out:** mutable defaults need `field(default_factory=list)`, not
> `= []` — a plain `= []` raises `ValueError` at class-definition time, which
> is Python protecting you from the Lesson 10 trap. The type annotations are
> **required** for a field to be recognised, but still aren't enforced at
> runtime. Add `@dataclass(frozen=True)` to make instances immutable.

The `@` line is a **decorator** — a function that modifies the thing below it.
Lesson 18 covers writing your own.

---

## When to use a class

Not always. Honest guidance:

**Use a class when:**
- You have several things with the same shape and their own state.
- Data and the functions that act on it keep travelling together.
- You want objects that behave like built-ins (`len`, `in`, `[]`).

**Don't bother when:**
- A function will do. A class with one method and no state should be a
  function.
- A dictionary will do. Config, simple lookups, JSON-shaped data.
- You'd be writing getters and setters that do nothing. Python has no private
  attributes by convention-breaking force — just use `self.hp` directly.

The leading-underscore convention (`self._internal`) marks something as
"private, don't touch" — it's a message to humans, not a restriction.

---

## A worked example

```python
"""A tiny battle simulator."""
from dataclasses import dataclass
import random


@dataclass
class Unit:
    name: str
    hp: int
    damage: int
    accuracy: float = 0.8

    def is_alive(self) -> bool:
        return self.hp > 0

    def take_damage(self, amount: int) -> None:
        self.hp = max(0, self.hp - amount)

    def attack(self, target: "Unit") -> str:
        """Attack a target. Returns a line describing what happened."""
        if random.random() > self.accuracy:
            return f"{self.name} misses {target.name}"
        target.take_damage(self.damage)
        result = f"{self.name} hits {target.name} for {self.damage}"
        if not target.is_alive():
            result += f" — {target.name} falls!"
        return result


def battle(a: Unit, b: Unit, seed: int | None = None) -> Unit:
    """Fight until one unit dies. Returns the winner."""
    if seed is not None:
        random.seed(seed)

    round_number = 1
    while a.is_alive() and b.is_alive():
        print(f"\n--- Round {round_number} ---")
        print(a.attack(b))
        if b.is_alive():
            print(b.attack(a))
        round_number += 1

    return a if a.is_alive() else b


if __name__ == "__main__":
    archer = Unit("Archer", hp=30, damage=7, accuracy=0.9)
    knight = Unit("Knight", hp=45, damage=11, accuracy=0.6)

    winner = battle(archer, knight, seed=42)
    print(f"\n{winner.name} wins with {winner.hp} hp remaining.")
```

Every method returns something useful, printing happens in `battle`, the seed
makes it reproducible, and `@dataclass` saved fifteen lines of boilerplate.

---

## Exercises

1. Write a `Dog` class with a `name` and a `bark()` method that returns
   `"<name> says woof"`.
2. Write a `BankAccount` class with `deposit`, `withdraw` (raising on
   insufficient funds) and a `balance` attribute.
3. Add `__repr__` to `BankAccount` so printing one is useful.
4. Write a `Rectangle` class with `width`, `height`, an `area()` method, and
   `__eq__` so two rectangles with the same dimensions compare equal.
5. Rewrite `Rectangle` as a `@dataclass` and note how much shorter it is.
6. Write a `Square(Rectangle)` subclass whose `__init__` takes one `side`.
7. Explain the error:
   ```python
   class Unit:
       def describe():
           return "a unit"
   Unit().describe()
   ```
8. Write a `Counter`-like class supporting `c["hay"] += 1` using
   `__getitem__` and `__setitem__`, defaulting missing keys to 0.

---

## Solutions

**1.**
```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says woof"

print(Dog("Rex").bark())
```

**2.**
```python
class InsufficientFunds(Exception):
    pass


class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError(f"deposit must be positive, got {amount}")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFunds(f"need {amount}, have {self.balance}")
        self.balance -= amount
        return self.balance
```

**3.**
```python
    def __repr__(self):
        return f"BankAccount({self.owner!r}, balance={self.balance})"
```

**4.**
```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def __eq__(self, other):
        return (self.width, self.height) == (other.width, other.height)

    def __repr__(self):
        return f"Rectangle({self.width}, {self.height})"
```

**5.**
```python
from dataclasses import dataclass

@dataclass
class Rectangle:
    width: float
    height: float

    def area(self) -> float:
        return self.width * self.height
```
`__init__`, `__repr__` and `__eq__` all come free.

**6.**
```python
class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
```

**7.** `describe` is missing `self`. Calling `Unit().describe()` passes the
instance automatically, so Python reports
`TypeError: describe() takes 0 positional arguments but 1 was given`. Add
`self` to the definition.

**8.**
```python
class Tally:
    def __init__(self):
        self._counts = {}

    def __getitem__(self, key):
        return self._counts.get(key, 0)

    def __setitem__(self, key, value):
        self._counts[key] = value

    def __repr__(self):
        return f"Tally({self._counts})"


t = Tally()
t["hay"] += 1        # reads 0 via __getitem__, writes 1 via __setitem__
t["hay"] += 1
print(t)             # Tally({'hay': 2})
```
`+=` on an indexed target is a read followed by a write, which is exactly why
both methods are needed.
