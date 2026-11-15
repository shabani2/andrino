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
    from public.site_page_views
    where viewed_at >= date_trunc('day', now() at time zone 'Africa/Lagos') at time zone 'Africa/Lagos'
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
