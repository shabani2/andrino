-- Reset the previous blog domain while keeping Supabase Auth identities.
-- The former admin and writer keep editorial access in the new model.
create temporary table _andrino_staff_keep (user_id uuid primary key, role text not null);
do $$
begin
  if to_regclass('public.profiles') is not null then
    execute $sql$
      insert into _andrino_staff_keep (user_id, role)
      select id, case when role::text = 'admin' then 'admin' else 'editor' end
      from public.profiles
      where active and role::text in ('admin', 'editor', 'writer')
    $sql$;
  end if;
end $$;

do $$
declare job record;
begin
  if to_regclass('cron.job') is not null then
    for job in execute $sql$
      select jobid from cron.job
      where jobname in ('andrino-publish', 'naleta-retention')
    $sql$ loop
      execute format('select cron.unschedule(%s)', job.jobid);
    end loop;
  end if;
end $$;

-- Policies on Storage can refer to old functions or buckets.
do $$
declare policy_record record;
begin
  for policy_record in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
  loop
    execute format('drop policy %I on storage.objects', policy_record.policyname);
  end loop;
end $$;

drop schema if exists private cascade;
drop schema if exists public cascade;
create schema public;
grant usage on schema public to anon, authenticated, service_role;

create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.staff_members (user_id, role)
select user_id, role from _andrino_staff_keep;
drop table _andrino_staff_keep;

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in (
    'article', 'writing_theme', 'project', 'practice_area', 'case_study'
  )),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_code text,
  tags text[] not null default '{}',
  cover_path text,
  gallery_paths text[] not null default '{}',
  external_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kind, slug)
);

create table public.entry_translations (
  entry_id uuid not null references public.entries(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr')),
  title text not null check (length(trim(title)) > 0),
  summary text not null default '',
  body text not null default '',
  category_label text,
  project_status text,
  cover_alt text not null default '',
  seo_title text,
  seo_description text,
  state text not null default 'draft' check (state in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (entry_id, locale)
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  consent_at timestamptz not null,
  locale text not null check (locale in ('en', 'fr')),
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now()
);

create index entries_kind_order_idx on public.entries (kind, sort_order, created_at desc);
create index translations_public_idx on public.entry_translations (locale, published_at desc)
  where state = 'published';
create index contact_messages_new_idx on public.contact_messages (created_at desc)
  where status = 'new';

create schema private;
create function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger entries_updated_at before update on public.entries
for each row execute function private.touch_updated_at();
create trigger translations_updated_at before update on public.entry_translations
for each row execute function private.touch_updated_at();

alter table public.staff_members enable row level security;
alter table public.entries enable row level security;
alter table public.entry_translations enable row level security;
alter table public.contact_messages enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.entries, public.entry_translations to anon;
grant select, insert, update, delete on public.entries, public.entry_translations to authenticated;
grant select on public.staff_members to authenticated;
grant select, update on public.contact_messages to authenticated;

create policy staff_self_read on public.staff_members
for select to authenticated using (user_id = (select auth.uid()));

create policy entries_public_read on public.entries
for select to anon, authenticated using (
  exists (select 1 from public.entry_translations t
          where t.entry_id = id and t.state = 'published')
);
create policy entries_staff_write on public.entries
for all to authenticated
using (exists (select 1 from public.staff_members s
              where s.user_id = (select auth.uid()) and s.active))
with check (exists (select 1 from public.staff_members s
                   where s.user_id = (select auth.uid()) and s.active));

create policy translations_public_read on public.entry_translations
for select to anon, authenticated using (state = 'published');
create policy translations_staff_write on public.entry_translations
for all to authenticated
using (exists (select 1 from public.staff_members s
              where s.user_id = (select auth.uid()) and s.active))
with check (exists (select 1 from public.staff_members s
                   where s.user_id = (select auth.uid()) and s.active));

create policy contact_staff_read on public.contact_messages
for select to authenticated using (
  exists (select 1 from public.staff_members s
          where s.user_id = (select auth.uid()) and s.active)
);
create policy contact_staff_update on public.contact_messages
for update to authenticated
using (exists (select 1 from public.staff_members s
              where s.user_id = (select auth.uid()) and s.active))
with check (exists (select 1 from public.staff_members s
                   where s.user_id = (select auth.uid()) and s.active));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('draft-media', 'draft-media', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy site_media_staff_write on storage.objects
for all to authenticated
using (bucket_id = 'site-media' and exists (
  select 1 from public.staff_members s
  where s.user_id = (select auth.uid()) and s.active
))
with check (bucket_id = 'site-media' and exists (
  select 1 from public.staff_members s
  where s.user_id = (select auth.uid()) and s.active
));

create policy draft_media_staff_access on storage.objects
for all to authenticated
using (bucket_id = 'draft-media' and exists (
  select 1 from public.staff_members s
  where s.user_id = (select auth.uid()) and s.active
))
with check (bucket_id = 'draft-media' and exists (
  select 1 from public.staff_members s
  where s.user_id = (select auth.uid()) and s.active
));
