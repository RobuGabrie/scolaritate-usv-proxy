# Scolaritate USV — Proxy & Student Portal

A modern student portal for [Universitatea "Ștefan cel Mare" din Suceava (USV)](https://usv.ro) that acts as a proxy layer over the legacy PeopleSoft academic system. Students can view grades, track GPA, and simulate future averages — without ever touching the clunky original interface.

---

## What this is

USV's academic system runs on a legacy PeopleSoft stack accessible only on the campus network (or VPN). This app proxies those requests server-side and exposes a clean, modern UI for students.

**Current features:**
- Secure login with USV credentials (credentials are never stored — only a short-lived JWT session)
- Grades dashboard with per-semester filters
- ECTS-weighted GPA calculation
- Grade simulator — "what average do I need on remaining courses to hit X?"

**Planned:**
- Exam schedule viewer
- Timetable (orar)
- Student profile

---

## Architecture

```
Browser  →  Next.js (App Router)
                ├── /app/(dashboard)   — React UI
                ├── /app/api/auth      — Login / logout proxy
                └── /app/api/usv       — USV PeopleSoft scraping
```

The app is a **full-stack Next.js monolith** — no separate backend is needed. API routes act as the proxy layer:

1. Login request hits `/api/auth/login`
2. Server-side curl (with TLSv1.0, required for the legacy system) authenticates against USV
3. USV session cookies are encrypted into a JWT and stored as an `httpOnly` cookie
4. Subsequent requests use the JWT to re-authenticate with USV and fetch data

> Credentials are embedded in the JWT only for the duration of the session (8 hours). Nothing is persisted to a database.

### Will it ever need a separate backend?

Not for the current feature set. If a native mobile app is built later, the Next.js API routes can be extracted into a standalone service (Hono/Fastify). For now, everything lives here.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | JWT via `jose`, `httpOnly` cookies |
| USV integration | `curl` (TLSv1.0 legacy support) + `node-html-parser` |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 20+
- `curl` available on the system (used server-side for USV requests)
- Access to USV network (campus or VPN)

### Install & run

```bash
cd web
npm install
cp .env.local.example .env.local   # fill in JWT_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key for signing session JWTs (generate with `openssl rand -base64 32`) |

---

## Project Structure

```
apps/
├── web/                        # Next.js application
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # Login & logout endpoints
│   │   │   └── usv/            # Grades & debug endpoints
│   │   ├── (auth)/login/       # Login page
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   │   ├── note/           # Grades view (implemented)
│   │   │   ├── examene/        # Exams (planned)
│   │   │   ├── orar/           # Schedule (planned)
│   │   │   └── profil/         # Profile (planned)
│   │   └── disclaimer/         # Disclaimer page
│   ├── components/
│   │   ├── grades/             # GradesView, GradeTable
│   │   ├── layout/             # Sidebar navigation
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── usv/                # USV integration (auth, client, parser, types)
│   │   ├── gradeCalculator.ts  # GPA & simulation logic
│   │   └── session.ts          # JWT session management
│   └── middleware.ts           # Route protection
└── .github/workflows/ci.yml    # CI: lint + type-check
```

---

## Security Notes

- USV credentials are **never logged or stored**
- Session JWTs are signed with `HS256` and expire after 8 hours
- Cookies are `httpOnly`, `secure`, and `sameSite=lax`
- The debug endpoint (`/api/usv/debug`) should be disabled in production

---

## License

MIT
