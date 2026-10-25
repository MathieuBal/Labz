# Labz | état du portefeuille

**Snapshot : 25 octobre 2026**  
**Version Labz : v0.18.9**

Ce document est la vue de pilotage du portefeuille public. `catalog.js` reste la source canonique des fiches effectivement publiées ; ce document explique les décisions de portefeuille et les prochaines étapes utiles.

## Résumé

Labz présente **douze fiches**, dont **sept accès directs** :

1. Sensoria ;
2. Million de pixels ;
3. Lootchest ;
4. AFK Farm ;
5. Diagnostic numérique ;
6. Perfoptimize ;
7. Pip-Boy JDR.

Les cinq autres entrées restent volontairement des présentations, études de cas ou travaux R&D : Constella, Outils d’ateliers mémoire, Crimson’s Blade, Écosystème RP · Zep et Total War AI.

Le principe de sélection reste : une fiche doit apporter au moins une valeur claire parmi expérience réellement testable, outil suffisamment mûr pour être essayé, étude de cas appuyée par un usage réel, ou expérimentation R&D dont les apprentissages justifient la présentation.

## Portefeuille actuel

| Projet | Position | Accès | Statut | Prochaine décision utile |
| --- | --- | --- | --- | --- |
| Sensoria | Expérience | Navigateur | Public · expérience jouable | recueillir du feedback réel et valider davantage sur appareils physiques |
| Million de pixels | Jeu | Navigateur | Public · jeu jouable | fiabiliser la reprise après arrière-plan avant d’élargir les mécaniques |
| Lootchest | Jeu | Navigateur | Public · prototype riche | observer progression, sauvegarde et compréhension des systèmes |
| AFK Farm | Jeu | Navigateur | Prototype avancé · jouable | décider si les retours justifient une passe d’équilibrage et de fiabilisation |
| Diagnostic numérique | Outil | Navigateur | Outil de médiation · démo | revalider la collecte Supabase dans une situation d’atelier réelle |
| Perfoptimize | Outil | Windows x64 | Alpha Windows · testable | multiplier les essais matériels et renforcer la chaîne de confiance |
| Constella | Outil / R&D produit | Aucun accès public | Prototype privé · en pause | reprendre uniquement avec une raison produit claire et une chaîne CI exploitable |
| Pip-Boy JDR | Outil JDR | Navigateur | Démo publique · mode connecté séparé | distinguer durablement la démo locale de la vraie session multi-appareils |
| Outils d’ateliers mémoire | Étude de cas | Présentation | Usage terrain | choisir éventuellement une démo canonique après passage accessibilité/tests |
| Crimson’s Blade | Étude de cas | Présentation | Usage réel | conserver privé ; ne redéployer qu’après remédiation sécurité et assainissement des données |
| Écosystème RP · Zep | Étude de cas | Présentation + dépôts sélectionnés | Usage réel | raconter et consolider, sans relancer artificiellement quatre produits séparés |
| Total War AI | R&D | Présentation + dépôt | Expérimentation arrêtée | ne reprendre qu’avec un meilleur accès aux informations de bataille et un critère de succès réel |

## Décisions structurantes

### Catalogue

`Chess Vision Trainer` et `AtelierFlow` restent hors du catalogue principal. Les dépôts sont conservés, mais Labz ne cherche pas à devenir un musée de tout ce qui a été codé.

Constella reste une seule fiche avec Explore et Watch comme deux surfaces d’un même socle.

### Pip-Boy

La démonstration publique locale est de nouveau accessible. Elle permet d’explorer le parcours MJ/joueur sans compte et sans backend. Le mode connecté Supabase, les vraies sessions et leurs garanties de sécurité restent un système distinct et ne doivent pas être assimilés à la démo.

### AFK Farm

La fiche doit conserver son origine réelle : le projet part du Champ magnétique de Sensoria, dont le feeling a été transformé en boucle idle. Les limites connues sur les Cores et la reprise après arrière-plan restent affichées.

### Total War AI

Le projet reste présenté comme une expérimentation arrêtée. Le pont Lua/Python, la télémétrie, le simulateur et les essais sont des résultats réels ; une IA capable de gagner une vraie bataille ne l’est pas. La valeur de la fiche tient aux hypothèses testées et aux limites d’information découvertes.

## Ce que Labz sait déjà faire

### Découverte et présentation

- catalogue éditorial ;
- catégories, recherche et filtres ;
- favoris et historique locaux ;
- pages projet riches selon leur nature ;
- guides d’essai ;
- galeries ;
- journal public de versions ;
- activité GitHub publique bornée à une liste explicite de dépôts.

### Retours privés

- envoi sans compte visiteur ;
- stockage privé Supabase ;
- brouillon local et reprise idempotente ;
- administration propriétaire ;
- statuts Nouveau / En cours / Traité ;
- visibilité de la capacité ;
- contrat serveur indépendant d’une whitelist projet parallèle ;
- test automatique vérifiant que les douze fiches actives peuvent satisfaire ce contrat.

### Publication

- versioning et release notes synchronisés ;
- contrôle CI des changements applicatifs ;
- build GitHub Pages ;
- empreinte commune JS/CSS par déploiement ;
- tests Node et vérification des chemins de publication.

## Priorités après v0.18.9

### 1. Retours → décisions

La prochaine vraie valeur produit reste :

```text
retours
  -> sujet / problème
  -> synthèse
  -> impact / effort
  -> décision
  -> état
  -> éventuelle publication publique
```

Labz collecte maintenant de façon suffisamment fiable. La prochaine étape utile est de réduire la distance entre un message reçu et une décision de portefeuille.

### 2. Administration autonome

Restent à traiter :

- récupération de mot de passe ;
- cycle de vie de la capacité ;
- purge explicite et sûre ;
- protection renforcée contre les abus si le trafic augmente ;
- recette propriétaire complète sur téléphone réel.

### 3. Preuves visuelles et partage

Avant d’ajouter de nouvelles fiches :

- remplacer les visuels génériques quand une capture réelle est disponible ;
- figer les ressources importantes au lieu de dépendre de chemins `main` externes ;
- améliorer le partage par projet et les métadonnées sociales si le besoin devient concret.

## Règles de pilotage

- Maximum trois sujets Labz réellement actifs simultanément.
- Une fiche publique n’oblige pas à continuer un projet.
- Une démo réelle vaut plus qu’une longue promesse.
- Un usage réel peut justifier une étude de cas sans démo active.
- Une expérimentation peut rester visible si ses apprentissages sont honnêtement documentés.
- Aucun dépôt privé n’est rendu public automatiquement pour rendre une fiche essayable.
- Les retours peuvent faire baisser la priorité d’une idée.
- Ne pas confondre quantité de fonctionnalités, qualité technique et maturité produit.
- Les statuts, accès et guides essentiels doivent rester dans `catalog.js`, pas dans une couche corrective parallèle.
