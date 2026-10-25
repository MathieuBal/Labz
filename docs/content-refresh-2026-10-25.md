# Passe éditoriale des fiches Labz

Date : 25 octobre 2026

Cette passe ne crée pas de nouveaux projets. Elle consolide la manière dont les douze fiches actives racontent leur niveau réel de maturité.

## Principes retenus

- un projet public et jouable est présenté comme tel ;
- un prototype reste un prototype, même lorsque sa boucle est riche ;
- une étude de cas met en avant l’usage et les décisions plutôt qu’une fausse promesse de démo ;
- une expérimentation arrêtée peut rester dans Labz si ce qu’elle a permis d’apprendre est intéressant ;
- les limites connues restent visibles dans les fiches.

## Ajustements effectivement livrés dans la v0.18.7

### AFK Farm

Le récit repart du vrai déclencheur : le tableau Champ magnétique de Sensoria. Le feeling de cette interaction a donné envie d’en faire une mécanique de jeu, puis le format idle web a permis d’étendre progressivement le prototype avec automatisation, drones, chantiers, biomes, prestige et arbre de progression.

Le statut reste « prototype avancé, jouable » et les deux limites principales restent assumées : reprise après mise en arrière-plan et économie des Cores.

### Total War AI

La fiche cesse de raconter uniquement un agent qui n’a pas réussi à gagner. Le cœur de l’expérimentation est la décision avec information incomplète : le script externe ne dispose pas de tout le contexte accessible à l’IA interne du moteur.

Le pont Lua/Python, l’observation et les ordres de déplacement ont fonctionné, mais améliorer l’agent aurait demandé une boucle de recherche de plus en plus coûteuse pour reconstruire ou inférer les informations absentes. Le projet est donc présenté comme une expérimentation arrêtée.

## Statuts harmonisés

Le catalogue distingue maintenant explicitement :

- public et jouable ;
- prototype riche ou avancé ;
- démo ;
- alpha testable ;
- prototype privé en pause ;
- étude de cas avec usage terrain ou réel ;
- R&D et expérimentation arrêtée.

## Travail éditorial restant à intégrer

La v0.18.7 ne contient pas encore l’ensemble des récits préparés pendant la revue orale des douze projets. Les fiches suivantes doivent encore être reprises pour intégrer pleinement leur histoire, leur origine, leur évolution organique, les choix de conception et les apprentissages racontés pendant cette revue :

- Perfoptimize ;
- Constella ;
- Crimson’s Blade ;
- Diagnostic numérique ;
- Outils d’ateliers mémoire ;
- ainsi que toute fiche dont la version actuelle n’emploie encore qu’un résumé générique alors qu’un récit plus complet a été préparé.

La cible éditoriale reste la même que pour la fiche RP : expliquer d’abord ce qu’est le projet, puis pourquoi il a été créé, comment il a évolué, ce qu’il fait concrètement, ce qu’il a appris à son auteur et dans quel état il se trouve aujourd’hui.
