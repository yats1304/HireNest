# 🏢 HireNest

**HireNest** is a full-stack job portal platform built on a microservices architecture. Job seekers can browse and apply for jobs, manage their profiles, and leverage AI-powered tools for career guidance and resume analysis. Recruiters can create companies, post job listings, and manage applicant statuses — all backed by independent, scalable services communicating via Kafka.

> 🌐 **Live Demo**: [https://hire-nest-xi.vercel.app](https://hire-nest-xi.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Postman Collection](#postman-collection)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Service Setup](#service-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Assumptions](#assumptions)

---

## Overview

HireNest is built around a **dual-role model**:

- **Job Seekers** — Register with a resume, build a skill profile, browse and filter job listings, apply with one click, and track application statuses. AI tools on the home page offer career guidance and resume ATS scoring.
- **Recruiters** — Register as a recruiter, create a company with a logo, post jobs with detailed requirements, view all applicants per listing, and update each applicant's status (`Submitted → Hired / Rejected`).

A **subscription model** (powered by Razorpay) unlocks premium features for job seekers.

---

## Features

| Feature                  | Details                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **Auth**                 | Register (with role), Login, Forgot Password, Reset Password — JWT via cookies             |
| **Role-Based Access**    | `jobseeker` and `recruiter` roles with distinct capabilities and UI flows                  |
| **Job Listings**         | Browse, search by title and location, view full job details with company info              |
| **Companies**            | Recruiters create companies (with logo upload); public company profile pages               |
| **Applications**         | Job seekers apply for jobs; recruiters view all applicants and update statuses             |
| **Profile Management**   | Update name, bio, phone; upload/replace profile picture and resume (Cloudinary)            |
| **Skills**               | Job seekers add and remove skills from their profile                                       |
| **AI Career Guide**      | AI-powered career path recommendations based on skills and interests                       |
| **AI Resume Analyzer**   | ATS score, score breakdown (formatting, keywords, structure, readability), and suggestions |
| **Subscription**         | Razorpay-integrated 30-day premium subscription at ₹119                                   |
| **Kafka Events**         | Auth and job services publish events (e.g. email triggers) via Kafka topics                |
| **Password Reset**       | Forgot password flow via tokenized email link                                              |
| **Dark Mode**            | System-aware theme toggle (light/dark) via `next-themes`                                   |
| **Redis Caching**        | Redis used in the auth service for session/token management                                |

---

## Tech Stack

### Services (Backend)

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Runtime          | Node.js 20                                        |
| Framework        | Express 5                                         |
| Language         | TypeScript (ESM modules)                          |
| Database         | PostgreSQL via Neon (serverless) + raw SQL        |
| Auth             | JWT (jsonwebtoken) + cookie-based token storage   |
| Password Hashing | bcrypt (10 rounds)                                |
| File Uploads     | Multer + Cloudinary (via DataURI buffer)          |
| Caching          | Redis (`redis` client) — auth service             |
| Messaging        | Apache Kafka via `kafkajs`                        |
| Payments         | Razorpay                                          |
| Dev Server       | `nodemon` + `tsc -w` (via `concurrently`)         |

### Frontend

| Layer             | Technology                                  |
| ----------------- | ------------------------------------------- |
| Framework         | Next.js 16 (App Router)                     |
| Language          | TypeScript                                  |
| Styling           | Tailwind CSS v4                             |
| Component Library | Shadcn/UI + Radix UI                        |
| State Management  | React Context API (`AppContext`)            |
| HTTP Client       | Axios                                       |
| Auth Tokens       | `js-cookie` (JWT stored in browser cookies) |
| Icons             | Lucide React                                |
| Notifications     | react-hot-toast                             |
| Theme             | next-themes (system/light/dark)             |

---

## Project Structure

```
HireNest/
├── services/
│   ├── auth/                        # Auth microservice (register, login, password reset)
│   │   └── src/
│   │       ├── index.ts             # Entry point — DB init, listen
│   │       ├── app.ts               # Express setup (routes, CORS, Redis, Kafka)
│   │       ├── routes/
│   │       │   └── auth.route.ts    # POST /register, /login, /forgot, /reset/:token
│   │       ├── controller/
│   │       │   └── auth.controller.ts
│   │       ├── db/
│   │       │   └── init.ts          # Creates `user`, `skills`, `user_skills` tables
│   │       ├── middleware/
│   │       │   └── multer.middleware.ts
│   │       ├── producer.ts          # Kafka producer (topic: "send-mail")
│   │       ├── template.ts          # Email HTML templates
│   │       └── utils/               # db, buffer, errorHandler, tryCatch
│   │
│   ├── job/                         # Job microservice (companies, jobs, applications)
│   │   └── src/
│   │       ├── index.ts
│   │       ├── app.ts               # Express setup (routes, CORS, Kafka)
│   │       ├── routes/
│   │       │   └── job.route.ts     # Company CRUD, job CRUD, application management
│   │       ├── controllers/
│   │       │   └── job.controller.ts
│   │       ├── db/
│   │       │   └── init.ts          # Creates `companies`, `jobs`, `applications` tables
│   │       ├── middleware/
│   │       │   ├── auth.middleware.ts   # JWT verification
│   │       │   └── multer.middleware.ts
│   │       ├── producer.ts          # Kafka producer (application status updates)
│   │       └── utils/
│   │
│   ├── user/                        # User microservice (profile, skills, applications)
│   │   └── src/
│   │       ├── index.ts
│   │       ├── routes/
│   │       │   └── user.route.ts    # Profile, resume, skills, job applications
│   │       ├── controller/
│   │       │   └── user.controller.ts
│   │       └── middleware/
│   │           └── auth.middleware.ts
│   │
│   └── payment/                     # Payment microservice (Razorpay subscriptions)
│       └── src/
│           ├── index.ts
│           ├── routes/
│           │   └── payment.route.ts # POST /checkout, /verify
│           ├── controllers/
│           │   └── payment.controller.ts
│           └── middleware/
│               └── auth.middleware.ts
│
├── frontend/                        # Next.js 16 App Router
│   └── src/
│       ├── app/
│       │   ├── layout.tsx           # Root layout (AppProvider, ThemeProvider, Navbar)
│       │   ├── page.tsx             # Home page (Hero, CareerGuide, ResumeAnalyzer)
│       │   ├── jobs/
│       │   │   └── page.tsx         # Job listings with title/location filters
│       │   ├── jobs/[id]/           # Job detail page
│       │   ├── company/[id]/        # Company profile page
│       │   ├── account/
│       │   │   └── page.tsx         # My profile (Info, Skills, Applied Jobs / Company)
│       │   └── about/page.tsx       # About page
│       ├── components/
│       │   ├── layout/
│       │   │   └── navbar.tsx       # Sticky navbar with auth state, theme toggle
│       │   ├── pages/
│       │   │   ├── hero.tsx         # Landing hero section
│       │   │   ├── career-guide.tsx # AI career guidance tool
│       │   │   └── resume-analyzer.tsx  # AI resume ATS analyzer
│       │   ├── job-card.tsx
│       │   ├── loading.tsx
│       │   └── ui/                  # Shadcn/UI primitives
│       ├── context/
│       │   └── AppContext.tsx       # Global state (user, auth, actions)
│       ├── config/
│       │   └── services.ts          # Service base URL constants from env
│       └── types/
│           └── types.ts             # TypeScript interfaces (User, Job, Company, etc.)
│
└── postman collection/              # Postman collection for all APIs
```

---

## Architecture & Design Decisions

### 1. Microservices Architecture

HireNest is split into four independent backend services, each responsible for a single domain:

| Service     | Responsibility                                           | Port (default) |
| ----------- | -------------------------------------------------------- | -------------- |
| `auth`      | Registration, login, password reset, JWT issuance        | 5001           |
| `user`      | Profile management, resume, skills, job applications     | 5002           |
| `job`       | Companies, job listings, applicant management            | 5003           |
| `payment`   | Razorpay checkout and subscription verification          | 5004           |

Each service has its own PostgreSQL database (Neon serverless) and runs `initDB()` on startup to create its tables if they don't already exist. Services are entirely decoupled — they communicate with each other only via JWT verification (each service runs its own `isAuth` middleware decoding the same JWT secret) or Kafka events.

### 2. PostgreSQL with Raw SQL (Neon Serverless)

Rather than an ORM, all services use the `@neondatabase/serverless` driver with tagged template literals (`sql\`...\``). This keeps queries explicit and avoids ORM overhead, while Neon's serverless driver allows the service to work efficiently in edge or low-concurrency environments.

### 3. Kafka for Async Event Publishing

The `auth` and `job` services connect to a Kafka broker on startup as producers. Transactional events (user registration, application status changes) are published to Kafka topics (e.g., `send-mail`), allowing a downstream consumer to handle email notifications without blocking the API response.

```typescript
// auth service — publishes on registration
await publishToTopic("send-mail", { to: email, subject: "...", html: template });
```

### 4. Redis in the Auth Service

Redis is used in the auth service (connected via `createClient`) for fast-access token or session storage during the password reset flow and session caching.

### 5. JWT-Based Inter-Service Auth

When the frontend calls the `user` or `job` service, it passes the JWT in the `Authorization: Bearer <token>` header. Each service independently verifies the token against `JWT_SECRET` via its own `isAuth` middleware, decoding the user's `user_id` and `role` without needing to call the auth service.

### 6. Role-Based Business Logic

The `user_role` enum in the database has two values: `jobseeker` and `recruiter`. Role enforcement is explicit in controllers:

```typescript
if (user.role !== "recruiter") {
  throw new ErrorHandler(403, "Forbidden: Only recruiter can create a company");
}
```

Job seekers who view their account see their applied jobs and skills. Recruiters see their company and posted listings. The frontend conditionally renders components based on `user.role`.

### 7. Cloudinary File Uploads via Upload Service

File uploads (profile pictures, resumes, company logos) are processed with Multer, converted to a DataURI buffer, and sent to a separate upload utility endpoint. The resulting Cloudinary URL and public ID are stored in the database for future deletion or replacement.

### 8. Razorpay Subscription Flow

1. The frontend calls `POST /api/payment/checkout` → the payment service creates a Razorpay order for ₹119 and returns it.
2. The Razorpay checkout modal is rendered on the frontend.
3. On successful payment, the frontend calls `POST /api/payment/verify` with the Razorpay signature.
4. The service verifies the HMAC-SHA256 signature and, if authentic, sets `subscription = NOW() + 30 days` on the user record.

### 9. AI Features (Career Guide & Resume Analyzer)

Two AI-powered tools are embedded on the home page:

- **Career Guide**: Takes user inputs (skills, interests) and generates structured career path recommendations with job options, skills to learn, and a learning approach.
- **Resume Analyzer**: Accepts a resume file and returns an ATS score (0–100), a breakdown across formatting, keywords, structure, and readability, along with prioritized suggestions and strengths.

### 10. Frontend State via React Context

Global auth state (`user`, `isAuth`, `loading`) and all user actions (profile updates, skill management, job applications) are managed in a single `AppContext`. On mount, the context fetches `/api/user/me` using the cookie-stored JWT to hydrate the session without `localStorage`.

---

## Database Schema

### Auth Service — `user` table

| Field                  | Type        | Notes                                     |
| ---------------------- | ----------- | ----------------------------------------- |
| `user_id`              | SERIAL PK   |                                           |
| `name`                 | VARCHAR(255)| Required                                  |
| `email`                | VARCHAR(255)| Required, unique                          |
| `password`             | VARCHAR(255)| bcrypt hashed                             |
| `phone_number`         | VARCHAR(255)| Required                                  |
| `role`                 | user_role   | ENUM: `jobseeker` \| `recruiter`          |
| `bio`                  | TEXT        | Nullable                                  |
| `resume`               | VARCHAR(255)| Cloudinary URL; required for jobseekers   |
| `resume_public_id`     | VARCHAR(255)|                                           |
| `profile_pic`          | VARCHAR(255)| Nullable                                  |
| `profile_pic_public_id`| VARCHAR(255)| Nullable                                  |
| `subscription`         | TIMESTAMPTZ | Premium expiry timestamp; null if none    |
| `created_at`           | TIMESTAMPTZ | Default: `CURRENT_TIMESTAMP`              |

### Auth Service — `skills` and `user_skills` tables

| Table         | Key Fields                                           |
| ------------- | ---------------------------------------------------- |
| `skills`      | `skill_id` (PK), `name` (unique)                     |
| `user_skills` | `(user_id, skill_id)` composite PK with FK cascades |

### Job Service — `companies` table

| Field           | Type        | Notes                                |
| --------------- | ----------- | ------------------------------------ |
| `company_id`    | SERIAL PK   |                                      |
| `name`          | VARCHAR(255)| Unique                               |
| `description`   | TEXT        |                                      |
| `website`       | VARCHAR(255)|                                      |
| `logo`          | VARCHAR(255)| Cloudinary URL                       |
| `logo_public_id`| VARCHAR(255)|                                      |
| `recruiter_id`  | INTEGER     | FK to user (not enforced cross-DB)   |
| `created_at`    | TIMESTAMPTZ |                                      |

### Job Service — `jobs` table

| Field                   | Type         | Notes                                              |
| ----------------------- | ------------ | -------------------------------------------------- |
| `job_id`                | SERIAL PK    |                                                    |
| `title`                 | VARCHAR(255) |                                                    |
| `description`           | TEXT         |                                                    |
| `salary`                | NUMERIC(10,2)| Nullable                                           |
| `location`              | VARCHAR(255) | Nullable                                           |
| `job_type`              | job_type     | ENUM: `Full-time`, `Part-time`, `Contract`, `Internship` |
| `openings`              | NUMERIC(3,1) |                                                    |
| `role`                  | VARCHAR(255) |                                                    |
| `work_location`         | work_location| ENUM: `On-site`, `Remote`, `Hybrid`                |
| `company_id`            | INTEGER      | FK → companies (CASCADE)                           |
| `posted_by_recruiter_id`| INTEGER      |                                                    |
| `is_active`             | BOOLEAN      | Default: `true`                                    |
| `created_at`            | TIMESTAMPTZ  |                                                    |

### Job Service — `applications` table

| Field            | Type              | Notes                                            |
| ---------------- | ----------------- | ------------------------------------------------ |
| `application_id` | SERIAL PK         |                                                  |
| `job_id`         | INTEGER           | FK → jobs (CASCADE)                              |
| `applicant_id`   | INTEGER           | FK to user (cross-service, not enforced)         |
| `applicant_email`| VARCHAR(255)      |                                                  |
| `status`         | application_status| ENUM: `Submitted`, `Rejected`, `Hired`           |
| `resume`         | VARCHAR(255)      | Cloudinary URL of resume at time of application  |
| `applied_at`     | TIMESTAMPTZ       |                                                  |
| `subscribed`     | BOOLEAN           | Whether applicant had active subscription        |
| `(job_id, applicant_id)` | UNIQUE   | Prevents duplicate applications                  |

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint          | Auth | Body / Params                                     | Description                              |
| ------ | ----------------- | ---- | ------------------------------------------------- | ---------------------------------------- |
| POST   | `/register`       | ✗    | `{ name, email, password, phoneNumber, role, bio }` + optional `resume` file | Register new user (resume required for jobseekers) |
| POST   | `/login`          | ✗    | `{ email, password }`                             | Login, returns JWT                       |
| POST   | `/forgot`         | ✗    | `{ email }`                                       | Send password reset email via Kafka      |
| POST   | `/reset/:token`   | ✗    | `{ password }`                                    | Reset password with tokenized link       |

### User — `/api/user`

| Method | Endpoint               | Auth | Body / Params                          | Description                             |
| ------ | ---------------------- | ---- | -------------------------------------- | --------------------------------------- |
| GET    | `/me`                  | ✓    | —                                      | Get current user's full profile         |
| GET    | `/:userId`             | ✓    | —                                      | Get another user's public profile       |
| PUT    | `/update/profile`      | ✓    | `{ name, phoneNumber, bio }`           | Update profile details                  |
| PUT    | `/update/pic`          | ✓    | `profile_pic` file (multipart)         | Replace profile picture on Cloudinary   |
| PUT    | `/update/resume`       | ✓    | `resume` file (multipart)              | Replace resume on Cloudinary            |
| POST   | `/skill/add`           | ✓    | `{ skillName }`                        | Add a skill to user profile             |
| PUT    | `/skill/delete`        | ✓    | `{ skillName }`                        | Remove a skill from user profile        |
| POST   | `/apply/job`           | ✓    | `{ job_id }`                           | Apply to a job listing                  |
| GET    | `/applications/all`    | ✓    | —                                      | Get all applications made by the user   |

### Job — `/api/job`

| Method | Endpoint                        | Auth | Body / Params                                       | Description                                          |
| ------ | ------------------------------- | ---- | --------------------------------------------------- | ---------------------------------------------------- |
| GET    | `/all`                          | ✗    | `?title&location`                                   | List all active jobs (filterable)                    |
| GET    | `/:jobId`                       | ✗    | —                                                   | Get single job details                               |
| POST   | `/new`                          | ✓    | `{ title, description, salary, location, job_type, openings, role, work_location, company_id }` | Create a new job (recruiter only) |
| PUT    | `/:jobId`                       | ✓    | Partial job fields                                  | Update a job listing                                 |
| POST   | `/company/new`                  | ✓    | `{ name, description, website }` + `logo` file      | Create a company (recruiter only)                    |
| DELETE | `/company/:companyId`           | ✓    | —                                                   | Delete a company                                     |
| GET    | `/company/all`                  | ✓    | —                                                   | Get all companies created by the authenticated recruiter |
| GET    | `/company/:id`                  | ✗    | —                                                   | Get a company's public profile and job listings      |
| GET    | `/applications/:jobId`          | ✓    | —                                                   | Get all applicants for a job (recruiter only)        |
| PUT    | `/application/update/:id`       | ✓    | `{ status }`                                        | Update applicant status (`Hired` / `Rejected`)       |

### Payment — `/api/payment`

| Method | Endpoint    | Auth | Body                                                               | Description                                       |
| ------ | ----------- | ---- | ------------------------------------------------------------------ | ------------------------------------------------- |
| POST   | `/checkout` | ✓    | —                                                                  | Create Razorpay order for ₹119 subscription       |
| POST   | `/verify`   | ✓    | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`   | Verify payment, activate 30-day subscription      |

---

## Postman Collection

A ready-to-use Postman collection covering all API endpoints is included in the repository.

📁 **File**: [`postman collection/`](./postman%20collection/)

### Import into Postman

1. Open **Postman**
2. Click **Import** (top-left)
3. Select the JSON file from the `postman collection/` folder
4. The **HireNest** collection will appear in your sidebar

### Set Up Environment Variables

Create a Postman environment with the following variables:

| Variable          | Local Value                  |
| ----------------- | ---------------------------- |
| `auth_service`    | `http://localhost:5001`      |
| `user_service`    | `http://localhost:5002`      |
| `job_service`     | `http://localhost:5003`      |
| `payment_service` | `http://localhost:5004`      |

> 💡 **Tip**: After calling `Auth → Login`, copy the returned JWT and set it as a `token` environment variable. All authenticated requests use `Authorization: Bearer {{token}}`.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9
- **PostgreSQL** database — [Neon](https://neon.tech) (recommended, free tier available)
- **Redis** instance — local or [Upstash](https://upstash.com)
- **Apache Kafka** broker — local (via Docker) or a managed service
- **Cloudinary** account (for file uploads)
- **Razorpay** account (for payments)

---

### Service Setup

Each service under `services/` follows the same setup pattern:

```bash
# Example: Auth service
cd HireNest/services/auth

# 1. Install dependencies
npm install

# 2. Create .env file (see Environment Variables below)
cp .env.example .env   # or create manually

# 3. Start in development mode (TypeScript watch + nodemon)
npm run dev

# 4. Build for production
npm run build

# 5. Start production build
npm start
```

Repeat for `job`, `user`, and `payment` services, each on a different port.

---

### Frontend Setup

```bash
cd HireNest/frontend

# 1. Install dependencies
npm install

# 2. Create .env file (see Environment Variables below)

# 3. Start the development server
npm run dev
```

The frontend will start at **http://localhost:3000**.

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## Environment Variables

### Auth Service — `services/auth/.env`

| Variable          | Required | Description                                          |
| ----------------- | -------- | ---------------------------------------------------- |
| `PORT`            | ✓        | Port the service listens on (e.g. `5001`)            |
| `DATABASE_URL`    | ✓        | Neon PostgreSQL connection string                    |
| `JWT_SECRET`      | ✓        | Secret for signing/verifying JWTs (shared across all services) |
| `REDIS_URL`       | ✓        | Redis connection URL                                 |
| `KAFKA_BROKER`    | ✓        | Kafka broker address (e.g. `localhost:9092`)         |
| `UPLOAD_SERVICE`  | ✓        | Base URL of the upload utility service               |
| `FRONTEND_URL`    | ✓        | Frontend origin for CORS (no trailing slash)         |

### Job Service — `services/job/.env`

| Variable         | Required | Description                                           |
| ---------------- | -------- | ----------------------------------------------------- |
| `PORT`           | ✓        | Port (e.g. `5003`)                                    |
| `DATABASE_URL`   | ✓        | Neon PostgreSQL connection string (separate DB)       |
| `JWT_SECRET`     | ✓        | Same secret as auth service                           |
| `KAFKA_BROKER`   | ✓        | Kafka broker address                                  |
| `UPLOAD_SERVICE` | ✓        | Base URL of the upload utility service                |
| `FRONTEND_URL`   | ✓        | Frontend origin for CORS                              |

### User Service — `services/user/.env`

| Variable       | Required | Description                             |
| -------------- | -------- | --------------------------------------- |
| `PORT`         | ✓        | Port (e.g. `5002`)                      |
| `DATABASE_URL` | ✓        | Neon PostgreSQL connection string       |
| `JWT_SECRET`   | ✓        | Same secret as auth service             |
| `UPLOAD_SERVICE` | ✓      | Base URL of the upload utility service  |
| `FRONTEND_URL` | ✓        | Frontend origin for CORS                |

### Payment Service — `services/payment/.env`

| Variable           | Required | Description                             |
| ------------------ | -------- | --------------------------------------- |
| `PORT`             | ✓        | Port (e.g. `5004`)                      |
| `DATABASE_URL`     | ✓        | Neon PostgreSQL connection string       |
| `JWT_SECRET`       | ✓        | Same secret as auth service             |
| `RAZORPAY_KEY_ID`  | ✓        | Razorpay API key ID                     |
| `RAZORPAY_SECRET`  | ✓        | Razorpay API secret                     |
| `FRONTEND_URL`     | ✓        | Frontend origin for CORS                |

### Frontend — `frontend/.env`

| Variable                       | Required | Description                              |
| ------------------------------ | -------- | ---------------------------------------- |
| `NEXT_PUBLIC_AUTH_SERVICE`     | ✓        | Auth service base URL (e.g. `http://localhost:5001`) |
| `NEXT_PUBLIC_USER_SERVICE`     | ✓        | User service base URL                    |
| `NEXT_PUBLIC_JOB_SERVICE`      | ✓        | Job service base URL                     |
| `NEXT_PUBLIC_PAYMENT_SERVICE`  | ✓        | Payment service base URL                 |
| `NEXT_PUBLIC_UTILS_SERVICE`    | ✓        | Upload utility service base URL          |

---

## Assumptions

1. **Separate databases per service**: Each service connects to its own Neon database. Cross-service foreign key constraints (e.g. `applicant_id` in `applications` referencing the auth service's `user` table) are not enforced at the database level — integrity is maintained at the application layer.

2. **JWT is the trust boundary**: All services share the same `JWT_SECRET`. There is no API gateway or inter-service mTLS. Any service can verify any token issued by the auth service.

3. **Resume at apply time is snapshotted**: When a job seeker applies, their current resume URL is stored in the `applications` table. Later updates to their resume do not retroactively affect existing applications.

4. **Duplicate applications are blocked**: A unique constraint on `(job_id, applicant_id)` in the `applications` table prevents a user from applying to the same job more than once.

5. **Kafka is fire-and-forget**: The Kafka producer in each service logs errors but does not block the API response if publishing fails. Email delivery is best-effort.

6. **Subscription is per-user, 30 days flat**: Purchasing a subscription sets `subscription = NOW() + 30 days` on the user record. There is no auto-renewal; once expired, the user must subscribe again. The price is fixed at ₹119.

7. **No admin role**: There is no admin or moderation layer. Any recruiter can create companies and post jobs. Job listing integrity is the recruiter's responsibility.

8. **Kafka topic must be pre-created or auto-created**: The auth service attempts to create the `send-mail` topic on startup if it doesn't exist. Ensure your Kafka cluster allows topic auto-creation or run this before starting the service.

9. **Cloudinary public IDs are stored for cleanup**: Profile pictures and logos store their `public_id` alongside the URL so they can be deleted from Cloudinary on replacement. Orphaned assets are not automatically cleaned up.

10. **CORS requires exact origin match**: Each service's CORS config reads from `FRONTEND_URL`. Do not include a trailing slash. A mismatch will block all cross-origin requests from the frontend.

---

## Scripts Reference

| Location            | Command         | Description                                     |
| ------------------- | --------------- | ----------------------------------------------- |
| `services/auth/`    | `npm run dev`   | Start with hot reload (`tsc -w` + `nodemon`)    |
| `services/auth/`    | `npm run build` | Compile TypeScript to `dist/`                   |
| `services/auth/`    | `npm start`     | Run compiled production build                   |
| `services/job/`     | `npm run dev`   | Same pattern                                    |
| `services/user/`    | `npm run dev`   | Same pattern                                    |
| `services/payment/` | `npm run dev`   | Same pattern                                    |
| `frontend/`         | `npm run dev`   | Start Next.js dev server                        |
| `frontend/`         | `npm run build` | Build Next.js for production                    |
| `frontend/`         | `npm start`     | Start Next.js production server                 |
| `frontend/`         | `npm run lint`  | Run ESLint                                      |

---

_Built with ❤️ using Node.js, Express, PostgreSQL, Kafka, Next.js, and TypeScript._
