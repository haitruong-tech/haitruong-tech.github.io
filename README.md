# Blog của Hải Trương

Blog cá nhân về tech, build bằng [Astro](https://astro.build). Có trang `/ideas/` để viewers đề xuất mình nên làm gì tiếp theo (chạy bằng [giscus](https://giscus.app) trên GitHub Discussions — không cần backend).

## Chạy local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build ra dist/
```

## Viết bài mới

Mỗi bài có **2 bản: tiếng Việt + tiếng Anh**, là 2 file cùng tên:

```
src/content/blog/vi/ten-bai.md   → /vi/blog/ten-bai/
src/content/blog/en/ten-bai.md   → /blog/ten-bai/
```

Frontmatter mỗi file:

```md
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn cho SEO"
pubDate: 2026-07-15
tags: ["astro", "webdev"]   # slug thường, không dấu, giống nhau ở cả 2 file
draft: false    # true = không publish (phải set cả 2 file)
---

Nội dung bài viết...
```

Thiếu 1 trong 2 bản → build fail với thông báo chỉ rõ file cần tạo. Nút chuyển ngôn ngữ trên trang bài viết tự nhảy đúng giữa 2 bản.

## i18n

Site có 2 ngôn ngữ: `/` (English) và `/vi/` (tiếng Việt), dùng i18n built-in của Astro.

- UI strings nằm hết trong `src/i18n/ui.ts` — thêm key mới phải thêm cả `en` lẫn `vi`.
- Trang localized là wrapper mỏng: `src/pages/ideas.astro` và `src/pages/vi/ideas.astro` cùng render component trong `src/components/`.
- Muốn localize trang mới: tạo component chung → 2 wrapper → thêm path vào `localizedPages` trong `ui.ts` (để switcher + hreflang hoạt động).
- Bài viết: mỗi bài 2 bản trong `blog/en/` + `blog/vi/` (xem mục Viết bài mới) — URL `/blog/...` và `/vi/blog/...` tự map với nhau.

## Bật phần góp ý (trang /ideas/)

1. Push repo này lên GitHub (public), bật **Discussions** trong Settings.
2. Cài app giscus: https://github.com/apps/giscus
3. Vào https://giscus.app → chọn repo + category "Ideas" → copy `repoId` và `categoryId` vào `src/pages/ideas.astro`.

Viewers comment/vote đề xuất ngay trên trang, đăng nhập bằng GitHub.

## Deploy — GitHub Pages

Site chạy tại **https://haitruong-tech.github.io** (repo `haitruong-tech/haitruong-tech.github.io`). Mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` tự build và deploy.

Lần đầu setup:

1. Tạo repo **public** tên `haitruong-tech.github.io` trên GitHub (không chọn thêm README/gitignore).
2. Push code (xem lệnh bên dưới).
3. Vào repo **Settings → Pages → Source: GitHub Actions**.

```bash
git branch -M main
git remote add origin git@github.com:haitruong-tech/haitruong-tech.github.io.git
git push -u origin main
```
