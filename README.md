# Suraj Randave — Portfolio Platform

A database-driven portfolio **application**, not a static site. Content lives in
PostgreSQL and is managed from an admin dashboard; enquiries and visitor traffic
are pushed to that dashboard live over websockets.

```
├── backend/    Laravel 12 REST API · Sanctum auth · Reverb websockets · PostgreSQL
└── frontend/   React 19 · TypeScript · Vite · Tailwind CSS v4
                ├── /            public portfolio
                └── /admin       control panel
```

## Stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Backend    | Laravel 12, PHP 8.2                                   |
| Auth       | Laravel Sanctum (bearer tokens)                        |
| Real-time  | Laravel Reverb (websockets)                            |
| Database   | PostgreSQL 18                                          |
| Frontend   | React 19, TypeScript 6, Vite 8, Tailwind CSS v4         |
| Charts     | Recharts                                               |

## Features

**Public site** — hero, about, career timeline, project case studies with detail
pages, skills by category, freelance services with pricing, testimonials, and a
contact form with budget/timeline capture, honeypot spam trapping and rate
limiting.

**Admin dashboard** (`/admin`) — live traffic and enquiry counters, a 14-day
visits chart, an enquiry inbox with search/filter/star/archive, and full CRUD for
projects, experience, skills, services, testimonials and profile (including
avatar and resume uploads).

**Real-time** — `EnquiryReceived` and `VisitorRecorded` broadcast on the private
`admin` channel. A new contact-form submission appears in the inbox instantly,
with no polling and no refresh.

**Email** — every contact-form submission sends two branded HTML emails: a
notification to Suraj (with `Reply-To` set to the sender, so hitting reply
answers them directly) and a thank-you auto-reply to the visitor containing a
copy of what they sent. Sending is wrapped in `try/catch` — a mail failure is
logged but can never lose the enquiry, which is already saved and broadcast.

## Email setup

Out of the box `MAIL_MAILER=log` writes rendered emails to
`storage/logs/laravel.log` instead of sending them, so the contact form works
with no credentials. To send for real with Gmail:

1. Enable 2-Step Verification on the Google account.
2. Create an App Password at <https://myaccount.google.com/apppasswords>.
3. In `backend/.env`:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=surajrandave3@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM_ADDRESS="surajrandave3@gmail.com"
MAIL_FROM_NAME="Suraj Randave"
```

Then `php artisan config:clear`.

Preview the templates in a browser without sending anything (local env only):

- <http://localhost:8000/preview/email/notification>
- <http://localhost:8000/preview/email/confirmation>

### Emails are queued

Two Gmail SMTP handshakes take ~12 seconds. Sending inline made the contact
form hang for that long, so emails are queued (`QUEUE_CONNECTION=database`) and
the form now responds in ~1.5s.

**This means a worker has to be running, or emails never send:**

```bash
cd backend
php artisan queue:work --tries=3 --backoff=10
```

On shared hosting (cPanel) add a cron job instead, running every minute:

```
* * * * * cd /path/to/backend && php artisan queue:work --stop-when-empty --tries=3
```

Check for stuck or failed sends with:

```bash
php artisan queue:failed     # anything that exhausted its retries
php artisan queue:retry all  # retry them
```

If the worker is down, enquiries are still saved and still appear in the
dashboard inbox in real time — only the emails wait in the `jobs` table.

## Local setup

Requires PHP 8.2+, Composer, Node 20+, and PostgreSQL 18 running.

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE suraj_portfolio;"
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # then set DB_PASSWORD
php artisan key:generate
php artisan migrate --seed
php artisan serve             # http://localhost:8000
```

### 3. Reverb (separate terminal)

```bash
cd backend
php artisan reverb:start      # ws://localhost:8080
```

The dashboard shows a **Live** badge when Reverb is reachable and **Offline**
when it is not.

### 4. Queue worker (separate terminal)

Required — the contact form's emails are queued, so without this they never send.

```bash
cd backend
php artisan queue:work --tries=3 --backoff=10
```

### 5. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

### Admin sign-in

Seeded from `PortfolioSeeder`:

- **Email** `surajrandave3@gmail.com`
- **Password** whatever `ADMIN_PASSWORD` is set to in `backend/.env`

Change the password before deploying anywhere public.

## API

Public, unauthenticated:

| Method | Endpoint               | Purpose                                    |
| ------ | ---------------------- | ------------------------------------------ |
| GET    | `/api/site`            | Whole public site in one payload           |
| GET    | `/api/projects`        | Published projects (`?category=`, `?featured=`) |
| GET    | `/api/projects/{slug}` | Project case study, increments views       |
| POST   | `/api/contact`         | Submit an enquiry (throttled 6/min)        |
| POST   | `/api/testimonials`    | Submit feedback, pending approval          |
| POST   | `/api/track`           | Record a page view                         |

Admin, `auth:sanctum`, under `/api/admin`: `dashboard`, `profile`, `messages`,
and resource routes for `projects`, `experiences`, `skills`, `services`,
`testimonials`.

## Notes

- Public project routes bind by `slug`; admin routes bind by `id` so renaming a
  slug never breaks an edit URL.
- Testimonials submitted from the site are hidden until approved in the admin.
- Admin JS (Recharts, Echo, Pusher) is lazy-loaded, so public visitors never
  download it.
