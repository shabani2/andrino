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

- `src/config/identity.ts` : nom, adresse e-mail et liens publics. Les destinations
  actuelles sont des exemples, à remplacer par les profils officiels.
- `src/content/editorial.ts` : biographie, disciplines, convictions, six domaines
  du portfolio, six thèmes d’écriture et trois projets.
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
boutons tactiles mesurent au moins 44 px. Ils sont masqués dans le pied de page
mobile. Le header utilise un menu de langue personnalisé et un groupe d’icônes
soleil/lune/écran pour le thème. Le footer desktop conserve les contrôles
segmentés avec libellés. Les composants Radix
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

Les articles sont présentés comme des thèmes à venir. Les pages de détail du
portfolio décrivent des pratiques professionnelles ; elles ne prétendent pas
documenter des missions ou des résultats non fournis. Les images issues des
maquettes sont illustratives et peuvent être remplacées par les photos réelles.

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

Le déploiement utilise les fichiers locaux. L’envoi des messages nécessite les
variables Resend décrites ci-dessous dans l’environnement de production Vercel.

## Formulaire et domaine

Copier `.env.example` vers `.env.local`, puis renseigner :

```dotenv
NEXT_PUBLIC_SITE_URL=https://votre-domaine.example
RESEND_API_KEY=
CONTACT_EMAIL=adresse-de-reception@example.com
CONTACT_FROM_EMAIL=Andrino <contact@votre-domaine.example>
```

Le formulaire valide les champs côté serveur, affiche les erreurs accessibles et
conserve le message après un échec. L’envoi utilise Resend avec un domaine
d’expédition vérifié. Sans les trois variables d’envoi, il indique que le message
n’a pas été envoyé. Aucune clé n’est exposée au navigateur.

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
