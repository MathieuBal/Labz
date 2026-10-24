# Audit pré-intégration Labz — Million de pixels

**Dépôt audité :** `MathieuBal/million-de-pixels`  
**Révision :** `8ac4ecfe75ec75a19cf1792c8ab85b366955a5dd`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · projet public/testable et techniquement solide ; renforcer la CI et clarifier les droits des assets de campagne**

## Verdict

`million-de-pixels` est l'un des projets techniquement les plus aboutis du portfolio actuel.

Sa promesse centrale est réelle : une image est quantifiée puis transformée en un plateau logique de **1 048 576 cellules**. Le million de pixels n'est pas représenté par un million d'objets graphiques : l'état repose sur des `TypedArray`, des index dérivés et une texture GPU. Le combat, l'économie, la reprise hors-ligne, la persistance et les migrations sont séparés en modules distincts.

Le projet possède une suite de tests unitaires importante et surtout un smoke E2E Playwright qui tourne sur le **build de production** servi par `vite preview`. Ce smoke couvre le parcours principal, des invariants de gameplay, la performance, la persistance, la fin d'une toile et plusieurs layouts tactiles.

Le dernier déploiement GitHub Pages de la révision auditée est vert.

Le principal écart qualité n'est donc pas l'absence de tests mais le fait que **la CI de déploiement ne les exécute pas** : elle fait `npm ci`, `npm run build`, puis publie `dist/`. Une régression fonctionnelle peut donc partir en production tant que TypeScript compile.

Le projet peut rester présenté dans Labz comme **prototype de jeu navigateur réellement jouable et techniquement ambitieux**.

---

## Ce qui existe réellement

### Un million de cellules, sans un million d'objets

`PixelWorld` impose des buffers de taille exacte `PIXEL_COUNT` et stocke notamment :

- `baseColorId` ;
- `colorId` ;
- `hp` ;
- `flags`.

Les index de couleurs, macro-tuiles et surface sont dérivés puis tenus à jour lors des destructions.

La destruction d'une cellule met à jour l'état logique et les index, marque le monde comme modifié et peut notifier le rendu. Les recherches de pixels par couleur s'appuient sur `ColorIndex` au lieu de parcourir systématiquement le million de cellules.

Cette architecture justifie l'affirmation principale du README : le million de pixels est une structure de données, pas un million de sprites ou colliders.

### Pipeline d'image

Le dépôt sépare le traitement d'image du thread principal :

- worker d'image ;
- resize / `OffscreenCanvas` ;
- histogramme ;
- quantification ;
- Median Cut ;
- k-means optionnel ;
- mapping vers les identifiants de couleur.

Le code de détection refuse de lancer silencieusement une version structurellement dégradée lorsque WebGL2, Web Workers, `OffscreenCanvas` ou `createImageBitmap` manquent.

IndexedDB est traité différemment : son absence retire la persistance mais n'est pas considérée comme un prérequis graphique fondamental.

### Combat / rail

Le dépôt contient des composants séparés pour :

- canons actifs ;
- files de canons ;
- réserves de munitions par couleur ;
- simulation de combat ;
- traversée axiale ;
- effets spéciaux ;
- index de surface ;
- rendu des canons et impacts.

Le smoke E2E vérifie notamment l'invariant selon lequel un tir ne détruit jamais plus d'un bloc ordinaire, le nombre maximum de canons simultanés et le fait que plusieurs canons tournent effectivement ensemble.

### Reprise hors-ligne

La reprise hors-ligne est une vraie simulation analytique, pas un simple compteur de monnaie.

`simulateOffline()` :

- borne le temps d'absence ;
- convertit la production par couleur en nombre de hits ;
- conserve les fractions de hit entre sessions ;
- utilise un PRNG déterministe ;
- supprime réellement des pixels dans `colorId` ;
- ne touche pas les zones `VOID` ;
- redistribue les hits d'une couleur épuisée vers les couleurs encore vivantes ;
- s'arrête proprement si le plateau est entièrement vidé.

Les tests unitaires couvrent :

- le nombre attendu de destructions ;
- la suppression réelle des pixels ;
- la reproductibilité byte-identique ;
- l'équivalence entre une longue absence et plusieurs absences courtes ;
- la conservation des fractions ;
- la borne de durée ;
- une horloge système qui recule ;
- les zones `VOID` ;
- le spill ;
- la fin complète du plateau.

C'est une des parties les mieux vérifiées du projet.

### Persistance et migrations

La persistance utilise IndexedDB avec des buffers stockés comme `ArrayBuffer` via structured clone.

Le dépôt possède une chaîne explicite de migrations jusqu'au schéma de save v6. Chaque version est transformée étape par étape et les sauvegardes non reconnues sont rejetées au lieu d'être chargées partiellement.

La validation finale contrôle notamment la présence des champs requis et la taille des buffers.

Le smoke E2E recharge réellement la page et vérifie que :

- le niveau revient depuis IndexedDB ;
- le nombre de pixels vivants ne remonte pas ;
- les améliorations achetées survivent au rechargement.

### Progression

La progression ne se limite plus au vertical slice initial : le dépôt contient notamment :

- upgrades par toile ;
- progression permanente ;
- doctrines ;
- campagne ;
- galerie d'images ;
- bibliothèque / nuancier ;
- milestones ;
- capacités et automatisation.

Le smoke E2E vérifie plusieurs de ces parcours : familles d'améliorations, achats par lots, verrouillage de capacités, récompense de fin de toile, crédit des éclats permanents et catalogue de teintes.

---

## Validation existante

### Tests unitaires

`npm test` lance Vitest. Le README annonce 101 tests unitaires et l'arbre contient une vingtaine de fichiers de tests couvrant notamment :

- monde ;
- surface ;
- combat ;
- canons ;
- traversée ;
- RNG ;
- quantification ;
- offline ;
- persistance ;
- upgrades ;
- progression permanente ;
- campagne ;
- viewport ;
- effets spéciaux.

Le niveau de couverture fonctionnelle est élevé pour un prototype de jeu personnel.

### Smoke E2E sur le build de production

`tests/e2e/smoke.mjs` démarre `vite preview`, donc teste bien le bundle construit et non le serveur de développement.

Il couvre notamment :

- compatibilité de démarrage ;
- import et quantification d'une image ;
- démarrage explicite de la partie ;
- plateau allant jusqu'à 1 048 576 cellules ;
- rail / cartes / canons ;
- invariants de destruction ;
- zoom et recadrage ;
- budget de simulation inférieur à 4 ms/frame dans son environnement de référence ;
- économie et upgrades ;
- achats par lots ;
- sortie / recommencer / changer d'image ;
- confirmation avant action destructive ;
- sauvegarde/rechargement IndexedDB ;
- fin d'une toile ;
- récompense permanente ;
- bibliothèque de couleurs ;
- layouts tactiles.

C'est une vraie preuve navigateur, nettement plus forte qu'une simple capture ou qu'un test DOM superficiel.

### Déploiement

GitHub Pages construit avec :

1. `npm ci` ;
2. `npm run build` ;
3. upload de `dist/` ;
4. déploiement Pages.

`npm run build` exécute `tsc --noEmit && vite build`.

Le dernier workflow de la révision auditée est en succès.

---

## P1 — les tests ne bloquent pas le déploiement

Le workflow Pages ne lance ni :

- `npm test` ;
- `npm run e2e`.

C'est le principal défaut de chaîne de livraison.

Le projet possède précisément les tests qui permettraient de protéger ses invariants sensibles ; ne pas les brancher dans la CI réduit fortement leur valeur comme garde-fou.

### Remédiation recommandée

Ajouter avant le déploiement :

1. `npm ci` ;
2. `npm test` ;
3. `npm run build` ;
4. installation de Chromium Playwright ;
5. `npm run e2e` ;
6. déploiement seulement si tout est vert.

Si le smoke complet est trop coûteux, séparer :

- PR : tests unitaires + smoke court ;
- `main` / nightly : smoke complet + benchmark.

---

## P1 — provenance et droits des 56 images de campagne à documenter

Le dépôt public embarque **56 images PNG de campagne**, souvent entre environ 1 et 4 Mo chacune. Elles expliquent l'essentiel des ~92 Mo du dépôt.

Le code décrit leur rôle et leur difficulté mesurée, mais l'audit n'a trouvé ni :

- fichier de licence global ;
- notice de provenance pour ces images ;
- attribution ou conditions de réutilisation associées aux assets de campagne.

Cela ne prouve pas un problème de droits ; cela signifie simplement que la provenance n'est pas documentée dans le dépôt.

Avant une diffusion plus large ou une présentation comme pack réutilisable, documenter pour chaque série d'assets si elle est :

- créée par le projet ;
- générée ;
- sous licence compatible ;
- ou seulement destinée à la démonstration.

Si les images ne doivent pas être réutilisées, le préciser explicitement.

---

## P2 — poids du dépôt

Les 56 PNG rendent le dépôt très lourd par rapport au code lui-même.

Ce n'est pas un problème fonctionnel pour GitHub Pages, mais c'est une dette de maintenance :

- clones plus lourds ;
- historique Git qui grossit vite en cas de remplacement d'images ;
- déploiements plus volumineux ;
- cache navigateur plus coûteux si tout est chargé ou précaché.

### Remédiation possible

Selon le besoin :

- convertir certains assets en WebP/AVIF si la qualité le permet ;
- conserver une résolution source hors dépôt et ne versionner que les variantes web ;
- éviter de remplacer fréquemment les gros fichiers binaires dans Git ;
- séparer à terme le pack de campagne du cœur du jeu si le catalogue continue de grossir.

Pas de réécriture nécessaire aujourd'hui.

---

## P2 — quelques limites structurelles à présenter honnêtement

### WebGL2 obligatoire

Le prototype dépend structurellement de WebGL2, Workers, `OffscreenCanvas` et `createImageBitmap`.

C'est un choix assumé du code, pas un bug. Labz doit donc parler de **prototype navigateur moderne**, pas de compatibilité universelle.

### IndexedDB non garanti

Le jeu peut fonctionner sans IndexedDB, mais la persistance est alors perdue. Le code traite ce cas comme une capacité manquante plutôt qu'un crash.

### Benchmark dépendant de l'environnement

Le smoke impose un objectif de simulation `< 4 ms/frame` dans Chromium/SwiftShader. C'est un bon invariant de non-régression dans cet environnement, mais ce n'est pas une preuve que tous les téléphones ou GPU réels tiendront ce budget.

Labz peut dire que le projet possède un benchmark navigateur automatisable, pas garantir une performance uniforme sur tous les appareils.

---

## Petite dette de persistance

`SaveRepository.open()` mémorise sa promesse d'ouverture IndexedDB. Si cette première ouverture échoue ou est bloquée, la promesse rejetée reste en cache pour la durée de la page.

Ce comportement est acceptable pour un prototype — un reload réinitialise l'instance — mais une version plus robuste pourrait remettre `dbPromise` à `null` après échec afin d'autoriser une nouvelle tentative sans rechargement complet.

Priorité faible.

---

## Licence du code

Aucun fichier `LICENSE` n'apparaît dans l'arbre audité.

Comme pour les assets, une licence explicite est recommandée si le but est d'autoriser la réutilisation, l'étude ou la contribution externe. Sinon, le dépôt public reste visible mais tous les droits restent réservés par défaut.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que `million-de-pixels` :

- est un idle/roguelite navigateur fondé sur un plateau logique de **1 048 576 cellules** ;
- transforme une image importée en monde quantifié ;
- évite un objet graphique/physique par pixel ;
- utilise `TypedArray`, index dérivés et texture GPU ;
- sépare calculs lourds via Web Workers ;
- possède un système de combat autour de canons circulant sur le cadre ;
- possède une progression par améliorations, doctrines et campagne ;
- possède une persistance IndexedDB versionnée avec migrations ;
- possède une vraie reprise hors-ligne supprimant des pixels réels ;
- possède un PRNG déterministe pour les reprises ;
- possède une suite de tests unitaires importante ;
- possède un smoke Playwright sur le build de production ;
- possède un déploiement GitHub Pages actuellement vert.

## Ce qu'il vaut mieux ne pas sur-vendre

- « tous les tests passent à chaque déploiement » : faux actuellement, ils ne sont pas lancés par la GitHub Action Pages ;
- « fonctionne sur tous les navigateurs » : faux, plusieurs API modernes sont structurelles ;
- « performance garantie sur mobile » : non démontré par un panel d'appareils réels ;
- « campagne librement réutilisable » : droits/provenance des images non documentés ;
- « produit fini » : le dépôt et le README parlent eux-mêmes de prototype / vertical slice étendu.

---

## Plan de remédiation court

1. Faire exécuter `npm test` par la CI.
2. Faire exécuter au moins un smoke Playwright avant le déploiement Pages.
3. Conserver le smoke complet/benchmark en nightly si nécessaire.
4. Documenter la provenance et les droits des 56 images de campagne.
5. Ajouter une licence explicite pour le code si la réutilisation doit être permise.
6. Réduire progressivement le poids des assets web si le pack continue à grandir.
7. Faire une recette réelle sur quelques appareils mobiles représentatifs.
8. Optionnel : permettre une nouvelle tentative IndexedDB après échec sans recharger toute la page.

## Décision finale

**`million-de-pixels` reste dans Labz et peut conserver un statut public/testable.**

Il n'a pas besoin d'une réécriture pour être défendable : ses choix d'architecture sont cohérents avec le problème, les systèmes centraux sont réellement implémentés, la reprise hors-ligne est particulièrement bien testée et le smoke E2E couvre un parcours inhabituellement large pour un prototype personnel.

La priorité est désormais de **faire correspondre la chaîne de livraison au niveau de qualité déjà présent dans le dépôt** : les tests existent, il faut les rendre obligatoires avant publication. En parallèle, la campagne doit gagner une vraie documentation de provenance/licence pour que la partie artistique soit aussi proprement cadrée que la partie technique.