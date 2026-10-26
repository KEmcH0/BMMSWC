-- BMMSWC database schema.
-- Run this once in Supabase Dashboard → SQL Editor, then run seed.sql.
--
-- All reads and writes go through the Next.js server using the secret key,
-- so Row Level Security is enabled with no policies: the public/anon key can't
-- read or write anything directly.

create extension if not exists "pgcrypto";

-- Committee members, advisors and alumni share one table.
create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('committee', 'advisor', 'alumni')),
  name text not null,
  position text not null default '',   -- committee: post, advisor: designation, alumni: batch/status
  bio text not null default '',
  photo_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists people_kind_order on people (kind, sort_order);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  date date not null,
  category text not null default 'News',
  body text not null default '',
  image_url text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists news_date on news (date desc);

create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  event_date date,
  cover_url text not null default '',     -- empty = first photo of the album
  news_id uuid references news (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references albums (id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  width int,
  height int,
  created_at timestamptz not null default now()
);
create index if not exists gallery_album on gallery (album_id, created_at);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  exam_date date,
  pdf_url text not null default '',    -- official result PDF, optional
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  roll text,                           -- may be empty for toppers entered by hand
  name text not null default '',
  father_name text not null default '',
  mother_name text not null default '',
  village text not null default '',
  school text not null default '',
  class text not null default '',      -- "5", "8", "10", or "12-science" / "12-arts" / "12-commerce"
  marks numeric,
  merit_position int,
  photo_url text not null default '',
  unique (exam_id, roll)
);
create index if not exists exam_results_merit on exam_results (exam_id, merit_position);

-- Small site-wide settings edited from the admin, e.g. key 'hero_image'.
create table if not exists settings (
  key text primary key,
  value text not null default ''
);

alter table people enable row level security;
alter table news enable row level security;
alter table albums enable row level security;
alter table gallery enable row level security;
alter table exams enable row level security;
alter table exam_results enable row level security;
alter table settings enable row level security;

-- Public bucket for uploaded photos (anyone can view, only the server can upload).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
