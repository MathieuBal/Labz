// Catalogue éditorial explicite : aucun dépôt privé n'est automatiquement publié.
// Les descriptions proviennent des README examinés et de l'audit Constella.
const project = (id, name, category, description, extra = {}) => ({id, name, category, description, art:'orbit', mode:'Présentation', ...extra});
export const categories = {jeux:'Jeux', experiences:'Expériences', outils:'Outils'};
const visitorGuides = {
  "sensoria": {
    "invitation": "Dessine un geste. Regarde la matière lui répondre.",
    "firstTry": "Pour commencer : Encres flottantes",
    "steps": [
      "Ouvre la galerie et choisis Encres flottantes.",
      "Fais glisser ton doigt ou la souris pour explorer le tableau.",
      "Utilise le bouton ? pour retrouver les gestes, puis reviens à la galerie pour changer d’ambiance."
    ],
    "controls": "Au doigt ou à la souris. Chaque tableau possède sa propre aide ; les réglages sont accessibles avec ⋮.",
    "saveNote": "Les compositions sont éphémères : elles s’effacent en quittant un tableau. Certains réglages, comme la palette et les effets réduits, restent sur cet appareil.",
    "comfort": "Si le rendu ralentit, active les effets réduits. Certains tableaux demandent WebGL2 ; les autres restent accessibles si ton appareil ne le prend pas en charge.",
    "takeaway": "22 tableaux, du lac nocturne aux encres en mouvement. Aucun score à atteindre."
  },
  "million-de-pixels": {
    "cover": "assets/pixels-campaign.webp",
    "coverLabel": "TOILE ISSUE DU JEU · PAS UNE CAPTURE",
    "invitation": "Une image entière à grignoter, couleur après couleur.",
    "firstTry": "Ton premier objectif : observer une couleur disparaître",
    "steps": [
      "Importe une image pour en faire ton plateau de jeu.",
      "Observe le canon détruire les pixels correspondant à sa couleur.",
      "Utilise les pixels gagnés pour améliorer ta progression."
    ],
    "controls": "Utilise les boutons du jeu pour les améliorations. La molette ou le pincement permettent de zoomer sur la toile.",
    "saveNote": "La progression est conservée dans la base locale du navigateur. Reviens avec le même navigateur et sur le même appareil ; effacer les données du site peut effacer tes parties.",
    "comfort": "Le traitement d’une image et les effets peuvent demander davantage de ressources sur téléphone. Attends la fin du chargement avant de commencer.",
    "takeaway": "Ton image devient le terrain de jeu. Les améliorations transforment progressivement la façon de la détruire."
  },
  "lootchest": {
    "cover": "assets/lootchest-chest.png",
    "coverLabel": "COFFRE ISSU DU JEU · PAS UNE CAPTURE",
    "invitation": "Un coffre, une trouvaille, puis un étage de plus.",
    "firstTry": "Ton premier objectif : préparer ton héros pour le donjon",
    "steps": [
      "Ouvre un coffre pour obtenir tes premières pièces d’équipement.",
      "Sélectionne un objet dans l’inventaire pour consulter ses actions et l’équiper.",
      "Entre dans le donjon pour mettre ton équipement à l’épreuve."
    ],
    "controls": "Sur téléphone, touche un objet pour ouvrir ses actions. Sur ordinateur, sélectionne-le dans l’inventaire pour consulter son détail.",
    "saveNote": "La progression est sauvegardée automatiquement dans ce navigateur. Utilise l’export de sauvegarde du jeu pour conserver une copie et l’import pour la restaurer.",
    "comfort": "Une plongée dans les Profondeurs est temporaire : recharger la page abandonne la plongée en cours. La sauvegarde du personnage et ce mode de jeu sont distincts.",
    "takeaway": "L’intérêt est de choisir ton équipement et de construire ta progression, au-delà de la simple ouverture de coffres."
  }
};
export const projects = [
project('sensoria','Sensoria','experiences','Explore des tableaux sensoriels où chacun de tes gestes transforme l’image.',{art:'ink',mode:'Navigateur',live:'https://mathieubal.github.io/Sensoria/',repo:'https://github.com/MathieuBal/Sensoria',action:'Lancer l’expérience',detail:'Un espace pour explorer librement des tableaux interactifs. Choisis une ambiance, essaie un geste et observe la réaction.',hint:'L’expérience s’ouvre dans un nouvel onglet. Les performances dépendent de ton appareil.'}),
project('million-de-pixels','Million de pixels','jeux','Transforme ton image en un million de pixels à détruire, couleur par couleur.',{art:'pixels',mode:'Navigateur',live:'https://mathieubal.github.io/million-de-pixels/',repo:'https://github.com/MathieuBal/million-de-pixels',action:'Jouer',detail:'Une image devient ton terrain de jeu : explore les couleurs et fais disparaître les pixels.',hint:'Ouvre le jeu pour choisir ton image et découvrir ses commandes.'}),
project('lootchest','Lootchest','jeux','Ouvre des coffres, équipe ton héros et explore des donjons toujours plus profonds.',{art:'chest',mode:'Navigateur',live:'https://mathieubal.github.io/Lootchest/',repo:'https://github.com/MathieuBal/Lootchest',action:'Jouer',detail:'Des coffres, de l’équipement et une progression dans les donjons. Découvre ce que réserve la prochaine ouverture.',hint:'Le jeu s’ouvre dans un nouvel onglet. Garde le même navigateur pour retrouver ses données locales.'}),
project('diagnostic','Diagnostic numérique','outils','Fais le point sur tes usages numériques à travers des questions et des manipulations.',{art:'tools',repo:'https://github.com/MathieuBal/diagnostic-numerique',detail:'Un support conçu pour des ateliers de médiation numérique. L’accès à une session dépend du cadre de l’atelier.'}),
project('constella','Constella','outils','Explore tes sujets en constellations et transforme ta veille en journaux éditables.',{art:'orbit',detail:'Un outil de veille et d’exploration, avec collecte de sources, synthèses assistées par IA et édition d’articles. Le projet nécessite encore une installation et des services dédiés.',hint:'Une démonstration publique reste à préparer.'}),
project('chess','Chess Vision Trainer','jeux','Apprends à repérer les menaces, les défenses et les occasions tactiques sur un échiquier.',{art:'chess',detail:'Un projet d’entraînement à la lecture de l’échiquier.',hint:'L’accès public reste à préparer.'}),
project('pipboy','Pip-Boy JDR','outils','Retrouve cartes, quêtes et documents dans un compagnon de campagne pour tes parties de JDR.',{art:'tools',detail:'Un compagnon de campagne avec carte, quêtes, documents et console du maître du jeu. Le mode local et la session connectée ont des usages distincts.',hint:'La démonstration publique reste à vérifier avant d’ajouter un bouton de lancement.'}),
project('atelierflow','AtelierFlow','outils','Prépare la répartition de ton équipe dans l’atelier en gardant la décision finale.',{art:'tools',detail:'Un assistant de répartition des postes qui tient compte des compétences et de l’équité. Le responsable garde la décision finale.',hint:'L’application nécessite un serveur et une base de données. Une démonstration avec des données fictives reste à préparer.'}),
].map(p => ({...p, ...visitorGuides[p.id]}));
export const retiredProjectIds = ["afk-farm", "tricat", "clicreflex-python", "ball-passing", "zeprasso", "zepevents", "hotzdoggz", "saloon", "perfoptimize", "totalwar", "blackjack", "sudoku", "vlc", "deezer", "ecoride", "quai-antique", "books"];
export function filterProjects(query='',category='all') {const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const q=normalize(query.trim());return projects.filter(p=>(category==='all'||p.category===category)&&normalize(`${p.name} ${p.description} ${p.mode} ${categories[p.category]}`).includes(q));}
