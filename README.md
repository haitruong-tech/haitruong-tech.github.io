# Nick's Tech Blog

Blog cá nhân về tech, build bằng [Astro](https://astro.build). Có trang `/ideas/` để viewers đề xuất mình nên làm gì tiếp theo (chạy bằng [giscus](https://giscus.app) trên GitHub Discussions — không cần backend).

## Chạy local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build ra dist/
```

## Viết bài mới

Tạo file `.md` trong `src/content/blog/`:

```md
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn cho SEO"
pubDate: 2026-07-15
lang: vi        # vi | en
draft: false    # true = không publish
---

Nội dung bài viết...
```

## i18n

Site có 2 ngôn ngữ: `/` (English) và `/vi/` (tiếng Việt), dùng i18n built-in của Astro.

- UI strings nằm hết trong `src/i18n/ui.ts` — thêm key mới phải thêm cả `en` lẫn `vi`.
- Trang localized là wrapper mỏng: `src/pages/ideas.astro` và `src/pages/vi/ideas.astro` cùng render component trong `src/components/`.
- Muốn localize trang mới: tạo component chung → 2 wrapper → thêm path vào `localizedPages` trong `ui.ts` (để switcher + hreflang hoạt động).
- Bài viết không dịch — mỗi bài 1 ngôn ngữ (`lang` frontmatter), URL chung `/blog/...` cho cả 2 locale.

## Bật phần góp ý (trang /ideas/)

1. Push repo này lên GitHub (public), bật **Discussions** trong Settings.
2. Cài app giscus: https://github.com/apps/giscus
3. Vào https://giscus.app → chọn repo + category "Ideas" → copy `repoId` và `categoryId` vào `src/pages/ideas.astro`.

Viewers comment/vote đề xuất ngay trên trang, đăng nhập bằng GitHub.

## Deploy (miễn phí)

- **Vercel / Netlify**: import repo, framework tự nhận Astro, xong.
- **GitHub Pages**: xem https://docs.astro.build/en/guides/deploy/github/

Nhớ sửa `site` trong `astro.config.mjs` thành domain thật.
