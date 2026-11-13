-- Keep sign-in credentials in Auth and allow profile details to be filled later.
alter table public.staff_members
  add column display_name text check (display_name is null or length(trim(display_name)) between 1 and 120),
  add column avatar_path text check (avatar_path is null or length(avatar_path) between 1 and 512),
  add column phone text check (phone is null or length(trim(phone)) between 1 and 32);

-- Staff may edit only their own profile fields. Role and active stay privileged.
grant update (display_name, avatar_path, phone) on public.staff_members to authenticated;

create policy staff_self_update on public.staff_members
for update to authenticated
using (user_id = (select auth.uid()) and active)
with check (user_id = (select auth.uid()) and active);
