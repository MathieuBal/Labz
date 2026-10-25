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
    headline: 'Importez une image. Puis regardez un million de pixels devenir un terrain de conquête.',
    narrative: 'Million de Pixels transforme n’importe quelle image en un monde 1024 × 1024 réellement simulé. Installez vos canons sur le rail, attaquez les couleurs accessibles depuis les bords, récupérez leurs fragments et construisez peu à peu une machine capable de dévorer toute la toile.',
    features: [
      ['Un million, pour de vrai', 'Les 1 048 576 cellules existent réellement dans la simulation. Une couleur enterrée derrière une autre peut être inaccessible, une façade évolue à mesure qu’elle est détruite et chaque tir modifie le monde plutôt qu’une simple barre de progression.'],
      ['Transformer une image en économie', 'Les couleurs deviennent des ressources, les canons se spécialisent et les fragments servent à améliorer la cadence, l’automatisation et la façon d’attaquer la toile. La progression continue ensuite avec doctrines, capacités et bonus permanents.'],
      ['Toujours une nouvelle toile à avaler', 'Import libre, campagne de 56 illustrations générées pour le jeu, galerie et progression permanente donnent une raison de recommencer avec une autre image plutôt que de s’arrêter au premier million détruit.'],
    ],
    aboutLabel: 'LA BOUCLE DE JEU',
    aboutTitle: 'Une image n’est pas une barre de vie : c’est le niveau entier.',
    about: [
      'Le plaisir vient de la transformation progressive de la toile. Au départ, l’image est intacte et les canons ne peuvent atteindre que ce que ses bords leur exposent. À mesure que des cellules disparaissent, de nouvelles couleurs deviennent accessibles et la géographie du niveau change réellement.',
      'Cette contrainte donne une raison à l’optimisation : améliorer un canon n’accélère pas seulement un compteur, cela change la vitesse à laquelle une couleur cède, la façon dont la surface s’ouvre et le moment où l’on peut réinvestir ailleurs. Le jeu cherche ainsi à faire cohabiter la satisfaction d’un idle avec une structure de monde qui reste concrète.'
    ],
    tech: [['Monde', '1024 × 1024 · TypedArrays et index spécialisés'], ['Rendu', 'PixiJS / WebGL2 · simulation séparée du visuel'], ['Traitement', 'Workers pour image et reprise hors-ligne'], ['Sauvegarde', 'IndexedDB · migrations v1 → v6']],
    status: 'C’est l’un des projets les plus solides du portfolio : tests unitaires nombreux, smoke E2E sur le build de production, migrations de sauvegarde et vrai modèle de reprise après restauration. Il reste toutefois un défaut important pour un idle : si la page reste simplement ouverte en arrière-plan, le retour au premier plan n’applique pas encore le rattrapage hors-ligne. La prochaine passe doit fermer ce trou puis brancher les tests existants sur la CI avant chaque déploiement.'
  },
  lootchest: {
    type: 'product',
    kicker: 'RPG / LOOTER · NAVIGATEUR',
    headline: 'Ouvrez un coffre. Équipez ce qui tombe. Descendez toujours un peu plus bas.',
    narrative: 'Lootchest part du plaisir le plus simple du looter : ouvrir quelque chose et espérer mieux. Puis la boucle s’étend. L’équipement construit votre héros, le donjon pousse à progresser, la Plongée change les règles et le village finit par produire pendant que vous préparez le prochain palier.',
    features: [
      ['Le loot est le moteur', 'Objets générés, affixes, raretés, équipements, coffres et mimics alimentent la construction du personnage. Chaque amélioration sert une idée très lisible : être prêt pour ce qu’il y a derrière la prochaine porte.'],
      ['Plus d’une façon de progresser', 'Donjon, biomes, boss et combat au tour par tour côtoient une Plongée roguelite avec sa propre boucle. Talents, factions, reliques et prestige ajoutent ensuite des couches de progression plus longues.'],
      ['Quand l’aventure construit son village', 'Bâtiments, ouvriers, forge et production passive ajoutent une couche idle au RPG. Les ressources continuent à s’accumuler selon le temps réellement écoulé, avec un rattrapage plafonné à huit heures.'],
    ],
    aboutLabel: 'À PROPOS DU JEU',
    aboutTitle: 'Le prochain coffre doit toujours donner une raison de continuer.',
    about: [
      'Lootchest s’est développé autour d’une question très simple : combien de systèmes peut-on accrocher à une boucle de loot sans perdre le plaisir immédiat d’ouvrir, comparer et équiper ? Le donjon fournit la pression, l’équipement apporte la réponse, puis le village et la forge commencent à préparer les runs suivants.',
      'La Plongée permet de casser cette routine avec une boucle plus roguelite, tandis que le prestige, les reliques, les factions et les talents donnent des objectifs au-delà de l’objet obtenu dans l’instant. Le projet est moins une recherche de minimalisme qu’un laboratoire de progression où chaque nouvelle couche doit nourrir les précédentes.'
    ],
    tech: [['Surface', 'Navigateur · mobile et desktop'], ['Stack', 'JavaScript / HTML / CSS sans framework ni bundler'], ['Sauvegarde', 'Locale · migrations · export / import JSON'], ['État', 'Jeu public · prototype riche']],
    status: 'Lootchest est déjà un vrai jeu jouable, surtout remarquable par la quantité de systèmes reliés dans un projet vanilla JS. Cette richesse est aussi sa dette principale : aucune suite de tests automatisés ne protège encore les combats, le loot, le village ou les sauvegardes. Pour les essais publics, les exports personnels sont adaptés au backup ; l’import de fichiers de sauvegarde externes n’est pas encore suffisamment durci pour être considéré comme une fonction de partage sûre.'
  },
  'afk-farm': {
    type: 'product',
    kicker: 'IDLE / INCRÉMENTAL · PROTOTYPE AVANCÉ',
    headline: 'Récoltez à la main. Automatisez. Changez de biome. Recommencez plus fort.',
    narrative: 'AFK Farm est né d’un réflexe très personnel : ne pas trouver exactement l’idle que j’avais envie de jouer, alors construire le mien. Au départ, un champ magnétique et quelques grains. Puis arrivent l’énergie, les combos, les drones, les projets, les biomes, le prestige et un arbre de progression à sept branches.',
    features: [
      ['Du geste à l’automatisation', 'Les premières récoltes se font directement dans le champ magnétique, avec énergie, stockage, chaînes de captures et Surge. Les drones et améliorations prennent ensuite progressivement une partie du travail à votre place.'],
      ['Une progression en couches', 'Projets temporisés, six biomes de base, progression procédurale au-delà, prestige, perks, succès et arbre déterministe donnent plusieurs horizons de progression au lieu d’une simple courbe de chiffres.'],
      ['Un idle pensé pour revenir souvent', 'Interface touch-first, PWA, sauvegarde locale et rendu Canvas optimisé en font un prototype pensé dès le départ pour le téléphone et les petites sessions régulières.'],
    ],
    aboutLabel: 'POURQUOI IL EXISTE',
    aboutTitle: 'Quand le jeu que l’on veut n’existe pas, on peut essayer de le fabriquer.',
    about: [
      'AFK Farm appartient à une famille de projets nés sans cahier des charges extérieur : l’envie de jouer à quelque chose de précis, l’impression de ne pas le trouver exactement ailleurs, puis la décision d’en construire une version soi-même. Le champ magnétique fournit le geste de départ ; l’idle vient ensuite donner une raison d’y revenir.',
      'Le projet a été poussé bien plus loin que cette première intuition. Chaque système ajouté, des drones au prestige en passant par les biomes et l’arbre, cherche à déplacer progressivement le joueur de la récolte immédiate vers la construction d’une machine qui travaille pour lui. C’est cette trajectoire, plus que l’équilibrage actuel, qui donne son identité au prototype.'
    ],
    tech: [['Surface', 'Navigateur · PWA mobile-first'], ['Moteur', 'Canvas · tableaux typés · densité adaptée à l’écran'], ['Progression', 'Biomes · projets · prestige · arbre à 7 branches'], ['État', 'Prototype jouable ouvert aux retours']],
    status: 'AFK Farm est précisément le type de projet que Labz peut aider à décider de reprendre. La boucle existe et le contenu est déjà conséquent, mais deux incohérences touchent encore le cœur du jeu : le retour après mise en arrière-plan peut perdre une partie de la progression AFK, et les Cores servent à la fois de multiplicateur et de monnaie dépensable, ce qui peut rendre certains achats contre-productifs. La fiche assume donc un prototype avancé, pas un idle équilibré et terminé.'
  },
  diagnostic: {
    type: 'product', kicker: 'OUTIL DE MÉDIATION', headline: 'Comprendre un groupe avant de construire l’atelier pour lui.',
    narrative: 'Diagnostic numérique a été pensé pour des ateliers réels : plutôt qu’un score global, il combine questions, mini-jeux et manipulations afin de faire ressortir des besoins par domaine et d’aider l’animateur à préparer la suite.',
    features: [
      ['Diagnostic par domaine', 'La restitution cherche des tendances utiles à l’atelier plutôt qu’un classement des participants.'],
      ['Plusieurs formes d’exercice', 'Questions, mini-jeux et manipulations de fichiers évitent de réduire l’évaluation à un QCM classique.'],
      ['Démo sans friction', 'Le visiteur peut tester le concept sans prénom, sans code de séance et sans alimenter une vraie session.'],
    ],
    tech: [['Surface', 'Navigateur'], ['Usage', 'Ateliers de médiation numérique'], ['Données', 'Mode local + Supabase pour les vraies séances'], ['État', 'Démo testable']],
    status: 'La démonstration locale est autonome et adaptée à Labz. La collecte Supabase existe dans le code mais doit encore être revalidée de bout en bout en situation réelle avant de la présenter comme totalement fiabilisée.'
  },
  perfoptimize: {
    type: 'product', kicker: 'OUTIL WINDOWS · ALPHA', headline: 'Mesurer d’abord, modifier seulement ce qui peut être expliqué et restauré.',
    narrative: 'Perfoptimize analyse un PC pendant qu’un jeu tourne et transforme des mesures locales en recommandations compréhensibles. L’objectif est l’inverse d’un bouton “boost magique” : séparer la mesure, le diagnostic et l’action, puis rendre chaque modification réversible.',
    features: [
      ['Mesures locales', 'Frametimes, télémétrie et contexte de la machine sont lus localement pendant une scène de jeu représentative.'],
      ['Diagnostic explicable', 'Les recommandations distinguent ce qui est mesuré, ce qui relève de connaissances communautaires et ce qui reste une estimation.'],
      ['Écritures réversibles', 'Une analyse seule ne modifie rien ; les changements compatibles passent par prévisualisation, sauvegarde et restauration.'],
    ],
    tech: [['Surface', 'Windows x64'], ['Moteur', '.NET · CLI/UI partagés'], ['Mesure', 'PresentMon + télémétrie locale'], ['État', 'Alpha testable']],
    status: 'L’alpha est réellement essayable, mais elle n’est pas signée. La chaîne de confiance autour du binaire PresentMon et la distribution Windows doivent être renforcées avant une diffusion plus large.'
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
    type: 'suite', kicker: 'SUITE PRODUIT', headline: 'Deux façons d’explorer : ce que tu aimes, et ce qui change autour de toi.',
    narrative: 'Constella n’est pas deux projets juxtaposés. Explore et Watch partagent un Core, une architecture et une trajectoire cloud, mais répondent à deux usages suffisamment différents pour avoir leurs propres surfaces produit.',
    branches: [
      ['Explore', 'Cartographier ses goûts : domaines, critères, évaluations, duels, affinités et constellations 3D pour observer comment une préférence se structure.'],
      ['Watch', 'Suivre un sujet dans le temps : collecte multi-sources, déduplication, pertinence, journal, digests et synthèses pour distinguer le bruit des évolutions utiles.'],
    ],
    foundation: ['Core partagé et garde-fous d’architecture', 'Persistance et design system communs', 'Trajectoire cloud commune plutôt que deux produits dupliqués'],
    status: 'Le socle ARCH-030 a passé son quality gate, mais Constella est volontairement en pause avant bêta. La synchronisation workspace et la chaîne cloud restent hors de l’état présenté tant qu’elles ne sont pas mergées et validées de bout en bout.'
  },
  'ateliers-memoire': {
    type: 'case', kicker: 'ÉTUDE DE CAS · MÉDIATION', headline: 'De petits outils construits pour enlever de la friction pendant de vrais ateliers.',
    narrative: 'Cette fiche regroupe plusieurs activités qui n’ont jamais eu vocation à devenir une “suite cognitive”. Leur intérêt portfolio vient du chemin : partir d’un besoin d’animation concret, fabriquer un outil simple, l’utiliser sur le terrain puis garder ce qui fonctionne.',
    timeline: [
      ['Besoin terrain', 'Créer des activités plus interactives et faciles à lancer pendant des ateliers mémoire.'],
      ['Tricat / Clicreflexe', 'Deux activités web réutilisables autour de la catégorisation, de l’observation et de la rapidité de réponse.'],
      ['Ball Passing Simulation', 'Une simulation utilisée ponctuellement en atelier EHPAD pour soutenir une activité précise.'],
      ['Ce que ça raconte', 'Une démarche de médiation : adapter l’outil au groupe et à la séance plutôt que construire un produit lourd sans usage.'],
    ],
    status: 'Ces outils ne sont pas présentés comme dispositifs thérapeutiques ni comme preuve de bénéfice cognitif. Tricat est aujourd’hui la meilleure base pour une future démo publique canonique après un léger passage accessibilité/tests.'
  },
  'crimson-s-blade': {
    type: 'case', kicker: 'ÉTUDE DE CAS · USAGE RÉEL', headline: 'Quand la logistique d’une guilde devient un produit interne.',
    narrative: 'Crimson’s Blade est l’un des cas les plus nets du portfolio où un problème réel a produit un outil réellement utilisé : organiser les membres, les disponibilités, les équipes, les raids et la distribution de loot d’une guilde Throne and Liberty.',
    timeline: [
      ['Problème', 'Des informations dispersées et difficiles à maintenir pour préparer les activités de guilde.'],
      ['Outil', 'Une application multi-utilisateur Node/PostgreSQL centralisant profils, rôles, gear score, disponibilités et besoins de loot.'],
      ['Usage', 'L’application a servi durablement à la coordination réelle de la guilde, au-delà d’une simple démonstration technique.'],
      ['Décision actuelle', 'Conserver le dépôt privé : données historiques et dettes de sécurité imposent un assainissement avant tout éventuel redéploiement.'],
    ],
    status: 'La valeur de cette fiche est l’usage réel et la résolution de problème. La bonne décision portfolio n’est pas de rouvrir publiquement l’application telle quelle, mais de documenter ce qui a été construit et ce que l’exploitation a révélé.'
  },
  'ecosysteme-rp': {
    type: 'case', kicker: 'ÉTUDE DE CAS · ÉCOSYSTÈME RP', headline: 'Automatiser la logistique pour rendre du temps au jeu de rôle.',
    narrative: 'Saloon, HotzDoggz, ZepRasso et ZepEvents racontent une même histoire. Chaque étape cherche à absorber une partie de la gestion hors-jeu afin que les joueurs passent moins de temps à administrer leur activité et plus de temps à jouer leur personnage.',
    timeline: [
      ['Saloon', 'Première automatisation d’une activité RP et découverte des besoins réels autour de la gestion quotidienne.'],
      ['HotzDoggz', 'Industrialisation de la gestion d’entreprise RP ; auto-hébergé environ quinze jours et utilisé par une quarantaine de personnes.'],
      ['ZepRasso', 'Exploration d’une organisation plus large autour des interactions et besoins communautaires.'],
      ['ZepEvents', 'Recherche d’un format événementiel plus léger qui automatise sans casser l’immersion.'],
    ],
    status: 'Les quatre dépôts restent présentés comme une évolution et non comme quatre produits indépendants. HotzDoggz est la pièce centrale car il a rencontré un usage réel et a évolué au contact de ses utilisateurs.'
  },
  totalwarai: {
    type: 'research', kicker: 'R&D EXPÉRIMENTALE', headline: 'Construire un général autonome, puis comprendre pourquoi la vraie bataille refuse le scénario prévu.',
    narrative: 'Total War AI cherchait à permettre d’observer les batailles plutôt que de les jouer soi-même. Le projet a construit beaucoup de briques sérieuses : pont Lua/Python, télémétrie, règles, mémoire, simulateur et tests. Malgré cela, l’objectif final n’a pas été atteint en vraie bataille.',
    question: 'Peut-on piloter une armée de Total War: WARHAMMER III avec un agent tactique à règles suffisamment autonome pour gagner une vraie bataille ?',
    experiments: [
      ['Instrumentation', 'Pont Lua/Python et télémétrie pour transformer l’état du champ de bataille en données exploitables.'],
      ['Planification', 'Règles tactiques, doctrines adaptatives, mémoire et simulateur pour tester les décisions hors du jeu.'],
      ['Confrontation au réel', 'Les comportements validés dans le simulateur ont révélé des écarts importants une fois confrontés aux contraintes de la vraie bataille.'],
    ],
    learnings: ['Le simulateur ne reproduit pas toutes les contraintes du moteur réel.', 'Une batterie de tests peut sécuriser l’architecture sans prouver l’efficacité tactique finale.', 'Le prochain critère de succès doit être une victoire reproductible en vraie bataille, pas seulement un scénario simulé.'],
    status: 'L’agent n’a jamais gagné une vraie bataille. C’est précisément pourquoi le projet est présenté comme R&D : les échecs, les hypothèses invalidées et l’écart simulation/réalité sont ici une partie centrale du résultat.'
  }
};

function heading(profile) {
  return `<header class="rich-project-heading"><span class="eyebrow">${esc(profile.kicker)}</span><h2>${esc(profile.headline)}</h2><p>${esc(profile.narrative)}</p></header>`;
}

function product(profile) {
  const origin = profile.origin?.paragraphs?.length ? `<section class="rich-about rich-origin"><span class="eyebrow">${esc(profile.origin.label || 'POURQUOI JE L’AI CRÉÉ')}</span><h3>${esc(profile.origin.title || '')}</h3>${profile.origin.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>` : '';
  const flow = profile.flow?.length ? `<section class="rich-about rich-product-flow"><span class="eyebrow">${esc(profile.flowLabel || 'COMMENT ÇA FONCTIONNE')}</span><h3>${esc(profile.flowTitle || '')}</h3><ol class="project-timeline">${profile.flow.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>` : '';
  const about = profile.about?.length ? `<section class="rich-about"><span class="eyebrow">${esc(profile.aboutLabel || 'À PROPOS')}</span><h3>${esc(profile.aboutTitle || '')}</h3>${profile.about.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>` : '';
  return `${heading(profile)}${origin}<div class="rich-feature-grid">${profile.features.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>${flow}${about}<div class="rich-project-columns"><section class="rich-tech"><span class="eyebrow">SOUS LE CAPOT</span><dl>${profile.tech.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section><section class="rich-status"><span class="eyebrow">ÉTAT DU PROJET</span><p>${esc(profile.status)}</p></section></div>`;
}

function suite(profile) {
  return `${heading(profile)}<div class="suite-branches">${profile.branches.map(([title,body]) => `<article><span class="suite-node" aria-hidden="true">✦</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><section class="suite-foundation"><span class="eyebrow">LE SOCLE COMMUN</span><ul>${profile.foundation.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section class="rich-status"><span class="eyebrow">STATUT</span><p>${esc(profile.status)}</p></section>`;
}

function caseStudy(profile) {
  return `${heading(profile)}<ol class="project-timeline">${profile.timeline.map(([title,body],index) => `<li><span class="timeline-index">${String(index + 1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol><section class="rich-status"><span class="eyebrow">CE QU’ON EN RETIENT</span><p>${esc(profile.status)}</p></section>`;
}

function research(profile) {
  return `${heading(profile)}<section class="research-question"><span class="eyebrow">QUESTION DE DÉPART</span><p>${esc(profile.question)}</p></section><div class="research-experiments">${profile.experiments.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><section class="research-learnings"><span class="eyebrow">APPRENTISSAGES</span><ul>${profile.learnings.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section class="rich-status"><span class="eyebrow">RÉSULTAT HONNÊTE</span><p>${esc(profile.status)}</p></section>`;
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