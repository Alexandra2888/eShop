# RFC-001: eShop System Design

| Field      | Value                        |
| ---------- | ---------------------------- |
| RFC Number | 001                          |
| Title      | eShop Platform System Design |
| Status     | Accepted                     |
| Authors    | Alexandra2888                |
| Created    | 2026-03-25                   |
| Updated    | 2026-03-25                   |

---

## Table of Contents

1. [Summary](#1-summary)
2. [Motivation](#2-motivation)
3. [Goals & Non-Goals](#3-goals--non-goals)
4. [Architecture Overview](#4-architecture-overview)
5. [Component Design](#5-component-design)
   - 5.1 [Frontend](#51-frontend)
   - 5.2 [Backend API](#52-backend-api)
   - 5.3 [Database Layer](#53-database-layer)
   - 5.4 [Authentication & Authorization](#54-authentication--authorization)
   - 5.5 [File Storage](#55-file-storage)
   - 5.6 [Payment Integration](#56-payment-integration)
6. [Data Models](#6-data-models)
7. [API Design](#7-api-design)
8. [State Management](#8-state-management)
9. [Security Considerations](#9-security-considerations)
10. [Observability](#10-observability)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Scalability & Future Work](#12-scalability--future-work)
13. [Alternatives Considered](#13-alternatives-considered)
14. [Open Questions](#14-open-questions)

---

## 1. Summary

eShop is a full-stack e-commerce platform built on the **MERN** stack (MongoDB, Express.js, React, Node.js) with TypeScript across both client and server. This document describes the architectural decisions, component boundaries, data flows, and trade-offs that shape the system as it stands and guides future evolution.

---

## 2. Motivation

The platform needs to support:

- Anonymous and authenticated product browsing with search and category filtering.
- Cart management with persistent state across sessions.
- Secure checkout and PayPal payment processing.
- Admin capabilities for product, category, and order management.
- Multilingual UI (EN, DE, RO) without backend changes.
- Reliable deployment on commodity PaaS (Render) and containerised environments (Docker).

---

## 3. Goals & Non-Goals

### Goals

- **Correctness** – every order and payment must be auditable and consistent.
- **Developer experience** – TypeScript end-to-end, clear module boundaries, fast local iteration.
- **Security** – authentication via short-lived JWTs stored in httpOnly cookies; no tokens in localStorage.
- **Portability** – runnable locally, in Docker Compose, or on Render with minimal configuration.
- **Testability** – controllers and utilities are pure enough to unit-test with Vitest/Supertest.

### Non-Goals

- Real-time inventory sync across distributed nodes (single-node write path for now).
- Native mobile apps.
- Multi-tenant / white-label support.
- Microservices decomposition in v1.

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│  React 18 + Vite  ·  Redux Toolkit  ·  TailwindCSS     │
│  React Router  ·  i18next  ·  RTK Query                 │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTPS / REST JSON
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Express API (Node.js)                 │
│  Helmet  ·  CORS  ·  Morgan  ·  Cookie-Parser          │
│  Routes → Controllers → Services                        │
│  JWT Auth middleware  ·  Admin guard middleware         │
└──────────────┬────────────────────────┬─────────────────┘
               │ Mongoose ODM           │ Multer
               ▼                        ▼
┌──────────────────────┐    ┌──────────────────────────┐
│   MongoDB Atlas /    │    │   Local filesystem /     │
│   Docker mongo:6     │    │   /uploads volume        │
└──────────────────────┘    └──────────────────────────┘

                  External Services
         ┌────────────────────────────────┐
         │  PayPal REST API (payments)    │
         └────────────────────────────────┘
```

### Request lifecycle

1. Browser sends a cookie-based authenticated request over HTTPS.
2. Express strips the JWT from the `Authorization` cookie and validates it.
3. The matching route delegates to a controller wrapped in `asyncHandler`.
4. The controller calls Mongoose model methods directly (no separate service layer in v1).
5. The response is serialised to JSON and returned; errors bubble to the global error handler.

---

## 5. Component Design

### 5.1 Frontend

```
src/
├── components/        # Shared, stateless UI atoms & molecules
├── pages/             # Route-level smart containers
│   ├── Admin/         # Dashboard, product & order management
│   ├── Auth/          # Login, Register
│   ├── Orders/        # Order detail, history
│   ├── Products/      # Product detail, review
│   └── User/          # Profile, settings
├── redux/
│   ├── api/           # RTK Query service definitions (base URL + endpoints)
│   ├── features/      # Slices: auth, cart, favourites, shop
│   ├── store.ts       # Store composition
│   └── hooks.ts       # Typed useAppDispatch / useAppSelector
├── context/           # React contexts (e.g. modal state)
├── utils/             # Pure helpers (formatters, validators)
└── types/             # Shared TypeScript interfaces
```

**Key design decisions:**

- RTK Query handles all server state (caching, loading, error states) to avoid redundant `useEffect` fetching patterns.
- Redux slices own **client-only** state: cart contents, UI flags, i18n locale.
- Pages are lazy-loaded via `React.lazy` + `Suspense` to keep the initial bundle small.
- `error-boundary.tsx` provides a top-level React Error Boundary for graceful degradation.

### 5.2 Backend API

```
backend/
├── app.ts             # Express app factory (no side effects at import)
├── index.ts           # Entry point: DB connect → server listen
├── config/            # DB connection (Mongoose)
├── controllers/       # Request/response handling
├── routes/            # Route definitions + middleware composition
├── middlewares/
│   ├── authMiddleware.ts   # JWT verification + user hydration
│   ├── asyncHandler.ts     # Promise rejection → next(err)
│   └── checkId.ts          # MongoDB ObjectId validation
├── models/            # Mongoose schemas & models
├── utils/             # createToken, pagination helpers
├── types/             # Express Request augmentations
└── scripts/           # Seeder, migration utilities
```

**Key design decisions:**

- `app.ts` exports a pure Express application; `index.ts` wires infrastructure (DB, port). This separation makes the app straightforward to test with Supertest without binding a real port.
- All async route handlers are wrapped with `asyncHandler` to eliminate try/catch boilerplate and centralise error handling.
- A single global error handler at the bottom of `app.ts` converts uncaught errors to JSON responses, preventing stack-trace leakage in production.

### 5.3 Database Layer

MongoDB is used as a document store via Mongoose. Collections:

| Collection   | Description                                    |
| ------------ | ---------------------------------------------- |
| `users`      | Authentication credentials + profile + isAdmin |
| `products`   | Catalogue items with embedded review documents |
| `categories` | Product taxonomy (flat list, referenced by ID) |
| `orders`     | Order snapshot with embedded items + payment   |

**Design decisions:**

- Product reviews are **embedded** in the `products` document. This is a conscious denormalisation trade-off: reviews are always read together with the product, and the expected number of reviews per product is bounded.
- Orders capture a **snapshot** of item price and name at creation time. This ensures order history is immutable even if product data changes later.
- Mongoose schemas enforce types, required fields, and default values at the ODM level, supplementing MongoDB's schemaless nature.

### 5.4 Authentication & Authorization

```
POST /api/users/login
  → verify credentials → sign JWT (1d TTL)
  → Set-Cookie: jwt=<token>; HttpOnly; Secure; SameSite=Strict

Subsequent requests
  → authMiddleware reads cookie
  → verifies JWT with JWT_SECRET
  → attaches req.user = { _id, email, isAdmin }

Admin routes additionally guarded by
  → if (!req.user.isAdmin) throw 403
```

- JWT TTL is 1 day. No refresh token mechanism in v1 (stateless simplicity vs. session invalidation trade-off).
- Passwords are hashed with **bcryptjs** (salt rounds: 10) before persistence.
- `isAdmin` boolean on the user document is the role model. A full RBAC system is deferred to future work.

### 5.5 File Storage

- Product images are uploaded via `multipart/form-data` to `POST /api/upload`.
- **Multer** validates MIME type (jpeg, jpg, png, webp) and saves files to `backend/uploads/`.
- The `uploads/` directory is served as static files by Express and mounted as a Docker volume to persist across container restarts.
- **Limitation:** this is a single-node local disk strategy. Moving to object storage (S3 / R2) is the recommended upgrade path for multi-instance deployments (see §12).

### 5.6 Payment Integration

- The frontend requests a PayPal client ID from `GET /api/config/paypal` at runtime (avoids embedding keys in the JS bundle).
- PayPal's JS SDK renders the payment buttons client-side.
- On payment approval, the client sends the PayPal `paymentResult` payload to `PUT /api/orders/:id/pay`.
- The backend marks `order.isPaid = true` and stamps `order.paidAt`. No server-side PayPal webhook is implemented in v1.

---

## 6. Data Models

### User

```typescript
{
  _id: ObjectId,
  username: string,           // unique
  email: string,              // unique, indexed
  password: string,           // bcrypt hash
  isAdmin: boolean,           // default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```typescript
{
  _id: ObjectId,
  name: string,
  image: string,              // relative path under /uploads
  brand: string,
  quantity: number,
  category: ObjectId,         // ref: Category
  description: string,
  price: number,
  countInStock: number,
  rating: number,             // computed average
  numReviews: number,
  reviews: [{
    name: string,
    rating: number,           // 1–5
    comment: string,
    user: ObjectId,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order

```typescript
{
  _id: ObjectId,
  user: ObjectId,             // ref: User
  orderItems: [{
    name: string,             // snapshot
    qty: number,
    image: string,            // snapshot
    price: number,            // snapshot
    product: ObjectId
  }],
  shippingAddress: {
    address: string,
    city: string,
    postalCode: string,
    country: string
  },
  paymentMethod: string,
  paymentResult: {
    id: string,
    status: string,
    update_time: string,
    email_address: string
  },
  itemsPrice: number,
  taxPrice: number,
  shippingPrice: number,
  totalPrice: number,
  isPaid: boolean,
  paidAt: Date,
  isDelivered: boolean,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Category

```typescript
{
  _id: ObjectId,
  name: string                // unique
}
```

---

## 7. API Design

All endpoints are prefixed with `/api`. Requests and responses use `application/json`. Authentication is cookie-based (see §5.4).

### Users `/api/users`

| Method | Path       | Auth   | Description            |
| ------ | ---------- | ------ | ---------------------- |
| POST   | `/`        | Public | Register user          |
| POST   | `/auth`    | Public | Login (sets cookie)    |
| POST   | `/logout`  | Public | Logout (clears cookie) |
| GET    | `/profile` | User   | Get own profile        |
| PUT    | `/profile` | User   | Update own profile     |
| GET    | `/`        | Admin  | List all users         |
| DELETE | `/:id`     | Admin  | Delete user            |
| GET    | `/:id`     | Admin  | Get user by ID         |
| PUT    | `/:id`     | Admin  | Update user (admin)    |

### Products `/api/products`

| Method | Path           | Auth   | Description               |
| ------ | -------------- | ------ | ------------------------- |
| GET    | `/`            | Public | List products (paginated) |
| POST   | `/`            | Admin  | Create product            |
| GET    | `/allproducts` | Public | List all (no pagination)  |
| GET    | `/top`         | Public | Top-rated products        |
| GET    | `/new`         | Public | Newest products           |
| GET    | `/:id`         | Public | Get product by ID         |
| PUT    | `/:id`         | Admin  | Update product            |
| DELETE | `/:id`         | Admin  | Delete product            |
| POST   | `/:id/reviews` | User   | Add review                |
| PUT    | `/:id/reviews` | Admin  | Update review             |

### Orders `/api/orders`

| Method | Path                   | Auth  | Description             |
| ------ | ---------------------- | ----- | ----------------------- |
| POST   | `/`                    | User  | Create order            |
| GET    | `/`                    | Admin | List all orders         |
| GET    | `/mine`                | User  | List own orders         |
| GET    | `/total-orders`        | Admin | Aggregate order count   |
| GET    | `/total-sales`         | Admin | Aggregate sales total   |
| GET    | `/total-sales-by-date` | Admin | Sales grouped by date   |
| GET    | `/:id`                 | User  | Get order by ID         |
| PUT    | `/:id/pay`             | User  | Mark order as paid      |
| PUT    | `/:id/deliver`         | Admin | Mark order as delivered |

### Categories `/api/category`

| Method | Path           | Auth   | Description         |
| ------ | -------------- | ------ | ------------------- |
| POST   | `/`            | Admin  | Create category     |
| PUT    | `/:categoryId` | Admin  | Update category     |
| DELETE | `/:categoryId` | Admin  | Delete category     |
| GET    | `/categories`  | Public | List all categories |
| GET    | `/:id`         | Public | Get category by ID  |

### Upload `/api/upload`

| Method | Path | Auth  | Description          |
| ------ | ---- | ----- | -------------------- |
| POST   | `/`  | Admin | Upload product image |

### Chat `/api/chat`

| Method | Path | Auth | Description       |
| ------ | ---- | ---- | ----------------- |
| POST   | `/`  | User | Send chat message |

### Config & Health

| Method | Path                 | Auth   | Description          |
| ------ | -------------------- | ------ | -------------------- |
| GET    | `/api/config/paypal` | Public | Get PayPal client ID |
| GET    | `/api/health`        | Public | Service health check |

---

## 8. State Management

Client state is split into two categories:

### Server state — RTK Query

RTK Query service endpoints are defined in `redux/api/`. Each resource (products, orders, users, etc.) has its own API slice. Benefits:

- Automatic caching with tag-based invalidation.
- Loading / error states without boilerplate.
- Optimistic updates where appropriate.

### Client state — Redux slices

| Slice        | Responsibility                                      |
| ------------ | --------------------------------------------------- |
| `authSlice`  | Current user info, login/logout state               |
| `cartSlice`  | Cart items, quantities, price totals (localStorage) |
| `favourites` | Wishlisted product IDs (localStorage)               |
| `shopSlice`  | Active category filter, search keyword              |

Cart and favourites are persisted to `localStorage` via a custom `cartUtils` helper so they survive page refreshes without a backend session.

---

## 9. Security Considerations

| Threat                     | Mitigation                                                |
| -------------------------- | --------------------------------------------------------- |
| XSS token theft            | JWT in `HttpOnly` cookie — inaccessible to JS             |
| CSRF                       | `SameSite=Strict` cookie attribute + CORS whitelist       |
| Clickjacking               | `X-Frame-Options` via Helmet                              |
| Brute-force login          | No rate limiting in v1 — **open issue**                   |
| Insecure direct object ref | `checkId` middleware validates MongoDB ObjectId format    |
| Mass assignment            | Mongoose schema + explicit field selection in controllers |
| Sensitive data exposure    | Error messages stripped in production                     |
| Dependency vulnerabilities | `npm audit` in CI — **recommended addition**              |

---

## 10. Observability

- **HTTP logging**: Morgan in `dev` format in development, silenced in test mode.
- **Health endpoint**: `GET /api/health` returns status, timestamp, and environment. Suitable for Render/Docker health checks.
- **Error logging**: `console.error(err.stack)` in the global error handler. Production systems should route this to a structured log aggregator (e.g. Datadog, Logtail).
- **Metrics**: No application metrics (Prometheus/StatsD) in v1.

---

## 11. Deployment Architecture

### Single-container (Render / Fly.io)

```
[Render Web Service]
  └── Node.js process (Express serves API + static frontend build)
      └── MongoDB Atlas (managed, external)
```

The `Dockerfile` uses a **multi-stage build**:

1. `node:18-alpine` — install deps + build React app (`vite build`).
2. Final stage — copy compiled frontend into Express's static directory, run `node dist/index.js`.

### Docker Compose (local / self-hosted)

```
docker-compose.yml
  ├── backend     → Express on :10000
  ├── mongo       → MongoDB 6 on :27017  (volume: mongo_data)
  └── mongo-express → Admin UI on :8081
```

### Environment configuration

| Variable               | Required  | Description                           |
| ---------------------- | --------- | ------------------------------------- |
| `MONGO_URL`            | Yes       | MongoDB connection string             |
| `JWT_SECRET`           | Yes       | HMAC secret for JWT signing           |
| `PORT`                 | No        | Server port (default: 5001)           |
| `NODE_ENV`             | No        | `development` / `production` / `test` |
| `PAYPAL_CLIENT_ID`     | Yes (pay) | PayPal REST app client ID             |
| `PAYPAL_CLIENT_SECRET` | Yes (pay) | PayPal REST app secret                |
| `FRONTEND_URL`         | Prod      | CORS whitelist origin                 |

---

## 12. Scalability & Future Work

| Area                 | Current State                | Recommended Next Step                                           |
| -------------------- | ---------------------------- | --------------------------------------------------------------- |
| Image storage        | Local disk (`/uploads`)      | Migrate to S3-compatible object storage (AWS S3, Cloudflare R2) |
| Session invalidation | Stateless JWT (no blacklist) | Redis-backed token blocklist or refresh-token rotation          |
| Rate limiting        | None                         | `express-rate-limit` on auth and payment routes                 |
| Search               | MongoDB regex queries        | MongoDB Atlas Search or Elasticsearch                           |
| Caching              | None                         | Redis for product catalogue responses                           |
| Background jobs      | None                         | Order confirmation emails via a job queue (BullMQ)              |
| Analytics            | Aggregation endpoints only   | Time-series DB or dedicated analytics pipeline                  |
| Role management      | `isAdmin` boolean            | Structured RBAC (roles array on User document)                  |
| API versioning       | Implicit v1 (`/api/...`)     | Explicit `/api/v1/...` prefix                                   |
| Testing coverage     | Unit + integration (Vitest)  | Add E2E coverage with Playwright across all critical flows      |

---

## 13. Alternatives Considered

### REST vs. GraphQL

REST was chosen for its simplicity, wide ecosystem support, and low overhead for a project of this scope. GraphQL would reduce over-fetching for the product listing page but adds schema management and resolver complexity that isn't justified for a single-consumer API.

### JWT in cookie vs. localStorage

Storing JWTs in `localStorage` is a common pattern but exposes the token to any script running on the page (XSS). `HttpOnly` cookies are not accessible via JavaScript, significantly reducing the XSS attack surface. The trade-off is CSRF exposure, which is mitigated via `SameSite=Strict` and the CORS policy.

### MongoDB vs. PostgreSQL

MongoDB fits naturally for a product catalogue with varying attribute sets and embedded subdocuments (reviews). A relational schema would require join tables for reviews and category associations. For the order financial ledger, a relational DB would be more appropriate — this is noted as a future migration candidate if strict ACID guarantees become a requirement.

### Redux Toolkit vs. Zustand / Jotai

Redux Toolkit was chosen for its DevTools integration, mature ecosystem, and the built-in RTK Query data-fetching layer. Lighter-weight alternatives like Zustand are viable for smaller apps but RTK Query's tag-based cache invalidation provides meaningful value in an e-commerce context with many inter-related resources.

---
