import { projects } from './catalog.js';

const pipboy = projects.find(project => project.id === 'pipboy');
if (pipboy) Object.assign(pipboy, {
  mode: 'Démo publique · mode connecté séparé',
  live: 'https://mathieubal.github.io/Pipboy/',
  repo: 'https://github.com/MathieuBal/Pipboy',
  action: 'Ouvrir la démo',
  launchLabel: 'Ouvrir la démo',
  hint: 'La démo publique fonctionne localement dans le navigateur. La partie authentifiée Supabase, les sessions MJ/joueur et leurs contrôles de sécurité restent une couche distincte.',
  firstTry: 'Ton premier test : envoyer une fiche du MJ vers le joueur',
  steps: [
    'Ouvre la démo puis passe dans la Console MJ.',
    'Choisis une fiche secrète du catalogue et envoie-la au joueur.',
    'Reviens à la vue joueur : la fiche révélée apparaît dans son module.',
  ],
  controls: 'Navigation mobile-first. La démonstration locale permet de passer entre les vues MJ et joueur dans le même navigateur.',
  saveNote: 'En démo, les données restent dans le stockage local de ce navigateur. Une vraie session multi-appareils utilise séparément Supabase.',
  comfort: 'La démo ne nécessite ni compte ni backend. Elle ne modifie pas la logique d’authentification ou de synchronisation du mode connecté.',
});

const projectModes = {
  sensoria: 'Public · expérience jouable',
  'million-de-pixels': 'Public · jeu jouable',
  lootchest: 'Public · prototype riche',
  'afk-farm': 'Prototype avancé · jouable',
  diagnostic: 'Outil de médiation · démo',
  perfoptimize: 'Alpha Windows · testable',
  constella: 'Prototype privé · en pause',
  pipboy: 'Démo publique · mode connecté séparé',
  'ateliers-memoire': 'Étude de cas · usage terrain',
  'crimson-s-blade': 'Étude de cas · usage réel',
  'ecosysteme-rp': 'Étude de cas · usage réel',
  totalwarai: 'R&D · expérimentation arrêtée',
};

for (const project of projects) {
  if (projectModes[project.id]) project.mode = projectModes[project.id];
}

const afkFarm = projects.find(project => project.id === 'afk-farm');
if (afkFarm) Object.assign(afkFarm, {
  description: 'Le champ magnétique de Sensoria transformé en idle web, puis poussé jusqu’aux drones, biomes, chantiers, prestige et arbre de progression.',
  detail: 'Un prototype mobile-first né du feeling du Champ magnétique : récolte active, automatisation, progression AFK, biomes, projets temporisés et arbre à sept branches.',
  hint: 'Prototype réellement jouable. L’économie des Cores et la reprise après simple mise en arrière-plan restent deux limites connues et assumées.',
});

const totalWar = projects.find(project => project.id === 'totalwarai');
if (totalWar) Object.assign(totalWar, {
  description: 'Une expérimentation pour mesurer jusqu’où un agent tactique autonome peut aller quand les API du jeu ne lui donnent qu’une vision partielle de la bataille.',
  detail: 'Pont Lua/Python, télémétrie, règles, simulateur et essais réels ont permis d’explorer le contrôle autonome avant de révéler une limite structurelle d’information face à l’IA interne du moteur.',
  hint: 'Expérimentation arrêtée. Le projet n’a jamais gagné une vraie bataille ; sa valeur tient surtout à la démarche empirique et aux limites identifiées.',
});
