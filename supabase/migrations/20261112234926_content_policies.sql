-- One SELECT policy per role avoids evaluating overlapping permissive policies.
drop policy entries_public_read on public.entries;
drop policy entries_staff_write on public.entries;
drop policy translations_public_read on public.entry_translations;
drop policy translations_staff_write on public.entry_translations;

create policy entries_read on public.entries
for select to anon, authenticated using (
  exists (select 1 from public.entry_translations t
          where t.entry_id = id and t.state = 'published')
  or exists (select 1 from public.staff_members s
             where s.user_id = (select auth.uid()) and s.active)
);
create policy entries_insert on public.entries
for insert to authenticated with check (
  exists (select 1 from public.staff_members s
          where s.user_id = (select auth.uid()) and s.active)
);
create policy entries_update on public.entries
for update to authenticated
using (exists (select 1 from public.staff_members s
              where s.user_id = (select auth.uid()) and s.active))
with check (exists (select 1 from public.staff_members s
                   where s.user_id = (select auth.uid()) and s.active));
create policy entries_delete on public.entries
for delete to authenticated using (
  exists (select 1 from public.staff_members s
          where s.user_id = (select auth.uid()) and s.active)
);

create policy translations_read on public.entry_translations
for select to anon, authenticated using (
  state = 'published'
  or exists (select 1 from public.staff_members s
             where s.user_id = (select auth.uid()) and s.active)
);
create policy translations_insert on public.entry_translations
for insert to authenticated with check (
  exists (select 1 from public.staff_members s
          where s.user_id = (select auth.uid()) and s.active)
);
create policy translations_update on public.entry_translations
for update to authenticated
using (exists (select 1 from public.staff_members s
              where s.user_id = (select auth.uid()) and s.active))
with check (exists (select 1 from public.staff_members s
                   where s.user_id = (select auth.uid()) and s.active));
create policy translations_delete on public.entry_translations
for delete to authenticated using (
  exists (select 1 from public.staff_members s
          where s.user_id = (select auth.uid()) and s.active)
);
