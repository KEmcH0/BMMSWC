-- Adds topper photos to exam results. Run once in Supabase → SQL Editor.
alter table exam_results add column if not exists photo_url text not null default '';
-- Toppers entered by hand may not have a roll number.
alter table exam_results alter column roll drop not null;
