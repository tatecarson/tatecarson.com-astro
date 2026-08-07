// Generates the raster assets that can't be committed as source: the PNG
// favicon fallbacks and the Open Graph share image. Run it after editing
// public/favicon.svg or changing the og source photo.
//
//   node scripts/make-icons.mjs
//
// Kept in the repo for the same reason as migrate.mjs — so the binaries in
// public/ have a visible origin rather than appearing fully formed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p) => path.join(ROOT, 'public', ...p);

const svg = fs.readFileSync(pub('favicon.svg'));

// Safari below 16 and most feed readers ignore an SVG icon, and iOS wants a
// square PNG at 180 for the home-screen tile. Both are rasterised from the same
// source so they can never drift from the SVG.
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(pub('favicon-32.png'));
await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(pub('apple-touch-icon.png'));

// Share card, 1200x630 (the 1.91:1 that Open Graph and Twitter both crop to).
// Source is the Palisades photograph behind Resonant Landscapes: a South Dakota
// state park, which is the material that piece is built from, and the one image
// in the catalogue that is both landscape and high enough resolution.
//
// The source is 4:3, so a band has to come out of it. Resizing to 1200 wide
// first puts it at 900 tall; the 630 window starts 150px down, which keeps the
// quartzite cliffs and the treeline and drops the emptiest part of the sky.
await sharp(pub('images/uploads/palisades-1.jpeg'))
  .resize({ width: 1200 })
  .extract({ left: 0, top: 150, width: 1200, height: 630 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub('og.jpg'));

for (const f of ['favicon-32.png', 'apple-touch-icon.png', 'og.jpg']) {
  const { size } = fs.statSync(pub(f));
  console.log(`${f}  ${(size / 1024).toFixed(1)} kB`);
}
