# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # static build to dist/ — must pass before every commit
npm run check    # astro check: type errors in .astro/.ts files
npm run preview  # serve the built dist/
```

There are no tests; `npm run build && npm run check` is the verification step.

## Architecture

Astro 7 static site, zero client-side JavaScript except one embed (see below). No backend, no database, no CSS framework.

**Content flow:** posts are Markdown files in `src/content/blog/`. The `blog` collection in `src/content.config.ts` loads them (content-layer glob loader) and validates frontmatter with zod: `title`, `description`, `pubDate`, `lang` (`vi` | `en`), `draft`. The filename becomes the URL: `src/content/blog/foo.md` → `/blog/foo/` via `getStaticPaths` in `src/pages/blog/[id].astro`. `src/pages/index.astro` lists non-draft posts newest-first. Posts with `draft: true` are excluded everywhere.

**Styling:** all global CSS lives in one `<style is:global>` block in `src/layouts/Base.astro`, built on CSS variables (`--bg`, `--text`, `--muted`, `--accent`, `--border`). Dark mode is automatic via `prefers-color-scheme` — never hard-code colors; use the variables. Page-specific styles go in scoped `<style>` blocks in that page.

**Ideas page (`src/pages/ideas.astro`):** the "suggest what I should build" feature. It embeds giscus (GitHub Discussions). The `GISCUS` config object at the top has empty `repoId`/`categoryId` until the owner completes setup — the page intentionally renders a setup notice while unconfigured. Never invent or fill these IDs; only the owner can obtain them from giscus.app.

**Known placeholder:** `site` in `astro.config.mjs` is `https://example.com` until the owner picks a domain.

## Conventions

- **Minimal diffs.** One logical change per commit; the owner reviews every diff. Conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`).
- **Bilingual content.** UI text is English. Posts are Vietnamese or English — set `lang` frontmatter accordingly; don't translate existing posts.
- **No new dependencies** without asking the owner first.
