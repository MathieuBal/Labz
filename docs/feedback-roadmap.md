# Retours Labz : plan d'évolution
Mise à jour : 21 octobre 2026

Plan opérationnel : [development-plan.md](development-plan.md).

## État et objectif
La v0.6 a activé les retours privés, la v0.7 a publié l’administration et le compte propriétaire a depuis été associé explicitement. La v0.8 a allégé les fiches, la v0.9 a synchronisé les nouveautés. La priorité actuelle est la fiabilité de la réception et de l’accès, puis le regroupement des retours en décisions. Les fonctions des sections 2 à 5 restent à développer.

Objectif : permettre au visiteur de découvrir, essayer et améliorer les projets, et au propriétaire de prendre ses décisions dans Labz. Supabase assure le stockage et les autorisations en arrière-plan ; son tableau de bord ne doit pas être nécessaire à la gestion quotidienne.

## 1. Boîte privée publiée — validation à compléter
- Connexion réservée au propriétaire, autorisation contrôlée dans la base.
- Liste des retours avec projet, type, date, titre et message.
- Recherche et filtres par projet et statut.
- Statuts initiaux : Nouveau, En cours, Traité.
- États explicites : chargement, boîte vide, erreur réseau, session expirée.
- Déconnexion qui efface les données privées de l'interface.
- Interface utilisable sur téléphone : message lisible, commandes accessibles, aucun débordement horizontal.

Validation avant publication : un visiteur anonyme et un compte sans droits ne peuvent ni lire ni modifier les messages ; seul le propriétaire peut modifier leur statut ; les messages sont affichés comme du texte ; une réponse réseau tardive après déconnexion ne réaffiche aucune donnée privée. Tester le parcours et le rendu mobile dès qu'un environnement adapté est disponible.

L'association du compte exige l'adresse choisie par le propriétaire et une procédure d'authentification adaptée. Aucun premier inscrit ne devient administrateur automatiquement.

## 2. Passer des messages aux décisions
Créer des sujets de travail distincts des messages reçus. Plusieurs retours peuvent alimenter le même sujet. Conserver le contexte et la raison de la décision.

Chaque sujet contient : projet, problème ou besoin, résultat attendu, retours liés, impact estimé, effort estimé, décision et état. Une idée différée doit pouvoir être retrouvée sans encombrer les tâches actives.

Priorité proposée : bug bloquant, puis friction fréquente, puis amélioration à fort impact et faible effort. Utiliser la fréquence comme un indice, pas comme une preuve de représentativité. Limiter à trois sujets en cours pour tout le Labz.

La suppression des messages bruts après leur durée de conservation ne doit pas effacer les décisions utiles. Une synthèse conservée durablement ne doit pas recopier inutilement des informations personnelles.

Validation : regrouper deux retours sous un sujet, justifier sa priorité, le différer puis le retrouver ; conserver une synthèse utile indépendamment des messages sources.

## 3. Fermer la boucle avec les visiteurs
Publier uniquement des synthèses choisies : À l'étude, Prévu, En cours, Livré. Ne jamais publier automatiquement un message privé, un pseudonyme ou une note interne.

Relier un sujet livré à une nouveauté datée et au projet concerné. La fiche du projet permet de voir ce qui a changé et de relancer l'expérience.

Un suivi individuel peut venir ensuite, via un lien privé doté d'un jeton imprévisible ou un abonnement explicite. Il doit préserver l'anonymat du dépôt initial et ne pas rendre les retours accessibles par un identifiant devinable.

Validation : un visiteur voit une amélioration livrée et peut l'essayer sans accéder aux messages qui l'ont motivée.

## 4. Mesurer ce qui aide réellement à décider
Indicateurs utiles :
- proportion de retours examinés et délai de première décision ;
- sujets récurrents par projet ;
- améliorations effectivement livrées ;
- si une mesure d'usage est ajoutée : lancements et retours rapportés à l'usage, avec limites explicites.

Ne pas afficher de pourcentages de réalisation sans périmètre et critères observables. Ne pas confondre popularité, satisfaction et volonté de payer.

Pour explorer une offre payante, chercher un besoin répété et concret, puis tester une proposition précise avec des utilisateurs volontaires. Un vote ou un compliment seul ne valide pas un revenu potentiel.

## 5. Renforcer selon l'usage observé
Avant une diffusion large : revoir la protection contre le spam, les quotas et la possibilité qu'un attaquant les épuise ; prévoir récupération d'accès, sauvegarde et suppression des données. Ajouter une protection supplémentaire si nécessaire sans imposer prématurément un compte aux visiteurs.

Reporter les votes publics, profils sociaux, notifications multiples et classements tant que la boucle réception → décision → livraison n'est pas fiable.

## Prochaine livraison
Fiabiliser les brouillons et les relances, intégrer la récupération d’accès, gérer la capacité et compléter la recette mobile/connectée. Ensuite seulement, regrouper les demandes en sujets de travail.

## Archive du 20 octobre : avant publication et activation

Les paragraphes suivants sont historiques. Le compte a depuis été associé et les versions publiées ; ne pas réexécuter la création ou la promotion d’un compte.
La branche `codex/admin-inbox` et la PR #1 contiennent l'interface reconstruite.
Droits RLS appliqués et testés sur la base existante ; 23 tests Node, build et chemins Pages validés par CI.
Le compte propriétaire et le parcours d'activation restent à finaliser ; aucune invitation envoyée.
Le rendu mobile et le parcours réel ne sont pas encore testés. Ne pas confondre cette étape avec une livraison.
État précis, résultats et procédure de reprise : [admin-handoff.md](admin-handoff.md).

### Décision de publication v0.7
À la demande de Mathieu, publier les versions validées sans nouvelle confirmation.
La v0.7 livre l'interface Administration ; le compte propriétaire reste à activer séparément.
L'absence de compte n'ouvre aucun accès public aux retours. La récupération de mot de passe et la recette navigateur restent à terminer.
