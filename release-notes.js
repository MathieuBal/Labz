// Journal public des versions livrées avec ce site.
import {releases as previousReleases} from './release-history.js';

export const releases = [
  {
    "version": "0.18.14",
    "date": "2026-10-26",
    "title": "Perfoptimize clarifie ce que les essais matériels prouvent vraiment",
    "description": "La fiche distingue désormais clairement les corrections issues des essais sur ma machine de ce qui reste à valider sur plusieurs configurations.",
    "items": [
      "Une formulation pouvant suggérer un lien de cause à effet non démontré disparaît entièrement de la narration Perfoptimize.",
      "Le bloc consacré aux essais se concentre maintenant sur les écarts réellement observés : démarrage WMI, télémétrie et recommandation Engine Multithreading.",
      "Le statut indique simplement que l’alpha a été essayée sur ma configuration mais n’est pas encore validée sur plusieurs machines."
    ]
  },
  {
    "version": "0.18.13",
    "date": "2026-10-26",
    "title": "Les parcours critiques passent dans un vrai navigateur",
    "description": "La CI lance maintenant Labz dans Chromium et vérifie les parcours que les tests de source ne peuvent pas réellement reproduire.",
    "items": [
      "Sept parcours couvrent la fiche riche, l’URL statique d’un projet, la recherche et les favoris, le feedback réussi ou en panne, la navigation mobile et l’administration simulée.",
      "Les appels Supabase sont interceptés pendant ces tests : aucun feedback ni changement administrateur de production n’est créé par la CI.",
      "Les traces, captures et le rapport Playwright permettent d’analyser une régression navigateur avant qu’un déploiement GitHub Pages soit autorisé."
    ]
  },
  ...previousReleases,
];
export const currentRelease = releases[0];
export const updates = releases.map(({version,...note}) => ({...note,project:`Labz · version ${version}`}));
