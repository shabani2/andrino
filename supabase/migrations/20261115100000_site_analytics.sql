create table public.site_page_views (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  path text not null check (char_length(path) <= 250 and path ~ '^/(fr|en)(/.*)?$'),
  entry_id uuid references public.entries(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index site_page_views_viewed_at_idx on public.site_page_views (viewed_at desc);
create index site_page_views_entry_viewed_at_idx
  on public.site_page_views (entry_id, viewed_at desc) where entry_id is not null;
create index site_page_views_visitor_path_viewed_at_idx
  on public.site_page_views (visitor_id, path, viewed_at desc);

alter table public.site_page_views enable row level security;
grant select, insert, update, delete on public.site_page_views to service_role;

create or replace function public.record_site_page_view(
  p_visitor_id uuid,
  p_path text,
  p_entry_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_path !~ '^/(fr|en)(/.*)?$' then
    raise exception 'Invalid page path';
  end if;

  if not exists (
    select 1 from public.site_page_views
    where visitor_id = p_visitor_id
      and path = p_path
      and entry_id is not distinct from p_entry_id
      and viewed_at > now() - interval '30 minutes'
  ) then
    insert into public.site_page_views (visitor_id, path, entry_id)
    values (p_visitor_id, p_path, p_entry_id);
  end if;
end;
$$;

revoke all on function public.record_site_page_view(uuid, text, uuid) from public;
grant execute on function public.record_site_page_view(uuid, text, uuid) to service_role;

create or replace function public.get_site_analytics(p_locale text, p_days integer default 30)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with period as (
    select greatest(1, least(coalesce(p_days, 30), 365)) as days
  ),
  totals as (
    select count(*)::integer as views, count(distinct visitor_id)::integer as visitors,
      count(distinct visitor_id) filter (where entry_id is not null)::integer as readers
    from public.site_page_views
  ),
  recent as (
    select count(*)::integer as views, count(distinct visitor_id)::integer as visitors,
      count(distinct visitor_id) filter (where entry_id is not null)::integer as readers
    from public.site_page_views, period
    where viewed_at >= now() - make_interval(days => period.days)
  ),
  today as (
    select count(*)::integer as views, count(distinct visitor_id)::integer as visitors,
      count(distinct visitor_id) filter (where entry_id is not null)::integer as readers
    from public.site_page_views where viewed_at >= date_trunc('day', now())
  ),
  top_content as (
    select coalesce(jsonb_agg(content_row order by (content_row->>'views')::integer desc), '[]'::jsonb) as items
    from (
      select jsonb_build_object(
        'entry_id', e.id, 'slug', e.slug, 'kind', e.kind,
        'title', coalesce(t.title, e.slug), 'views', count(*)::integer,
        'readers', count(distinct pv.visitor_id)::integer
      ) as content_row
      from public.site_page_views pv
      join public.entries e on e.id = pv.entry_id
      left join public.entry_translations t on t.entry_id = e.id and t.locale = p_locale
      cross join period
      where pv.entry_id is not null and pv.viewed_at >= now() - make_interval(days => period.days)
      group by e.id, e.slug, e.kind, t.title
      order by count(*) desc limit 10
    ) ranked
  )
  select jsonb_build_object(
    'all_time', jsonb_build_object('views', totals.views, 'visitors', totals.visitors, 'readers', totals.readers),
    'recent', jsonb_build_object('days', period.days, 'views', recent.views, 'visitors', recent.visitors, 'readers', recent.readers),
    'today', jsonb_build_object('views', today.views, 'visitors', today.visitors, 'readers', today.readers),
    'top_content', top_content.items
  ) from totals, recent, today, top_content, period;
$$;

revoke all on function public.get_site_analytics(text, integer) from public;
grant execute on function public.get_site_analytics(text, integer) to service_role;
