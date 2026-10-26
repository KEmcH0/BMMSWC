-- Groups gallery photos into albums (one per event). Run once in Supabase → SQL Editor.
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
alter table albums enable row level security;

alter table gallery add column if not exists album_id uuid references albums (id) on delete cascade;
alter table gallery add column if not exists width int;
alter table gallery add column if not exists height int;
create index if not exists gallery_album on gallery (album_id, created_at);

-- Existing photos go into one album so nothing disappears.
insert into albums (slug, title, description)
select 'bmmswc-moments', 'BMMSWC Moments', 'Photos from our programs and gatherings.'
where exists (select 1 from gallery where album_id is null)
on conflict (slug) do nothing;
update gallery set album_id = (select id from albums where slug = 'bmmswc-moments') where album_id is null;
