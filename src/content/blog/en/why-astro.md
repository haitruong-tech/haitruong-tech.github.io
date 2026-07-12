---
title: "Why I chose Astro for this blog"
description: "A quick comparison of personal-blog options in 2026, and why Astro won."
pubDate: 2026-07-12
---

When I started building this blog, I weighed the usual suspects:

**Next.js** — powerful, but overkill for a site that just renders posts. A blog doesn't need server components.

**Hugo** — insanely fast builds, but Go templates are painful to customize if JavaScript is home for you.

**WordPress** — hosting, security, updates. Not worth it for a personal blog.

**Astro** — the final pick, because:

Zero JavaScript by default, so pages load nearly instantly. Posts are Markdown files — write them in any editor, keep them in git. When something interactive is needed, drop a component into that one spot. Static deploys to GitHub Pages or Vercel are free.

For a personal blog the bar is simple: *easy to write, fast to load, nothing to maintain*. Astro clears all three.
