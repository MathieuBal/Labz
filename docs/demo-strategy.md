# Rendre les projets essayables

Étude du 21 octobre 2026. Lecture des arbres des cinq dépôts, de leurs README et des points d'entrée pertinents. Ce document décrit une faisabilité, pas une recette complète des cinq applications. Aucun dépôt privé n'est rendu public et aucun service payant n'est activé.

## Décision et ordre proposé

| Projet | Solution recommandée | Effort estimatif restant | Décision |
| --- | --- | --- | --- |
| Diagnostic numérique | Utiliser la démonstration déjà présente sur le site, avec un guide explicite depuis Labz | Petit : liaison et recette partielle réalisées ; entrée directe dédiée à améliorer ensuite | Premier projet rendu accessible en v0.12 |
| Chess Vision Trainer | Bundle navigateur autonome, moteur local chargé à la demande | Moyen : chemins Pages, distribution du moteur et de ses notices, CI, essai tactile et performances | Prochaine vraie préparation de démo |
| Pip-Boy JDR | Campagne fictive courte, stockage de démo distinct et entrée explicite | Moyen : scénario d'accueil, isolation des données existantes et contrôle des médias | Après Chess, ou avant si priorité au JDR |
| Constella | Univers de veille fictif, sources et synthèses préparées, édition locale | Important : adaptateur de données de démonstration, neutralisation des appels externes, reprise du journal sans serveur | Démonstration du parcours complet avant toute IA publique |
| AtelierFlow | Bac à sable du moteur avec une équipe entièrement fictive, en mémoire | Important : interface simplifiée, remplacement du stockage serveur pour la démo, réinitialisation et explications | Ne pas héberger une base partagée ouverte |

Estimations relatives fondées sur les dépendances observées, sans engagement de délai. Il reste à compiler et essayer les quatre dernières applications avant de chiffrer précisément.

## Diagnostic numérique — première livraison

Le README annonce une démonstration ; `dist/app.js` la confirme : clé `diagnostic-demo-v1` distincte, démarrage marqué `demo`, retour immédiat de `sync()` avant appel réseau pour cet état. Le formulaire normal reste destiné aux vraies séances. Le lien Labz mène donc au site, avec le libellé honnête **Ouvrir le site** et les deux commandes de démonstration visibles dans l'introduction.

Recette réalisée sur le site publié : ouverture du panneau, lancement sans identité, passage des habitudes, choix d'une réponse, progression jusqu'au premier mini-jeu. Le bandeau confirme le mode démonstration. Aucun bouton de participation réelle utilisé. Pas d'inspection des requêtes réseau ni de test RLS dans cette étude ; la non-transmission est vérifiée par lecture de la branche de code, pas par capture réseau.

Limites : pas de parcours complet de 36 écrans, pas de recette iPhone réel, manipulations de fichiers adaptées au PC, corrections prévues avec animateur. Une future entrée `demo` dédiée réduirait le risque de confusion avec le formulaire de séance.

Référence examinée : arbre Git `e7f79ff88bca2395b1a9d5ce413641ed74069fc4`.

## Chess Vision Trainer

Lecture de `package.json`, `vite.config.ts`, `scripts/copy-engine.mjs`, `src/engine/stockfishWorker.ts` et README. React/TypeScript/Vite ; moteur WASM en Worker monothread, lancé à la demande. Pas besoin apparent d'un serveur métier pour les calques et l'entraînement.

Travaux concrets : adapter la base Vite et le chemin absolu `/stockfish/` au sous-répertoire ; rendre l'absence de fichiers moteur bloquante à la construction ; documenter les licences et fournir les éléments requis de la distribution du moteur après vérification ; tester FEN, prédiction/révélation, analyse, erreur de chargement, import d'image et mémoire sur téléphone. Le dépôt demeure privé : définir la diffusion du bundle sans changement de visibilité du dépôt.

Référence : arbre Git `e3b0ab4ffe23da3c6919b39d029f17c49fff0357`. Ni compilation ni exécution réalisées ici.

## Pip-Boy JDR

Lecture de `src/App.tsx`, `src/store.ts`, `src/data.ts`, `src/startup.tsx`, README et notice des cartes. Le mode local existe, mais l'état initial contient désormais une campagne vide. L'ancien README ne suffit donc pas à promettre une expérience immédiate. Une préférence de session enregistrée peut réactiver la session connectée : le lien ordinaire n'est pas une entrée de démonstration isolée.

Préparer une aventure originale de trois fiches : découvrir un lieu, recevoir une quête, ouvrir un document. Clé de stockage distincte, aucune reprise automatique de session connectée, bouton recommencer limité à cette démo, bascule joueur/MJ expliquée. Vérifier tous les médias avant publication : une notice de cartes ne couvre pas à elle seule tous les fichiers du dépôt. Ne pas utiliser la vraie campagne comme jeu de test public.

Référence : arbre Git `1eff7f5ce97eff234e97c24ec721ed1c9487450c`. Pas de connexion ni d'écriture en base effectuée.

## Constella

Lecture de l'arbre, README, client d'archivage et conversion de synthèse en article, ainsi que du point d'entrée du service de génération. Le frontend React/Three.js conserve un état local, mais le journal et les articles s'appuient aussi sur un service distinct ; la génération assistée dépend d'un backend IA. Un simple export statique ne restituerait pas proprement le parcours annoncé.

Démo proposée : un sujet fictif, plusieurs sources originales préparées, constellations explorables, synthèse explicitement pré-calculée puis article modifiable. Adaptateur local pour le journal et les articles, aucun appel de génération payant, aucun appel à un service local de l'utilisateur, réinitialisation limitée au bac à sable. Évaluer le coût de la 3D et proposer une liste utilisable sur téléphone. Une vraie veille publique viendra séparément avec limites de consommation et isolation.

Référence : arbre Git `44381f3847abd5a92a0fc18706980d76ada77deb`. Faisabilité examinée, application non exécutée.

## AtelierFlow

Lecture du README et de `src/lib/planning/engine.ts`, inspection de l'arbre. Application Next.js avec routes serveur et Prisma/PostgreSQL. Le moteur de répartition est du TypeScript indépendant du framework et de la base : c'est la bonne unité à réutiliser pour une démonstration légère.

Démo proposée : six personnes inventées, compétences et disponibilités modifiables, génération, conflits et justifications visibles. Afficher clairement que le responsable décide. Recréer les données d'exemple avec des noms et situations fictifs, sans reprendre le contexte professionnel réel. Aucun changement dans les plannings opérationnels. L'application complète demanderait un hébergement serveur et une isolation par visiteur ; Codespaces reste une option technique, pas un parcours grand public.

Référence : arbre Git `419726a267c6c4cd89b14f5d7dc7684165b598de`. Ni serveur ni base de démo démarrés.

## Critères avant chaque bouton d'essai

- Entrée sans compte et scénario compréhensible en quelques minutes.
- Démonstration distincte des données et sessions réelles ; remise à zéro limitée à la démo.
- Absence de secrets et d'appels payants incontrôlés.
- Médias et dépendances distribuables, notices vérifiées.
- Essai réel du chemin depuis Labz ; version et nouveautés publiées ensemble.
- Annoncer séparément lecture de code, tests automatisés, recette navigateur et appareil réel.
