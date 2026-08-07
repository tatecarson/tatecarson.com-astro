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

// `demote` pushes every heading in the body down by that many levels. The
// archived pages were standalone documents, so each starts its own outline at
// `#`. Here they are rendered *inside* a section of the home page, under the
// numbered `.label` heading that introduces them — so the body has to start one
// level below whatever heading sits above it, or the page ends up with four
// competing h1s and an outline that skips levels.
//
//   about        h2 "02 — About"                         -> body starts at h3
//   publications h2 "03 — Research" > h3 "Publications"   -> body starts at h4
//   teaching     h2 "04 — Teaching"                       -> body starts at h3
//
// about and publications start at `#` in the archive, teaching at `##`, which
// is why the offsets differ.
const PAGES = {
  '1.about': { slug: 'about', title: 'About', order: 2, demote: 2 },
  '2.papers': { slug: 'publications', title: 'Publications', order: 3, demote: 3 },
  '3.teaching': { slug: 'teaching', title: 'Teaching', order: 4, demote: 1 },
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

// Live project sites and public repositories, keyed by output slug. The archive
// has no field for either — it carried them as ad-hoc links inside the prose,
// in a different shape on every post ("visit: …", "Try it: …", a bare
// "[Installation] | [Paper] | [Code]" row). Recording them here lets the page
// template render them the same way every time, and lets the matching links
// come out of the bodies via BODY_FIXES below.
//
// Every URL verified 200 on 2026-08-07.
const URLS = {
  'resonant-landscapes': 'https://tatecarson.github.io/resonant-landscapes/',
  'immaterial-cloud': 'https://immaterial.cloud',
};

const REPOS = {
  'resonant-landscapes': 'https://github.com/tatecarson/resonant-landscapes',
  'mesh-garden': 'https://github.com/tatecarson/distributedSequencer',
  'sounds-aware': 'https://github.com/tatecarson/walking-machine-listening',
};

// What each work produced as research — grant, prize, paper, talk. Keyed by
// output slug. Transcribed from Carson.CV.tex; none of this exists in the
// archived JSON, which recorded creative work and research as separate worlds.
// Works absent from this map produced no research and carry nothing.
const RESEARCH = {
  'before-i-wandered-as-a-diversion': [
    { kind: 'Award', detail: '2nd place, Musicworks 2016 Electronic Music Composition Contest' },
  ],
  'resonant-landscapes': [
    { kind: 'Grant', detail: 'Faculty Research Initiative Grant, Dakota State University, 2023–24' },
    {
      kind: 'Paper',
      detail: 'Audio Mostly 2024 — Explorations in Sonic Cultures, Milan',
      url: 'https://doi.org/10.1145/3678299.3678354',
    },
  ],
  'immaterial-cloud': [
    // Self-hosted because webaudioconf.com/_data/papers/pdf/2021/2021_13.pdf
    // now 404s — the site root still resolves, so the proceedings moved. The
    // paper is CC BY 4.0, so hosting our own copy is fine.
    {
      kind: 'Paper',
      detail: 'Web Audio Conference 2021, Barcelona',
      url: '/papers/wac-2021-immaterial-cloud.pdf',
    },
  ],
  'sounds-aware': [
    {
      kind: 'Paper',
      detail: 'Web Audio Conference 2019, Trondheim',
      url: '/papers/SoundsAware_CameraReady.pdf',
    },
  ],
  'mesh-garden': [
    {
      kind: 'Paper',
      detail: 'New Interfaces for Musical Expression 2019, Porto Alegre',
      url: '/papers/meshGarden.pdf',
    },
  ],
  'a-more-perfect-union': [
    {
      kind: 'Paper',
      detail: 'Web Audio Conference 2018, Berlin',
      url: '/papers/wac-2018-perfect.pdf',
    },
    { kind: 'Demo', detail: 'Web Audio Conference 2018, Technical University of Berlin' },
  ],
};

// Deployed course sites in the DSU-Digital-Sound-Design org, keyed by the exact
// bullet text in the Teaching page. Each points at the most recent offering of
// that course whose GitHub Pages site returns 200 — several courses have five
// or six yearly repos, and the older ones are left out rather than listed.
//
// Three entries stay unlinked: Undergraduate Research and Music Appreciation
// have no repo at all, and Recording Sessions has one that isn't really used.
// Verified 2026-08-07.
const COURSE_LINKS = {
  'Basic Musicianship II':
    'https://dsu-digital-sound-design.github.io/s-26-mus-109-musicianship-II/',
  'Audio Production I':
    'https://dsu-digital-sound-design.github.io/f-26-DAD-222-Audio-Production-I/',
  'Audio Production II':
    'https://dsu-digital-sound-design.github.io/s-26-dad-322-audio-production-II/',
  'Audio Production III':
    'https://dsu-digital-sound-design.github.io/f-26-DAD-422-Audio-Production-III/',
  // Recording Sessions is deliberately absent: a s-23 site exists but the
  // course doesn't really use it.
  'Sound Design for Games':
    'https://dsu-digital-sound-design.github.io/f-25-dad-424-sound-design-for-games/',
  'Sound Design for Film':
    'https://dsu-digital-sound-design.github.io/f-26-dad-310-sound-design-for-film/',
  'Special Topics: AI Music':
    'https://dsu-digital-sound-design.github.io/s-25-dad-492-topics-ai-music/',
  'Special Topics: History of Recorded Music':
    'https://dsu-digital-sound-design.github.io/f-23-history-of-recorded-music/',
  'Special Topics: Programming for Sound Design':
    'https://dsu-digital-sound-design.github.io/f-22-dad-492-programming-for-sound-designers/',
  // Repo is dad-498 but the course and its page title are both DAD 492. The
  // older DAD-492-Sound-Forensics repo was last touched in 2021.
  'Special Topics: Sound Forensics':
    'https://dsu-digital-sound-design.github.io/dad-498-audio-forensics/',
};

// URLs in the archived pages that have since rotted, mapped to a working
// replacement. Applied to every migrated page body.
const DEAD_LINKS = {
  // WAC reorganised their proceedings; this 404s while the site root resolves.
  // The paper is CC BY 4.0, so we serve our own copy.
  'https://webaudioconf.com/_data/papers/pdf/2021/2021_13.pdf':
    '/papers/wac-2021-immaterial-cloud.pdf',
};

const fixDeadLinks = (body) =>
  Object.entries(DEAD_LINKS).reduce((s, [from, to]) => s.split(from).join(to), body);

// Entries dropped from the archived pages. Matched against whole lines, so
// these are list items rather than prose.
const DROP_LINES = [
  // SIIDS 2020, "Designing Collaborative and Mediated Experiences with
  // Networked Circuit-Bent Devices" (Marasco, Carson, Bardin). The project it
  // describes was never built, and siids.arditi.pt no longer resolves, so the
  // citation is removed rather than left pointing at a dead domain.
  /^\* Marasco, Anthony T\., Tate Carson/,
];

const dropLines = (body) =>
  body
    .split('\n')
    .filter((line) => !DROP_LINES.some((re) => re.test(line)))
    .join('\n');

// Push every ATX heading down `by` levels, capped at h6. Line-anchored, so a
// `#` inside prose or inside one of the pasted HTML embeds is untouched.
const demoteHeadings = (body, by) =>
  by ? body.replace(/^(#{1,6})(?= )/gm, (h) => '#'.repeat(Math.min(h.length + by, 6))) : body;

// Per-work corrections to the archived bodies, keyed by output slug. Same idea
// as DEAD_LINKS: the generated markdown is overwritten on every run, so a fix
// only survives if it lives here.
//
// The works don't take a blanket heading offset the way the pages do — 19 of
// the 21 already start their body sections at `##`, which is correct beneath
// the work title in the page template. Only the three below were wrong.
const BODY_FIXES = {
  swarm: [
    // The one body that used `#` for its section heading, giving the page a
    // second h1 beside the work title.
    [/^# Performances$/m, '## Performances'],
  ],
  'sounds-aware': [
    // A `#` wrapper that just restated the work's own title, sitting above the
    // `##` subsections it contained. Dropping it promotes nothing — those
    // subsections were already at the right level — and removes both the
    // duplicate h1 and the duplicated title.
    [/^# Sounds Aware Project Overview\n\n/m, ''],
    // Repo link moved to REPOS; the paper beside it duplicated the research box
    // the template renders directly above the body.
    [/^\[Paper\]\([^)]*\) \| \[Code\]\([^)]*\)\n\n/m, ''],
  ],
  'resonant-landscapes': [
    // Installation moved to URLS, Code to REPOS, and the Paper between them
    // duplicated the Audio Mostly entry in the research box two inches above.
    [/^\[Installation\].*\[Code\]\([^)]*\)\n\n/m, ''],
  ],
  'immaterial-cloud': [
    // Moved to URLS. The link text read "imamterial.cloud"; the template's own
    // "Project site" label retires the typo with it. The address still appears
    // in the prose below, where it is part of the participation instructions.
    [/^visit: \[imamterial\.cloud\]\([^)]*\)\n\n/m, ''],
  ],
  'mesh-garden': [
    // Moved to REPOS.
    [/^\[Code\]\([^)]*\)\n\n/m, ''],
  ],
  'and-the-water-receded': [
    // `###` with no `##` anywhere above it: the outline jumped from the work
    // title straight to h3. It heads a section in its own right, like the
    // "Performances" list below it.
    [/^### Performance at New Music/m, '## Performance at New Music'],
    // The archive left this one image with no alt attribute. Every other image
    // on the site either describes itself or is marked decorative.
    [
      /<img src="\/images\/uploads\/IMG_0684\.jpg">/,
      '<img src="/images/uploads/IMG_0684.jpg" alt="A seated audience in a gallery ' +
        'space watching three performers, with a satellite weather map of the Gulf ' +
        'of Mexico projected on the wall behind them.">',
    ],
  ],
};

// A fix whose pattern no longer matches is the dangerous case: the body silently
// reverts to the archive's version and nothing says so. That happens if the
// archive is re-exported, or — as it did once — if two entries are given the
// same slug key and the later one quietly replaces the earlier. Fail instead.
const fixBody = (slug, body) =>
  (BODY_FIXES[slug] ?? []).reduce((s, [from, to]) => {
    if (!from.test(s)) {
      throw new Error(`${slug}: BODY_FIXES pattern ${from} matched nothing.`);
    }
    return s.replace(from, to);
  }, body);

// Linkify plain bullets whose text matches a known course. Bullets that already
// contain a link (the LSU and Liberty Magnet entries) are skipped by the
// negated `[` in the pattern.
const linkCourses = (body) =>
  body.replace(/^\* ([^[\n]+?)[ \t]*$/gm, (line, name) =>
    COURSE_LINKS[name] ? `* [${name}](${COURSE_LINKS[name]})` : line,
  );

const scalar = (v) =>
  typeof v === 'number' ? String(v) : JSON.stringify(String(v));

// Scalars inline; arrays as a YAML block sequence. Flow style would be valid
// too, but these are content files people open and edit by hand, and a
// research entry on one long JSON line is unreadable.
const yaml = (v) => {
  if (!Array.isArray(v)) return scalar(v);
  return (
    '\n' +
    v
      .map((item) =>
        item !== null && typeof item === 'object'
          ? Object.entries(item)
              .map(([k, val], i) => `  ${i === 0 ? '- ' : '  '}${k}: ${scalar(val)}`)
              .join('\n')
          : `  - ${scalar(item)}`,
      )
      .join('\n')
  );
};

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
    .map(([k, v]) => `${k}: ${yaml(v)}`.replace(/[ \t]+$/gm, ''))
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
      url: URLS[slug],
      repo: REPOS[slug],
      research: RESEARCH[slug],
      // Kept only so the archive's original ordering stays recoverable; the
      // ledger sorts on `year`, since three of these dates contradict the title.
      sourceDate: src.date,
    },
    fixBody(slug, cleanBody(src.body ?? '')),
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
    demoteHeadings(linkCourses(fixDeadLinks(dropLines(cleanBody(src.body ?? '')))), meta.demote),
  );
  p++;
}

// ---- media ----------------------------------------------------------------
// Copy the archive's media over the top WITHOUT clearing the directory first.
// Images added since the migration — the ones THUMBNAILS points at — do not
// exist in the archive, so wiping here destroys them. (It did exactly that
// once: a re-run deleted si.jpg, mesh-garden.jpg and immaterial-cloud.jpg
// while the frontmatter still referenced them.)
const srcMedia = path.join(OLD, 'static/images/uploads');
const dstMedia = path.join(ROOT, 'public/images/uploads');
fs.cpSync(srcMedia, dstMedia, {
  recursive: true,
  // The archive's CV is frozen at 2020 and nothing links to it — the live one
  // is fetched to /carson-cv.pdf by scripts/fetch-cv.mjs. Copying it back on
  // every run just reintroduces a stale document at a second URL.
  filter: (src) => path.basename(src).toLowerCase() !== 'carson.cv.pdf',
});

const srcPapers = path.join(OLD, 'static/papers');
if (fs.existsSync(srcPapers)) {
  fs.cpSync(srcPapers, path.join(ROOT, 'public/papers'), { recursive: true });
}

// Every thumbnail named in frontmatter must exist on disk. A missing file here
// means the migration deleted an image it doesn't own, or a path is wrong —
// either way it renders as a broken panel rather than failing the build.
const dangling = [];
for (const f of fs.readdirSync(outWorks)) {
  const fm = fs.readFileSync(path.join(outWorks, f), 'utf8');
  const m = fm.match(/^thumbnail: "(.+?)"$/m);
  if (m && !fs.existsSync(path.join(ROOT, 'public', m[1]))) {
    dangling.push(`${f} -> ${m[1]}`);
  }
}
if (dangling.length) {
  throw new Error(`thumbnail(s) referenced but missing on disk:\n  ${dangling.join('\n  ')}`);
}

const media = fs.readdirSync(dstMedia, { recursive: true }).length;
console.log(`works:  ${n}`);
console.log(`pages:  ${p}`);
console.log(`media:  ${media}`);
if (missing.length) console.log(`SKIPPED (no metadata): ${missing.join(', ')}`);
