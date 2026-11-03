# Thème sombre Andrino

La palette et les variantes accessibles sont centralisées dans
`src/styles/theme.css`. Les composants utilisent ces variables pour les fonds,
textes, bordures, ombres et états interactifs. Le thème sombre est proposé à la
première visite ; une préférence de thème déjà enregistrée reste respectée.

## Fichiers concernés

- `src/styles/theme.css` : palette, alias sémantiques, ombres et variante claire.
- `src/app/globals.css` : application sur toutes les pages, cartes, formulaires,
  menus, boutons et états hover, focus, active et disabled.
- `src/styles/typography.css` : couleur des titres.
- `src/components/layout/theme-provider.tsx` : apparence sombre initiale.
- `src/components/about/vision-section.tsx` : style du lien dans le panneau sombre.
- `src/components/ui/button.tsx` : variantes reliées aux styles centralisés.
- `scripts/qa-preferences.mjs` : sélection explicite du thème pour chaque audit.
- `design-system/andrino/MASTER.md` : référentiel aligné sur la palette demandée.
- `design/QA.md` : bilan des contrôles du thème.

Les textes, routes, traductions, formulaires et coordonnées sont conservés.

## Cartes et espacement intérieur

Les cartes de l'accueil et des articles utilisent un padding de 20 à 28 px,
avec des images en retrait et des angles internes cohérents. Les contenus des
cartes Portfolio, Projets et des panneaux latéraux disposent d'un espacement
adapté à leur largeur, jusqu'à 40 px.

Les doubles contours ont été retirés. Les cartes utilisent une bordure unique
très discrète, des angles de 16 px et des ombres diffuses. Les variantes claires
et sombres ont leur propre intensité de bordure et d'ombre. Le survol et le focus
à l'intérieur des cartes interactives renforcent légèrement leur séparation.

Variables communes dans `theme.css` : `--card-padding`,
`--card-padding-compact`, `--card-radius`, `--color-card-border`,
`--shadow-card` et leurs variantes de survol. Les contours de focus et les
bordures des champs de formulaire restent identifiables.

## Ajustements de contraste

| Usage | Ajustement | Ratio mesuré |
| --- | --- | --- |
| Liens sur surface sombre | `#6EA8FE` ; le bleu de marque `#2563EB` reste disponible pour la marque et les fonds | 6,06:1, contre 2,83:1 avec le bleu de marque |
| Texte des boutons orange | `#0B0F1A` sur `#F59E0B` | 8,91:1 |
| Texte sur bouton secondaire survolé | `#F1F5F9` sur `#2563EB` | 4,72:1 |
| Texte secondaire sur surface | `#94A3B8` sur `#1E293B` | 5,71:1 |
| Bordures des champs | `#64748B` sur `#1E293B` | 3,07:1 pour l'identification du contrôle |

Les liens survolés utilisent une teinte claire adaptée au contraste. Les
bordures des boutons secondaires utilisent `#3B82F6` pour rester identifiables
sur une carte. Les bordures décoratives conservent l'opacité de 15 % demandée.

## Médias et contrôle manuel

Les photos, captures de documents, illustrations et icônes raster n'ont pas
été recolorées. Le favicon `src/app/icon.png` conserve son ancien fond
anthracite, distinct du nouveau bleu nuit : une nouvelle version nécessite
une décision graphique. Les captures de documents gardent leurs zones claires.

Vérifier le rendu des images et les préférences de thème sur un téléphone réel.
Une préférence claire déjà enregistrée nécessite de sélectionner « Sombre »
pour voir le nouveau thème. Les audits automatisés ne remplacent pas une
vérification complète avec lecteur d'écran.
