# Deployment

## The constraint

`https://surajrandave.github.io/Sportfolio/` is **GitHub Pages**, which serves
static files only. It cannot run PHP, PostgreSQL, a queue worker, or a
websocket daemon.

So the app splits across two places:

| Part | Where | Why |
| --- | --- | --- |
| React frontend | GitHub Pages (your existing URL) | Static build — Pages handles this fine |
| Laravel API + PostgreSQL | Somewhere else | Needs PHP 8.2 and a database |

The frontend on its own will load but show **"Can't load the portfolio"**,
because every piece of content comes from the API. **Host the backend first.**

---

## Step 1 — Host the Laravel API

You need PHP 8.2+, PostgreSQL (or MySQL), and ideally one long-running process
for the queue worker.

### Recommended: Railway or Render (free tier)

Both give you PHP and a managed PostgreSQL instance, and both deploy from this
same GitHub repo.

Set these environment variables on the host:

```dotenv
APP_NAME="Suraj Randave Portfolio"
APP_ENV=production
APP_DEBUG=false
APP_KEY=            # php artisan key:generate --show
APP_URL=https://your-api-host.example.com

# Must be your Pages URL — this drives CORS and the links inside emails
FRONTEND_URL=https://surajrandave.github.io/Sportfolio

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CACHE_STORE=file
QUEUE_CONNECTION=database
SESSION_DRIVER=database

MAIL_MAILER=smtp
MAIL_SCHEME=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=surajrandave3@gmail.com
MAIL_PASSWORD=            # Gmail app password
MAIL_FROM_ADDRESS=surajrandave3@gmail.com
MAIL_FROM_NAME="Suraj Randave"

BROADCAST_CONNECTION=reverb
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=your-api-host.example.com
REVERB_PORT=443
REVERB_SCHEME=https
```

Release commands:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force        # first deploy only
php artisan storage:link
php artisan config:cache && php artisan route:cache
```

Processes to run:

```bash
php artisan serve --host=0.0.0.0 --port=$PORT   # or the host's php-fpm
php artisan queue:work --tries=3 --backoff=10   # required, or emails never send
php artisan reverb:start --host=0.0.0.0         # optional, for live dashboard
```

**Change the admin password** before going live — it is seeded from
`ADMIN_PASSWORD`.

### If your host has no PostgreSQL

Switch `DB_CONNECTION=mysql` and `DB_PORT=3306`. The schema is portable, but
note `MessageController` uses `ilike` for case-insensitive inbox search, which
is PostgreSQL-only — change it to `like` for MySQL.

### If your host cannot run a long-running process

Reverb won't work, so the dashboard's live updates stop. Everything else keeps
working. Run the queue from cron instead:

```
* * * * * cd /path/to/backend && php artisan queue:work --stop-when-empty --tries=3
```

---

## Step 2 — Point the frontend at that API

In GitHub: **Settings → Secrets and variables → Actions → Variables**, add:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://your-api-host.example.com/api` |
| `VITE_STORAGE_URL` | `https://your-api-host.example.com/storage` |
| `VITE_REVERB_APP_KEY` | same as `REVERB_APP_KEY` on the backend |
| `VITE_REVERB_HOST` | `your-api-host.example.com` |
| `VITE_REVERB_PORT` | `443` |
| `VITE_REVERB_SCHEME` | `https` |

The workflow fails fast if `VITE_API_URL` is missing, rather than publishing a
site that silently shows no content.

---

## Step 3 — Enable Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions.**

Then push to `main`, or run *Deploy frontend to GitHub Pages* manually from the
Actions tab. It builds `frontend/` with `VITE_BASE=/Sportfolio/` and publishes.

### Two things the build handles for you

- **Subpath assets.** Pages serves from `/Sportfolio/`, so `vite.config.ts`
  builds asset URLs against that base and React Router gets a matching
  `basename` from `import.meta.env.BASE_URL`.
- **Deep links.** Pages has no rewrite rules, so `/Sportfolio/projects/idims`
  would 404 on refresh. The build ships a copy of `index.html` as `404.html`;
  Pages serves it without changing the URL, and React Router recovers the route.

---

## Keeping the old site up meanwhile

The previous static site is preserved on the **`legacy-static-site`** branch.
Until the API is hosted, set **Settings → Pages → Source** to that branch so
the URL on your CV keeps working. Switch to *GitHub Actions* only once the
backend is live.

---

## Go-live checklist

- [ ] Backend deployed, `/api/site` returns JSON
- [ ] `php artisan migrate --force` run
- [ ] `storage:link` run, avatar and resume load over HTTPS
- [ ] Queue worker running (test the contact form and check both emails arrive)
- [ ] Admin password changed from the seeded default
- [ ] `APP_DEBUG=false`
- [ ] `FRONTEND_URL` matches the Pages URL exactly, or CORS blocks the SPA
- [ ] Actions variables set, workflow green
- [ ] Pages source switched to GitHub Actions
- [ ] Short links `/p/{code}` resolve — they use `APP_URL`, so they point at
      the API host unless you add a redirect on your own domain
