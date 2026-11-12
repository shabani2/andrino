-- Articles and editorial themes share /writing/[slug].
create unique index entries_writing_slug_idx on public.entries (slug)
where kind in ('article', 'writing_theme');
