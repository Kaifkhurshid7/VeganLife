# VeganLife — Green Earth

A production-grade, full-stack sustainability platform promoting conscious food choices, environmental awareness, and community engagement. Built with a cinematic earthy design system, real-time social features, and enterprise-level security.

**Live:** [Frontend (Vercel)](https://vegan-life.vercel.app) · [Backend API (Render)](https://veganlife.onrender.com/api/health)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Security](#security)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [UX Features](#ux-features)
- [Performance](#performance)
- [Design Philosophy](#design-philosophy)
- [Future Scope](#future-scope)
- [License](#license)

---

## Features

### Platform

- Premium glassmorphism UI with an organic earthy design language
- Ambient nature animations (butterflies, birds, fireflies, floating leaves, parallax layers, cursor trail)
- Smooth scroll experience (Lenis)
- PWA support — installable and offline-capable
- Animated splash screen on first load
- Page transition animations between routes
- Error boundary with a graceful fallback UI
- Custom illustrated 404 page
- Toast notification system (success / error / warning / info)
- Fully responsive across mobile, tablet, and desktop

### Pages & Tools

- **Home** — Cinematic hero, Why Vegan, Impact Dashboard, Nutrition Guide, Recipes, Myths, Challenges, Testimonials
- **Community** — Social feed with upvotes, threaded comments, replies, reactions, hashtags, search, and post management
- **Profile** — User profile with avatar, bio, stats, badge, streak, and posts
- **Edit Profile** (`/settings/profile`) — Profile photo upload, basic info editing, and change password
- **BMI & Calorie Calculator** — Personalized vegan macro planner
- **Carbon & Water Savings** — Per-meal environmental impact calculator
- **World Map** — Interactive global environmental impact data
- **Infographic** — Scroll-driven animated storytelling
- **Seasonal Produce** — Month-by-month fresh produce calendar
- **Vegan vs Omnivore** — Side-by-side comparison sliders
- **Real-Time Chat** — Room-based group chat with Socket.IO, unread counts, and message history
- **Admin Panel** — Post moderation, user management, analytics

### Authentication & Account

- JWT access + refresh token architecture with rotation and reuse detection
- Secure httpOnly cookie-based refresh tokens
- Role-based access (User / Admin) with a secret-key admin login
- Signup with strict validation: name (max 50), username (3-20, letters/numbers/underscores), email format, and a password policy of at least 8 characters containing a letter and a number
- Per-field inline validation errors, both client-side and from the server (express-validator)
- Password strength meter with live scoring
- Show/hide password toggles and accessible labels on all fields
- Profile management — update name, username, bio (max 300), and avatar
- Profile photo upload (multer, image-only, 5MB cap) backed by Cloudinary with a local fallback in development
- Change password (requires the current password and enforces the password policy)
- Delete account
- Rate-limited auth endpoints

### Community & Social

- Post creation with category tagging and hashtags
- Upvote/downvote system
- Threaded comments with replies, reactions, and pinning
- Share functionality
- Search posts by keyword and hashtag
- Trending hashtags
- Post polls with voting
- Delete own posts; admin moderation (approve / reject / delete / pin)
- Follow/unfollow users with follower and following lists
- Bookmarks to save posts
- Personalized collections for curating posts
- Gamification badges (Seedling, Conscious Eater, Eco Warrior, Planet Guardian, Sustainability Mentor)
- XP system, streak tracking, and user leaderboards

### Real-Time Chat

- Socket.IO-powered room-based messaging
- Create and join rooms, admin-controlled room management
- Per-room unread counts and message history

### Nutrition System

- Expandable food cards with detailed nutritional data
- Cost, hostel-friendliness, shelf life, and workout suitability indicators
- Science-backed references (Harvard, WHO, ICMR, NCBI)
- Student-focused meal plans with Indian food options
- Meal ideas, pairing suggestions, and common mistakes

---

## Tech Stack

| Layer        | Technology                                                              |
|--------------|-------------------------------------------------------------------------|
| Frontend     | React 18, Vite, React Router                                            |
| Styling      | CSS Modules, CSS Variables                                              |
| Animations   | Framer Motion, GSAP                                                     |
| Smooth Scroll| Lenis                                                                   |
| Charts       | Recharts                                                                |
| Carousel     | Swiper                                                                  |
| Icons        | React Icons (Feather + Font Awesome 6)                                  |
| Realtime     | Socket.IO (client)                                                      |
| PWA          | vite-plugin-pwa                                                         |
| Backend      | Node.js, Express                                                        |
| Database     | MongoDB Atlas, Mongoose                                                 |
| Auth         | JWT (access + refresh), bcrypt (12 rounds)                              |
| Validation   | express-validator                                                       |
| Uploads      | Multer, Cloudinary (with local-dev fallback)                            |
| Security     | Helmet, CORS, express-rate-limit, Redis store, XSS/NoSQL sanitization   |
| Monitoring   | Sentry                                                                  |
| Deployment   | Vercel (frontend), Render (backend)                                     |

---

## Project Structure

```
VeganLife/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ambient/       # Nature animations (butterflies, leaves, birds)
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── sections/      # Homepage sections
│   │   │   └── ui/            # Toast, ErrorBoundary, SplashScreen, PasswordStrength, etc.
│   │   ├── constants/         # Navigation config
│   │   ├── context/           # AuthContext, ChatContext
│   │   ├── data/              # Static data (nutrition, blogs, recipes, statistics)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # All route pages (Home, Auth, Profile, EditProfile, Chat, ...)
│   │   ├── styles/            # Global CSS, variables, animations
│   │   └── utils/             # API helpers, animation variants, icon map
│   ├── public/                # PWA assets, favicon
│   ├── .env                   # VITE_API_URL
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/            # DB, tokens, cookies, multer, redis, sentry
│   │   ├── middleware/        # Auth, validation, security, error handling
│   │   ├── models/            # Mongoose schemas (User, Post, Comment, Room, ...)
│   │   ├── realtime/          # Socket.IO setup
│   │   ├── routes/            # API routes (auth, posts, users, collections, rooms)
│   │   ├── utils/             # ApiError, uploadService, seedRooms, logger, badges
│   │   └── index.js           # Server entry
│   ├── .env                   # MongoDB URI, JWT secrets, admin key
│   └── package.json
├── vercel.json                # Frontend deployment config
├── package.json               # Root workspace scripts
└── README.md
```

---

## Security

| Feature              | Implementation                                                          |
|----------------------|-------------------------------------------------------------------------|
| Password Hashing     | bcrypt, 12 salt rounds                                                  |
| Token Architecture   | Access token (15 min) + refresh token (7 days), rotated on every refresh|
| Cookie Security      | httpOnly, secure, sameSite                                              |
| Rate Limiting        | Auth: 15/15 min, API: 100/min, Posts: 10/min (Redis-backed when configured) |
| NoSQL Injection      | Input sanitization that blocks `$` operators                            |
| XSS Prevention       | HTML tag stripping on all string inputs                                 |
| HTTP Headers         | Helmet (CSP, X-Frame-Options, HSTS, etc.)                               |
| CORS                 | Dynamic origin whitelist with credentials (comma-separated `CLIENT_URL`)|
| Request Validation   | express-validator on signup, login, profile update, and change-password |
| Password Policy      | Min 8 characters with at least one letter and one number                |
| Field Whitelisting   | Profile updates limited to name, username, bio, avatar (role/email/tokens are protected) |
| Upload Security      | Multer image-only filter (JPEG/PNG/GIF/WebP) and 5MB file-size cap      |
| Body Limits          | 5MB max JSON payload                                                    |
| Error Handling       | Global handler — no stack leaks in production; Sentry reporting          |
| DB Indexes           | Indexes on User and Post for query performance                          |

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Route             | Description              | Auth   |
|--------|-------------------|--------------------------|--------|
| POST   | `/signup`         | Create account           | No     |
| POST   | `/login`          | User login               | No     |
| POST   | `/admin-login`    | Admin login (secret key) | No     |
| POST   | `/refresh`        | Rotate tokens            | Cookie |
| GET    | `/me`             | Get current user         | Yes    |
| PATCH  | `/profile`        | Update name/username/bio/avatar | Yes |
| POST   | `/avatar`         | Upload profile photo     | Yes    |
| PATCH  | `/change-password`| Change password          | Yes    |
| POST   | `/logout`         | Logout                   | Yes    |
| DELETE | `/account`        | Delete account           | Yes    |

### Users (`/api/users`)

| Method | Route                         | Description            | Auth |
|--------|-------------------------------|------------------------|------|
| GET    | `/search?q=`                  | Search users           | No   |
| GET    | `/profile/:username`          | Public profile         | No   |
| GET    | `/:userId`                    | User by ID             | No   |
| POST   | `/:targetUserId/follow`       | Follow / unfollow      | Yes  |
| GET    | `/:userId/followers`          | Followers list         | No   |
| GET    | `/:userId/following`          | Following list         | No   |
| GET    | `/:userId/posts`              | Paginated user posts   | No   |
| GET    | `/:userId/mentions`           | Mentions               | Yes  |
| GET    | `/:userId/badges`             | Badges                 | No   |
| POST   | `/bookmarks/:postId`          | Toggle bookmark        | Yes  |
| GET    | `/bookmarks/all`              | All bookmarks          | Yes  |

### Posts (`/api/posts`)

| Method | Route                                   | Description                | Auth   |
|--------|-----------------------------------------|----------------------------|--------|
| GET    | `/`                                     | Approved posts (paginated) | No     |
| GET    | `/:id`                                  | Single post                | No     |
| GET    | `/:id/comments`                         | Post comments              | No     |
| GET    | `/hashtag/:tag`                         | Posts by hashtag           | No     |
| GET    | `/trending/hashtags`                    | Trending hashtags          | No     |
| POST   | `/`                                     | Create post                | Yes    |
| POST   | `/:id/upvote`                           | Toggle upvote              | Yes    |
| POST   | `/:id/comments`                         | Add comment                | Yes    |
| POST   | `/:postId/comments/:commentId/reply`    | Reply to comment           | Yes    |
| POST   | `/:postId/comments/:commentId/react`    | React to comment           | Yes    |
| POST   | `/:postId/comments/:commentId/pin`      | Pin / unpin comment        | Yes    |
| POST   | `/:id/polls`                            | Create a poll              | Yes    |
| POST   | `/:id/polls/:pollId/vote`               | Vote on a poll             | Yes    |
| POST   | `/:id/pin`                              | Pin / unpin post           | Admin  |
| GET    | `/admin/all`                            | All posts (moderation)     | Admin  |
| PATCH  | `/:id/status`                           | Approve / reject           | Admin  |
| DELETE | `/:id`                                  | Delete post                | Admin / Owner |
| DELETE | `/:postId/comments/:commentId`          | Delete comment             | Yes    |

### Collections (`/api/collections`)

| Method | Route                        | Description        | Auth |
|--------|------------------------------|--------------------|------|
| GET    | `/`                          | List collections   | Yes  |
| GET    | `/:collectionId/posts`       | Collection posts   | Yes  |
| POST   | `/`                          | Create collection  | Yes  |
| POST   | `/:collectionId/add`         | Add post           | Yes  |
| POST   | `/:collectionId/remove`      | Remove post        | Yes  |
| PATCH  | `/:collectionId`             | Update collection  | Yes  |
| DELETE | `/:collectionId`             | Delete collection  | Yes  |

### Rooms (`/api/rooms`)

| Method | Route             | Description          | Auth  |
|--------|-------------------|----------------------|-------|
| GET    | `/`               | List rooms           | Yes   |
| GET    | `/:id/messages`   | Message history      | Yes   |
| POST   | `/`               | Create room          | Yes   |
| DELETE | `/:id`            | Delete room          | Admin |

---

## Installation

```bash
git clone https://github.com/Kaifkhurshid7/VeganLife.git
cd VeganLife

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

Or from the root, install everything at once:

```bash
npm run install:all
```

---

## Environment Variables

**Frontend** (`frontend/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ADMIN_SECRET_KEY=your_admin_login_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional — enables Redis-backed rate limiting and pub/sub
REDIS_URL=redis://localhost:6379

# Optional — enables Cloudinary avatar/post image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional — enables Sentry error monitoring
SENTRY_DSN=your_sentry_dsn
```

Notes:

- `CLIENT_URL` accepts a comma-separated list of allowed origins (for example `http://localhost:5173,http://localhost:5174`) for development with multiple frontends.
- If Cloudinary keys are not set, uploaded images fall back to the local `backend/uploads/` directory, which is served at `/uploads`.
- If `REDIS_URL` is not set, rate-limit counters are stored in memory (per-process).

---

## Development

Run the backend and frontend in two terminals.

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`. The backend auto-restarts on file changes (`node --watch`).

---

## Deployment

**Frontend -> Vercel:**

- Root Directory: `frontend`
- Framework Preset: Vite (auto-detected)
- Environment variable: `VITE_API_URL=https://veganlife.onrender.com/api`

**Backend -> Render:**

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node src/index.js`
- Add all environment variables listed in `backend/.env`

---

## UX Features

| Feature            | Description                                                    |
|--------------------|----------------------------------------------------------------|
| Splash Screen      | Animated leaf and progress bar on first load                   |
| Page Transitions   | Fade and slide between routes (Framer Motion)                  |
| Error Boundary     | Graceful crash recovery with a refresh button                  |
| 404 Page           | Illustrated not-found page with floating leaves                |
| Toast System       | Contextual success / error / warning / info notifications      |
| Back Button        | Auto-hides on scroll, reappears at the top                     |
| Skeleton Loading   | Placeholder states while content loads                         |
| Search             | Real-time post and user filtering                              |
| Password Strength  | Live meter while typing a new password                         |
| Field Validation   | Inline per-field errors with accessible labels and `aria` attrs|

---

## Performance

- Code-split vendor chunks (React, Framer Motion, Recharts, Swiper)
- CSS Modules for zero-conflict styles
- Lazy-loaded images (`loading="lazy"`)
- Framer Motion `viewport={{ once: true }}`
- Throttled cursor trail
- GPU-accelerated animations (`will-change: transform`)
- MongoDB compound indexes on hot queries
- Paginated API responses with lean queries
- PWA service worker caches assets and images

---

## Design Philosophy

Earthy organic palette — warm clays, sage greens, muted purples, and cream tones. Playfair Display headings paired with Roboto Condensed body text. Glassmorphism cards with backdrop blur. Ambient nature animations inspired by Studio Ghibli and premium eco-brands, plus a subtle film-grain noise overlay for tactile texture. Interactive surfaces use micro-interactions (hover shine sweeps, magnetic buttons, spring entrance animations) that reinforce the calm, organic brand.

---

## Future Scope

- AI nutrition assistant (OpenAI / Claude)
- Email verification and notification emails
- Notification bell for mentions, replies, and follows
- Recipe detail pages
- PDF certificate generation for challenge completion
- Dark mode
- Internationalization (i18n)

---

## License

MIT
