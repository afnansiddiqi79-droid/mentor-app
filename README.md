# MentorLagbe — Frontend

A production-style tuition and mentorship marketplace built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui** on top of Base UI. Students discover and apply to tuitions, tutors publish listings and review applicants, and admins moderate the marketplace.

The backend lives in the sibling repository `mentor-server` (Express 5 + MongoDB + Better Auth + Stripe).

## Features

### Public
- Landing page with live platform stats, featured tuitions and how-it-works sections
- Searchable, filterable, paginated tuition directory (`/tuitions`)
- Tuition detail pages with tutor profile, fee, schedule and application form
- Pricing page with Stripe Checkout entry points for Tutor Pro ($15) and Student Pro ($10)
- How-it-works, sign-in and sign-up pages
- Payment success and cancel pages
- Custom 404, route error boundary and global error boundary
- Light/dark theme, responsive navigation and footer

### Student
- Overview with application stats and recent activity
- Apply to a tuition with phone, preferred schedule and a learning note
- Track pending/accepted/rejected applications and withdraw pending ones
- Upgrade to Student Pro

### Tutor
- Overview with listing and applicant metrics
- Create and edit tuitions with an ImgBB-hosted banner upload
- Free plan limit of 2 active/pending listings, Pro plan unlimited
- Review applicants, accept or reject them
- Open/close listings and delete them
- Upgrade to Tutor Pro

### Admin
- Platform metrics: users, tuitions, applications and revenue
- Approve or reject submitted tuitions
- Change user roles (`student`, `tutor`, `admin`)
- Browse all transactions and payment status

### UX and quality
- Sonner toasts for every mutation
- Loading skeletons, empty states and retryable error states
- Form validation with Zod + React Hook Form
- Accessible shadcn/ui primitives and Lucide icons
- Role-aware navigation that hides actions a user cannot perform
- Client-side route guards as UX only — the backend re-checks every role

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Base UI), Lucide |
| Auth client | Better Auth (`better-auth/react`) with JWT + cookie session |
| Forms | React Hook Form + Zod |
| Feedback | Sonner |
| Theme | next-themes |
| Language | TypeScript (strict) |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create the local env file
cp .env.example .env.local

# 3. Start the backend first (from ../mentor-server)
#    npm run dev

# 4. Start the frontend
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:5000` | Express API base URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | yes | `http://localhost:5000` | Better Auth base URL (JWT + session endpoints) |

Stripe and ImgBB keys are **server-side only** and belong in the backend `.env`. The frontend never sees a secret key.

### Demo accounts

Created by `npm run seed` in the backend:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@mentorlagbe.com` | `Admin@12345` |
| Tutor | `tutor@mentorlagbe.com` | `Password123!` |
| Student | `student@mentorlagbe.com` | `Password123!` |

Admin accounts cannot be created from the public sign-up page.

## Scripts

```bash
npm run dev     # development server (Turbopack)
npm run lint    # ESLint (Next core-web-vitals + TypeScript + React Compiler rules)
npm run build   # production build + type check
npm start       # serve the production build
```

## Route map

```
/                                  Landing page
/tuitions                          Search + filters + pagination
/tuitions/[id]                     Detail + application form
/pricing                           Plans + Stripe Checkout
/how-it-works                      Marketplace guide
/sign-in, /sign-up                 Better Auth email/password
/payment/success, /payment/cancel  Checkout return pages

/dashboard                         Role-aware redirect
/dashboard/profile                 Profile + avatar upload
/dashboard/student                 Student overview
/dashboard/student/my-applications Applications
/dashboard/tutor                   Tutor overview
/dashboard/tutor/post-tuition      Create listing
/dashboard/tutor/my-tuitions       Listing management
/dashboard/tutor/my-tuitions/[id]/edit
/dashboard/tutor/applicants        Applicant review
/dashboard/admin                   Admin overview
/dashboard/admin/users             Role management
/dashboard/admin/tuitions          Moderation queue
/dashboard/admin/transactions      Payments
```

## Architecture notes

- Public pages are server components that call `fetchPublic` with `no-store`, so listings are always fresh.
- Dashboards are client components using `useApi` and the typed `api` client.
- `AuthProvider` wraps `authClient.useSession()` and exposes `user`, `isPending` and `refetch`.
- `api` requests attach a Bearer JWT fetched from `/api/auth/token` (cached for 4 minutes). If a request returns 401, the token cache is cleared and the cookie session is retried once.
- `RoleGuard` prevents rendering a dashboard the user cannot access, but it is not the security boundary — the Express middleware is.
- Image uploads go to `POST /api/uploads/image` (multipart), which proxies to ImgBB with the server-side key.

## Production deployment

1. Deploy the backend first and confirm `GET /api/health` is healthy.
2. Set the frontend environment variables in the host (Vercel recommended):
   - `NEXT_PUBLIC_API_URL=https://your-api.example.com`
   - `NEXT_PUBLIC_BETTER_AUTH_URL=https://your-api.example.com`
3. Update the backend `CLIENT_URL` and `BETTER_AUTH_URL` to the deployed origins and redeploy.
4. Add the production frontend origin to the Stripe Checkout success/cancel URLs (already derived from `CLIENT_URL` in the backend).
5. In Google Cloud Console, add `<API origin>/api/auth/callback/google` as an authorized redirect URI. Google returns to the API, while the frontend sends an absolute `<frontend origin>/dashboard` callback URL for the final post-login redirect.
6. Run `npm run build` locally before deploying to catch type errors early.

## Known limitations

- Stripe Checkout and ImgBB uploads require real API keys. Without them the backend returns a clear `503` and the UI shows a toast instead of failing silently.
- Email verification is not enforced because no transactional email provider is configured.
- There is no automated browser test suite; verification is done with lint, production builds and live API smoke tests.

## Repository

Backend: `../mentor-server` — Express 5, MongoDB, Better Auth, Stripe, ImgBB.
