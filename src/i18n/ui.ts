export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

const en = {
  'site.name': "Nick's Tech Blog",
  'site.title': "Nick's Tech Blog · Fullstack JavaScript & Side Projects",
  'site.description': "Nick's notes on software and side projects.",
  'nav.blog': 'Blog',
  'nav.ideas': 'Suggest an idea',
  'footer.builtWith': 'Built with Astro',
  'home.kicker': 'Webdev · Side projects · Learning in public',
  'home.greeting': "Hi, I'm Nick 👋",
  'home.intro':
    "I'm a fullstack JavaScript developer. This is where I write about side projects and things I learn along the way — in Vietnamese or English, whichever fits. Expect build logs, lessons learned, and the occasional rabbit hole.",
  'home.ideas.before': "Out of ideas? Me too, sometimes. That's why there's a page where ",
  'home.ideas.link': 'you can tell me what to build next',
  'home.ideas.after': '.',
  'home.posts': 'Posts',
  'home.posts.badge': 'Fresh from the blog',
  'home.stats.languages': 'Languages',
  'home.stats.ideas': 'Ideas welcome',
  'post.read': 'Read',
  'about.badge': 'About me',
  'about.heading': 'A bit about me',
  'about.p1':
    "By day I'm a fullstack developer at Golden Owl Solutions, where I also mentor junior developers and serve as vice leader of the dev team — reviewing code, unblocking teammates, and helping people grow is a big part of what I enjoy. My toolbox is JavaScript end to end: Nuxt, Vue and React on the frontend; Node, Express and NestJS on the backend.",
  'about.p2':
    "Right now most of my time goes into real estate analytics — products that turn messy property data into something people can actually use:",
  'about.p3':
    "Outside of work: an IELTS 7.0 certificate, a habit of teaching myself whatever looks interesting, a weakness for music with a hook that won't let go, and a piano I'm about to start learning. This blog is where all of that leaks out — and if a post here saves you an afternoon of debugging, it did its job.",
  'about.stackLabel': 'Main stack',
  'about.projectsLabel': 'Working on',
  'ideas.title': "Suggest an idea · Nick's Tech Blog",
  'ideas.description': 'Tell me what I should build or write about next.',
  'ideas.heading': 'What should I build next? 🤔',
  'ideas.p1':
    "Sometimes I genuinely don't know what to work on. So instead of guessing, I'm asking you: ",
  'ideas.p1.strong': 'what should I build or write about next?',
  'ideas.p2':
    "Drop your idea below, or 👍 the ones you'd like to see. The most upvoted suggestion becomes my next project.",
} as const;

const vi: Record<keyof typeof en, string> = {
  'site.name': 'Blog Webdev của Nick',
  'site.title': 'Blog Webdev của Nick · Fullstack JavaScript & Side Project',
  'site.description': 'Ghi chép của Nick về phần mềm và side project.',
  'nav.blog': 'Blog',
  'nav.ideas': 'Góp ý tưởng',
  'footer.builtWith': 'Dựng bằng Astro',
  // Intentionally kept in English on both locales (owner's preference).
  'home.kicker': 'Webdev · Side projects · Learning in public',
  'home.greeting': 'Chào, mình là Nick 👋',
  'home.intro':
    'Mình là fullstack JavaScript developer. Đây là nơi mình viết về side project và những thứ học được trên đường — bằng tiếng Việt hoặc tiếng Anh, tuỳ chủ đề. Sẽ có build log, bài học rút ra, và thỉnh thoảng một cái hố mình lỡ sa chân vào.',
  'home.ideas.before': 'Hết ý tưởng? Đôi khi mình cũng vậy. Nên mới có một trang để ',
  'home.ideas.link': 'bạn nói mình nên làm gì tiếp theo',
  'home.ideas.after': '.',
  'home.posts': 'Bài viết',
  'home.posts.badge': 'Mới trên blog',
  'home.stats.languages': 'Ngôn ngữ',
  'home.stats.ideas': 'Ý tưởng chờ bạn',
  'post.read': 'Đọc',
  'about.badge': 'Về mình',
  'about.heading': 'Đôi chút về mình',
  'about.p1':
    'Ban ngày mình là fullstack developer tại Golden Owl Solutions, kiêm mentor cho các bạn junior và vice leader của team dev — review code, gỡ vướng cho đồng đội và nhìn mọi người tiến bộ là phần mình thích nhất của công việc. Đồ nghề là JavaScript từ đầu tới cuối: Nuxt, Vue, React phía frontend; Node, Express, NestJS phía backend.',
  'about.p2':
    'Hiện tại phần lớn thời gian mình dành cho real estate analytics — những sản phẩm biến dữ liệu bất động sản lộn xộn thành thứ dùng được:',
  'about.p3':
    'Ngoài công việc: IELTS 7.0, thói quen tự học bất cứ thứ gì trông thú vị, mê những bản nhạc có giai điệu lôi cuốn không dứt ra được, và một cây piano sắp bắt đầu học. Blog này là nơi tất cả những thứ đó tràn ra — và nếu một bài viết ở đây giúp bạn tiết kiệm được một buổi chiều debug thì nó đã hoàn thành nhiệm vụ.',
  'about.stackLabel': 'Stack chính',
  'about.projectsLabel': 'Đang làm',
  'ideas.title': 'Góp ý tưởng · Blog Webdev của Nick',
  'ideas.description': 'Nói cho mình biết nên làm gì hoặc viết gì tiếp theo.',
  'ideas.heading': 'Mình nên làm gì tiếp theo? 🤔',
  'ideas.p1': 'Đôi khi mình thật sự không biết nên làm gì. Thay vì tự đoán, mình hỏi thẳng bạn: ',
  'ideas.p1.strong': 'mình nên làm gì hoặc viết gì tiếp theo?',
  'ideas.p2':
    'Để lại ý tưởng bên dưới, hoặc 👍 những ý bạn muốn thấy. Ý được vote nhiều nhất sẽ thành dự án tiếp theo của mình.',
};

export const ui = { en, vi } as const;

export type UiKey = keyof typeof en;

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Static pages that physically exist in every locale.
 * When you localize a new page (add a file under src/pages/vi/), add its
 * unprefixed path here so the language switcher and hreflang tags pick it up.
 * Blog posts don't belong here — every post has a version in every locale
 * (enforced by src/lib/blog.ts), so /blog/... paths translate automatically.
 */
export const localizedPages = ['/', '/ideas/'];

/** Prefix a root-relative path for the given locale (default locale stays unprefixed). */
export function localizePath(path: string, lang: Lang): string {
  return lang === defaultLang ? path : `/${lang}${path}`;
}

/** Counterpart of `pathname` in the target locale, or null when none exists. */
export function translatePath(pathname: string, target: Lang): string | null {
  const bare = pathname.replace(/^\/vi(?=\/|$)/, '') || '/';
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  if (normalized.startsWith('/blog/')) return localizePath(normalized, target);
  return localizedPages.includes(normalized) ? localizePath(normalized, target) : null;
}
