// Pulls the current CV PDF from github.com/tatecarson/CV into public/ so the
// site serves it from its own domain. Runs automatically before every build
// (see the `prebuild` script in package.json).
//
// Why not just link to GitHub: raw.githubusercontent.com serves PDFs as
// application/octet-stream, so browsers download the file instead of opening
// it. Served from public/ it gets application/pdf and opens inline.
//
//   node scripts/fetch-cv.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'https://raw.githubusercontent.com/tatecarson/CV/main/Carson.CV.pdf';
const DEST = path.join(ROOT, 'public/carson-cv.pdf');

// A PDF that fails to start with %PDF is an error page GitHub returned with a
// 200, or a truncated download. Writing it would silently ship a broken file.
const looksLikePdf = (buf) => buf.subarray(0, 5).toString('latin1') === '%PDF-';

const existing = fs.existsSync(DEST) ? fs.statSync(DEST).size : 0;

try {
  const res = await fetch(SRC, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (!looksLikePdf(buf)) {
    throw new Error(`response is not a PDF (${buf.length} bytes)`);
  }

  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, buf);

  const kb = (n) => `${Math.round(n / 1024)}KB`;
  console.log(
    existing === buf.length
      ? `cv: unchanged (${kb(buf.length)})`
      : `cv: updated ${existing ? kb(existing) : 'none'} -> ${kb(buf.length)}`,
  );
} catch (err) {
  // Never fail the build over this. A stale CV is bad; an unbuildable site
  // because GitHub is unreachable is worse. Only hard-fail if there is no
  // local copy at all, since the CV link would then 404.
  if (existing) {
    console.warn(`cv: fetch failed (${err.message}) — keeping existing copy`);
  } else {
    console.error(`cv: fetch failed (${err.message}) and no local copy exists`);
    process.exit(1);
  }
}
