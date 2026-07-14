import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  // Language comes from the folder (en/ or vi/), not frontmatter — see src/lib/blog.ts.
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    /** Lowercase, language-neutral slugs — keep identical in both language files. */
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
