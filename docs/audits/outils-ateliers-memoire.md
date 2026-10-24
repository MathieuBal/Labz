# Audit pré-intégration Labz — Outils ludiques pour ateliers mémoire

**Dépôts audités :**

- `MathieuBal/Clicreflexe` — révision `83beb539d47e6628f2a6f25825c55036a7f0e1c1`
- `MathieuBal/Tricat` — révision `7b600405b3064581d518d400c947c5f8e0523cce`
- `MathieuBal/ball-passing-simulation` — révision `a5201520e5a2c22b413de37ee92453ac49ad7887`

**Date :** 24 octobre 2026  
**Statut proposé :** **intégration Labz recommandée comme une seule étude de cas / famille d'outils**

## Verdict

Ces trois dépôts ne justifient pas trois fiches Labz distinctes. Leur valeur vient précisément de leur filiation commune : créer rapidement de petites activités numériques pour enrichir des ateliers mémoire / médiation, en adaptant le format au contexte d'usage.

`Clicreflexe` et `Tricat` sont de petites applications web simples et facilement réutilisables. `ball-passing-simulation` est un prototype Pygame plus ponctuel qui a réellement servi lors d'un atelier en EHPAD et constitue surtout une preuve d'initiative et d'usage.

**Recommandation :** une seule entrée Labz, par exemple **« Outils ludiques pour ateliers mémoire »**, présentant plusieurs expériences plutôt qu'un faux « produit » unifié.

La présentation doit rester prudente : ces outils ont été conçus pour solliciter des capacités comme l'attention, la catégorisation, la rapidité de réponse ou l'observation. Le dépôt ne contient aucune validation clinique et ne doit pas être présenté comme dispositif thérapeutique ou outil médical.

## Contexte d'usage

La démarche n'était pas de développer une plateforme cognitive commerciale. Elle consistait à créer des supports plus interactifs que les présentations classiques pendant des ateliers autour de la mémoire et du développement de compétences.

- `Clicreflexe` : version web accessible d'une première expérimentation Python (`ClicReflex`) afin de réduire les contraintes d'installation.
- `Tricat` : exercice de catégorisation rapide, conçu dans la même logique d'atelier.
- `ball-passing-simulation` : activité d'attention sélective / partagée créée de manière proactive pour une séance en EHPAD et utilisée ponctuellement en atelier.

Cette logique **besoin de séance → petit outil adapté → usage immédiat** est l'élément le plus intéressant pour le portfolio.

---

# 1. Clicreflexe

## État réel

Le dépôt tient dans un seul `index.html` autonome, sans bibliothèque externe ni serveur requis. Le jeu dure 60 secondes et fait apparaître des cibles circulaires après un délai aléatoire de 500 à 1 500 ms.

Il mesure :

- le nombre total de clics ;
- le nombre de clics réussis ;
- la précision ;
- le temps moyen entre apparition d'une cible et clic réussi.

Le code prend en compte le redimensionnement CSS du Canvas pour recalculer correctement les coordonnées de clic. La souris et le tactile sont supportés.

## Points solides

- zéro dépendance ;
- lancement immédiat dans un navigateur ;
- code court et lisible ;
- coordonnées Canvas corrigées en cas de redimensionnement ;
- retour visuel sur clic réussi ;
- écran de résultats ;
- bouton Rejouer ;
- focus visible sur le bouton ;
- support tactile explicite.

## Limites

### P1 — paramètres non adaptés à différents publics

La cible fait 30 px de diamètre, la partie dure 60 secondes et les délais sont fixes dans le code. Pour un usage de médiation, ces paramètres devraient idéalement être configurables :

- taille de cible ;
- durée de séance ;
- intervalle d'apparition ;
- éventuellement contraste/couleurs.

Cela permettrait d'adapter l'activité aux capacités motrices et visuelles des participants plutôt que d'imposer une difficulté unique.

### P1 — interaction centrée pointeur

Le jeu repose uniquement sur souris/tactile. Il n'existe pas d'alternative clavier ou switch assistif pour la cible Canvas.

### P2 — démarrage automatique

La première partie démarre après un compte à rebours automatique au chargement. Un écran d'accueil avec bouton « Commencer » donnerait davantage de contrôle à l'animateur.

### P2 — absence de tests et de documentation

Le dépôt ne contient qu'un fichier et aucune suite de tests. Vu sa simplicité, ce n'est pas un problème majeur, mais un test de smoke navigateur serait suffisant pour sécuriser une publication Labz.

### Licence

Aucun fichier de licence n'est présent dans le dépôt audité. Si le dépôt reste public et doit être proposé comme ressource réutilisable, une licence explicite serait préférable.

## Position dans la famille

**Bonne démo web de référence**, à condition de faire un léger passage d'accessibilité/configuration avant de la mettre en avant comme activité testable.

---

# 2. Tricat

## État réel

Tricat est un jeu web de catégorisation chronométré. Les données contiennent réellement neuf catégories et cinq objets par catégorie, soit 45 objets.

Chaque objet est présenté avec trois catégories possibles, dont la bonne. Une bonne réponse apporte 10 points ; une erreur retire cinq secondes. La partie se termine après 60 secondes ou après traitement de tous les objets.

Le bilan affiche score, bonnes réponses, temps moyen de réponse et nombre d'objets traités.

## Points solides

- interface web sans framework ;
- écran d'accueil explicite ;
- gros boutons et mise en page responsive ;
- navigation clavier naturelle grâce à de vrais éléments `button` ;
- focus visible ;
- `aria-live` sur les informations de score/temps ;
- feedback visuel bonne/mauvaise réponse ;
- données séparées dans `data.json`, donc contenu facilement modifiable ;
- protection contre un double appel de fin de partie ;
- mélange Fisher-Yates ;
- choix aléatoire garantissant la présence de la bonne catégorie.

## Tests : présents mais non reliés au code de production

Le dépôt possède un fichier `tests/game.test.html` avec un framework minimal et des tests sur le mélange, le choix des catégories, la moyenne, la pénalité et le score.

Cependant, le fichier de test **recopie les fonctions** au lieu de charger/exécuter directement celles de `index.html`. Une divergence entre production et tests peut donc ne pas être détectée. D'ailleurs, la version de `shuffleArray` du test crée explicitement une copie alors que celle du jeu mélange le tableau reçu en place.

Le README annonce 23 assertions/tests, alors que le fichier actuel en contient davantage ; la documentation a donc légèrement dérivé.

**Correction recommandée :** extraire les fonctions pures dans un petit fichier JS partagé entre l'application et les tests, puis exécuter ces tests en CI ou via un smoke test automatisé.

## Limites pédagogiques / ergonomiques

Les paramètres sont déjà centralisés dans `CONFIG`, ce qui facilite une future adaptation, mais l'animateur ne peut pas les régler dans l'interface.

Pour un usage plus large en atelier, rendre configurables :

- durée ;
- pénalité ;
- nombre de choix ;
- nombre d'objets ;
- éventuellement le jeu de catégories.

Le temps moyen actuellement calculé inclut toutes les réponses, bonnes comme mauvaises. Le libellé devrait donc être compris comme **temps moyen de réponse**, pas temps moyen de bonne réponse.

## Déploiement

Comme `data.json` est chargé par `fetch`, ouvrir simplement le fichier local n'est pas toujours suffisant : il faut le servir en HTTP. Pour Labz, une publication statique (GitHub Pages ou équivalent) éliminerait cette friction.

## Licence

Le README dit « Projet éducatif — libre d'utilisation », mais aucun véritable fichier de licence n'est présent. Cette phrase ne remplace pas une licence logicielle claire.

## Position dans la famille

**Meilleure candidate pour devenir la démo principale de la famille**, car elle possède un écran d'accueil, une interaction plus accessible, des données configurables et un bilan plus riche.

---

# 3. Ball Passing Simulation

## État réel

Application Python/Pygame de 60 secondes conçue pour demander aux participants de suivre les passes d'une équipe pendant qu'une seconde équipe, des mouvements, des formes traversantes et une transformation progressive de la couleur du fond occupent l'attention visuelle.

Le code contient :

- deux équipes de dix joueurs ;
- deux balles ;
- déplacements aléatoires ;
- évitement rudimentaire des collisions ;
- sélection de coéquipiers pour les passes ;
- distracteurs rectangulaires traversant l'écran ;
- changement vert → gris du fond ;
- compte à rebours ;
- affichage des deux nombres de passes à la fin.

Le projet a réellement été utilisé une fois dans un atelier EHPAD, ce qui lui donne une valeur de contexte supérieure à sa maturité technique.

## Points solides

- concept directement aligné sur la séance pour laquelle il a été créé ;
- aucune dépendance autre que Pygame ;
- simulation autonome ;
- distracteurs multiples et évolution visuelle progressive ;
- licence MIT explicite ;
- README honnête sur son origine et son objectif.

## Limites techniques

### P1 — architecture monolithique

Tout le comportement est placé dans `main.py` et l'état global est initialisé au chargement. Il n'existe ni séparation logique/rendu ni point d'injection facilitant les tests.

### P1 — aucun test / environnement reproductible minimal

Le README demande `pip install pygame`, mais le dépôt ne fournit pas `requirements.txt` ou `pyproject.toml`, ni tests.

### P1 — sémantique du compteur de passes

`passes_count` est incrémenté dès qu'un nouveau receveur est choisi, avant que la balle ait physiquement atteint ce joueur. Une passe lancée juste avant la fin de la minute peut donc apparaître dans le résultat alors qu'elle est encore en vol.

Pour un exercice de comptage visuel, la métrique devrait correspondre à l'événement perceptible par le participant : incrémenter lorsque le receveur prend effectivement possession de la balle.

### P2 — minuterie événementielle confuse

Le code contient une branche `event.type == pygame.USEREVENT` destinée à créer un distracteur, mais elle est précédée d'une condition plus large qui capture déjà `pygame.USEREVENT`. Cette branche est donc inaccessible. Les distracteurs apparaissent malgré tout via un compteur manuel distinct, ce qui masque le problème.

### P2 — expérience très peu configurable

Durée, nombre de joueurs, vitesses et niveaux de distraction sont uniquement des constantes de code.

### P2 — projet one-shot

Il n'y a pas de bouton Rejouer ni de menu : après l'écran final de cinq secondes, l'application se ferme. Ce comportement est cohérent avec un outil préparé pour une séance, mais pas avec une démo publique autonome.

## Position dans la famille

**À conserver comme preuve d'usage réel et exemple d'initiative**, mais ne pas en faire la démo principale. Si l'idée devait être relancée, une petite version web configurable serait plus cohérente avec `Clicreflexe` et `Tricat`.

---

# Cohérence de la famille

Ces outils montrent une progression intéressante :

1. tester rapidement une idée d'activité ;
2. chercher un format simple et ludique ;
3. adapter l'outil au contexte d'un atelier ;
4. quand l'accessibilité de distribution compte, privilégier le navigateur ;
5. mesurer immédiatement quelques résultats utiles à l'animateur ou au participant.

Ils n'ont pas besoin de devenir une plateforme commune pour être cohérents dans Labz.

## Présentation Labz recommandée

### Titre possible

**Outils ludiques pour ateliers mémoire**

### Sous-angle

Petites expériences numériques conçues pour enrichir des ateliers de médiation et proposer des exercices interactifs autour de l'attention, la catégorisation et la rapidité de réponse.

### Ce qu'on peut affirmer

- plusieurs activités ont été conçues dans le contexte réel d'ateliers mémoire ;
- `ball-passing-simulation` a été utilisé ponctuellement lors d'une séance en EHPAD ;
- les versions web réduisent la friction d'installation pour l'animateur et les participants ;
- Tricat et Clicreflexe sont des applications légères entièrement côté navigateur ;
- les outils ont été conçus par initiative personnelle pour compléter des supports plus classiques.

### Ce qu'on ne doit pas affirmer

- qu'ils préviennent ou traitent les troubles cognitifs ;
- qu'ils améliorent médicalement la mémoire ;
- qu'ils ont été validés cliniquement ;
- qu'ils forment une suite logicielle professionnelle éprouvée ;
- qu'ils ont tous été utilisés à grande échelle.

## Plan minimum avant publication Labz

1. Choisir `Tricat` comme démo principale de la famille.
2. Publier `Tricat` sur une URL statique directement testable.
3. Faire un smoke test desktop + mobile.
4. Relier les tests de Tricat au vrai code de production.
5. Ajouter une licence explicite à Tricat.
6. Pour `Clicreflexe`, ajouter un écran de démarrage et quelques réglages d'accessibilité/difficulté.
7. Ajouter une licence explicite à Clicreflexe.
8. Garder `ball-passing-simulation` comme capture/description historique, ou le porter en web uniquement si l'idée mérite réellement une seconde vie.

## Décision

**Intégration Labz recommandée sous une seule entrée groupée.**

La force de cette famille n'est pas la sophistication technique individuelle des jeux. Elle est dans la capacité à identifier un besoin de médiation concret, concevoir rapidement un support adapté, privilégier l'accessibilité lorsque nécessaire et, au moins pour une partie de ces outils, les confronter à un atelier réel.