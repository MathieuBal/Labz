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
| `Antsimu` | privé | 1 130 | hors Labz | **GitHub seulement · fork expérimental privé à conserver** |
| `ball-passing-simulation` | public | 8 | hors Labz | à qualifier |
| `botlecturevlc` | public | 12 | hors Labz | à qualifier |
| `ClicReflex` | public | 7 | hors Labz | **prototype Python antérieur · à archiver** |
| `Clicreflexe` | public | 11 | hors Labz | **activité pédagogique web · candidat Labz** |
| `Crimson-s-Blade` | privé | 12 238 | hors Labz | **projet réellement utilisé · candidat fort Labz** |
| `DeezerInfo` | public | 21 | hors Labz | à qualifier |
| `discortbotsaloon` | public | 550 | hors Labz | **première génération RP réellement utilisée · conserver comme historique de l’écosystème** |
| `EcoRide` | public | 400 | hors Labz | **projet Studi interrompu · à archiver** |
| `gta-blackjack-assistant` | privé | 43 | hors Labz | **expérimentation personnelle GTA RP · à archiver** |
| `HFTrain` | privé | **0** | hors Labz | **suppression recommandée · idée de simulateur/replay de marché conservée dans l’audit** |
| `HotzDoggz-bot` | public | 599 | hors Labz | **mis en service · ~40 utilisateurs / ~15 jours · candidat fort Labz groupé** |
| `Ilia` | privé | 1 454 | hors Labz | **ancien assistant vocal Python · à archiver** |
| `OpenclassroomProject2` | public | 40 851 | hors Labz | **décision : archiver · exercice OpenClassrooms terminé** |
| `STUDI_Projet_fil_rouge` | public | 299 | hors Labz | **formation Studi interrompue · à archiver** |
| `sudoku-solver` | public | 15 | hors Labz | à qualifier |
| `Totalwarai` | public | 1 792 | hors Labz | à qualifier |
| `Tricat` | public | 15 | hors Labz | à qualifier |
| `Zepevents` | privé | 129 | hors Labz | **généralisation événementielle RP · conserver · candidat Labz groupé** |
| `ZepRasso` | public | 327 | hors Labz | **origine spécialisée rasso / QR · conserver · candidat Labz groupé** |

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

### Antsimu

Contexte Mathieu : dépôt privé créé à partir d’un projet GitHub tiers de simulation de colonie de fourmis. Mathieu l’a utilisé comme base d’expérimentation, a ajouté de nombreuses fonctionnalités et a aussi dégradé certaines parties du projet d’origine au fil des essais. Le dépôt privé servait notamment à éviter de pousser ces modifications sur le dépôt source.

**Décision : GitHub seulement, privé, à conserver comme bac à sable / historique expérimental.**

Motifs :

- ne pas le présenter comme une création originale complète dans Labz ;
- conserver les expérimentations et les apprentissages associés ;
- garder la provenance tierce explicite ;
- si une idée issue d’Antsimu mérite un vrai projet personnel à l’avenir, repartir dans un dépôt neuf avec une architecture et une identité propres ;
- toute éventuelle publication du code dérivé devra respecter la licence et les obligations d’attribution du projet d’origine.

### Crimson's Blade

Contexte Mathieu : application web développée pour gérer une guilde sur *Throne and Liberty*. Le besoin était opérationnel : constituer plus vite des équipes et des raids à partir des classes, du niveau de puissance et des besoins de loot des joueurs, puis gérer notamment la distribution du loot.

Le projet a été **mis en ligne et réellement utilisé pendant une longue période**, y compris après que Mathieu a cessé de jouer au jeu. Le dépôt contient une application Node/Express structurée avec authentification, sessions, protections web, migrations et persistance de données.

**Décision : conserver et considérer comme candidat fort à intégrer à Labz.**

Angle de présentation recommandé : ne pas le réduire à « un site pour un jeu », mais le présenter comme un **outil opérationnel de coordination communautaire** ayant automatisé et simplifié l'organisation d'équipes, la planification de raids et la distribution de ressources selon des contraintes réelles.

Le dépôt peut rester privé : Labz peut présenter le problème traité, les choix de conception, les fonctionnalités et le fait qu'il a été utilisé en production sans nécessairement publier le code source.

### Ilia

Contexte Mathieu : l’un de ses premiers projets Python. L’idée était de construire une forme d’assistant vocal personnel capable d’écouter et de répondre à la voix, avec l’ambition d’y intégrer progressivement des outils d’accompagnement et une dimension thérapeutique.

Le dépôt GitHub ne représente qu’une partie du projet, l’essentiel ayant été développé localement. L’implémentation présente sur GitHub est aujourd’hui largement dépassée techniquement et ne constitue pas une base réaliste à reprendre.

**Décision : archiver le dépôt GitHub et le laisser hors Labz.**

Motif : conserver une trace importante du parcours d’apprentissage et d’une idée ancienne d’assistant conversationnel, sans présenter cette version incomplète et obsolète comme un projet actuel. Si l’idée devait renaître, repartir sur un nouveau projet plutôt que restaurer cette base.

### Écosystème RP — Saloon / HotzDoggz / Zep

Ces dépôts ne doivent pas être lus comme une série de petits bots sans rapport. Ils racontent une même démarche : **réduire la charge administrative et technique des organisations RP pour préserver le temps réellement passé à jouer et à créer du RP**.

#### `discortbotsaloon`

Première génération développée pour un saloon sur Red Dead RP. Le bot était lancé localement mais a réellement servi à la gestion de l’entreprise : caisse, tickets, stocks, salaires, commissions et comptabilité. Le problème initial était concret : les entreprises RP étaient souvent gérées dans des tableurs qui demandaient tellement d’attention qu’ils pouvaient prendre le pas sur le jeu lui-même.

**Décision : conserver comme première génération / historique fonctionnel.** Il a de la valeur dans la chronologie, mais ne mérite probablement pas une fiche Labz séparée si une présentation consolidée de l’écosystème est créée.

#### `HotzDoggz-bot`

Nouvelle génération pour une entreprise GTA RP, beaucoup plus structurée techniquement et fonctionnellement.

Point important : le bot a **réellement été mis en service**. Mathieu a laissé son PC allumé pour l’héberger et le rendre accessible pendant environ **15 jours**, y compris lorsqu’il était au travail. Il a été utilisé par **environ 40 personnes**. Un proche impliqué dans le projet était prêt à financer un hébergement permanent ; la continuité a finalement été interrompue notamment par la panne du PC de Mathieu.

Il ne faut donc pas le présenter comme un simple prototype « presque déployé », mais comme un **outil auto-hébergé ayant connu un usage réel**, dont la prochaine étape prévue était un hébergement permanent.

**Décision : conserver et considérer comme candidat fort Labz.**

#### `ZepRasso` et `Zepevents`

Ces projets appartiennent au même contexte GTA RP. « Zep » était le proche mis en avant publiquement dans le jeu, tandis que Mathieu travaillait davantage en coulisses sur l’organisation, les outils et les mécaniques des événements.

L’origine est `ZepRasso` : un outil conçu d’abord pour les rassemblements automobiles. L’idée s’est ensuite élargie vers les événements RP de manière générale. Le principe central était de **minimiser le temps passé hors jeu** : un QR code pouvait être diffusé directement en jeu, puis les participants accédaient rapidement au site pour s’inscrire, noter un véhicule, voter ou participer à une animation avant de revenir immédiatement dans le RP.

Le numérique n’était donc pas pensé comme un remplacement du jeu mais comme une **couche logistique légère au service de l’immersion**. L’outil devait absorber les inscriptions, votes, calculs, classements, loteries et autres tâches administratives afin de laisser davantage de temps aux interactions RP.

Les rassemblements automobiles et loteries organisés dans ce cadre ont rencontré un fort succès. Les tirages de certaines loteries étaient même matérialisés sous forme de vidéos de courses de billes publiées sur YouTube pour rendre le résultat visible et ludique.

`ZepRasso` représente la première implémentation spécialisée côté participants — accès web, QR code, vote et classement — tandis que `Zepevents` représente la **généralisation du concept** vers un poste de contrôle événementiel plus large : inscriptions, concours, caisse, loteries, résultats et organisation.

**Décision : conserver les deux dépôts.** Pour Labz, privilégier une **présentation groupée de l’écosystème RP** plutôt que quatre fiches qui donneraient artificiellement l’impression de quatre produits indépendants.

Angle Labz recommandé : montrer la progression **problème réel → première automatisation → usage → interface légère côté joueurs → généralisation événementielle**, avec `HotzDoggz-bot` comme pièce de gestion d’entreprise et `ZepRasso` / `Zepevents` comme branche événementielle.

### `gta-blackjack-assistant`

Contexte Mathieu : petite expérimentation née pendant une période d’ennui sur GTA RP. L’objectif était d’analyser ses propres parties de blackjack et de recevoir une orientation pour maximiser ses gains, à partir de la stratégie de base et du comptage de cartes.

Le dépôt contient une application Tkinter avec logique de blackjack, Hi-Lo, historique CSV et tests, mais l’idée n’a pas été poussée très loin ni transformée en outil réellement utilisé sur la durée.

**Décision : archiver le dépôt et le laisser hors Labz.**

Motif : expérimentation personnelle techniquement propre mais trop mineure et peu approfondie pour justifier une place dans le portfolio actif.

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
6. `Antsimu` — décision : GitHub seulement, privé, conserver comme expérimentation dérivée ;
7. `Crimson-s-Blade` — décision : conserver, candidat fort Labz ;
8. `Ilia` — décision : archiver comme ancien projet Python incomplet ;
9. `chess-vision-trainer` — contexte déjà fourni, décision presque complète ;
10. `equiperota` / AtelierFlow — contexte déjà fourni ;
11. écosystème RP : `discortbotsaloon` — conserver comme première génération ; `HotzDoggz-bot` — candidat fort Labz ; `ZepRasso` + `Zepevents` — conserver et regrouper dans la même histoire ;
12. `gta-blackjack-assistant` — décision : archiver ;
13. petits projets et utilitaires : `ball-passing-simulation`, `botlecturevlc`, `DeezerInfo`, `sudoku-solver`, `Tricat`, `afk-farm` ;
14. `Totalwarai` et les autres projets spécialisés restants.

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
