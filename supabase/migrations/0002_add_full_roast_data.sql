-- Add expansion columns to support storing the entire AI output in history
alter table public.roast_history 
add column if not exists full_roasts jsonb default '["No deeper details found."]'::jsonb not null,
add column if not exists saving_grace text default 'None. True despair.' not null;
