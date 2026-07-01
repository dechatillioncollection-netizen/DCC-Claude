Castle damage-state sprites
===========================
The keep swaps between these as base HP drops (see CASTLE_STATES in game.html):

  full.png       shown at HP >= 66%   (healthy)
  damaged.png    shown at HP 33-66%   (cracked / battered)
  destroyed.png  shown at HP < 33%    (near-destroyed / rubble)

All three are currently duplicates of the default castle — edit each PNG to
look progressively more wrecked. Keep the same pixel dimensions (680x560) so
they line up. If a file is missing the game falls back to ../castle.png, then
to procedural drawing. Thresholds are editable in game.html (CASTLE_STATES).
