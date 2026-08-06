// One-shot migration from the archived Nuxt site (tatecarson-new-new) into
// Astro content collections. Kept in the repo so the conversion is auditable —
// rerunning it overwrites src/content/ from the old JSON.
//
//   node scripts/migrate.mjs [path-to-old-repo]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OLD = process.argv[2] ?? path.resolve(ROOT, '../../tatecarson-new-new');

// Curated layer. The old JSON carries the year inside the title string and has
// no short blurb or medium — those were derived by reading each post body.
// Keyed by old filename stem.
//
// `tag` is NOT here: it comes straight from the source `category` field, which
// is Tate's own taxonomy and better than anything derived after the fact.
const META = {
  '2025-10-30-veins-of-the-earth-2024': {
    title: 'Veins of the Earth', year: 2024, slug: 'veins-of-the-earth',
    blurb: 'Spatialized textures of wind, water, and wildlife drawn from Resonant Landscapes field recordings, exploring ecological interdependence.',
    medium: 'Eight-channel fixed-media electroacoustic work',
  },
  '2024-09-29-resonant-landscapes': {
    title: 'Resonant Landscapes', year: 2024, blurb: 'Overlays South Dakota state-park soundscapes onto the DSU campus via GPS, letting users walk through nature recordings in an urban setting.',
    medium: 'Web app / locative sound installation (ambisonics + GPS)',
  },
  '2020-07-21-immaterial-cloud': {
    title: 'immaterial.cloud', year: 2020, blurb: 'An audiovisual installation imagining a peer-to-peer networked future, where participants approaching one phone shift the sound across all of them.',
    medium: 'Multi-smartphone immersive installation (web)',
  },
  '2019-07-14-sounds-aware': {
    title: 'Sounds Aware', year: 2019, yearLabel: '2019–2021', blurb: 'A smartphone web app that uses machine learning to detect human-made sound and mask it with ambient music, redirecting attention to biophony.',
    medium: 'Web app, machine listening (two versions; 2021 version = dissertation research)',
  },
  '2018-07-15-mesh-garden': {
    title: 'Mesh Garden', year: 2018, blurb: "A sequencer distributed across a group's smartphones, played by tilting rather than constant interaction.",
    medium: 'Networked smartphone instrument / ambient piece',
  },
  '2017-07-15-a-more-perfect-union': {
    title: 'A more perfect union', year: 2017, blurb: 'Audience listening drives an evolutionary algorithm — the longer a melody is heard, the more its "genes" survive into later generations.',
    medium: 'Participatory real-time composition; performance → installation (web audio)',
  },
  '2017-07-15-and-the-water-receded': {
    title: 'And the water receded', year: 2017, blurb: "A sonification of Hurricane Katrina's track from tropical depression to landfall, compressed into a single sitting.",
    medium: 'Three players + electronics, animated notation',
  },
  // NOTE: the source post has no prose whatsoever — only an embed and a
  // performance date. This blurb is assembled from the source's own `category`
  // (Dance) plus the performance credit, not adapted from Tate's description.
  // Still worth replacing with a real one.
  '2017-07-15-pseudo-pseudo': {
    title: 'Pseudo, Pseudo', year: 2017,
    blurb: 'Music for dance, performed at Lisser Hall, Mills College, in April 2017.',
    medium: 'Audio (SoundCloud playlist)',
  },
  '2016-07-15-Lamella': {
    title: 'Lamellea', year: 2016, blurb: 'Contact-miked music box, granulated so its melody and its machine noise trade places.',
    medium: 'Fixed-media electroacoustic',
  },
  '2016-07-15-a-quiet-desert-future': {
    title: 'A Quiet Desert Future', year: 2016, blurb: 'Layers improvised blind and mixed live to tape in a single take.',
    medium: 'Fixed-media, direct-to-tape',
  },
  '2016-07-15-before-i-wandered-as-a-diversion': {
    title: 'Before, I wandered as a diversion', year: 2016, blurb: 'New Orleans cicadas, riverboats, rain and thunder assembled as an augmented field recording.',
    medium: 'Fixed-media soundscape composition',
  },
  '2016-07-15-i-only-went-out-for-a-walk': {
    title: 'I only went out for a walk', year: 2016, blurb: 'Field recordings of walking, turning a daily unnoticed act into a listening meditation.',
    medium: 'Fixed-media soundscape composition',
  },
  '2016-07-15-shifting-migration': {
    title: 'Shifting Migration', year: 2016, blurb: 'A week of binaural bike-commute recordings that ends by letting passing cars turn into ocean waves.',
    medium: 'Fixed-media, binaural field recording',
  },
  '2016-07-15-shifting-migration-pt-2-2016': {
    title: 'Shifting Migration Pt 2', year: 2016, slug: 'shifting-migration-pt-2',
    blurb: 'A continuation of the first version, time-stretching the commute recordings into longer forms.',
    medium: 'Fixed-media electroacoustic',
  },
  '2016-07-15-the-laptop-as-dwelling-2016': {
    title: 'The Laptop as Dwelling', year: 2016, slug: 'the-laptop-as-dwelling',
    blurb: "Coil-mic sonification of a laptop's innards, treating the machine as inhabited space and tuning its noise toward melody.",
    medium: 'Fixed-media / live electronics',
  },
  '2016-07-15-twin-highways-flung-across-the-evening': {
    title: 'Twin highways flung across the evening', year: 2016, blurb: 'BART trains and a Chinese New Year parade — the industrial and the ceremonial — collide across eight speakers.',
    medium: 'Eight-channel fixed media',
  },
  '2015-07-15-diminishing-pt-2': {
    title: 'Diminishing Pt 2', year: 2015, blurb: 'Three short melodies handed to an ensemble that decides its own density and pacing in real time.',
    medium: 'Open score for ensemble',
  },
  '2015-07-15-recursion': {
    title: 'Recursion', year: 2015, blurb: 'A seven-note melody plotted on nested circles, played at self-similar speeds as an improvisation starting point.',
    medium: 'Graphic score for ensemble',
  },
  '2015-07-15-si': {
    title: 'Si', year: 2015, blurb: 'A temperamental six-year-old gets a goldfish after begging for a puppy.',
    medium: 'Short film (dir. Samantha Aldana)',
  },
  '2015-07-15-synecdoche': {
    title: 'Synecdoche', year: 2015, blurb: 'Two tempos accelerate past the threshold of rhythmic perception until notes fuse into shifting timbre.',
    medium: 'Fixed-media electronic',
  },
  // Combining diacritics in the source filename; pinned to an ASCII slug so the
  // URL survives copy/paste and shell tooling.
  '2015-07-15-s̜w͚a̎r̍m̸': {
    title: 'S̜w͚a̎r̍m̸', year: 2015, slug: 'swarm',
    blurb: 'A live-sampling instrument built to capture instrument input and return it as drone.',
    medium: 'Custom software instrument / live performance',
  },
};

const PAGES = {
  '1.about': { slug: 'about', title: 'About', order: 2 },
  '2.papers': { slug: 'publications', title: 'Publications', order: 3 },
  '3.teaching': { slug: 'teaching', title: 'Teaching', order: 4 },
  // 4.cv is deliberately not migrated. Its entire body was a single unclosed
  // `<iframe src="…carson.cv.pdf">` — with no closing tag the HTML parser
  // swallows the rest of the document into it. The CV section is built from
  // the degree list and a direct PDF link instead.
};

// Images added after the migration, where the archive's own thumbnail was
// missing or weaker than what we have now. Keyed by output slug so re-running
// the migration doesn't revert them.
const THUMBNAILS = {
  si: '/images/uploads/si.jpg',
  'mesh-garden': '/images/uploads/mesh-garden.jpg',
  // Archive pointed at IMG_4077.jpeg; replaced with the four-phones frame.
  'immaterial-cloud': '/images/uploads/immaterial-cloud.jpg',
};

const yaml = (v) =>
  typeof v === 'number' ? String(v) : JSON.stringify(String(v));

// The old bodies are markdown with raw HTML embeds pasted in by the CMS's
// WYSIWYG mode, which litters them with Word-style fragment markers.
const cleanBody = (s) =>
  s
    .replace(/<!--\s*(Start|End)Fragment\s*-->/g, '')
    .replace(/﻿/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

function slugify(name, meta) {
  if (meta.slug) return meta.slug;
  return name.replace(/^\d{4}-\d{2}-\d{2}-/, '').toLowerCase();
}

// The archived bodies carry hand-pasted embed HTML, and at least one of them
// was truncated mid-tag. An unclosed <iframe> is invisible in markdown but
// silently eats the remainder of the rendered page, so fail loudly instead.
function assertBalancedEmbeds(file, body) {
  for (const tag of ['iframe', 'div', 'script']) {
    const open = (body.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;
    const close = (body.match(new RegExp(`</${tag}>`, 'g')) ?? []).length;
    if (open !== close) {
      throw new Error(
        `${path.basename(file)}: unbalanced <${tag}> (${open} open, ${close} close). ` +
          `An unclosed tag will swallow the rest of the page at render time.`,
      );
    }
  }
}

function write(file, frontmatter, body) {
  assertBalancedEmbeds(file, body);
  const fm = Object.entries(frontmatter)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${yaml(v)}`)
    .join('\n');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\n${fm}\n---\n\n${body}\n`);
}

// ---- works ----------------------------------------------------------------
const worksDir = path.join(OLD, 'content/blog/posts');
const outWorks = path.join(ROOT, 'src/content/works');

// Clear only the files this script owns. Hand-authored works that were never in
// the archive — drift.md, and anything added later — must survive a re-run.
const managed = new Set(
  Object.entries(META).map(([stem, meta]) => `${slugify(stem, meta)}.md`),
);
fs.mkdirSync(outWorks, { recursive: true });
for (const f of fs.readdirSync(outWorks)) {
  if (managed.has(f)) fs.rmSync(path.join(outWorks, f));
}

let n = 0;
const missing = [];
for (const file of fs.readdirSync(worksDir).filter((f) => f.endsWith('.json'))) {
  const stem = file.replace(/\.json$/, '');
  const meta = META[stem];
  if (!meta) {
    missing.push(stem);
    continue;
  }
  const src = JSON.parse(fs.readFileSync(path.join(worksDir, file), 'utf8'));
  const slug = slugify(stem, meta);
  write(
    path.join(outWorks, `${slug}.md`),
    {
      title: meta.title,
      year: meta.year,
      yearLabel: meta.yearLabel,
      blurb: meta.blurb,
      medium: meta.medium,
      // Straight from the archive. Every one of the 21 posts carried one.
      tag: src.category,
      thumbnail: THUMBNAILS[slug] ?? src.thumbnail ?? undefined,
      // Kept only so the archive's original ordering stays recoverable; the
      // ledger sorts on `year`, since three of these dates contradict the title.
      sourceDate: src.date,
    },
    cleanBody(src.body ?? ''),
  );
  n++;
}

// ---- pages ----------------------------------------------------------------
const pagesDir = path.join(OLD, 'content/page/posts');
const outPages = path.join(ROOT, 'src/content/pages');
fs.rmSync(outPages, { recursive: true, force: true });

let p = 0;
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'))) {
  const stem = file.replace(/\.json$/, '');
  const meta = PAGES[stem];
  if (!meta) continue;
  const src = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  write(
    path.join(outPages, `${meta.slug}.md`),
    { title: meta.title, order: meta.order },
    cleanBody(src.body ?? ''),
  );
  p++;
}

// ---- media ----------------------------------------------------------------
const srcMedia = path.join(OLD, 'static/images/uploads');
const dstMedia = path.join(ROOT, 'public/images/uploads');
fs.rmSync(dstMedia, { recursive: true, force: true });
fs.cpSync(srcMedia, dstMedia, { recursive: true });

const srcPapers = path.join(OLD, 'static/papers');
if (fs.existsSync(srcPapers)) {
  fs.cpSync(srcPapers, path.join(ROOT, 'public/papers'), { recursive: true });
}

const media = fs.readdirSync(dstMedia, { recursive: true }).length;
console.log(`works:  ${n}`);
console.log(`pages:  ${p}`);
console.log(`media:  ${media}`);
if (missing.length) console.log(`SKIPPED (no metadata): ${missing.join(', ')}`);
