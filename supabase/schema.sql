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

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  exam_date date,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  roll text,                           -- may be empty for toppers entered by hand
  name text not null default '',
  school text not null default '',
  class text not null default '',
  marks numeric,
  merit_position int,
  photo_url text not null default '',
  unique (exam_id, roll)
);
create index if not exists exam_results_merit on exam_results (exam_id, merit_position);

alter table people enable row level security;
alter table news enable row level security;
alter table gallery enable row level security;
alter table exams enable row level security;
alter table exam_results enable row level security;

-- Public bucket for uploaded photos (anyone can view, only the server can upload).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
