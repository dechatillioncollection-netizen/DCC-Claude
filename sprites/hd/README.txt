HD Remaster sprite set — used by game-hd.html only.

GENERATED FILES — do not hand-edit. Rebuild with:
  node tools/make-hd-sprites.js
(needs playwright-core + a Chromium binary; it re-bakes everything
from the classic sprites/ art.)

Each unit/enemy has two frames:
  units/<id>.webp          idle (HD remaster of the classic sprite)
  units/<id>_shoot.webp    attack pose — shown briefly when that slot fires
  enemies/<type>.webp      idle
  enemies/<type>_walk.webp step pose — alternated with idle while marching

Scenery (single frame, native resolution):
  castle/full|damaged|destroyed.webp   castle damage states
  castle.webp                          legacy single castle
  background.webp                      field background (colour grade only)

All files are OPTIONAL at runtime: a missing idle falls back to the
classic PNG (remastered on the fly), and a missing pose frame simply
disables that sprite's animation. The classic edition (game.html)
never reads this folder.
