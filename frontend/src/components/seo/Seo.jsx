import { useEffect } from 'react';
import { SITE, OG_IMAGE, absoluteUrl, formatTitle } from '../../constants/site';

// Dependency-free document-head manager.
//
// This is a client-rendered SPA, so crawlers that execute JS (Google, Bing) read
// the tags we write here, while link-unfurlers that only read raw HTML fall back
// to the static defaults in index.html. Adding react-helmet would not change
// that trade-off, so we avoid the extra dependency.
//
// Every element we create is stamped with data-seo="managed" and removed on
// unmount, so navigating between pages can never leave a previous page's
// description or JSON-LD behind.

const MANAGED = 'data-seo';
const MANAGED_VALUE = 'managed';

/** Create-or-update a <meta> tag, keyed by name or property. */
function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED, MANAGED_VALUE);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * @param {string}  title        Page title without the site suffix.
 * @param {string}  description  Unique meta description for this page.
 * @param {string}  path         Site-relative path, used for the canonical URL.
 * @param {string}  image        Share image (absolute or site-relative).
 * @param {'website'|'article'} type OG type.
 * @param {boolean} noindex      Set on pages that should stay out of search results.
 * @param {object|object[]} schema JSON-LD payload(s) — omit `@context`, added here.
 * @param {object}  article      { publishedTime, modifiedTime, section, tags[] }
 */
export default function Seo({
  title,
  description = SITE.description,
  path,
  image,
  type = 'website',
  noindex = false,
  schema,
  article,
}) {
  useEffect(() => {
    const fullTitle = formatTitle(title);
    const canonical = absoluteUrl(path || `${window.location.pathname}`);
    const shareImage = absoluteUrl(image || OG_IMAGE.path);

    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonical);

    // Open Graph
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:locale', 'en_US');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', shareImage);
    upsertMeta('property', 'og:image:alt', title ? `${title} — ${SITE.name}` : OG_IMAGE.alt);

    // Twitter/X
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', shareImage);

    if (article) {
      upsertMeta('property', 'article:published_time', article.publishedTime);
      upsertMeta('property', 'article:modified_time', article.modifiedTime || article.publishedTime);
      upsertMeta('property', 'article:section', article.section);
    }

    // JSON-LD. Rewritten wholesale each time so stale graphs can't linger.
    const graphs = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);
    const scripts = graphs.map((graph) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute(MANAGED, MANAGED_VALUE);
      el.textContent = JSON.stringify({ '@context': 'https://schema.org', ...graph });
      document.head.appendChild(el);
      return el;
    });

    return () => {
      scripts.forEach((el) => el.remove());
      // Article-only tags must not leak onto the next (non-article) page.
      ['article:published_time', 'article:modified_time', 'article:section'].forEach((key) => {
        document.head.querySelector(`meta[property="${key}"][${MANAGED}]`)?.remove();
      });
    };
    // Object props are usually built inline by callers, so a new identity arrives
    // on every render. Comparing serialized values keeps the effect from
    // re-running (and re-appending JSON-LD) on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, JSON.stringify(schema), JSON.stringify(article)]);

  return null;
}
