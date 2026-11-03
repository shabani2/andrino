# Validation — 28 octobre 2026

## Cartes aérées et contours adoucis — 3 novembre 2026

Padding de 20 à 28 px ajouté aux cartes de l'accueil et des articles ;
espacement harmonisé dans les cartes Portfolio/Projets et les panneaux latéraux.
Les doubles contours sont retirés au profit d'une bordure très discrète,
d'angles de 16 px et d'ombres diffuses, avec des variantes pour chaque thème.
Les focus clavier et bordures des champs conservent leur visibilité.

ESLint et compilation de production, incluant TypeScript : réussis.
50 rendus et états contrôlés : sept pages françaises en clair/sombre à
375/768/1440 px, accueil et écriture en anglais sur mobile, erreurs du formulaire
et formulaire du footer ouvert dans les deux thèmes. Aucun débordement de page
ou de carte, image cassée, exception JavaScript ou violation Axe détecté.
Le focus des cartes-liens conserve un contour visible de 2 px.

Les captures des cartes ont été relues en clair et en sombre, sur ordinateur
et mobile. Rapport et captures : `artifacts/qa-cards/`.

## Palette sombre bleu nuit / ardoise — 3 novembre 2026

Palette, variantes accessibles et fichiers : `design/THEME.md`.
Les couleurs des styles applicatifs sont centralisées dans
`src/styles/theme.css` ; aucune couleur littérale ne subsiste ailleurs dans
les sources CSS/TSX. Les médias raster sont conservés.

- ESLint, TypeScript et dernière compilation de production : réussis.
- Sept pages principales en FR/EN, clair/sombre, à 375/768/1440 px :
  84 rendus contrôlés, sans débordement, image cassée ou traduction manquante.
- Le lien du panneau Vision était trop sombre en mode clair. La correction
  retire une classe de couleur qui masquait le style du lien. Les 36 rendus
  concernés par les derniers changements des pages Accueil, À propos et
  Écriture ont été repris : aucune violation Axe détectée.
- 30 contrôles supplémentaires couvrent les trois gabarits de détail,
  les erreurs de formulaire, le formulaire du footer déplié, le menu de langue
  et la navigation mobile, en clair/sombre à 375/1440 px : réussis.
- Après uniformisation des fonds, 26 contrôles ciblés de Projets, Liens,
  des formulaires et des menus : réussis, sans violation Axe ni débordement.
- Focus des champs et état désactivé vérifiés ; contraste des textes et
  contrôles documenté dans `design/THEME.md`.
- Sélecteurs au clavier, mémorisation du thème, mode système, changement de
  langue conservant filtre et ancre, navigation mobile et validation serveur
  du formulaire : réussis. Aucun message réel n'a été envoyé.
- Les 44 routes du sitemap répondent en HTTP 200. Aucune exception JavaScript
  détectée dans les parcours vérifiés.

Rapports : `artifacts/qa-preferences/report.json` (contrôle initial),
`artifacts/qa-switchers/report.json` (interactions),
`artifacts/qa-theme/final-report.json` (36 rendus corrigés),
`artifacts/qa-theme/states-report.json` et
`artifacts/qa-theme/surfaces-report.json` (30 et 26 états complémentaires).
La version finale tourne sur `http://127.0.0.1:3001`.

Contrôles manuels restants : rendu sur un téléphone réel, photos et captures
avec zones claires, favicon anthracite d'origine. Les médias n'ont pas été
recolorés. Axe ne remplace pas un audit complet avec lecteur d'écran.

## Icônes et formulaire Gmail — 3 novembre 2026

Le footer porte le titre « Réseaux sociaux » et chaque réseau est précédé de
son pictogramme. E-mail, téléphone et WhatsApp ont également leur icône. Les
mêmes repères visuels sont utilisés dans Contact et l’annuaire de liens.

Un formulaire dépliable est accessible depuis le footer des pages publiques.
Sur Contact, son accès mène au formulaire principal afin de conserver un seul
formulaire et des identifiants de champs uniques par page.

À la demande du propriétaire, Nodemailer et Gmail SMTP remplacent Resend.
L’expéditeur et le destinataire par défaut sont `andrino243@gmail.com` ;
l’adresse du visiteur est utilisée comme Reply-To. TLS est actif sur le port
465, les délais réseau sont limités et les accès aux fichiers et URL sont
désactivés pour les messages. Les tests simulent SMTP : configuration absente,
succès, destinataire par défaut, rejet, absence de confirmation et erreur de
connexion. Aucun e-mail réel n’a été envoyé.

Le mot de passe d’application Gmail n’est pas encore fourni. L’envoi réel
reste à activer en renseignant `GMAIL_APP_PASSWORD` dans `.env.local` et dans
les variables Vercel, puis en redémarrant/redéployant. Le fichier local créé
ne contient aucun secret et est ignoré par Git. `scripts/check-gmail.mjs`
permet de vérifier l’authentification SMTP sans envoyer de message.

Lint, TypeScript, build, 524 traductions et tests SMTP simulés : réussis.
Huit rendus du footer et du formulaire (FR/EN, clair/sombre, 375/1440 px)
confirment les icônes, la présence d’un seul formulaire par page et les cinq
erreurs de validation traduites. Aucune violation Axe ni exception JavaScript
détectée. Les liens du résumé d’erreurs ont été agrandis pour le tactile.
Captures et rapport : `artifacts/qa-footer-form/`.

## Footer simplifié — 3 novembre 2026

Le footer conserve l’identité, les cinq profils sociaux officiels, l’e-mail,
le téléphone, WhatsApp et le retour en haut. Le menu des pages et les réglages
de langue et de thème sont retirés. Ces réglages restent dans le header sur
ordinateur et mobile. Les anciens styles du menu et des réglages du footer
sont supprimés ; le parcours de test des préférences cible désormais le header.

Lint, TypeScript et build de production réussis. Quatre rendus vérifiés en
français et anglais, à 375 et 1440 px : aucun débordement, cinq profils et trois
liens de contact présents, aucun menu ni réglage dans le footer, sélecteurs du
header visibles. Captures : `artifacts/qa-footer/`.

## Coordonnées officielles — 3 novembre 2026

Les cinq profils fournis sont intégrés au footer, à Contact et à Liens. Les
paramètres de suivi sont supprimés ; le lien de partage Facebook est conservé.
L’accueil, Contact et le footer proposent les liens e-mail, appel et WhatsApp.
Le lien Substack provisoire de la page Écriture est remplacé par YouTube.

Lint, TypeScript, compilation et validation des 521 messages FR/EN : réussis.
Le test de l’envoi simulé vérifie également le destinataire officiel par défaut.
Seize rendus locaux sur quatre pages, deux langues et deux largeurs (375/1440 px)
confirment les cinq URL officielles, les liens de contact, l’absence des anciens
liens et de débordement horizontal. Aucune exception JavaScript détectée.
Rapport et captures : `artifacts/qa-contact-links/`. Aucun e-mail, appel ou
message WhatsApp réel n’a été déclenché pendant la vérification.

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

Les coordonnées officielles fournies le 3 novembre 2026 sont intégrées dans
`src/config/identity.ts` : cinq réseaux, e-mail, téléphone et WhatsApp.
Configurer le domaine public et les variables Gmail de `.env.example` avant
l’envoi en production. Le destinataire par défaut du formulaire est
`andrino243@gmail.com`. L’envoi réel et la délivrabilité des e-mails n’ont pas
été testés. Les images des maquettes restent illustratives.
