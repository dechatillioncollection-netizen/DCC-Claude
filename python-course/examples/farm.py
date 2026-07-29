"""
farm.py — a tiny re-creation of The Farmer Was Replaced, in real Python.

This gives you back the API you already know (move, harvest, plant,
can_harvest, ...) but implemented in plain Python you can read and change.
Everything here uses only what the course covers up to Lesson 16.

Run it directly to see the demo program:

    python farm.py

Then open the bottom of this file and write your own drone program in
`my_program()`.
"""

from dataclasses import dataclass, field
import time

# ---------------------------------------------------------------------------
# Data tables — separate from the logic, so editing these changes behaviour
# ---------------------------------------------------------------------------

NORTH = "north"
EAST = "east"
SOUTH = "south"
WEST = "west"

DIRECTIONS = {
    NORTH: (0, -1),
    EAST: (1, 0),
    SOUTH: (0, 1),
    WEST: (-1, 0),
}

# Each crop: how many ticks it takes to ripen, and what it sells for.
CROPS = {
    "grass":   {"grow_time": 2, "value": 1},
    "wheat":   {"grow_time": 4, "value": 3},
    "carrot":  {"grow_time": 7, "value": 8},
    "pumpkin": {"grow_time": 12, "value": 20},
}

WORLD_SIZE = 6
TICKS_PER_ACTION = 1


# ---------------------------------------------------------------------------
# The world
# ---------------------------------------------------------------------------

@dataclass
class Tile:
    """One square of the farm."""
    crop: str | None = None
    planted_at: int = 0

    def is_ripe(self, now: int) -> bool:
        if self.crop is None:
            return False
        return now - self.planted_at >= CROPS[self.crop]["grow_time"]


@dataclass
class Farm:
    """The whole simulation: the grid, the drone, the clock and the score."""
    size: int = WORLD_SIZE
    x: int = 0
    y: int = 0
    tick: int = 0
    coins: int = 0
    harvested: dict = field(default_factory=dict)
    tiles: dict = field(default_factory=dict)

    def __post_init__(self) -> None:
        # dataclass calls this after __init__; build the grid here.
        for y in range(self.size):
            for x in range(self.size):
                self.tiles[(x, y)] = Tile()

    # -- internals ----------------------------------------------------------

    def _advance(self, ticks: int = TICKS_PER_ACTION) -> None:
        self.tick += ticks

    def current_tile(self) -> Tile:
        return self.tiles[(self.x, self.y)]

    # -- the drone API (the part that mirrors the game) ----------------------

    def move(self, direction: str) -> bool:
        """Move one tile. Walking off an edge wraps to the other side."""
        if direction not in DIRECTIONS:
            raise ValueError(f"unknown direction: {direction!r}")
        dx, dy = DIRECTIONS[direction]
        self.x = (self.x + dx) % self.size
        self.y = (self.y + dy) % self.size
        self._advance()
        return True

    def plant(self, crop: str) -> bool:
        """Plant a crop on the current tile. Returns False if it's occupied."""
        if crop not in CROPS:
            raise ValueError(f"unknown crop: {crop!r}")
        tile = self.current_tile()
        if tile.crop is not None:
            return False
        tile.crop = crop
        tile.planted_at = self.tick
        self._advance()
        return True

    def can_harvest(self) -> bool:
        """True if the current tile holds a ripe crop."""
        return self.current_tile().is_ripe(self.tick)

    def harvest(self) -> str | None:
        """Harvest the current tile. Returns the crop name, or None."""
        tile = self.current_tile()
        if not tile.is_ripe(self.tick):
            self._advance()
            return None

        crop = tile.crop
        tile.crop = None
        self.coins += CROPS[crop]["value"]
        self.harvested[crop] = self.harvested.get(crop, 0) + 1
        self._advance()
        return crop

    def measure(self) -> str | None:
        """What is planted here, ripe or not."""
        return self.current_tile().crop

    def get_pos(self) -> tuple:
        return self.x, self.y

    def num_items(self, crop: str) -> int:
        return self.harvested.get(crop, 0)

    # -- display ------------------------------------------------------------

    def render(self) -> str:
        """Return the farm as a printable grid."""
        symbols = {None: ".", "grass": "g", "wheat": "w",
                   "carrot": "c", "pumpkin": "p"}
        lines = []
        for y in range(self.size):
            row = []
            for x in range(self.size):
                tile = self.tiles[(x, y)]
                mark = symbols[tile.crop]
                if tile.is_ripe(self.tick):
                    mark = mark.upper()          # ripe crops in capitals
                if (x, y) == (self.x, self.y):
                    mark = f"[{mark}]"
                else:
                    mark = f" {mark} "
                row.append(mark)
            lines.append("".join(row))
        header = f"tick {self.tick}   coins {self.coins}   pos {self.get_pos()}"
        return header + "\n" + "\n".join(lines)

    def show(self, pause: float = 0.0) -> None:
        print(self.render())
        print()
        if pause:
            time.sleep(pause)

    def report(self) -> str:
        """Return an end-of-run summary."""
        lines = [f"Finished after {self.tick} ticks with {self.coins} coins.", ""]
        if not self.harvested:
            lines.append("Nothing was harvested.")
            return "\n".join(lines)

        lines.append(f"{'crop':<10}{'count':>6}{'value':>7}")
        for crop, count in sorted(self.harvested.items()):
            lines.append(f"{crop:<10}{count:>6}{count * CROPS[crop]['value']:>7}")
        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Your programs go here
# ---------------------------------------------------------------------------

def serpentine(farm: Farm) -> None:
    """Walk every tile in a snaking path, planting and harvesting wheat."""
    for row in range(farm.size):
        for _ in range(farm.size):
            if farm.can_harvest():
                farm.harvest()
            if farm.measure() is None:
                farm.plant("wheat")
            farm.move(EAST)
        farm.move(SOUTH)


def harvest_ripe_only(farm: Farm) -> int:
    """One sweep of the farm, harvesting whatever is ready. Returns the count."""
    picked = 0
    for _ in range(farm.size):
        for _ in range(farm.size):
            if farm.can_harvest():
                farm.harvest()
                picked += 1
            farm.move(EAST)
        farm.move(SOUTH)
    return picked


def best_crop() -> str:
    """Return the crop with the best value per growing tick."""
    return max(CROPS, key=lambda name: CROPS[name]["value"] / CROPS[name]["grow_time"])


def my_program(farm: Farm) -> None:
    """
    YOUR CODE GOES HERE.

    You have: farm.move(NORTH/EAST/SOUTH/WEST), farm.plant("wheat"),
    farm.harvest(), farm.can_harvest(), farm.measure(), farm.get_pos(),
    farm.num_items("wheat"), farm.show().

    Try: plant the most profitable crop everywhere, then keep sweeping
    until you have 200 coins.
    """
    crop = best_crop()

    # First pass: plant everything.
    for _ in range(farm.size):
        for _ in range(farm.size):
            if farm.measure() is None:
                farm.plant(crop)
            farm.move(EAST)
        farm.move(SOUTH)

    # Then keep sweeping, replanting as we go, until we're rich enough.
    sweeps = 0
    while farm.coins < 200 and sweeps < 60:
        for _ in range(farm.size):
            for _ in range(farm.size):
                if farm.can_harvest():
                    farm.harvest()
                if farm.measure() is None:
                    farm.plant(crop)
                farm.move(EAST)
            farm.move(SOUTH)
        sweeps += 1


def main() -> None:
    print("=" * 44)
    print("The Farmer Was Replaced — but in real Python")
    print("=" * 44)
    print()

    farm = Farm()
    print("Starting farm (capital letters = ripe, [ ] = the drone):\n")
    farm.show()

    print(f"Most profitable crop: {best_crop()}\n")

    my_program(farm)

    print("Final state:\n")
    farm.show()
    print(farm.report())


if __name__ == "__main__":
    main()
