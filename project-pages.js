import { projects } from './catalog.js';

const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[char]));

const profiles = {
  sensoria: {
    type: 'product',
    kicker: 'LABORATOIRE WEB · 22 EXPÉRIENCES',
    headline: 'Jusqu’où peut-on pousser un navigateur ?',
    narrative: 'Sensoria est mon laboratoire d’expérimentation web. J’y décline 22 expériences interactives pour tester jusqu’où un navigateur peut aller en simulation, animation 2D et 3D, matière, particules et interactions gestuelles, sans passer par un moteur de jeu dédié. Chaque tableau transforme une question technique en quelque chose que l’on peut toucher, perturber et observer.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je voulais voir jusqu’où le navigateur pouvait aller.',
      paragraphs: [
        'Le point de départ était simple : explorer les limites pratiques du web. Jusqu’où peut-on simuler une matière, faire vivre une scène 3D, gérer plusieurs points de contact ou construire une réaction crédible tout en restant dans une page web ?',
        'Plutôt qu’un benchmark ou une seule démonstration, j’ai choisi d’en faire une collection. Chaque expérience isole un comportement différent et me donne un nouveau terrain pour tester une idée, une technique ou une contrainte.'
      ],
    },
    features: [
      ['22 terrains d’essai distincts', 'Mosaïque infinie, Lac nocturne, Ferrofluide, Argile vivante, Encres flottantes ou Échos du geste ne cherchent pas à reproduire la même recette. Chaque tableau explore un comportement, une sensation ou une contrainte différente.'],
      ['Du Canvas à la 3D', 'Certaines scènes reposent sur Canvas 2D, d’autres utilisent Three.js et WebGL2. L’intérêt est justement de changer d’approche selon l’expérience plutôt que d’imposer le même moteur à toute la collection.'],
      ['Le geste fait partie du test', 'Souris, stylet, tactile et multi-touch servent à dessiner, pousser, attirer, maintenir ou perturber. L’interaction n’est pas ajoutée après le rendu : elle fait partie de ce que chaque expérience cherche à éprouver.'],
    ],
    flowLabel: 'COMMENT NAÎT UNE EXPÉRIENCE',
    flowTitle: 'Une question technique devient quelque chose que l’on peut toucher.',
    flow: [
      ['Je pars d’un comportement', 'Fluidité, tension, attraction, dispersion, lumière, mémoire du geste ou interaction 3D deviennent le point de départ d’un nouveau tableau.'],
      ['Je prototype directement dans le web', 'Je cherche la combinaison la plus adaptée entre Canvas, WebGL, Three.js, calculs locaux et APIs du navigateur sans introduire un moteur de jeu dédié.'],
      ['Je mets l’interaction au centre', 'Le test ne vaut que si le visiteur peut provoquer le système, observer sa réponse et découvrir intuitivement ce qui tient ou ce qui casse.'],
      ['J’observe la limite', 'Performance, stabilité, tactile, densité d’objets et cycle de vie de la scène me donnent ensuite les contraintes à corriger ou à contourner.'],
    ],
    aboutLabel: 'CE QUE SENSORIA TESTE VRAIMENT',
    aboutTitle: 'Pas un benchmark, un laboratoire perceptible.',
    about: [
      'Le but n’est pas d’afficher le plus de particules possible pour obtenir un chiffre. Je cherche plutôt le point où une simulation reste suffisamment fluide, lisible et réactive pour donner une sensation crédible dans un navigateur ordinaire.',
      'À l’échelle de 22 expériences, le défi devient aussi architectural : un InputManager commun gère les pointeurs, le RenderLoop borne le temps entre les images, le SceneManager démonte les scènes quand on les quitte et certaines expériences 3D sont chargées à la demande.'
    ],
    tech: [['Surface', 'Navigateur · PWA installable'], ['Interaction', 'Pointer Events · souris / stylet / multi-touch'], ['Rendu', 'Canvas 2D + Three.js / WebGL2'], ['Architecture', 'RenderLoop · SceneManager · chargement dynamique'], ['Validation', 'Playwright desktop + mobile émulé']],
    status: 'Sensoria est public et les 22 expériences sont jouables. Plusieurs scripts Playwright vérifient déjà les scènes et les interactions, mais ils ne bloquent pas encore la publication dans la CI et le facteur de qualité dynamique n’est pas utilisé uniformément partout. La prochaine étape est moins d’ajouter encore des tableaux que d’identifier ceux qui marquent vraiment, de consolider leur comportement et de les valider davantage sur de vrais appareils.'
  },
  'million-de-pixels': {
    type: 'product',
    kicker: 'IDLE / ROGUELITE · 1 048 576 CELLULES',
    headline: 'Et si n’importe quelle photo pouvait devenir un niveau de jeu ?',
    narrative: 'Million de Pixels transforme une image en un monde 1024 × 1024 réellement simulé. Chaque pixel devient une cellule du niveau, les couleurs deviennent des ressources et les canons grignotent progressivement la toile jusqu’à ouvrir de nouvelles zones. Une photo personnelle, une illustration de campagne ou une image importée peut ainsi devenir la matière première d’une nouvelle partie.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Une pub de jeu mobile m’a donné une idée beaucoup plus grande.',
      paragraphs: [
        'Je jouais sur mon téléphone quand une publicité pour un jeu est apparue. Le principe m’a accroché : détruire progressivement une petite planche composée de quelques pixels. Le jeu montré était beaucoup plus simple et très cadré, mais il m’a laissé une question en tête : et si je pouvais prendre n’importe quelle photo et en faire directement un niveau de jeu ?',
        'C’est à partir de cette idée que j’ai développé ma propre version. J’ai gardé le plaisir visuel de voir une image se faire grignoter, puis j’ai changé l’échelle et construit autour : un vrai monde de 1 048 576 cellules, une économie par couleurs, des canons spécialisés, de l’automatisation, des capacités, des doctrines et une progression permanente.'
      ],
    },
    features: [
      ['Un million, pour de vrai', 'Les 1 048 576 cellules existent réellement dans la simulation. Une couleur enterrée derrière une autre peut être inaccessible, une façade évolue à mesure qu’elle est détruite et chaque tir modifie le monde plutôt qu’une simple barre de progression.'],
      ['N’importe quelle image peut devenir le terrain', 'L’import transforme une image en niveau sans lui imposer une carte prédéfinie. Sa palette, ses formes et l’ordre dans lequel ses couleurs deviennent accessibles changent directement la partie.'],
      ['Transformer la destruction en progression', 'Les couleurs deviennent des ressources, les canons se spécialisent et les fragments servent à améliorer cadence, automatisation et manière d’attaquer la toile. Doctrines, capacités et bonus permanents prolongent ensuite la boucle au-delà d’une seule image.'],
    ],
    flowLabel: 'COMMENT UNE IMAGE DEVIENT UN NIVEAU',
    flowTitle: 'Importer, ouvrir la surface, exploiter les couleurs, recommencer.',
    flow: [
      ['J’importe une image', 'Le jeu la transforme en un monde logique de 1024 × 1024 cellules. La photo n’est pas seulement affichée en fond : elle devient la structure du niveau.'],
      ['Les bords définissent le départ', 'Les canons ne peuvent attaquer que les couleurs réellement exposées. Une couleur cachée derrière une autre reste inaccessible tant que la surface ne s’est pas ouverte.'],
      ['La destruction produit des ressources', 'Les fragments récupérés par couleur servent à renforcer les canons, débloquer de l’automatisation et accélérer la conquête de la toile.'],
      ['Une nouvelle image change la partie', 'Import libre, campagne de 56 illustrations générées pour le jeu et progression permanente donnent une raison de repartir sur une autre géographie plutôt que de répéter exactement le même niveau.'],
    ],
    aboutLabel: 'LA BOUCLE DE JEU',
    aboutTitle: 'L’image n’est pas une barre de vie : c’est le niveau entier.',
    about: [
      'Le plaisir vient de la transformation progressive de la toile. Au départ, l’image est intacte et les canons ne peuvent atteindre que ce que ses bords leur exposent. À mesure que des cellules disparaissent, de nouvelles couleurs deviennent accessibles et la géographie du niveau change réellement.',
      'Cette contrainte donne une raison à l’optimisation : améliorer un canon n’accélère pas seulement un compteur, cela change la vitesse à laquelle une couleur cède, la façon dont la surface s’ouvre et le moment où l’on peut réinvestir ailleurs.'
    ],
    tech: [['Monde', '1024 × 1024 · TypedArrays et index spécialisés'], ['Rendu', 'PixiJS / WebGL2 · simulation séparée du visuel'], ['Traitement', 'Workers pour image et reprise hors-ligne'], ['Sauvegarde', 'IndexedDB · migrations v1 → v6'], ['Contenu', 'Import libre + campagne de 56 illustrations générées pour le jeu']],
    status: 'Million de Pixels est l’un des projets les plus solides du portfolio : tests unitaires nombreux, smoke E2E sur le build de production, migrations de sauvegarde et vrai modèle de reprise après restauration. Il reste toutefois un défaut important pour un idle : si la page reste simplement ouverte en arrière-plan, le retour au premier plan n’applique pas encore le rattrapage hors-ligne.'
  },
  lootchest: {
    type: 'product',
    kicker: 'RPG / LOOTER · BUILDS ET CRAFT',
    headline: 'Looter. Construire un build. Puis essayer de rendre chaque pièce meilleure.',
    narrative: 'Lootchest est le jeu que j’avais envie de lancer pour une boucle très précise : récupérer du stuff, équiper un personnage en pensant aux synergies, comparer les gains réels d’un objet puis pousser l’optimisation avec une forge profonde. Autour de ce noyau, le jeu a ensuite grandi en donjons, boss, progression, Plongée roguelite et village.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je voulais retrouver le plaisir du loot et de l’optimisation dans mon propre système.',
      paragraphs: [
        'Au départ, mon envie est très précise : looter de l’équipement, construire un personnage autour de synergies, chercher les meilleures combinaisons et continuer à travailler une bonne pièce au lieu de simplement attendre qu’un objet supérieur tombe. La profondeur de craft de Path of Exile, que je trouve incroyable, est une référence importante dans cette envie.',
        'Puis j’ai commencé à partager le lien à plusieurs personnes. Les retours ont nourri les itérations et le projet s’est mis à grossir bien au-delà de sa boucle initiale.'
      ],
    },
    features: [
      ['Le stuff doit donner envie de réfléchir', 'Raretés, affixes, préfixes, suffixes, sets, uniques et pièces procédurales ne servent pas seulement à faire monter un score. L’intérêt est de regarder ce qu’un objet change réellement dans le build et de décider s’il mérite d’être équipé, recyclé ou travaillé.'],
      ['Une forge inspirée par ce que j’aime dans Path of Exile', 'Le craft utilise notamment des monnaies dédiées pour transformer la rareté, ajouter ou relancer des affixes, modifier leurs valeurs ou cibler certaines améliorations. L’objectif est de laisser une marge de décision entre accepter le hasard et investir dans une pièce prometteuse.'],
      ['Le jeu a grandi autour de son noyau', 'Donjon, biomes, boss, talents, factions, prestige, contrats, Plongée roguelite et village sont venus ajouter de nouveaux objectifs sans remplacer la boucle centrale : trouver, comparer, équiper et optimiser.'],
    ],
    flowLabel: 'LA BOUCLE QUE JE VOULAIS JOUER',
    flowTitle: 'Trouver une pièce, comprendre sa valeur, la travailler, puis aller chercher mieux.',
    flow: [
      ['Je loot', 'Coffres et donjons génèrent des objets avec raretés, statistiques, affixes et identités différentes. Le premier plaisir reste celui de voir tomber quelque chose qui mérite d’être regardé.'],
      ['Je construis mon personnage', 'Je compare les objets avec ce qui est déjà équipé et je cherche des synergies entre statistiques, sets, talents et autres couches du build plutôt qu’un simple chiffre de puissance.'],
      ['Je travaille les bonnes pièces', 'La forge permet de modifier une pièce avec différentes monnaies et opérations. Un bon objet peut devenir un projet d’optimisation plutôt qu’un drop immédiatement jetable.'],
      ['Je repars plus loin', 'Le build sert ensuite à pousser le donjon, affronter des boss, explorer la Plongée et alimenter les systèmes de progression plus longs, dont le village et le prestige.'],
    ],
    aboutLabel: 'COMMENT LE PROJET A GROSSI',
    aboutTitle: 'Un prototype personnel devenu un terrain d’itération avec des joueurs.',
    about: [
      'Lootchest n’a pas été conçu d’un seul bloc avec tous ses systèmes prévus dès le départ. J’ai d’abord construit la boucle que je voulais jouer, puis les retours de plusieurs personnes à qui j’avais partagé le lien ont fait apparaître de nouvelles envies, des problèmes d’ergonomie, des besoins d’objectifs et des pistes d’équilibrage.',
      'L’historique du dépôt montre cette croissance : premières fonctions de forge, sets et prestige, remplacement de la forge initiale par un système de monnaies inspiré de Path of Exile, contrats, refonte de l’onboarding, puis ajout d’une vraie couche de village avec production, bâtiments et progression liée au donjon.'
    ],
    tech: [['Surface', 'Navigateur · mobile et desktop'], ['Stack', 'JavaScript / HTML / CSS sans framework ni bundler'], ['Loot', 'Affixes · sets · uniques · génération procédurale'], ['Craft', 'Monnaies dédiées · préfixes / suffixes · forge ciblée'], ['Sauvegarde', 'Locale · migrations · export / import JSON']],
    status: 'Lootchest est aujourd’hui un prototype public très riche, avec une vraie boucle de loot, de build et de craft entourée de nombreux systèmes de progression. Cette richesse est aussi sa dette principale : aucune suite de tests automatisés ne protège encore l’ensemble des combats, du loot, de la forge, du village ou des sauvegardes. Les exports personnels conviennent au backup ; l’import d’une sauvegarde externe n’est pas encore suffisamment durci pour être présenté comme une fonction de partage sûre.'
  },
  'afk-farm': {
    type: 'product',
    kicker: 'IDLE / INCRÉMENTAL · PROTOTYPE AVANCÉ',
    headline: 'Transformer un feeling de Sensoria en vraie boucle de jeu.',
    narrative: 'AFK Farm est né du Champ magnétique de Sensoria. J’ai tellement aimé le ressenti de cette interaction que j’ai voulu lui donner un but, une progression et une raison d’y revenir. L’idle s’est imposé naturellement : c’est un format que j’aime et une bonne porte d’entrée pour construire un jeu web riche sans devoir partir sur un moteur 3D lourd.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Le point de départ, c’était simplement un geste qui fonctionnait bien.',
      paragraphs: [
        'Dans Sensoria, le Champ magnétique avait un feeling que je trouvais vraiment réussi. Attirer les grains avec le doigt ou la souris était agréable en soi. Je me suis dit que cette sensation pouvait devenir le cœur d’un vrai jeu au lieu de rester une expérience isolée.',
        'Comme j’aime les jeux idle et que le navigateur se prête très bien à ce genre de progression, j’ai construit autour de cette interaction : d’abord la récolte, puis l’énergie, les combos, les drones, les chantiers, les biomes, le prestige et un arbre de progression beaucoup plus large que l’idée de départ.'
      ],
    },
    features: [
      ['Du geste à l’automatisation', 'Les premières récoltes se font directement dans le champ magnétique, avec énergie, stockage, chaînes de captures et Surge. Les drones et améliorations prennent ensuite progressivement une partie du travail à votre place.'],
      ['Une progression en couches', 'Projets temporisés, six biomes de base, progression procédurale au-delà, prestige, perks, succès et arbre déterministe à sept branches donnent plusieurs horizons de progression au lieu d’une simple courbe de chiffres.'],
      ['Un vrai jeu web sans 3D lourde', 'Interface touch-first, PWA, sauvegarde locale et rendu Canvas montrent qu’un format techniquement accessible peut quand même porter une boucle de jeu dense et accrocheuse.'],
    ],
    flowLabel: 'LA BOUCLE DE PROGRESSION',
    flowTitle: 'Récolter, construire, automatiser, repartir plus fort.',
    flow: [
      ['Je récolte', 'Je manipule le champ magnétique pour attirer les Lumens, gérer l’énergie, remplir la soute et profiter des combos ou du Surge.'],
      ['Je construis', 'Les ressources alimentent des chantiers temporisés qui débloquent progressivement de nouveaux biomes et de nouvelles règles.'],
      ['J’automatise', 'Les drones et différentes améliorations prennent en charge une partie de la production, y compris pendant les absences prises en compte par le système AFK.'],
      ['Je prestige', 'Les Cores et l’arbre de progression permettent de repartir avec des avantages permanents et d’accélérer les cycles suivants.'],
    ],
    aboutLabel: 'COMMENT LE PROJET A GROSSI',
    aboutTitle: 'Une intuition très simple devenue un laboratoire d’équilibrage.',
    about: [
      'Je n’avais pas un plan complet avec sept branches d’arbre et une chaîne de biomes dès le départ. Le projet a grandi de manière organique : une mécanique en appelait une autre, puis il fallait retrouver un rythme, un coût et une raison de revenir jouer activement malgré l’automatisation.',
      'C’est là que le projet devient intéressant techniquement et en game design : la récolte manuelle, les drones, les projets, le prestige et les biomes doivent tous progresser ensemble sans qu’un système rende les autres inutiles.'
    ],
    tech: [['Surface', 'Navigateur · PWA mobile-first'], ['Moteur', 'Canvas · tableaux typés · densité adaptée à l’écran'], ['Progression', 'Biomes · projets · prestige · arbre à 7 branches'], ['AFK', 'Rattrapage hors-ligne plafonné de base à 8 h']],
    status: 'AFK Farm est réellement jouable et la majorité de ses systèmes importants interagit déjà. Il reste pourtant un prototype avancé : le retour après simple mise en arrière-plan peut perdre une partie de la progression AFK, et les Cores servent à la fois de multiplicateur et de monnaie dépensable, ce qui peut rendre certains achats contre-productifs.'
  },
  diagnostic: {
    type: 'product',
    kicker: 'MÉDIATION NUMÉRIQUE · UTILISÉ EN ATELIER',
    headline: 'Comprendre un groupe avant de décider quoi lui apprendre.',
    narrative: 'Diagnostic numérique est né pour un besoin très concret : préparer un cycle de 12 ateliers numériques sans commencer par imposer un programme à l’aveugle. Je voulais savoir où les participants étaient à l’aise, où ils bloquaient et surtout distinguer ce qu’ils pensaient savoir de ce qu’ils arrivaient réellement à faire, sans transformer la première séance en examen.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je devais construire 12 ateliers, mais je ne voulais pas deviner les besoins du groupe.',
      paragraphs: [
        'Dans mon travail, on m’a demandé de créer, organiser et animer un cycle de 12 ateliers numériques dans un ESAT. Avant de préparer les onze séances suivantes, j’ai commencé par demander quels outils et besoins existaient réellement : Word, Excel, création d’étiquettes, usages quotidiens et difficultés concrètes.',
        'Pour la première séance, je voulais une évaluation douce. J’ai cherché des outils existants, mais ceux que je trouvais étaient souvent payants ou pas adaptés à ce que je voulais observer. J’ai donc construit ma propre plateforme avec des questions, des mini-jeux, des manipulations et un suivi animateur.'
      ],
    },
    features: [
      ['Pas de note globale', 'Le parcours évite volontairement le classement. Les réponses sont analysées par domaine afin de repérer des besoins utiles à l’atelier plutôt que de produire un score qui écrase les nuances.'],
      ['33 activités, plusieurs formes de preuve', '12 questions, 12 mini-jeux, 6 manipulations et 3 situations ouvertes permettent de croiser aisance déclarée, connaissances, pratique réelle et observations de l’animateur sur neuf domaines.'],
      ['Le diagnostic nourrit directement la suite', 'L’espace animateur rassemble progression, graphiques, matrice participant par domaine, écarts entre confiance et réponses, intérêts exprimés et une fonction Mes 12 ateliers pour transformer les besoins observés en programme de séances.'],
    ],
    flowLabel: 'COMMENT JE L’UTILISE EN ATELIER',
    flowTitle: 'Faire jouer, observer, comprendre, puis construire le programme.',
    flow: [
      ['Les participants se connectent', 'Chacun ouvre le lien sur son poste, renseigne son prénom et avance dans le parcours à son rythme.'],
      ['Le diagnostic varie les situations', 'Questions, mini-jeux, manipulations et situations ouvertes évitent de mesurer uniquement la théorie ou uniquement la vitesse.'],
      ['Je suis la séance', 'L’espace animateur me permet de voir l’avancement, ajouter des observations et commencer à repérer les domaines qui demandent le plus d’accompagnement.'],
      ['Je prépare les ateliers suivants', 'La synthèse et Mes 12 ateliers transforment les besoins et demandes du groupe en base de programme, que je peux ensuite réordonner et adapter.'],
    ],
    aboutLabel: 'LA PREUVE TERRAIN',
    aboutTitle: 'Je l’ai codé dans la semaine, puis utilisé le vendredi suivant.',
    about: [
      'Le projet n’est pas resté une démonstration. Je l’ai développé pendant la semaine puis utilisé en situation réelle à la fin de cette même semaine. Chaque participant avait un PC, j’ai distribué le lien et j’ai animé la séance en suivant la progression du groupe.',
      'Le test réel a aussi montré ce qu’un dépôt ou un écran de développement ne montre pas : certaines formulations pouvaient être plus claires. L’outil a tenu la séance, mais le terrain a immédiatement donné des pistes d’amélioration.'
    ],
    tech: [['Surface', 'Navigateur · GitHub Pages'], ['Parcours', '33 activités · 9 domaines · environ 90 min'], ['Animateur', 'Progression · observations · analytics · Mes 12 ateliers'], ['Données', 'Mode local/fichiers + intégration Supabase']],
    status: 'Diagnostic numérique a déjà été utilisé en atelier réel. Ce n’est ni un test psychométrique ni un outil de certification : il sert à préparer une médiation et à faire ressortir des besoins. La voie locale et la démonstration sont solides ; la configuration Supabase présente dans le dépôt doit encore être revalidée de bout en bout avant d’être présentée comme une collecte connectée totalement fiabilisée.'
  },
  perfoptimize: {
    type: 'product',
    kicker: 'ASSISTANT WINDOWS · OPTIMISATION JEU',
    headline: 'Comprendre pourquoi mon PC galérait avant de lui demander de changer quoi que ce soit.',
    narrative: 'Perfoptimize est né d’un problème personnel : avec une configuration qui devait normalement tenir mes jeux, j’avais quand même des lags et des crashs. Je ne savais pas toujours si le problème venait du jeu, de ses réglages ou de ma machine. L’idée est devenue un assistant local capable de mesurer ce qui se passe pendant une partie, d’identifier les goulots et de proposer des réglages pertinents pour ce PC précis, au lieu d’appliquer une recette générique.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Au départ, je voulais simplement comprendre ce qui arrivait à mon propre PC.',
      paragraphs: [
        'Je connais suffisamment les PC pour faire beaucoup de vérifications moi-même, mais pas au point de penser spontanément à toutes les pistes possibles. J’ai donc voulu automatiser une partie de cette analyse : détecter le jeu, observer la machine pendant qu’il tourne et faire ressortir les optimisations réellement pertinentes dans ce contexte.',
        'L’idée a ensuite grandi : si l’outil pouvait mesurer correctement mon cas, il pouvait aussi devenir utile à d’autres configurations. Mais le principe devait rester le même : mesurer et expliquer avant de modifier.'
      ],
    },
    features: [
      ['Observer la vraie machine', 'Détection matérielle, découverte de jeux, frametimes PresentMon, CPU, GPU, RAM, températures, incidents Windows et activité réseau donnent au diagnostic un contexte local au lieu de partir d’une fiche technique théorique.'],
      ['Dire d’où vient une recommandation', 'Le moteur distingue ce qui est estimé, validé par la communauté, benchmarké ou mesuré localement. Les recommandations portent aussi une sémantique d’action afin d’éviter de transformer mécaniquement chaque réglage vers le bas.'],
      ['Mesurer avant et après', 'Le mode tune peut encadrer une modification avec prévisualisation, sauvegarde, mesure avant/après et restauration. L’objectif est de pouvoir revenir en arrière si l’optimisation n’améliore rien.'],
    ],
    flowLabel: 'LE PARCOURS QUE JE VISAIS',
    flowTitle: 'Lancer le jeu, mesurer, comprendre, puis seulement ajuster.',
    flow: [
      ['Le jeu est détecté', 'Perfoptimize identifie le jeu actif et rassemble le contexte matériel et les configurations qu’il sait lire.'],
      ['La session est mesurée', 'Frametimes, charge CPU/GPU, mémoire, incidents et autres signaux permettent d’observer comment la machine se comporte réellement.'],
      ['Le diagnostic cherche le goulot', 'Le moteur relie les mesures à des hypothèses et formule des recommandations avec leur niveau de preuve plutôt que d’annoncer un boost abstrait.'],
      ['Une modification peut être vérifiée', 'Quand une action est compatible, elle peut être prévisualisée, sauvegardée et comparée sur une nouvelle mesure avant d’être conservée.'],
    ],
    aboutLabel: 'CE QUE LES TESTS RÉELS ONT CHANGÉ',
    aboutTitle: 'Le matériel réel a plusieurs fois contredit ce qui semblait correct dans le code.',
    about: [
      'Une première exécution sur mon PC a par exemple révélé que le moniteur Windows pouvait collecter zéro échantillon à cause du démarrage à froid de WMI. Une fois corrigé, la télémétrie est devenue plausible et il a fallu ensuite ajuster le rythme de collecte.',
      'Un autre essai sur Path of Exile a mis en évidence une recommandation dangereuse : le système pouvait conseiller de baisser Engine Multithreading alors que la logique du réglage était inversée par rapport à l’hypothèse du moteur. Ce test a poussé le modèle de recommandations vers une logique plus explicite d’action et de preuve. Ma machine est ensuite tombée en panne, ce qui a stoppé la validation matérielle plus large.'
    ],
    tech: [['Surface', 'Windows x64'], ['Architecture', '.NET · Core partagé · CLI · application locale ASP.NET'], ['Mesure', 'PresentMon · télémétrie système · incidents · réseau'], ['Qualité', 'xUnit · CI Linux + Windows · package autonome']],
    status: 'Perfoptimize est une alpha réellement testable et techniquement solide. Il a connu de vrais essais sur mon matériel, mais pas une validation large sur plusieurs configurations, notamment parce que mon PC est tombé en panne pendant le développement. Avant une diffusion grand public, il reste aussi à renforcer la signature du binaire, la chaîne de confiance de PresentMon et certains garde-fous de distribution.'
  },
  pipboy: {
    type: 'product',
    kicker: 'COMPAGNON JDR · MOBILE-FIRST · DÉMO NAVIGATEUR',
    headline: 'Faire du Pip-Boy un véritable objet de la partie.',
    narrative: 'Pip-Boy JDR est un compagnon numérique pour ma campagne Fallout. Côté joueur, il devient l’écran de référence pour consulter carte, journal, quêtes, personnes rencontrées, documents, terminaux et informations révélées pendant la partie. Côté MJ, une console séparée permet de préparer le contenu, de le garder secret puis de l’envoyer au bon moment.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je voulais que le Pip-Boy existe vraiment pendant la partie.',
      paragraphs: [
        'Le point de départ n’était pas de mieux ranger mes notes de MJ. En préparant ma campagne Fallout autour de Smoky Waters, je voulais rendre l’expérience plus sombre et plus immersive, avec un vrai compagnon mobile que le joueur puisse consulter comme s’il utilisait son propre Pip-Boy.',
        'Au début, l’idée est donc surtout côté joueur : faire du téléphone un objet de la fiction. Puis le projet grandit. Pour alimenter ce Pip-Boy pendant une séance, il me faut un espace MJ capable de préparer des informations à l’avance, de les garder invisibles et de les révéler exactement quand la fiction le justifie.'
      ],
    },
    features: [
      ['Un objet de jeu dans la poche', 'Carte interactive, journal, quêtes, personnes, faune, objets, holobandes et terminaux donnent au joueur un écran qu’il peut réellement consulter pendant la séance plutôt qu’une simple fiche de personnage numérique.'],
      ['Préparer sans révéler', 'La Console MJ regroupe fiches, scénarios, documents, cartes et éléments secrets. Je peux préparer beaucoup de contenu à l’avance sans le rendre visible, puis envoyer ou retirer une information quand la partie le demande.'],
      ['Faire évoluer la table en direct', 'Position, tokens, brouillard, scènes, table de jeu et révélations permettent au compagnon de suivre ce qui se passe réellement autour de la table au lieu de rester une encyclopédie statique.'],
    ],
    flowLabel: 'COMMENT ÇA SE PASSE À TABLE',
    flowTitle: 'Préparer, cacher, révéler.',
    flow: [
      ['Je prépare', 'Dans la Console MJ, je crée ou j’organise cartes, fiches, quêtes, documents, terminaux et éléments secrets avant ou pendant la séance.'],
      ['Je garde caché', 'Tant qu’une information n’a pas été découverte dans la fiction, elle reste hors de la vue joueur.'],
      ['Je révèle au bon moment', 'Quand la partie le justifie, j’envoie une fiche, un lieu, un indice ou un document. Le joueur le voit apparaître dans son Pip-Boy.'],
      ['Le Pip-Boy suit la partie', 'Carte, tokens, brouillard, journal et contenus révélés peuvent ensuite évoluer avec ce qui se passe réellement à table.'],
    ],
    aboutLabel: 'CE QUI SE PASSE SOUS LE CAPOT',
    aboutTitle: 'Cacher un secret dans l’interface ne suffisait pas.',
    about: [
      'La démo Labz condense volontairement le principe dans un seul navigateur grâce au stockage local. On peut passer de la Console MJ à la vue joueur, envoyer une fiche secrète puis vérifier immédiatement comment la révélation fonctionne, sans compte ni backend.',
      'Le mode connecté va plus loin : les secrets ne sont pas tous envoyés au téléphone du joueur puis masqués avec l’interface. PostgreSQL construit une projection filtrée de la campagne avant la réponse. Les tests SQL vérifient notamment la séparation propriétaire, joueur et tiers, ainsi que les révélations, retraits et conflits de révision.'
    ],
    tech: [['Surface', 'Navigateur · mobile-first'], ['Stack', 'React + TypeScript + Vite'], ['Démo', 'LocalStorage · aucun compte requis'], ['Mode connecté', 'Supabase · PostgreSQL · Realtime'], ['Validation', 'PGlite + smoke tests Chromium / WebKit']],
    status: 'La démo locale est aujourd’hui le meilleur parcours public pour découvrir le concept. Elle utilise les assets originaux ou générés pour le projet, l’ancienne carte officielle Fallout ayant été retirée du dépôt. Le mode connecté possède déjà une architecture serveur solide et des tests poussés, mais je veux encore refaire une recette complète sur deux appareils réels avant de le présenter comme parcours principal.'
  },
  constella: {
    type: 'suite',
    kicker: 'SUITE · CARTOGRAPHIE DE GOÛTS ET VEILLE',
    headline: 'Cartographier mes goûts, puis réutiliser la même idée pour cartographier l’information.',
    narrative: 'Constella est parti d’une envie très personnelle : représenter mes goûts autrement qu’avec une note ou une liste. Explore transforme des évaluations subjectives en constellations spatiales. Quand cette idée a commencé à prendre forme, j’ai réalisé que le même principe pouvait servir à autre chose qu’aux films, aux jeux ou à la musique. Watch applique donc cette logique à des sujets qui évoluent dans le temps : actualité IA, lois, géopolitique, jeux ou n’importe quelle veille thématique.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je voulais voir mes préférences comme une carte, pas comme un classement.',
      paragraphs: [
        'Le déclic vient de visualisations en grappes et en graphes que j’avais vues dans des vidéos et dans différents outils. Je me suis demandé si je pouvais construire une carte profondément personnelle de mes goûts, avec des critères qui changent selon le domaine. Comment comparer du rap, un film et un jeu sans prétendre qu’il existe une note objective commune ?',
        'J’ai commencé par Explore. J’ai notamment importé beaucoup de morceaux depuis Deezer pour tester le domaine musique. Quand les constellations ont commencé à fonctionner et que le concept m’a semblé suffisamment solide, j’ai vu qu’il pouvait être décliné : au lieu de cartographier des goûts, pourquoi ne pas cartographier un sujet vivant et son évolution ? C’est de là qu’est né Watch.'
      ],
    },
    branches: [
      ['Explore', 'Domaines, critères personnalisés, évaluations, duels, historique, PCA 3D, clusters, prédictions et recommandations servent à observer comment mes préférences s’organisent au lieu de les réduire à une seule note.'],
      ['Watch', 'Collecte multi-sources, filtrage, ranking, déduplication, alertes, journal, digests, contradictions, acteurs, citations et évolution d’un sujet transforment une masse d’articles en matière de veille exploitable.'],
    ],
    flowLabel: 'COMMENT L’IDÉE A ÉVOLUÉ',
    flowTitle: 'D’une constellation de goûts à une mémoire de veille.',
    flow: [
      ['J’évalue subjectivement', 'Explore accepte que mes critères et leur importance changent selon le domaine. Le but n’est pas de produire une vérité universelle, mais une géographie cohérente de mes propres préférences.'],
      ['La constellation fait apparaître des proximités', 'Projection spatiale, clusters, historique et similarité permettent de voir des familles de goûts et d’imaginer des suggestions proches de ce qui me correspond déjà.'],
      ['Je transpose le principe à l’information', 'Dans Watch, le domaine devient un sujet qui évolue. Plusieurs sources et articles peuvent être regroupés, filtrés et comparés au lieu d’être lus comme une pile indépendante.'],
      ['La synthèse devient une mémoire', 'À force d’avoir plusieurs articles sur le même sujet, l’idée a grandi vers des digests, la conservation des synthèses précédentes, un journal d’évolution puis un flux publiable sous forme d’article.'],
    ],
    foundation: ['Core partagé entre Explore et Watch', 'React + TypeScript · builds Suite / Explore / Watch séparés', 'Moteur spatial et persistance communs', 'Garde-fous automatisés sur les frontières produit'],
    aboutLabel: 'UNE CONCEPTION ORGANIQUE',
    aboutTitle: 'Le produit ne s’est pas dessiné en entier avant le premier écran.',
    about: [
      'Constella illustre bien ma manière de développer : je pars d’une intuition, je construis une première version, puis une contrainte fait apparaître la question suivante. Watch, par exemple, n’est pas né avec un journal et des articles prévus dès le départ. C’est l’accumulation de plusieurs sources sur un même sujet qui a rendu la synthèse nécessaire, puis la mémoire des synthèses, puis le suivi dans le temps.',
      'Cette croissance a fini par demander une vraie discipline d’architecture. Le projet sépare désormais Core, Explore et Watch et possède des garde-fous CI pour empêcher qu’une surface produit recommence à dépendre directement de l’autre.'
    ],
    status: 'Constella est un prototype privé avancé, volontairement en pause avant bêta. La base ARCH-030 a passé son quality gate complet, mais la synchronisation cloud du workspace complet reste un travail non intégré. La fiche présente donc ce qui existe réellement aujourd’hui, sans vendre une suite cloud déjà disponible.'
  },
  'ateliers-memoire': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · OUTILS D’ATELIER',
    headline: 'Quand PowerPoint a commencé à ressembler à un jeu, j’ai fini par coder les jeux directement.',
    narrative: 'Cette famille de petits projets vient d’un contexte d’animation d’ateliers mémoire en EHPAD et résidences seniors. Je devais proposer des activités autour de techniques mnémotechniques et de stimulation de l’attention. Les supports fournis me semblaient trop passifs, alors j’ai commencé par pousser PowerPoint jusqu’à en faire une aventure interactive, avant de réaliser que de petits programmes seraient plus rapides à construire, plus rejouables et plus adaptés à ce que je voulais faire vivre au groupe.',
    origin: {
      label: 'LE POINT DE DÉPART',
      title: 'Je cherchais des supports plus vivants que les présentations que j’avais sous la main.',
      paragraphs: [
        'Pendant une période de recherche d’emploi, j’ai rejoint une activité d’animation d’ateliers autour de la mémoire. J’ai animé une première séance en EHPAD et l’expérience s’est bien passée, mais le PowerPoint fourni me semblait confus et peu engageant.',
        'Quand on m’a ensuite demandé de préparer davantage de petits défis, j’ai commencé à fabriquer mes propres PowerPoint. Très vite, je les ai transformés en parcours avec choix, flèches, énigmes, zones cliquables et éléments à mémoriser. Le résultat plaisait, mais demandait énormément de temps. Comme je pouvais prototyper plus vite en Python ou dans le navigateur, j’ai fini par coder directement les activités.'
      ],
    },
    timeline: [
      ['Du support au jeu', 'Les premières créations restent des présentations, mais elles deviennent de plus en plus gamifiées jusqu’à dépasser ce que PowerPoint permet de produire efficacement.'],
      ['ClicReflex', 'Une activité chronométrée de précision et de rapidité au pointeur permet de rejouer, comparer son propre résultat et chercher à progresser sans dépendre d’une longue présentation.'],
      ['Tricat', 'Le principe devient un jeu web de catégorisation : 45 objets, neuf catégories, choix rapides, score, pénalité de temps et bilan de la partie.'],
      ['Ball Passing Simulation', 'Pour une séance précise, une simulation Pygame met en scène deux équipes, deux balles et plusieurs distracteurs visuels. Elle a réellement été utilisée ponctuellement en atelier EHPAD.'],
    ],
    flowLabel: 'LA LOGIQUE COMMUNE',
    flowTitle: 'Un besoin de séance, un petit outil, un usage immédiat.',
    flow: [
      ['Je pars de l’atelier', 'Je ne cherche pas d’abord à construire une plateforme. Je pars d’une activité ou d’un problème concret rencontré dans la préparation de la séance.'],
      ['Je prototype court', 'Le programme doit être suffisamment simple pour être lancé rapidement devant un groupe, sans transformer l’installation ou l’interface en sujet principal.'],
      ['L’activité doit pouvoir se rejouer', 'Score, temps ou variation des situations permettent de recommencer et de donner plus de dynamique qu’un contenu purement passif.'],
      ['Je garde seulement ce qui sert', 'Chaque outil peut rester petit et indépendant. La valeur de l’ensemble vient du contexte et de la démarche, pas d’une fausse suite logicielle unifiée.'],
    ],
    aboutLabel: 'UNE PISTE RESTÉE INACHEVÉE',
    aboutTitle: 'Toutes les idées n’ont pas été menées jusqu’au dépôt GitHub.',
    about: [
      'J’avais aussi commencé un prototype Python pour construire une table de rappel personnelle : associer chaque nombre à une image, puis s’entraîner dans les deux sens jusqu’à automatiser les associations. Cette piste est restée inachevée et n’a pas été conservée comme projet public.',
      'La collaboration professionnelle autour de ces ateliers s’est arrêtée avant que je poursuive cette série. Je préfère donc présenter ces outils pour ce qu’ils sont : des prototypes d’animation réellement contextualisés, pas des dispositifs thérapeutiques ni une méthode cliniquement validée.'
    ],
    status: 'Clicreflexe et Tricat sont de petites applications web réutilisables ; Ball Passing Simulation est un prototype Python utilisé ponctuellement sur le terrain. Aucun de ces outils n’est présenté comme thérapeutique ou médical. Leur intérêt dans Labz vient surtout du passage besoin d’atelier, prototype, usage concret.'
  },
  'crimson-s-blade': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · OUTIL DE GUILDE UTILISÉ',
    headline: 'Organiser un raid avant que deux heures disparaissent dans Discord.',
    narrative: 'Crimson’s Blade est né dans une guilde Throne and Liberty qui grandissait plus vite que son organisation. Les raids demandaient assez de joueurs, une composition viable, des disponibilités compatibles et des boss qui intéressaient réellement les participants. En pratique, une soirée annoncée à 18 h pouvait encore être en train de chercher quoi faire à 20 h. J’ai construit l’application pour transformer ce chaos en processus clair.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je ne cherchais pas à devenir chef de guilde, je voulais surtout arrêter de perdre du temps.',
      paragraphs: [
        'Dans les jeux de groupe, je finis assez souvent par prendre une place d’organisation sans forcément l’avoir cherchée. Sur Throne and Liberty, j’avais rejoint une guilde créée par un joueur console et ses cousins. La guilde a grandi, mais la gestion est restée très informelle.',
        'Le problème devenait particulièrement visible les soirs de raid : qui est disponible, quelle composition peut fonctionner, quel boss choisir, qui a besoin de quel loot, qui est en retard ? On pouvait passer une énorme partie de la soirée à discuter avant même de commencer. J’ai proposé de cadrer tout ça avec un outil dédié.'
      ],
    },
    timeline: [
      ['Centraliser les profils', 'L’application rassemble rôles de combat, gear score, rerolls, disponibilités et besoins de loot au lieu de reconstruire ces informations dans les discussions à chaque raid.'],
      ['Composer des groupes viables', 'La logique peut rechercher des groupes de six avec Tank, Healer et quatre DPS, en tenant compte des personnages principaux, rerolls et puissances disponibles.'],
      ['Planifier les raids', 'Les responsables programment un raid, associent un boss et suivent les inscriptions. Les joueurs peuvent retrouver les raids auxquels ils participent.'],
      ['Gérer le loot', 'Le projet va jusqu’aux loots obtenus, intérêts des joueurs, validations, rolls, résultats et notifications, ce qui transforme l’outil en vraie application métier de guilde.'],
    ],
    flowLabel: 'CE QUE JE VOULAIS ÉVITER',
    flowTitle: 'Ne plus découvrir les contraintes une fois tout le monde connecté.',
    flow: [
      ['Avant la soirée', 'Les disponibilités et besoins existent déjà dans l’outil. Le responsable peut donc voir plus tôt si un créneau et une composition sont réalistes.'],
      ['Au moment de former le groupe', 'Les rôles, rerolls et gear scores donnent une base concrète pour équilibrer l’équipe sans refaire un inventaire oral.'],
      ['Pour choisir la cible', 'Les boss et besoins de loot peuvent être reliés aux membres afin de choisir une activité qui a du sens pour les personnes présentes.'],
      ['Après le combat', 'Le workflow de loot garde une trace de ce qui est tombé, de qui est intéressé et de la distribution décidée.'],
    ],
    aboutLabel: 'USAGE RÉEL',
    aboutTitle: 'L’application a continué d’exister même quand je n’étais plus là pour la pousser.',
    about: [
      'Crimson’s Blade a été déployé sur OVH et réellement utilisé par la guilde. Ce n’était pas une maquette ou une démonstration de portfolio : l’outil servait aux membres et aux responsables dans le fonctionnement quotidien.',
      'Il est même resté en ligne et utilisable pendant une période où j’avais quitté la guilde et arrêté de jouer. Pour moi, c’est une preuve intéressante : le besoin n’était pas seulement lié à mon envie de développer, l’outil avait trouvé une utilité propre dans le groupe.'
    ],
    status: 'Je garde aujourd’hui Crimson’s Blade comme étude de cas historique plutôt que comme application à redéployer. Le dépôt contient des données anciennes et plusieurs dettes de sécurité ou d’intégrité métier identifiées par l’audit. La valeur de la fiche est donc le problème réel, l’usage réel et ce que l’exploitation m’a appris, pas la promesse d’une démo publique.'
  },
  'ecosysteme-rp': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · ÉCOSYSTÈME RP',
    headline: 'Plusieurs outils, deux histoires, un même réflexe : retirer de la gestion pour laisser plus de place au RP.',
    narrative: 'L’écosystème RP regroupe deux trajectoires différentes. Saloon puis HotzDoggz répondent, à plusieurs années d’écart, au même type de problème de gestion d’entreprise RP. ZepRasso puis Zepevents racontent une autre histoire : comment organiser des événements automobiles, tester le web et les QR codes, revenir au local quand le risque d’acceptation apparaît, puis revenir au web quand les usages réels valident l’idée.',
    timeline: [
      ['Saloon', 'Ma première rencontre avec la logistique d’une entreprise RP et l’envie de sortir d’Excel et de la gestion manuelle.'],
      ['HotzDoggz', 'Plusieurs années plus tard, le même type de besoin revient dans GTA RP. Je repars de zéro avec beaucoup plus d’expérience et construis un outil de gestion plus large, réellement utilisé.'],
      ['ZepRasso', 'Je construis une plateforme web et mobile pour organiser des événements automobiles, gérer participants, véhicules, concours, paiements et loteries, avec QR codes possibles.'],
      ['Zepevents puis retour à ZepRasso', 'Par crainte qu’un site externe ou les QR codes soient mal acceptés, je crée une alternative locale côté organisateur. Les premiers usages montrent finalement que le format web passe bien, ce qui me ramène vers ZepRasso, ensuite élargi.'],
    ],
    status: 'La fiche RP détaillée reste la référence pour cette histoire. Elle ne présente pas ces quatre dépôts comme quatre versions linéaires d’un même logiciel : elle distingue deux arcs et assume les détours, les retours en arrière et les choix faits après usage réel.'
  },
  totalwarai: {
    type: 'research',
    kicker: 'R&D · EXPÉRIMENTATION ARRÊTÉE',
    headline: 'Construire un agent tactique avec une vision incomplète de la bataille.',
    narrative: 'Total War AI était une expérimentation pour piloter une bataille de Total War: WARHAMMER III depuis un agent externe. Le pont Lua/Python, la télémétrie et les ordres de déplacement ont réellement fonctionné. Le résultat visuel était pourtant souvent décevant : certaines unités bougeaient mal, d’autres n’attaquaient pas, et l’armée se faisait écraser. En cherchant pourquoi, le projet a surtout révélé à quel point l’IA interne du jeu dispose d’un contexte que l’API externe ne donne pas directement.',
    origin: {
      label: 'POURQUOI J’AI POUSSÉ L’EXPÉRIENCE',
      title: 'L’idée me passionnait davantage que le résultat ne me satisfaisait.',
      paragraphs: [
        'Voir des unités commencer à réagir à des décisions prises hors du jeu était suffisamment fascinant pour me donner envie de continuer, même quand le comportement restait très mauvais en bataille réelle.',
        'Le développement est devenu progressivement empirique : observer ce qui échoue, deviner quelle information manque, ajouter ou reconstruire un signal, simuler, tester dans le vrai jeu, puis recommencer. Le problème est que chaque nouvelle armée ou stratégie adverse ouvrait encore de nouveaux cas à comprendre.'
      ],
    },
    question: 'Jusqu’où peut aller un agent tactique autonome quand l’API ne lui donne pas toute l’information dont dispose l’IA native du jeu ?',
    experiments: [
      ['Observer et agir', 'Le pont Lua/Python transforme l’état accessible de la bataille en données exploitables, puis renvoie des décisions et des ordres de déplacement au jeu.'],
      ['Simuler puis comparer', 'Des scénarios et simulations servent à ajuster les règles avant de les confronter au vrai moteur. Plusieurs corrections utiles en simulation ont pourtant produit un comportement moins bon en bataille réelle.'],
      ['Chercher l’information manquante', 'Le développement devient une enquête : identifier ce que l’agent ne sait pas, inférer ou reconstruire ce qui manque, tester, mesurer puis recommencer avec des armées et situations différentes.'],
    ],
    flowLabel: 'LA BOUCLE DE R&D',
    flowTitle: 'Observer un échec, formuler une hypothèse, simuler, retourner sur le terrain.',
    flow: [
      ['Je regarde ce que fait l’agent', 'Une unité qui avance sans attaquer ou une formation qui se disloque devient un symptôme à expliquer plutôt qu’un simple bug visuel.'],
      ['Je cherche le contexte absent', 'Moral, fatigue, largeur de front, terrain, obstacles, lignes de vue ou informations de pathfinding font partie des éléments qu’il faut parfois reconstruire ou approcher.'],
      ['Je teste hors du jeu', 'Le simulateur permet de vérifier rapidement certaines règles et d’éviter de relancer une bataille complète pour chaque hypothèse.'],
      ['Je reviens au vrai moteur', 'La bataille réelle reste le juge final. C’est elle qui révèle les écarts entre une règle plausible dans le modèle et ce que Total War fait réellement.'],
    ],
    learnings: [
      'L’agent externe ne dispose pas directement de plusieurs informations importantes comme le moral, la fatigue, la largeur de front ou une représentation complète des obstacles, forêts et lignes de vue.',
      'L’IA interne bénéficie du moteur, du terrain, du pathfinding, des formations et d’informations auxquelles le script externe n’accède pas de la même manière.',
      'Une simulation peut sécuriser une idée sans prédire correctement son comportement dans le vrai jeu.',
      'Continuer aurait demandé de reconstruire ou d’inférer progressivement une grande partie de ce contexte, avec un coût devenu disproportionné par rapport à l’objectif initial.'
    ],
    status: 'Le projet a été arrêté après des essais réels sans victoire. Ce n’est pas une IA capable de bien jouer à Total War. C’est une expérimentation qui a validé une partie de l’architecture puis mis en évidence une limite fondamentale d’information. Cette limite, et la méthode empirique utilisée pour la comprendre, constituent le résultat le plus intéressant du projet.'
  }
};

function heading(profile) {
  return `<header class="rich-project-heading"><span class="eyebrow">${esc(profile.kicker)}</span><h2>${esc(profile.headline)}</h2><p>${esc(profile.narrative)}</p></header>`;
}

function origin(profile) {
  return profile.origin?.paragraphs?.length ? `<section class="rich-about rich-origin"><span class="eyebrow">${esc(profile.origin.label || 'POURQUOI JE L’AI CRÉÉ')}</span><h3>${esc(profile.origin.title || '')}</h3>${profile.origin.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>` : '';
}

function flow(profile) {
  return profile.flow?.length ? `<section class="rich-about rich-product-flow"><span class="eyebrow">${esc(profile.flowLabel || 'COMMENT ÇA FONCTIONNE')}</span><h3>${esc(profile.flowTitle || '')}</h3><ol class="project-timeline">${profile.flow.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>` : '';
}

function about(profile) {
  return profile.about?.length ? `<section class="rich-about"><span class="eyebrow">${esc(profile.aboutLabel || 'À PROPOS')}</span><h3>${esc(profile.aboutTitle || '')}</h3>${profile.about.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>` : '';
}

function product(profile) {
  return `${heading(profile)}${origin(profile)}<div class="rich-feature-grid">${profile.features.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flow(profile)}${about(profile)}<div class="rich-project-columns"><section class="rich-tech"><span class="eyebrow">SOUS LE CAPOT</span><dl>${profile.tech.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section><section class="rich-status"><span class="eyebrow">ÉTAT DU PROJET</span><p>${esc(profile.status)}</p></section></div>`;
}

function suite(profile) {
  return `${heading(profile)}${origin(profile)}<div class="suite-branches">${profile.branches.map(([title,body]) => `<article><span class="suite-node" aria-hidden="true">✦</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flow(profile)}<section class="suite-foundation"><span class="eyebrow">LE SOCLE COMMUN</span><ul>${profile.foundation.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>${about(profile)}<section class="rich-status"><span class="eyebrow">STATUT</span><p>${esc(profile.status)}</p></section>`;
}

function caseStudy(profile) {
  return `${heading(profile)}${origin(profile)}<ol class="project-timeline">${profile.timeline.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol>${flow(profile)}${about(profile)}<section class="rich-status"><span class="eyebrow">CE QU’ON EN RETIENT</span><p>${esc(profile.status)}</p></section>`;
}

function research(profile) {
  return `${heading(profile)}${origin(profile)}<section class="research-question"><span class="eyebrow">QUESTION DE DÉPART</span><p>${esc(profile.question)}</p></section><div class="research-experiments">${profile.experiments.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flow(profile)}<section class="research-learnings"><span class="eyebrow">APPRENTISSAGES</span><ul>${profile.learnings.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>${about(profile)}<section class="rich-status"><span class="eyebrow">RÉSULTAT HONNÊTE</span><p>${esc(profile.status)}</p></section>`;
}

function markup(profile) {
  if (profile.type === 'suite') return suite(profile);
  if (profile.type === 'case') return caseStudy(profile);
  if (profile.type === 'research') return research(profile);
  return product(profile);
}

function currentProject() {
  const match = (location.hash || '').match(/^#\/projet\/([^/?]+)/);
  if (!match) return null;
  const id = decodeURIComponent(match[1]);
  return projects.find(project => project.id === id) || null;
}

function mountRichProjectPage() {
  const project = currentProject();
  const profile = project && profiles[project.id];
  const summary = main?.querySelector('.project-summary');
  if (!project || !profile || !summary || main.querySelector('[data-rich-project-page]')) return;
  main.classList.add('rich-project-detail');
  main.dataset.projectPageType = profile.type;
  const section = document.createElement('section');
  section.className = `project-rich project-rich-${profile.type}`;
  section.dataset.richProjectPage = '';
  section.innerHTML = markup(profile);
  summary.after(section);
}

const observer = new MutationObserver(mountRichProjectPage);
if (main) observer.observe(main, {childList:true, subtree:true});
window.addEventListener('hashchange', () => queueMicrotask(mountRichProjectPage));
mountRichProjectPage();