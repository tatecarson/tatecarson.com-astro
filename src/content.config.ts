import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The six categories the ledger's tag column and filters run on. Adding a
// seventh here is the only place it needs to happen.
export const TAGS = [
  'Fixed media',
  'Web / app',
  'Installation',
  'Score',
  'Performance',
  'Film',
] as const;

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string().min(1),

    // Year lives in its own field rather than inside the title string, which is
    // how the archived site stored it ("Veins of the Earth (2024)"). The ledger
    // sorts on this.
    year: z.number().int().min(1990).max(2100),

    // Only for works spanning multiple years ("2019–2021"). Display-only; `year`
    // still drives sorting.
    yearLabel: z.string().optional(),

    // One sentence, shown in the ledger's hover panel. Required on purpose:
    // one work in the archive had no description at all, and a missing blurb
    // should fail the build rather than render an empty panel.
    blurb: z.string().min(1),

    medium: z.string().min(1),
    tag: z.enum(TAGS),

    thumbnail: z.string().startsWith('/images/').optional(),

    // Set only on work that is not finished. Everything in the archive is
    // complete, so absence means done rather than unknown.
    status: z.enum(['In progress']).optional(),

    // Live project site, where one exists separately from this page.
    url: z.string().url().optional(),

    // Anyone whose contribution is structural rather than incidental. The
    // archived works record collaborators in body prose only, so this stays
    // optional rather than backfilled.
    collaborators: z.array(z.string()).optional(),

    // Original CMS date string, carried over so the archive stays traceable.
    // Deliberately not used for sorting — three of them contradict their year.
    sourceDate: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    order: z.number().int(),
  }),
});

export const collections = { works, pages };
