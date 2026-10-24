# Audit pré-intégration Labz — Écosystème d'outils RP

**Dépôts audités :**

- `MathieuBal/discortbotsaloon` — révision `6ccfe48f8d49469c34de8c6933b73ca0b952a87a`
- `MathieuBal/HotzDoggz-bot` — révision `0431c54ed7f7ff3fe9c0834eb7b9b69c530384cc` (`main`)
- `MathieuBal/ZepRasso` — révision `4b12310001d2902a960d4c59a47d8df24f7f5937`
- `MathieuBal/Zepevents` — révision `049889979bd84788f577593d4786d8d75179b71e`

**Date :** 24 octobre 2026  
**Statut proposé :** **intégration Labz fortement recommandée comme une seule étude de cas évolutive**

## Verdict

Ces quatre dépôts racontent une même démarche de conception : **absorber la logistique et l'administration hors jeu afin de rendre du temps aux interactions RP**.

Ils ne doivent pas être présentés comme quatre produits indépendants. Leur valeur vient de leur progression :

1. première automatisation artisanale d'une entreprise RP (`discortbotsaloon`) ;
2. industrialisation beaucoup plus poussée autour d'une entreprise GTA RP (`HotzDoggz-bot`) ;
3. exploration d'une interface légère côté participants, accessible par lien/QR (`ZepRasso`) ;
4. exploration alternative d'un poste de contrôle entièrement local côté organisateur (`Zepevents`).

La pièce technique et opérationnelle la plus forte est **HotzDoggz-bot**. Le projet a été réellement auto-hébergé sur le PC de Mathieu pendant environ quinze jours et utilisé par environ quarante personnes. Son historique Git montre également des rééquilibrages explicitement fondés sur des données réelles d'exploitation et un travail de relaunch.

La fiche Labz doit donc raconter **l'écosystème et son évolution**, avec HotzDoggz comme centre de gravité, Saloon comme origine et les deux projets Zep comme expérimentations événementielles complémentaires.

---

# 1. `discortbotsaloon` — première génération

## Contexte et rôle historique

Bot Discord Python développé pour la gestion d'un saloon sur Red Dead RP. Il a réellement servi à réduire la gestion manuelle de l'entreprise : stocks, ventes, caisse, commissions, salaires et affichages Discord.

Le besoin est déjà celui qui structurera les générations suivantes : éviter que les responsables passent leur temps dans des tableaux et des calculs au détriment du RP.

## Ce qui existe réellement

Le bot charge des produits et données comptables depuis MySQL, maintient des messages Discord servant de tableaux, propose des interactions de vente et met à jour :

- stocks ;
- ventes ;
- comptabilité ;
- commissions ;
- salaires.

L'architecture est toutefois typique d'une première version artisanale : gros script Python, état global en mémoire, multiples connexions DB, identifiants Discord codés en dur et peu de garde-fous métier.

## Défauts importants

### Sécurité / données

Le dépôt est public et versionne notamment `config.json`, `shop.db` et `export.csv`. Le README indique que `config.json` reçoit le token Discord.

Le contenu de ces fichiers n'a volontairement pas été ouvert pendant l'audit. Ils doivent être considérés comme **potentiellement sensibles**.

**Action recommandée :**

- vérifier hors exposition publique si le token historique a été révoqué ;
- le faire tourner s'il existe encore ;
- vérifier les données contenues dans les fichiers DB/CSV ;
- retirer/purger ce qui n'a aucune raison d'être public avant toute mise en avant du dépôt.

### Permissions insuffisantes

Des commandes comme `!quit` et `!update` ne possèdent pas de contrôle de rôle explicite dans le script audité. Un membre pouvant appeler ces commandes peut donc provoquer des actions qui devraient appartenir à l'administration.

### Intégrité du stock

La vente soustrait les quantités sans vérifier que le stock disponible est suffisant. Le stock peut donc devenir négatif.

### Interaction de quantité trop large

L'attente d'une quantité vérifie essentiellement l'auteur et le caractère numérique du message. Elle n'est pas suffisamment liée au canal / contexte de l'interaction et peut capter un autre message numérique du même utilisateur.

### Catégorie `tabac`

L'interface expose une catégorie `tabac`, alors que l'initialisation visible charge `boissons` et `nourriture`. Le chemin peut donc référencer une collection inexistante.

### Concurrence

Plusieurs ventes simultanées peuvent modifier un état partagé sans transaction métier cohérente entre mémoire et base.

## Décision

**Conserver comme origine historique, pas comme code à réutiliser.**

La valeur Labz est la preuve de l'émergence du besoin et d'un premier outil réellement utilisé, pas la qualité actuelle de l'implémentation.

---

# 2. `HotzDoggz-bot` — pièce maîtresse

## Contexte d'usage réel

Bot Discord de gestion d'entreprise GTA RP. Mathieu l'a auto-hébergé sur son PC, laissé tourner y compris pendant ses heures de travail pendant environ quinze jours, et l'outil a été utilisé par environ quarante personnes. Un hébergement permanent était envisagé avant que la panne du PC interrompe la continuité.

Cette information d'usage doit être distinguée d'une prétention d'hébergement professionnel : **outil auto-hébergé en conditions réelles**, pas SaaS ou service cloud industrialisé.

## Maturité actuelle du dépôt

La différence avec Saloon est très nette :

- TypeScript / Node.js ;
- Discord.js ;
- PostgreSQL ;
- Prisma et nombreuses migrations ;
- Zod pour la configuration ;
- Pino pour les logs ;
- Docker / Docker Compose ;
- stockage durable des preuves ;
- journal financier et journal d'audit ;
- séparation en modules métier ;
- tests Vitest ;
- CI GitHub Actions ;
- build et migrations testées sur PostgreSQL vierge.

La CI de `main` au commit audité est verte. L'historique indique 165 tests verts à la fin juin 2026.

## Ce qui existe réellement

Le dépôt couvre bien plus qu'un simple bot de caisse :

- employés et casiers Discord ;
- détection / ingestion des ventes ;
- déclaration assistée `/vendre` ;
- copie durable et hash SHA-256 des preuves ;
- détection de signaux de fraude ;
- workflow de validation par la direction ;
- historique des statuts ;
- comptabilité hebdomadaire ;
- journal financier ;
- clôture et paies ;
- avances sur salaire ;
- commandes clients ;
- ventes directes ;
- produits / menu ;
- partenaires ;
- stock / lots périssables / véhicules ;
- événements et planning ;
- avis ;
- notifications ;
- tableaux permanents ;
- badges / prestige / palmarès.

La base impose plusieurs invariants utiles : `threadId` de vente unique, référence unique, une seule semaine ouverte via clé unique, paie unique par employé/semaine, inscriptions événementielles uniques, etc.

## Éléments particulièrement solides

### Idempotence et concurrence

L'ingestion des ventes est sérialisée par thread et la base possède une unicité sur `threadId`. Les collisions de référence sont réessayées. Cela répond directement à un vrai risque des événements Discord `threadCreate` / `messageCreate` concurrents.

### Transactions métier

La création d'une vente, les preuves en base, l'historique et l'audit sont regroupés dans une transaction Prisma. La clôture hebdomadaire calcule les totaux, crée les paies, alloue réserve/prime/direction, intègre les ventes et écrit l'audit dans une transaction unique.

### Autorisations

Les rôles de direction sont vérifiés à partir du membre Discord rechargé, plutôt que de se fier uniquement à une donnée de session ou à l'interface.

### Configuration et secrets

Les secrets passent par l'environnement et le schéma Zod échoue tôt lorsqu'une variable obligatoire manque.

### Conteneurisation

L'image runtime utilise l'utilisateur `node` non root et fournit un healthcheck. C'est nettement supérieur à la première génération.

## Limites / dette actuelle

### Phase production encore incomplète

Le README lui-même marque la phase « durcissement & prod » comme non terminée : tests de charge, sauvegarde/restauration et déploiement permanent restent à achever.

Cela correspond au contexte réel : l'outil a tourné, mais l'hébergement permanent n'a pas été finalisé.

### Gestion des exceptions non capturées

Le process écoute `uncaughtException`, logue en fatal puis **continue à tourner**. En Node.js, une exception non capturée peut laisser l'application dans un état dont les invariants ne sont plus garantis.

**Recommandation :** loguer, déclencher un arrêt gracieux et laisser Docker / le superviseur redémarrer proprement le processus.

### Fichiers de preuves avant persistance DB

Les images sont copiées dans le stockage avant la transaction de création de vente. Si une course aboutit à `already_ingested` ou si la persistance échoue après stockage, des objets non référencés peuvent rester jusqu'à une éventuelle purge.

Ce n'est pas un défaut métier majeur mais un nettoyage d'exploitation à prévoir.

### Dépendance aux APIs Discord

Une partie importante du système dépend de Forums, tags, permissions, intents et structure du serveur. Le projet contient un diagnostic et de la réconciliation, ce qui réduit le risque, mais une reprise nécessiterait un test d'intégration Discord réel, impossible à remplacer entièrement par les tests unitaires.

### Pas de licence explicite

Aucun fichier `LICENSE` n'a été identifié dans l'arbre audité. Le dépôt public devrait clarifier les droits de réutilisation si le code est destiné à être partagé comme ressource.

## Lien entre code actuel et usage réel

Il faut éviter deux erreurs opposées :

- réduire l'outil à une expérimentation, alors qu'il a réellement servi ;
- prétendre que toutes les fonctionnalités actuelles ont été utilisées par les ~40 utilisateurs pendant toute la période.

L'historique montre toutefois que la montée en puissance actuelle est bien liée à l'exploitation : un commit du 30 juin recalibre les badges sur des **données réelles** (ordre de grandeur des ventes et du CA) et parle explicitement du relaunch. Dès le 19 juin, le dépôt possède déjà des commandes client et 72 tests verts.

La formulation Labz peut donc dire que **le système a été développé et ajusté au contact d'un usage réel**, sans attribuer à chaque module le même niveau d'usage.

## Décision

**Centre de gravité de la future étude de cas Labz.**

Même sans relance actuelle, HotzDoggz apporte une histoire complète : besoin réel, première mise en service, utilisateurs, retour terrain, rééquilibrage et architecture sensiblement plus mature.

---

# 3. `ZepRasso` — interface participant / QR / web

## Intention

Application web locale-first pour organiser un rassemblement automobile GTA RP. Le PC de l'organisateur sert le site ; les participants peuvent l'ouvrir sur le réseau local ou via un tunnel public, notamment depuis un QR code.

Le projet met donc directement en œuvre la philosophie : **faire entrer le joueur dans l'outil le moins longtemps possible, puis le renvoyer au RP**.

## État réel du dépôt

Stack : React + TypeScript + Vite côté client, Express côté serveur, persistance JSON locale.

Le dépôt couvre déjà :

- événements multiples ;
- inscriptions ;
- véhicules ;
- vote multi-critères ;
- classement ;
- paiements ;
- finances ;
- loteries ;
- export pour course de billes ;
- courses chronométrées ;
- paris ;
- sauvegardes/restauration ;
- audit anti-triche ;
- QR / découverte réseau ;
- tunnel Cloudflare.

L'historique du 4 juin indique 66 tests lors du passage multi-événements.

## Points solides

### Persistance adaptée au contexte

La base fichier reste volontairement simple, mais les écritures sont atomiques (`tmp` puis renommage), des sauvegardes sont prises automatiquement et une restauration depuis le dernier backup est tentée si `db.json` est corrompu.

### Séparation données publiques / admin

Les endpoints publics ne renvoient pas directement le détail complet des participants. Les votes publics passent par une projection dédiée. Les listes contenant contact/paiement sont derrière le contrôle admin.

### Contrôle admin

La comparaison du code partagé utilise `timingSafeEqual` et les échecs d'authentification admin sont limités par IP.

### Anti-triche honnête

Le système utilise identifiant local d'appareil + IP comme signaux de détection. La documentation reconnaît explicitement qu'il ne s'agit pas d'une sécurité inviolable sans comptes.

## Bloqueurs / limites avant réutilisation publique

### P0 — code admin par défaut exposable publiquement

`ADMIN_CODE` vaut `zepadmin` si aucune variable n'est fournie. Le README documente cette valeur. Le mode `npm run share` ouvre un tunnel public mais **n'empêche pas le démarrage avec ce code par défaut**.

**Correction :** si `--tunnel`, `PUBLIC_URL` publique ou `NODE_ENV=production`, refuser de démarrer avec la valeur par défaut et exiger un secret suffisamment long.

### P1 — secret admin stocké dans `localStorage`

Après connexion, le code organisateur complet est conservé côté navigateur puis renvoyé dans l'en-tête `x-admin-code` à chaque requête. C'est simple pour un outil éphémère, mais une XSS ou un poste partagé permettrait de récupérer le secret.

Pour un outil réutilisé régulièrement : session serveur courte ou token opaque après authentification, et possibilité de déconnexion/expiration.

### P1 — endpoints publics sans limitation générale

Votes, inscriptions et paris publics ne possèdent pas de rate limiting général comparable au login admin. Un client malveillant peut générer de nombreuses requêtes / entrées et faire grossir la base JSON pendant un tunnel public.

Le contexte événementiel réduit l'exposition, mais un déploiement public devrait ajouter :

- limite par IP / device sur les écritures publiques ;
- limites de longueur sur pseudos, notes et champs texte ;
- plafond raisonnable du nombre d'entrées.

### P1 — données anti-triche et vie privée

Les votes enregistrent l'adresse IP et un identifiant d'appareil local. C'est cohérent avec l'objectif anti-triche, mais une future version publique doit expliquer la collecte, la durée de conservation et la suppression de ces données après l'événement.

### P2 — persistance monoprocessus

La base JSON, les écritures synchrones et les structures en mémoire sont adaptées à un événement local de petite/moyenne taille, pas à un service multi-instance ou à forte charge. Il ne faut pas le présenter comme architecture SaaS.

### P2 — pas de CI identifiée

Des tests existent et l'historique mentionne 66 tests, mais aucune GitHub Action n'est présente dans l'arbre audité. La validation n'est donc pas imposée automatiquement à chaque push.

## Décision

**Conserver comme branche participant / QR de l'étude de cas**, avec éventuellement une démo future après durcissement minimal. Sa valeur vient surtout de son UX d'accès très court et de la richesse fonctionnelle atteinte avec une infrastructure volontairement légère.

---

# 4. `Zepevents` — poste de contrôle local organisateur

## Intention

Zepevents reprend les mêmes problématiques d'événement RP mais choisit une autre réponse : **ne pas imposer de site externe aux participants**. L'organisateur saisit localement inscriptions, votes, caisse, concours et loterie pendant que les joueurs restent en jeu.

Ce dépôt est antérieur aux derniers travaux multi-événements de ZepRasso : sa révision principale date du 28 mai 2026, tandis que la phase multi-events de ZepRasso est fusionnée le 4 juin.

Il vaut donc mieux parler de **branche alternative / exploration parallèle** que de succession stricte « ZepRasso puis Zepevents ».

## État réel

Application Python 3.13+ :

- cœur métier sans dépendance externe ;
- CLI complet ;
- interface CustomTkinter optionnelle ;
- dataclasses pour le modèle ;
- persistance JSON ;
- calculs de caisse / économie ;
- concours public, jury ou hybride ;
- loterie ;
- exports CSV / Discord ;
- suite pytest ;
- lint Ruff configuré.

## Points solides

- séparation relativement propre entre modèles, concours, économie, caisse, loterie, stockage, exports, CLI et UI ;
- fonctions métier testables indépendamment de l'interface ;
- nombreux tests présents dans le dépôt ;
- tirage de loterie pouvant recevoir une seed pour reproductibilité / audit ;
- historique de tirages, redraw et exclusion ;
- gestion des paiements partiels et caisse réelle ;
- dépendances minimales.

## Limites

### P1 — sauvegarde JSON non atomique

Contrairement à ZepRasso, `save_event()` écrit directement le JSON cible. Une interruption pendant l'écriture peut donc corrompre l'unique fichier d'événement.

**Correction :** écriture temporaire + `os.replace`, éventuellement backup avant écrasement.

### P1 — identité texte sensible à la casse dans certaines règles

Certaines fonctions utilisent une comparaison normalisée (`casefold`) pour les achats, mais :

- les votants du concours sont comparés avec `==` ;
- `eligible_buyers()` de la loterie déduplique les noms avec la casse d'origine.

En mode « une chance par personne », `Maya` et `maya` peuvent donc être considérés comme deux personnes si des entrées ont été saisies avec des casses différentes.

**Correction :** une fonction d'identité normalisée commune pour votants, acheteurs et exclusions, tout en conservant séparément le nom d'affichage.

### P1 — invariants jury faibles dans le cœur métier

`add_jury_score()` vérifie les noms de critères mais n'impose pas directement une plage de notes et ne bloque pas un second score du même juge sur le même véhicule. Si le CLI/UI fait des validations supplémentaires, le domaine lui-même reste permissif.

**Correction :** borner les notes dans le service métier et définir explicitement la règle de révision d'une note par un juge.

### P2 — pas de CI identifiée

Les tests sont présents mais aucune GitHub Action n'est visible dans l'arbre audité. Comme pour ZepRasso, une CI légère (`ruff` + `pytest`) suffirait.

### P2 — Python 3.13+

Ce choix simplifie l'environnement moderne mais augmente la friction d'installation sur une machine événementielle qui ne dispose pas déjà de Python récent. Les launchers compensent partiellement cette difficulté mais ne fournissent pas eux-mêmes Python.

### Licence

Aucun fichier de licence explicite n'est visible dans l'arbre audité.

## Décision

**Conserver comme branche organisateur/local de l'étude de cas.**

Ce projet illustre une vraie décision produit : lorsque faire sortir chaque participant du jeu crée trop de friction ou pose un problème d'acceptation serveur, déplacer la complexité du côté de l'organisateur.

---

# Lecture d'ensemble

## Une évolution de méthode, pas quatre produits

L'intérêt de l'écosystème est la progression des compromis :

### Saloon

« Je remplace une gestion manuelle pénible par un bot Discord. »

### HotzDoggz

« Je fiabilise cette logique : source de vérité DB, preuves, validation humaine, audit, comptabilité, paie, diagnostics et exploitation réelle. »

### ZepRasso

« Pour les événements, je rends l'interaction participant extrêmement courte grâce au web/QR et automatise votes, inscriptions, loteries et résultats. »

### Zepevents

« Si le site externe gêne le RP ou l'acceptation du serveur, je garde toute la logistique dans un poste de contrôle local côté organisateur. »

Ces réponses partagent la même finalité : **le logiciel doit soutenir le RP, pas devenir l'activité principale des joueurs.**

## Présentation Labz recommandée

### Titre possible

**Écosystème RP — automatiser la logistique pour préserver le jeu**

### Positionnement

Étude de cas retraçant plusieurs générations d'outils construits autour d'entreprises et d'événements RP : gestion d'activité Discord, comptabilité, ventes, paies, inscriptions, votes, loteries, courses et contrôle événementiel.

### Ce qu'on peut affirmer honnêtement

- plusieurs outils répondent à des besoins réellement rencontrés en RP ;
- la première génération Saloon a réellement servi ;
- HotzDoggz a été auto-hébergé et utilisé par environ quarante personnes pendant environ quinze jours ;
- le dépôt HotzDoggz actuel possède une architecture TypeScript/PostgreSQL, migrations, tests et CI ;
- son développement a été ajusté avec des données réelles d'exploitation ;
- ZepRasso explore un accès participant par QR / navigateur et possède déjà une base fonctionnelle riche ;
- Zepevents explore une variante locale centrée organisateur ;
- les loteries ont été intégrées au contexte événementiel, notamment avec un export pensé pour les courses de billes utilisées pour matérialiser les tirages.

### Ce qu'on ne doit pas affirmer

- que les quatre outils ont été exploités à la même échelle ;
- que toutes les fonctionnalités actuelles de HotzDoggz étaient déjà présentes pendant toute la période des ~40 utilisateurs ;
- que ZepRasso est sécurisé comme un service Internet permanent ;
- que Zepevents est le successeur strict de ZepRasso ;
- que Saloon est une base technique à reprendre aujourd'hui.

## Priorités si l'écosystème est remis en démonstration

1. **HotzDoggz** : meilleur support pour le récit technique ; pas besoin d'une démo Discord publique si une présentation détaillée suffit.
2. Corriger le comportement `uncaughtException` et finir la stratégie backup/restauration avant un éventuel hébergement permanent.
3. **ZepRasso** : interdire le code admin par défaut en mode tunnel, ajouter rate limits publics et politique de rétention IP/device avant toute démo publique.
4. Ajouter une CI à ZepRasso.
5. **Zepevents** : rendre la sauvegarde atomique, normaliser les identités et renforcer les invariants jury.
6. Ajouter CI et licence à Zepevents.
7. **Saloon** : vérifier puis assainir les fichiers publics potentiellement sensibles ; ne pas chercher à moderniser ce code, sa valeur est historique.

## Décision finale

**Intégration Labz fortement recommandée sous une seule entrée.**

C'est probablement l'une des histoires les plus fortes du portefeuille parce qu'elle combine :

- un problème concret ;
- plusieurs itérations ;
- des décisions produit différentes selon le contexte ;
- une montée en maturité technique visible ;
- et, surtout, une utilisation réelle par une communauté.

La présentation doit privilégier l'évolution et les compromis plutôt que la quantité de dépôts.