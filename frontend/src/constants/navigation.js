import { ROUTES } from './routes';

/**
 * Navigation model.
 *
 * Restructured around what a visitor is trying to do — Learn, Tools, Community —
 * instead of the previous flat mix of homepage anchors and tool pages. Two
 * consequences that matter:
 *
 * - Primary nav points at real routes, not `/#anchor` fragments. Anchors only
 *   worked from the homepage and gave crawlers nothing to index.
 * - Every href here is checked against ROUTES, so a renamed route can't leave a
 *   dead link behind.
 */

/** Top-level desktop nav. `children` renders as a dropdown / drawer group. */
export const PRIMARY_NAV = [
  {
    name: 'Learn',
    href: ROUTES.whatIsVeganism,
    children: [
      { name: 'What Is Veganism?', href: ROUTES.whatIsVeganism, desc: 'The definition, in plain terms' },
      { name: 'Why Veganism?', href: ROUTES.whyVeganism, desc: 'Animals, environment, well-being' },
      { name: 'Get Started', href: ROUTES.getStarted, desc: 'A practical first-steps guide' },
      { name: 'Articles', href: ROUTES.articles, desc: 'Guides, explainers and updates' },
      { name: 'Recipes', href: ROUTES.recipes, desc: 'Everyday plant-based cooking' },
    ],
  },
  {
    name: 'Tools',
    href: ROUTES.planner,
    children: [
      { name: 'Meal Planner', href: ROUTES.planner, desc: 'Weekly plans + grocery list' },
      { name: 'Seasonal Produce', href: ROUTES.seasonal, desc: "What's fresh this month" },
      { name: 'Nutrition Calculator', href: ROUTES.calculator, desc: 'Calorie and macro estimates' },
      { name: 'Impact Per Meal', href: ROUTES.savings, desc: 'Water and carbon estimates' },
      { name: 'Vegan vs Omnivore', href: ROUTES.compare, desc: 'Side-by-side comparison' },
      { name: 'World Map', href: ROUTES.worldMap, desc: 'Global food-system data' },
    ],
  },
  {
    name: 'Community',
    href: ROUTES.community,
    children: [
      { name: 'Discussions', href: ROUTES.community, desc: 'Questions, tips and stories' },
      { name: 'Chat Rooms', href: ROUTES.chat, desc: 'Live conversation by topic' },
    ],
  },
  { name: 'About', href: ROUTES.about },
];

/**
 * Footer sitemap. Grouped so the footer doubles as a real index of the site —
 * previously it was one undifferentiated list of eight links that omitted most
 * of the site.
 */
export const FOOTER_NAV = [
  {
    heading: 'Learn',
    links: [
      { name: 'What Is Veganism?', href: ROUTES.whatIsVeganism },
      { name: 'Why Veganism?', href: ROUTES.whyVeganism },
      { name: 'Get Started', href: ROUTES.getStarted },
      { name: 'Articles', href: ROUTES.articles },
      { name: 'Recipes', href: ROUTES.recipes },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { name: 'Meal Planner', href: ROUTES.planner },
      { name: 'Seasonal Produce', href: ROUTES.seasonal },
      { name: 'Nutrition Calculator', href: ROUTES.calculator },
      { name: 'Impact Per Meal', href: ROUTES.savings },
      { name: 'Vegan vs Omnivore', href: ROUTES.compare },
      { name: 'World Map', href: ROUTES.worldMap },
    ],
  },
  {
    heading: 'Community',
    links: [
      { name: 'Discussions', href: ROUTES.community },
      { name: 'Chat Rooms', href: ROUTES.chat },
      { name: 'Create an Account', href: ROUTES.auth },
    ],
  },
  {
    heading: 'Organisation',
    links: [
      { name: 'About Vegan Life', href: ROUTES.about },
      { name: 'Contact Us', href: ROUTES.contact },
      { name: 'Sources & References', href: ROUTES.sources },
    ],
  },
];

/** Legal documents, shown in their own footer column and in the bottom bar. */
export const LEGAL_NAV = [
  { name: 'Privacy Policy', href: ROUTES.privacy },
  { name: 'Terms of Use', href: ROUTES.terms },
  { name: 'Cookie Policy', href: ROUTES.cookies },
  { name: 'Health Disclaimer', href: ROUTES.disclaimer },
  { name: 'Grievance Redressal', href: ROUTES.grievance },
];

/**
 * Kept for backwards compatibility with anything still importing the old names.
 * New code should use PRIMARY_NAV / FOOTER_NAV.
 */
export const NAV_LINKS = PRIMARY_NAV.filter((item) => !item.children);
export const EXPLORE_LINKS = PRIMARY_NAV.find((i) => i.name === 'Tools')?.children ?? [];
