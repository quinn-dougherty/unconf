-- Identities (no auth, just names)
create table identities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Slot type enum
create type slot_type as enum ('lightning', 'standard', 'micro');

-- Time slots
create table time_slots (
  id uuid primary key default gen_random_uuid(),
  slot_type slot_type not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  slot_index int not null
);

-- Sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  time_slot_id uuid not null references time_slots(id) on delete cascade,
  title text not null,
  description text,
  speaker_names text[] not null default '{}',
  tags text[] not null default '{}',
  slides_url text,
  notes_url text,
  links jsonb not null default '[]',
  created_by uuid references identities(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (time_slot_id)
);

-- Session edit history
create table session_edits (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  edited_by uuid references identities(id),
  editor_name text,
  diff jsonb not null,
  created_at timestamptz not null default now()
);

-- Reactions
create table reactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  identity_id uuid not null references identities(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (session_id, identity_id, emoji)
);

-- Comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  identity_id uuid not null references identities(id) on delete cascade,
  author_name text not null,
  body text not null,
  flag_count int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- Comment flags
create table comment_flags (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  identity_id uuid not null references identities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, identity_id)
);

-- Bounties (PVP voluntelling)
create table bounties (
  id uuid primary key default gen_random_uuid(),
  target_name text not null,
  topic text not null,
  nominated_by uuid references identities(id),
  nominator_name text,
  created_at timestamptz not null default now()
);

-- Bounty votes
create table bounty_votes (
  id uuid primary key default gen_random_uuid(),
  bounty_id uuid not null references bounties(id) on delete cascade,
  identity_id uuid not null references identities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (bounty_id, identity_id)
);
