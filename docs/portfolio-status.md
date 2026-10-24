# Labz — état du portefeuille

**Snapshot : 24 octobre 2026**  
**Version Labz : v0.17.0**

Ce document est la vue de pilotage du portefeuille Labz. Il distingue ce qui est réellement essayable, ce qui mérite une étude de cas, ce qui reste de la R&D et ce qui est volontairement en pause.

---

## Résumé exécutif

La v0.17 reconstruit le catalogue à partir des audits du code **et** de l’usage réel.

Le principe est désormais simple : Labz ne cherche pas à montrer tout ce qui a été codé. Une fiche doit apporter au moins une valeur claire parmi celles-ci :

- expérience réellement testable ;
- outil suffisamment mûr pour être essayé ;
- étude de cas appuyée par un usage réel ;
- expérimentation R&D dont les apprentissages justifient la présentation.

Conséquences principales :

- `Chess Vision Trainer` et `AtelierFlow` sortent du catalogue principal ;
- Constella redevient **une seule fiche**, avec Explore et Watch comme deux surfaces d’un même produit ;
- AFK Farm revient comme prototype jouable, avec ses limites affichées ;
- les outils d’ateliers mémoire, Crimson’s Blade et l’écosystème RP entrent comme **études de cas** ;
- Total War AI entre comme **R&D expérimentale**, sans prétendre que l’objectif initial a été atteint ;
- Pip-Boy reste présenté mais son lancement direct est suspendu tant que l’ancienne carte officielle Fallout redistribuée dans le dépôt n’a pas été remplacée.

Le catalogue public contient maintenant **douze fiches**, dont **six directement essayables**.

---

## Portefeuille actuel

| Projet | Position Labz | Accès actuel | Statut | Prochaine décision utile |
| --- | --- | --- | --- | --- |
| Sensoria | Expérience | Navigateur | Public / testable | recueillir du feedback réel et surveiller les performances mobiles |
| Million de pixels | Jeu | Navigateur | Public / testable | corriger la reprise après arrière-plan avant d’ajouter de nouvelles mécaniques |
| Lootchest | Jeu | Navigateur | Public / testable | observer progression, sauvegarde et compréhension des nombreux systèmes |
| AFK Farm | Jeu / prototype | Navigateur | Prototype jouable | décider à partir des retours s’il mérite une vraie passe d’équilibrage et de fiabilisation |
| Diagnostic numérique | Outil | Démo guidée navigateur | Démo testable | revalider la collecte Supabase et confronter l’outil à des usages d’atelier réels |
| Perfoptimize | Outil | Alpha Windows x64 | Testable | multiplier les essais sur vraies machines ; renforcer signature et chaîne de confiance PresentMon |
| Constella | Outil / R&D produit | Prototype privé | **En pause** | reprendre seulement après rétablissement d’une CI exploitable puis valider la chaîne bêta cloud |
| Pip-Boy JDR | Outil JDR | Présentation | Démo suspendue | remplacer l’asset Fallout redistribué, puis revalider une vraie session Supabase à deux appareils |
| Outils d’ateliers mémoire | Étude de cas | Présentation groupée | Usage terrain ponctuel | publier une démo web canonique, idéalement Tricat, après léger passage accessibilité/tests |
| Crimson’s Blade | Étude de cas | Présentation | Usage réel historique | conserver le dépôt privé ; ne redéployer qu’après remédiation sécurité et assainissement des données |
| Écosystème RP · Zep | Étude de cas | Présentation + dépôts publics sélectionnés | Usage réel historique | raconter l’évolution autour de HotzDoggz sans relancer quatre produits séparés |
| Total War AI | R&D | Dépôt public / présentation | Expérimentation avancée | reprendre seulement avec un critère de succès en vraie bataille, pas sur le seul simulateur |

---

## Projets directement essayables

Six entrées ont aujourd’hui un accès concret depuis Labz :

1. Sensoria — navigateur ;
2. Million de pixels — navigateur ;
3. Lootchest — navigateur ;
4. AFK Farm — prototype navigateur ;
5. Diagnostic numérique — démonstration guidée ;
6. Perfoptimize — téléchargement Windows x64.

Une fiche n’est pas considérée comme « essayable » uniquement parce qu’un dépôt ou une URL existe. L’accès doit être honnête, suffisamment cadré et compatible avec ce que l’audit a réellement validé.

Pip-Boy n’est donc plus compté dans cette liste tant que son asset Fallout hérité n’est pas retiré et que le mode connecté n’a pas été revalidé.

---

## Études de cas

### Outils d’ateliers mémoire

La fiche regroupe `Clicreflexe`, `Tricat` et `ball-passing-simulation`.

L’intérêt n’est pas de prétendre à une suite cognitive ou thérapeutique. La valeur portfolio est la démarche : **besoin d’atelier → petit outil adapté → faible friction d’usage → retour terrain**.

Ball Passing Simulation a été utilisé ponctuellement en atelier EHPAD. Tricat est la meilleure base actuelle pour devenir une démo publique canonique de cette famille.

### Crimson’s Blade

L’un des meilleurs exemples du portefeuille en matière de **problème réel → outil opérationnel → usage prolongé**.

L’application a servi à une guilde de *Throne and Liberty* pour centraliser profils, rôles, gear score, disponibilités, besoins de loot, composition d’équipes, raids et distribution de loot.

Le dépôt reste privé : l’audit a identifié des données historiques potentiellement sensibles et plusieurs dettes sécurité/intégrité qui interdisent de le republier ou redéployer tel quel.

### Écosystème RP · Zep

Une seule étude de cas pour quatre dépôts liés :

```text
discortbotsaloon
  -> HotzDoggz-bot
  -> ZepRasso / Zepevents
```

Le fil conducteur est constant : **absorber la logistique hors jeu pour rendre du temps au RP**.

HotzDoggz est la pièce maîtresse : auto-hébergé environ quinze jours, utilisé par environ quarante personnes, puis enrichi au contact de données et besoins réels. Les autres dépôts montrent l’origine du besoin et l’exploration de formats événementiels plus légers.

---

## R&D

### Total War AI

Le projet a effectivement construit un pont Lua/Python, une télémétrie, un planificateur, un simulateur, une mémoire, des adaptations de doctrine et une suite de tests conséquente.

Mais l’objectif utilisateur initial n’est pas atteint : **l’agent n’a jamais gagné une vraie bataille**.

C’est précisément ce qui justifie son angle R&D : le projet documente les écarts entre simulation et jeu réel, les limites de l’API exposée par le moteur, les hypothèses invalidées et les régressions découvertes uniquement en conditions réelles.

La fiche doit continuer à parler d’**agent tactique adaptatif à règles**, pas d’IA auto-apprenante ou performante.

---

## Constella dans Labz

Constella reste un seul projet technique avec deux surfaces produit clairement séparées :

### Explore

- goûts et préférences ;
- domaines, critères et items ;
- évaluations et duels ;
- carte 3D / PCA / constellations ;
- affinités et évolution du goût.

### Watch

- veille multi-sources ;
- pertinence, déduplication et lifecycle ;
- journal et digests ;
- synthèse agentique ;
- suivi de l’évolution d’un sujet dans le temps.

La séparation Explore/Watch existe réellement dans le code et fait l’objet de garde-fous d’architecture, mais les deux surfaces partagent encore un Core, un repo et une trajectoire cloud. Elles ne justifient donc pas deux fiches Labz.

### Statut de pause

La base intégrée ARCH-030 a passé un quality gate complet. Les travaux suivants sont volontairement exclus de l’état présenté tant qu’ils restent dans des PR non mergées.

Ordre de reprise :

```text
CI-001
  -> ARCH-031 workspace cloud
  -> ARCH-032 migration des historiques
  -> première bêta Cloudflare
  -> QA end-to-end
  -> UX / polish
  -> bêta fermée
```

Labz doit donc afficher Constella comme **prototype privé avancé, en pause avant bêta**, sans promettre de démonstration publique.

---

## Projets sortis du catalogue principal

### Chess Vision Trainer

Conserver le dépôt comme expérimentation technique. Le projet est propre et testé, mais ses calques tactiques restent en partie heuristiques et sa reconnaissance d’échiquier par templates ne justifie pas la promesse pédagogique initiale.

### AtelierFlow

Conserver comme exploration de conception. L’application est techniquement plus sérieuse qu’un simple prototype — moteur de placement séparé, contraintes, équité, auth, rôles et journalisation — mais elle n’a pas été validée par un usage réel et manipulerait des données RH sensibles en production.

Ces sorties ne sont pas des suppressions de dépôts : elles évitent simplement de transformer Labz en musée de tout ce qui a été codé.

---

## Ce que Labz a déjà construit

### Découverte / présentation

- catalogue éditorial ;
- catégories, recherche et fiches projet ;
- distinction entre expériences, outils, études de cas et R&D ;
- guides de prise en main ;
- visuels de projet et galeries ;
- favoris et historique locaux ;
- journal public de versions.

### Retours privés

- envoi sans compte visiteur ;
- stockage privé via Supabase ;
- brouillon local ;
- états de réception / reprise ;
- administration propriétaire ;
- statuts Nouveau / En cours / Traité ;
- visibilité de la capacité de réception.

### Continuité et publication

- versioning et release notes cohérents ;
- build GitHub Pages ;
- garde-fou empêchant les changements applicatifs visibles sans nouvelle version ;
- lecture défensive d’activité GitHub publique pour une liste autorisée de dépôts ;
- audits pré-intégration conservés dans `docs/audits/`.

---

## Priorités Labz après la refonte du portefeuille

### 1. Retours → décisions

La prochaine vraie valeur de Labz est de transformer les messages privés en décisions exploitables :

```text
retours
  -> sujet / problème
  -> synthèse
  -> impact / effort
  -> décision
  -> état
  -> éventuelle publication publique
```

Le Lot D reste donc la priorité produit naturelle.

### 2. Administration autonome

Les points encore ouverts du Lot C restent pertinents :

- récupération d’accès ;
- cycle de vie réel de la capacité ;
- purge explicite et sûre ;
- recette mobile propriétaire réelle.

### 3. Corriger les bloqueurs de vitrine avant d’élargir

Priorités concrètes :

- Pip-Boy : remplacer l’asset Fallout redistribué ;
- ateliers mémoire : choisir et publier une démo canonique ;
- Perfoptimize : tests sur plusieurs PC et chaîne de distribution ;
- Diagnostic numérique : revalidation Supabase réelle.

### 4. Feedback réel avant nouveaux projets

Ajouter de nouvelles fiches a moins de valeur que :

- tester les parcours existants ;
- améliorer les projets qui montrent un signal réel ;
- retirer ou déprioriser les présentations qui n’apportent plus de valeur.

---

## Règles de pilotage

- Maximum trois sujets Labz réellement actifs simultanément.
- Une fiche publique n’est pas une obligation de continuer un projet.
- Une démo réelle vaut plus qu’une longue description.
- Un usage réel peut justifier une étude de cas même sans démo active.
- Une expérimentation peut être présentée si ses apprentissages sont honnêtement documentés.
- Aucun dépôt privé n’est rendu public automatiquement pour rendre une fiche essayable.
- Les retours utilisateurs doivent pouvoir faire baisser la priorité d’une idée, pas seulement l’augmenter.
- Ne pas confondre quantité de fonctionnalités, qualité technique et maturité produit.
- Toute décision de portefeuille importante doit être reportée dans ce document ou dans un document qui le remplace explicitement.

---

## Prochaine revue conseillée

Revoir ce snapshot après l’un des événements suivants :

- retour réel significatif sur un projet ;
- reprise de Constella ;
- remplacement de l’asset bloquant de Pip-Boy ;
- publication d’une démo canonique des outils d’ateliers mémoire ;
- retrait ou ajout d’une fiche ;
- livraison d’un incrément important du Lot C, D ou E.