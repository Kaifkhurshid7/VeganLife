-- Vegan Life: initial Postgres schema (Supabase).
--
-- Design notes
--  * Every table is in `public` with RLS ENABLED and NO policies. The Express API
--    connects as the `postgres` role (which bypasses RLS), so it works normally,
--    but anyone holding the public "publishable" key can read nothing through
--    Supabase's auto-generated REST API. Password hashes never leave the server.
--  * Primary keys are UUIDs. Tables that are paged by "newest first" also carry a
--    `seq` identity column so keyset (cursor) pagination is a single index range
--    scan instead of OFFSET.
--  * Timestamps are truncated to milliseconds so a cursor survives a round trip
--    through JavaScript Date objects without losing precision.
--  * Counters (upvotes, comments, pins, poll votes) are maintained by triggers, so
--    they stay correct no matter who writes (API, admin SQL, cascading deletes).

create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------- helpers
create or replace function public.now_ms() returns timestamptz
language sql stable as $$ select date_trunc('milliseconds', clock_timestamp()) $$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := public.now_ms();
  return new;
end $$;

-- ---------------------------------------------------------------- users
create table public.users (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null check (char_length(name) between 1 and 50),
  username             text not null check (username ~ '^[a-z0-9_]{3,20}$'),
  email                text not null check (char_length(email) <= 254),
  password_hash        text not null,
  avatar               text not null default '',
  bio                  text not null default '' check (char_length(bio) <= 300),
  role                 text not null default 'user' check (role in ('user', 'admin')),
  refresh_token        text,
  sustainability_score integer not null default 0 check (sustainability_score >= 0),
  streak               integer not null default 0 check (streak >= 0),
  completed_challenges text[] not null default '{}',
  is_verified          boolean not null default false,
  last_login           timestamptz,
  created_at           timestamptz not null default public.now_ms(),
  updated_at           timestamptz not null default public.now_ms()
);

-- case-insensitive uniqueness (usernames are stored lowercase, emails are compared lowercase)
create unique index users_username_key on public.users (username);
create unique index users_email_key on public.users (lower(email));
-- only a handful of admins: a tiny partial index makes "count admins" and role checks free
create index users_admins_idx on public.users (id) where role = 'admin';
-- admin list: newest first
create index users_created_idx on public.users (created_at desc, id desc);
-- substring search (ILIKE '%q%') for the user search box and the admin panel
create index users_name_trgm on public.users using gin (name extensions.gin_trgm_ops);
create index users_username_trgm on public.users using gin (username extensions.gin_trgm_ops);
create index users_email_trgm on public.users using gin (lower(email) extensions.gin_trgm_ops);

create trigger users_touch before update on public.users
  for each row execute function public.touch_updated_at();

-- social graph ---------------------------------------------------------
create table public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  followee_id uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default public.now_ms(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);
create index follows_followee_idx on public.follows (followee_id, created_at desc);

create table public.blocks (
  blocker_id uuid not null references public.users(id) on delete cascade,
  blocked_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index blocks_blocked_idx on public.blocks (blocked_id);

create table public.mutes (
  muter_id   uuid not null references public.users(id) on delete cascade,
  muted_id   uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (muter_id, muted_id),
  check (muter_id <> muted_id)
);
create index mutes_muted_idx on public.mutes (muted_id);

create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  description text not null default '',
  icon        text not null default '',
  achieved_at timestamptz not null default public.now_ms(),
  unique (user_id, name)
);

-- ---------------------------------------------------------------- posts
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.users(id) on delete cascade,
  title         text not null check (char_length(title) between 1 and 150),
  content       text not null check (char_length(content) between 1 and 5000),
  category      text not null check (category in
                  ('Sustainability','Fitness','Student Life','Climate','Nutrition','Recipes','General')),
  image         text not null default '',
  hashtags      text[] not null default '{}',
  status        text not null default 'approved' check (status in ('pending','approved','rejected')),
  is_pinned     boolean not null default false,
  upvote_count  integer not null default 0 check (upvote_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  pin_count     integer not null default 0 check (pin_count >= 0),
  created_at    timestamptz not null default public.now_ms(),
  updated_at    timestamptz not null default public.now_ms()
);

-- Newest-first feed and the admin status filter share ONE index: (status, created_at, id).
-- (A separate partial index for the feed was measured and removed: the planner never
-- preferred it, so it would only have slowed every write.)
-- Most-upvoted feed: a PARTIAL index (approved only) that matches the keyset ORDER BY exactly.
create index posts_feed_popular_idx on public.posts (upvote_count desc, created_at desc, id desc) where status = 'approved';
create index posts_category_idx on public.posts (category, created_at desc, id desc) where status = 'approved';
-- profile pages and "my posts"
create index posts_author_idx on public.posts (author_id, created_at desc, id desc);
-- public feed (status = 'approved') and admin filter by status
create index posts_status_idx on public.posts (status, created_at desc, id desc);
-- hashtag pages: hashtags @> ARRAY['tag']
create index posts_hashtags_gin on public.posts using gin (hashtags);
-- admin search by title
create index posts_title_trgm on public.posts using gin (title extensions.gin_trgm_ops);

create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

create table public.post_mentions (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  mentioned_by uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default public.now_ms(),
  unique (post_id, user_id)
);
create index post_mentions_user_idx on public.post_mentions (user_id, created_at desc);

-- votes ----------------------------------------------------------------
create table public.post_votes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (post_id, user_id)
);
create index post_votes_user_idx on public.post_votes (user_id);

create or replace function public.sync_post_upvotes() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set upvote_count = upvote_count + 1 where id = new.post_id;
  else
    update public.posts set upvote_count = greatest(upvote_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;
create trigger post_votes_count after insert or delete on public.post_votes
  for each row execute function public.sync_post_upvotes();

create table public.post_pins (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (post_id, user_id)
);
create index post_pins_user_idx on public.post_pins (user_id);

create or replace function public.sync_post_pins() returns trigger
language plpgsql as $$
declare pid uuid := coalesce(new.post_id, old.post_id);
begin
  update public.posts p
     set pin_count = c.n, is_pinned = c.n > 0
    from (select count(*)::int as n from public.post_pins where post_id = pid) c
   where p.id = pid;
  return null;
end $$;
create trigger post_pins_count after insert or delete on public.post_pins
  for each row execute function public.sync_post_pins();

-- polls ----------------------------------------------------------------
create table public.polls (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  question   text not null check (char_length(question) between 1 and 300),
  created_at timestamptz not null default public.now_ms()
);
create index polls_post_idx on public.polls (post_id, created_at);

create table public.poll_options (
  id         uuid primary key default gen_random_uuid(),
  poll_id    uuid not null references public.polls(id) on delete cascade,
  position   smallint not null check (position >= 0),
  text       text not null check (char_length(text) between 1 and 200),
  vote_count integer not null default 0 check (vote_count >= 0),
  unique (poll_id, position)
);

create table public.poll_votes (
  poll_id    uuid not null references public.polls(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  option_id  uuid not null references public.poll_options(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (poll_id, user_id)
);
create index poll_votes_option_idx on public.poll_votes (option_id);
create index poll_votes_user_idx on public.poll_votes (user_id);

create or replace function public.sync_poll_votes() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
  else
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
  end if;
  return null;
end $$;
create trigger poll_votes_count after insert or delete on public.poll_votes
  for each row execute function public.sync_poll_votes();

-- ---------------------------------------------------------------- comments
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  seq        bigint generated always as identity,
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  text       text not null check (char_length(text) between 1 and 500),
  is_pinned  boolean not null default false,
  created_at timestamptz not null default public.now_ms(),
  updated_at timestamptz not null default public.now_ms()
);
create unique index comments_seq_key on public.comments (seq);
-- thread page: top-level comments of a post, newest first, keyset on seq
create index comments_thread_idx on public.comments (post_id, seq desc) where parent_id is null;
create index comments_replies_idx on public.comments (parent_id, seq) where parent_id is not null;
create index comments_user_idx on public.comments (user_id);
-- admin moderation list, newest first, and text search
create index comments_recent_idx on public.comments (created_at desc, id desc);
create index comments_text_trgm on public.comments using gin (text extensions.gin_trgm_ops);

create trigger comments_touch before update on public.comments
  for each row execute function public.touch_updated_at();

-- posts.comment_count counts top-level comments only (same as before)
create or replace function public.sync_comment_count() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.parent_id is null then
      update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    end if;
  else
    if old.parent_id is null then
      update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
    end if;
  end if;
  return null;
end $$;
create trigger comments_count after insert or delete on public.comments
  for each row execute function public.sync_comment_count();

create table public.comment_reactions (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  emoji      text not null check (char_length(emoji) between 1 and 16),
  created_at timestamptz not null default public.now_ms(),
  primary key (comment_id, user_id, emoji)
);
create index comment_reactions_user_idx on public.comment_reactions (user_id);

-- ---------------------------------------------------------------- bookmarks & collections
create table public.bookmarks (
  user_id    uuid not null references public.users(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default public.now_ms(),
  primary key (user_id, post_id)
);
create index bookmarks_user_recent_idx on public.bookmarks (user_id, created_at desc);
create index bookmarks_post_idx on public.bookmarks (post_id);

create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 100),
  description text not null default '' check (char_length(description) <= 300),
  created_at  timestamptz not null default public.now_ms()
);
create index collections_user_idx on public.collections (user_id, created_at);

create table public.collection_posts (
  collection_id uuid not null references public.collections(id) on delete cascade,
  post_id       uuid not null references public.posts(id) on delete cascade,
  added_at      timestamptz not null default public.now_ms(),
  primary key (collection_id, post_id)
);
create index collection_posts_post_idx on public.collection_posts (post_id);

-- ---------------------------------------------------------------- chat
create table public.rooms (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 60),
  slug            text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description     text not null default '' check (char_length(description) <= 200),
  icon            text not null default 'leaf',
  created_by      uuid references public.users(id) on delete set null,
  is_default      boolean not null default false,
  is_active       boolean not null default true,
  last_message    text not null default '',
  last_message_at timestamptz,
  created_at      timestamptz not null default public.now_ms(),
  updated_at      timestamptz not null default public.now_ms()
);
create unique index rooms_slug_key on public.rooms (slug);
create index rooms_active_idx on public.rooms (is_default desc, last_message_at desc nulls last) where is_active;
create index rooms_created_by_idx on public.rooms (created_by);
create trigger rooms_touch before update on public.rooms
  for each row execute function public.touch_updated_at();

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  seq        bigint generated always as identity,
  room_id    uuid not null references public.rooms(id) on delete cascade,
  sender_id  uuid not null references public.users(id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 1000),
  type       text not null default 'text' check (type in ('text','system')),
  created_at timestamptz not null default public.now_ms()
);
create unique index messages_seq_key on public.messages (seq);
-- history page (keyset on seq) and unread counts
create index messages_room_idx on public.messages (room_id, seq desc);
-- unread counts: "messages in this room newer than my read cursor" is a short range scan
create index messages_room_created_idx on public.messages (room_id, created_at desc);
create index messages_sender_idx on public.messages (sender_id);

create table public.chat_reads (
  user_id uuid not null references public.users(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  read_at timestamptz not null default public.now_ms(),
  primary key (user_id, room_id)
);
create index chat_reads_room_idx on public.chat_reads (room_id);

-- ---------------------------------------------------------------- reports & push
create table public.reports (
  id                     uuid primary key default gen_random_uuid(),
  reporter_id            uuid not null references public.users(id) on delete cascade,
  target_type            text not null check (target_type in ('post','comment','user')),
  target_id              uuid not null,
  reason                 text not null,
  details                text not null default '' check (char_length(details) <= 500),
  status                 text not null default 'open' check (status in ('open','dismissed','actioned')),
  resolved_by            uuid references public.users(id) on delete set null,
  resolved_at            timestamptz,
  -- snapshots, so the queue renders without joins and survives target deletion
  target_title           text not null default '',
  target_snippet         text not null default '',
  target_author_name     text not null default '',
  target_author_username text not null default '',
  created_at             timestamptz not null default public.now_ms(),
  updated_at             timestamptz not null default public.now_ms()
);
-- one report per user per target (idempotent reporting)
create unique index reports_unique_idx on public.reports (target_type, target_id, reporter_id);
create index reports_queue_idx on public.reports (status, created_at desc, id desc);
create index reports_reporter_idx on public.reports (reporter_id);
create trigger reports_touch before update on public.reports
  for each row execute function public.touch_updated_at();

create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default public.now_ms()
);
create unique index push_subscriptions_endpoint_key on public.push_subscriptions (endpoint);
create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

-- ---------------------------------------------------------------- default chat rooms
insert into public.rooms (name, slug, description, icon, is_default) values
  ('General',        'general',        'Casual chat about vegan life, wins, and everything in between.', 'leaf',     true),
  ('Recipes',        'recipes',        'Share and swap plant-based recipes, tips, and meal pics.',       'bowl',     true),
  ('Sustainability', 'sustainability', 'Zero waste, carbon footprints, and eco-hacks.',                  'globe',    true),
  ('Fitness',        'fitness',        'Plant-powered workouts, protein questions, and gym talk.',       'dumbbell', true),
  ('Challenges',     'challenges',     'Coordinate community challenges and track your streaks.',        'fire',     true),
  ('Off-Topic',      'off-topic',      'Everything else — memes, music, life.',                          'dove',     true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------- row level security
-- Enabled everywhere, with no policies: the public Supabase key sees nothing.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- Belt and braces: take away table privileges from the API roles as well.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on all tables in schema public from anon;
    revoke all on all sequences in schema public from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on all tables in schema public from authenticated;
    revoke all on all sequences in schema public from authenticated;
  end if;
end $$;
