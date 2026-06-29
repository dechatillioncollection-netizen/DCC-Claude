# Click Defenders — Developer Reference

A complete reference to the game's systems, stats, and formulas, taken
directly from `game.html`. Use this to understand the design before
extending it. All numbers are the current balance values.

> **One-file architecture.** Everything (HTML + CSS + JS) lives in
> `game.html`. No build step, no libraries. The `<script>` is organised
> into numbered sections (search for `0. GAME STATE MACHINE`,
> `1. PERSISTENT STATE`, … `8. UI / SCREENS`).

---

## 1. High-level concept

A cookie-clicker-style base-defence game. Enemies march **straight down**
the screen toward your base at the bottom. You:

- **Click** anywhere on the battlefield to fire a shot (click damage).
- Earn **coins** for kills, spent on **units** and **talent points**.
- Equip up to **5 units** that fight automatically.
- Survive escalating **waves**; every **5th wave is a boss**.
- Beating a boss grants a choice of **3 temporary run buffs**.
- On death the run ends, wave resets to 0, but all permanent progress is kept.

---

## 2. Game state machine

The single source of truth is `GS` (global string). `setState(s)` shows
exactly one screen at a time, so screens never overlap. The simulation
only advances while `GS === "COMBAT"`.

| State          | Screen                       | World running? |
|----------------|------------------------------|----------------|
| `MENU`         | Main menu (fantasy splash)   | no |
| `COMBAT`       | Battlefield + combat stat bar| **yes** |
| `UPGRADES`     | Units, shop, inventory, talents | no |
| `INFO`         | How-to-play                  | no |
| `BOSS_REWARD`  | 3-choice buff overlay (over frozen combat) | no (paused) |
| `DEAD`         | Death summary                | no |

Navigation: `MENU → COMBAT` (Play), `MENU ↔ UPGRADES`, `MENU ↔ INFO`,
`COMBAT → BOSS_REWARD → COMBAT`, `COMBAT → DEAD → MENU`.

**Rule:** all economy/equip actions (`buyUnit`, `equip`, `unequip`,
`buyTalent`, `buyTalentPoint`) are guarded by `inUpgradeScreen()` and are
inert outside the UPGRADES screen.

---

## 3. Persistence

- Saved to `localStorage` under key `clickDefendersSave_v2` via `save()`.
- The `persist` object holds everything that survives death **and** reloads:
  `coins`, `talentPoints`, `ownedUnits` (`{id: level}`), `equipped`
  (array ≤5 ids), `talents` (`{id: ranks}`), `tpBought`.
- The `run` object (rebuilt by `freshRun()` each run) holds per-run state:
  `wave`, `baseHP`, `baseMaxHP`, `enemies`, `effects`, `projectiles`,
  **`buffs`** (temporary boss upgrades), spawn/wave timers.

**On death (`endRun`):** `run.active=false`, `run.buffs=[]` (buffs reset),
wave resets to 0. **Kept:** coins, owned units, levels, equipped loadout,
talents, talent points.

**New-player start (`init`):** one Archer at level 1, equipped, and 60 coins.

---

## 4. The battlefield (constants)

| Thing | Value |
|-------|-------|
| Canvas | 740 × 540 px |
| Base | 200 × 46 px box, centred at bottom (`BASE.x=370, BASE.y≈504`) |
| `BASE_LINE` | `BASE.y - 23` ≈ **481** — the y where enemies start damaging the base |
| Enemy spawn point | `y = -20`, `x` random in `[60, 680]` |
| Enemy movement | straight down at the enemy's speed |
| Frame step | `dt` clamped to ≤ 0.05 s |

**Game speed:** `gameSpeed` is 1 or 2. 2× runs the **same fixed update
step twice per frame** (sub-stepping), so fight outcomes are identical to
1× — only wall-clock pace changes. It is session-only (not saved).

---

## 5. Units

10 archetypes. You may **own** any number (each levels up) but **equip ≤5**.
Only equipped units fight. Stats scale per level via
`unitStat(id,key) = base + grow*(level-1)`.

| Unit | Emoji | Base cost | dmg | cooldown (s) | Key stats | Role |
|------|-------|-----------|-----|--------------|-----------|------|
| Archer | 🏹 | 50 | 4 (+2/lvl) | 0.60 | single target | cheap, fast |
| Mage | 🔮 | 130 | 9 (+5/lvl) | 1.40 | splash r=60 | splash damage |
| Knight | 🛡️ | 110 | 3 (+2/lvl) | 0.80 | guard r=130, slow 0.45 | melee zone defender |
| Cannon | 💣 | 220 | 30 (+14/lvl) | 2.60 | splash r=95 | high AoE |
| Priest | ✨ | 150 | 0 | 1.50 | heal 6 (+4/lvl) | heals base |
| Ranger | 🎯 | 95 | 7 (+3/lvl) | 0.90 | — | anti fast/flying |
| Assassin | 🗡️ | 190 | 8 (+4/lvl) | 1.10 | critMul ×4 | anti tank/boss |
| Ice Wizard | ❄️ | 145 | 5 (+3/lvl) | 1.20 | slow 0.4, dur 2.5s, splash r=70 | crowd control |
| Fire Wizard | 🔥 | 145 | 5 (+2/lvl) | 1.20 | burn 4 (+2/lvl), dur 3s | damage over time |
| Engineer | 🔧 | 165 | 0 | 2.00 | buff +12% (+4%/lvl), repair 3 (+2/lvl) | support |

**Targeting & behaviour (per attack tick):**

- **Archer / Ranger** — quick green arrow. Archer hits the enemy nearest
  the base (type `archer`). Ranger prefers the nearest **fast/flying**
  enemy (falls back to nearest-to-base) and deals **×1.5** to fast/flying.
- **Mage** — purple orb + splash burst; AoE damage to all within splash
  radius (type `mage`).
- **Cannon** — orange explosion (burst + ring); AoE damage within splash
  radius (type `cannon`).
- **Ice Wizard** — frost ring; damages + **slows** every enemy in radius
  (type `ice`). Slow amount = `0.4 + 0.05·rank(t_ice_slow)`, +0.3 if
  Deep Freeze/Frozen Heart (capped 0.9), lasting 2.5 s.
- **Fire Wizard** — direct hit (type `fire`) **plus** a burn DoT. Burn DPS
  = `burn · (1+0.25·rank) · allDmgMul · typeMul(fire)`, lasting 3 s
  (×2 with Wildfire). Burn applies silently each frame and shows one
  combined fire number ~every 0.45 s.
- **Knight** — guards a **zone** (radius 130) in front of the wall, drawn
  as a translucent arc + dashed boundary + "🛡️ Knight Guard" label. Each
  attack damages **and** slows every enemy inside (type `physical`,
  slow = `0.45·(1+0.10·rank(t_knight_block))`, 0.6 s).
- **Assassin** — targets the **highest-HP** enemy; deals a crit
  (×`critMul`, base 4, +0.6/rank) vs **bosses and tanks**, normal damage
  otherwise (type `physical`).
- **Priest** — heals the base by `heal · (1+0.20·rank(t_priest_heal))`,
  ×1.2 with Blessing.
- **Engineer** — heals base (repair) each tick **and**, while equipped,
  passively multiplies **all** unit damage by `1 + buff·(1+0.25·rank)`
  (`engineerBuffMul()`).

**Shop economy:**

- Buying an owned unit **levels it up** (no separate "upgrade" path).
- Cost: `unitCost(id) = ceil(baseCost · 1.6^level · (1 − costReduce))`
  where `level` = current owned level (0 for first purchase) and
  `costReduce` is the Bargaining talent total.
- First-ever purchase of a unit auto-equips it if a slot is free.

**Final per-hit unit damage:**
`dmgFor = unitStat(dmg) · specificDmgTalentMul · allDmgMul`, where
`allDmgMul = (1 + 0.08·rank(all_dmg)) · buffProd(allDmgMul) · engineerBuffMul`.

---

## 6. Enemies

Base HP for a wave: **`enemyBaseHP(wave) = 10 · 1.22^wave`** (exponential).
Per enemy: `hp = enemyBaseHP · hpMul · rand(0.9,1.1)` (bosses skip the jitter).

| Type | Name | hpMul | speed | reward | base dmg | radius | flags |
|------|------|-------|-------|--------|----------|--------|-------|
| basic  | Grunt  | 1.0 | 26 | 4 | 6 | 14 | — |
| fast   | Runner | 0.7 | 56 | 5 | 5 | 11 | fast |
| tank   | Brute  | 3.2 | 17 | 9 | 14 | 20 | — |
| flying | Flyer  | 0.9 | 40 | 7 | 7 | 12 | fast, flying |
| boss   | BOSS   | 26  | 14 | 120 | 40 | 34 | boss |

**Per-wave scaling applied at spawn:**
- speed `= baseSpeed · (1 + 0.015·wave)`
- reward `= ceil(baseReward · (1 + 0.06·wave))`
- damage to base `= baseDmg + 0.6·wave`

**Status flags on each enemy:** `slowT/slowAmt` (active slow),
`burnT/burnDps/burnTick/burnEmit` (burn DoT + number throttling),
`flash` (white hit flash).

When an enemy crosses `BASE_LINE` it deals
`dmg · (1 − 0.04·rank(base_armor)) · buffProd(dmgTakenMul)` to the base and
is removed. Base HP ≤ 0 → `endRun()`.

---

## 7. Waves

`buildWave(wave)` returns a spawn queue:

- **Boss waves** (`wave % 5 === 0`): one `boss` + `3 + floor(wave/5)`
  escorts chosen from `basic/fast/tank`.
- **Normal waves:** `count = 6 + floor(1.3·wave)` enemies drawn from a
  weighted pool. Weights shift toward stronger types over time:

  | Type | Weight | Appears from |
  |------|--------|--------------|
  | basic  | `max(1, 8 − 0.4·wave)` | wave 1 (fades out) |
  | fast   | `2 + 0.25·wave` | wave 2 |
  | tank   | `1 + 0.30·wave` | wave 4 |
  | flying | `1 + 0.25·wave` | wave 6 |

- Spawn interval: `rand(0.45, 0.85)` s (boss queue 0.2 s).
- Wave clears when the queue is empty **and** no enemies remain; after a
  **1.2 s** gap the next wave starts and you gain a clear bonus of
  **`10 + 3·wave`** coins.

---

## 8. Clicking & AOE

On `canvas` click (only in COMBAT):

1. A shot always fires toward the clicked point (even empty space).
2. **Click damage** = `clickDamage()` (see below). With probability
   `0.03·rank(click_crit)` it crits for **×3** (bright/large number).
3. **Direct hit:** the nearest enemy within `r + 16` px of the click takes
   full click damage (type `physical`).
4. **Click Splash** talent: on a direct hit, splash `dmg·0.5` to enemies
   within its radius.
5. **Click Shockwave (AOE)** talent: always blasts the clicked point with a
   distinct burst+dashed-ring visual; deals `dmg·(0.5 + 0.1·rank)` to all
   enemies in radius (type `cannon`). Radius **and** damage grow with rank.

`clickDamage() = (1 + 2·rank(click_dmg)) · (×2 if Power Clicks) · buffProd(clickMul)`.

---

## 9. Talent tree (permanent)

Talent points are bought with coins: **`nextTPCost = ceil(100 · 1.18^tpBought)`**
(rises each purchase). Each talent has a point `cost` per rank and a `max`.
`talentEffect(id) = rank · per`.

### Click branch
| Talent | Effect / rank | Max | Pt cost |
|--------|---------------|-----|---------|
| Sharper Clicks | +2 click damage | 20 | 1 |
| Click Crit | +3% click crit chance (×3) | 10 | 1 |
| Click Splash | +12 splash radius (on hit) | 6 | 2 |
| Click Shockwave (AOE) | +12 AOE radius | 8 | 2 |

### Units (general) branch
| Talent | Effect / rank | Max | Pt cost |
|--------|---------------|-----|---------|
| Armory | +8% all unit damage | 15 | 1 |
| Drill Training | +6% attack speed | 12 | 1 |
| Bargaining | −3% unit cost | 10 | 2 |

### Specific-unit branch
| Talent | Effect / rank | Max | Pt |
|--------|---------------|-----|----|
| Archer Damage | +15% archer dmg | 8 | 1 |
| Archer Speed | +8% archer attack speed | 8 | 1 |
| Mage Damage | +15% mage dmg | 8 | 1 |
| Mage Splash | +15 mage splash radius | 6 | 1 |
| Cannon Area | +20 cannon splash radius | 6 | 1 |
| Priest Healing | +20% priest heal | 8 | 1 |
| Knight Guard | +10% knight slow (guard radius bonus is negligible in current impl) | 6 | 1 |
| Assassin Crit | +0.6× assassin crit | 8 | 1 |
| Ice Slow | +5% ice slow strength | 6 | 1 |
| Fire Burn | +25% fire burn dmg | 8 | 1 |
| Engineer Output | +25% engineer buff & repair | 6 | 1 |

### Defence branch
| Talent | Effect / rank | Max | Pt |
|--------|---------------|-----|----|
| Reinforced Walls | +25 base max HP | 20 | 1 |
| Repair Crew | +1 HP/sec regen | 10 | 1 |
| Armour Plating | +4% damage reduction | 10 | 2 |

**Specific-unit talents** are applied via `unitTalentBonus(unitId, stat)`,
returning `{mul, add}`: `splash`/`guard`/`crit` are additive, everything
else multiplicative.

Base max HP: `computeBaseMaxHP() = floor((100 + 25·rank(base_hp)) · (1.5 if Fortify) · buffProd(baseHpMul))`.

---

## 10. Boss run-buffs (temporary)

After each boss, `BOSS_REWARD` offers **3 random** choices. The chosen id
is pushed to `run.buffs` and cleared on death. Implemented **data-driven**
via the `BU` lookup and helpers `buffSum`, `buffProd`, `buffFlag`, and the
per-type `typeMul(type)`.

**Recognised modifier fields** (add these to a buff object to make a new one):

| Field | Meaning | Combined via |
|-------|---------|--------------|
| `dmgMul:{type:mult}` | scale a damage type (physical/archer/mage/fire/ice/cannon) | product (`typeMul`) |
| `allDmgMul` | scale all unit damage | product |
| `baseHpMul` | scale base max HP | product |
| `dmgTakenMul` | scale damage the base takes (>1 = worse) | product |
| `atkSpeedAdd` | flat addition to attack-speed multiplier | sum |
| `coinMul` | scale coin rewards | product |
| `lifesteal` | heal `fraction · maxHP` per kill | sum |
| `regenAdd` | flat HP/sec base regen | sum |
| `clickMul` | scale click damage | product |
| `noRegen` | disables all base regen (flag) | flag |
| `cursed:true` | UI flag → red styling + ☠ badge | — |

A few legacy buffs still key off `hasBuff(id)` directly because their
effect is too specific to tabulate: `archer_multi` (extra archer shot),
`mage_splash` (×1.6 mage radius), `cannon_area` (×1.5 cannon dmg),
`priest_fast` (×1.2 heal + faster), `fire_long` (×2 burn duration),
`ice_strong` / `frozen_heart` (+0.3 slow), `click2x` (×2 click),
`atkspd` (+0.25 attack speed), `basehp` (×1.5 base HP), `coins` (×1.25),
`regen` (legacy; also carries `regenAdd:3`), `alldmg` (carries `allDmgMul:1.3`).

### Standard buffs (12)
Power Clicks (×2 click), Frenzy (+25% atk speed), Fortify (+50% base HP),
Greed (+25% coins), Arcane Blast (+60% mage splash), Multishot (extra
archer shot), Heavy Ordnance (+50% cannon dmg), Blessing (priests heal
50% faster), Wildfire (burn ×2 duration), Deep Freeze (stronger slow),
Overcharge (+30% all dmg), Field Medic (+3 HP/s regen).

### Extra variety buffs (11)
Sharpshooter (+100% archer/ranger), Arcane Surge (+120% mage), Demolition
(+120% cannon), Inferno (+100% fire), Permafrost (+100% ice), Bulwark
(−30% damage taken), Swift Hands (+40% atk speed), Fortune (+50% coins),
Vampiric Walls (heal 2% max HP/kill), Juggernaut (+80% base HP), Warlord
(+50% all dmg).

### Cursed buffs (7) — big boon + real downside
| Buff | Boon | Curse |
|------|------|-------|
| Pyromancer's Pact 😈 | ×3 fire damage | ½ physical damage |
| Glass Cannon 💎 | +150% all damage | base max HP halved |
| Blood Ritual 🧛 | ×3 coins | +40% base damage taken |
| Frozen Heart ❄️ | ×3 ice + stronger slow | fire cut to 25% |
| Berserker Rage 🪓 | +120% physical, +50% atk speed | regen off, +20% damage taken |
| Reckless Assault 💀 | +80% atk speed | −30% damage |
| Overclock 🔋 | +200% click damage | −40% unit damage |

Cursed choices stack with everything multiplicatively, e.g. running both
Pyromancer (fire ×3) and Frozen Heart (fire ×0.25) yields fire ×0.75.

---

## 11. Damage-type colour system

One shared map (`DMG`) drives **both** floating numbers and attack/impact
effect colours. Use `dmgColor(type)` everywhere.

| Type | Colour | Used by |
|------|--------|---------|
| physical | `#e8edf5` white/grey | clicks, knight, assassin |
| archer | `#7cff8a` green | archer, ranger |
| mage | `#c08bff` purple | mage |
| fire | `#ff7a33` orange | fire wizard, burn |
| ice | `#a6e6ff` pale blue | ice wizard |
| cannon | `#ffc24a` orange-yellow | cannon, click AOE |
| heal | `#5dffa0` green | priest, engineer, lifesteal |
| crit | `#ffe14d` bright | any crit (larger, glowing, "!") |
| enemy | `#ff5252` red | damage dealt to the base |

**Floating numbers** spawn with random X/Y jitter + sideways drift, float
up, and fade, so repeated hits don't overlap. Crits render larger/brighter
with a glow; heals show `+n`.

**Effect kinds** (`run.effects`): `text` (floating number),
`boom` (`ring` expanding outline or `burst` filled blob),
`aoe` (click shockwave: translucent fill + dashed ring).
**Projectiles** (`run.projectiles`): style `arrow` (thin line) or `orb`
(glowing ball with trail).

---

## 12. Damage pipeline (summary)

```
unit attack → dmgFor = unitStat(dmg) · specificTalentMul · allDmgMul
            → damageEnemy(e, dmgFor, {type})
                 amount *= typeMul(type)        // cursed/typed buffs
                 e.hp -= amount
                 spawnText(... dmgColor(type) / crit colour ...)
                 if dead → killEnemy → coins (·coinMul, ·1.25 Greed)
                                     → lifesteal heal
                                     → if boss: onBossKilled → BOSS_REWARD
```

Click damage and splash/AOE flow through the same `damageEnemy`, so typed
buffs and colours apply uniformly. Burn is the one exception: it bakes
`typeMul("fire")` into `burnDps` at apply time and ticks via
`damageEnemySilent` (emitting one throttled fire number).

---

## 13. Extending the game — quick recipes

- **New unit:** add an entry to `UNITS` (base/grow stats), then a `case` in
  `unitAttack(id)` for its behaviour, and (optionally) specific talents.
  The shop/inventory/equip UI is fully data-driven and needs no changes.
- **New enemy:** add to `ENEMY_TYPES` and reference it in `buildWave`.
- **New talent:** add to `TALENTS` with `branch/name/desc/max/cost/per`
  (+ `unit`/`stat` for a specific-unit talent). The talent UI auto-renders
  by branch.
- **New run buff:** add to `BOSS_UPGRADES` using the recognised modifier
  fields in §10 — no other code needed for tabulated effects. Set
  `cursed:true` to flag a downside visually.
- **New damage type / colour:** add to the `DMG` map; pass `{type}` from
  the attack into `damageEnemy`.
- **Rebalance:** all knobs are the literals in `UNITS`, `ENEMY_TYPES`,
  the `enemyBaseHP`/`waveSpeedMul`/`waveRewardMul`/`buildWave` formulas,
  `TALENTS`, and `BOSS_UPGRADES`.
