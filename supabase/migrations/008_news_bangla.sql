-- Bangla title and details for news posts. Left empty, the Bangla website shows the English text. Run once in Supabase → SQL Editor.
alter table news add column if not exists title_bn text not null default '';
alter table news add column if not exists body_bn text not null default '';
