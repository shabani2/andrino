# ANDRINO

Portfolio éditorial d’Andrino AKUDA KANGELA, réalisé avec Next.js App Router,
React, TypeScript strict et Tailwind CSS. Les six écrans Stitch servent de
référence : Home, About, Portfolio, Writing, Projects et Contact. La page Links
complète le contenu fourni.

Le site propose une version anglaise et française avec `next-intl`, ainsi que
les modes clair, sombre et système avec `next-themes`.

## Démarrage

Node.js 22.18+ recommandé (test du formulaire avec le support TypeScript natif).
L’application Next.js nécessite au minimum Node.js 20.9.

```bash
npm ci
npm run dev
```

Ouvrir [localhost:3000](http://localhost:3000).

## Personnalisation

- `src/config/identity.ts` : identité, e-mail, téléphone, WhatsApp et profils
  officiels LinkedIn, Facebook, X, Instagram et YouTube fournis par le propriétaire.
- Supabase : articles, thèmes d’écriture, domaines du portfolio et projets publiés.
  `src/content/editorial.ts` fournit le contenu initial et le repli local.
- `src/content/pages/links.ts` : annuaire de liens.
- `src/config/navigation.ts` : menu ; `src/app/globals.css` : styles et couleurs.
- `public/images/` et `public/fonts/` : médias locaux et polices Newsreader / DM Sans.
- `messages/en.json` et `messages/fr.json` : catalogues de traduction.

## Langues et apparence

Les pages sont accessibles sous `/en` et `/fr`. La racine et les anciennes URL
sans langue redirigent vers la langue mémorisée, celle du navigateur ou l’anglais
par défaut. Les menus, textes éditoriaux, descriptions d’images, métadonnées et
retours du formulaire sont localisés. Le sitemap référence les 44 URL et leurs
alternatives linguistiques. Le changement de langue conserve le chemin, les
filtres et l’ancre courants.

Les sélecteurs sont visibles dans le header sur ordinateur et mobile. Sur
mobile, une seconde ligne fixe les rend accessibles sans ouvrir le menu ; les
boutons tactiles mesurent au moins 44 px. Le header utilise un menu de langue
personnalisé et un groupe d’icônes soleil/lune/écran pour le thème. Le footer
regroupe les réseaux sociaux et les coordonnées, sans menu de pages ni réglages.
Les composants Radix
gèrent les groupes de choix, le clavier et le retour du focus du menu.
La langue est conservée un an dans le cookie `ANDRINO_LOCALE` ;
le thème est enregistré localement sous `andrino-theme`. Le mode système suit
la préférence de l’appareil. La palette sombre est définie dans les variables
`:root.dark` de `src/app/globals.css`.

Les composants utilisent `useCopy` ou `getCopy`, deux adaptateurs de `next-intl`.
`src/i18n/source-keys.json` associe les textes sources lisibles à leurs identifiants
stables. Pour modifier ou ajouter une phrase, synchroniser cette association et
les deux catalogues, puis exécuter `npm run test:i18n`. Les valeurs techniques
des filtres et des options du formulaire restent stables dans les deux langues.

Les six thèmes d’écriture initiaux restent des thèmes à venir. Les nouveaux
articles publiés dans Supabase apparaissent dans Writing. Les pages de détail
du portfolio décrivent des pratiques professionnelles ; elles ne prétendent pas
documenter des missions ou des résultats non fournis. Les images issues des
maquettes sont illustratives et peuvent être remplacées par les photos réelles.

## Contenu Supabase

Le projet Supabase est `Andrino_Blog` (`qvuexmazymzziewbxmow`). Définir
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` et
`SUPABASE_SECRET_KEY` dans `.env.local`. La clé secrète reste côté serveur.
Sans les deux variables publiques, le site affiche le contenu local initial.

Les migrations sont dans `supabase/migrations/`. `supabase/seed.sql` importe les
15 contenus initiaux en anglais et en français. Pour le régénérer :

```bash
node scripts/generate-supabase-seed.mjs
```

Dans Supabase Studio, créer une ligne `entries`, puis une ligne
`entry_translations` par langue. Le champ `kind` accepte `article`,
`writing_theme`, `project`, `practice_area` et `case_study`. Les contenus sont
visibles seulement lorsque leur traduction a l’état `published`. Les slugs des
articles et des thèmes d’écriture doivent être distincts. `body` contient des
paragraphes en texte brut, séparés par une ligne vide. Les pages rafraîchissent
les données publiques au plus tard après 60 secondes.

Les images publiées vont dans le bucket `site-media`. Le bucket `draft-media`
reste privé. `cover_path` accepte une image locale `/images/...` ou l’URL
publique complète d’un fichier de `site-media`.

Les deux comptes Auth existants sont conservés dans `staff_members`. Les règles
RLS réservent les brouillons et les modifications à ces comptes. Les demandes de
contact sont enregistrées dans `contact_messages` avant la notification e-mail.
Sans clé secrète Supabase, le formulaire utilise encore l’envoi SMTP précédent.
Voir [l’architecture détaillée](docs/SUPABASE_ARCHITECTURE.md).

### Créer un compte administrateur

Avec `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SECRET_KEY` dans `.env.local`,
vérifier l’accès au projet, puis lancer la commande dans un terminal interactif :

```bash
npm run bootstrap:admin -- --check
npm run bootstrap:admin
```

La commande demande l’adresse e-mail et le mot de passe deux fois. Le mot de
passe est masqué et n’est pas enregistré dans le dépôt. Elle crée un compte
Supabase Auth confirmé, puis lui attribue le rôle `admin` dans `staff_members`.
Le nom, la photo et le téléphone restent vides jusqu’à leur saisie sur la
page `/fr/admin/profil`.

Si l’adresse appartient déjà à un compte Auth, la commande s’arrête sans le
modifier. Pour définir un nouveau mot de passe et lui attribuer le rôle admin :

```bash
npm run bootstrap:admin -- --reset-existing
```

Cette option active aussi un compte `staff_members` inactif. Elle ne remplace
pas les champs de profil existants. La clé secrète Supabase doit rester locale
ou dans un environnement serveur, jamais dans le navigateur.

La connexion de l’équipe est accessible sur `/fr/admin/login` (ou
`/en/admin/login`). Après connexion, `/fr/admin` vérifie le compte Auth et
l’accès actif. Le tableau de bord mène aux articles, projets, rubriques, thèmes
d’écriture, études de cas, messages reçus et profil. Les administrateurs peuvent
aussi gérer les membres de l’équipe. La déconnexion est dans la navigation.

## Déploiement Vercel

Projet : `shabani2s-projects/andrino`.
Adresse de production : https://andrino-two.vercel.app/fr

`vercel.json` fixe le framework Next.js. `.vercelignore` exclut les captures,
les maquettes, les dépendances locales et les fichiers d’environnement du
téléversement. `NEXT_PUBLIC_SITE_URL` est configurée en production sur
`https://andrino-two.vercel.app` pour les URL canoniques et le sitemap.

Depuis ce dossier lié au projet, publier les changements avec :

```bash
vercel deploy --prod --yes --scope shabani2s-projects
```

Le déploiement utilise les fichiers locaux. La notification par e-mail nécessite les
variables Gmail décrites ci-dessous dans l’environnement de production Vercel.
La lecture du contenu Supabase nécessite aussi les deux variables publiques
Supabase. `SUPABASE_SECRET_KEY` permet d’enregistrer les messages reçus.

## Formulaire et domaine

Copier `.env.example` vers `.env.local`, puis renseigner :

```dotenv
NEXT_PUBLIC_SITE_URL=https://votre-domaine.example
GMAIL_USER=andrino243@gmail.com
GMAIL_APP_PASSWORD=
CONTACT_EMAIL=andrino243@gmail.com
```

Le formulaire valide les champs côté serveur, affiche les erreurs accessibles et
conserve le message après un échec. L’envoi utilise Gmail SMTP via Nodemailer,
avec TLS sur le port 465. Le compte expéditeur et le destinataire par défaut
sont `andrino243@gmail.com`. `GMAIL_USER` et `CONTACT_EMAIL` permettent de les
modifier. `Reply-To` contient l’adresse du visiteur pour lui répondre directement.
Avec `SUPABASE_SECRET_KEY`, le message reste enregistré même si la notification
Gmail échoue. Sans clé Supabase, le formulaire utilise l’ancien envoi SMTP et
signale un échec quand le mot de passe d’application manque. Les secrets restent
uniquement sur le serveur.

Activer la validation en deux étapes et créer un mot de passe d’application
dans le [compte Google](https://myaccount.google.com/apppasswords) de l’expéditeur.
Renseigner ce mot de passe dans `.env.local`, puis dans les variables du projet
Vercel. Ne pas utiliser le mot de passe habituel du compte. Redémarrer le serveur
local ou redéployer après modification des variables. La commande suivante teste
l’authentification SMTP sans envoyer d’e-mail :

```bash
node --env-file=.env.local scripts/check-gmail.mjs
```

Le footer contient les réseaux sociaux et coordonnées avec leurs icônes, ainsi
qu’un formulaire dépliable « Envoyez-nous un message ». Sur la page Contact,
ce lien mène au formulaire principal afin de ne pas le dupliquer.

`NEXT_PUBLIC_SITE_URL` configure les URL du sitemap et les métadonnées SEO.

## Commandes

```bash
npm run lint
npm run typecheck
npm run test:contact
npm run test:i18n
npm run build
npm start
```

Le test du formulaire simule le fournisseur d’e-mails : aucun message réel n’est
envoyé. Le script facultatif `scripts/qa-site.mjs` vérifie les sept pages à 1440,
768 et 375 px, les filtres, le menu et le formulaire. `scripts/qa-preferences.mjs`
étend la vérification aux deux langues et aux deux thèmes, à la persistance des
préférences et au changement de langue. `QA_INTERACTIONS_ONLY=1` permet de ne
relancer que les parcours interactifs. Ces scripts nécessitent Playwright et
Edge ; `QA_NODE_MODULES` peut désigner un répertoire contenant Playwright et
`QA_URL` un serveur déjà lancé. Les rapports et captures sont écrits dans
`artifacts/qa/` et `artifacts/qa-preferences/` (ignorés par Git).
Voir `design/QA.md` pour le bilan de validation.

## Organisation

```text
src/app/            Routes, layouts, erreurs et métadonnées
src/components/     Navigation, UI et sections des pages
src/content/        Contenu éditorial et liens
src/config/         Identité, navigation et SEO
src/i18n/           Routage et accès aux traductions
messages/           Catalogues anglais et français
src/actions/        Server Action du formulaire
src/lib/            Collections, validation et envoi d’e-mails
src/types/          Types du domaine
src/styles/         Typographie et animations
public/             Images et polices locales
design/stitch/      Exports HTML de référence et provenance des médias
design-system/      Décisions visuelles et recommandations des skills
scripts/            Import des médias et vérifications
```

Routes principales sous `/en` et `/fr` : accueil, `/about`, `/portfolio`,
`/writing`, `/projects`, `/links`, `/contact`.
Quinze routes de détail sont générées par langue pour les collections.
Les filtres Portfolio et Writing sont conservés dans l’URL. Les slugs inconnus
affichent la page 404.

La mise en page reprend la grille éditoriale, les grands titres serif, le fond
ivoire vert, les accents terracotta et les sections vert forêt des maquettes.
Les exports Stitch et le système de design permettent les prochains ajustements.
