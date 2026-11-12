-- The secret key bypasses RLS but still needs table privileges.
grant all on all tables in schema public to service_role;
