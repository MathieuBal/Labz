# Passe éditoriale des fiches Labz

Date : 25 octobre 2026

Cette passe ne crée pas de nouveaux projets. Elle consolide la manière dont les douze fiches actives racontent leur origine, leur usage, leur fonctionnement et leur niveau réel de maturité.

## Principes retenus

- un projet public et jouable est présenté comme tel ;
- un prototype reste un prototype, même lorsque sa boucle est riche ;
- une étude de cas met en avant l’usage et les décisions plutôt qu’une fausse promesse de démo ;
- une expérimentation arrêtée peut rester dans Labz si ce qu’elle a permis d’apprendre est intéressant ;
- les passages autobiographiques parlent à la première personne ;
- les limites connues restent visibles dans les fiches.

## Réécritures intégrées

### Sensoria

La fiche assume le laboratoire web comme point de départ. Les 22 expériences servent à explorer les limites pratiques du navigateur en rendu, simulation et interaction, avec une attention particulière au geste, au tactile et au cycle de vie des scènes.

### Million de Pixels

Le récit repart de la publicité de jeu mobile qui a déclenché l’idée, puis montre le changement d’échelle : transformer n’importe quelle image en monde de 1 048 576 cellules, avec économie par couleurs, canons spécialisés et progression permanente.

### Lootchest

La page remet au centre le plaisir du loot, des builds et du craft. Path of Exile est présenté comme une référence importante pour la profondeur de forge, tandis que les retours de plusieurs joueurs expliquent comment le prototype a grandi vers les donjons, boss, contrats, Plongée et village.

### AFK Farm

Le récit repart du vrai déclencheur : le Champ magnétique de Sensoria. Le feeling de cette interaction a donné envie d’en faire une mécanique de jeu, puis le format idle web a permis d’étendre progressivement le prototype avec automatisation, drones, chantiers, biomes, prestige et arbre de progression.

Le statut reste « prototype avancé, jouable » et les deux limites principales restent assumées : reprise après mise en arrière-plan et économie des Cores.

### Diagnostic numérique

La fiche raconte le besoin professionnel réel : construire un cycle de 12 ateliers numériques en ESAT sans deviner les besoins du groupe. Le diagnostic combine questions, mini-jeux, manipulations et observations, puis alimente directement la préparation des ateliers suivants. L’outil a été développé dans la semaine et utilisé dès le vendredi suivant.

### Perfoptimize

La page repart des lags et crashs rencontrés sur le PC personnel malgré une configuration qui semblait suffisante. Le projet est présenté comme un assistant qui mesure d’abord le matériel réel et le comportement du jeu avant de recommander quoi que ce soit. Les essais matériels, les erreurs révélées par WMI et Engine Multithreading, puis l’arrêt de la validation après la panne du PC font partie du récit.

### Pip-Boy JDR

Le téléphone comme véritable Pip-Boy du joueur redevient l’idée fondatrice. La Console MJ est présentée comme la conséquence de ce besoin : préparer des informations secrètes puis les révéler au bon moment pendant la partie. La démo locale et le mode connecté restent clairement distingués.

### Constella

La fiche explique le passage d’une cartographie personnelle des goûts vers une cartographie de l’information. Explore naît du besoin de représenter des préférences subjectives autrement qu’avec une note, puis Watch transpose le même principe à la veille, aux synthèses et au suivi de sujets dans le temps.

### Outils d’ateliers mémoire

Le récit montre la progression réelle : des PowerPoint fournis jugés trop passifs, puis des présentations de plus en plus gamifiées, jusqu’au moment où de petits programmes Python ou web deviennent plus rapides à fabriquer et plus rejouables. Les outils restent présentés comme des supports d’animation, pas comme des dispositifs thérapeutiques.

### Crimson’s Blade

La page repart du chaos concret des raids de guilde sur Throne and Liberty : disponibilités, rôles, boss, besoins de loot et temps perdu dans Discord. L’application déployée sur OVH a réellement été utilisée et a continué à servir pendant une période où son créateur ne jouait plus.

### Écosystème RP

La fiche détaillée reste la référence. Elle distingue deux trajectoires : Saloon puis HotzDoggz à plusieurs années d’écart, et ZepRasso avec le détour par Zepevents puis le retour au web après validation de l’usage. Les projets ne sont pas présentés comme quatre versions linéaires d’un même logiciel.

### Total War AI

La fiche cesse de raconter uniquement un agent qui n’a pas réussi à gagner. Le cœur de l’expérimentation est la décision avec information incomplète : le script externe ne dispose pas de tout le contexte accessible à l’IA interne du moteur.

Le pont Lua/Python, l’observation et les ordres de déplacement ont fonctionné, mais améliorer l’agent aurait demandé une boucle de recherche de plus en plus coûteuse pour reconstruire ou inférer les informations absentes. Le projet est donc présenté comme une expérimentation arrêtée.

## Structure des pages

Les formats de page partagent désormais deux blocs éditoriaux supplémentaires quand le contenu les prévoit :

- l’origine du projet, pour expliquer pourquoi il existe ;
- le déroulé ou la boucle, pour montrer comment l’idée fonctionne ou a évolué.

Ces blocs sont disponibles sur les pages produit, la suite Constella, les études de cas et la page R&D. Des tests de régression verrouillent les formulations et faits centraux de chaque récit.

## Statuts harmonisés

Le catalogue distingue explicitement :

- public et jouable ;
- prototype riche ou avancé ;
- démo ;
- alpha testable ;
- prototype privé en pause ;
- étude de cas avec usage terrain ou réel ;
- R&D et expérimentation arrêtée.

La récupération complète de cette passe est publiée en Labz 0.18.8.
