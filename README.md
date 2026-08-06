# tatecarson.com

Portfolio site for Tate Carson — composer, researcher, upright bassist.

Astro, static output, no client framework. The home page is a single ledger:
a dense index of works with a sticky preview panel, followed by about,
publications, teaching, and CV. Each work also has its own page.

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
| `tag` | required | One of six: Fixed media, Web / app, Installation, Score, Performance, Film. |
| `thumbnail` | optional | Path under `/images/`. Absent is normal — see below. |
| `status` | optional | `In progress`. Absence means finished. |
| `url` | optional | Live project site, if one exists elsewhere. |
| `collaborators` | optional | Array of names. |
| `sourceDate` | optional | Original CMS date from the archive. Not used for sorting — several contradict their year. |

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
