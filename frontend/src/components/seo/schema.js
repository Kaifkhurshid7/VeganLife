// Schema.org builders.
//
// Ground rule: structured data must only restate facts the page itself shows.
// No invented ratings, member counts, awards, founding dates or nutrition
// values. Fields we cannot verify are omitted rather than guessed — omission is
// valid, fabrication is not.

import { SITE, OG_IMAGE, absoluteUrl, activeSocialProfiles, CONTACT } from '../../constants/site';

/** Drop keys whose value is empty so we never emit `"author": ""`. */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );
}

export function organizationSchema() {
  return compact({
    '@type': 'Organization',
    '@id': `${SITE.origin}/#organization`,
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
    logo: absoluteUrl(OG_IMAGE.path),
    sameAs: activeSocialProfiles().map((s) => s.href),
    email: CONTACT.email || undefined,
  });
}

export function webSiteSchema() {
  return compact({
    '@type': 'WebSite',
    '@id': `${SITE.origin}/#website`,
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': `${SITE.origin}/#organization` },
  });
}

/** `trail` is an ordered [{ name, path }] list, root-first. */
export function breadcrumbSchema(trail = []) {
  if (!trail.length) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Article schema. `author` is intentionally optional: several articles on this
 * site are editorial pieces with no named byline, and inventing one would be
 * dishonest. When absent, the organization is credited instead.
 */
export function articleSchema({ title, description, path, image, datePublished, dateModified, section, author }) {
  return compact({
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    articleSection: section,
    inLanguage: 'en',
    author: author
      ? { '@type': 'Person', name: author }
      : { '@id': `${SITE.origin}/#organization` },
    publisher: { '@id': `${SITE.origin}/#organization` },
    isAccessibleForFree: true,
  });
}

/**
 * Recipe schema. Nutrition is deliberately excluded — the recipe data in this
 * project does not carry verified per-serving values, and Google's Recipe
 * markup expects real numbers.
 */
export function recipeSchema({ name, description, path, image, prepTime, cookTime, servings, ingredients, steps, categories }) {
  return compact({
    '@type': 'Recipe',
    name,
    description,
    url: absoluteUrl(path),
    image: image ? [image] : undefined,
    prepTime: prepTime ? `PT${prepTime}M` : undefined,
    cookTime: cookTime ? `PT${cookTime}M` : undefined,
    totalTime: prepTime || cookTime ? `PT${(prepTime || 0) + (cookTime || 0)}M` : undefined,
    recipeYield: servings ? `${servings} serving${servings > 1 ? 's' : ''}` : undefined,
    recipeIngredient: ingredients,
    recipeInstructions: (steps || []).map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
    recipeCategory: categories,
    suitableForDiet: ['https://schema.org/VeganDiet'],
    publisher: { '@id': `${SITE.origin}/#organization` },
  });
}

/** FAQPage — only for pages that literally render these Q&As on screen. */
export function faqSchema(items = []) {
  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function collectionPageSchema({ title, description, path }) {
  return compact({
    '@type': 'CollectionPage',
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${SITE.origin}/#website` },
  });
}

export function aboutPageSchema({ title, description, path }) {
  return compact({
    '@type': 'AboutPage',
    name: title,
    description,
    url: absoluteUrl(path),
    about: { '@id': `${SITE.origin}/#organization` },
  });
}

export function contactPageSchema({ path }) {
  return {
    '@type': 'ContactPage',
    name: `Contact ${SITE.name}`,
    url: absoluteUrl(path),
    about: { '@id': `${SITE.origin}/#organization` },
  };
}
