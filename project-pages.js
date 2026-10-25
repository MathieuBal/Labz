import { projects } from './catalog.js';

const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

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
        'Plutôt qu’un benchmark ou une seule démonstration, j’ai choisi d’en faire une collection. Chaque expérience isole un comportement différent et me donne un nouveau terrain pour tester une idée, une technique ou une contrainte. C’est aussi très proche de l’esprit que j’ai ensuite donné à Labz : expérimenter, montrer le résultat et apprendre de ce qui résiste.'
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
      'À l’échelle de 22 expériences, le défi devient aussi architectural : un InputManager commun gère les pointeurs, le RenderLoop borne le temps entre les images, le SceneManager démonte les scènes quand on les quitte et certaines expériences 3D sont chargées à la demande. Un moniteur de performance peut aussi réduire la qualité, même si toutes les scènes ne l’exploitent pas encore de la même manière.'
    ],
    tech: [['Surface', 'Navigateur · PWA installable'], ['Interaction', 'Pointer Events · souris / stylet / multi-touch'], ['Rendu', 'Canvas 2D + Three.js / WebGL2'], ['Architecture', 'RenderLoop · SceneManager · chargement dynamique'], ['Validation', 'Playwright desktop + mobile émulé']],
    status: 'Sensoria est public et les 22 expériences sont jouables. J’ai déjà plusieurs scripts Playwright qui vérifient les scènes et les interactions, mais ils ne bloquent pas encore la publication dans la CI et le facteur de qualité dynamique n’est pas utilisé uniformément partout. La prochaine étape est moins d’ajouter encore des tableaux que d’identifier ceux qui marquent vraiment, de consolider leur comportement et de les valider davantage sur de vrais appareils.'
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
      'Cette contrainte donne une raison à l’optimisation : améliorer un canon n’accélère pas seulement un compteur, cela change la vitesse à laquelle une couleur cède, la façon dont la surface s’ouvre et le moment où l’on peut réinvestir ailleurs. C’est là que l’idée très simple aperçue au départ devient un système beaucoup plus large.'
    ],
    tech: [['Monde', '1024 × 1024 · TypedArrays et index spécialisés'], ['Rendu', 'PixiJS / WebGL2 · simulation séparée du visuel'], ['Traitement', 'Workers pour image et reprise hors-ligne'], ['Sauvegarde', 'IndexedDB · migrations v1 → v6'], ['Contenu', 'Import libre + campagne de 56 illustrations générées pour le jeu']],
    status: 'Million de Pixels est l’un des projets les plus solides du portfolio : tests unitaires nombreux, smoke E2E sur le build de production, migrations de sauvegarde et vrai modèle de reprise après restauration. Il reste toutefois un défaut important pour un idle : si la page reste simplement ouverte en arrière-plan, le retour au premier plan n’applique pas encore le rattrapage hors-ligne. La prochaine passe doit fermer ce trou puis brancher les tests existants sur la CI avant chaque déploiement.'
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
        'Puis j’ai commencé à partager le lien à plusieurs personnes. Les retours ont nourri les itérations et le projet s’est mis à grossir bien au-delà de sa boucle initiale. L’historique du dépôt le montre bien : la forge s’est enrichie, les sets et le prestige sont arrivés, puis les monnaies de craft inspirées de Path of Exile, les contrats, l’onboarding, la Plongée, le village et d’autres couches de progression.'
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
      'Cette croissance se voit directement dans les commits : premières fonctions de forge, sets et prestige, remplacement de la forge initiale par un système de monnaies inspiré de Path of Exile, contrats pour donner une direction aux sessions, refonte de l’onboarding, puis ajout d’une vraie couche de village avec production, bâtiments et progression liée au donjon. La richesse actuelle vient de cette accumulation d’itérations, avec le risque inverse de devoir maintenant mieux protéger et équilibrer tout ce qui s’est empilé.'
    ],
    tech: [['Surface', 'Navigateur · mobile et desktop'], ['Stack', 'JavaScript / HTML / CSS sans framework ni bundler'], ['Loot', 'Affixes · sets · uniques · génération procédurale'], ['Craft', 'Monnaies dédiées · préfixes / suffixes · forge ciblée'], ['Sauvegarde', 'Locale · migrations · export / import JSON']],
    status: 'Lootchest est aujourd’hui un prototype public très riche, avec une vraie boucle de loot, de build et de craft entourée de nombreux systèmes de progression. Cette richesse est aussi sa dette principale : aucune suite de tests automatisés ne protège encore l’ensemble des combats, du loot, de la forge, du village ou des sauvegardes. Les exports personnels conviennent au backup ; l’import d’une sauvegarde externe n’est pas encore suffisamment durci pour être présenté comme une fonction de partage sûre.'
  },
  'afk-farm': {
    type: 'product',
    kicker: 'IDLE / INCRÉMENTAL · PROTOTYPE AVANCÉ',
    headline: 'Un champ magnétique agréable à toucher, transformé en boucle de progression.',
    narrative: 'AFK Farm est né du tableau Champ magnétique de Sensoria. J’ai adoré le feeling de cette interaction et j’ai eu envie de lui donner un objectif de jeu. L’idle s’est imposé naturellement : c’est un format que j’aime et une bonne porte d’entrée pour construire un jeu web sans partir sur la lourdeur d’une production 3D. Le geste magnétique a ensuite grandi autour d’une vraie progression : énergie, combos, drones, chantiers, biomes, prestige et arbre à sept branches.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Le point de départ, c’était vraiment le feeling du Champ magnétique.',
      paragraphs: [
        'Je n’avais pas un grand problème à résoudre ni un concept complet en tête. Dans Sensoria, le tableau Champ magnétique était simplement très agréable à manipuler. Je me suis dit que ce geste pouvait être encore plus intéressant s’il devenait le cœur d’un jeu avec un objectif, une économie et une progression.',
        'Le format idle s’y prêtait bien. Il permet de construire rapidement une boucle de jeu dans le navigateur, sans avoir besoin d’un moteur 3D lourd, tout en gardant suffisamment de place pour créer des accroches, de l’optimisation et une progression qui donne envie de revenir.'
      ],
    },
    features: [
      ['Du geste à l’automatisation', 'Les premières récoltes se font directement dans le champ magnétique, avec énergie, stockage, chaînes de captures et Surge. Les drones et améliorations prennent ensuite progressivement une partie du travail à votre place.'],
      ['Une progression en couches', 'Projets temporisés, six biomes de base, progression procédurale au-delà, prestige, perks, succès et arbre déterministe donnent plusieurs horizons de progression au lieu d’une simple courbe de chiffres.'],
      ['Chaque biome change les règles', 'Les environnements ne se contentent pas de changer le décor : densité, réapparition, chance, puissance magnétique, stockage, drones ou potentiel de combo peuvent modifier la façon de progresser.'],
    ],
    flowLabel: 'LA BOUCLE',
    flowTitle: 'Toucher, récolter, construire, automatiser.',
    flow: [
      ['Je récolte activement', 'Le doigt ou la souris agit comme un pôle magnétique. Énergie, temps et capacité de soute encadrent la session, tandis que combo et Surge récompensent une récolte plus active.'],
      ['J’investis', 'Les Lumens servent à renforcer la production et à avancer dans des chantiers construits pièce par pièce.'],
      ['J’automatise', 'Les drones prennent progressivement le relais et le jeu calcule aussi une partie de la progression pendant l’absence.'],
      ['Je change d’échelle', 'Les chantiers débloquent de nouveaux biomes, puis le prestige et l’arbre à sept branches ouvrent une progression plus longue.'],
    ],
    aboutLabel: 'COMMENT LE PROTOTYPE A GRANDI',
    aboutTitle: 'Une interaction simple devenue un système beaucoup plus large.',
    about: [
      'Le projet s’est développé de manière organique. Une fois la récolte agréable, la question suivante était de lui donner une économie, puis de créer de l’automatisation, puis des objectifs plus longs, puis des biomes suffisamment différents pour ne pas être de simples changements de couleur.',
      'Le code reflète cette montée en complexité : reprise hors-ligne, chantiers temporisés, mécaniques propres aux biomes, succès, prestige et arbre déterministe de sept branches. Le prototype est déjà dense, même si l’équilibrage n’est pas encore celui d’un jeu terminé.'
    ],
    tech: [['Surface', 'Navigateur · PWA mobile-first'], ['Moteur', 'Canvas · tableaux typés · densité adaptée à l’écran'], ['Progression', 'Biomes · projets · prestige · arbre à 7 branches'], ['AFK', 'Rattrapage hors-ligne · plafond de base 8 h'], ['État', 'Prototype avancé · jouable']],
    status: 'AFK Farm est réellement jouable et la majorité de ses systèmes importants interagit déjà. Il reste pourtant un prototype avancé : le retour après simple mise en arrière-plan peut perdre une partie de la progression AFK, et les Cores servent à la fois de multiplicateur et de monnaie dépensable, ce qui peut rendre certains achats contre-productifs. La fiche assume ces limites au lieu de présenter le jeu comme équilibré ou terminé.'
  },
  diagnostic: {
    type: 'product',
    kicker: 'OUTIL DE MÉDIATION · UTILISÉ EN ATELIER',
    headline: 'Comprendre un groupe avant de décider quoi lui apprendre.',
    narrative: 'Diagnostic numérique est une plateforme de positionnement que j’ai construite pour préparer un cycle réel de douze ateliers numériques. Les participants avancent dans des questions, mini-jeux, manipulations et situations concrètes ; de mon côté, je peux suivre leur progression, observer les écarts entre aisance déclarée et pratique réelle, puis construire les ateliers suivants à partir de besoins visibles plutôt que d’hypothèses.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Je devais préparer douze vendredis d’ateliers, mais je ne voulais pas commencer par un examen.',
      paragraphs: [
        'Dans mon travail, on m’a demandé de créer, organiser et animer un nouveau cycle de douze ateliers numériques dans un ESAT. Avant de construire le programme, j’ai commencé par demander aux participants ce qu’ils utilisaient déjà et ce dont ils avaient besoin : Word, Excel, création d’étiquettes et d’autres usages très concrets.',
        'Pour la première séance, je voulais aller plus loin sans mettre le groupe sous pression. L’idée était de voir où chacun se sentait à l’aise, où la pratique coinçait réellement et quels écarts existaient entre théorie et manipulation. J’ai regardé les outils disponibles en ligne, mais ceux que je trouvais étaient souvent payants ou pas adaptés à ce que je voulais faire. Le plus simple a fini par être de construire le mien.'
      ],
    },
    features: [
      ['Pas un score, une carte des besoins', 'Le parcours répartit les observations sur neuf domaines et garde séparés les réponses, les difficultés, les demandes d’aide et les situations où il manque simplement des preuves. Il n’y a ni classement ni note globale.'],
      ['Plus qu’un questionnaire', 'La version actuelle combine 12 questions, 12 mini-jeux, 6 manipulations réelles et 3 situations ouvertes. L’animateur peut donc comparer ce que la personne pense savoir faire avec ce qu’elle fait réellement pendant la séance.'],
      ['Le diagnostic sert à préparer la suite', 'L’espace animateur rassemble progression, observations, graphiques, matrice participant par domaine, intérêts et synthèse. La fonction Mes 12 ateliers transforme ensuite ces besoins en une proposition de programme modifiable plutôt qu’en résultat figé.'],
    ],
    flowLabel: 'COMMENT JE L’UTILISE EN ATELIER',
    flowTitle: 'Faire travailler le groupe, observer, puis construire la suite.',
    flow: [
      ['Les participants se connectent', 'Chacun ouvre le lien sur son poste, renseigne son prénom ou pseudonyme et avance dans le parcours à son rythme.'],
      ['Le site alterne les formes', 'Questions, mini-jeux, manipulations et situations évitent de transformer la séance en QCM monotone et donnent plusieurs façons de montrer une difficulté ou une aisance.'],
      ['Je suis la séance', 'L’espace animateur me permet de voir l’avancement, ajouter mes propres observations et repérer progressivement les domaines qui méritent d’être travaillés.'],
      ['Je prépare les douze ateliers', 'La restitution et les demandes du groupe servent ensuite de matière pour ordonner, modifier et sauvegarder un programme d’ateliers réellement adapté aux participants présents.'],
    ],
    aboutLabel: 'LE TEST QUI COMPTAIT',
    aboutTitle: 'Je l’ai codé dans la semaine, puis utilisé le vendredi suivant.',
    about: [
      'Le projet n’est pas resté une idée de portfolio. Je l’ai développé pendant la semaine puis je l’ai utilisé en direct à la fin de cette même semaine : chaque participant avait un PC, recevait le lien et réalisait le parcours pendant que je suivais la séance. Je l’avais présenté simplement comme une façon moins ennuyeuse de comprendre ce qui pourrait leur être utile pendant les ateliers suivants.',
      'La séance a tenu jusqu’au bout et l’outil a rempli son rôle. Le terrain a aussi montré ce qu’un test automatique ne dit pas : certaines questions pouvaient être formulées plus clairement et la compréhension réelle des consignes compte autant que la logique du code. C’est précisément ce type de retour qui donne de la valeur au projet.'
    ],
    tech: [['Parcours', 'Environ 90 min · 33 activités · 36 écrans · 9 domaines'], ['Données', 'Mode local / fichiers + intégration Supabase'], ['Animateur', 'Observations · analyses · CSV · programme de 12 ateliers'], ['Validation', 'Tests Node + contrôle syntaxique avant GitHub Pages'], ['Positionnement', 'Outil de médiation · pas une évaluation clinique']],
    status: 'Diagnostic numérique a déjà été utilisé dans un vrai atelier et la démonstration locale est autonome. L’intégration Supabase est présente et configurée dans le dépôt, mais son fonctionnement connecté doit encore être revalidé de bout en bout avant une nouvelle séance. L’outil ne prétend ni certifier des compétences ni produire une évaluation médicale ou psychométrique : il sert à préparer une médiation plus adaptée à un groupe concret.'
  },
  perfoptimize: {
    type: 'product',
    kicker: 'OUTIL WINDOWS · ALPHA',
    headline: 'Pourquoi mon PC rame alors qu’il devrait tenir ce jeu ?',
    narrative: 'Perfoptimize est né pour répondre à cette question sur ma propre machine. L’outil détecte le matériel et le jeu lancé, mesure ce qui se passe réellement pendant la partie, cherche le goulot ou l’incident probable, puis propose des optimisations pertinentes pour cette configuration et ce contexte. Le principe est de mesurer avant de conseiller, d’expliquer le niveau de confiance et de rendre les modifications réversibles.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'J’avais des lags et des crashs sur un PC qui, sur le papier, devait mieux s’en sortir.',
      paragraphs: [
        'Depuis que j’avais ce PC, certains jeux pouvaient laguer ou planter alors que la configuration me semblait suffisante. Je ne savais pas toujours si le problème venait du jeu lui-même, d’un réglage, d’un pilote, d’un composant ou d’un comportement de la machine. Le projet a donc commencé très simplement : comprendre ce qui se passait réellement sur mon propre PC.',
        'Je connais l’informatique, mais pas au point d’avoir spontanément en tête chaque réglage, capteur ou cause possible. J’ai donc voulu automatiser une partie de cette recherche : observer le jeu en cours, croiser les mesures avec la configuration et faire remonter des optimisations auxquelles je n’aurais pas forcément pensé. Si cette aide était utile sur ma machine, elle pouvait potentiellement l’être ailleurs aussi.'
      ],
    },
    features: [
      ['Voir ce qui se passe réellement', 'CPU, GPU, RAM, VRAM, températures, frametimes, FPS, latence pilote, processus concurrents, incidents Windows et connexions réseau servent à distinguer un ressenti de ce que la machine permet réellement d’observer.'],
      ['Conseiller sans tout baisser', 'Chaque réglage possède une action et un niveau de preuve. Perfoptimize peut recommander de baisser, désactiver, conserver activé, tester plusieurs alternatives ou laisser un réglage manuel. Un conseil estimé n’est pas présenté comme une mesure locale.'],
      ['Modifier avec un filet de sécurité', 'Une analyse ne change rien par défaut. Les réglages compatibles passent par prévisualisation, sauvegarde et restauration, et la boucle tune peut comparer un avant et un après plutôt que supposer qu’un changement a aidé.'],
    ],
    flowLabel: 'LE PARCOURS QUE JE VISAIS',
    flowTitle: 'Lancer le jeu, comprendre le PC, obtenir des réglages adaptés à ce qui se passe maintenant.',
    flow: [
      ['Je lance un jeu', 'Perfoptimize détecte le processus, retrouve si possible le profil du jeu et peut aussi découvrir des installations Steam ou Epic sur plusieurs disques.'],
      ['Il mesure', 'Le moniteur attribue les ressources au jeu, suit FPS et frametimes quand PresentMon est disponible et observe en parallèle les autres signaux de la machine.'],
      ['Il construit un diagnostic', 'Goulot CPU ou GPU, contention externe, température, latence, incident système ou simple réglage trop coûteux sont distingués avec un niveau de confiance.'],
      ['Il propose puis vérifie', 'Les recommandations sont contextualisées pour le matériel, le jeu et l’objectif. Quand un changement est appliqué et mesuré, l’outil peut comparer le niveau de FPS avant et après au lieu de promettre un gain théorique.'],
    ],
    aboutLabel: 'CE QUE LES TESTS RÉELS ONT CHANGÉ',
    aboutTitle: 'Le projet s’est construit par aller-retour entre code et vraie machine.',
    about: [
      'Un premier essai sur mon PC a immédiatement cassé une hypothèse confortable : le moniteur affichait zéro échantillon pendant toute la fenêtre de mesure. Le problème venait notamment du démarrage à froid de WMI et des délais de télémétrie Windows. J’ai ajouté des timeouts, un diagnostic par sous-système et changé le calcul de la fenêtre pour qu’un backend lent ne consomme pas toute la session avant même la première mesure.',
      'Un autre test sur Path of Exile a révélé quelque chose de plus important encore : une recommandation automatique pouvait être techniquement cohérente dans le modèle et pourtant dangereuse dans le vrai jeu. L’outil proposait de réduire Engine Multithreading alors qu’il fallait au contraire le conserver. C’est ce qui a poussé le modèle vers des actions explicites et des niveaux de preuve. Le développement a continué dans cette logique empirique jusqu’à ce que mon PC tombe en panne, ce qui a coupé la possibilité de poursuivre une validation matérielle plus large.'
    ],
    tech: [['Surface', 'Windows x64 · exécutable autonome'], ['Moteur', '.NET · Core partagé CLI / interface'], ['Mesure', 'PresentMon · télémétrie Windows · historique SQLite'], ['Diagnostic', 'Conseils contextuels · incidents · réseau · SystemAdvisor'], ['Sécurité d’action', 'Prévisualisation · sauvegarde · restauration']],
    status: 'Perfoptimize a réellement été testé sur ma propre machine Windows, et ces essais ont fait évoluer le code. Il reste néanmoins une alpha : je n’ai pas pu aller jusqu’à une validation complète sur plusieurs configurations, notamment parce que le PC utilisé pendant le développement est tombé en panne. Le binaire Windows n’est pas signé et la chaîne de confiance autour de PresentMon doit encore être renforcée avant une diffusion large. La page présente donc un assistant ambitieux et déjà substantiel, pas un optimiseur universel garanti.'
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
    kicker: 'SUITE PRODUIT · EXPLORE + WATCH',
    headline: 'Cartographier ce que j’aime, puis utiliser la même logique pour suivre ce qui change.',
    narrative: 'Constella est une suite construite autour d’une même idée : organiser des éléments complexes en constellations plutôt qu’en listes plates. Explore s’en sert pour cartographier des goûts et des préférences personnelles. Watch reprend cette logique pour agréger, rapprocher et suivre des informations qui évoluent dans le temps. Les deux produits partagent un Core, mais leurs modèles et leurs interfaces restent séparés.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Au départ, je voulais donner une forme visible à quelque chose de profondément subjectif : mes goûts.',
      paragraphs: [
        'L’idée est née en voyant des schémas en grappes, des cartes relationnelles et des visualisations utilisées dans des vidéos ou des outils existants. Je me suis demandé si je pouvais utiliser ce type de représentation pour cartographier mes propres goûts : musique, jeux, films et autres domaines, avec plusieurs critères plutôt qu’une note unique.',
        'La subjectivité est volontaire. Comparer un morceau de rap avec un autre style n’a pas besoin de produire une vérité universelle. Je voulais construire ma constellation personnelle, avec mes critères et mes préférences. J’ai notamment importé beaucoup de morceaux depuis Deezer pour éprouver le principe sur la musique.'
      ],
    },
    branches: [
      ['Explore', 'Créer des domaines, définir des critères, noter ou comparer des items, suivre l’évolution des préférences et les projeter en 3D. PCA, constellations, regroupements, ghosts, similarités et recommandations servent à faire apparaître une structure dans un goût personnel.'],
      ['Watch', 'Créer une veille thématique, collecter plusieurs sources, filtrer et dédupliquer les observations, puis produire des digests qui conservent acteurs, contradictions, citations, évolution, questions ouvertes et pistes de lecture. Le digest peut ensuite devenir un brouillon d’article puis du Markdown ou un document imprimable.'],
    ],
    flowLabel: 'COMMENT L’IDÉE A CHANGÉ D’ÉCHELLE',
    flowTitle: 'Des goûts personnels à une mémoire de veille.',
    flow: [
      ['Je cartographie des préférences', 'Explore commence comme un outil très personnel : plusieurs critères, des comparaisons et une représentation spatiale pour voir comment mes goûts se regroupent.'],
      ['La constellation devient le vrai concept', 'Quand les premières constellations prennent forme, je réalise que la représentation elle-même est suffisamment intéressante pour être déclinée ailleurs que dans la musique, les films ou les jeux.'],
      ['Je remplace le domaine par un sujet vivant', 'Dans Watch, le domaine peut devenir l’IA, une évolution juridique, la géopolitique ou l’actualité d’un jeu. Les éléments ne sont plus seulement des œuvres : ce sont des observations et des articles qui arrivent dans le temps.'],
      ['Je construis une continuité', 'Lire plusieurs articles sur le même sujet un par un devient vite pénible. Le projet ajoute alors synthèse multi-source, conservation des digests précédents, journal, évolution et workflow d’article pour ne pas recommencer la compréhension à zéro à chaque nouvelle information.'],
    ],
    aboutLabel: 'UNE CONSTRUCTION ORGANIQUE',
    aboutTitle: 'Chaque nouvelle fonction est arrivée parce que la précédente faisait apparaître le problème suivant.',
    about: [
      'Constella n’a pas été conçu dès le départ comme une grande suite Explore + Watch avec toute son architecture actuelle. J’ai d’abord voulu voir des goûts sous forme de constellation. Une fois le concept suffisamment solide pour être réutilisé, la veille est devenue une autre application possible. Puis la multiplication des articles a fait naître le besoin de synthèse, la synthèse celui de mémoire, et cette mémoire celui d’un journal puis d’un workflow de publication.',
      'Cette croissance explique aussi le chantier d’architecture mené ensuite : séparer clairement Core, Explore et Watch, isoler les états et les builds, puis préparer une persistance distante sécurisée sans mélanger les deux produits.'
    ],
    foundation: ['Core partagé pour les primitives, la composition et le pipeline spatial', 'Explore et Watch isolés par des frontières d’architecture testées', 'Mode local + trajectoire Cloudflare Worker / D1 pour la persistance distante', 'Builds séparés Explore, Watch et Suite'],
    status: 'Constella possède aujourd’hui un socle fonctionnel et architectural important, mais la suite est volontairement en pause avant bêta. Explore et Watch existent réellement ; le quality gate d’architecture a été poussé jusqu’à ARCH-030. La synchronisation complète du workspace, le provisioning Cloudflare réel et le premier déploiement bêta restent à terminer et à valider avant de présenter la suite comme service disponible.'
  },
  'ateliers-memoire': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · MÉDIATION · USAGE TERRAIN',
    headline: 'Quand PowerPoint devient trop lourd pour ce que je veux faire, je code l’exercice.',
    narrative: 'Cette famille de petits outils est née pendant des ateliers autour de la mémoire et des techniques mnémotechniques en EHPAD et résidences seniors. Je ne cherchais pas à construire une plateforme cognitive : je voulais rendre les séances plus interactives. ClicReflexe, Tricat et Ball Passing Simulation sont trois réponses simples à des besoins de séance différents.',
    origin: {
      label: 'COMMENT J’EN SUIS ARRIVÉ LÀ',
      title: 'J’ai commencé avec des PowerPoint, puis j’ai fini par essayer de transformer PowerPoint en jeu.',
      paragraphs: [
        'En cherchant du travail, j’ai rejoint une activité d’animation d’ateliers autour des techniques de mémoire : palais mental, associations, tables de rappel et autres méthodes mnémotechniques. J’ai animé une première séance en EHPAD qui s’est bien passée, mais le support PowerPoint fourni me paraissait peu clair et surtout trop passif pour ce que j’avais envie de faire avec le groupe.',
        'Quand il a ensuite été question de produire régulièrement de petits défis, j’ai commencé par fabriquer mes propres PowerPoint. Très vite, mon réflexe de gamification a pris le dessus : chemins, flèches, décisions, énigmes, zones cliquables, symboles à retenir, presque une petite aventure. Les participants appréciaient, mais le temps nécessaire pour fabriquer ce genre d’expérience dans PowerPoint devenait absurde.'
      ],
    },
    timeline: [
      ['Passer du support au jeu', 'Je me suis dit que, puisque je pouvais prototyper rapidement en Python ou dans le navigateur, il était plus logique de construire de petits programmes interactifs que de continuer à forcer PowerPoint à faire ce pour quoi il n’était pas conçu.'],
      ['ClicReflexe', 'Une activité chronométrée et rejouable autour du clic, de la précision et du temps de réaction. La version web tient dans un fichier autonome, fonctionne à la souris et au tactile et affiche précision et temps moyen.'],
      ['Tricat', 'Un jeu de catégorisation de 60 secondes avec neuf catégories et 45 objets. Une bonne réponse rapporte des points, une erreur coûte du temps, puis le bilan affiche score, bonnes réponses, temps moyen et objets traités.'],
      ['Ball Passing Simulation', 'Un prototype Pygame utilisé ponctuellement pendant un atelier en EHPAD : deux équipes, des passes à suivre et plusieurs distracteurs visuels pour soutenir un exercice d’attention construit pour cette séance.'],
      ['Une série interrompue', 'J’avais aussi commencé à explorer un outil autour des tables de rappel, avec association nombre-image et exercices dans les deux sens. La collaboration professionnelle s’est arrêtée avant que ce prototype soit mené plus loin, et j’ai arrêté la série à ce moment-là.'],
    ],
    aboutLabel: 'CE QUE CETTE SÉRIE RACONTE',
    aboutTitle: 'Construire juste assez d’outil pour rendre une séance meilleure.',
    about: [
      'Ces projets ne sont pas intéressants parce qu’ils seraient techniquement énormes. Ils montrent plutôt un réflexe de médiation : lorsqu’un support devient une contrainte, je préfère fabriquer une interaction courte, répétable et adaptée au groupe plutôt que rester enfermé dans le format initial.',
      'Ils montrent aussi pourquoi le navigateur est souvent devenu mon format préféré pour ce type d’usage. ClicReflexe et Tricat réduisent la friction d’installation et peuvent être relancés facilement, alors que Ball Passing Simulation garde la trace d’un prototype plus ponctuel créé pour une séance précise.'
    ],
    tech: [['ClicReflexe', 'Web autonome · souris / tactile · session de 60 s'], ['Tricat', 'Web · 9 catégories · 45 objets · tests HTML présents'], ['Ball Passing', 'Python / Pygame · simulation de 60 s'], ['Usage', 'Supports d’atelier · aucune validation clinique']],
    status: 'Ces outils ont été conçus pour rendre des ateliers plus interactifs, pas pour diagnostiquer, traiter ou prouver une amélioration cognitive. Ball Passing Simulation a été utilisé ponctuellement en EHPAD ; ClicReflexe et Tricat sont des exercices légers et rejouables. Tricat reste la meilleure candidate pour une démo publique plus aboutie après un passage supplémentaire sur les tests et l’accessibilité.'
  },
  'crimson-s-blade': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · OUTIL DE GUILDE · USAGE RÉEL',
    headline: '18 h prévu. 20 h, toujours pas de raid. J’ai voulu arrêter de perdre des soirées à organiser.',
    narrative: 'Crimson’s Blade était l’outil interne d’une guilde Throne and Liberty. Il centralisait profils, rôles, gear score, rerolls, disponibilités, besoins de loot, raids et distribution de récompenses afin de transformer une organisation très orale et chaotique en informations utilisables avant que tout le monde soit déjà connecté.',
    origin: {
      label: 'POURQUOI JE L’AI CRÉÉ',
      title: 'Le problème n’était pas le jeu. C’était tout le temps perdu avant de pouvoir jouer.',
      paragraphs: [
        'Dans les jeux de groupe, je me retrouve assez naturellement à prendre des responsabilités sans forcément les chercher. Sur Throne and Liberty, j’avais rejoint une guilde créée par un joueur console et des membres de sa famille. La guilde a grandi, mais l’organisation est restée très improvisée, et je supporte mal de perdre du temps pour des problèmes qui pourraient être anticipés.',
        'Les raids résumaient parfaitement le problème : il fallait assez de monde, des rôles équilibrés, connaître les disponibilités, choisir un boss qui intéresse réellement les joueurs et tenir compte du loot recherché. Une heure pouvait être annoncée, certains arrivaient plus tard, puis une fois le groupe réuni il fallait encore discuter du boss et des besoins de chacun. Il pouvait être 20 h pour un raid prévu à 18 h sans que la partie ait réellement commencé.'
      ],
    },
    timeline: [
      ['Rassembler les informations avant le raid', 'Je voulais une entrée simple où chacun pouvait renseigner son personnage, son rôle, son gear score, ses rerolls, ses disponibilités et ce qu’il cherchait à obtenir. Le but était de déplacer les discussions répétitives vers des données déjà disponibles.'],
      ['Relier les besoins au contenu du jeu', 'J’ai renseigné manuellement les boss et les besoins de loot afin que l’outil puisse rapprocher ce que la guilde pouvait organiser de ce que les joueurs venaient réellement chercher.'],
      ['Aider à composer des groupes viables', 'La logique agrège disponibilités, rôles et puissance et sait chercher une composition de six joueurs avec Tank, Healer et DPS, en tenant compte des personnages principaux et des rerolls.'],
      ['Gérer la vie du raid', 'L’application a ensuite couvert programmation, inscriptions, notifications, loots obtenus, intérêt des membres, approbation et rolls, avec plusieurs niveaux de rôle pour l’administration.'],
      ['Passer du prototype à un vrai service interne', 'Le site a été hébergé sur OVH et réellement utilisé par la guilde. Il est même resté en ligne et utilisable pendant une période où j’avais quitté la guilde et arrêté de jouer, ce qui est probablement la meilleure preuve que l’outil avait dépassé mon seul besoin personnel.'],
    ],
    aboutLabel: 'CE QUE L’USAGE RÉEL A LAISSÉ',
    aboutTitle: 'Un outil utile à son groupe, mais pas un vieux service à remettre en ligne tel quel.',
    about: [
      'Crimson’s Blade est important dans Labz parce qu’il part d’un problème communautaire réel et qu’il a réellement servi. Ce n’est pas une maquette de gestion de guilde : comptes, permissions, raids, compositions, disponibilités et workflow de loot existent dans le dépôt.',
      'En revanche, l’audit du code montre aussi les limites d’un projet historique qui n’a pas été maintenu comme un produit moderne : absence de CI et de tests, dette de sécurité autour de certains champs et du workflow de roll, anciennes données et secrets potentiellement présents dans l’historique. Le bon choix est donc de raconter le cas, pas de republier l’application telle quelle.'
    ],
    tech: [['Stack', 'Node.js · Express · PostgreSQL'], ['Comptes', 'bcrypt · sessions · rôles serveur'], ['Métier', 'Disponibilités · composition d’équipes · raids · loot / rolls'], ['Exploitation', 'Hébergé sur OVH · usage réel de guilde'], ['État', 'Dépôt privé · redéploiement déconseillé sans assainissement']],
    status: 'Crimson’s Blade reste une étude de cas historique, pas une démo publique. Sa valeur tient au passage d’un problème de groupe à un outil réellement exploité, puis au fait qu’il ait continué à servir sans ma présence. Avant toute remise en ligne, il faudrait assainir les données et secrets historiques, corriger plusieurs problèmes de sécurité et d’intégrité métier, puis ajouter des tests sur les permissions, la composition et le workflow de loot.'
  },
  'ecosysteme-rp': {
    type: 'case',
    kicker: 'ÉTUDE DE CAS · ÉCOSYSTÈME RP',
    headline: 'Automatiser la logistique pour rendre du temps au jeu de rôle.',
    narrative: 'Cette entrée sert de relais vers la page dédiée à l’écosystème RP. Saloon et HotzDoggz racontent deux rencontres, séparées de plusieurs années, avec un même type de problème de gestion d’entreprise. ZepRasso et Zepevents racontent un second arc autour de l’organisation d’événements, des QR codes et du choix entre plateforme web et outil local.',
    timeline: [
      ['Saloon puis HotzDoggz', 'Deux contextes différents, plusieurs années d’écart, mais le même réflexe : sortir d’Excel et de la gestion manuelle quand la logistique RP commence à manger le temps de jeu.'],
      ['ZepRasso', 'Une plateforme web et mobile pour préparer et suivre des événements automobiles GTA RP, avec inscriptions, paiements, concours, loteries et participation par QR code ou saisie manuelle.'],
      ['Le détour par Zepevents', 'Face au doute sur l’acceptation d’un site externe et des QR codes par le serveur, j’ai construit une alternative locale contrôlée par l’organisateur, sans imposer de site aux joueurs.'],
      ['Retour à ZepRasso', 'Les premiers essais QR ont finalement été acceptés et appréciés. Je suis revenu à ZepRasso, qui a grandi et est devenu notamment mon outil principal pour les loteries et les opérations en direct.'],
    ],
    status: 'La vraie page de cette étude de cas est rendue par la présentation RP dédiée. Elle conserve les deux arcs séparés, les usages réels, les différences entre ZepRasso et Zepevents et les limites de chaque outil sans inventer une fusion qui n’a jamais été planifiée.'
  },
  totalwarai: {
    type: 'research',
    kicker: 'R&D · EXPÉRIMENTATION ARRÊTÉE',
    headline: 'Construire un agent tactique avec une vision incomplète de la bataille.',
    narrative: 'Total War AI était une expérimentation visant à mesurer jusqu’où un agent tactique autonome pouvait aller avec les interfaces accessibles de Total War: WARHAMMER III. Le pont Lua/Python, l’observation du champ de bataille et les ordres de déplacement ont réellement fonctionné. Les essais ont ensuite révélé une limite structurelle : l’agent externe ne voyait qu’une partie des informations dont dispose l’IA interne du moteur.',
    origin: {
      label: 'POURQUOI J’AI TENTÉ ÇA',
      title: 'L’idée d’observer une bataille menée par mon propre agent me fascinait.',
      paragraphs: [
        'Je voulais savoir s’il était possible de laisser un agent prendre en charge une armée pendant que je regarde la bataille se dérouler. Ce n’était pas un projet d’apprentissage automatique : l’agent reposait sur des règles, des heuristiques, de la mémoire et des décisions tactiques construites autour des informations récupérables depuis le jeu.',
        'L’intérêt du développement est vite devenu moins “faire bouger des unités” que comprendre quelles informations manquaient à chaque fois que le comportement devenait absurde. Une unité se déplaçait mais n’attaquait pas, une autre restait immobile, une formation logique en simulation se faisait écraser en vraie bataille. Chaque échec devenait une nouvelle hypothèse à tester.'
      ],
    },
    question: 'Jusqu’où peut aller un agent tactique autonome quand l’interface externe ne lui donne pas tout le contexte dont dispose l’IA native du jeu ?',
    experiments: [
      ['Observer et agir', 'Le pont Lua/Python transforme l’état accessible de la bataille en données exploitables, puis renvoie des décisions et des ordres au jeu.'],
      ['Simuler puis comparer', 'Des scénarios et simulations servent à ajuster les règles avant de les confronter au vrai moteur. Plusieurs corrections utiles en simulation ont pourtant produit un comportement moins bon en bataille réelle.'],
      ['Chercher l’information manquante', 'Le développement devient progressivement empirique : identifier ce que l’agent ne sait pas, inférer ou reconstruire ce qui manque, tester, mesurer puis recommencer avec des armées et situations différentes.'],
    ],
    learnings: [
      'L’agent externe ne dispose pas directement de plusieurs informations importantes comme le moral, la fatigue, la largeur de front ou une représentation complète des obstacles, forêts et lignes de vue.',
      'L’IA interne bénéficie du moteur, du terrain, du pathfinding, des formations et d’informations auxquelles le script externe n’accède pas de la même manière.',
      'Une simulation peut sécuriser une idée sans prédire correctement son comportement dans le vrai jeu. Le projet a donc demandé des allers-retours constants entre modèle et terrain.',
      'Changer l’armée adverse change aussi les problèmes à résoudre. Pour rendre l’agent réellement robuste, il aurait fallu reconstruire ou inférer progressivement beaucoup de contexte pour une grande variété de situations, avec un coût devenu disproportionné par rapport à l’objectif initial.'
    ],
    status: 'Le projet a été arrêté après des essais réels sans victoire. Il ne s’agit pas d’une IA capable de bien jouer à Total War, mais d’une expérimentation technique qui a validé une partie de l’architecture puis mis en évidence une limite fondamentale d’information. Les unités pouvaient être commandées, mais le comportement restait trop irrégulier pour constituer un agent tactique efficace. La méthode empirique utilisée pour comprendre ces échecs est le résultat le plus intéressant du projet.'
  }
};

function heading(profile) {
  return `<header class="rich-project-heading"><span class="eyebrow">${esc(profile.kicker)}</span><h2>${esc(profile.headline)}</h2><p>${esc(profile.narrative)}</p></header>`;
}

function originBlock(profile) {
  if (!profile.origin?.paragraphs?.length) return '';
  return `<section class="rich-about rich-origin"><span class="eyebrow">${esc(profile.origin.label || 'POURQUOI JE L’AI CRÉÉ')}</span><h3>${esc(profile.origin.title || '')}</h3>${profile.origin.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`;
}

function flowBlock(profile) {
  if (!profile.flow?.length) return '';
  return `<section class="rich-about rich-product-flow"><span class="eyebrow">${esc(profile.flowLabel || 'COMMENT ÇA FONCTIONNE')}</span><h3>${esc(profile.flowTitle || '')}</h3><ol class="project-timeline">${profile.flow.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>`;
}

function aboutBlock(profile) {
  if (!profile.about?.length) return '';
  return `<section class="rich-about"><span class="eyebrow">${esc(profile.aboutLabel || 'À PROPOS')}</span><h3>${esc(profile.aboutTitle || '')}</h3>${profile.about.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`;
}

function techBlock(profile) {
  if (!profile.tech?.length) return '';
  return `<section class="rich-tech"><span class="eyebrow">SOUS LE CAPOT</span><dl>${profile.tech.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section>`;
}

function product(profile) {
  return `${heading(profile)}${originBlock(profile)}<div class="rich-feature-grid">${profile.features.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flowBlock(profile)}${aboutBlock(profile)}<div class="rich-project-columns">${techBlock(profile)}<section class="rich-status"><span class="eyebrow">ÉTAT DU PROJET</span><p>${esc(profile.status)}</p></section></div>`;
}

function suite(profile) {
  return `${heading(profile)}${originBlock(profile)}<div class="suite-branches">${profile.branches.map(([title,body]) => `<article><span class="suite-node" aria-hidden="true">✦</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flowBlock(profile)}${aboutBlock(profile)}<section class="suite-foundation"><span class="eyebrow">LE SOCLE COMMUN</span><ul>${profile.foundation.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section class="rich-status"><span class="eyebrow">STATUT</span><p>${esc(profile.status)}</p></section>`;
}

function caseStudy(profile) {
  const tech = techBlock(profile);
  return `${heading(profile)}${originBlock(profile)}<ol class="project-timeline">${profile.timeline.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol>${aboutBlock(profile)}${tech ? `<div class="rich-project-columns">${tech}<section class="rich-status"><span class="eyebrow">CE QU’ON EN RETIENT</span><p>${esc(profile.status)}</p></section></div>` : `<section class="rich-status"><span class="eyebrow">CE QU’ON EN RETIENT</span><p>${esc(profile.status)}</p></section>`}`;
}

function research(profile) {
  return `${heading(profile)}${originBlock(profile)}<section class="research-question"><span class="eyebrow">QUESTION DE DÉPART</span><p>${esc(profile.question)}</p></section><div class="research-experiments">${profile.experiments.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><section class="research-learnings"><span class="eyebrow">APPRENTISSAGES</span><ul>${profile.learnings.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section class="rich-status"><span class="eyebrow">RÉSULTAT HONNÊTE</span><p>${esc(profile.status)}</p></section>`;
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