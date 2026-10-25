# Retours privés Labz

**État courant : 25 octobre 2026**

Labz reçoit les avis visiteurs sans compte via une Edge Function Supabase publique, puis les conserve dans une table privée. La consultation et les changements de statut se font dans `#/admin` pour un propriétaire explicitement autorisé.

## Contrat actuel

Le navigateur envoie :

- un slug projet ;
- un type parmi `idea`, `bug`, `opinion` ;
- un titre de 3 à 120 caractères ;
- un message de 5 à 3 000 caractères ;
- un pseudo facultatif de 50 caractères maximum ;
- un UUID de requête durable pour les relances du même texte.

Le slug projet n’est plus maintenu dans une whitelist parallèle au catalogue. La fonction et la base vérifient seulement un identifiant propre et borné : lettres minuscules, chiffres, tirets internes, 64 caractères maximum. Le client ne propose de formulaire que pour les projets présents dans `catalog.js`, et un test de contrat vérifie que les douze projets actifs sont acceptés par le validateur serveur.

Cette règle supprime le défaut découvert en v0.18.8 : six fiches actives pouvaient ouvrir le formulaire mais étaient rejetées par une ancienne liste serveur de huit projets.

## Protections serveur

- origine navigateur limitée à `https://mathieubal.github.io` ;
- `POST` et prévol `OPTIONS` uniquement ;
- `Content-Type: application/json` obligatoire ;
- corps borné à 16 Ko ;
- validation serveur de chaque champ ;
- champ honeypot ;
- aucune clé secrète dans le bundle Pages ;
- fonction SQL `SECURITY INVOKER` appelée avec un rôle serveur ;
- table de retours sous RLS ;
- rôle visiteur sans accès direct aux messages ;
- rôle authentifié limité par RLS aux administrateurs enregistrés dans `labz_admins` ;
- l’admin ne peut modifier que la colonne `status`.

La clé présente dans `admin-config.js` est une clé Supabase publishable. Les clés secrètes restent dans l’environnement Edge Function.

## Volume et conservation

- 100 nouveaux messages maximum par jour UTC ;
- 500 messages présents maximum ;
- `request_id` est la clé primaire et rend une relance identique idempotente ;
- les messages de plus de 90 jours sont supprimés lors d’un nouvel envoi ;
- le statut `done` organise la boîte mais ne libère pas de capacité ;
- aucune purge périodique indépendante n’est encore planifiée.

Le quota global protège principalement le coût et le stockage. Origin + honeypot ne remplacent pas une vraie protection anti-abus si Labz devait recevoir beaucoup de trafic public.

## Brouillons côté navigateur

Les brouillons restent sur l’appareil pendant 30 jours après leur dernière modification. Le système conserve aussi l’identité d’une tentative afin qu’une réponse réseau perdue puisse être relancée sans créer automatiquement un doublon.

Un texte modifié reçoit une nouvelle identité. Une réponse tardive ne peut pas ressusciter un brouillon effacé ni marquer comme reçu un texte modifié entre-temps. Si le stockage local est indisponible, le brouillon continue à fonctionner en mémoire mais Labz avertit que la persistance entre rechargements n’est plus garantie.

## Administration

`#/admin` fournit :

- connexion par compte Supabase Auth préalablement autorisé ;
- recherche ;
- filtre projet ;
- filtre statut ;
- compteurs Nouveau / En cours / Traité ;
- visibilité de la capacité utilisée ;
- modification du seul statut.

Les tokens et messages restent en mémoire. Recharger la page, quitter l’espace admin, expirer la session ou se déconnecter supprime l’état sensible local. Les réponses réseau tardives sont ignorées après invalidation de session.

## Vérifications

La CI couvre notamment :

- validation des champs ;
- rejet d’une origine étrangère ;
- taille maximale ;
- quota et erreurs de stockage ;
- accusé explicite côté client ;
- relance idempotente ;
- édition pendant un envoi ;
- stockage local indisponible ;
- expiration et nettoyage des brouillons ;
- droits et comportements du client admin ;
- contrat catalogue → validateur feedback pour les douze projets actifs.

La migration production `20261025225014_feedback_project_slug_constraint` a supprimé l’ancienne contrainte SQL à huit projets. L’Edge Function `labz-feedback` version 2 applique le même contrat de slug. Une vérification transactionnelle annulée a confirmé que les douze slugs actuels sont acceptés par la fonction SQL sans conserver de données de test.

## Limites restantes

- récupération de mot de passe propriétaire non intégrée dans Labz ;
- protection Supabase contre les mots de passe compromis à activer si disponible pour le projet ;
- pas de CAPTCHA ou de rate limit par source ;
- pas de purge planifiée autonome ;
- recette complète propriétaire sur téléphone réel encore à réaliser ;
- les retours sont encore gérés message par message : leur transformation en sujets et décisions reste le prochain chantier produit.
