# Audit pré-intégration Labz — Crimson's Blade

**Dépôt audité :** `MathieuBal/Crimson-s-Blade`  
**Révision :** `28e17b11497409685002e5e4aa1cae92d3e91855`  
**Date :** 24 octobre 2026  
**Visibilité :** privée  
**Statut proposé :** **candidat Labz très fort comme étude de cas historique ; ne pas redéployer tel quel**

## Verdict

Crimson's Blade est l'un des projets les plus solides du portefeuille du point de vue **problème réel → outil réellement utilisé**.

L'application ne se limite pas à une vitrine de guilde : elle gère des comptes, profils de joueurs, rôles, gear score, rerolls, besoins de loot, disponibilités, composition d'équipes, raids, inscriptions, notifications, distribution de loot et permissions administratives. Le backend s'appuie sur Express et PostgreSQL avec migrations, authentification, sessions, contrôle de rôles et protections web.

Le projet a été utilisé réellement par la guilde pendant une période significative, y compris après le départ de Mathieu du jeu. Cela lui donne une valeur de portfolio supérieure à un prototype seulement démonstratif.

En revanche, la révision Git actuelle présente plusieurs défauts de sécurité, d'intégrité métier et d'exploitation. **La bonne stratégie Labz est de présenter l'étude de cas sans publier le dépôt ni promettre une démo active.**

## Angle Labz recommandé

Présenter Crimson's Blade comme un **outil opérationnel de coordination communautaire** construit autour de contraintes concrètes :

- connaître les rôles, puissance et disponibilités des membres ;
- identifier les besoins de loot ;
- suggérer des groupes viables ;
- planifier les raids ;
- gérer les inscriptions ;
- administrer les rolls et leur attribution ;
- réduire le travail manuel des responsables de guilde.

L'angle n'est donc pas « site web pour un jeu », mais **transformation d'un processus communautaire complexe en outil métier spécialisé**.

## Ce qui existe réellement

### Gestion des membres

Le modèle utilisateur contient notamment :

- pseudo et mot de passe ;
- rôle de combat ;
- gear score ;
- reroll éventuel et son rôle/gear score ;
- sélections de loot ;
- disponibilités ;
- rôle d'administration du site.

Les mots de passe sont hachés avec bcrypt et les requêtes principales sont paramétrées.

### Disponibilités et composition d'équipes

L'endpoint de statistiques agrège les disponibilités des membres et leurs rôles pour construire des groupes. La logique recherche une composition de six joueurs avec un Tank, un Healer et quatre DPS, en tenant compte des personnages principaux/rerolls et du gear score.

Cette fonctionnalité confirme directement la finalité opérationnelle du projet : faciliter la constitution de groupes à partir de contraintes réelles plutôt que simplement afficher des profils.

### Raids

Les responsables peuvent :

- programmer, modifier et supprimer des raids ;
- associer un boss ;
- consulter les raids ;
- permettre aux membres de s'inscrire ;
- retrouver les raids auxquels un membre participe.

La table `raidparticipants` impose une unicité `(raid_id, user_id)`, ce qui protège correctement contre une double inscription concurrente au niveau de la base.

### Loot et rolls

Le projet permet :

- d'enregistrer les loots obtenus sur un raid ;
- d'ajouter quantité et trait ;
- aux membres de manifester leur intérêt ;
- aux responsables d'approuver ou refuser les inscriptions ;
- de lancer un roll ;
- de stocker les résultats et notifier les joueurs.

C'est un vrai workflow métier, mais c'est également la zone où se trouvent les plus gros défauts de la révision actuelle.

### Administration

Des rôles `Member`, `Officier`, `Chef de Guilde` et `Dev` existent. Les routes sensibles utilisent un middleware serveur : les contrôles ne reposent donc pas uniquement sur le masquage de boutons côté navigateur.

## Points positifs de sécurité

La base de sécurité est meilleure qu'un prototype naïf :

- bcrypt avec coût 12 pour les mots de passe ;
- régénération de session après authentification ;
- requêtes SQL majoritairement paramétrées ;
- middleware d'authentification ;
- middleware de rôles ;
- Helmet ;
- protection CSRF ;
- cookie de session `httpOnly` ;
- `SameSite=Lax` ;
- rate limiting global ;
- contrôle d'appartenance pour la suppression des notifications.

Ces éléments montrent une intention réelle de sécuriser une application multi-utilisateur.

## Bloqueurs avant tout redéploiement

### P0 — dépôt à conserver privé / données à assainir

Le dépôt versionne `data/database.db` ainsi que des métadonnées IDE liées à des sources de données. Le contenu de cette base n'a volontairement pas été inspecté pendant l'audit, car il peut contenir des données historiques de membres ou des secrets dérivés.

Le dépôt ne doit pas être rendu public tel quel.

Si le code devait un jour être publié :

1. identifier la nature exacte des données versionnées ;
2. retirer toute donnée utilisateur ;
3. purger si nécessaire l'historique Git ;
4. supprimer les fichiers IDE inutiles ;
5. repartir d'un jeu de données fictif.

### P0 — anciens secrets présents dans l'historique

L'historique contient un commit intitulé « Supprimer .env du dépôt et ajouter au .gitignore ». Un fichier d'environnement a donc été versionné à un moment du développement.

Toute remise en production doit considérer les secrets historiques comme compromis et utiliser de nouvelles valeurs : mot de passe PostgreSQL, `SESSION_SECRET` et tout autre secret ayant pu être contenu dans ces fichiers.

### P0 — roll : sélection du gagnant incorrecte

Lors du lancement d'un roll, le serveur attribue d'abord un nombre aléatoire uniquement aux inscriptions approuvées. Il relit ensuite **toutes** les lignes de `loot_rolls` du loot concerné pour déterminer le gagnant, sans filtrer `is_approved = TRUE`.

Les inscriptions non approuvées sont donc incluses dans la requête qui choisit le gagnant. Le comportement est particulièrement dangereux avec des `roll_value` NULL et un tri descendant PostgreSQL.

**Correction :** déterminer le gagnant uniquement dans l'ensemble approuvé, avec une requête explicite et un tri déterministe (`NULLS LAST` au minimum si des NULL sont possibles).

### P0 — roll non idempotent et non transactionnel

Le même endpoint peut être relancé :

- de nouveaux nombres sont générés ;
- le précédent `is_winner` n'est pas remis à `false` ;
- plusieurs lignes peuvent donc rester marquées gagnantes ;
- les différentes mises à jour ne sont pas encapsulées dans une transaction unique.

Une erreur en milieu de traitement peut également laisser un état partiel.

**Correction :** transaction unique, verrouillage/état de roll terminé, remise à zéro atomique des gagnants, interdiction d'un second tirage sauf fonctionnalité de reroll explicitement conçue et journalisée.

### P0 — XSS stockée via le trait de loot

Le champ `trait` est un texte libre envoyé par l'interface de gestion des loots. Il est ensuite réinjecté dans `manageRolls.js` via des templates affectés à `innerHTML`, sans échappement.

Un contenu HTML/JavaScript malveillant enregistré comme trait peut donc être exécuté dans le navigateur d'un responsable lorsqu'il ouvre l'écran correspondant.

Le périmètre historique était une guilde fermée, mais cela reste un bloqueur pour toute remise en ligne.

**Correction :** construire le DOM avec `textContent` ou appliquer un assainissement HTML strict si du HTML est réellement nécessaire. Supprimer également `unsafe-inline` de la CSP lorsque possible.

## P1 — intégrité et permissions

### Transaction de changement de rôles incorrecte

La route de changement de rôles appelle `BEGIN`, plusieurs `pool.query()` puis `COMMIT`. Avec `pg.Pool`, ces appels ne sont pas garantis d'utiliser la même connexion : la transaction n'est donc pas fiable.

**Correction :** obtenir explicitement un client avec `pool.connect()`, puis exécuter `BEGIN`, toutes les modifications et `COMMIT/ROLLBACK` sur ce même client.

### Rôles mis en cache dans la session

Le middleware d'autorisation utilise le rôle stocké dans `req.session.user`. Un utilisateur rétrogradé en base peut donc conserver ses anciens privilèges jusqu'à expiration ou renouvellement de sa session.

**Correction :** invalider les sessions lors d'un changement de rôle, ou recharger l'autorisation depuis une source fraîche pour les opérations critiques.

### Unicité manquante des inscriptions de roll

Le code vérifie en application si un membre est déjà inscrit à un loot, mais la table `loot_rolls` ne possède pas de contrainte unique `(raid_loot_id, user_id)`.

Deux requêtes concurrentes peuvent donc créer un doublon.

**Correction :** contrainte unique en base et gestion propre de l'erreur de conflit.

## P1 — sessions et exploitation

### Store de session mémoire

Aucun store persistant n'est configuré pour `express-session`. Le store mémoire par défaut n'est pas adapté à une exploitation durable : les sessions disparaissent au redémarrage et la solution n'est pas conçue pour plusieurs processus.

**Correction :** store PostgreSQL/Redis ou autre store persistant adapté.

### Cookie non `secure` en production

Le cookie de session est configuré avec `secure: false`, malgré un commentaire indiquant de l'activer en production.

**Correction :** `secure: true` en HTTPS, configuré selon `NODE_ENV`, avec proxy de confiance maîtrisé.

### Port figé

Le serveur écoute le port 3000 en dur au lieu de respecter `process.env.PORT`, ce qui limite la portabilité sur les plateformes d'hébergement.

### Rate limiting trop générique

Un limiteur global existe, mais aucune politique spécifique plus stricte n'est appliquée à `/login` et `/register`.

### Énumération des comptes

Le login répond différemment lorsqu'un pseudo n'existe pas et lorsqu'un mot de passe est faux, ce qui permet de tester l'existence d'un compte.

## P1 — module événements incomplet

Le dépôt contient :

- une migration `events` ;
- une migration `event_types` ;
- `eventManagement.html` ;
- `eventManagement.js`.

Mais le front appelle `/activities`, `/program-event` et `/events`, alors que ces routes ne sont pas implémentées dans le `server.js` audité.

**Conclusion :** la gestion générique d'événements est un chantier/incrément incomplet et ne doit pas être annoncée comme fonctionnalité opérationnelle dans Labz.

## P2 — confidentialité et exposition des données

L'endpoint `/statistics` est accessible à tout utilisateur authentifié et charge l'ensemble des membres avec rôles, gear scores, rerolls, sélections de loot et disponibilités afin de calculer les statistiques et équipes.

Cela peut être parfaitement acceptable dans une guilde où ces informations sont collectives, mais une version moderne devrait expliciter ce modèle de confidentialité et ne retourner au navigateur que les données nécessaires à l'affichage demandé.

Des logs serveur affichent également certaines informations utilisateurs et disponibilités. Ils devraient être réduits ou structurés avant une exploitation actuelle.

## P2 — tests et maintenabilité

Le dépôt ne contient pas de suite de tests ni de CI visible. C'est la principale faiblesse d'ingénierie du projet : des règles importantes de permissions, composition d'équipes et attribution de loot reposent sur du code non protégé contre les régressions.

Minimum recommandé pour une reprise :

- tests d'authentification et autorisation ;
- tests du changement de rôles ;
- tests de double inscription ;
- tests du workflow d'approbation ;
- tests du roll avec participants approuvés/non approuvés ;
- test d'idempotence du roll ;
- tests de composition d'équipe ;
- test XSS sur les champs libres ;
- migration complète sur base vierge en CI.

## Architecture et dette

Le projet est essentiellement monolithique : un `server.js` d'environ 54 Ko porte l'authentification, les utilisateurs, statistiques, raids, loot, rolls, notifications et administration.

Cela était pragmatique pour une application communautaire de cette taille et n'empêche pas son usage réel, mais une reprise gagnerait à séparer :

- routes/controllers ;
- services métier ;
- accès aux données ;
- validation ;
- règles de permissions.

`server_backup.js` et les fichiers `.idea` versionnés ajoutent également du bruit au dépôt.

## Licence

`package.json` déclare une licence ISC, tandis que `LICENSE.txt` contient la licence MIT de **HTML5 Boilerplate** avec son copyright, et ne constitue pas clairement une licence du projet Crimson's Blade lui-même.

Avant toute publication du code, il faut clarifier :

- quelles parties proviennent d'HTML5 Boilerplate ;
- quelle licence Mathieu souhaite appliquer à son propre code ;
- les obligations éventuelles liées aux images/assets du jeu.

Le dépôt privé peut rester tel quel pour une simple présentation de cas dans Labz.

## Présentation Labz : ce qui peut être affirmé

Une future fiche peut honnêtement dire que Crimson's Blade était :

- une application web multi-utilisateur pour une guilde de *Throne and Liberty* ;
- utilisée réellement dans un contexte communautaire ;
- conçue pour centraliser profils, rôles, puissance, disponibilités et besoins de loot ;
- capable de calculer des statistiques et proposer des compositions d'équipes ;
- utilisée pour programmer les raids, gérer les inscriptions et accompagner la distribution du loot ;
- dotée de rôles administratifs, authentification et persistance PostgreSQL.

Elle ne doit pas dire :

- que le projet est actuellement maintenu ;
- qu'il est prêt à être redéployé ;
- que la gestion générique d'événements est fonctionnelle ;
- que le système de roll actuel est fiable sans correction ;
- que le code source est publiable en l'état.

## Décision

**Intégration Labz recommandée comme étude de cas historique forte.**

Contrairement à AFK Farm, Crimson's Blade n'a pas besoin d'être remis en production pour justifier sa place dans Labz : son intérêt principal est l'existence d'un besoin réel, d'un système complet et d'un usage réel prolongé.

Le dépôt doit rester privé. Si Mathieu souhaite un jour proposer une démo ou relancer le service, une phase de remédiation sécurité/intégrité doit précéder tout déploiement.