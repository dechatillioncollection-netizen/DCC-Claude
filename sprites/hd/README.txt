HD Remaster sprite set — used by game-hd.html only.

GENERATED FILES — do not hand-edit. Rebuild with:
  node tools/make-hd-sprites.js
(needs playwright-core + a Chromium binary; it re-bakes everything
from the classic sprites/ art.)

Each unit/enemy has two frames:
  units/<id>.png          idle (HD remaster of the classic sprite)
  units/<id>_shoot.png    attack pose — shown briefly when that slot fires
  enemies/<type>.png      idle
  enemies/<type>_walk.png step pose — alternated with idle while marching

All files are OPTIONAL at runtime: a missing idle falls back to the
classic PNG (remastered on the fly), and a missing pose frame simply
disables that sprite's animation. The classic edition (game.html)
never reads this folder.
