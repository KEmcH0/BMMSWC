-- Adds father's name, mother's name and village to exam results. Run once in Supabase → SQL Editor.
alter table exam_results add column if not exists father_name text not null default '';
alter table exam_results add column if not exists mother_name text not null default '';
alter table exam_results add column if not exists village text not null default '';
