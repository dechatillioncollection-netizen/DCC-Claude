# ⚔ Click Defenders

A cookie-clicker-style base-defence browser game. Click enemies to shoot them,
earn coins, build an army of automatic units, spend on a talent tree, and
survive escalating waves — with a boss every 5th wave that grants a temporary
run buff. Everything runs from a single HTML file, offline, with no build step
and no external libraries.

## How to start the game

**Just open `game.html` in a web browser.** Double-click it, or drag it into a
browser tab. It runs fully offline from `file://` — no server, no install.

- Keep the folder layout intact so the game can find its art and mod file
  (`game.html` loads `run-buffs.js` and the `sprites/` images by relative path).
- If you prefer, you can serve the folder with any static web server and open
  it there, but that is optional.
- Progress auto-saves to your browser (`localStorage`). You can also export a
  save to a `.txt` file from the main menu or the Upgrades screen, and import
  it later or on another device.

## How to play (quick version)

- **Main Menu → Play** to start a run. (Or **Run Challenges** to pick an
  optional harder modifier first.)
- **Click anywhere on the battlefield** to fire toward that spot.
- Your **equipped units** (up to 5) attack automatically.
- Kill enemies for **coins**; spend them in **Upgrades** on units and talent
  points. Enemies reach your base if not stopped — if base HP hits 0 the run
  ends and the wave resets to 0.
- Coins, owned units, unit levels, permanent upgrades and talents are kept
  after death; temporary boss buffs and the active challenge reset.
- The in-game **Info** screen explains units, enemies, bosses and buffs in
  more detail.

## What the files are for

| File / folder | Purpose |
|---------------|---------|
| `game.html` | The entire game (HTML + CSS + JavaScript). This is the entry point — open this to play. |
| `run-buffs.js` | **Optional** mod file for the boss run-buff pool. Sets `window.CD_RUN_BUFFS`. Edit the numbers to retune buffs, or delete the file to fall back to the built-in list. See the comments at the top of the file. |
| `sprites/units/<id>.png` | Unit artwork (archer, mage, knight, …). Filenames match the unit ids. |
| `sprites/enemies/<type>.png` | Enemy artwork (basic, fast, tank, flying, boss). |
| `sprites/background.png` | The battlefield background (top-down field with the road). Swap this PNG to reskin the field. |
| `sprites/castle.png` | Default fortress sprite (fallback). |
| `sprites/castle/` | Castle **damage-state** sprites (`full.png` / `damaged.png` / `destroyed.png`) shown as base HP drops. See `sprites/castle/README.txt`. |
| `sprites/README.txt` | Notes on the sprite pack and naming. |
| `GAME_REFERENCE.md` | Detailed developer reference: every system, stat and formula. |
| `patchnotes.txt` | The change log (newest at top). |
| `CLAUDE.md` | Project conventions followed when developing the game. |

## Modding / reskinning

- **Art:** replace any PNG in `sprites/` with your own (keep the same filename
  and roughly the same dimensions). Anything missing falls back gracefully —
  units/enemies fall back to coloured circles, the castle/background fall back
  to procedural drawing.
- **Castle damage states:** edit `sprites/castle/full.png`, `damaged.png` and
  `destroyed.png` to look progressively wrecked (they start as duplicates).
- **Run buffs:** edit `run-buffs.js`. The magnitude of every buff lives in data
  fields (e.g. `clickMul`, `dmgMul`, `coinMul`), so changing a number changes
  the actual effect. Bad/invalid entries are ignored, so you can't break the
  game.

## Requirements

A modern web browser. No internet connection required to play.
