# Architecture Supabase d’Andrino

## Flux

- Les pages Next.js lisent directement les entrées publiées avec la clé publique Supabase et les règles RLS.
- `entries` porte le type, le slug, l’ordre, les tags et les chemins des médias.
- `entry_translations` porte le contenu anglais et français. Chaque langue a son propre état `draft` ou `published`.
- `staff_members` relie les comptes Supabase Auth aux droits de publication et aux champs de profil facultatifs.
- `contact_messages` conserve les demandes reçues. Seuls les membres actifs peuvent les lire.
- `site-media` sert les images publiées ; `draft-media` protège les images en préparation.

## Publication

Supabase Studio sert d’interface de gestion initiale aux personnes ayant accès
au tableau de bord du projet. Elles ajoutent une entrée, puis ses traductions.
La publication d’une langue consiste à passer
sa traduction à `published`. Les pages et le sitemap prennent en compte les
nouvelles entrées sans reconstruction de l’application, avec un cache de 60 secondes.

Les textes d’interface restent dans `messages/en.json` et `messages/fr.json`.
Les textes éditoriaux résident dans `entry_translations`. Un `article` représente
une publication réelle ; un `writing_theme` reste un sujet annoncé. Un
`practice_area` présente un domaine d’activité ; `case_study` est réservé aux
réalisations documentées et approuvées.

## Sécurité et exploitation

Les rôles `anon` et `authenticated` reçoivent seulement les permissions SQL
nécessaires. Les politiques RLS limitent la lecture publique aux traductions
publiées. La clé secrète utilisée pour les contacts ne quitte jamais le serveur.
L’ancien système de newsletter, de planification et de diffusion sociale a été
retiré du schéma. Les identités Auth existantes restent disponibles.

`staff_members` prépare les droits d’un futur espace d’édition dans l’application.
Les évolutions suivantes peuvent ajouter un espace `/admin` avec Supabase Auth,
un éditeur de contenu et une invalidation immédiate du cache après publication.
