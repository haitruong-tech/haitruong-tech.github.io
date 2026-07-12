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

## Bật phần góp ý (trang /ideas/)

1. Push repo này lên GitHub (public), bật **Discussions** trong Settings.
2. Cài app giscus: https://github.com/apps/giscus
3. Vào https://giscus.app → chọn repo + category "Ideas" → copy `repoId` và `categoryId` vào `src/pages/ideas.astro`.

Viewers comment/vote đề xuất ngay trên trang, đăng nhập bằng GitHub.

## Deploy (miễn phí)

- **Vercel / Netlify**: import repo, framework tự nhận Astro, xong.
- **GitHub Pages**: xem https://docs.astro.build/en/guides/deploy/github/

Nhớ sửa `site` trong `astro.config.mjs` thành domain thật.
