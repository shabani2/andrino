alter table public.entry_translations
  add column generated_from_locale text
  check (generated_from_locale in ('fr', 'en') and generated_from_locale <> locale);
