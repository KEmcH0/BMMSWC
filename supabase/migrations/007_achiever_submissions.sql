-- Forms students send from the public "Add your name" page. Nothing here is shown on the website: approving a form
-- moves it to achievers, rejecting deletes it. Run once in Supabase → SQL Editor.
create table if not exists achiever_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text not null,
  category text not null check (category in ('university', 'medical', 'engineering')),
  institution text not null,
  subject text not null,
  session text not null,
  admission_year int not null,
  village text not null,
  phone text not null default '',
  email text not null default '',
  facebook text not null default '',
  sender_hash text not null default '',  -- hashed IP address, only used to limit repeat forms
  created_at timestamptz not null default now()
);
create index if not exists achiever_submissions_sender on achiever_submissions (sender_hash, created_at);
alter table achiever_submissions enable row level security;
