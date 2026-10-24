# Labz — état du portefeuille

**Snapshot : 24 octobre 2026**  
**Version Labz : v0.15.0**

Ce document est la vue de pilotage du portefeuille Labz. Il complète la sélection éditoriale historique et le plan de développement en distinguant : ce qui est réellement essayable, ce qui reste une présentation, ce qui est en exploration et ce qui est volontairement en pause.

---

## Résumé exécutif

Labz n’est plus seulement une vitrine de dépôts : le site centralise désormais la découverte des projets, les guides d’essai, les retours privés, l’administration propriétaire et le journal de versions.

La phase v0.12 → v0.15 a surtout amélioré la **qualité des démonstrations et la lisibilité du portefeuille** :

- Diagnostic numérique est devenu découvrable via une démonstration guidée ;
- Perfoptimize est revenu avec une alpha Windows téléchargeable et une présentation plus honnête de ses contraintes locales ;
- Pip-Boy JDR est directement essayable dans une démonstration locale navigateur ;
- Constella est désormais présenté comme deux produits distincts, Explore et Watch, qui partagent encore le même socle technique.

Le prochain enjeu de Labz n’est donc pas d’ajouter davantage de fiches. Il est de **transformer les retours et l’état réel des projets en décisions de portefeuille lisibles**.

---

## Portefeuille actuel

| Projet | Position Labz | Accès actuel | Statut | Prochaine décision utile |
| --- | --- | --- | --- | --- |
| Sensoria | Expérience publique | Navigateur | Livré / à observer | recueillir du feedback réel et surveiller les performances mobiles |
| Million de pixels | Jeu public | Navigateur | Livré / à observer | privilégier retours d’usage plutôt que nouvelles mécaniques sans signal |
| Lootchest | Jeu public | Navigateur | Livré / à observer | observer progression, sauvegarde et compréhension du donjon |
| Diagnostic numérique | Outil d’atelier | Démo guidée navigateur | Démo disponible | confronter la démo aux besoins réels d’animation et d’atelier |
| Perfoptimize | Outil technique | Alpha Windows x64 | Testable | multiplier les essais sur vraies machines avant d’élargir la distribution |
| Pip-Boy JDR | Projet personnel / JDR | Démo locale navigateur | Testable | n’investir dans le multi-appareils que si l’usage de campagne le justifie |
| Constella Explore | R&D produit | Prototype privé | **En pause** | reprendre seulement après retour des runners CI ; voie critique documentée dans Constella |
| Constella Watch | R&D produit | Prototype privé | **En pause** | reprendre avec le même socle que Explore ; priorité future à l’UX plutôt qu’à de nouvelles sources |
| Chess Vision Trainer | Prototype ancien | Présentation seulement | Faible priorité | ne plus en faire une priorité de démo ; candidat à sortir de la sélection active |
| AtelierFlow | Exploration | Présentation seulement | Exploration légère | conserver comme piste, sans investissement tant qu’un besoin concret n’est pas confirmé |

Le catalogue public contient aujourd’hui dix fiches parce que Constella est présenté en deux produits distincts et que Perfoptimize est revenu dans le Labz.

---

## Projets directement essayables

Six entrées ont actuellement un accès concret depuis Labz :

1. Sensoria — navigateur ;
2. Million de pixels — navigateur ;
3. Lootchest — navigateur ;
4. Diagnostic numérique — démonstration guidée ;
5. Perfoptimize — téléchargement Windows x64 ;
6. Pip-Boy JDR — démonstration locale navigateur.

Une fiche n’est pas considérée comme « essayable » uniquement parce qu’un dépôt ou une URL existe. L’accès doit être présenté honnêtement et le parcours visiteur doit être suffisamment cadré.

---

## Constella dans Labz

Constella reste un seul projet technique avec deux produits présentés séparément :

### Constella Explore

- goûts et préférences ;
- domaines, critères et items ;
- évaluations et duels ;
- carte 3D / PCA / constellations ;
- affinités, recommandations et évolution du goût.

### Constella Watch

- veille multi-sources ;
- pertinence, déduplication et lifecycle ;
- journal, digests et articles ;
- analyse assistée par IA ;
- suivi de l’évolution d’un sujet dans le temps.

### Statut de pause

Constella est mis en pause au 24 octobre 2026 parce que GitHub Actions ne parvient plus à attribuer de runner aux workflows privés concernés. Les jobs sont créés mais terminent avant toute étape (`steps: []`, `runner_id: 0`).

La pause est volontairement **technique et contrôlée**, pas un abandon produit.

Ordre de reprise documenté côté Constella :

```text
CI-001
  -> ARCH-031 workspace cloud
  -> ARCH-032 migration des historiques
  -> première beta Cloudflare
  -> QA end-to-end
  -> UX / polish
  -> beta fermée
```

Labz doit donc afficher Constella comme **prototype privé en pause**, sans promettre de démonstration publique tant que cette voie critique n’est pas terminée.

---

## Ce que Labz a déjà construit

### Découverte / présentation

- catalogue éditorial ;
- catégories, recherche et fiches projet ;
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
- statuts Nouveau / En cours / Traité.

### Continuité et publication

- versioning et release notes cohérents ;
- build GitHub Pages ;
- garde-fou empêchant les changements visibles sans nouvelle version ;
- lecture défensive d’activité GitHub publique pour une liste autorisée de dépôts.

---

## Priorités Labz après le dézoom

### 1. Vérité du portefeuille

Le statut réel d’un projet doit être visible et cohérent entre :

- catalogue ;
- README ;
- documentation ;
- nouveautés ;
- éventuels états publics futurs.

Aucune fiche ne doit donner l’impression qu’un projet est activement développé si ce n’est plus le cas.

### 2. Retours → décisions

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

Le Lot D du plan de développement reste donc stratégiquement important.

### 3. Administration autonome

Les points encore ouverts du Lot C restent pertinents :

- récupération d’accès ;
- capacité / cycle de vie des messages ;
- purge explicite et sûre ;
- recette mobile propriétaire réelle.

### 4. Progrès publics

Le Lot E devient plus utile maintenant que plusieurs projets sont effectivement testables. Les états publics proposés restent :

- À l’étude ;
- Prévu ;
- En cours ;
- Livré.

Ils doivent rester distincts de l’activité Git et des états internes de gestion.

### 5. Feedback réel avant nouveaux projets

Tant que le portefeuille actuel n’a pas généré suffisamment de retours utiles, ajouter de nouvelles fiches a moins de valeur que :

- tester les parcours existants ;
- améliorer les projets qui montrent un signal réel ;
- retirer ou déprioriser les présentations qui n’apportent plus de valeur.

---

## Projets à maintenir sous surveillance

### Chess Vision Trainer

Le projet n’est plus une priorité active. Sa présence actuelle dans le catalogue est une dette éditoriale à arbitrer : soit une raison claire de le montrer apparaît, soit il sort de la sélection active sans supprimer son dépôt.

### AtelierFlow

Le concept reste intéressant comme exploration, mais il n’a pas encore suffisamment de matière ou d’usage démontré pour justifier un chantier de démo maintenant.

### Constella

Ne pas rouvrir de grand refactor produit pendant la pause. La documentation côté Constella fixe déjà son point de reprise précis.

---

## Règles de pilotage

- Maximum trois sujets Labz réellement actifs simultanément.
- Une fiche publique n’est pas une obligation de continuer un projet.
- Une démo réelle vaut plus qu’une longue description.
- Aucun dépôt privé n’est rendu public automatiquement pour rendre une fiche essayable.
- Les retours utilisateurs doivent pouvoir faire baisser la priorité d’une idée, pas seulement l’augmenter.
- Les projets personnels peuvent rester dans Labz sans objectif commercial.
- Ne pas confondre quantité de fonctionnalités et maturité produit.
- Toute décision de portefeuille importante doit être reportée dans ce document ou dans un document qui le remplace explicitement.

---

## Prochaine revue conseillée

Revoir ce snapshot après l’un des événements suivants :

- retour réel significatif sur un projet ;
- nouvelle version publique Labz modifiant le portefeuille ;
- reprise de Constella ;
- retrait ou ajout d’une fiche ;
- livraison du Lot C, D ou E.
