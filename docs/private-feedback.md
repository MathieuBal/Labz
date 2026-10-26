# Retours privés Labz

**État courant : 26 octobre 2026**

Labz reçoit les avis visiteurs sans compte via une Edge Function Supabase publique, puis les conserve dans une table privée. La consultation, le tri, la suppression et la transformation en sujets se font dans `#/admin` pour un propriétaire explicitement autorisé.

## Contrat actuel

Le navigateur envoie :

- un slug projet ;
- un type parmi `idea`, `bug`, `opinion` ;
- un titre de 3 à 120 caractères ;
- un message de 5 à 3 000 caractères ;
- un pseudo facultatif de 50 caractères maximum ;
- un UUID de requête durable pour les relances du même texte.

Le slug projet n’est plus maintenu dans une whitelist parallèle au catalogue. La fonction et la base vérifient seulement un identifiant propre et borné : lettres minuscules, chiffres, tirets internes, 64 caractères maximum. Le client ne propose de formulaire que pour les projets présents dans `catalog.js`, et un test de contrat vérifie que les douze projets actifs sont acceptés par le validateur serveur.

## Protections serveur

- origine navigateur limitée à `https://mathieubal.github.io` ;
- `POST` et prévol `OPTIONS` uniquement ;
- `Content-Type: application/json` obligatoire ;
- corps borné à 16 Ko, y compris pendant la lecture du flux ;
- validation serveur de chaque champ ;
- champ honeypot ;
- aucune clé privée dans le bundle Pages ;
- fonction SQL d’admission appelée avec le rôle serveur ;
- table de retours sous RLS ;
- rôle visiteur sans accès direct aux messages ;
- rôle authentifié limité par RLS aux administrateurs enregistrés dans `labz_admins` ;
- mise à jour limitée au statut ;
- suppression autorisée uniquement pour un administrateur authentifié.

La clé présente dans `admin-config.js` est une clé Supabase publishable. Les secrets serveur restent dans l’environnement Edge Function.

## Volume et conservation

- 100 nouveaux messages maximum par jour UTC ;
- 500 messages présents maximum ;
- `request_id` est la clé primaire et rend une relance identique idempotente ;
- les messages de plus de 90 jours sont supprimés lors d’un nouvel envoi ;
- le statut `done` organise la boîte mais ne libère pas de capacité ;
- un administrateur peut supprimer manuellement un message non pertinent ;
- aucune purge périodique indépendante n’est encore planifiée.

Le quota global protège principalement le coût et le stockage. Origin + honeypot ne remplacent pas une vraie protection anti-abus si Labz devait recevoir beaucoup de trafic public.

## Brouillons côté navigateur

Les brouillons restent sur l’appareil pendant 30 jours après leur dernière modification. Le système conserve aussi l’identité d’une tentative afin qu’une réponse réseau perdue puisse être relancée sans créer automatiquement un doublon.

Un texte modifié reçoit une nouvelle identité. Une réponse tardive ne peut pas ressusciter un brouillon effacé ni marquer comme reçu un texte modifié entre-temps. Si le stockage local est indisponible, le brouillon continue à fonctionner en mémoire mais Labz avertit que la persistance entre rechargements n’est plus garantie.

## Administration

`#/admin` fournit :

- connexion par compte Supabase Auth préalablement autorisé ;
- recherche et filtres ;
- statuts Nouveau / En cours / Traité ;
- suppression définitive d’un retour après confirmation ;
- visibilité de la capacité utilisée ;
- création d’un sujet depuis un retour ;
- rattachement d’un retour à un sujet du même projet ;
- sujets indépendants avec type, synthèse, impact et effort ;
- états À étudier / En cours / Différé / Abandonné / Livré ;
- justification obligatoire des changements d’état ;
- historique immuable des décisions ;
- maximum trois sujets `En cours`, garanti en base.

Les tokens et messages restent en mémoire. Recharger la page, quitter l’espace admin, expirer la session ou se déconnecter supprime l’état sensible local. Les réponses réseau tardives sont ignorées après invalidation de session.

Supprimer un retour brut supprime aussi ses lignes dans `labz_topic_feedback` grâce au `ON DELETE CASCADE`. Cela ne supprime pas le sujet ni son historique de décisions. La synthèse durable doit donc rester compréhensible sans dépendre du texte source.

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
- contrat catalogue vers validateur feedback pour les douze projets actifs ;
- chargement des données admin ;
- création et rattachement des sujets ;
- décisions et limite WIP ;
- suppression d’un retour avec confirmation serveur.

La CI lance aussi les parcours critiques dans Chromium. Les appels Supabase des scénarios navigateur sont interceptés, afin de ne créer ni faux retour ni changement admin dans les données de production.

En production, les migrations de feedback, d’administration, de sujets et de suppression sont appliquées. Le privilège DELETE du rôle authentifié, la politique RLS admin et le `ON DELETE CASCADE` des associations ont été vérifiés après la migration `20261026194810_labz_admin_feedback_delete`.

## Limites restantes

- récupération de mot de passe propriétaire non intégrée dans Labz ;
- protection Supabase contre les mots de passe compromis encore désactivée ;
- pas de CAPTCHA ou de rate limit par source ;
- pas de purge planifiée autonome ;
- recette complète avec le vrai compte propriétaire sur téléphone physique encore à réaliser ;
- tests navigateur automatisés limités à Chromium.
