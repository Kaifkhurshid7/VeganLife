# VeganLife — Green Earth

A premium, cinematic awareness platform promoting sustainable living and conscious food choices. Built as a modern single-page application with smooth animations, interactive data visualizations, and a rich earthy design system.

## Features

- Premium glassmorphism UI with organic design language
- Smooth scroll experience powered by Lenis
- Interactive environmental impact dashboard with live charts
- Comprehensive nutrition guide with animated progress indicators
- Recipe carousel with category filtering
- Gamified sustainability challenges with progress tracking
- Flip-card myth-busting section
- Student testimonial slider
- Fully responsive across mobile, tablet, and desktop
- Cinematic parallax hero with mouse-tracking depth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| Charts | Recharts |
| Carousel | Swiper |
| Icons | React Icons |
| Styling | CSS Modules + CSS Variables |

## Folder Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Feature sections (Hero, Impact, Nutrition, etc.)
│   └── ui/              # Reusable UI primitives (SectionHeader, WaveDivider, etc.)
├── constants/           # Static configuration (navigation links, social links)
├── data/                # Static data (blogs, recipes, nutrition, statistics)
├── hooks/               # Custom React hooks (useScrollPosition, useMousePosition, useCounter)
├── pages/               # Page-level compositions
├── styles/              # Global styles, CSS variables, animations
└── utils/               # Shared utilities (animation variants)
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Design Philosophy

The visual identity draws from an earthy, organic palette — warm clays, sage greens, muted purples, and cream tones. Typography pairs Playfair Display (headings) with Roboto Condensed (body) for a balance of editorial elegance and modern readability.

Glassmorphism cards with subtle backdrop blur create depth without visual noise. Organic SVG wave dividers transition between sections, reinforcing the natural theme. A film-grain noise overlay adds tactile texture across the entire viewport.

## Performance Optimization

- CSS Modules for zero-conflict, tree-shakeable styles
- Lazy-loaded images with native `loading="lazy"`
- Framer Motion `viewport={{ once: true }}` prevents re-triggering animations
- Lenis smooth scroll with optimized RAF loop
- Minimal bundle: no unused dependencies shipped
- Reusable animation variants reduce motion definition duplication

## Responsiveness

Fully adaptive layout system:
- **Mobile** (< 768px): Single-column layouts, hidden carousel arrows, reduced padding
- **Tablet** (768px–1024px): Two-column grids, adjusted typography scale
- **Desktop** (> 1024px): Full multi-column layouts, desktop navigation, hover interactions

## Future Scope

- Community forum and user profiles
- Personal sustainability dashboard with persistent tracking
- Searchable recipe database with filtering and favorites
- Sustainability tracker with weekly/monthly reports
- Dark mode toggle
- Internationalization (i18n) support
- PWA offline support

## License

MIT
