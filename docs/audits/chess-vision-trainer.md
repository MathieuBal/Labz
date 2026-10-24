# Audit pré-intégration Labz — Chess Vision Trainer

**Dépôt audité :** `MathieuBal/chess-vision-trainer`  
**Révision :** `e3b0ab4ffe23da3c6919b39d029f17c49fff0357`  
**Date :** 24 octobre 2026  
**Statut proposé :** **sortir du catalogue Labz actif · conserver/archiver le dépôt comme expérimentation technique et pédagogique**

## Verdict

`chess-vision-trainer` est un cas important où **la qualité d'implémentation ne suffit pas à justifier une place dans le catalogue Labz**.

Le dépôt est techniquement sérieux : React/TypeScript, moteur d'analyse échiquéenne maison pour plusieurs calques, Stockfish 18 WASM dans un Web Worker, 147 tests annoncés, tests de composants, scripts de smoke navigateur et documentation détaillée.

Mais le besoin utilisateur principal n'est pas réellement validé. Le produit voulait aider à « voir » le plateau et entraîner la reconnaissance tactique ; dans l'usage réel rapporté par son auteur, l'application s'est révélée **moyenne voire inutile** et n'a jamais fourni la valeur pédagogique espérée.

L'audit du code explique en partie cet écart : beaucoup de calques sont des **heuristiques visuelles simplifiées**, pas une compréhension complète de la position. La reconnaissance depuis screenshot est également une pipeline artisanale calibrée sur des hypothèses très fragiles de contraste/glyphes.

Le projet ne doit donc pas être présenté dans Labz comme outil d'entraînement échiquéen abouti ou validé.

La bonne décision n'est pas nécessairement de supprimer le dépôt : il reste une expérimentation technique intéressante autour de la visualisation, de Stockfish/WASM et d'une tentative de computer vision légère. Mais il doit sortir de la vitrine principale.

---

## Ce qui fonctionne réellement

### FEN et représentation de plateau

Le projet parse une FEN et construit une représentation du plateau sur laquelle sont calculés plusieurs ensembles :

- attaques / contrôle de cases ;
- pièces défendues ;
- pièces attaquées ;
- pièces dites pendantes ;
- tensions ;
- zone du roi ;
- danger autour du roi ;
- clouages ;
- enfilades ;
- cases de fourchette ;
- défenseurs surchargés ;
- lignes de vue.

Ces informations sont réellement calculées et rendues par des calques cumulables.

### Mode entraînement

L'application possède bien une boucle :

- prédire des cases ;
- révéler le résultat ;
- calculer précision/rappel/F1 ;
- conserver l'historique local.

La mécanique est implémentée, mais son efficacité pédagogique n'est pas démontrée par le code ni par l'usage réel.

### Stockfish

L'intégration Stockfish est l'une des parties les plus solides du projet :

- Stockfish 18 lite single-thread ;
- WASM copié au `postinstall` ;
- Web Worker ;
- protocole UCI ;
- MultiPV ;
- évaluation et meilleur coup ;
- nettoyage du Worker ;
- smoke navigateur dédié.

Le smoke moteur lance réellement le build, clique « Analyser » et attend une réponse Stockfish à profondeur suffisante.

Ce bloc constitue une vraie réussite technique, mais il ne valide pas automatiquement la pertinence des explications pédagogiques ajoutées autour du moteur.

---

## Limite centrale : les calques ne sont pas un moteur échiquéen

`attacksFromPiece()` calcule des **cases contrôlées** et non des coups légaux complets. C'est volontaire et cohérent pour certains calques.

Le problème apparaît lorsque cette logique est utilisée pour produire des concepts pédagogiques plus riches.

### « Pièce pendante »

Dans `analysis.ts`, une pièce est dite pendante lorsque :

- elle est attaquée ;
- aucun attaquant ami ne couvre sa case.

Cela ne prend pas en compte :

- légalité réelle de la capture ;
- pièce attaquante clouée ;
- séquence de recaptures ;
- valeur relative des échanges ;
- tactiques intermédiaires ;
- position du roi après capture.

C'est un signal visuel simple, pas une évaluation tactique complète.

### Fourchettes

`findForkSquares()` indique explicitement dans son commentaire qu'il s'agit d'une **heuristique** qui ne vérifie pas la légalité : clouages, contraintes de roi, roque, en passant, etc.

Une case peut donc être marquée comme opportunité visuelle sans qu'un vrai coup légal/pertinent existe dans la position.

### Clouages / enfilades / surcharge

Ces systèmes reposent essentiellement sur :

- géométrie des rayons ;
- couleur ;
- valeur matérielle ;
- nombre de pièces défendues/attaquées.

Ils sont intéressants comme visualisations, mais ne constituent pas un analyseur tactique équivalent à un moteur d'échecs.

### Conséquence produit

Le projet peut facilement donner une impression de sophistication visuelle tout en soulignant des motifs qui ne sont pas les facteurs réellement importants du coup.

C'est probablement l'une des raisons du ressenti d'inutilité : **voir davantage de calques ne veut pas forcément dire mieux comprendre la position**.

---

## Reconnaissance de screenshot : expérimentation, pas fonctionnalité robuste

La pipeline `src/vision/` est ingénieuse mais très simplifiée.

### Méthode réelle

Par case :

1. crop central à 70 % ;
2. conversion grayscale ;
3. variance pour estimer vide/occupé ;
4. médiane + pixels plus clairs/sombres pour déduire blanc/noir ;
5. fingerprint ;
6. corrélation avec six templates de glyphes Unicode du camp supposé ;
7. meilleur score = type de pièce.

### Hypothèses fragiles

La méthode dépend fortement :

- du contraste des pièces ;
- du contraste des cases ;
- de la ressemblance avec les glyphes servant de templates ;
- de l'absence de thèmes très stylisés ;
- de la qualité du crop ;
- des overlays éventuels sur les captures.

Le README reconnaît déjà que certains jeux de pièces conduisent à des erreurs de couleur.

### Le smoke vision ne mesure pas la robustesse réelle

`scripts/vision-smoke.mjs` :

1. demande à l'application de rendre elle-même une position ;
2. screenshot son propre board ;
3. réimporte cette image ;
4. lance son classifieur.

Le fichier précise explicitement qu'il s'agit d'un **best-case scenario** utilisant la même famille de glyphes que les templates et que le classifieur « doesn't need to be perfect ».

C'est un bon test du câblage UI, mais pas un benchmark de reconnaissance sur des captures externes.

### Ce qu'il aurait fallu pour valider la fonction

Un vrai corpus annoté :

- Lichess plusieurs thèmes/pièces ;
- Chess.com plusieurs sets ;
- différentes résolutions ;
- coordonnées visibles/masquées ;
- orientation blanche/noire ;
- compression JPEG ;
- captures mobiles ;
- overlays / flèches.

Puis mesurer précision par case et FEN exact complet.

Ce travail n'existe pas dans le dépôt audité.

---

## Tests : bonne couverture du code, pas validation du produit

Le dépôt contient de nombreux tests Vitest/Testing Library couvrant :

- FEN ;
- attaques ;
- analyse ;
- king zone ;
- lignes de vue ;
- tactiques ;
- layers ;
- composants ;
- moteur/UCI ;
- vision ;
- explications.

Le README annonce 147 tests.

C'est une vraie qualité d'ingénierie.

Mais ces tests vérifient principalement que **l'algorithme fait ce qu'il a été conçu pour faire**. Ils ne démontrent pas que les heuristiques choisies enseignent correctement la vision échiquéenne.

C'est une distinction importante pour Labz.

---

## Pas de CI versionnée

Aucun workflow `.github/workflows` n'apparaît dans l'arbre audité.

Les derniers commits documentent des vérifications locales : build, tests et smoke moteur, mais ces validations ne sont pas imposées automatiquement à chaque changement.

Si le projet était repris, une CI simple pourrait exécuter :

- `npm ci` ;
- lint ;
- tests ;
- build ;
- smoke Stockfish.

Ce n'est toutefois pas la priorité : le problème majeur est le **produit**, pas la CI.

---

## README trop convaincant par rapport à la validation réelle

Le README est très complet et les captures donnent une forte impression de produit abouti.

La plupart des fonctionnalités annoncées existent techniquement.

Mais la documentation mélange parfois :

- existence d'un calque ;
- exactitude échiquéenne ;
- intérêt pédagogique.

Or ce sont trois choses différentes.

Une future reprise devrait d'abord définir une hypothèse pédagogique testable, par exemple :

> « Après 10 sessions, un joueur identifie plus vite les pièces non défendues sur une position réelle. »

Puis mesurer cela avec de vrais utilisateurs avant d'ajouter de nouveaux calques.

---

## Ce qui reste intéressant dans le dépôt

Même hors Labz actif, plusieurs briques restent dignes d'être conservées :

- intégration Stockfish WASM/Web Worker ;
- parsing UCI ;
- visualisation multi-calques ;
- interaction SVG/board ;
- boucle prediction/reveal/scoring ;
- tentative de reconnaissance légère sans modèle ML ;
- discipline de tests unitaires.

Le dépôt a donc davantage de valeur comme **expérimentation technique historique** que comme produit à montrer aux visiteurs.

---

## Présentation Labz

### Décision recommandée

**Retirer Chess Vision Trainer du catalogue actif Labz.**

Ne pas créer une fiche « projet cassé » dans la vitrine principale uniquement pour préserver le volume du portfolio.

Si Labz possède un jour une section « Explorations / Archives », une mention courte pourrait être acceptable :

> Expérimentation autour de la lecture visuelle d'un échiquier : calques tactiques, entraînement prédictif, Stockfish WASM et prototype de reconnaissance de screenshots. Projet arrêté après constat que l'expérience n'apportait pas la valeur pédagogique attendue.

Cette formulation est beaucoup plus forte et honnête que la présentation actuelle comme outil d'entraînement.

---

## Si l'idée revenait un jour

Ne pas continuer simplement le code actuel.

Repartir du problème utilisateur :

1. choisir **une seule compétence** à entraîner ;
2. constituer des positions validées par moteur/coach ;
3. faire un prototype extrêmement simple ;
4. mesurer les erreurs et le temps de réponse d'un joueur ;
5. comparer avant/après plusieurs sessions ;
6. n'ajouter des visualisations que si elles améliorent cette métrique ;
7. pour l'import screenshot, utiliser un corpus réel et une reconnaissance adaptée plutôt que des templates Unicode.

L'intégration Stockfish et certaines briques UI pourraient éventuellement être réutilisées, mais le produit devrait être repensé.

## Décision finale

**Sortir de Labz actif et archiver/conserver le dépôt GitHub comme expérimentation.**

Le code est trop travaillé pour être qualifié de « projet nul » : plusieurs briques sont techniquement réussies. Mais l'audit confirme le point essentiel donné par l'expérience utilisateur de son auteur : **l'application n'a pas démontré qu'elle aidait réellement à mieux jouer ou mieux voir un échiquier**.

Dans un portfolio exigeant, ce constat prime sur le nombre de fonctionnalités et de tests.