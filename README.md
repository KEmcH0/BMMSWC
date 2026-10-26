# BMMSWC Website

Official website of the Bangladesh Manipuri Muslim Student Welfare Community. Built with Next.js, Tailwind CSS and Supabase (database + photo storage).

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (or restore a paused one).
2. Open **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables and the public `media` photo bucket.
3. Run [`supabase/seed.sql`](supabase/seed.sql) once to load the current committee, advisors, news and gallery.
4. In **Project Settings → API Keys**, copy the project URL and a **secret** key.

### 2. Environment variables

Put these in `.env.local` for local development, and in **Vercel → Settings → Environment Variables** for the live site:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` |
| `SUPABASE_SECRET_KEY` | the secret key (never share it, never prefix with `NEXT_PUBLIC_`) |
| `ADMIN_PASSWORD` | a strong admin password |
| `ADMIN_SESSION_SECRET` | optional, any long random string; changing it logs every admin out |
| `NEXT_PUBLIC_SITE_URL` | optional, e.g. `https://bmmswc.org` once you have a domain |

### 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:3000, and http://localhost:3000/admin for the admin panel.

## Admin panel (`/admin`)

- **News & Events**: add, edit, delete and save as draft. A future date shows under "Upcoming Events".
- **Exam Results**: create an exam, upload a CSV (template: `/results-template.csv`), then tick "Published". Students search by roll at `/results`.
- **Committee / Advisors / Alumni**: add, edit, remove and set the display order.
- **Gallery**: upload up to 10 photos at a time, or delete them.

Photos are resized in the browser before upload, so photos straight from a phone are fine.

## Where things live

- `src/lib/site.ts`: contact details, founding year, committee session
- `src/lib/db.ts`: all database reads
- `src/app/admin/**/actions.ts`: all database writes (each one checks the admin login)
- `supabase/`: database schema and initial data
