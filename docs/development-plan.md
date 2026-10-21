# Plan de développement Labz

Date : 21 octobre 2026. Décision : réaliser les améliorations par livraisons vérifiées, puis publier sur GitHub Pages sans nouvelle confirmation. Maximum trois sujets actifs simultanément. Ne pas supprimer de projet ou dépôt.

## Objectif

Découvrir les projets, recevoir des retours privés et décider de leur suite directement dans Labz. Préserver la simplicité de l'interface et la confidentialité des messages. Le regroupement en sujets vient après la fiabilisation de la boîte.

## Lot A — Livré en v0.10.0

Publié et vérifié en ligne : 28 tests, garde-fou Git, navigation clavier sur accueil/fiche/admin et formulaire. Pas de recette iPhone réel.

1. Navigation accessible : réparer Aller au contenu sans perdre la route ; titres des nouveautés cohérents.
2. Fiches : recommandations « À découvrir aussi », avis explicitement sur le concept sans démo ; nombre de projets calculé.
3. Publication et continuité : comparer la version au commit précédent, exiger une nouvelle note, corriger les documents anciens.

Validation : tests Node, build, chemins Pages, essai du garde-fou sur historique Git ; vérification en navigateur du lien d'évitement sur accueil, fiche et admin, formulaire et nouveautés. Confirmer le job de déploiement et la version en ligne. Aucune modification de base dans ce lot.

## Lot B — Réception fiable (v0.11.0)

1. Identifiant d'envoi durable associé au contenu exact et au brouillon ; conserver l'accusé après rechargement ; distinguer un nouveau texte d'une relance.
2. Commande d'effacement du brouillon, durée locale documentée, états reçu / modifié / non confirmé. Aucun effacement silencieux après panne.
3. Tests réponse perdue → rechargement → relance, modification pendant l'envoi, stockage indisponible, fermeture du formulaire pendant requête.

Validation : un seul message enregistré pour une relance identique, texte modifié traité comme nouveau retour, message privé rendu comme texte. Recette iPhone requise ; annoncer séparément ce qui est simulé et testé réellement.

## Exploration suivante — Rendre les présentations essayables

Demande de Mathieu du 21 octobre : évaluer ensuite les programmes sans démo, sans ouvrir automatiquement leurs données ou dépôts.

Pour chacun (Diagnostic numérique, Pip-Boy JDR, Chess Vision Trainer, Constella, AtelierFlow), lire le dépôt actuel et déterminer : point d’entrée, dépendances, données privées, secrets, besoins serveur, licence des contenus et fonctionnement tactile. Livrer une recommandation et un effort estimé fondés sur le code.

Options à comparer : version navigateur autonome ; démo avec données fictives et réinitialisation ; environnement serveur isolé et limité ; téléchargement/installateur vérifié si le Web n’est pas adapté. Pour les applications IA, éviter tout appel payant sans quota et consentement. Une vidéo reste une présentation, pas une démo jouable.

Choisir une seule première démo après cette étude. Un bouton Lancer n’est ajouté qu’après un essai réel du parcours visiteur et une validation de l’isolation des données. Ce chantier exploratoire n’implique pas de rendre un dépôt privé public.

## Lot C — Administration autonome et capacité

1. Récupération d'accès sécurisée : vérifier configuration Auth et redirections, intégrer la récupération, gérer expiration et erreur. Le propriétaire saisit lui-même son mot de passe hors conversation.
2. Capacité et cycle de vie : afficher limites, proposer gestion maîtrisée des messages traités ; définir conservation des synthèses avant toute suppression. « Traité » ne libère actuellement pas de place.
3. Protection contre abus et purge planifiée : tester hors production, préserver l'accessibilité et ne pas rendre public le quota ou les messages.

Validation : droits anonyme / compte sans droits / propriétaire ; fin de session pendant requête ; capacité libérée permettant un nouvel envoi ; purge selon règle explicite et vérifiable. Aucune purge réelle globale implicite. Vérifier sauvegarde/restauration avant action destructive.

## Lot D — Retours vers décisions

Créer des sujets privés distincts : projet, problème, résultat attendu, retours liés, impact, effort, justification, décision et état. Synthèse utile indépendante des messages bruts. Maximum trois sujets En cours contrôlé en base, y compris requêtes concurrentes. Différé et abandonné restent retrouvables.

Validation : regrouper deux retours ; retrouver une décision différée ; conserver la décision après expiration des sources ; aucun accès public aux sujets internes.

## Lot E — Progrès publics et édition dans Labz

Publication explicitement choisie et prévisualisée, séparée des données internes. États publics À l'étude / Prévu / En cours / Livré. Relier chaque livraison au projet et à un bouton d'essai. Réserver l'activité des commits à une rubrique technique. La rédaction des nouveautés depuis l'administration devra garder une source publique unique et tous les secrets côté serveur.

## Ensuite, selon usage

Visuels représentatifs, vrais aperçus de partage et pages projet statiques ; cache public des nouveautés externes ; liste admin compacte et pagination ; nettoyage du code historique. Mesurer avant de migrer l'architecture. Reporter comptes visiteurs, votes, classements et notifications multiples.

## Règles de validation communes

- Lire l'état distant et préserver les changements existants.
- Préparer la note avec `npm run release -- VERSION "Titre" "Résumé" "Changement"`.
- `npm run check`, `npm run build`, `node scripts/check-pages.mjs`.
- Le contrôle de différence Git s'exécute en CI sur PR et push. Documentation Markdown seule exemptée ; republication manuelle autorisée sans incrément.
- Vérifier la réussite du déploiement et l'affichage publié, pas seulement le build.
- Mettre à jour ce plan et la documentation lors de chaque livraison.
- Ne jamais annoncer de test mobile, connecté ou de sécurité qui n'a pas été réalisé.

## Avancement des démonstrations — v0.12.0

Étude comparative enregistrée dans `docs/demo-strategy.md`. Diagnostic numérique devient le premier outil essayable depuis Labz : accès au site, guide visible pour choisir sa démonstration, premières activités vérifiées en navigateur. Aucun changement à sa collecte ou à Supabase. La démo existait déjà ; cette livraison la rend découvrable.

Ordre proposé pour la préparation de nouvelles démos : Chess Vision Trainer, Pip-Boy, Constella, AtelierFlow. Une seule à la fois. Les limites et vérifications encore nécessaires figurent dans l'étude ; aucun des quatre n'est annoncé comme déployé.
