# Aurora — Production-Grade MERN E-Commerce Platform

A commercially-styled, full-stack e-commerce platform built on the MERN stack
(MongoDB, Express, React, Node.js) with JWT auth + refresh-token rotation,
Cloudinary media, a premium Tailwind design system with full dark mode, and a
role-gated admin dashboard.

> **Build status:** This repository is being assembled in stages. The current
> milestone delivers a **runnable backend foundation** (config, all Mongoose
> models, security middleware, auth with refresh-token rotation, the products
> API, and a 30-product seed script) and a **runnable frontend foundation**
> (Vite + React + Tailwind, theme/dark-mode system, the shared component
> library, app layout, and the homepage). Remaining feature surfaces are filled
> in subsequent milestones — see the Roadmap section.

---

## Monorepo Layout

```
ecommerce/
├── server/          # Express API (ESM)
│   ├── config/      # env validation, DB, Cloudinary
│   ├── controllers/ # one file per resource
│   ├── middleware/  # auth, admin, error, validate, rateLimit, security
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routers
│   ├── services/    # business logic
│   ├── utils/       # ApiResponse, catchAsync, tokens, email
│   ├── validators/  # Zod request schemas
│   ├── scripts/     # seed.js
│   └── server.js    # bootstrap
└── client/          # React + Vite app
    └── src/
        ├── api/        # axios instance + per-resource requests
        ├── components/ # common / layout / ui
        ├── context/    # Auth, Cart, Theme
        ├── features/   # feature-scoped modules
        ├── hooks/      # useAuth, useCart, useDebounce, ...
        ├── pages/      # route-level pages
        ├── routes/     # route table, PrivateRoute, AdminRoute
        ├── store/      # TanStack Query client + query keys
        └── utils/      # formatCurrency, cn, ...
```

## Prerequisites

| Tool     | Version |
| -------- | ------- |
| Node.js  | ≥ 20.x  |
| npm      | ≥ 10.x  |
| MongoDB  | ≥ 6.x (local or Atlas) |
| Cloudinary account | optional for uploads |

## Local Setup

### 1. Backend

```bash
cd server
cp .env.example .env        # then edit values
npm install
npm run seed                # loads 30 products, categories, admin user
npm run dev                 # starts API on http://localhost:5000
```

#### No local MongoDB? (zero-config dev)

If you don't have MongoDB installed, run the bundled in-memory launcher. It
spins up an ephemeral MongoDB on port 27017, seeds it, and starts the API in
one command (data resets when you stop it):

```bash
cd server
npm install
npm run dev:memory
```

### 2. Frontend

```bash
cd client
cp .env.example .env        # set VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev                 # starts Vite on http://localhost:5173
```

## Environment Variables

See [`server/.env.example`](server/.env.example) and
[`client/.env.example`](client/.env.example). Required server variables are
validated at startup by `config/env.js` — the process exits immediately if any
are missing, so misconfiguration fails fast.

## Seed Data

`npm run seed` (in `server/`) wipes and repopulates the catalog with:

- 4 categories (Musical Instruments, Premium Footwear, Carry & Bags, Space Collection)
- 30 fully-specified products (Unsplash imagery)
- 1 admin account: `admin@aurora.shop` / `Admin@12345` (override via env)
- 1 demo customer: `demo@aurora.shop` / `Demo@12345`

## Cloudinary Setup

1. Create a free account at https://cloudinary.com.
2. From the dashboard copy **Cloud name**, **API Key**, **API Secret**.
3. Put them in `server/.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`.
4. Uploads (avatars, product images) flow through `config/cloudinary.js`. If
   credentials are absent the app still runs; upload endpoints return a clear
   503 instead of crashing.

## Security Controls (active)

- Helmet with a strict CSP
- `express-rate-limit`: 100/15min global, 5/15min on auth routes
- Zod validation middleware on all mutating routes (400 + field errors)
- JWT access (15m) + refresh (7d, httpOnly, SameSite=Strict) with rotation
- bcrypt cost factor 12
- `xss-clean` and `express-mongo-sanitize`
- Strict CORS allowlist
- Central error handler — no stack traces in production

## Deployment

- **Backend** → Railway / Render (Node service, set env vars, `npm start`)
- **Frontend** → Vercel (Vite preset, set `VITE_API_URL` to deployed API)

A full deployment checklist lives in [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Roadmap (remaining milestones)

- [ ] Cart, Wishlist, Orders, Reviews, Users controllers + routes
- [ ] Shop listing, product detail, cart drawer, checkout flow (client)
- [ ] Account dashboard + Admin dashboard surfaces
- [ ] Postman collection + JSDoc API docs

## License

MIT
