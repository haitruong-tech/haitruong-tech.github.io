---
title: "Vì sao mình chọn Astro cho blog này"
description: "So sánh nhanh các lựa chọn khi làm blog cá nhân năm 2026, và lý do Astro thắng."
pubDate: 2026-07-12
tags: ["astro", "webdev"]
---

Khi bắt tay làm blog này, mình cân nhắc vài lựa chọn quen thuộc:

**Next.js** — mạnh, nhưng quá cồng kềnh cho một trang chỉ hiển thị bài viết. Blog không cần server components.

**Hugo** — build nhanh khủng khiếp, nhưng template Go khó tuỳ biến nếu bạn quen JavaScript.

**WordPress** — phải lo hosting, bảo mật, update. Không đáng cho blog cá nhân.

**Astro** — và đây là lựa chọn cuối cùng, vì:

Zero JavaScript mặc định, trang tải gần như tức thì. Bài viết là file Markdown, viết bằng editor nào cũng được, lưu trong git. Khi cần thành phần tương tác thì nhúng component vào từng chỗ cụ thể. Deploy tĩnh lên GitHub Pages hay Vercel đều miễn phí.

Với một blog cá nhân, tiêu chí quan trọng nhất là *viết dễ, chạy nhanh, không phải bảo trì*. Astro đáp ứng cả ba.
