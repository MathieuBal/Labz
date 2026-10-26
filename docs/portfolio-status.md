# Labz | état du portefeuille

**Snapshot : 26 octobre 2026**  
**Version Labz : v0.18.15**

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

La démonstration publique locale est accessible. Elle permet d’explorer le parcours MJ/joueur sans compte et sans backend. Le mode connecté Supabase, les vraies sessions et leurs garanties de sécurité restent un système distinct et ne doivent pas être assimilés à la démo.

### AFK Farm

La fiche conserve son origine réelle : le projet part du Champ magnétique de Sensoria, dont le feeling a été transformé en boucle idle. Les limites connues sur les Cores et la reprise après arrière-plan restent affichées.

### Total War AI

Le projet reste présenté comme une expérimentation arrêtée. Le pont Lua/Python, la télémétrie, le simulateur et les essais sont des résultats réels ; une IA capable de gagner une vraie bataille ne l’est pas. La valeur de la fiche tient aux hypothèses testées et aux limites d’information découvertes.

### Perfoptimize

Les essais sur la machine de développement sont présentés uniquement pour les écarts réellement observés et corrigés. La fiche ne relie pas ces essais à un incident matériel et indique simplement que la validation multi-machines reste à faire.

## Ce que Labz sait déjà faire

### Découverte et présentation

- catalogue éditorial ;
- catégories, recherche et filtres ;
- favoris et historique locaux ;
- pages projet riches selon leur nature ;
- vraies URLs statiques par projet ;
- canonical, OpenGraph, sitemap et robots.txt générés ;
- guides d’essai ;
- galeries ;
- journal public de versions ;
- activité GitHub publique bornée à une liste explicite de dépôts.

### Retours et décisions privées

- envoi sans compte visiteur ;
- stockage privé Supabase ;
- brouillon local et reprise idempotente ;
- administration propriétaire ;
- statuts Nouveau / En cours / Traité ;
- suppression manuelle des retours non pertinents ;
- visibilité de la capacité ;
- sujets durables séparés des messages bruts ;
- synthèse, impact, effort et état ;
- historique immuable des décisions ;
- maximum trois sujets En cours, garanti en base ;
- contrat serveur indépendant d’une whitelist projet parallèle.

### Publication et qualité

- versioning et release notes synchronisés ;
- contrôle CI des changements applicatifs ;
- build GitHub Pages ;
- empreinte commune JS/CSS par déploiement ;
- chargement différé des modules riches ;
- tests Node ;
- vérification des chemins de publication ;
- parcours Playwright Chromium avant déploiement ;
- traces et captures conservées en cas d’échec.

## Priorités après v0.18.15

### 1. Administration autonome

Restent à traiter :

- récupération de mot de passe ;
- activation de la protection contre les mots de passe compromis ;
- recette propriétaire complète sur desktop et téléphone physique ;
- purge plus proactive seulement si le volume réel le justifie ;
- protection renforcée contre les abus seulement si le trafic augmente.

### 2. Preuves visuelles et partage

Avant d’ajouter de nouvelles fiches :

- remplacer les visuels génériques quand une capture réelle est disponible ;
- figer les ressources importantes au lieu de dépendre de chemins `main` externes ;
- améliorer les images sociales projet par projet quand de bons visuels réels existent.

Le SEO structurel est désormais suffisant pour le besoin actuel. Une stratégie plus lourde n’est pas prioritaire.

### 3. Qualité navigateur et architecture

La CI couvre les parcours critiques dans Chromium et une navigation mobile émulée. Les améliorations suivantes doivent rester ciblées :

- contrôle d’accessibilité navigateur sur les pages principales ;
- smoke Firefox ou WebKit seulement si un besoin concret apparaît ;
- recette physique ponctuelle ;
- remplacement progressif des coordinations `MutationObserver` et des correctifs de scroll lorsqu’un chantier fonctionnel touche déjà ces zones.

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
