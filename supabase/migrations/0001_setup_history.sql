-- 1. Create the History Table
create table public.roast_history (
    id uuid default gen_random_uuid() primary key,
    url text not null,
    grade text not null,
    roast_preview text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Configure Row Level Security (RLS)
alter table public.roast_history enable row level security;

-- Allow anyone to read the history
create policy "Allow public read access"
on public.roast_history for select
using ( true );

-- Allow anyone to insert into history (safe for this project scope)
create policy "Allow public insert access"
on public.roast_history for insert
with check ( true );

-- 3. Enable pg_cron for automatic 24-hour deletion
create extension if not exists pg_cron;

select cron.schedule('delete-old-roasts', '0 * * * *', $$
  delete from public.roast_history 
  where created_at < now() - interval '24 hours';
$$);

-- 4. Enable Supabase Realtime for this table
alter publication supabase_realtime add table public.roast_history;
