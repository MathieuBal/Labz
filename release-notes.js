// Journal public des versions livrées avec ce site.
import {releases as previousReleases} from './release-history.js';

export const releases = [
  {
    version: "0.18.19",
    date: "2026-11-21",
    title: "Fourmiz : suivre un tas disputé",
    description: "La fiche présente les deux colonies et propose une première observation sur le terrain des nids voisins.",
    items: ["Le guide explique comment suivre une ouvrière, repérer une offensive et voir qui rapporte les graines."]
  },
  {
    version: "0.18.18",
    date: "2026-11-19",
    title: "Deux fourmilières dans Fourmiz",
    description: "Depuis Labz, Fourmiz démarre avec les colonies ocre et bleue.",
    items: ["Observe les rencontres sur le grand terrain.", "Le mode à une colonie reste accessible dans la démo."]
  },
  {
    version: "0.18.17",
    date: "2026-11-18",
    title: "Ton avis pendant la démo",
    description: "Les démos web s’ouvrent dans Labz. Une invitation te permet de donner ton avis pendant l’essai.",
    items: ["Fourmiz rejoint les jeux du catalogue avec sa simulation tactile de colonie.", "Ferme le formulaire pour reprendre ta démo au même endroit."]
  },
{
  "version": "0.18.16",
  "date": "2026-10-30",
  "title": "AFK Farm : récolte immersive et progression revue",
  "description": "La fiche et le guide reflètent la nouvelle version jouable.",
  "items": [
    "La récolte agrandit son espace et masque les menus pendant la session.",
    "L’arbre propose zoom et accès direct aux branches ; les perks et les Cores ont reçu une première correction d’équilibrage.",
    "Le chantier montre les modules du vaisseau et leurs bonus. La progression longue reste en cours d’ajustement."
  ]
},
  {
    "version": "0.18.15",
    "date": "2026-10-26",
    "title": "L’administration peut écarter les retours non pertinents",
    "description": "Les messages bruts inutiles peuvent maintenant être supprimés directement depuis l’espace privé, sans toucher aux sujets ou aux décisions déjà structurés.",
    "items": [
      "Chaque retour dispose d’une action Supprimer avec confirmation explicite avant effacement définitif.",
      "Si le retour était lié à un sujet, son lien disparaît automatiquement mais le sujet, sa synthèse et son historique de décisions restent conservés.",
      "Le droit DELETE reste réservé aux comptes administrateurs autorisés par RLS, et le client vérifie que le serveur confirme bien la suppression avant de rafraîchir la boîte."
    ]
  },
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
