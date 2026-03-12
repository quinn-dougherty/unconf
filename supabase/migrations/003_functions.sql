-- Auto-update updated_at on sessions
create or replace function update_session_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on sessions
  for each row
  execute function update_session_updated_at();

-- Auto-increment flag_count and auto-hide at >= 3
create or replace function handle_comment_flag()
returns trigger as $$
begin
  update comments
  set flag_count = flag_count + 1,
      hidden = (flag_count + 1 >= 3)
  where id = new.comment_id;
  return new;
end;
$$ language plpgsql;

create trigger comment_flag_inserted
  after insert on comment_flags
  for each row
  execute function handle_comment_flag();
