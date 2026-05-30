# VeganLife — Green Earth

A premium, cinematic awareness platform promoting sustainable living and conscious food choices. Built as a modern single-page application with smooth animations, interactive data visualizations, and a rich earthy design system.

## Features

- Premium glassmorphism UI with organic design language
- Ambient nature animations (butterflies, birds, fireflies, floating leaves, deer silhouettes)
- Smooth scroll experience powered by Lenis
- Interactive environmental impact dashboard with live charts
- Comprehensive nutrition guide with animated progress indicators
- Recipe carousel with category filtering
- Gamified sustainability challenges with progress tracking
- Flip-card myth-busting section
- Student testimonial slider
- Parallax forest layers and cursor trail effects
- Fully responsive across mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| Charts | Recharts |
| Carousel | Swiper |
| Icons | React Icons |
| Styling | CSS Modules + CSS Variables |
| Backend (future) | Express.js |

## Project Structure

```
VEGAN-LIFE/
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ambient/    # Nature animations (butterflies, birds, fireflies, etc.)
│   │   │   ├── layout/     # Navbar, Footer
│   │   │   ├── sections/   # Feature sections (Hero, Impact, Nutrition, etc.)
│   │   │   └── ui/         # Reusable UI primitives
│   │   ├── constants/      # Static configuration
│   │   ├── data/           # Static data (blogs, recipes, nutrition, statistics)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level compositions
│   │   ├── styles/         # Global styles, CSS variables, animations
│   │   └── utils/          # Shared utilities
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                 # Express API (future)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── vercel.json              # Vercel deployment config
├── package.json             # Root scripts
└── README.md
```

## Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd frontend && npm install
cd backend && npm install
```

## Development

```bash
# Run frontend dev server
npm run dev:frontend

# Run backend dev server (future)
npm run dev:backend
```

## Build

```bash
# Production build (frontend)
npm run build

# Preview production build
npm run preview
```

## Deployment (Vercel)

This project is configured for one-click Vercel deployment.

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects the `vercel.json` config
5. Click **Deploy**

No additional settings needed — the `vercel.json` handles:
- Install command: `cd frontend && npm install`
- Build command: `cd frontend && npm run build`
- Output directory: `frontend/dist`

### Option 3: Drag & Drop

1. Run `npm run build` locally
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the `frontend/dist` folder into the upload area

## Design Philosophy

The visual identity draws from an earthy, organic palette — warm clays, sage greens, muted purples, and cream tones. Typography pairs Playfair Display (headings) with Roboto Condensed (body) for editorial elegance and modern readability.

Ambient nature animations (butterflies, floating birds, fireflies, drifting leaves) create a living ecosystem feel inspired by nature documentaries and Studio Ghibli atmospheres.

## Performance Optimization

- CSS Modules for zero-conflict, tree-shakeable styles
- Lazy-loaded images with native `loading="lazy"`
- Framer Motion `viewport={{ once: true }}` prevents re-triggering
- Throttled cursor trail (80ms intervals, max 8 particles)
- `will-change: transform` for GPU-accelerated animations
- `pointer-events: none` on all decorative layers
- Lenis smooth scroll with optimized RAF loop

## Responsiveness

- **Mobile** (< 768px): Single-column, hidden carousel arrows, reduced animations
- **Tablet** (768px–1024px): Two-column grids, adjusted typography
- **Desktop** (> 1024px): Full layouts, desktop nav, hover interactions, cursor trail

## Future Scope

- Community forum and user profiles (backend)
- Personal sustainability dashboard with persistent tracking
- Searchable recipe database with filtering and favorites
- Sustainability tracker with weekly/monthly reports
- Dark mode toggle
- Internationalization (i18n) support
- PWA offline support

## License

MIT
