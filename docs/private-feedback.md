# Retours privés — service préparé, activation en attente

Le site reste sur GitHub Pages. Une Edge Function Supabase reçoit les messages
sans création de compte et les enregistre dans une table privée. Aucun email
n’est envoyé automatiquement. Le propriétaire consulte la table depuis son
espace Supabase ; il peut y lire et supprimer les retours.

## État au 20 octobre 2026

Code du serveur, migration SQL, client et branchement de l’interface préparés.
`feedback-config.js` contient une URL vide : le bouton d’envoi privé reste masqué.
Le projet Supabase n’est pas connecté dans cette session. Rien n’a été déployé
sur Supabase et aucun message réel n’a été envoyé pour tester.

## Activation

1. Connecter Supabase et choisir un projet appartenant à Mathieu. Privilégier un
   projet dédié ; vérifier l’absence de tables `labz_feedback*` avant migration.
2. Appliquer `supabase/migrations/20261020150000_labz_feedback.sql` une seule fois.
3. Déployer la fonction `labz-feedback`, avec `verify_jwt = false` comme indiqué
   dans `supabase/config.toml`. C’est un point d’entrée volontairement public.
4. La fonction lit `SUPABASE_URL` et `SUPABASE_SECRET_KEYS.default` côté serveur.
   À défaut, configurer `LABZ_SECRET_KEY` avec une clé secrète Supabase moderne.
   Aucune de ces clés ne doit apparaître dans les fichiers du site.
5. Vérifier l’origine autorisée, la réponse après stockage et l’impossibilité de
   lire la table avec un rôle visiteur. Utiliser uniquement des données de test,
   puis les supprimer. Vérifier les coûts/quotas du compte avant ouverture.
6. Renseigner uniquement l’URL HTTPS de la fonction dans `feedback-config.js`,
   republier Labz, puis vérifier l’envoi et l’échec réseau depuis le site.

## Protections et limites

- Seuls huit identifiants de projets et trois types de retour sont acceptés.
- Taille de requête limitée à 16 Ko, titre 120 caractères, message 3 000,
  pseudo facultatif 50. Aucun email ni IP n’est enregistré par ce code.
  L’hébergeur peut conserver ses journaux techniques habituels.
- Champ piège antirobot, validation serveur et origine navigateur restreinte.
  Le contrôle d’origine et le champ piège ne bloquent pas un robot déterminé.
- Admission SQL atomique : 100 nouveaux messages par jour UTC, au maximum
  500 messages présents. Ces limites protègent le volume de stockage ; un robot
  peut saturer la boîte. Prévoir un CAPTCHA avant une diffusion importante.
- Un identifiant de requête évite les doubles insertions lors d’une relance
  pendant la même session. Les doublons après rechargement ne sont pas garantis.
- Pas de lecture ou d’écriture directe pour `anon` ou `authenticated`, pas de
  liste des messages accessible au public. La fonction n’expose que son accusé.
- Nettoyage des messages de plus de 90 jours au prochain envoi. Sans nouveaux
  envois, aucune purge planifiée ne s’exécute ; le propriétaire peut supprimer
  les messages manuellement. Le texte du formulaire le précise.
- Si la boîte est pleine, le navigateur conserve le brouillon. Un délai expiré
  n’est jamais présenté comme un envoi confirmé. Réessayer réutilise l’identifiant.

## Vérifications

`npm run check` exécute 14 tests Node, notamment validation, rejet d’origine,
limite de taille, erreurs de stockage, réponse de quota et accusé explicite.
Les parcours DOM passent avec le service désactivé et avec une réception simulée : accusé, identifiant réutilisé et brouillon conservé après panne.

La migration a aussi été exécutée dans PostgreSQL embarqué via PGlite : contrôle
réel des droits des rôles, insertion par le service, doublons et quota. Pour
reproduire sans ajouter de dépendance au site :

```sh
npm install --prefix /tmp/labz-sql-check @electric-sql/pglite
LABZ_PGLITE_MODULE=/tmp/labz-sql-check/node_modules/@electric-sql/pglite/dist/index.js node scripts/check-feedback-db.mjs
```

Ces vérifications ne remplacent pas un test sur le projet Supabase déployé.

Références officielles consultées :
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/functions/function-configuration
