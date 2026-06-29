/* ============================================================
   CLICK DEFENDERS — RUN BUFFS (MODDABLE)
   ------------------------------------------------------------
   This file is OPTIONAL. If it is present next to game.html, the game
   validates the list below and uses it for boss run-buff rewards
   INSTEAD of its built-in defaults. Delete or rename this file and the
   game falls back to its internal list — game.html still works as a
   single, offline file on its own.

   HOW TO MOD:
   - Edit, add, or remove entries in the CD_RUN_BUFFS array below.
   - Each buff is a plain object. Required: `id` (unique string) and
     `name` (string). Everything else is optional.
   - The game sanitises this list on load: entries missing id/name, or
     with the wrong types, are skipped; unknown fields are ignored; bad
     numbers are dropped. A broken file can never crash the game.
   - Save the file and reload game.html in your browser.

   SUPPORTED FIELDS
     icon            string  emoji/badge shown on the choice card
     desc            string  description text
     cursed          bool    styles the card red with a ☠ badge
     dmgMul          object  per damage-TYPE multiplier. Valid types:
                             physical, archer, mage, fire, ice, cannon
                             e.g. { fire: 3, physical: 0.5 }
     allDmgMul       number  multiplies ALL unit damage
     baseHpMul       number  multiplies base max HP
     dmgTakenMul     number  multiplies damage the base takes (>1 = worse)
     atkSpeedAdd     number  flat add to attack-speed multiplier (0.25 = +25%)
     coinMul         number  multiplies coin rewards
     lifesteal       number  heal this fraction of base max HP per kill (0.02 = 2%)
     regenAdd        number  flat HP/sec base regen
     clickMul        number  multiplies click damage
     enemySpeedMul   number  multiplies speed of enemies spawned after the pick
     hpDrain         number  base loses this many HP/sec while in combat
     noRegen         bool    disables ALL base regen
     strongSlow      bool    boosts Ice Wizard slow (+0.15)
     longBurn        bool    extends Fire Wizard burn duration (x1.5)

   All multipliers from multiple active buffs stack MULTIPLICATIVELY.

   NOTE: A few "legacy" buffs are also recognised by their id directly in
   game.html for effects too specific to tabulate here:
     archer_multi (extra archer shot), mage_splash (+60% mage splash),
     cannon_area (+50% cannon dmg), priest_fast (priests heal faster),
     fire_long (x2 burn duration), ice_strong / frozen_heart (+0.3 slow),
     click2x (x2 click), atkspd (+25% atk speed), basehp (+50% base HP),
     coins (+25% coins). Keep those ids if you want those effects.
   ============================================================ */
window.CD_RUN_BUFFS = [
  // ---- Standard buffs ----
  { id:"click2x",     icon:"👆", name:"Power Clicks", desc:"Double click damage this run." },
  { id:"atkspd",      icon:"⚡", name:"Frenzy",       desc:"Units attack 25% faster this run." },
  { id:"basehp",      icon:"🧱", name:"Fortify",      desc:"+50% base max HP this run (and heal)." },
  { id:"coins",       icon:"💰", name:"Greed",        desc:"Earn 25% more coins this run." },
  { id:"mage_splash", icon:"🔮", name:"Arcane Blast", desc:"Mages deal +60% splash this run." },
  { id:"archer_multi",icon:"🏹", name:"Multishot",    desc:"Archers fire an extra shot this run." },
  { id:"cannon_area", icon:"💣", name:"Heavy Ordnance",desc:"Cannons +50% area damage this run." },
  { id:"priest_fast", icon:"✨", name:"Blessing",     desc:"Priests heal 50% faster this run." },
  { id:"fire_long",   icon:"🔥", name:"Wildfire",     desc:"Fire burn lasts twice as long this run." },
  { id:"ice_strong",  icon:"❄️", name:"Deep Freeze",  desc:"Ice slow is much stronger this run." },
  { id:"alldmg",      icon:"💥", name:"Overcharge",   desc:"+30% all unit damage this run.", allDmgMul:1.3 },
  { id:"regen",       icon:"💗", name:"Field Medic",  desc:"+3 HP/sec base regen this run.", regenAdd:3 },
  // ---- Specialist (per-type) buffs ----
  { id:"eagle_eye",      icon:"🦅", name:"Eagle Eye",      desc:"+75% Archer & Ranger damage this run.", dmgMul:{archer:1.75} },
  { id:"arcane_battery", icon:"🔋", name:"Arcane Battery", desc:"+60% Mage damage & +15% attack speed this run.", dmgMul:{mage:1.6}, atkSpeedAdd:0.15 },
  { id:"siege_crew",     icon:"🏗️", name:"Siege Crew",     desc:"+90% Cannon damage this run.", dmgMul:{cannon:1.9} },
  { id:"frostbite",      icon:"🥶", name:"Frostbite",      desc:"+80% Ice damage & slightly stronger slow this run.", dmgMul:{ice:1.8}, strongSlow:true },
  { id:"burning_oil",    icon:"🛢️", name:"Burning Oil",    desc:"+80% Fire damage & longer burn this run.", dmgMul:{fire:1.8}, longBurn:true },
  { id:"sharpshooter",   icon:"🎯", name:"Sharpshooter",   desc:"+100% Archer & Ranger damage this run.", dmgMul:{archer:2} },
  { id:"arcane_surge",   icon:"🌀", name:"Arcane Surge",   desc:"+120% Mage damage this run.", dmgMul:{mage:2.2} },
  { id:"demolition",     icon:"🧨", name:"Demolition",     desc:"+120% Cannon damage this run.", dmgMul:{cannon:2.2} },
  { id:"inferno",        icon:"🔥", name:"Inferno",        desc:"+100% Fire damage this run.", dmgMul:{fire:2} },
  { id:"permafrost",     icon:"🧊", name:"Permafrost",     desc:"+100% Ice damage this run.", dmgMul:{ice:2} },
  // ---- Defensive buffs ----
  { id:"reinforced_gate",icon:"🚪", name:"Reinforced Gate",desc:"+100% base max HP this run (and heal).", baseHpMul:2 },
  { id:"medic_aura",     icon:"⛑️", name:"Medic Aura",     desc:"+5 HP/sec base regen this run.", regenAdd:5 },
  { id:"veteran_formation",icon:"🎖️",name:"Veteran Formation",desc:"+35% all unit damage & 15% less damage taken this run.", allDmgMul:1.35, dmgTakenMul:0.85 },
  { id:"bulwark",        icon:"🛡️", name:"Bulwark",        desc:"Base takes 30% less damage this run.", dmgTakenMul:0.7 },
  { id:"juggernaut",     icon:"🏰", name:"Juggernaut",     desc:"+80% base max HP this run (and heal).", baseHpMul:1.8 },
  // ---- Offensive / utility buffs ----
  { id:"piercing_focus", icon:"🎯", name:"Piercing Focus", desc:"+100% click damage this run.", clickMul:2 },
  { id:"warlord",        icon:"⚔️", name:"Warlord",        desc:"+50% all unit damage this run.", allDmgMul:1.5 },
  { id:"swift_hands",    icon:"🤹", name:"Swift Hands",    desc:"Units attack 40% faster this run.", atkSpeedAdd:0.4 },
  { id:"vampiric",       icon:"🩸", name:"Vampiric Walls", desc:"Heal 2% of base max HP per kill this run.", lifesteal:0.02 },
  // ---- Economy buffs ----
  { id:"coin_storm",     icon:"🪙", name:"Coin Storm",     desc:"+75% coin rewards this run.", coinMul:1.75 },
  { id:"fortune",        icon:"🍀", name:"Fortune",        desc:"+50% coin rewards this run.", coinMul:1.5 },
  // ---- CURSED buffs: a big boon paired with a real downside ----
  { id:"pyromancer",     icon:"😈", name:"Pyromancer's Pact", cursed:true, desc:"3× Fire damage, but HALF physical damage this run.", dmgMul:{fire:3, physical:0.5} },
  { id:"glass_cannon",   icon:"💎", name:"Glass Cannon",      cursed:true, desc:"+150% all unit damage, but base max HP halved this run.", allDmgMul:2.5, baseHpMul:0.5 },
  { id:"blood_ritual",   icon:"💸", name:"Blood Money",        cursed:true, desc:"3× coins, but base takes +40% damage this run.", coinMul:3, dmgTakenMul:1.4 },
  { id:"frozen_heart",   icon:"❄️", name:"Frozen Heart",      cursed:true, desc:"3× Ice damage & stronger slow, but Fire damage cut to 25% this run.", dmgMul:{ice:3, fire:0.25}, strongSlow:true },
  { id:"berserker",      icon:"🪓", name:"Berserker Rage",    cursed:true, desc:"+120% physical damage & +50% attack speed, but no regen & base takes +20% damage.", dmgMul:{physical:2.2}, atkSpeedAdd:0.5, dmgTakenMul:1.2, noRegen:true },
  { id:"reckless",       icon:"💀", name:"Reckless Assault",  cursed:true, desc:"Units attack 80% faster, but deal 30% less damage this run.", atkSpeedAdd:0.8, allDmgMul:0.7 },
  { id:"overclock",      icon:"🖐️", name:"Overclocked Hands", cursed:true, desc:"+200% click damage, but unit damage reduced 40% this run.", clickMul:3, allDmgMul:0.6 },
  { id:"cursed_treasury",icon:"☠", name:"Cursed Treasury",   cursed:true, desc:"+200% coins, but enemies move 20% faster this run.", coinMul:3, enemySpeedMul:1.2 },
  { id:"ashen_armour",   icon:"🌑", name:"Ashen Armour",      cursed:true, desc:"50% less damage taken, but Fire & Mage damage halved this run.", dmgTakenMul:0.5, dmgMul:{fire:0.5, mage:0.5} },
  { id:"doom_pact",      icon:"😈", name:"Doom Pact",         cursed:true, desc:"+300% all damage, but base loses 2 HP/sec in combat this run.", allDmgMul:4, hpDrain:2 },
];
