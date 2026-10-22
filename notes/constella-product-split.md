# Constella — séparation produit Explore / Watch

Cette note fixe une frontière produit sans dupliquer immédiatement le dépôt technique.

## Constella Explore

**Besoin utilisateur :** comprendre et cartographier ses goûts.

Périmètre :
- domaines personnels (films, jeux, musique, etc.) ;
- critères et attributs ;
- évaluations et duels comparatifs ;
- scores / affinités ;
- carte 3D PCA, regroupements et constellations ;
- modes Explorer, Évaluer et Insights ;
- items « ghosts » à découvrir ;
- import/export d’un domaine.

**Promesse :** « Compare ce que tu aimes et vois apparaître la carte de tes goûts. »

## Constella Watch

**Besoin utilisateur :** suivre un sujet dans le temps sans se noyer dans les sources.

Périmètre :
- configuration de veille et sources multi-sources ;
- collecte, filtrage, fraîcheur, déduplication et ranking ;
- lifecycle des résultats (nouveau, persistant, lu, masqué) ;
- journal / digest cumulatif ;
- synthèses ;
- brouillons et articles éditables / publiables ;
- historique long via le sidecar.

**Promesse :** « Suis un sujet, garde ce qui compte et transforme la veille en journal exploitable. »

## Ce qui reste partagé pour l’instant

- dépôt et chaîne de build ;
- design system / thème ;
- types et identités de domaine/item lorsque cela reste pertinent ;
- infrastructure sidecar / persistance ;
- utilitaires communs.

## Stratégie de séparation

1. **Maintenant : séparation éditoriale et produit.** Labz présente Explore et Watch comme deux outils distincts, mais ils restent issus du même dépôt privé.
2. **Ensuite : séparation de navigation.** Entrées dédiées (par exemple `/explore` et `/watch`) et modules `src/explore/*`, `src/watch/*`, avec un noyau partagé.
3. **Seulement si nécessaire : séparation de builds ou de dépôts.** À faire si les dépendances, le déploiement, la sécurité ou les rythmes d’évolution deviennent réellement différents.

Cette approche évite de copier trop tôt le store, le sidecar et le design system tout en clarifiant immédiatement les deux besoins utilisateurs.
