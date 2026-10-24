// Catalogue éditorial explicite : aucun dépôt privé n'est automatiquement publié.
// Les formulations ci-dessous sont bornées par les audits de docs/audits/.
const project = (id, name, category, description, extra = {}) => ({
  id, name, category, description, art: 'orbit', mode: 'Présentation', ...extra,
});

export const categories = {
  jeux: 'Jeux',
  experiences: 'Expériences',
  outils: 'Outils',
  cas: 'Études de cas',
  recherche: 'R&D',
};

const visitorGuides = {
  sensoria: {
    invitation: 'Dessine un geste. Regarde la matière lui répondre.',
    firstTry: 'Pour commencer : Encres flottantes',
    steps: [
      'Ouvre la galerie et choisis Encres flottantes.',
      'Fais glisser ton doigt ou la souris pour explorer le tableau.',
      'Utilise le bouton ? pour retrouver les gestes, puis reviens à la galerie pour changer d’ambiance.',
    ],
    controls: 'Au doigt ou à la souris. Chaque tableau possède sa propre aide ; les réglages sont accessibles avec ⋮.',
    saveNote: 'Les compositions sont éphémères. Certains réglages, comme la palette et les effets réduits, restent sur cet appareil.',
    comfort: 'Les 22 tableaux sont réellement présents. Certains demandent WebGL2 ; les scènes compatibles restent accessibles si WebGL2 manque.',
    takeaway: '22 tableaux interactifs, du lac nocturne aux encres en mouvement, sans score à atteindre.',
  },
  'million-de-pixels': {
    cover: 'assets/pixels-campaign.webp',
    coverLabel: 'ILLUSTRATION DE CAMPAGNE GÉNÉRÉE PAR IA',
    gallery: [
      {src: 'assets/pixels-campaign.webp', alt: 'Illustration de campagne de Million de pixels', label: 'Illustration de campagne générée par IA', zoom: 1},
      {src: 'assets/pixels-campaign.webp', alt: 'Vue rapprochée d’une illustration de Million de pixels', label: 'Vue rapprochée', zoom: 1.55, x: '62%', y: '55%'},
    ],
    invitation: 'Une image entière à grignoter, couleur après couleur.',
    firstTry: 'Ton premier objectif : observer une couleur disparaître',
    steps: [
      'Importe une image pour en faire un plateau logique de 1 048 576 cellules.',
      'Place des canons et observe les couleurs réellement accessibles depuis les bords.',
      'Réinvestis les fragments gagnés dans les améliorations et la progression permanente.',
    ],
    controls: 'Les boutons gèrent les canons et améliorations. La molette ou le pincement permettent de zoomer sur la toile.',
    saveNote: 'La progression est enregistrée dans IndexedDB sur cet appareil. Les anciennes sauvegardes disposent d’une chaîne de migrations.',
    comfort: 'La reprise après un simple passage en arrière-plan n’est pas encore totalement fiabilisée. Un rechargement/restauration déclenche bien le modèle de reprise hors-ligne.',
    takeaway: 'Le million de cellules est une vraie structure de données : TypedArrays, index spécialisés, worker d’image et rendu GPU plutôt qu’un million de sprites.',
  },
  lootchest: {
    cover: 'assets/lootchest-chest.png',
    coverLabel: 'COFFRE ISSU DU JEU',
    gallery: [
      {src: 'assets/lootchest-chest.png', alt: 'Coffre issu de Lootchest', label: 'Coffre issu du jeu', zoom: 1},
      {src: 'assets/lootchest-chest.png', alt: 'Détail rapproché du coffre de Lootchest', label: 'Détail du coffre', zoom: 1.65, x: '50%', y: '51%'},
    ],
    invitation: 'Un coffre, une trouvaille, puis un étage de plus.',
    firstTry: 'Ton premier objectif : préparer ton héros pour le donjon',
    steps: [
      'Ouvre un coffre pour obtenir tes premières pièces d’équipement.',
      'Équipe ton héros puis entre dans le donjon.',
      'Explore ensuite la Plongée, le village, la forge et les systèmes de progression à ton rythme.',
    ],
    controls: 'Sur téléphone, touche un objet pour ouvrir ses actions. Sur ordinateur, sélectionne-le dans l’inventaire pour consulter son détail.',
    saveNote: 'La progression est sauvegardée dans ce navigateur. L’export JSON permet d’en conserver une copie.',
    comfort: 'Le projet est riche mais reste un prototype vanilla JS sans batterie de tests automatisés : un retour concret sur une régression est particulièrement utile.',
    takeaway: 'La force du projet est sa profondeur de game design : loot procédural, combats, plongée roguelite, village idle, forge, talents et prestige.',
  },
  diagnostic: {
    invitation: 'Questions, mini-jeux et manipulations pour préparer des ateliers numériques adaptés.',
    firstTry: 'Essaie une question puis un mini-jeu',
    steps: [
      'Ouvre le site et déplie « Essayer avant de commencer ».',
      'Choisis « Essayer la démonstration » : aucun prénom ni code de séance n’est nécessaire.',
      'Réponds à une question puis essaie un mini-jeu. Quelques activités suffisent pour découvrir le concept.',
    ],
    controls: 'Boutons, choix et listes au doigt ou à la souris. Les manipulations de fichiers sont pensées pour un ordinateur.',
    saveNote: 'En démonstration, les réponses restent dans ce navigateur et sont séparées des vraies séances.',
    comfort: 'La collecte Supabase est implémentée dans le code mais doit encore être revalidée en situation réelle. La démonstration locale n’en dépend pas.',
    takeaway: 'Un outil de médiation qui cherche à produire une lecture pédagogique par domaine plutôt qu’un score global ou un classement.',
  },
  perfoptimize: {
    cover: 'assets/perfoptimize-cockpit.svg',
    coverLabel: 'APERÇU REPRÉSENTATIF · DONNÉES ILLUSTRATIVES',
    gallery: [
      {src: 'assets/perfoptimize-cockpit.svg', alt: 'Vue d’ensemble représentative du cockpit Perfoptimize', label: 'Cockpit complet · données illustratives', zoom: 1},
      {src: 'assets/perfoptimize-cockpit.svg', alt: 'Vue rapprochée des mesures FPS GPU et frametimes de Perfoptimize', label: 'Mesures FPS, GPU et frametimes', zoom: 1.55, x: '56%', y: '48%'},
      {src: 'assets/perfoptimize-cockpit.svg', alt: 'Vue rapprochée du diagnostic et du plan de Perfoptimize', label: 'Diagnostic et plan à prévisualiser', zoom: 1.65, x: '72%', y: '73%'},
    ],
    invitation: 'Mesure d’abord. Modifie seulement ce qui est expliqué et réversible.',
    firstTry: 'Ton premier test : analyser un jeu en cours d’exécution',
    steps: [
      'Télécharge puis décompresse entièrement l’archive Windows x64.',
      'Lance Perfoptimize.exe. Cette alpha n’est pas encore signée et Windows peut afficher SmartScreen.',
      'Démarre un jeu et effectue une analyse dans une scène représentative.',
      'Lis le diagnostic. Les modifications compatibles sont prévisualisées, sauvegardées puis restaurables.',
    ],
    controls: 'L’exécutable lance le moteur local puis ouvre son cockpit dans le navigateur. Le serveur écoute uniquement sur le PC.',
    saveNote: 'Une analyse seule ne modifie pas les fichiers de jeu. Les écritures compatibles passent par un plan figé, une sauvegarde et un mécanisme de restauration.',
    comfort: 'Alpha Windows x64 non signée. PresentMon est téléchargé depuis sa source officielle, mais la vérification cryptographique du binaire reste à renforcer.',
    takeaway: 'Un analyseur local qui distingue mesures, connaissances communautaires et estimations au lieu de promettre un « boost » universel.',
  },
  'afk-farm': {
    invitation: 'Un idle magnétique construit pour jouer au jeu que je ne trouvais pas ailleurs.',
    firstTry: 'Observe la boucle courte avant de laisser tourner',
    steps: [
      'Lance le prototype et récolte activement les premiers grains.',
      'Investis dans l’arbre de progression puis démarre les premiers projets AFK.',
      'Essaie plusieurs biomes et vois comment leurs règles changent la progression.',
    ],
    controls: 'Pensé mobile-first et installable comme PWA. Les interactions principales se font au doigt ou à la souris.',
    saveNote: 'La sauvegarde est locale au navigateur. Le calcul de reprise après simple mise en arrière-plan présente encore un défaut connu.',
    comfort: 'Prototype avancé, pas jeu fini : l’économie des Cores et certaines liaisons d’arbre ont des incohérences connues. Les retours servent précisément à décider s’il mérite une nouvelle passe.',
    takeaway: 'Une expérimentation personnelle poussée loin : boucle idle, biomes, prestige, projets temporisés, arbre massif et rendu Canvas optimisé.',
  },
  pipboy: {
    cover: 'https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/maps/smoky/region.webp',
    coverLabel: 'CARTE SMOKY WATERS · GÉNÉRÉE PAR IA POUR LE PROJET',
    gallery: [
      {src: 'https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/maps/smoky/region.webp', alt: 'Carte régionale Smoky Waters utilisée dans Pip-Boy JDR', label: 'Carte de scénario Smoky Waters', zoom: 1},
      {src: 'https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/illustrations/smoky/superviseur.webp', alt: 'Illustration du Superviseur utilisée dans Pip-Boy JDR', label: 'Illustration de fiche · bibliothèque MJ', zoom: 1},
    ],
    invitation: 'Un compagnon JDR qui sépare ce que prépare le MJ de ce que le joueur a réellement le droit de voir.',
    takeaway: 'Carte, fiches, quêtes, terminaux, table de jeu et synchronisation pensée avec une projection joueur contrôlée côté SQL.',
  },
};

export const projects = [
  project('sensoria', 'Sensoria', 'experiences', 'Explore 22 tableaux interactifs où le geste transforme l’image.', {
    art: 'ink', mode: 'Navigateur', live: 'https://mathieubal.github.io/Sensoria/', repo: 'https://github.com/MathieuBal/Sensoria', action: 'Lancer l’expérience',
    detail: 'Une galerie sensorielle Canvas/WebGL pensée pour souris, stylet et tactile, avec un socle commun de scènes et de réglages.',
    hint: 'Projet public et réellement testable. Les validations navigateur existent mais ne bloquent pas encore chaque déploiement.',
  }),
  project('million-de-pixels', 'Million de pixels', 'jeux', 'Transforme une image en un plateau de 1 048 576 cellules à détruire.', {
    art: 'pixels', mode: 'Navigateur', live: 'https://mathieubal.github.io/million-de-pixels/', repo: 'https://github.com/MathieuBal/million-de-pixels', action: 'Jouer',
    detail: 'Un idle/roguelite navigateur qui traite réellement un million de cellules avec TypedArrays, index spécialisés, workers et rendu GPU.',
    hint: 'Projet techniquement solide. La reprise après simple retour d’arrière-plan reste un défaut connu à corriger.',
  }),
  project('lootchest', 'Lootchest', 'jeux', 'Ouvre des coffres, construis ton équipement et pousse toujours plus loin ta progression.', {
    art: 'chest', mode: 'Navigateur', live: 'https://mathieubal.github.io/Lootchest/', repo: 'https://github.com/MathieuBal/Lootchest', action: 'Jouer',
    detail: 'RPG-looter vanilla JS avec donjon, affixes, plongée roguelite, village idle, forge, talents, prestige et loot procédural.',
    hint: 'Très riche en systèmes jouables, mais moins industrialisé : pas encore de batterie de tests/CI versionnée.',
  }),
  project('afk-farm', 'AFK Farm', 'jeux', 'Un idle magnétique personnel devenu un prototype beaucoup plus profond que prévu.', {
    art: 'orbit', mode: 'Prototype jouable', live: 'https://mathieubal.github.io/afk-farm/', repo: 'https://github.com/MathieuBal/afk-farm', action: 'Essayer le prototype',
    detail: 'Progression active et AFK, biomes, prestige, projets temporisés et grand arbre de compétences dans une PWA mobile-first.',
    hint: 'À essayer avec un regard de testeur : plusieurs défauts d’économie et de reprise AFK sont déjà identifiés par l’audit.',
  }),
  project('diagnostic', 'Diagnostic numérique', 'outils', 'Prépare des ateliers de médiation avec questions, mini-jeux et manipulations.', {
    art: 'tools', mode: 'Démo guidée', live: 'https://mathieubal.github.io/diagnostic-numerique/', repo: 'https://github.com/MathieuBal/diagnostic-numerique', action: 'Ouvrir la démonstration', launchLabel: 'Ouvrir la démonstration',
    detail: 'Parcours participant, mode fichiers autonome, tableau de bord animateur, analyses par domaines et proposition de 12 ateliers.',
    hint: 'La démonstration locale est testable. La collecte Supabase réelle doit encore être revalidée de bout en bout.',
  }),
  project('perfoptimize', 'Perfoptimize', 'outils', 'Analyse les performances d’un PC en jeu et transforme les mesures en recommandations explicables.', {
    art: 'tools', mode: 'Alpha Windows', live: 'https://mathieubal.github.io/Perfoptimize/Perfoptimize-alpha-win-x64.zip', action: 'Télécharger pour Windows', launchLabel: 'Télécharger pour Windows',
    detail: 'Moteur .NET partagé CLI/UI, télémétrie locale, frametimes, diagnostics, recommandations, backups et restauration de configurations.',
    hint: 'Windows x64. Alpha non signée ; la signature du binaire et la chaîne de confiance PresentMon restent des chantiers avant diffusion grand public.',
  }),
  project('constella', 'Constella', 'outils', 'Deux surfaces pour explorer ses goûts ou suivre un sujet dans le temps, sur un Core commun.', {
    art: 'orbit', mode: 'Prototype privé · en pause',
    detail: 'Explore cartographie les préférences, duels et constellations. Watch collecte, classe et synthétise une veille multi-sources. La base ARCH-030 a passé son quality gate complet.',
    hint: 'La bêta cloud n’est pas encore déployée et la synchronisation complète du workspace reste dans une PR non mergée. Le projet est volontairement gelé avant ce dernier kilomètre.',
  }),
  project('pipboy', 'Pip-Boy JDR', 'outils', 'Un compagnon de campagne mobile-first avec séparation réelle entre données MJ et données joueur.', {
    art: 'tools', mode: 'Présentation · démo suspendue', repo: 'https://github.com/MathieuBal/Pipboy',
    detail: 'React/TypeScript, cartes, fiches, brouillard, table de jeu et terminaux, avec projection joueur filtrée côté PostgreSQL et tests de sécurité PGlite.',
    hint: 'Le lancement direct est retiré de Labz tant qu’une ancienne carte officielle Fallout redistribuée dans le projet n’a pas été remplacée par un asset original.',
  }),
  project('ateliers-memoire', 'Outils d’ateliers mémoire', 'cas', 'Trois petites activités conçues pour rendre des ateliers mémoire plus interactifs.', {
    art: 'tools', mode: 'Étude de cas · usage terrain',
    detail: 'Tricat et Clicreflexe sont des activités web réutilisables ; Ball Passing Simulation a servi ponctuellement en atelier EHPAD. Ensemble, ils racontent une démarche de médiation plus qu’un produit unique.',
    hint: 'Ces outils sollicitent attention, catégorisation, observation et rapidité de réponse. Ils ne sont pas présentés comme dispositifs thérapeutiques ni comme bénéfice cognitif démontré.',
  }),
  project('crimson-s-blade', 'Crimson’s Blade', 'cas', 'Un outil de coordination de guilde réellement utilisé pour organiser équipes, raids et loot.', {
    art: 'tools', mode: 'Étude de cas · usage réel',
    detail: 'Application multi-utilisateur Node/PostgreSQL déployée et utilisée durablement par une guilde Throne and Liberty : disponibilités, compositions, raids et distribution de loot.',
    hint: 'Le dépôt reste privé et ne doit pas être redéployé tel quel : l’audit a identifié plusieurs dettes sécurité et des données historiques à conserver privées.',
  }),
  project('ecosysteme-rp', 'Écosystème RP · Zep', 'cas', 'Une lignée d’outils conçus pour absorber la logistique et rendre du temps au jeu de rôle.', {
    art: 'tools', mode: 'Étude de cas · usage réel', repo: 'https://github.com/MathieuBal/HotzDoggz-bot',
    detail: 'Saloon automatise une première activité RP, HotzDoggz industrialise la gestion d’entreprise, puis ZepRasso et Zepevents explorent deux façons d’organiser des événements sans casser l’immersion.',
    hint: 'HotzDoggz a réellement tourné environ quinze jours et servi une quarantaine de personnes. Les quatre dépôts sont présentés comme une évolution, pas quatre produits indépendants.',
  }),
  project('totalwarai', 'Total War AI', 'recherche', 'Une tentative de construire un général autonome pour observer les batailles au lieu de les jouer soi-même.', {
    art: 'orbit', mode: 'R&D expérimentale', repo: 'https://github.com/MathieuBal/Totalwarai',
    detail: 'Agent adaptatif à règles, pont Python/Lua, télémétrie, simulateur, mémoire et tests en vraie bataille sur Total War: WARHAMMER III.',
    hint: 'Expérience techniquement ambitieuse mais objectif non atteint : l’agent n’a jamais gagné une vraie bataille. Le projet est présenté pour ce qu’il a permis d’apprendre, pas comme une IA performante.',
  }),
].map(p => ({...p, ...visitorGuides[p.id]}));

export const retiredProjectIds = [
  'chess', 'atelierflow', 'constella-explore', 'constella-watch',
  'tricat', 'clicreflex-python', 'ball-passing',
  'zeprasso', 'zepevents', 'hotzdoggz', 'saloon',
  'totalwar', 'blackjack', 'sudoku', 'vlc', 'deezer',
  'ecoride', 'quai-antique', 'books',
];

export function filterProjects(query = '', category = 'all') {
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = normalize(query.trim());
  return projects.filter(p =>
    (category === 'all' || p.category === category) &&
    normalize(`${p.name} ${p.description} ${p.mode} ${categories[p.category]}`).includes(q)
  );
}
