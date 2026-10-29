// Canonical route table.
//
// Every path the app knows about is declared once, here. Navigation, footer
// links, breadcrumbs and the sitemap generator all read from this file, which is
// what stops a link from pointing at a route that no longer exists.
//
// `indexable: false` marks routes that must stay out of search results —
// authenticated areas, personal pages, and anything behind a dynamic param.

export const ROUTES = {
  home: '/',

  // ---- Learn (public, educational, indexable) --------------------------
  whatIsVeganism: '/what-is-veganism',
  whyVeganism: '/why-veganism',
  getStarted: '/get-started',
  articles: '/articles',
  article: '/articles/:slug',
  recipes: '/recipes',
  recipe: '/recipes/:id',

  // ---- Tools ----------------------------------------------------------
  calculator: '/calculator',
  savings: '/savings',
  planner: '/planner',
  seasonal: '/seasonal',
  compare: '/compare',
  worldMap: '/world-map',
  infographic: '/infographic',

  // ---- Organisation / trust -------------------------------------------
  about: '/about',
  contact: '/contact',
  sources: '/sources',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  disclaimer: '/disclaimer',
  grievance: '/grievance',

  // ---- Community ------------------------------------------------------
  community: '/community',
  chat: '/chat',
  chatRoom: '/chat/:roomSlug',
  hashtag: '/hashtag/:tag',

  // ---- Account (never indexed) ----------------------------------------
  auth: '/auth',
  profile: '/profile/:username',
  editProfile: '/settings/profile',
  admin: '/admin',
};

export const buildPath = {
  article: (slug) => `/articles/${slug}`,
  recipe: (id) => `/recipes/${id}`,
  hashtag: (tag) => `/hashtag/${encodeURIComponent(tag)}`,
  profile: (username) => `/profile/${username}`,
  chatRoom: (slug) => `/chat/${slug}`,
};

/**
 * Static, indexable pages with their sitemap priority.
 *
 * Dynamic routes (articles, recipes) are appended by scripts/generate-sitemap.mjs
 * from the actual content data, so the sitemap can never list a slug that has no
 * page behind it.
 */
export const INDEXABLE_PAGES = [
  { path: ROUTES.home, priority: 1.0, changefreq: 'weekly' },
  { path: ROUTES.whatIsVeganism, priority: 0.9, changefreq: 'monthly' },
  { path: ROUTES.whyVeganism, priority: 0.9, changefreq: 'monthly' },
  { path: ROUTES.getStarted, priority: 0.9, changefreq: 'monthly' },
  { path: ROUTES.articles, priority: 0.8, changefreq: 'weekly' },
  { path: ROUTES.recipes, priority: 0.8, changefreq: 'weekly' },
  { path: ROUTES.about, priority: 0.7, changefreq: 'yearly' },
  { path: ROUTES.contact, priority: 0.6, changefreq: 'yearly' },
  { path: ROUTES.sources, priority: 0.5, changefreq: 'monthly' },
  { path: ROUTES.seasonal, priority: 0.6, changefreq: 'monthly' },
  { path: ROUTES.compare, priority: 0.6, changefreq: 'yearly' },
  { path: ROUTES.calculator, priority: 0.6, changefreq: 'yearly' },
  { path: ROUTES.savings, priority: 0.6, changefreq: 'yearly' },
  { path: ROUTES.planner, priority: 0.6, changefreq: 'monthly' },
  { path: ROUTES.worldMap, priority: 0.5, changefreq: 'yearly' },
  { path: ROUTES.infographic, priority: 0.5, changefreq: 'yearly' },
  { path: ROUTES.community, priority: 0.5, changefreq: 'daily' },
  { path: ROUTES.privacy, priority: 0.3, changefreq: 'yearly' },
  { path: ROUTES.terms, priority: 0.3, changefreq: 'yearly' },
  { path: ROUTES.cookies, priority: 0.2, changefreq: 'yearly' },
  { path: ROUTES.disclaimer, priority: 0.3, changefreq: 'yearly' },
  { path: ROUTES.grievance, priority: 0.3, changefreq: 'yearly' },
];

/** Paths that must never be indexed — used by robots.txt and the Seo component. */
export const NOINDEX_PREFIXES = ['/auth', '/settings', '/admin', '/chat', '/profile', '/hashtag'];
