# 🌿 VeganLife — Green Earth

A production-grade, full-stack sustainability platform promoting conscious food choices, environmental awareness, and community engagement. Built with a cinematic earthy design system, real-time social features, and enterprise-level security.

**Live:** [Frontend (Vercel)](https://vegan-life.vercel.app) · [Backend API (Render)](https://veganlife.onrender.com/api/health)

---

## Features

### Platform
- Premium glassmorphism UI with organic earthy design language
- Ambient nature animations (butterflies, birds, fireflies, floating leaves, parallax layers)
- Smooth scroll experience (Lenis)
- PWA support — installable, offline-capable
- Splash screen with animated loading
- Page transition animations (fade between routes)
- Error boundary with graceful fallback UI
- Custom 404 page with illustrations
- Toast notification system (success/error/warning/info)
- Fully responsive (mobile, tablet, desktop)

### Pages & Tools
- **Home** — Cinematic hero, Why Vegan, Impact Dashboard, Nutrition Guide, Recipes, Myths, Challenges, Testimonials
- **Community** — Reddit/Instagram-style social feed with upvotes, comments, shares, search, delete own posts
- **Profile** — User profile with bio, stats, edit profile, view own posts
- **BMI & Calorie Calculator** — Personalized vegan macro planner
- **Carbon & Water Savings** — Per-meal environmental impact calculator
- **World Map** — Interactive global environmental impact data
- **Infographic** — Scroll-driven animated storytelling
- **Seasonal Produce** — Month-by-month fresh produce calendar
- **Vegan vs Omnivore** — Side-by-side comparison sliders
- **Admin Panel** — Post moderation, user management, analytics

### Authentication & Users
- JWT access + refresh token architecture
- Secure httpOnly cookie-based refresh tokens
- Role-based access (User / Admin)
- Admin login with secret key
- Profile management (update, change password, delete account)
- Password strength meter, real-time validation
- Split-screen premium auth UI
- Rate-limited auth endpoints

### Community & Social
- Post creation with category tagging
- Upvote/downvote system
- Threaded comments
- Share functionality
- Search posts by keyword
- Delete own posts
- Admin moderation (approve/reject/delete)
- Gamification badges (Seedling → Planet Guardian)
- XP system, streak tracking, leaderboard
- Skeleton loading states

### Nutrition System
- Expandable food cards with detailed nutritional data
- Cost, hostel-friendliness, shelf life, workout suitability
- Science-backed references (Harvard, WHO, ICMR, NCBI)
- Student-focused meal plans with Indian food options
- Meal ideas, pairing suggestions, common mistakes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Styling | CSS Modules, CSS Variables |
| Animations | Framer Motion, GSAP |
| Smooth Scroll | Lenis |
| Charts | Recharts |
| Carousel | Swiper |
| Icons | React Icons (Feather + FA6) |
| PWA | vite-plugin-pwa |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (access + refresh), bcrypt |
| Security | Helmet, CORS, Rate Limiting, XSS/NoSQL sanitization |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
VeganLife/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ambient/       # Nature animations
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── sections/      # Homepage sections
│   │   │   └── ui/            # Toast, ErrorBoundary, SplashScreen, BackButton, etc.
│   │   ├── constants/          # Navigation config
│   │   ├── context/            # AuthContext
│   │   ├── data/               # Static data (nutrition, blogs, recipes, statistics)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # All route pages
│   │   ├── styles/             # Global CSS, variables, animations
│   │   └── utils/              # Animation utilities
│   ├── public/                 # PWA assets, favicon
│   ├── .env                    # VITE_API_URL
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/            # DB connection, token utilities
│   │   ├── middleware/        # Auth, validation, security, error handling
│   │   ├── models/            # Mongoose schemas (User, Post)
│   │   ├── routes/            # API routes (auth, posts)
│   │   └── utils/             # ApiError, ApiResponse, asyncHandler, logger
│   ├── .env                   # MongoDB URI, JWT secrets, admin key
│   └── package.json
├── vercel.json                # Frontend deployment config
├── package.json               # Root workspace scripts
└── README.md
```

---

## Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt (12 rounds) |
| Token Architecture | Access (15min) + Refresh (7 days) rotation |
| Cookie Security | httpOnly, secure, sameSite |
| Rate Limiting | Auth: 15/15min, API: 100/min, Posts: 10/min |
| NoSQL Injection | Input sanitization (blocks $ operators) |
| XSS Prevention | HTML tag stripping on all inputs |
| HTTP Headers | Helmet (CSP, X-Frame, HSTS, etc.) |
| CORS | Dynamic origin whitelist with credentials |
| Body Limits | 5MB max payload |
| Error Handling | Global handler — no stack leaks in production |
| Validation | express-validator on all auth routes |
| DB Indexes | Compound indexes on User and Post for query performance |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/signup` | Create account | No |
| POST | `/login` | User login | No |
| POST | `/admin-login` | Admin login (secret key) | No |
| POST | `/refresh` | Refresh access token | Cookie |
| GET | `/me` | Get current user | Yes |
| PATCH | `/profile` | Update profile | Yes |
| PATCH | `/change-password` | Change password | Yes |
| POST | `/logout` | Logout | Yes |
| DELETE | `/account` | Delete account | Yes |

### Posts (`/api/posts`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | Get approved posts (paginated) | No |
| GET | `/:id` | Get single post | No |
| POST | `/` | Create post | Yes |
| POST | `/:id/upvote` | Toggle upvote | Yes |
| POST | `/:id/comments` | Add comment | Yes |
| DELETE | `/:postId/comments/:commentId` | Delete comment | Yes |
| GET | `/admin/all` | All posts (admin) | Admin |
| PATCH | `/:id/status` | Approve/reject (admin) | Admin |
| DELETE | `/:id` | Delete post (admin/owner) | Yes |

---

## Installation

```bash
git clone https://github.com/Kaifkhurshid7/VeganLife.git
cd VeganLife

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

## Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ADMIN_SECRET_KEY=vegan@life@098
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

## Deployment

**Frontend → Vercel:**
- Root Directory: `frontend`
- Framework: Vite (auto-detected)
- Env var: `VITE_API_URL=https://veganlife.onrender.com/api`

**Backend → Render:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node src/index.js`
- Add all env vars from backend/.env

---

## UX Features

| Feature | Description |
|---------|-------------|
| Splash Screen | Animated leaf + progress bar on first load |
| Page Transitions | Fade + slide between routes (Framer Motion) |
| Error Boundary | Graceful crash recovery with refresh button |
| 404 Page | Illustrated not-found with floating leaves |
| Toast System | Contextual success/error/warning notifications |
| Back Button | Auto-hides on scroll, reappears at top |
| Skeleton Loading | Shimmer placeholders while content loads |
| Search | Real-time post filtering by keyword |

---

## Performance

- Code-split vendor chunks (React, Framer Motion, Recharts, Swiper)
- CSS Modules for zero-conflict styles
- Lazy-loaded images (`loading="lazy"`)
- Framer Motion `viewport={{ once: true }}`
- Throttled cursor trail (80ms, max 8 particles)
- GPU-accelerated animations (`will-change: transform`)
- MongoDB compound indexes on hot queries
- Paginated API responses with lean queries
- PWA service worker caches assets and images

---

## Design Philosophy

Earthy organic palette — warm clays, sage greens, muted purples, cream tones. Playfair Display headings paired with Roboto Condensed body text. Glassmorphism cards with backdrop blur. Ambient nature animations inspired by Studio Ghibli and premium eco-brands. Film-grain noise overlay for tactile texture.

---

## Future Scope

- Real-time chat (Socket.IO)
- AI nutrition assistant (OpenAI)
- Image uploads (Cloudinary)
- Bookmark/save posts
- Follow system
- Notification bell
- Recipe detail pages
- PDF certificate generation
- Email verification
- Dark mode
- Internationalization (i18n)

---

## License

MIT
