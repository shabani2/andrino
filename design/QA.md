# Validation — 28 octobre 2026

## Préférences en haut sur mobile — 29 octobre 2026

Les contrôles de langue et de thème occupent une seconde ligne fixe dans
l’en-tête mobile et tablette. Ils sont utilisables sans ouvrir la navigation,
avec des cibles tactiles de 44 px. Les doublons du menu sont retirés et les
contrôles du footer sont masqués sous 1024 px. Le contenu, les ancres et le menu
tiennent compte de la hauteur de 136 px de l’en-tête mobile.

`scripts/qa-mobile-header.mjs` vérifie les deux langues à 320, 375, 430, 768,
1024 et 1440 px : visibilité initiale, absence de débordement ou de chevauchement,
décalage du contenu, dimensions tactiles, changement de langue et thème,
mémorisation après rechargement et accès aux préférences après défilement.
Les 12 rendus et les parcours locaux réussissent sans erreur JavaScript.
Captures et rapport : `artifacts/qa-mobile-header/127.0.0.1/`.

La même vérification réussit en production : 12 rendus, deux parcours de
changement de langue et thème, aucune erreur JavaScript. Captures et rapport :
`artifacts/qa-mobile-header/andrino-two.vercel.app/`.
Déploiement Vercel `dpl_Cm6gRSfjRUk7595yXuBWXyyTUuH5`, état `READY`, disponible
sur https://andrino-two.vercel.app. ESLint et TypeScript réussissent ; la
compilation Next.js a également réussi sur Vercel.

## Déploiement Vercel — 29 octobre 2026

- Projet : `shabani2s-projects/andrino`.
- Production : https://andrino-two.vercel.app
- Déploiement : `dpl_6CJBTXshJshDB255zV29umnbLCA7`, état `READY`.
- Compilation Next.js et vérification TypeScript réussies sur Vercel.
- Les 14 pages principales répondent HTTP 200 avec la bonne langue de document.
- Le sitemap contient 44 URL utilisant le domaine de production ; `robots.txt`
  pointe vers ce sitemap. Une URL inconnue répond HTTP 404.
- À 1440 et 375 px, le changement français → anglais et le passage au thème
  sombre fonctionnent. Le thème persiste après rechargement ; aucun débordement,
  image chargée cassée ou erreur JavaScript n’a été détecté pendant ces parcours.

`NEXT_PUBLIC_SITE_URL` est configurée en production. Les variables Resend ne
sont pas configurées ; aucun e-mail réel n’a été envoyé. Le déploiement a été
réalisé depuis les fichiers locaux avec Vercel CLI.

## Reprise et vérification finale — 29 octobre 2026

La vérification visuelle interrompue a été terminée : les captures des
sélecteurs en clair, en sombre et dans le menu mobile ont été relues.
Les aperçus rapprochés se trouvent dans
`artifacts/qa-switchers/controls-preview-light.png` et
`artifacts/qa-switchers/controls-preview-dark.png`.

ESLint, TypeScript et les 518 messages de chaque langue ont été vérifiés à
nouveau. Les six parcours d’interaction ont réussi sur la version locale de
production à `http://127.0.0.1:3001`, sans erreur navigateur : clavier, thèmes,
mémorisation, changement de langue avec filtres et ancre, menu mobile,
formulaire traduit et 44 URL du sitemap.

Les 20 combinaisons d’affichage des sélecteurs (deux langues, deux thèmes,
cinq largeurs entre 320 et 1440 px) passent sans débordement, chevauchement,
erreur JavaScript ou violation Axe détectée avec les règles WCAG utilisées.
Résultats : `artifacts/qa-switchers/layout.json` et `report.json`.

## Ajout des thèmes et de l’internationalisation

### Finition des sélecteurs

Les listes natives ont été remplacées par un menu de langue Radix et des
contrôles segmentés. La langue active est indiquée par une coche dans le menu ;
le thème actif utilise une surface en relief, un contour et des icônes dédiées.
Les variantes mobile et footer affichent aussi les noms des choix.

Sur le build de production, les parcours ont vérifié les flèches du clavier,
l’ouverture du menu par Entrée, la fermeture par Échap et le retour du focus,
les changements de langue sans perte du filtre ou de l’ancre, ainsi que la
persistance des préférences. Aucune erreur navigateur n’a été relevée. Les
captures et rapports spécifiques se trouvent dans `artifacts/qa-switchers/`.

### Couverture des langues et des thèmes

`next-intl` 4.14.9 fournit les URL `/en` et `/fr`, les liens et les catalogues.
`next-themes` 0.4.6 gère les modes clair, sombre et système.

- `npm run build`, `npm run lint`, `npm run typecheck` : réussis.
- `npm run test:i18n` : 518 messages par langue, mêmes clés, aucune valeur vide,
  syntaxe ICU valide et correspondance vérifiée entre sources et identifiants.
- `npm run test:contact` : réussi, fournisseur simulé sans envoi réel.
- `scripts/qa-preferences.mjs` : 84 rendus vérifiés sur le build de production
  (sept pages × deux langues × deux thèmes × 1440/768/375 px).
- Aucun débordement horizontal, aucune image cassée, aucun texte source anglais
  résiduel détecté dans les textes visibles du catalogue français et aucune
  violation Axe détectée avec les règles WCAG A/AA utilisées ci-dessous.
- Aucune erreur JavaScript ou erreur de traduction observée dans le navigateur.
- Mode sombre conservé après rechargement ; mode système suivant les changements
  simulés de l’appareil ; choix explicite clair prioritaire sur un système sombre.
- Langue conservée après rechargement et retour à la racine. Changement de langue
  préservant le chemin, le filtre actif et l’ancre. Préférences du menu mobile
  accessibles en français et fermeture par Échap vérifiée.
- Formulaire français : cinq erreurs de validation traduites, focus sur le résumé,
  retour d’envoi non configuré traduit et données saisies conservées.
- 44 URL du sitemap accessibles ; métadonnées des détails, liens canoniques et
  alternatives de langues vérifiés sur les trois collections.
- Header vérifié aussi à 1024, 1280 et 1920 px : aucun chevauchement ni débordement.
- Huit URL inconnues testées sous `/en` et `/fr` : HTTP 404 avec message localisé.

Rapport détaillé et captures : `artifacts/qa-preferences/`. Les captures des deux
thèmes et du menu mobile français ont été relues. Les contrôles automatiques
ne remplacent pas un audit complet avec lecteur d’écran. L’envoi réel des
e-mails reste dépendant de la configuration de production.

## Validation initiale des maquettes

Version locale de production : Next.js 16.4.3, React 19.3.1, Node.js 24.19.0,
Edge / Chromium headless sous Windows.

## Vérifications réussies

- `npm run lint` : aucune erreur ni avertissement.
- `npm run typecheck` : génération des types de routes et TypeScript strict.
- `npm run test:contact` : validation des champs, configuration absente,
  succès simulé, erreur du fournisseur, réponse sans identifiant et panne réseau.
  Tous les appels d’envoi sont simulés.
- `npm run build` : compilation et génération statique réussies.
- 22 URL publiques du sitemap : HTTP 200 et un seul titre H1 par page.
- Quatre URL inconnues : HTTP 404 ; sitemap et robots.txt accessibles.
- Sept pages principales à 1440, 768 et 375 px : 21 captures, sans débordement
  horizontal, image cassée ou lien vide `href="#"`.
- Axe-core, règles WCAG 2 A/AA, 2.1 AA et 2.2 AA : aucune violation détectée
  sur ces 21 rendus. Ce contrôle automatique ne constitue pas un audit
  d’accessibilité complet avec lecteur d’écran.
- Filtres Portfolio et Writing, paramètres d’URL et remise à zéro : réussis.
- Menu mobile, touche Échap et fermeture après navigation : réussis.
- Formulaire : erreurs serveur, résumé recevant le focus, cinq champs signalés,
  message conservé et absence de faux succès sans fournisseur configuré.
- Aucune exception JavaScript ni requête applicative HTTP en erreur pendant
  les parcours testés.

## Relecture visuelle

Les exports des six maquettes sont conservés dans `design/stitch/`.
Leurs compositions, polices, couleurs et médias guident l’implémentation.
Les captures desktop et mobile ont été relues ; des corrections de contraste
et de repli des colonnes ont été appliquées. Les chiffres, clients et articles
non documentés des exemples de maquettes ont été remplacés par le contenu
fourni et des mentions explicites des publications à venir.

Le rapport détaillé et les captures sont produits par `scripts/qa-site.mjs`
dans `artifacts/qa/`. Les contrôles de rendu ont été exécutés sur le build de
production à `http://127.0.0.1:3001`.

## Configuration restante

L’adresse et les liens publics de `src/config/identity.ts` sont volontairement
des destinations par défaut. Remplacer ces valeurs et configurer le domaine
public ainsi que les variables Resend de `.env.example` avant la mise en ligne.
L’envoi réel, les profils officiels et la délivrabilité des e-mails n’ont pas
été testés. Les images des maquettes restent illustratives.
