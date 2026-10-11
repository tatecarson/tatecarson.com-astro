# tatecarson.com

Portfolio site for Tate Carson — composer, researcher, upright bassist.

Astro, static output, no client framework. The home page is a single ledger:
a dense index of works with a sticky preview panel, followed by about, research,
and teaching. Each work also has its own page. There is no CV section — the page
is itself a CV, so the PDF download lives in the rail instead.

Replaces the Nuxt 2 site in
[tatecarson-new-new](https://github.com/tatecarson/tatecarson-new-new), which is
kept as an archive.

## Running it

```bash
npm install
npm run dev      # localhost:4321
npm run build    # → dist/
```

## Content

Works live in `src/content/works/` as markdown with frontmatter. The schema in
`src/content.config.ts` is enforced at build time — a work missing a `blurb`,
`medium`, or `tag` fails the build and names the file.

| Field | | |
| --- | --- | --- |
| `title` | required | |
| `year` | required | Numeric, drives sorting. Kept out of the title string. |
| `yearLabel` | optional | For spans and ongoing work: `2019–2021`, `2025–`. Display only. |
| `blurb` | required | One sentence. Shown in the hover panel and inline on mobile. |
| `medium` | required | Format description. |
| `tag` | required | One of the `TAGS` in `src/content.config.ts`. Not repeated here — a list in two places drifts. |
| `thumbnail` | optional | Path under `/images/`. Absent is normal — see below. |
| `status` | optional | `In progress`. Absence means finished. |
| `url` | optional | Live project site, if one exists elsewhere. |
| `repo` | optional | Public source repository. |
| `collaborators` | optional | Legacy array of names. Shown in the header when detailed credits are absent. |
| `credits` | optional | Array of contributor names and roles, with optional recording or performance context. |
| `coverage` | optional | Linked press or institutional articles about the work, with citation metadata. |
| `research` | optional | What the work produced — grant, award, paper, talk, demo, workshop. Rendered as its own box above the body. |
| `sourceDate` | optional | Original CMS date from the archive. Not used for sorting — several contradict their year. |

### Credits and coverage

Project pages show Credits, then Press and coverage, below the body. Empty arrays
or absent fields produce no section. Credits sharing a `context` appear under
one label, so a particular performance's players are credited together.

```yaml
credits:
  - name: "Sophia Shen"
    role: "Pipa"
    context: "Featured recording"
coverage:
  - title: "Resonant Landscapes: DSU researchers make music with nature"
    outlet: "Dakota State University"
    url: "https://dsu.edu/news/2023/12/resonant-landscapes.html"
    sourceType: "Institutional coverage"
    author: "Mary Askren"
    date: "2023-12-13"
```

Each credit requires a nonempty `name` and `role`; `context` is optional. Each
coverage entry requires `title`, `outlet`, a `url`, and `sourceType`,
either `Press` or `Institutional coverage`. `author` and `date` are optional.
Quote dates in `YYYY-MM-DD` format and omit them when the publisher is undated.
Coverage entries and credit groups appear in frontmatter order and are maintained
manually.

Coverage URLs can be absolute publisher/archive links or site-relative paths to
saved article PDFs in `public/press/`. PDF links display a `(PDF)` label. Preserve
the original article URL and the reason for using a saved copy in Beads.

Coverage is for articles that discuss the specific work. Papers, programs, and
event listings belong with Research or performance/exhibition history. Verify
names, roles, and citation metadata before adding them; contributor attributions
supplied by Tate are recorded in Beads.

### Works without images

Most of the catalogue is acousmatic — fixed media and performance audio that has
no image because none exists. The preview panel collapses its media box rather
than drawing an empty frame, so an imageless work reads as a text panel instead
of a broken one. Adding a `thumbnail` is all that's needed to light it up.

### Combining diacritics

One title (`S̜w͚a̎r̍m̸`, 2015) is built from combining marks that Newsreader maps to
`.notdef` boxes rather than leaving uncovered, so the browser never falls back on
its own. `src/lib/text.ts` detects them and swaps in a system serif. It is
detected rather than hard-coded, so a future title with marks is handled too.

## Icons and share image

`public/favicon.svg` is the source for the icon; the PNG fallbacks and the
1200×630 Open Graph image are generated from it and from the Palisades
photograph:

```bash
node scripts/make-icons.mjs
```

Run it after editing the SVG. The outputs (`favicon-32.png`,
`apple-touch-icon.png`, `og.jpg`) are committed, so a normal build does not
need it.

## Migration

`scripts/migrate.mjs` converts the archived Nuxt JSON into this repo's content
collections. It is kept so the conversion stays auditable, and it re-runs
idempotently:

```bash
node scripts/migrate.mjs ../../tatecarson-new-new
```

It refuses to write a body with unbalanced `<iframe>`, `<div>`, or `<script>`
tags. The archive's CV page was a single unclosed `<iframe>`, which silently
swallowed the rest of the rendered page — that page is not migrated, and the CV
section is built from the degree list and a direct PDF link instead.
