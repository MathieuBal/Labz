# Audit pré-intégration Labz — AFK Farm

**Dépôt audité :** `MathieuBal/afk-farm`  
**Révision :** `62e17a97eec9102d72839c57a0df95af604cbf52`  
**Date :** 24 octobre 2026  
**Statut proposé :** **candidat Labz fort, à remettre à niveau avant publication**

## Verdict

AFK Farm n'est pas un simple prototype graphique. Le dépôt contient une vraie boucle de jeu incrémentale : récolte active, économie, progression hors-ligne, arbre de compétences, construction, biomes, prestige, succès, audio, sauvegarde locale et PWA. Le code est suffisamment structuré et le projet suffisamment poussé pour justifier une place potentielle dans Labz.

En revanche, l'audit met en évidence plusieurs incohérences qui touchent directement des promesses centrales du jeu. Il ne faut donc pas le présenter aujourd'hui comme un jeu fini ou complètement fiabilisé.

**Position recommandée après correction :** `Expérience jouable / prototype avancé, ouvert aux retours`.

## Angle de présentation potentiel

Le projet vient d'une démarche personnelle récurrente : lorsqu'une expérience de jeu souhaitée n'existe pas telle quelle sur le marché, construire sa propre interprétation. AFK Farm transforme le champ magnétique de Sensoria en boucle idle/incrémentale complète, puis pousse l'idée vers une économie, une progression, des choix de build et une PWA mobile.

L'intérêt portfolio n'est pas seulement le volume de fonctionnalités. Il montre une capacité à partir d'une sensation de jeu, la transformer en systèmes corrélés, mesurer certains problèmes d'équilibrage puis itérer.

## Ce qui est réellement solide

### Architecture

Le jeu est découpé par responsabilité : état et sauvegarde, configuration, audio, succès, arbre, champ physique, moteur de jeu, interface d'arbre, UI générale et bootstrap. Cette séparation reste lisible malgré l'absence de framework.

Le moteur de champ utilise des tableaux typés et limite la densité selon la taille de l'écran. Le rendu différencie grains au repos et grains actifs et applique un culling simple près des sources d'attraction. C'est une optimisation cohérente pour un jeu Canvas sans moteur externe.

### Boucle de jeu

Les systèmes existent réellement dans le code :

- sessions de récolte limitées par énergie, temps et stockage ;
- combo et Surge ;
- drones passifs ;
- projets multi-pièces avec timers ;
- six biomes de base avec modificateurs mécaniques ;
- progression procédurale au-delà ;
- prestige et perks ;
- succès et statistiques ;
- arbre déterministe à sept branches ;
- sauvegarde locale et gains hors-ligne au lancement.

### Expérience mobile / PWA

Le projet est touch-first, prend en compte les safe areas, possède un manifest et un service worker, et embarque ses polices pour fonctionner hors ligne. `prefers-reduced-motion` est également pris en compte.

### Déploiement

Un workflow GitHub Pages existe et le dernier déploiement du commit audité s'est terminé avec succès. Cela valide la chaîne de publication, mais pas à lui seul l'expérience de jeu dans tous les navigateurs.

## Bloqueurs avant intégration Labz

### P0 — progression AFK au retour d'arrière-plan

`computeOffline()` n'est exécuté qu'à la construction de `Game`, donc au chargement de la page. Lorsqu'un onglet ou une PWA passe en arrière-plan, le jeu sauvegarde mais ne recalcule pas la progression hors-ligne au retour.

L'autosauvegarde modifie en outre `lastSave` toutes les cinq secondes. Dans un navigateur qui continue à exécuter périodiquement le timer en arrière-plan, le checkpoint peut avancer sans que la simulation correspondante soit créditée.

**Impact :** une promesse centrale d'un idle game — continuer à progresser quand l'application n'est pas active — peut être inexacte dans une session laissée ouverte.

**Correction attendue :** séparer le timestamp de simulation du timestamp de persistance et traiter explicitement `visibilitychange` au retour au premier plan.

### P0 — économie des Cores contradictoire

Les Cores ont deux rôles simultanés :

1. chaque Core détenu donne +10 % de revenu global ;
2. les mêmes Cores sont dépensés pour acheter les perks permanents.

Acheter un perk diminue donc le multiplicateur fourni par les Cores. Le premier niveau de `Mémoire magnétique`, par exemple, coûte un Core pour +8 %, alors que conserver ce Core apportait +10 %.

**Impact :** certains achats présentés comme améliorations peuvent réduire la puissance du joueur.

**Correction recommandée :** conserver une valeur cumulée/lifetime de Cores servant à la puissance permanente et un solde dépensable distinct, ou revoir entièrement la sémantique et l'équilibrage.

### P1 — arbre : liens croisés incomplets

Les liens vers la branche suivante sont créés pendant la construction de chaque branche. Or la branche cible n'existe pas encore dans la plupart des cas, et la fonction de liaison ignore alors la relation. Le résultat ne correspond donc pas à l'arbre annoncé avec des liens croisés distribués entre branches.

**Correction attendue :** générer tous les nœuds d'abord, puis créer les liens croisés dans une seconde passe.

### P1 — une récolte peut être mise en pause par la navigation

Le timer et la consommation d'énergie d'une session ne progressent que si `fieldActive` est vrai. Ouvrir l'arbre, le chantier, le prestige ou le profil met donc la session active en pause sans la terminer.

**Correction attendue :** continuer la session indépendamment de la vue, ou terminer explicitement la récolte lorsqu'on quitte le terrain.

### P1 — migration de sauvegarde incomplète

Le code définit des anciennes clés de sauvegarde v1/v2, mais `load()` ne lit que la clé v3. Le mécanisme nommé `migrate()` ne migre donc pas réellement les anciennes sauvegardes.

Le problème est plus important qu'un simple renommage : l'ancien schéma des projets v2 utilisait une structure différente du schéma v3. Une vraie conversion est nécessaire si la compatibilité avec d'anciennes parties doit être conservée.

## Incohérences fonctionnelles ou de présentation

### Combo

`stats.comboMax` stocke le nombre de captures consécutives, mais l'interface l'affiche comme un multiplicateur (`×25`, `×50`, etc.). Le multiplicateur réel est calculé séparément et est plafonné autour de ×5 avant améliorations.

**Action :** parler de chaîne de 25/50 captures ou stocker réellement le multiplicateur maximum.

### Profil

Le champ `Prestiges ◆` affiche le nombre de Cores et non le nombre de prestiges.

### Nœud central de l'arbre

La description du cœur annonce +10 % de revenu global, mais `aggregate()` saute explicitement le nœud `core`; ce bonus n'est donc pas appliqué par l'arbre.

### Bonus des projets

L'interface parle de bonus « permanent », mais `projectIndex` et les projets sont remis à zéro lors d'un prestige. Le bonus est permanent pendant le cycle courant, pas entre les prestiges.

### Énergie initiale

Une nouvelle sauvegarde commence à 120 d'énergie alors que le maximum configuré est 140. Un reset, lui, remet l'énergie au maximum. Le comportement n'est pas cohérent entre nouvelle partie et réinitialisation.

## Documentation à réaligner

Le README décrit encore une version antérieure sur plusieurs points :

- six branches au lieu de sept ;
- multiplicateur de biome ×15 alors que le code utilise ×12 ;
- formulation des temps de chantier trop générale pour le premier projet ;
- certains commentaires internes parlent également encore de six branches.

Le guide de déploiement décrit deux méthodes alors que le dépôt utilise actuellement le workflow GitHub Actions. La documentation finale devrait décrire en priorité l'état réellement utilisé.

## Tests et fiabilité

Aucune suite de tests automatisés n'est versionnée dans le dépôt audité. Le code expose `window.__afk` pour des tests et l'historique de commits mentionne plusieurs simulations et vérifications navigateur, mais ces validations ne sont pas reproductibles par la CI actuelle.

Le workflow GitHub Actions ne fait que publier sur Pages.

**Minimum recommandé avant Labz :**

- tests de sauvegarde/migration ;
- tests de calcul de progression hors-ligne ;
- tests des invariants de l'économie des Cores ;
- test du nombre de branches et des liens croisés ;
- tests des règles de session ;
- smoke test navigateur de la boucle principale.

## Déploiement et release

Le workflow Pages se déclenche sur `main` mais aussi sur `claude/idle-game-collection-9wim9a`. Cette branche est actuellement identique à `main`, mais une future modification poussée dessus pourrait redéployer directement la démo publique.

**Action :** limiter la publication de production à `main`.

## Accessibilité et compatibilité à vérifier

Le projet respecte `prefers-reduced-motion` et ajoute des focus visibles, ce qui est positif.

Points restant à vérifier sur appareils réels :

- le viewport interdit le zoom utilisateur ;
- `touch-action: none` est appliqué globalement et pourrait gêner le défilement tactile des panneaux selon le navigateur ;
- le manifest ne fournit qu'une icône SVG ; des PNG dédiés amélioreraient la compatibilité d'installation sur certaines plateformes.

Ces points ne sont pas considérés comme des bugs confirmés sans test navigateur/appareil.

## Licence

Aucun fichier `LICENSE` n'est présent dans l'arbre audité. Le dépôt est public, mais cela ne signifie pas que le code est juridiquement open source.

**Action optionnelle mais recommandée :** choisir et ajouter une licence si l'objectif est d'autoriser explicitement la réutilisation ou la contribution.

## Priorités avant présentation Labz

1. Corriger le cycle AFK arrière-plan / reprise.
2. Corriger le modèle économique des Cores.
3. Corriger les liens croisés de l'arbre.
4. Corriger la pause de session via navigation.
5. Implémenter ou assumer clairement la stratégie de migration des anciennes sauvegardes.
6. Ajouter une petite suite de tests automatisés et l'exécuter en CI.
7. Réaligner README, libellés et statistiques avec le code réel.
8. Limiter le déploiement Pages à `main`.
9. Faire un smoke test desktop + mobile réel avant de publier la fiche Labz.

## Décision

**Conserver le dépôt et le faire passer en remédiation pré-Labz.**

AFK Farm possède assez de contenu, d'identité et de profondeur pour être présenté. Le bon statut n'est pas « jeu terminé », mais **prototype avancé jouable**, à condition de corriger les incohérences centrales puis de vérifier la version publique sur navigateur et mobile.

La fiche Labz ne doit être rédigée qu'après cette remédiation et un nouveau contrôle rapide du dépôt afin que chaque affirmation publique soit directement soutenue par l'état réel du code.