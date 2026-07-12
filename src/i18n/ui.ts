export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

const en = {
  'site.description': "Nick's notes on software and side projects.",
  'nav.blog': 'Blog',
  'nav.ideas': 'Suggest an idea',
  'footer.builtWith': 'Built with Astro',
  'home.kicker': 'Software · Side projects · Learning in public',
  'home.greeting': "Hi, I'm Nick 👋",
  'home.intro':
    'I write about software, side projects, and things I learn along the way. Posts are in Vietnamese or English — whichever fits best.',
  'home.ideas.before': "Out of ideas? Me too, sometimes. That's why there's a page where ",
  'home.ideas.link': 'you can tell me what to build next',
  'home.ideas.after': '.',
  'home.posts': 'Posts',
  'home.posts.badge': 'Fresh from the blog',
  'home.stats.languages': 'Languages',
  'home.stats.ideas': 'Ideas welcome',
  'post.read': 'Read',
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
  'site.description': 'Ghi chép của Nick về phần mềm và side project.',
  'nav.blog': 'Blog',
  'nav.ideas': 'Góp ý tưởng',
  'footer.builtWith': 'Dựng bằng Astro',
  'home.kicker': 'Phần mềm · Side project · Học công khai',
  'home.greeting': 'Chào, mình là Nick 👋',
  'home.intro':
    'Mình viết về phần mềm, side project và những thứ học được trên đường. Bài viết bằng tiếng Việt hoặc tiếng Anh — tuỳ chủ đề.',
  'home.ideas.before': 'Hết ý tưởng? Đôi khi mình cũng vậy. Nên mới có một trang để ',
  'home.ideas.link': 'bạn nói mình nên làm gì tiếp theo',
  'home.ideas.after': '.',
  'home.posts': 'Bài viết',
  'home.posts.badge': 'Mới trên blog',
  'home.stats.languages': 'Ngôn ngữ',
  'home.stats.ideas': 'Ý tưởng chờ bạn',
  'post.read': 'Đọc',
  'ideas.title': "Góp ý tưởng · Nick's Tech Blog",
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
 * Pages that physically exist in every locale.
 * When you localize a new page (add a file under src/pages/vi/), add its
 * unprefixed path here so the language switcher and hreflang tags pick it up.
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
  return localizedPages.includes(normalized) ? localizePath(normalized, target) : null;
}
