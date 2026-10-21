// Journal public des versions livrées avec ce site.
export const releases = [
  {
    "version": "0.9.0",
    "date": "2026-10-21",
    "title": "Les nouveautés suivent les versions du labo",
    "description": "Le journal du site et le numéro de version sont désormais synchronisés à chaque publication.",
    "items": [
      "Les nouveautés manquantes des versions 0.7 et 0.8 ont été ajoutées.",
      "L’accueil, le journal et le pied de page partagent la même source.",
      "Une vérification bloque les publications dont la note de version manque."
    ]
  },
  {
    "version": "0.8.0",
    "date": "2026-10-20",
    "title": "Moins de lecture, plus de place pour essayer",
    "description": "Les fiches projet vont à l’essentiel : lancer une expérience ou déposer un avis.",
    "items": [
      "Lancer et Déposer un avis sont placés sous le titre.",
      "Guides et évolutions sont regroupés dans des rubriques dépliables.",
      "Les avis sont envoyés uniquement dans la messagerie privée de Mathieu."
    ]
  },
  {
    "version": "0.7.0",
    "date": "2026-10-20",
    "title": "Une boîte privée pour faire avancer les projets",
    "description": "Mathieu peut consulter et organiser les retours depuis son espace Administration dans Labz.",
    "items": [
      "Recherche et filtres par projet ou statut.",
      "Suivi des retours : Nouveau, En cours ou Traité.",
      "Les messages restent privés et réservés au propriétaire."
    ]
  },
  {
    "version": "0.6.0",
    "date": "2026-10-20",
    "title": "Un retour, sans créer de compte",
    "description": "Tu peux maintenant envoyer une idée, un problème ou un avis directement à Mathieu depuis la fiche d’un projet.",
    "items": [
      "Envoi privé avec confirmation de réception.",
      "Ton brouillon reste disponible si la connexion échoue.",
      "Le partage public sur GitHub reste une option distincte."
    ]
  },
  {
    "version": "0.5.0",
    "date": "2026-10-20",
    "title": "Choisis une expérience, puis entre dans le jeu",
    "description": "Les trois expériences accessibles expliquent maintenant comment commencer, ce que tu peux y faire et comment leur sauvegarde fonctionne.",
    "items": [
      "Lancement direct depuis les cartes des jeux.",
      "Premiers pas, commandes et conseils propres à chaque expérience.",
      "Une toile de Million de pixels et un coffre de Lootchest remplacent leurs illustrations génériques."
    ]
  },
  {
    "version": "0.4.0",
    "date": "2026-10-20",
    "title": "Moins de projets, plus de découvertes",
    "description": "Une sélection resserrée de huit créations : trois expériences à lancer et cinq projets à découvrir, avec un accès clairement indiqué.",
    "items": [
      "Les exercices, doublons et projets trop éloignés d’une démonstration sortent du catalogue.",
      "Les présentations sont séparées des expériences accessibles.",
      "Les dépôts et leur historique sont conservés."
    ]
  },
  {
    "version": "0.3.0",
    "date": "2026-10-20",
    "title": "Les projets racontent leur évolution",
    "description": "Les fiches reliées à un dépôt public affichent les versions publiées sur GitHub. En leur absence, les changements du code sont identifiés séparément.",
    "items": [
      "Nouveautés de Sensoria, Million de pixels, Lootchest et Diagnostic numérique.",
      "Actualisation à l’ouverture des fiches, avec cache de 15 minutes dans la session.",
      "Messages explicites en cas de panne ou de limite GitHub."
    ]
  },
  {
    "version": "0.2.0",
    "date": "2026-10-20",
    "title": "Un labo qui se souvient de tes découvertes",
    "description": "Retrouve tes favoris, relance les projets déjà ouverts et trouve plus vite une expérience à essayer.",
    "items": [
      "Favoris et historique conservés sur ton appareil.",
      "Filtres combinables, tri et partage natif sur mobile.",
      "Brouillons sauvegardés automatiquement et publication optionnelle sur GitHub."
    ]
  },
  {
    "version": "0.1.0",
    "date": "2026-10-19",
    "title": "Le labo prend forme",
    "description": "Une première interface pour parcourir les projets, chercher une idée et ouvrir les expériences. Les retours sont encore des brouillons locaux."
  }
];
export const currentRelease = releases[0];
export const updates = releases.map(({version,...note}) => ({...note,project:`Labz · version ${version}`}));
