# Audit pré-intégration Labz — TotalWarAI

**Dépôt audité :** `MathieuBal/Totalwarai`  
**Révision :** `ccdd2da32404ec3c97cf428f68ef3121342b6827`  
**Date :** 24 octobre 2026  
**Statut proposé :** **intégration Labz recommandée comme projet R&D / expérimentation ambitieuse, pas comme IA performante**

## Verdict

TotalWarAI est techniquement l'un des projets les plus ambitieux du portefeuille, mais il faut précisément éviter de confondre ambition technique et réussite de l'objectif utilisateur.

L'objectif personnel de départ était simple : Mathieu venait d'acheter *Total War: WARHAMMER III*, ne se sentait pas bon aux batailles et voulait construire un agent capable de jouer l'armée à sa place pendant qu'il observait son comportement.

Le projet a réellement franchi plusieurs étapes difficiles :

- observer une bataille depuis Lua ;
- remonter l'état vers Python ;
- classifier les unités ;
- construire des plans tactiques explicables ;
- renvoyer des ordres au jeu ;
- mesurer le déplacement réel d'une unité ;
- enregistrer les batailles ;
- conserver une mémoire ;
- adapter certains paramètres de doctrine ;
- déléguer à l'IA native comme référence ;
- reprendre le contrôle via un mécanisme d'arrêt d'urgence ;
- construire un simulateur, un banc de scénarios et une suite de tests conséquente.

Mais le résultat principal recherché n'a **pas** été atteint : selon le retour de Mathieu, son agent n'a jamais gagné une vraie partie. Le dépôt lui-même documente encore plusieurs comportements de combat non vérifiés en jeu, ainsi que des régressions graves découvertes uniquement pendant de vraies batailles.

La bonne présentation Labz est donc celle d'un **projet de recherche appliquée et d'expérimentation**, où l'intérêt réside autant dans ce qui a été appris, mesuré et invalidé que dans ce qui fonctionne.

## Angle Labz recommandé

### Titre possible

**TotalWarAI — essayer de construire un général autonome dans un jeu qui expose mal son état**

### Positionnement

Un agent tactique expérimental pour *Total War: WARHAMMER III*, construit pour observer, décider et commander une armée depuis un processus Python relié au jeu par Lua.

La narration doit insister sur :

- la recherche de faisabilité ;
- le pont entre deux environnements très contraints ;
- l'explicabilité des décisions ;
- la télémétrie et les expériences en vraie bataille ;
- les différences entre simulateur et jeu réel ;
- les hypothèses invalidées ;
- la découverte des limites structurelles du problème.

**Ne pas présenter le projet comme un bot qui sait gagner à Total War.**

---

## Architecture réelle

Le dépôt est largement plus structuré qu'un prototype monolithique.

### Agent

Le package `agent/` contient notamment :

- planificateur ;
- classification d'unités ;
- regroupement ;
- mobilité ;
- secteurs tactiques ;
- règles de sécurité ;
- explicabilité ;
- agent déterministe.

Le planificateur est devenu une pièce importante du projet, avec gestion de ciblage, lignes, réserves, concentration locale, manoeuvres et règles d'abstention.

### Pont vers le jeu

Le package `bridge/` sépare :

- protocole ;
- modèles de commande ;
- chemins ;
- transport par fichiers ;
- traduction des actions ;
- mémoire du roster ;
- supervision ;
- session live ;
- enregistrement.

Le Lua de bataille se trouve dans un fichier unique d'environ 95 Ko. Le README explique que ce monolithe est une conséquence du bac à sable du jeu, où le découpage initialement prévu n'était pas viable.

### Mémoire / apprentissage / analyse

Le projet possède des modules distincts pour :

- historique SQLite ;
- replay buffer ;
- adaptation de doctrine ;
- observation ;
- relecture ;
- récompenses ;
- ciblage ;
- cohésion ;
- attrition ;
- élévation ;
- secteurs ;
- évaluation.

### Simulation

Un simulateur indépendant du jeu sert à reproduire des scénarios tactiques et à tester le comportement de l'agent sans lancer WARHAMMER III.

### Télémétrie

Les batailles et décisions peuvent être enregistrées, résumées et transformées en rapports afin de comprendre où une décision a été proposée, filtrée, traduite, envoyée ou perdue.

---

## Qualité d'ingénierie

### CI reproductible

La CI actuelle exécute sur `main` et les pull requests :

- `ruff check` ;
- `ruff format --check` ;
- `mypy` en mode strict ;
- `pytest`.

Le dernier workflow du commit audité est vert.

Le projet a même ajouté un `PYTHONHASHSEED` fixe après avoir découvert qu'un benchmark supposé déterministe pouvait produire des verdicts différents selon la graine de hachage Python. Un test spécifique couvre désormais cette classe de régression.

### Tests

Le dépôt contient une couverture de tests inhabituellement riche pour un projet expérimental :

- tests unitaires du planificateur, des règles de sécurité, de la mémoire, du protocole, des ordres et des différents analyseurs ;
- tests d'intégration de la session live ;
- exécution du Lua contre un faux jeu embarqué via Lupa ;
- tests du protocole Lua ;
- tests de déterminisme du benchmark ;
- scénarios tactiques.

Cela ne garantit pas les performances en jeu — précisément parce que le simulateur n'est pas le moteur de WARHAMMER III — mais la discipline de test est un vrai point fort.

### Documentation de décision

Le dépôt possède une longue série d'ADR / journaux de décisions. Ils ne se contentent pas de documenter les succès : plusieurs décisions consignent explicitement des hypothèses réfutées et des modifications abandonnées après mesure.

C'est l'un des éléments les plus intéressants pour une présentation R&D.

---

## Ce que le projet a réellement prouvé en jeu

Les onze essais consignés dans la documentation établissent notamment :

- l'accès au contexte de bataille ;
- l'observation de l'armée alliée et ennemie ;
- l'accès à des informations comme position, effectifs, munitions, portée, déroute et contact ;
- la communication Lua → Python et Python → Lua par fichiers ;
- un ordre de déplacement exécuté avec un déplacement de 20,3 m mesuré par le jeu ;
- le pilotage d'une session et l'enregistrement des décisions ;
- l'arrêt d'urgence par fichier sentinelle ;
- la capacité d'enregistrer une bataille jouée par l'IA native du moteur ;
- une bataille de référence gagnée par l'IA native, utilisée comme baseline.

Ces résultats sont déjà substantiels pour un projet de reverse-engineering léger / intégration mod sans accès direct au moteur.

---

## Ce qui n'est **pas** démontré

### L'agent n'est pas performant en vraie bataille

Retour de Mathieu : **son agent n'a jamais gagné une vraie partie**.

Ce point doit avoir priorité sur tous les résultats du simulateur lors de la présentation du projet.

### Les ordres d'attaque ne sont pas validés par mesure

La documentation de faisabilité indique que `uc:attack_unit` et l'arrêt sont implémentés et acquittés par le Lua, mais qu'aucun essai n'a encore mesuré leur effet réel en bataille. Les sessions de pilotage documentées n'ont émis que des déplacements dans les essais concernés.

Un accusé de réception signifie donc « le Lua a accepté la commande », pas nécessairement « le comportement voulu s'est effectivement produit dans le moteur ».

### Restitution automatique non vérifiée

L'arrêt d'urgence par fichier sentinelle a été vérifié. La restitution automatique du contrôle après cinq secondes ne l'a pas été.

### Supervision non validée

Le mode de supervision a tourné dans au moins une bataille, mais aucune règle n'avait de raison de se déclencher dans la composition testée. Cette session ne valide donc pas l'efficacité réelle de la supervision.

### Pas de modèle appris

Il n'existe aucun réseau neuronal ni modèle entraîné dans la révision actuelle.

La Phase 4 est une **adaptation bornée de règles** : après au moins deux batailles comparables, le système peut modifier cinq paramètres explicitement autorisés, dans des bornes fixes, en produisant une justification lisible.

Les règles de sécurité ne sont pas assouplies par cette adaptation.

Les phases d'imitation / apprentissage supervisé restent non réalisées.

**Formulation recommandée :** `agent tactique adaptatif à règles`, pas `IA auto-apprenante`.

---

## Limite structurelle principale : l'agent voit moins que l'IA du jeu

Le recensement réel des API révèle un plafond important : le script de bataille peut observer beaucoup d'informations, mais pas toutes celles nécessaires à un général tactique complet.

Sont notamment inaccessibles ou non exploitables comme attendu :

- moral ;
- fatigue ;
- vitesse ;
- largeur de front ;
- obstacles ;
- forêts ;
- lignes de vue ;
- compréhension complète du terrain.

L'altitude, elle, est accessible.

L'IA native de Creative Assembly travaille à l'intérieur du moteur et bénéficie du pathfinding, des formations et d'informations que le script externe ne voit pas.

Cette asymétrie explique pourquoi déléguer à `script_ai_planner` est beaucoup plus facile que construire un général autonome externe réellement compétitif.

C'est une **conclusion de recherche** importante du projet, pas seulement un défaut d'implémentation.

---

## Provenance du projet tiers

Mathieu indique avoir commencé en s'appuyant sur un projet existant dont l'auteur avait autorisé la poursuite / l'exploration lorsque son propre développement s'était arrêté.

Le dépôt actuel documente précisément l'étude du mod **AI General 3**, par `paperpancake`.

La note de recherche affirme explicitement :

- que le mod tiers a servi de documentation / référence pour comprendre les APIs de bataille ;
- qu'aucun fichier `.pack`, script Lua, fichier UI ou code du mod tiers n'est redistribué dans TotalWarAI ;
- que le script `lua_mod/` du dépôt est une écriture originale ;
- que les appels documentés sont ceux de l'API publique de Creative Assembly.

La découverte majeure tirée de cette étude est d'ailleurs que AI General 3 ne construit pas lui-même une tactique autonome comparable à TotalWarAI : il confie principalement les unités au `script_ai_planner` natif du jeu.

**Conclusion pour Labz :** parler d'un projet **inspiré et documenté à partir de travaux existants / d'un mod tiers**, avec attribution claire, mais pas d'un fork si l'état du dépôt actuel est bien celui audité.

Avant toute distribution plus formelle, vérifier malgré tout les conditions du mod tiers et les règles de Creative Assembly, comme le README le recommande lui-même.

---

## Le pont fichiers : contrainte bien traitée

L'environnement Lua ne permet pas de supposer sockets, processus enfants ou bibliothèque standard complète. Le projet utilise donc un protocole local par fichiers :

- JSONL Lua → Python pour les états ;
- JSON Python → Lua pour la commande courante ;
- JSONL Lua → Python pour les accusés.

Plusieurs précautions sont solides :

### Écriture atomique

Python écrit la commande dans un fichier temporaire situé sur le même filesystem puis utilise `os.replace`. Lua voit donc l'ancienne ou la nouvelle commande, jamais une commande partielle.

### Course Windows corrigée

Une vraie session est déjà morte parce que Windows refusait de remplacer le fichier pendant que Lua le tenait ouvert. Le code réessaie désormais plusieurs fois avec backoff.

### Séquences persistantes

Le numéro de séquence reprend le plus grand numéro déjà présent sur disque. Cette correction vient d'un défaut réellement rencontré : un nouveau processus repartait à 1 et Lua rejetait des commandes comme déjà traitées.

### Protection contre les vieux états / accusés

Le pont sait se placer à la fin des flux et retient un watermark avant publication afin de ne pas confondre l'accusé d'une ancienne commande avec la réponse courante.

### Arrêt d'urgence redondant

`abort()` publie à la fois une commande et un fichier sentinelle. Même si le parseur de commandes devient inutilisable, la présence du fichier peut faire relâcher les unités.

Ces mécanismes montrent un niveau de maturation directement nourri par les incidents réels.

### Limite inhérente

Le Lua relit les commandes périodiquement plutôt que de disposer d'un canal temps réel natif. Cette architecture est adaptée aux contraintes trouvées mais restera moins réactive et moins riche qu'une intégration moteur directe.

---

## Écart simulateur ↔ jeu réel : principal risque méthodologique

C'est le point le plus important de l'audit.

Le dépôt a construit un benchmark sérieux, mais plusieurs épisodes montrent que **passer le banc ne garantit pas un comportement acceptable en WARHAMMER III**.

Le hotfix du 19 août 2026 est particulièrement révélateur : une nouvelle logique de rassemblement de manoeuvre avait été jugée acceptable par le banc. En vraie bataille, elle a rendu la session injouable :

- armée immobilisée ;
- aucune attaque ;
- unités déplacées manuellement rappelées vers leur point de rassemblement ;
- ligne qui se faisait ouvrir.

La fonctionnalité `manoeuvre_staging` est depuis désactivée par défaut. Le commit reconnaît explicitement que les scénarios du banc étaient trop courts et trop peu sollicitants pour révéler ce défaut.

Le projet a déjà rencontré le même type de problème avec `is_valid_target`, interprété à tort comme « unité vivante ». Trois batailles ont été perdues avant que les observations réelles montrent que cette API signifie plutôt « cible valide à cet instant ».

**Conclusion :** le simulateur est utile pour éliminer certaines régressions, mais le véritable environnement de validation reste le jeu.

Cette conclusion doit être mise en avant dans Labz, car elle montre une vraie démarche expérimentale : le projet ne masque pas que son modèle de test était imparfait, il documente pourquoi.

---

## Problèmes / dette avant une éventuelle reprise

### P0 — objectif produit non atteint

Avant d'investir dans de nouvelles tactiques, définir un critère simple et vérifiable : obtenir au moins une victoire reproductible dans une bataille réelle choisie, puis comparer aux mêmes conditions avec l'IA native.

Sans cela, ajouter des couches de planification risque de continuer à optimiser un proxy qui ne correspond pas au moteur réel.

### P0 — valider réellement le canal d'attaque

Mesurer une attaque complète en bataille :

1. état avant ;
2. ordre publié ;
3. accusé Lua ;
4. mouvement / changement de cible ;
5. engagement observé ;
6. conséquence mesurée.

Tant que ce chemin n'est pas validé, il est prématuré de travailler sur des tactiques complexes dépendant de `ATTACK_TARGET`.

### P1 — reconstruire le benchmark autour de traces réelles

Le simulateur synthétique reste utile, mais il devrait être complété par davantage de replays issus de batailles réelles : positions, effectifs, décisions, ordres et résultats.

Une amélioration n'est promue que si elle :

- reste saine au simulateur ;
- produit le comportement attendu sur des traces / replays ;
- est ensuite validée dans une bataille réelle suffisamment longue.

### P1 — version du jeu non enregistrée

La documentation de phase 0 reconnaît que la version exacte de WARHAMMER III ciblée n'a pas été relevée. Pour un projet aussi dépendant des APIs du jeu, c'est une lacune de reproductibilité.

**Action :** enregistrer version du jeu, date, DLC/patch pertinents, version du pack Lua et hash Git dans chaque rapport live.

### P1 — clarifier la métrique de succès

Le README possède des critères de réussite techniques et un MVP principalement centré sur le simulateur. Ils sont utiles, mais peuvent donner une impression de succès alors que le besoin personnel initial — laisser le général autonome gagner ou au moins jouer correctement — n'est pas rempli.

Une future reprise devrait séparer explicitement :

- **MVP d'infrastructure** : observer, commander, enregistrer ;
- **MVP tactique** : terminer une bataille réelle sans intervention ;
- **succès utilisateur** : produire un comportement suffisamment bon/intéressant pour que Mathieu puisse réellement regarder l'agent jouer à sa place.

### P2 — complexité du planificateur

`planner.py` dépasse 80 Ko et concentre une grande quantité de logique tactique. Cette densité augmente le coût d'expérimentation et rend plus difficile l'attribution causale d'une régression à une règle précise.

Une reprise pourrait privilégier des politiques plus petites / activables par feature flags et des expériences A/B explicitement journalisées plutôt que d'ajouter encore des règles dans le même planificateur.

### P2 — licence absente

Le README dit explicitement qu'aucune licence n'est définie, et aucun fichier `LICENSE` n'est présent dans l'arbre audité.

Le dépôt étant public, il faut choisir une licence avant d'encourager contributions ou réutilisation, après vérification des règles de modding et des références tierces.

---

## Ce que Labz peut affirmer honnêtement

- projet expérimental d'agent tactique pour les batailles solo de WARHAMMER III ;
- architecture Python + Lua ;
- agent déterministe explicable ;
- simulateur et banc de scénarios ;
- mémoire persistante et adaptation bornée de doctrine ;
- télémétrie et rapports ;
- pont fichiers validé en vraie bataille ;
- déplacement réel d'une unité commandé depuis Python ;
- arrêt d'urgence vérifié ;
- plusieurs vraies batailles utilisées pour diagnostiquer les limites du système ;
- CI avec lint, format, typage strict et tests ;
- recherche documentée sur les APIs et sur un mod tiers ;
- projet qui a mis en évidence un écart important entre simulation et comportement réel du moteur.

## Ce que Labz ne doit pas affirmer

- que l'agent sait bien jouer à Total War ;
- qu'il a déjà gagné une vraie bataille ;
- qu'il est meilleur que l'IA du jeu ;
- qu'il apprend par machine learning ;
- que les ordres d'attaque sont validés de bout en bout en bataille réelle ;
- que toutes les fonctionnalités du README sont terminées ;
- qu'AI General 3 est intégré ou redistribué dans le projet.

---

## Décision finale

**Intégration Labz recommandée, catégorie expérimentation / R&D.**

TotalWarAI mérite sa place non parce qu'il a réussi à devenir un bon général, mais parce que l'échec partiel est techniquement documenté et instructif :

- conception d'un agent ;
- intégration à un environnement fermé ;
- instrumentation ;
- recherche d'API ;
- reproductibilité ;
- validation en conditions réelles ;
- découverte de limites fondamentales ;
- correction d'hypothèses erronées.

La meilleure fiche Labz ne doit pas cacher le résultat. Au contraire, la phrase la plus forte est probablement :

> **J'ai réussi à faire observer et commander de vraies batailles par un agent externe ; je n'ai pas réussi à le rendre suffisamment bon pour gagner. Le projet est devenu une exploration de la frontière entre ce qu'un simulateur prédit et ce que le vrai moteur permet.**

C'est cette honnêteté, soutenue par le code, les tests et les journaux de décision, qui donne au projet sa valeur portfolio.