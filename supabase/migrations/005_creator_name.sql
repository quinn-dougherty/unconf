-- Add creator_name to sessions so we can detect voluntelling client-side
alter table sessions add column creator_name text;
