-- Enable RLS on all tables
alter table identities enable row level security;
alter table time_slots enable row level security;
alter table sessions enable row level security;
alter table session_edits enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;
alter table comment_flags enable row level security;
alter table bounties enable row level security;
alter table bounty_votes enable row level security;

-- Fully permissive anon policies (ANARCHY)
create policy "anon_all" on identities for all using (true) with check (true);
create policy "anon_all" on time_slots for all using (true) with check (true);
create policy "anon_all" on sessions for all using (true) with check (true);
create policy "anon_all" on session_edits for all using (true) with check (true);
create policy "anon_all" on reactions for all using (true) with check (true);
create policy "anon_all" on comments for all using (true) with check (true);
create policy "anon_all" on comment_flags for all using (true) with check (true);
create policy "anon_all" on bounties for all using (true) with check (true);
create policy "anon_all" on bounty_votes for all using (true) with check (true);
