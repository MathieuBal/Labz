# Audit complet du portefeuille GitHub

**Snapshot initial : 24 octobre 2026**

Objectif : cartographier tous les dépôts GitHub appartenant à Mathieu, y compris les dépôts privés, les essais, les projets d’étude, les prototypes abandonnés et les dépôts qui ne figurent pas dans Labz.

Ce document n’est pas une liste de projets à publier. Il sert à décider consciemment ce qui mérite d’être :

- présenté dans Labz ;
- conservé sur GitHub hors Labz ;
- archivé comme historique ;
- fusionné avec un autre projet ;
- supprimé parce qu’il n’a réellement plus aucune valeur.

## Règle de décision

La suppression est le dernier niveau, pas le défaut.

| Décision | Sens |
| --- | --- |
| **Labz** | projet ou expérience qui mérite une fiche et une présentation honnête |
| **GitHub seulement** | code, outil personnel, expérimentation ou référence utile mais sans intérêt pour la vitrine |
| **Archiver** | projet terminé, raté ou obsolète dont l’historique reste utile |
| **Fusionner** | doublon ou ancien projet dont une partie mérite d’être absorbée ailleurs |
| **Supprimer** | dépôt vide, accidentel, doublon sans valeur, ou contenu dont Mathieu confirme qu’il n’a aucun intérêt historique ou réutilisable |

Avant une suppression, vérifier au minimum qu’il n’existe pas de lien public utile, de donnée irremplaçable, de dépendance d’un autre projet ou de raison personnelle de conserver l’historique.

## Inventaire brut

GitHub retourne **31 dépôts appartenant à Mathieu**, Labz compris. La colonne `Taille GitHub` reprend l’indicateur de taille fourni par l’API GitHub ; elle sert uniquement à repérer les dépôts vides ou très petits.

| Dépôt | Visibilité | Taille GitHub | Relation actuelle avec Labz | État d’audit |
| --- | --- | ---: | --- | --- |
| `Labz` | public | 605 | plateforme elle-même | garder |
| `Sensoria` | public | 679 | Labz · actif | garder Labz |
| `million-de-pixels` | public | 92 468 | Labz · actif | garder Labz |
| `Lootchest` | public | 104 483 | Labz · actif | garder Labz |
| `diagnostic-numerique` | public | 250 | Labz · actif | garder Labz |
| `Perfoptimize` | public | 568 | Labz · actif | garder Labz |
| `Pipboy` | public | 9 730 | Labz · actif | garder Labz |
| `constella` | privé | 4 188 | Labz · Explore + Watch | garder · en pause |
| `chess-vision-trainer` | privé | 10 642 | Labz · présentation | **décision recommandée : sortir de Labz puis archiver** |
| `equiperota` | public | 156 | correspond à l’exploration AtelierFlow | **à garder comme essai, présence Labz à reconsidérer** |
| `afk-farm` | public | 315 | hors Labz | à qualifier |
| `Antsimu` | privé | 1 130 | hors Labz | à qualifier |
| `ball-passing-simulation` | public | 8 | hors Labz | à qualifier |
| `botlecturevlc` | public | 12 | hors Labz | à qualifier |
| `ClicReflex` | public | 7 | hors Labz | **prototype Python antérieur · à archiver** |
| `Clicreflexe` | public | 11 | hors Labz | **activité pédagogique web · candidat Labz** |
| `Crimson-s-Blade` | privé | 12 238 | hors Labz | à qualifier |
| `DeezerInfo` | public | 21 | hors Labz | à qualifier |
| `discortbotsaloon` | public | 550 | hors Labz | à qualifier |
| `EcoRide` | public | 400 | hors Labz | **projet Studi interrompu · à archiver** |
| `gta-blackjack-assistant` | privé | 43 | hors Labz | à qualifier |
| `HFTrain` | privé | **0** | hors Labz | **suppression recommandée · idée de simulateur/replay de marché conservée dans l’audit** |
| `HotzDoggz-bot` | public | 599 | hors Labz | à qualifier |
| `Ilia` | privé | 1 454 | hors Labz | à qualifier |
| `OpenclassroomProject2` | public | 40 851 | hors Labz | **décision : archiver · exercice OpenClassrooms terminé** |
| `STUDI_Projet_fil_rouge` | public | 299 | hors Labz | **formation Studi interrompue · à archiver** |
| `sudoku-solver` | public | 15 | hors Labz | à qualifier |
| `Totalwarai` | public | 1 792 | hors Labz | à qualifier |
| `Tricat` | public | 15 | hors Labz | à qualifier |
| `Zepevents` | privé | 129 | hors Labz | à qualifier |
| `ZepRasso` | public | 327 | hors Labz | à qualifier |

## Premières décisions fondées sur le contexte de Mathieu

### Chess Vision Trainer

Contexte Mathieu : l’idée d’entraîner la vision tactique aux échecs reste intéressante, mais l’application réalisée n’a jamais réellement fonctionné et l’expérience obtenue était très moyenne, voire inutile.

**Recommandation :**

- retirer la fiche de la sélection active Labz ;
- ne pas investir dans la remise en état de cette implémentation ;
- archiver le dépôt plutôt que le supprimer immédiatement, afin de conserver l’historique ;
- si l’idée revient un jour, repartir d’un problème utilisateur et d’un prototype neuf plutôt que de considérer ce code comme une base produit.

### AtelierFlow / `equiperota`

Contexte Mathieu : le projet vient d’une réflexion autour de la pertinence de la gestion et de la répartition par les chefs à l’atelier. Il s’agit davantage d’un essai pour explorer cette réflexion que d’une vraie intention de développement produit.

**Recommandation :**

- conserver le dépôt comme expérimentation / preuve de réflexion ;
- ne pas le traiter comme produit actif ;
- reconsidérer sa présence dans le catalogue Labz : il a davantage sa place dans une future rubrique `Explorations` que parmi les projets auxquels on promet une évolution ;
- ne pas le supprimer tant que la réflexion métier reste intéressante.

### HFTrain

Contexte Mathieu : idée ancienne autour du trading haute fréquence, soit comme outil automatisé, soit comme simulateur/replay de marché permettant de s’entraîner sans argent réel.

Le dépôt GitHub est vide. Le concept le plus réutilisable n’est pas le HFT automatisé mais éventuellement un **simulateur ou replay de marché** sans risque financier.

**Décision : suppression recommandée du dépôt**, sous réserve d’un feu vert explicite de Mathieu avant action destructive. L’idée résiduelle est conservée ici ; si elle revient, repartir sur un nouveau projet propre.

### OpenclassroomProject2

Contexte Mathieu : exercice OpenClassrooms réalisé pour valider une étape de formation. Le dépôt contient le livrable technique autour du scraping de Books to Scrape ; il n’a jamais été destiné à devenir un produit.

**Décision : archiver le dépôt GitHub et le laisser hors Labz.**

Motif : conserver une trace d’apprentissage et un exercice technique complet, sans entretenir l’illusion d’un projet actif.

### STUDI_Projet_fil_rouge

Contexte Mathieu : projet de formation Studi autour du site fictif de restaurant Quai Antique. La formation n’a finalement pas pu être suivie jusqu’au bout.

**Décision : archiver le dépôt GitHub et le laisser hors Labz.**

Motif : le dépôt garde une valeur comme trace de conception et d’apprentissage, mais il ne correspond pas à un produit personnel à maintenir.

### EcoRide

Contexte Mathieu : autre projet Studi, construit dans le cadre de la formation et non comme initiative produit personnelle.

**Décision : archiver le dépôt GitHub et le laisser hors Labz.**

### ClicReflex / Clicreflexe

Contexte Mathieu : une première version Python/Pygame a probablement servi de test. Pour rendre l’activité réellement accessible aux membres des ateliers, la même idée a ensuite été portée en version web.

La finalité n’est pas simplement de mesurer la vitesse de clic : il s’agit d’un **support d’animation pédagogique ludique**, utilisé ou utilisable dans des ateliers autour de la mémoire et du développement des compétences.

**Décision :**

- `ClicReflex` Python : archiver comme prototype technique antérieur ;
- `Clicreflexe` web : conserver comme version de référence ;
- considérer `Clicreflexe` comme **candidat à intégrer au Labz**, avec une présentation centrée sur son contexte d’usage en médiation/atelier et non comme simple mini-jeu ;
- si intégré, expliquer clairement que l’objectif est de proposer une activité ludique complémentaire aux exercices classiques d’atelier.

## Projets d’étude

Mathieu indique que certains dépôts ont été créés uniquement pour des études, parfois sans véritable code poussé.

Règle proposée :

- dépôt vide ou quasi vide sans contenu personnel utile → suppression possible après confirmation ;
- exercice terminé avec code montrant une étape d’apprentissage → archivage plutôt que Labz ;
- projet d’étude ayant donné naissance à une vraie idée ou à une brique réutilisée ailleurs → conserver avec cette filiation documentée.

Les projets désormais identifiés comme scolaires sont `OpenclassroomProject2`, `STUDI_Projet_fil_rouge` et `EcoRide`.

## Ordre de revue proposé

La revue se fait **un dépôt à la fois**, avec le contexte de Mathieu avant décision définitive.

1. `HFTrain` — décision : suppression recommandée, en attente de feu vert explicite ;
2. `OpenclassroomProject2` — décision : archiver ;
3. `STUDI_Projet_fil_rouge` — décision : archiver ;
4. `EcoRide` — décision : archiver ;
5. `ClicReflex` — décision : archiver ; `Clicreflexe` — conserver, candidat Labz ;
6. `chess-vision-trainer` — contexte déjà fourni, décision presque complète ;
7. `equiperota` / AtelierFlow — contexte déjà fourni ;
8. projets privés inconnus : `Antsimu`, `Crimson-s-Blade`, `Ilia` ;
9. outils / bots RP : `discortbotsaloon`, `HotzDoggz-bot`, `ZepRasso`, `Zepevents`, `gta-blackjack-assistant` ;
10. petits projets et utilitaires : `ball-passing-simulation`, `botlecturevlc`, `DeezerInfo`, `sudoku-solver`, `Tricat`, `afk-farm` ;
11. `Totalwarai` et les autres projets spécialisés restants.

## Fiche de revue utilisée pour chaque dépôt

Pour éviter les décisions arbitraires, chaque projet sera résumé avec :

- **Pourquoi il a été créé** — le besoin ou la curiosité d’origine ;
- **Ce qui existe réellement** — vide, prototype, application fonctionnelle, données, documentation ;
- **Est-ce que ça a déjà été utile ?** ;
- **Valeur actuelle** — usage, apprentissage, réutilisation, valeur personnelle ou démonstrative ;
- **Coût de reprise** — faible / moyen / élevé ;
- **Décision** — Labz / GitHub seulement / archiver / fusionner / supprimer ;
- **Action** — rien, documenter, retirer du catalogue, archiver ou supprimer.

Ce fichier doit évoluer au fil des échanges avec Mathieu. Aucune décision de suppression n’est considérée définitive tant que son contexte n’a pas été ajouté.
