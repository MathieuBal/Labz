import { projects } from './catalog.js';

const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const profiles = {
  sensoria: {
    type: 'product',
    kicker: 'EXPÉRIENCE INTERACTIVE',
    headline: 'Un terrain de jeu visuel où le geste devient matière.',
    narrative: 'Sensoria rassemble 22 tableaux interactifs construits autour d’une idée simple : ne pas expliquer une image, mais laisser le visiteur la provoquer. Chaque scène répond différemment au mouvement, à la souris, au stylet ou au tactile.',
    features: [
      ['22 tableaux', 'Des scènes réellement distinctes, du lac nocturne aux encres flottantes, avec leurs propres réactions et gestes.'],
      ['Interaction directe', 'Le mouvement du visiteur devient l’entrée principale : dessiner, déplacer, perturber, observer puis recommencer.'],
      ['Confort intégré', 'Aides par scène, réglages communs, effets réduits et maintien d’un parcours compatible quand WebGL2 manque.'],
    ],
    tech: [['Surface', 'Navigateur · tactile / souris / stylet'], ['Rendu', 'Canvas + WebGL selon les scènes'], ['Contenu', '22 tableaux interactifs'], ['État', 'Public · testable']],
    status: 'Le projet est déjà une expérience cohérente et montrable. Le prochain enjeu n’est pas d’ajouter des scènes à tout prix, mais de consolider les validations navigateur et de recueillir des retours sur les tableaux qui marquent vraiment les visiteurs.'
  },
  'million-de-pixels': {
    type: 'product', kicker: 'IDLE / ROGUELITE NAVIGATEUR', headline: 'Une image entière transformée en terrain de jeu de 1 048 576 cellules.',
    narrative: 'Million de Pixels part d’une image importée et la transforme en une structure réellement simulée. Le joueur pose des canons, exploite les couleurs accessibles depuis les bords et réinvestit les fragments gagnés pour faire disparaître progressivement la toile.',
    features: [
      ['Un vrai million de cellules', 'La grille n’est pas un décor : TypedArrays, index spécialisés et logique de couleurs pilotent réellement les 1 048 576 cellules.'],
      ['Progression persistante', 'Économie, améliorations et progression permanente sont sauvegardées dans IndexedDB avec une chaîne de migrations.'],
      ['Performance pensée dès le moteur', 'Traitement d’image dans un worker, rendu GPU et smoke test de production avec budget de simulation mesuré.'],
    ],
    tech: [['Surface', 'Navigateur'], ['Données', 'TypedArrays + IndexedDB'], ['Traitement', 'Worker image + rendu GPU'], ['État', 'Public · testable']],
    status: 'Le cœur technique est solide et largement testé. Le défaut connu le plus concret reste la reprise après un simple passage en arrière-plan : une restauration ou un rechargement fonctionne, mais le retour direct depuis l’arrière-plan mérite encore une correction.'
  },
  lootchest: {
    type: 'product', kicker: 'RPG / LOOTER', headline: 'Un coffre, un build, puis toujours une raison d’aller un peu plus loin.',
    narrative: 'Lootchest est devenu un terrain d’expérimentation de game design beaucoup plus large que son point de départ. On y ouvre des coffres, construit un équipement, explore le donjon, plonge dans une boucle roguelite et développe progressivement un village et ses systèmes.',
    features: [
      ['Loot procédural', 'Objets, affixes et équipement donnent une boucle de découverte et de construction de personnage.'],
      ['Plusieurs couches de progression', 'Donjon, plongée roguelite, village idle, forge, talents et prestige s’imbriquent dans la même sauvegarde.'],
      ['Prototype jouable dense', 'La richesse vient du nombre de systèmes déjà reliés entre eux, plus que d’une finition de production.'],
    ],
    tech: [['Surface', 'Navigateur'], ['Stack', 'JavaScript vanilla'], ['Sauvegarde', 'Locale + export JSON'], ['État', 'Public · testable']],
    status: 'La priorité n’est pas d’ajouter encore un système : il faut surtout observer la compréhension de la progression et fiabiliser les interactions existantes. L’absence de batterie de tests automatisés reste la principale faiblesse technique du projet.'
  },
  'afk-farm': {
    type: 'product', kicker: 'IDLE / PROTOTYPE', headline: 'Le jeu idle que je cherchais et que je ne trouvais pas ailleurs.',
    narrative: 'AFK Farm est né d’une envie très personnelle : construire une boucle idle où l’activité immédiate, la progression longue et les projets temporisés se répondent. Le prototype a fini par accumuler biomes, prestige et un arbre de compétences massif.',
    features: [
      ['Actif + AFK', 'Les premières ressources se gagnent activement avant que les systèmes automatisés ne prennent progressivement le relais.'],
      ['Biomes et prestige', 'Plusieurs règles de progression coexistent et donnent des objectifs de moyen et long terme.'],
      ['Pensé mobile', 'PWA mobile-first, interactions tactiles et rendu Canvas optimisé pour une consultation régulière.'],
    ],
    tech: [['Surface', 'Navigateur · PWA'], ['Orientation', 'Mobile-first'], ['Boucles', 'Biomes · prestige · projets temporisés'], ['État', 'Prototype jouable']],
    status: 'Le prototype est volontairement présenté avec ses défauts : certaines liaisons de l’arbre et l’économie des Cores demandent une vraie passe d’équilibrage, et la reprise AFK après arrière-plan reste imparfaite. Les retours servent à décider s’il mérite cette nouvelle passe.'
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
    type: 'product', kicker: 'COMPAGNON JDR', headline: 'Préparer côté MJ, révéler seulement ce que le joueur doit réellement voir.',
    narrative: 'Pip-Boy JDR est un compagnon de campagne mobile-first construit pour une table Fallout personnelle. La démonstration locale permet d’explorer le principe sans compte ; le mode connecté ajoute ensuite une vraie séparation MJ/joueur avec projection filtrée côté serveur.',
    features: [
      ['Démo locale', 'Carte, fiches, quêtes, terminaux et échanges MJ/joueur peuvent être découverts dans le navigateur sans backend.'],
      ['Séparation des secrets', 'Dans le mode connecté, la projection joueur est produite côté SQL : les données masquées ne sont pas simplement cachées dans l’interface.'],
      ['Pensé pour la table', 'Cartes, brouillard, tokens, terminaux, holobandes et préparation de scénario sont réunis dans un même compagnon.'],
    ],
    tech: [['Surface', 'Navigateur · mobile-first'], ['Stack', 'React + TypeScript + Vite'], ['Session réelle', 'Supabase + PostgreSQL + Realtime'], ['État', 'Démo publique + mode connecté']],
    status: 'La démo locale est le parcours public de Labz. Le mode authentifié reste une couche distincte : sa logique, ses RPC et ses contrôles de sécurité ne sont pas modifiés par cette refonte de vitrine.'
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
    narrative: 'Total War AI cherchait à permettre d’observer les batailles plutôt que de les jouer soi-même. Le projet a construit beaucoup de briques sérieuses — pont Lua/Python, télémétrie, règles, mémoire, simulateur et tests — mais l’objectif final n’a pas été atteint en vraie bataille.',
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
  return `${heading(profile)}<div class="rich-feature-grid">${profile.features.map(([title,body]) => `<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><div class="rich-project-columns"><section class="rich-tech"><span class="eyebrow">FICHE TECHNIQUE</span><dl>${profile.tech.map(([key,value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section><section class="rich-status"><span class="eyebrow">OÙ EN EST LE PROJET ?</span><p>${esc(profile.status)}</p></section></div>`;
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
