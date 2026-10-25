# Administration Labz

**État courant : 25 octobre 2026**

L’administration est publiée dans Labz sous `#/admin`. Elle sert à consulter les retours privés et à les classer sans exposer les messages au public.

## Accès

Le propriétaire utilise un compte Supabase Auth préalablement créé et explicitement associé à `public.labz_admins`.

Il n’existe :

- aucun formulaire d’inscription publique dans Labz ;
- aucun mécanisme « premier inscrit = administrateur » ;
- aucune autorisation basée sur `user_metadata` ;
- aucune clé secrète dans le navigateur.

La clé embarquée dans `admin-config.js` est une clé Supabase publishable. Les permissions réelles restent imposées par RLS et l’appartenance à `labz_admins`.

## Autorisation en base

`labz_admins` associe explicitement un `user_id` Auth aux droits propriétaire.

Les politiques actuelles :

- permettent à un utilisateur authentifié de vérifier uniquement sa propre appartenance ;
- autorisent la lecture de `labz_feedback` uniquement lorsqu’une ligne correspondante existe dans `labz_admins` ;
- autorisent la modification de la seule colonne `status` ;
- bornent `status` à `new`, `in_progress`, `done`.

Un compte authentifié sans appartenance admin ne peut pas lire la boîte ni s’auto-promouvoir.

## Comportement du client

L’interface propose :

- connexion e-mail / mot de passe ;
- liste des retours ;
- recherche ;
- filtre par projet ;
- filtre par statut ;
- compteurs Nouveau / En cours / Traité ;
- capacité utilisée sur 500 messages ;
- changement de statut ;
- actualisation et déconnexion.

Les access tokens et les messages restent uniquement en mémoire. Ils ne sont pas écrits dans `localStorage` ou `sessionStorage`.

Recharger la page, quitter l’administration, expirer la session ou se déconnecter détruit l’état privé local. Les réponses réseau arrivées après déconnexion ou expiration sont ignorées grâce à une génération de session invalidée et à l’annulation des requêtes.

## État sécurité vérifié

Le 25 octobre 2026, les advisors Supabase ne signalent aucun problème de performance. Côté sécurité :

- `labz_feedback_quota` possède RLS sans politique, ce qui est volontaire car cette table serveur n’est pas destinée aux visiteurs ;
- la protection Supabase contre les mots de passe compromis est encore désactivée et reste à activer via la configuration Auth si l’option est disponible pour le projet.

La réception publique utilise une Edge Function distincte ; elle ne donne aucun droit de lecture sur la boîte.

## Limites restantes

### Récupération de mot de passe

Labz ne propose pas encore de parcours intégré de récupération d’accès. La configuration Auth, les URL de redirection et le traitement du lien de récupération doivent être validés ensemble avant livraison.

Ne jamais demander ni transmettre un mot de passe via une conversation ou un commit.

### Recette propriétaire réelle

Les tests automatisés couvrent le client, les refus d’accès, l’expiration, les réponses tardives et les changements de statut simulés. Ils ne remplacent pas une recette complète du vrai compte propriétaire sur téléphone réel.

### Cycle de vie

Le statut `Traité` n’efface pas le message et ne libère pas de capacité. La suppression ou l’archivage doit rester un chantier séparé avec règle de conservation explicite et sauvegarde avant action destructive.

### Retours vers décisions

L’administration est encore une boîte de réception. Elle ne regroupe pas plusieurs messages en problème, synthèse, impact, effort et décision. Cette couche constitue la prochaine évolution produit prioritaire, pas une fonction cachée déjà disponible.

## Reprise du travail

Avant toute modification sensible :

1. lire `docs/private-feedback.md` et `docs/development-plan.md` ;
2. vérifier les migrations réellement appliquées et la version de l’Edge Function ;
3. ne pas recréer de compte propriétaire ou de projet Supabase ;
4. tester les règles avec un compte sans droits et le propriétaire sans exposer de données privées ;
5. conserver les changements destructifs hors production tant que leur restauration n’est pas démontrée.
