create table public.post_likes (
  entry_id uuid not null references public.entries(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (entry_id, visitor_id)
);

create table public.site_follows (
  visitor_id uuid primary key,
  created_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  visitor_id uuid not null,
  author_name text not null check (char_length(author_name) between 2 and 60),
  body text not null check (char_length(body) between 3 and 1500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index post_comments_approved_idx on public.post_comments (entry_id, created_at desc) where status = 'approved';
create index post_comments_visitor_idx on public.post_comments (visitor_id, created_at desc);
create index post_likes_entry_idx on public.post_likes (entry_id);

alter table public.post_likes enable row level security;
alter table public.site_follows enable row level security;
alter table public.post_comments enable row level security;

grant select, insert, update, delete on public.post_likes, public.site_follows, public.post_comments to service_role;
