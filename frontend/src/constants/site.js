// Single source of truth for brand identity, canonical origin and social handles.
//
// Anything that appears in page titles, share previews or structured data should
// read from here so the site never disagrees with itself. Values that depend on
// the deployment (origin) come from Vite env vars with a sensible fallback.
//
// IMPORTANT: only add a social/contact entry here once the account actually
// exists. Empty strings are treated as "not available" and the UI hides the link
// rather than rendering a dead one.

export const SITE = {
  name: 'Vegan Life',
  // Used in <title> suffixes and structured data.
  legalName: 'Vegan Life',
  tagline: 'Learn, Explore & Live Vegan',
  // One-sentence description used as the default meta description and OG blurb.
  description:
    'Vegan Life is a community platform for learning what veganism means, exploring practical resources, and connecting with people moving toward more compassionate, sustainable living.',
  shortDescription:
    'Learn about veganism, explore practical resources, and connect with a community exploring compassionate living.',
  origin: (import.meta.env.VITE_SITE_URL || 'https://vegan-life.vercel.app').replace(/\/$/, ''),
  locale: 'en',
  themeColor: '#573d21',
};

// Default share image. Points at the PWA icon until a purpose-built 1200x630
// social card is added to /public. Replace `path` (not the usages) when one is.
export const OG_IMAGE = {
  path: '/icon-512.png',
  width: 512,
  height: 512,
  alt: 'Vegan Life',
};

// Only platforms with a real, working account should have a non-empty href.
// The footer/nav filter these out automatically, so leaving one blank is safe.
export const SOCIAL_PROFILES = [
  { platform: 'instagram', label: 'Instagram', href: '' },
  { platform: 'twitter', label: 'X (Twitter)', href: '' },
  { platform: 'youtube', label: 'YouTube', href: '' },
  { platform: 'pinterest', label: 'Pinterest', href: '' },
];

// Same rule as socials: blank means "we don't publish this yet" and the UI adapts.
export const CONTACT = {
  email: '',
  // Free-text, shown on /contact only when set. Keep factual.
  responseTime: '',
  location: '',
};

// Legal identity used by the policy pages and footer. Fill these in with the real
// operator details before launch. Blank values make the pages fall back to the
// contact form instead of showing placeholders.
export const LEGAL = {
  // Individual or registered entity that operates the site (the "Data Fiduciary").
  operatorName: '',
  registeredAddress: '',
  // Grievance Officer under the DPDP Act, 2023 and the IT Rules, 2021.
  grievanceOfficer: { name: '', email: '', address: '' },
  jurisdiction: 'India',
  governingCity: '',
  lastUpdated: '30 October 2026',
  effectiveDate: '30 October 2026',
};

export const activeSocialProfiles = () => SOCIAL_PROFILES.filter((s) => Boolean(s.href));

/** Absolute URL for a site-relative path — needed for canonical + OG tags. */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/** `Page Title | Vegan Life`, but never `Vegan Life | Vegan Life`. */
export function formatTitle(title) {
  if (!title) return `${SITE.name} | ${SITE.tagline}`;
  return title === SITE.name ? title : `${title} | ${SITE.name}`;
}
