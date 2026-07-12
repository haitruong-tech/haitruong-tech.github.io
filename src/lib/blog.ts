import { getCollection, type CollectionEntry } from 'astro:content';
import { languages, type Lang } from '../i18n/ui';

export type BlogPost = CollectionEntry<'blog'>;

/** Language of a post, derived from its folder: en/hello-world → 'en'. */
export function postLang(post: BlogPost): Lang {
  return post.id.split('/')[0] as Lang;
}

/** Slug of a post without the locale folder: en/hello-world → 'hello-world'. */
export function postSlug(post: BlogPost): string {
  return post.id.split('/').slice(1).join('/');
}

/**
 * Non-draft posts for one locale, newest first.
 * Also asserts that every post exists in every language, so a missing
 * translation fails the build instead of producing broken language switches.
 */
export async function getPosts(lang: Lang): Promise<BlogPost[]> {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  assertTranslationPairs(all);
  return all
    .filter((post) => postLang(post) === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

function assertTranslationPairs(posts: BlogPost[]) {
  const langs = Object.keys(languages) as Lang[];
  const bySlug = new Map<string, Set<Lang>>();
  for (const post of posts) {
    const slug = postSlug(post);
    if (!bySlug.has(slug)) bySlug.set(slug, new Set());
    bySlug.get(slug)!.add(postLang(post));
  }
  for (const [slug, present] of bySlug) {
    for (const lang of langs) {
      if (!present.has(lang)) {
        throw new Error(
          `Post "${slug}" is missing its "${lang}" version. ` +
            `Every post needs one file per language with the same name: ` +
            langs.map((l) => `src/content/blog/${l}/${slug}.md`).join(' + ') +
            `. (A draft: true on only one side also triggers this.)`
        );
      }
    }
  }
}
