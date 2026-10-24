# Audit pré-intégration Labz — Million de pixels

**Dépôt audité :** `MathieuBal/million-de-pixels`  
**Révision :** `8ac4ecfe75ec75a19cf1792c8ab85b366955a5dd`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · projet public/testable techniquement fort, avec un bloqueur de cycle idle et une CI à renforcer**

## Verdict

`million-de-pixels` tient réellement sa promesse technique principale : une image devient un plateau logique de **1 048 576 cellules**, sans instancier un million de sprites ou d'objets. L'état est porté par des TypedArrays, la recherche de cibles passe par des index dédiés, le rendu repose sur une texture GPU et une palette, et les traitements lourds d'image / reprise hors-ligne sont déportés dans des workers.

Le projet possède également une profondeur de jeu réelle : canon sur rail, files de munitions, surface exposée, améliorations, spécialisations, campagne, galerie, doctrines, progression permanente, sauvegarde IndexedDB, migrations de save et reprise hors-ligne.

C'est donc un **projet Labz fort et légitime**, pas une démo technique maquillée en jeu.

Le principal défaut fonctionnel trouvé concerne toutefois une promesse centrale d'un idle : une session laissée ouverte en arrière-plan ne reçoit pas de catch-up au retour. La reprise hors-ligne est bien implémentée après restauration/rechargement, mais pas lors d'un simple `hidden → visible` de la même page/PWA.

Avant de présenter le projet comme totalement fiabilisé, il faut corriger ce cycle de vie et intégrer les tests déjà riches à la livraison continue.

---

## Ce qui existe réellement

### Un million de cellules, sans un million d'objets

`PixelWorld` impose des buffers de taille exacte `PIXEL_COUNT` et stocke notamment :

- `baseColorId` ;
- `colorId` ;
- `hp` ;
- `flags`.

Les structures plus coûteuses sont des index dérivés :

- `ColorIndex` pour retrouver / retirer des pixels d'une couleur sans scanner le plateau ;
- `SurfaceIndex` pour savoir quelle cellule fait face à un canon sur une voie ;
- `MacroTileIndex` pour les statistiques et zones.

Une destruction met à jour ces index de façon cohérente et rend l'opération idempotente.

La formulation README « le million de pixels est un tableau de données, jamais un million d'objets graphiques ou physiques » est donc bien soutenue par le code.

### Traitement d'image et rendu

Un worker dédié gère le redimensionnement, l'histogramme, la quantification et le mapping vers la palette. Les gros buffers sont transférés entre threads.

Le rendu PixiJS projette l'état CPU du monde ; il n'est pas la source de vérité. Les effets visuels sont séparés de la simulation et soumis à un budget LOD.

### Combat

Le système évite une physique générique : le canon suit le périmètre et examine les voies franchies. `SurfaceIndex` fournit la première cellule solide d'une ligne ou colonne depuis le côté d'arrivée.

Une couleur enterrée derrière une autre peut donc être réellement inaccessible depuis un côté. Le smoke E2E contrôle notamment qu'un tir ordinaire ne détruit jamais plus d'un bloc.

### Progression

Le dépôt contient des modules distincts pour :

- améliorations de niveau ;
- capacités et automatisation ;
- progression permanente ;
- doctrines ;
- galerie ;
- campagne ;
- bibliothèque de couleurs ;
- milestones.

La campagne actuelle embarque **56 images**.

---

## Persistance : point fort

### IndexedDB

Les saves ne sérialisent pas le million de cellules en JSON/base64. Les `ArrayBuffer` sont stockés directement dans IndexedDB via structured clone.

L'indisponibilité/quota est traitée comme erreur remontable à l'interface.

### Chaîne de migrations v1 → v6

La migration transforme explicitement chaque ancien format jusqu'au schéma actuel : ancien canon orbital, ancien deck, introduction des upgrades, suppression de l'ancienne cadence de tir puis ajout du nombre de passages sur une image.

La save finale est validée, notamment sur la taille des quatre gros buffers.

### Image source non persistée

La sauvegarde contient les buffers quantifiés et la palette, pas le fichier image original importé. L'affirmation de l'interface selon laquelle la source n'est pas conservée est cohérente avec le schéma audité.

---

## Reprise hors-ligne : implémentation sérieuse, cycle incomplet

### Ce qui fonctionne

Lors de la restauration d'une save :

1. le temps écoulé depuis `lastSimulatedAtEpochMs` est calculé ;
2. la production observée par couleur est utilisée ;
3. l'absence est intégrée analytiquement dans un worker ;
4. les fractions de hit sont conservées ;
5. un PRNG `XorShift32` versionné choisit les pixels ;
6. de vraies cellules du buffer sont marquées mortes ;
7. le monde est reconstruit avec le résultat ;
8. la save est réécrite après le catch-up.

Le modèle plafonne également le temps hors-ligne et limite la production par le stock porté par les canons sauvegardés.

### P0 — aucune reprise sur simple retour d'arrière-plan

`installLifecycleHooks()` ne traite que le passage à `hidden` et appelle `save()`.

Il n'existe pas de branche `visible` qui compare le temps écoulé et lance `runOfflineCatchUp()`.

Dans une page/PWA conservée ouverte :

- le navigateur suspend ou bride généralement `requestAnimationFrame` en arrière-plan ;
- la sauvegarde pose un timestamp au moment du passage caché ;
- au retour, la session reprend directement sans restaurer la save ;
- l'absence n'est donc pas compensée par le modèle hors-ligne.

**Impact :** le comportement idle dépend de la manière dont le joueur revient : fermer/recharger peut progresser, laisser l'application ouverte en arrière-plan peut perdre cette progression.

**Correction recommandée :** au `visible`, appliquer le même modèle de catch-up au monde courant depuis le checkpoint posé au `hidden`, avec un test automatisé dédié.

### Nuance : offline analytique ≠ replay exact

Le mode live détruit des cellules accessibles via les surfaces / voies du plateau.

Le modèle offline convertit la production mesurée par couleur en nombre de hits puis détruit aléatoirement des pixels vivants de cette couleur. Il ne rejoue pas les trajectoires exactes du canon ni la géométrie successive des façades.

C'est un compromis raisonnable pour plusieurs heures d'absence, mais la présentation doit rester précise : **de vrais pixels sont supprimés, selon une approximation analytique de la production observée**.

---

## Tests : très bon niveau, mais hors CI

### Tests unitaires

Le dépôt contient des tests Vitest pour le monde, la surface, le combat, les canons, la quantification, le PRNG, le modèle offline, les migrations/persistance, les upgrades, les doctrines, la campagne, la progression permanente, le viewport et les effets spéciaux. Le README annonce 101 tests unitaires.

### E2E sur build de production

`tests/e2e/smoke.mjs` démarre `vite preview`, donc exerce bien le `dist/` construit.

Il couvre notamment :

- import et quantification ;
- démarrage explicite ;
- plateau jusqu'à 1 048 576 cellules ;
- rail et canons ;
- invariants de destruction ;
- zoom ;
- budget de simulation ;
- upgrades et achats par lots ;
- sortie / actions destructrices ;
- save IndexedDB + reload ;
- persistance des améliorations ;
- fin de toile et récompense ;
- progression permanente / nuancier ;
- layouts tactiles.

C'est une vraie recette automatisée du vertical slice.

### P0/P1 livraison — aucun test n'est exécuté par GitHub Actions

Le workflow de déploiement exécute uniquement :

- `npm ci` ;
- `npm run build` ;
- publication Pages.

Un changement peut donc casser une règle de combat, une migration, le mode offline ou le parcours E2E et être publié tant que TypeScript compile.

**Remédiation :** faire passer `npm test`, le build et au moins un smoke Playwright avant la publication. Le benchmark complet peut rester nightly/manuellement déclenché s'il est trop coûteux.

---

## P1 — transaction IndexedDB à fiabiliser

Le helper générique `run()` résout sa Promise sur `request.onsuccess`, pas sur `transaction.oncomplete`.

Pour une écriture, il existe une fenêtre théorique où la requête `put()` a réussi mais où la transaction pourrait encore être annulée avant commit. La Promise ayant déjà été résolue, l'appelant pourrait croire la sauvegarde acquise.

`clearEverything()` utilise déjà correctement `tx.oncomplete`.

**Correction recommandée :** résoudre les écritures uniquement à la complétion de la transaction.

---

## Compatibilité

Le projet détecte explicitement :

- WebGL2 ;
- Web Workers ;
- OffscreenCanvas ;
- `createImageBitmap` ;
- IndexedDB.

Les quatre premières APIs sont structurelles et l'application refuse de prétendre fonctionner sans elles. IndexedDB peut manquer au prix de la persistance.

Labz doit donc parler de **jeu navigateur moderne**, pas de compatibilité universelle.

Le viewport, lui, n'interdit pas le zoom navigateur.

---

## Campagne / poids / droits

Les 56 PNG de campagne expliquent l'essentiel des ~92 Mo du dépôt. Ils ne sont pas tous forcément téléchargés au premier écran, mais ils alourdissent clone, historique et artefact de déploiement.

### P1 — provenance des images à documenter

L'audit n'a trouvé ni licence globale, ni notice de provenance / attribution des 56 illustrations.

Cela ne prouve pas un problème de droits : cela signifie seulement que leur provenance n'est pas documentée dans le dépôt.

Avant de présenter la campagne comme pack durable ou réutilisable, préciser si ces images sont créées par Mathieu, générées, sous licence compatible ou uniquement destinées à la démonstration.

Si le catalogue continue à grossir, des variantes WebP/AVIF et une séparation éventuelle du pack d'assets peuvent réduire la dette de dépôt.

---

## Typographie externe

`index.html` contient déjà un TODO explicite : Space Grotesk et IBM Plex Mono viennent de Google Fonts.

Auto-héberger ces polices stabiliserait le premier rendu, supprimerait une dépendance tierce et simplifierait un usage hors réseau. Ce n'est pas un bloqueur du jeu.

---

## Licence

Aucun fichier `LICENSE` n'est présent dans l'arbre audité.

Si la réutilisation ou contribution externe est souhaitée, choisir une licence explicite. Sinon le dépôt peut rester public sans promettre de droit de réutilisation.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que `million-de-pixels` :

- transforme une image en plateau logique 1024 × 1024, soit 1 048 576 cellules ;
- ne crée pas un million de sprites/colliders ;
- utilise TypedArrays et index spécialisés ;
- utilise PixiJS/WebGL2 pour projeter le plateau ;
- quantifie l'image dans un worker ;
- possède un système de combat basé sur la surface réellement exposée ;
- possède upgrades, spécialisations, doctrines, campagne, galerie et progression permanente ;
- stocke les parties dans IndexedDB avec migrations v1→v6 ;
- ne sauvegarde pas le fichier source importé ;
- applique après restauration une reprise offline analytique qui détruit de vraies cellules ;
- utilise un PRNG déterministe versionné ;
- possède une importante suite de tests unitaires et un smoke E2E sur build de production ;
- est déployé sur GitHub Pages, avec le dernier workflow de la révision auditée réussi.

## À ne pas sur-vendre

- « la simulation continue correctement quelle que soit la mise en arrière-plan » : faux actuellement ;
- « l'offline rejoue exactement les trajectoires » : faux ;
- « tests exécutés à chaque mise en production » : faux actuellement ;
- « fonctionne sur tous les navigateurs » : plusieurs APIs modernes sont requises ;
- « campagne librement redistribuable » tant que la provenance des assets n'est pas documentée.

---

## Plan de remédiation

1. **Corriger `hidden → visible`** avec catch-up du monde courant.
2. Ajouter un test automatisé de ce cycle de vie.
3. Faire passer `npm test` avant tout déploiement Pages.
4. Faire passer un smoke E2E production avant déploiement ou sur chaque PR/main.
5. Résoudre les écritures IndexedDB sur `transaction.oncomplete`.
6. Documenter la provenance/licence des 56 images de campagne.
7. Ajouter une licence au dépôt si la réutilisation doit être permise.
8. Auto-héberger les polices.
9. Faire une recette réelle sur quelques appareils mobiles représentatifs.

## Décision finale

**Conserver dans Labz avec un statut public/testable.**

C'est l'un des projets techniquement les plus démonstratifs du portefeuille : il part d'une idée volontairement extrême — jouer avec un million de cellules — et la rend raisonnable par des choix de représentation, d'indexation, de rendu et de simulation cohérents.

La priorité n'est pas de le réécrire. Elle est de **fermer le trou de cycle idle et de brancher la qualité existante sur la CI**, afin que la présentation Labz puisse s'appuyer non seulement sur un code fort, mais sur une chaîne de livraison qui prouve en permanence que le vertical slice reste jouable.