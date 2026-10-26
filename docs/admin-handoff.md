# Administration Labz

**État courant : 26 octobre 2026**

L’administration est publiée dans Labz sous `#/admin`. Elle sert à consulter les retours privés, les regrouper en sujets durables et conserver un historique de décisions sans exposer ces données au public.

## Accès

Le propriétaire utilise un compte Supabase Auth préalablement créé et explicitement associé à `public.labz_admins`.

Il n’existe :

- aucun formulaire d’inscription publique dans Labz ;
- aucun mécanisme « premier inscrit = administrateur » ;
- aucune autorisation basée sur `user_metadata` ;
- aucune clé secrète dans le navigateur.

La clé embarquée dans `admin-config.js` est une clé Supabase publishable. Les permissions réelles restent imposées par RLS et l’appartenance à `labz_admins`.

## Données privées

Le flux est maintenant séparé en quatre objets :

1. `labz_feedback` conserve le message brut reçu ;
2. `labz_topics` conserve le sujet durable, sa synthèse, son impact, son effort et son état ;
3. `labz_topic_feedback` relie un ou plusieurs retours d’un même projet à un sujet ;
4. `labz_decisions` conserve l’historique immuable des changements d’état et leur justification.

Les liens vers un retour utilisent `ON DELETE CASCADE`. Si un message brut expire selon sa règle de rétention, le sujet et ses décisions restent présents. La synthèse doit donc rester compréhensible sans recopier inutilement le texte visiteur, son pseudo ou d’autres données privées.

## États des sujets

Les états disponibles sont :

- `to_study` : À étudier ;
- `in_progress` : En cours ;
- `deferred` : Différé ;
- `abandoned` : Abandonné ;
- `shipped` : Livré.

Tout changement d’état exige une justification. Un trigger privé enregistre automatiquement la décision correspondante.

Maximum trois sujets peuvent être `in_progress` simultanément. Cette limite est imposée en base avec un verrou transactionnel, elle ne dépend donc pas seulement de l’interface.

## Autorisation en base

Toutes les nouvelles tables ont RLS activé.

Les politiques :

- refusent tout accès `anon` aux sujets, associations et décisions ;
- autorisent les lectures et écritures nécessaires uniquement lorsqu’une ligne correspondante existe dans `labz_admins` ;
- gardent les décisions en lecture seule depuis le client ;
- imposent qu’un retour soit rattaché uniquement à un sujet du même projet ;
- ne donnent pas au client la possibilité de modifier les identifiants ou dates techniques.

Les triggers privilégiés vivent dans le schéma `private`, non exposé aux rôles navigateur. Le RPC `labz_create_topic` est `security invoker` et reste donc soumis aux droits et RLS de l’utilisateur connecté.

## Comportement du client

L’interface propose deux espaces.

### Retours

- recherche ;
- filtres projet et statut ;
- changement Nouveau / En cours / Traité ;
- création d’un sujet à partir d’un retour ;
- rattachement à un sujet existant du même projet.

### Sujets & décisions

- création d’un sujet indépendant ;
- synthèse ;
- type Idée / Problème / Signal ;
- impact et effort Faible / Moyen / Fort ;
- filtres projet et état ;
- modification de la synthèse ;
- changement d’état avec justification ;
- historique des décisions ;
- consultation et détachement des retours encore présents.

Les access tokens et les données privées restent uniquement en mémoire. Ils ne sont pas écrits dans `localStorage` ou `sessionStorage`.

Recharger la page, quitter l’administration, expirer la session ou se déconnecter détruit l’état privé local. Les réponses réseau arrivées après déconnexion ou expiration sont ignorées grâce à une génération de session invalidée et à l’annulation des requêtes.

## Validation réalisée

Le 26 octobre 2026 :

- la migration `20261026060647_labz_feedback_decisions` est appliquée en production ;
- une transaction avec rollback a confirmé que trois sujets passent `in_progress` et que le quatrième est refusé ;
- la même transaction a confirmé l’écriture automatique d’une décision par changement d’état ;
- une requête simulant le compte admin a créé et relu un sujet et sa décision ;
- une requête authentifiée avec un identifiant non-admin a vu zéro sujet, zéro association et zéro décision ;
- les tests applicatifs couvrent le chargement des quatre jeux de données, la création de sujet, les décisions, les erreurs WIP et les associations.

Les advisors Supabase ne signalent aucun problème de performance. Côté sécurité :

- `labz_feedback_quota` possède RLS sans politique, volontairement, car cette table est réservée au serveur ;
- la protection Supabase contre les mots de passe compromis reste désactivée et constitue encore un durcissement à activer.

La réception publique utilise une Edge Function distincte et ne donne aucun droit de lecture sur les données d’administration.

## Limites restantes

### Récupération de mot de passe

Labz ne propose pas encore de parcours intégré de récupération d’accès. La configuration Auth, les URL de redirection et le traitement du lien de récupération doivent être validés ensemble avant livraison.

Ne jamais demander ni transmettre un mot de passe via une conversation ou un commit.

### Recette navigateur réelle

Les tests actuels restent principalement unitaires et contractuels. Ils ne remplacent pas une recette complète du vrai compte propriétaire dans un navigateur et sur téléphone réel.

### Publication éventuelle

Les sujets et décisions sont entièrement privés. Aucune publication automatique n’existe. Si une synthèse publique est ajoutée plus tard, elle devra être un objet volontaire et distinct, sans exposer le texte source ni le pseudo du visiteur.

## Reprise du travail

Avant toute modification sensible :

1. lire `docs/private-feedback.md` et `docs/development-plan.md` ;
2. vérifier les migrations réellement appliquées et la version de l’Edge Function ;
3. ne pas recréer de compte propriétaire ou de projet Supabase ;
4. tester les règles avec un compte sans droits et le propriétaire sans exposer de données privées ;
5. garder la limite de trois sujets en cours comme invariant de base ;
6. conserver les changements destructifs hors production tant que leur restauration n’est pas démontrée.
