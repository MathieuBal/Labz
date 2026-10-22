// Catalogue éditorial explicite : aucun dépôt privé n'est automatiquement publié.
// Les descriptions proviennent des README examinés et de l'audit Constella.
const project = (id, name, category, description, extra = {}) => ({id, name, category, description, art:'orbit', mode:'Présentation', ...extra});
export const categories = {jeux:'Jeux', experiences:'Expériences', outils:'Outils'};
const visitorGuides = {
  "diagnostic": {
    "invitation": "Sur le site, ouvre « Essayer avant de commencer », puis « Essayer la démonstration ».",
    "firstTry": "Essaie une question puis un mini-jeu",
    "steps": [
      "Ouvre le site et déplie « Essayer avant de commencer » sous le formulaire.",
      "Clique sur « Essayer la démonstration » : aucun prénom ni code de séance n’est nécessaire.",
      "Passe les habitudes, réponds à la première question puis essaie le mini-jeu des touches. Tu peux changer de partie librement."
    ],
    "controls": "Boutons, choix et listes au doigt ou à la souris. Les manipulations de fichiers sont conçues pour un ordinateur.",
    "saveNote": "En démonstration, les réponses restent dans ce navigateur, séparées des vraies séances. Utilise « Reprendre mon essai » pour les retrouver.",
    "comfort": "Le parcours complet est prévu pour un atelier de 90 minutes. Pour découvrir le projet, quelques activités suffisent. Les corrections sont prévues pour le débrief avec un animateur.",
    "takeaway": "Questions, mini-jeux et manipulations pour préparer des ateliers adaptés. La démonstration ne transmet pas tes réponses à un animateur."
  },
  "perfoptimize": {
    "cover": "assets/perfoptimize-cockpit.svg",
    "coverLabel": "APERÇU REPRÉSENTATIF · DONNÉES ILLUSTRATIVES",
    "gallery": [
      {"src":"assets/perfoptimize-cockpit.svg","alt":"Vue d’ensemble représentative du cockpit Perfoptimize","label":"Cockpit complet · données illustratives","zoom":1},
      {"src":"assets/perfoptimize-cockpit.svg","alt":"Vue rapprochée des mesures FPS GPU et frametimes de Perfoptimize","label":"Mesures FPS, GPU et frametimes · données illustratives","zoom":1.55,"x":"56%","y":"48%"},
      {"src":"assets/perfoptimize-cockpit.svg","alt":"Vue rapprochée du diagnostic et du plan à prévisualiser de Perfoptimize","label":"Diagnostic et plan à prévisualiser · données illustratives","zoom":1.65,"x":"72%","y":"73%"}
    ],
    "invitation": "Perfoptimize est une application locale Windows : elle doit tourner sur ton PC pour lire le jeu en cours et mesurer CPU, GPU, mémoire, FPS et frametimes. Commence par une analyse : elle ne modifie rien.",
    "firstTry": "Ton premier test : analyser un jeu en cours d’exécution",
    "steps": [
      "Télécharge puis décompresse entièrement l’archive Windows x64.",
      "Lance Perfoptimize.exe. Windows peut afficher SmartScreen parce que cette alpha n’est pas encore signée : vérifie simplement que l’archive vient bien du lien Labz.",
      "Démarre un jeu pris en charge et effectue une analyse dans une scène représentative.",
      "Lis le diagnostic et les recommandations. Toute modification compatible est d’abord prévisualisée ; les fichiers concernés sont sauvegardés avant écriture et peuvent être restaurés."
    ],
    "controls": "L’exécutable lance le moteur local qui prend les mesures sur ton PC, puis ouvre l’interface dans ton navigateur. Ce n’est pas un site distant qui essaie d’accéder à ta machine.",
    "saveNote": "Une analyse seule n’écrit rien sur le PC. Si tu choisis d’appliquer un réglage compatible, Perfoptimize affiche le plan exact, crée une sauvegarde puis permet une restauration.",
    "comfort": "Pourquoi un .exe ? Un navigateur web n’a pas accès aux processus du jeu, aux compteurs matériels ni aux fichiers de configuration nécessaires au diagnostic. L’alpha est non signée, donc Windows peut afficher un avertissement. Certains jeux restent volontairement en analyse seule tant que leurs réglages automatiques ne sont pas assez vérifiés.",
    "takeaway": "Perfoptimize n’est pas un « booster magique » : il mesure ce qui se passe réellement sur la machine, identifie le goulot d’étranglement et explique les réglages proposés avant toute modification."
  },
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
    "gallery": [
      {"src":"assets/pixels-campaign.webp","alt":"Toile issue du jeu Million de pixels","label":"Toile issue du jeu","zoom":1},
      {"src":"assets/pixels-campaign.webp","alt":"Vue rapprochée de la toile de Million de pixels","label":"Vue rapprochée de la toile","zoom":1.55,"x":"62%","y":"55%"}
    ],
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
    "gallery": [
      {"src":"assets/lootchest-chest.png","alt":"Coffre issu de Lootchest","label":"Coffre issu du jeu","zoom":1},
      {"src":"assets/lootchest-chest.png","alt":"Détail rapproché du coffre de Lootchest","label":"Détail du coffre","zoom":1.65,"x":"50%","y":"51%"}
    ],
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
  },
  "pipboy": {
    "cover": "https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/maps/commonwealth.jpg",
    "coverLabel": "VISUELS ISSUS DU PROJET",
    "gallery": [
      {"src":"https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/maps/commonwealth.jpg","alt":"Carte du Commonwealth utilisée dans Pip-Boy JDR","label":"Carte de campagne · contenu réel du projet","zoom":1},
      {"src":"https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/maps/smoky/region.webp","alt":"Carte régionale Smoky Waters utilisée dans Pip-Boy JDR","label":"Carte de scénario Smoky Waters","zoom":1},
      {"src":"https://raw.githubusercontent.com/MathieuBal/Pipboy/main/public/illustrations/smoky/superviseur.webp","alt":"Illustration du Superviseur utilisée dans Pip-Boy JDR","label":"Illustration de fiche · bibliothèque MJ","zoom":1}
    ],
    "invitation": "Ouvre directement le compagnon : sans configuration Supabase, Pip-Boy démarre en démonstration locale clairement signalée.",
    "firstTry": "Ton premier test : passer de la vue joueur à la Console MJ",
    "steps": [
      "Lance Pip-Boy depuis Labz : la démonstration locale fonctionne sans compte ni code.",
      "Explore la carte et les fiches visibles côté joueur.",
      "Ouvre la Console MJ, consulte le catalogue puis envoie une fiche secrète au joueur.",
      "Reviens en vue joueur : la fiche transmise apparaît dans son module."
    ],
    "controls": "L’interface est mobile-first et fonctionne au doigt ou à la souris. Les vues joueur et MJ utilisent des routes distinctes dans la même application.",
    "saveNote": "En démonstration locale, les échanges et sauvegardes restent dans ce navigateur et ne relient pas deux appareils. Une vraie session multi-appareils nécessite la configuration Supabase prévue par le projet.",
    "comfort": "La démo contient des données prévues pour être publiques côté frontend. N’y mets pas de secret réel. Pour une campagne connectée, le rôle MJ et la projection joueur sont contrôlés côté serveur.",
    "takeaway": "Un compagnon de campagne qui sépare ce que prépare le MJ de ce que voit le joueur, avec cartes, documents, quêtes, terminaux et bibliothèques."
  }
};
export const projects = [
project('sensoria','Sensoria','experiences','Explore des tableaux sensoriels où chacun de tes gestes transforme l’image.',{art:'ink',mode:'Navigateur',live:'https://mathieubal.github.io/Sensoria/',repo:'https://github.com/MathieuBal/Sensoria',action:'Lancer l’expérience',detail:'Un espace pour explorer librement des tableaux interactifs. Choisis une ambiance, essaie un geste et observe la réaction.',hint:'L’expérience s’ouvre dans un nouvel onglet. Les performances dépendent de ton appareil.'}),
project('million-de-pixels','Million de pixels','jeux','Transforme ton image en un million de pixels à détruire, couleur par couleur.',{art:'pixels',mode:'Navigateur',live:'https://mathieubal.github.io/million-de-pixels/',repo:'https://github.com/MathieuBal/million-de-pixels',action:'Jouer',detail:'Une image devient ton terrain de jeu : explore les couleurs et fais disparaître les pixels.',hint:'Ouvre le jeu pour choisir ton image et découvrir ses commandes.'}),
project('lootchest','Lootchest','jeux','Ouvre des coffres, équipe ton héros et explore des donjons toujours plus profonds.',{art:'chest',mode:'Navigateur',live:'https://mathieubal.github.io/Lootchest/',repo:'https://github.com/MathieuBal/Lootchest',action:'Jouer',detail:'Des coffres, de l’équipement et une progression dans les donjons. Découvre ce que réserve la prochaine ouverture.',hint:'Le jeu s’ouvre dans un nouvel onglet. Garde le même navigateur pour retrouver ses données locales.'}),
project('diagnostic','Diagnostic numérique','outils','Fais le point sur tes usages numériques à travers des questions et des manipulations.',{art:'tools',mode:'Démo guidée',live:'https://mathieubal.github.io/diagnostic-numerique/',action:'Ouvrir le site',launchLabel:'Ouvrir le site',hint:'La démonstration est accessible depuis « Essayer avant de commencer ». Le bouton « Rejoindre la séance » est réservé aux vrais ateliers.',repo:'https://github.com/MathieuBal/diagnostic-numerique',detail:'Un support conçu pour des ateliers de médiation numérique. L’accès à une session dépend du cadre de l’atelier.'}),
project('perfoptimize','Perfoptimize','outils','Analyse les performances de ton PC en jeu et transforme les mesures en recommandations vérifiables.',{art:'tools',mode:'Application locale Windows',live:'https://mathieubal.github.io/Perfoptimize/Perfoptimize-alpha-win-x64.zip',action:'Télécharger pour Windows',launchLabel:'Télécharger pour Windows',detail:'Perfoptimize tourne localement sur le PC afin de mesurer ce qu’un site web ne peut pas lire : processus du jeu, CPU, GPU, mémoire et frametimes. L’analyse seule n’écrit rien ; les changements compatibles sont prévisualisés, sauvegardés et restaurables.',hint:'Windows x64 uniquement. Le fichier .exe est nécessaire pour accéder aux mesures locales du PC. Alpha non signée : Windows peut afficher SmartScreen ; vérifie que le téléchargement vient bien de Labz.'}),
project('constella-explore','Constella Explore','outils','Compare ce que tu aimes et fais apparaître une carte 3D de tes goûts.',{art:'orbit',mode:'Prototype privé',detail:'La branche exploration de Constella : domaines personnels, critères, évaluations, duels, attributs, PCA, regroupements, constellations et insights. Elle répond au besoin de comprendre ses préférences, pas de faire de la veille.',hint:'Le produit est désormais distingué de Constella Watch dans Labz. Le socle technique reste partagé pour éviter une duplication prématurée.'}),
project('constella-watch','Constella Watch','outils','Suis un sujet dans le temps, garde ce qui compte et transforme ta veille en journal exploitable.',{art:'orbit',mode:'Prototype privé',detail:'La branche veille de Constella : configuration de sources, collecte, fraîcheur, déduplication, ranking, journal cumulatif, synthèses, brouillons et articles. Elle répond à un besoin de suivi éditorial continu.',hint:'Présenté comme un outil distinct de Constella Explore. La séparation des builds ou des dépôts viendra seulement si les dépendances, la sécurité ou les rythmes d’évolution l’exigent.'}),
project('chess','Chess Vision Trainer','jeux','Apprends à repérer les menaces, les défenses et les occasions tactiques sur un échiquier.',{art:'chess',detail:'Un projet d’entraînement à la lecture de l’échiquier.',hint:'L’accès public reste à préparer.'}),
project('pipboy','Pip-Boy JDR','outils','Retrouve cartes, quêtes et documents dans un compagnon de campagne pour tes parties de JDR.',{art:'tools',mode:'Navigateur · démo locale',live:'https://mathieubal.github.io/Pipboy/',repo:'https://github.com/MathieuBal/Pipboy',action:'Lancer le compagnon',launchLabel:'Lancer le compagnon',detail:'Un compagnon de campagne mobile-first avec carte, quêtes, documents, terminaux, bibliothèques et Console MJ. Sans configuration Supabase, la version publique démarre en démonstration locale ; une vraie session peut ensuite relier MJ et joueur sur deux appareils.',hint:'La démonstration locale est immédiatement accessible. Les données de démo restent dans le navigateur ; la session multi-appareils est un mode distinct.'}),
project('atelierflow','AtelierFlow','outils','Prépare la répartition de ton équipe dans l’atelier en gardant la décision finale.',{art:'tools',detail:'Un assistant de répartition des postes qui tient compte des compétences et de l’équité. Le responsable garde la décision finale.',hint:'L’application nécessite un serveur et une base de données. Une démonstration avec des données fictives reste à préparer.'}),
].map(p => ({...p, ...visitorGuides[p.id]}));
export const retiredProjectIds = ["afk-farm", "tricat", "clicreflex-python", "ball-passing", "zeprasso", "zepevents", "hotzdoggz", "saloon", "totalwar", "blackjack", "sudoku", "vlc", "deezer", "ecoride", "quai-antique", "books"];
export function filterProjects(query='',category='all') {const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const q=normalize(query.trim());return projects.filter(p=>(category==='all'||p.category===category)&&normalize(`${p.name} ${p.description} ${p.mode} ${categories[p.category]}`).includes(q));}
