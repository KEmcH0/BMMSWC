-- Official result PDF per exam, and site settings (e.g. homepage image). Run once in Supabase → SQL Editor.
alter table exams add column if not exists pdf_url text not null default '';

create table if not exists settings (
  key text primary key,
  value text not null default ''
);
alter table settings enable row level security;
