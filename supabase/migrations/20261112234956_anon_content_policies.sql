-- Anonymous callers do not need any privilege on staff_members.
drop policy entries_read on public.entries;
drop policy translations_read on public.entry_translations;

create policy entries_read_anon on public.entries
for select to anon using (
  exists (select 1 from public.entry_translations t
          where t.entry_id = id and t.state = 'published')
);
create policy entries_read_authenticated on public.entries
for select to authenticated using (
  exists (select 1 from public.entry_translations t
          where t.entry_id = id and t.state = 'published')
  or exists (select 1 from public.staff_members s
             where s.user_id = (select auth.uid()) and s.active)
);

create policy translations_read_anon on public.entry_translations
for select to anon using (state = 'published');
create policy translations_read_authenticated on public.entry_translations
for select to authenticated using (
  state = 'published'
  or exists (select 1 from public.staff_members s
             where s.user_id = (select auth.uid()) and s.active)
);
