#!/usr/bin/env node
/* ============================================================
   HD SPRITE GENERATOR — builds sprites/hd/ from the classic art.

   For every unit and enemy sprite this bakes an "HD remaster"
   (vibrance/contrast boost, directional light pass, soft baked
   silhouette shadow) and one extra animation frame:
     - enemies: <type>_walk.png  — a step pose (bottom-pivot lean +
       squash) the game alternates with the idle frame while marching
     - units:   <id>_shoot.png   — a recoil/attack pose (opposite lean,
       crouch + brightness flash) shown briefly whenever the slot fires

   Usage:  node tools/make-hd-sprites.js
   Needs:  playwright-core + a Chromium binary (used purely as the
           image processor; sources are passed as data: URLs so no
           file:// canvas-tainting rules apply).
   Output: sprites/hd/units/*.png, sprites/hd/enemies/*.png
   The game treats these as optional — if a file is missing it falls
   back to the classic PNG (run through the runtime remaster pipeline),
   so shipping without regenerating never breaks anything.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..");
const UNITS = ["archer", "mage", "knight", "cannon", "priest", "ranger", "assassin", "icewizard", "firewizard", "engineer"];
const ENEMIES = ["basic", "fast", "tank", "flying", "boss"];

// Runs inside the browser page. mode: "idle" | "walk" | "shoot".
const BAKE_SRC = `
async function bake(dataURL, mode, opts) {
  opts = opts || {};
  // out: longest output side (0 = keep native). 448 covers the largest
  // on-screen character draw (boss 144px @ 3x supersampling).
  const OUT = opts.out === 0 ? Infinity : (opts.out || 448);
  // cs: content inset so pose rotation + soft shadow never clip.
  const CS = opts.cs != null ? opts.cs : 0.92;
  const useHalo = opts.halo !== false, useLight = opts.light !== false;
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataURL; });
  const w = img.naturalWidth, h = img.naturalHeight;
  const s = Math.min(1, OUT / Math.max(w, h));
  const cw = Math.round(w * s), ch = Math.round(h * s);
  const c = document.createElement("canvas"); c.width = cw; c.height = ch;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  const dw = cw * CS, dh = ch * CS, dx = (cw - dw) / 2, dy = (ch - dh) / 2;
  // Pose transform around the content's bottom-centre pivot (feet planted).
  const px = cw / 2, py = dy + dh * 0.92;
  g.translate(px, py);
  if (mode === "walk")  { g.rotate( 5 * Math.PI / 180); g.scale(1.03, 0.95); }
  if (mode === "shoot") { g.rotate(-4 * Math.PI / 180); g.scale(1.05, 0.96); }
  g.translate(-px, -py);
  if (useHalo) { g.shadowColor = "rgba(6,10,18,0.45)"; g.shadowBlur = cw * 0.025; }
  g.filter = "saturate(1.22) contrast(1.07) brightness(" + (mode === "shoot" ? 1.12 : 1.04) + ")";
  g.drawImage(img, dx, dy, dw, dh);
  g.filter = "none"; g.shadowBlur = 0;
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (useLight) {
    // Directional light clipped to the art: warm above, cool at the feet.
    g.globalCompositeOperation = "source-atop";
    const lg = g.createLinearGradient(0, 0, 0, ch);
    lg.addColorStop(0, "rgba(255,244,214,0.18)");
    lg.addColorStop(0.55, "rgba(255,255,255,0)");
    lg.addColorStop(1, "rgba(16,28,56,0.20)");
    g.fillStyle = lg; g.fillRect(0, 0, cw, ch);
    g.globalCompositeOperation = "source-over";
  }
  // Flag frames where solid art (not the faint shadow tail) hits the border.
  const d = g.getImageData(0, 0, cw, ch).data;
  let clipped = false;
  for (let x = 0; x < cw && !clipped; x++) if (d[x * 4 + 3] > 40 || d[((ch - 1) * cw + x) * 4 + 3] > 40) clipped = true;
  for (let y = 0; y < ch && !clipped; y++) if (d[y * cw * 4 + 3] > 40 || d[(y * cw + cw - 1) * 4 + 3] > 40) clipped = true;
  return { url: c.toDataURL("image/png"), clipped };
}
window.bake = bake;`;

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ content: BAKE_SRC });

  const jobs = [];
  for (const id of UNITS) jobs.push({
    src: "sprites/units/" + id + ".png",
    outs: [["sprites/hd/units/" + id + ".png", "idle"], ["sprites/hd/units/" + id + "_shoot.png", "shoot"]],
  });
  for (const t of ENEMIES) jobs.push({
    src: "sprites/enemies/" + t + ".png",
    outs: [["sprites/hd/enemies/" + t + ".png", "idle"], ["sprites/hd/enemies/" + t + "_walk.png", "walk"]],
  });
  // Scenery: castle damage states keep native size, no pose, no halo (the
  // game draws its own ground shadow); the background gets the colour
  // grade only, at native size.
  for (const c of ["castle/full", "castle/damaged", "castle/destroyed", "castle"]) jobs.push({
    src: "sprites/" + c + ".png",
    outs: [["sprites/hd/" + c + ".png", "idle"]],
    opts: { out: 0, cs: 1, halo: false },
  });
  jobs.push({
    src: "sprites/background.png",
    outs: [["sprites/hd/background.png", "idle"]],
    opts: { out: 0, cs: 1, halo: false, light: false },
  });

  let wrote = 0, warned = 0;
  for (const job of jobs) {
    const dataURL = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, job.src)).toString("base64");
    for (const [out, mode] of job.outs) {
      const res = await page.evaluate(([d, m, o]) => window.bake(d, m, o), [dataURL, mode, job.opts || {}]);
      const png = Buffer.from(res.url.split(",")[1], "base64");
      const abs = path.join(ROOT, out);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, png);
      wrote++;
      if (res.clipped) { warned++; console.warn("⚠ art touches the border after pose transform: " + out); }
      console.log("wrote " + out + " (" + png.length + " bytes, " + mode + ")");
    }
  }
  await browser.close();
  console.log("done: " + wrote + " files" + (warned ? ", " + warned + " clipping warnings" : ", no clipping"));
})().catch((e) => { console.error(e); process.exit(1); });
