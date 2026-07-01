# Click Defenders — Project Guide

A cookie-clicker-style base-defence browser game. This file records the
conventions to follow when working on it. Read it before making changes.

## Files
- `game.html` — the whole game (HTML + CSS + JS in one file). This is the entry point.
- `run-buffs.js` — OPTIONAL external mod file for the boss run-buff pool (`window.CD_RUN_BUFFS`).
- `sprites/` — unit and enemy PNGs (`sprites/units/<id>.png`, `sprites/enemies/<type>.png`).
- `GAME_REFERENCE.md` — detailed dev reference for every system/stat/formula.
- `patchnotes.txt` — the change log.

## Golden rules
1. **Launches from one file.** `game.html` must run by simply opening it in a
   browser, **offline** (`file://`). No external libraries, no build step, no
   CDN. Optional companion files (e.g. `run-buffs.js`) load via a local
   `<script src>` and MUST degrade gracefully if the file is missing.
2. **Always update `patchnotes.txt`** on every change, following the
   instruction header at the top of that file (newest entry on top;
   HOTFIX = fix only, UPDATE = adds 1–3 things, MAJOR = adds >3 things;
   timestamp in South Africa Standard Time via `TZ='Africa/Johannesburg' date`).
3. **Keep it data-driven.** Units, enemies, talents, run-buffs and challenges
   are data tables kept separate from logic. Effect magnitudes live in the
   data (e.g. a buff's numeric fields), so editing the data changes actual
   behaviour — not just labels. Adding content should not require new logic
   where a data field can express it.

## Architecture conventions
- **State machine `GS`:** MENU / COMBAT / UPGRADES / INFO / CHALLENGES /
  SETTINGS / BOSS_REWARD / DEAD. `setState()` shows exactly one screen; only
  `COMBAT` advances the simulation. Upgrades/economy actions are inert outside
  the Upgrades screen.
- **Persistence split:** `persist` = permanent progress (coins, ownedUnits,
  equipped, talents, tpBought) saved to `localStorage`. `run` = per-run state
  rebuilt each run. Temporary boss buffs and the active challenge live on `run`
  and reset on death; coins/units/levels/talents persist through death.
- **Coordinates & hit testing:** gameplay runs in the logical 1600×900 field
  regardless of render resolution. `e.r` is the gameplay radius
  (splash/collision/reaching the base); the clickable target uses
  `enemyHitR(e)` which tracks the drawn sprite. Map clicks with
  `CANVAS_W / rect.width`.
- **Sprites:** drawn via `drawSprite`, which falls back to a coloured circle if
  the image hasn't loaded, so the game still runs without art.
- **Balance-preserving changes:** prefer approaches that don't alter outcomes,
  e.g. 2× speed sub-steps the fixed update instead of scaling `dt`; enemy speed
  rescales when the field size changes.

## Save / import
- Export **only permanent fields** to a `.txt`; never export run/enemies/buffs/wave.
- Validate and sanitise imports (check types, clamp values, drop unknown ids);
  never overwrite a good save with a bad file.

## Quality bar
- Comment the main systems; keep the code easy to edit and expand.
- Visuals simple but polished; readable UI.
- Before committing, sanity-check: the `<script>` parses, referenced element
  IDs exist, and a headless run of a few hundred frames doesn't throw
  (do this with Node + a stubbed DOM/canvas).

## Git / workflow
- Develop on the designated feature branch; commit with clear, descriptive
  messages; push when a change is complete. Do not open a pull request unless
  asked.
- Do not put internal model identifiers into committed files.
- All timestamps use South Africa Standard Time (SAST, UTC+2).
