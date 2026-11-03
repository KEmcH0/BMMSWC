-- Students from the community who got into a university, medical or engineering college. Run once in Supabase → SQL Editor.
create table if not exists achievers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text not null default '',
  category text not null check (category in ('university', 'medical', 'engineering')),
  institution text not null,
  subject text not null default '',
  session text not null default '',      -- e.g. 2023-24
  admission_year int,
  village text not null default '',
  phone text not null default '',
  email text not null default '',
  facebook text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists achievers_year on achievers (admission_year desc);
alter table achievers enable row level security;
