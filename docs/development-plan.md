# Plan de développement Labz

**Créé : 21 octobre 2026**  
**Dernière mise à jour : 24 octobre 2026**

Décision de pilotage : réaliser les améliorations par livraisons vérifiées, puis publier sur GitHub Pages sans nouvelle confirmation. Maximum trois sujets actifs simultanément. Ne pas supprimer de projet ou dépôt par simple nettoyage éditorial.

La vue portefeuille à jour est désormais maintenue dans [`portfolio-status.md`](portfolio-status.md). Ce plan décrit les chantiers de la plateforme Labz ; il ne doit pas servir à faire croire qu’un projet du catalogue est actif lorsqu’il est en pause.

## Objectif

Découvrir les projets, recevoir des retours privés et décider de leur suite directement dans Labz. Préserver la simplicité de l'interface et la confidentialité des messages. Le regroupement en sujets vient après la fiabilisation de la boîte.

## Situation actuelle — v0.15.0

La séquence v0.10 → v0.15 a livré plus que le plan initial du 21 octobre :

- v0.10 : navigation et cohérence des fiches ;
- v0.11 : reprise fiable des brouillons / accusés de réception ;
- v0.12 : Diagnostic numérique rendu découvrable par une démo guidée ;
- v0.13 : Perfoptimize revient avec une alpha Windows x64 testable ;
- v0.14 : hero visuel et galeries de projet ;
- v0.15 : Pip-Boy devient essayable et Constella est séparé éditorialement en Explore / Watch.

Le portefeuille public contient maintenant dix fiches, dont six accès réellement essayables. L’ancien ordre de préparation des démos « Chess → Pip-Boy → Constella → AtelierFlow » est donc **obsolète** : Pip-Boy est livré, Perfoptimize a été inséré et livré en alpha, Chess n’est plus une priorité, et Constella est volontairement en pause après un important chantier d’architecture.

### Priorités actives Labz

1. **Vérité du portefeuille** : garder README, catalogue, documentation et états réels cohérents.
2. **Lot C — Administration autonome et capacité** : récupération d’accès, cycle de vie / capacité et recette mobile propriétaire.
3. **Lot D — Retours vers décisions** : regrouper les messages en sujets et décisions exploitables.

Le Lot E — progrès publics — reste important, mais vient après la capacité à produire une décision interne propre.

---

## Lot A — Livré en v0.10.0

Publié et vérifié en ligne : 28 tests, garde-fou Git, navigation clavier sur accueil/fiche/admin et formulaire. Pas de recette iPhone réel.

1. Navigation accessible : réparer Aller au contenu sans perdre la route ; titres des nouveautés cohérents.
2. Fiches : recommandations « À découvrir aussi », avis explicitement sur le concept sans démo ; nombre de projets calculé.
3. Publication et continuité : comparer la version au commit précédent, exiger une nouvelle note, corriger les documents anciens.

Validation : tests Node, build, chemins Pages, essai du garde-fou sur historique Git ; vérification en navigateur du lien d'évitement sur accueil, fiche et admin, formulaire et nouveautés. Confirmer le job de déploiement et la version en ligne. Aucune modification de base dans ce lot.

## Lot B — Livré en v0.11.0

1. Identifiant d'envoi durable associé au contenu exact et au brouillon ; conserver l'accusé après rechargement ; distinguer un nouveau texte d'une relance.
2. Commande d'effacement du brouillon, durée locale documentée, états reçu / modifié / non confirmé. Aucun effacement silencieux après panne.
3. Tests réponse perdue → rechargement → relance, modification pendant l'envoi, stockage indisponible, fermeture du formulaire pendant requête.

Résultat : une relance identique peut conserver son identifiant lorsque le stockage local est disponible, un texte modifié devient un nouveau retour et l’utilisateur peut effacer explicitement son brouillon local.

La recette iPhone réelle reste à distinguer des simulations et tests navigateur.

## Démonstrations — état actualisé

L’étude comparative reste enregistrée dans `docs/demo-strategy.md`, mais son ordre initial n’est plus la roadmap active.

### Livré / accessible

- **Diagnostic numérique** : démo guidée découvrable depuis Labz ;
- **Perfoptimize** : alpha Windows x64 téléchargeable, parcours d’analyse documenté ;
- **Pip-Boy JDR** : démonstration locale navigateur avec guide visiteur et visuels du projet.

### Présentation / pause

- **Constella Explore** : prototype privé, en pause au 24 octobre 2026 ;
- **Constella Watch** : prototype privé, même pause et même socle technique ;
- **Chess Vision Trainer** : aucune priorité de démo ; candidat à sortir de la sélection active ;
- **AtelierFlow** : exploration légère, démo fictive non prioritaire.

Règle : un bouton Lancer n’est ajouté qu’après un essai réel du parcours visiteur et une validation de l’isolation des données. Ce chantier exploratoire n’implique pas de rendre un dépôt privé public.

## Lot C — Administration autonome et capacité

### C1 — Récupération d'accès sécurisée

Vérifier configuration Auth et redirections, intégrer la récupération, gérer expiration et erreur. Le propriétaire saisit lui-même son mot de passe hors conversation.

### C2 — Capacité et cycle de vie

Afficher / comprendre les limites, proposer une gestion maîtrisée des messages traités et définir la conservation des synthèses avant toute suppression. « Traité » ne libère actuellement pas de place.

### C3 — Protection contre abus et purge planifiée

Tester hors production, préserver l'accessibilité et ne pas rendre public le quota ou les messages.

Validation : droits anonyme / compte sans droits / propriétaire ; fin de session pendant requête ; capacité libérée permettant un nouvel envoi ; purge selon règle explicite et vérifiable. Aucune purge réelle globale implicite. Vérifier sauvegarde/restauration avant action destructive.

## Lot D — Retours vers décisions

Créer des sujets privés distincts : projet, problème, résultat attendu, retours liés, impact, effort, justification, décision et état. Synthèse utile indépendante des messages bruts.

Maximum trois sujets `En cours` contrôlé en base, y compris requêtes concurrentes. `Différé` et `Abandonné` restent retrouvables.

Validation : regrouper deux retours ; retrouver une décision différée ; conserver la décision après expiration des sources ; aucun accès public aux sujets internes.

Ce lot devient le **prochain grand différenciateur de Labz** : la plateforme ne doit pas seulement collecter des avis, mais aider à décider quels projets méritent du temps.

## Lot E — Progrès publics et édition dans Labz

Publication explicitement choisie et prévisualisée, séparée des données internes. États publics proposés :

- À l'étude ;
- Prévu ;
- En cours ;
- Livré.

Relier chaque livraison au projet et à un bouton d'essai. Réserver l'activité des commits à une rubrique technique. La rédaction des nouveautés depuis l'administration devra garder une source publique unique et tous les secrets côté serveur.

Avant d’implémenter ce lot, définir comment représenter honnêtement les états particuliers déjà rencontrés dans le portefeuille : `Prototype privé`, `En pause`, `Alpha testable`, `Exploration`, sans transformer l’interface en outil de gestion complexe.

## Ensuite, selon usage

- vrais aperçus de partage et pages projet statiques si un besoin apparaît ;
- cache public des nouveautés externes ;
- liste admin compacte et pagination ;
- nettoyage du code historique ;
- éventuel retrait de Chess Vision Trainer de la sélection active ;
- réévaluation d’AtelierFlow seulement si un cas d’usage concret apparaît.

Mesurer avant de migrer l'architecture. Reporter comptes visiteurs, votes, classements et notifications multiples.

## Règles de validation communes

- Lire l'état distant et préserver les changements existants.
- Préparer la note avec `npm run release -- VERSION "Titre" "Résumé" "Changement"` pour toute modification visible hors documentation.
- `npm run check`, `npm run build`, `node scripts/check-pages.mjs`.
- Le contrôle de différence Git s'exécute en CI sur PR et push. Documentation Markdown seule exemptée ; republication manuelle autorisée sans incrément.
- Vérifier la réussite du déploiement et l'affichage publié, pas seulement le build.
- Mettre à jour ce plan et la documentation lors de chaque livraison.
- Ne jamais annoncer de test mobile, connecté ou de sécurité qui n'a pas été réalisé.
- Ne pas confondre activité GitHub et avancement produit.

## Règle de portefeuille

Une nouvelle fonctionnalité Labz ou une nouvelle fiche n’est prioritaire que si elle améliore au moins un de ces trois axes :

1. comprendre ce qu’est réellement un projet ;
2. permettre de l’essayer honnêtement ;
3. transformer un retour en décision utile.

Si elle ne sert aucun de ces axes, elle doit être différée sauf besoin explicite.
