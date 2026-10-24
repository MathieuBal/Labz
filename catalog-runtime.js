import { projects } from './catalog.js';

const pipboy = projects.find(project => project.id === 'pipboy');
if (pipboy) Object.assign(pipboy, {
  mode: 'Démo locale · session réelle séparée',
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
