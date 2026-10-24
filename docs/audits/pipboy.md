# Audit pré-intégration Labz — Pip-Boy JDR

**Dépôt audité :** `MathieuBal/Pipboy`  
**Révision :** `1eff7f5ce97eff234e97c24ec721ed1c9487450c`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · compagnon JDR public/testable, avec un bloqueur d’asset tiers à corriger et une session Supabase réelle à revalider**

## Verdict

`Pipboy` mérite de rester dans Labz.

Le projet est nettement plus qu’un habillage Fallout : c’est un compagnon de campagne React/TypeScript avec séparation MJ/joueur, carte interactive, journal, documents, quêtes, personnes, créatures, objets, holobandes, terminaux à codes, table de jeu, brouillard, scénarios, sauvegardes et synchronisation multi-appareils via Supabase.

La qualité de validation est élevée pour un projet personnel : tests Node, moteur PostgreSQL embarqué PGlite pour vérifier le SQL de sécurité, plusieurs smoke tests Playwright en Chromium/WebKit et déploiement GitHub Pages.

La révision auditée possède un déploiement Pages vert et le workflow lourd de validation a également réussi sur cette même révision.

Deux points empêchent toutefois une présentation totalement propre aujourd’hui :

1. le dépôt redistribue une carte officielle Fallout 4 alors que le README affirme qu’aucun asset Bethesda n’est redistribué ;
2. une vraie configuration Supabase est désormais présente dans le code, mais la validation de bout en bout sur deux appareils n’est pas documentée comme réalisée.

Le premier point doit être corrigé avant de mettre en avant la promesse « aucun asset Bethesda redistribué ».

---

## Ce qui existe réellement

### Compagnon MJ / joueur

Le projet contient réellement :

- vue joueur ;
- console MJ ;
- fiches de plusieurs types ;
- recherche et tags ;
- visibilité secrète/publique ;
- envoi/retrait de fiches ;
- carte ;
- position joueur ;
- tokens ;
- brouillard ;
- table de jeu ;
- préparation de scénario ;
- terminaux à code ;
- sauvegardes de campagne ;
- bibliothèque d’holobandes ;
- bibliothèque d’illustrations/cartes.

Le projet possède donc une vraie logique de table JDR numérique, pas uniquement une UI thématique.

### Mode démo local

Sans Supabase, le projet fonctionne avec une démo locale basée sur `localStorage`.

Le code valide une partie de la structure sauvegardée : fiches, types, tokens, coordonnées, couleurs, logs, etc. Une sauvegarde illisible n’est pas simplement écrasée silencieusement.

Cette voie est intéressante pour Labz : le visiteur peut tester le concept sans compte ni backend.

---

## Supabase : isolation réellement conçue côté serveur

Le schéma ne s’appuie pas sur la route React ou un bouton pour décider qui est MJ.

### Tables privées

Les tables de campagne et d’adhésion :

- ont RLS activé ;
- retirent les accès directs `anon` / `authenticated` ;
- passent par des RPC `SECURITY DEFINER` ;
- utilisent `search_path=''`.

### Rôle MJ

`create_session` refuse un compte anonyme comme MJ.

`save_session` exige que `auth.uid()` soit le propriétaire de la campagne.

### Projection joueur

`get_session` ne renvoie pas simplement le JSONB complet au joueur puis ne masque pas les secrets côté React.

La projection SQL retire notamment :

- entrées non visibles ;
- journal MJ ;
- code d’invitation ;
- données de scénario privées ;
- tokens masqués ;
- notes privées des tokens ;
- tokens d’autres cartes/scènes.

C’est un très bon choix architectural : un joueur ne peut pas récupérer un secret simplement en ouvrant DevTools.

### Concurrence

`save_session` utilise une révision optimiste. Une sauvegarde basée sur une révision obsolète est refusée au lieu d’écraser silencieusement une modification récente.

### Terminaux

Les codes de terminaux sont conservés dans l’état privé et résolus côté RPC.

`unlock_terminal` :

- vérifie l’accès à la session ;
- verrouille la ligne de campagne ;
- limite à 5 tentatives dans une fenêtre de 30 s ;
- valide la forme du code ;
- ajoute seulement la note déverrouillée au contenu visible ;
- incrémente la révision et le signal Realtime.

---

## Tests SQL : point fort

`tests/security.test.mjs` exécute réellement `supabase/schema.sql` dans PGlite avec :

- propriétaire ;
- joueur ;
- tiers.

Le test vérifie notamment que :

- le propriétaire voit les secrets ;
- un tiers est refusé ;
- le joueur ne voit que les fiches visibles ;
- le journal est vide côté joueur ;
- le code d’invitation n’est pas renvoyé ;
- les informations privées de token ne sont pas envoyées ;
- la table privée n’est pas directement lisible ;
- le joueur ne peut pas sauvegarder la campagne ;
- révélation et retrait persistent ;
- une révision obsolète est refusée.

C’est une preuve beaucoup plus forte qu’un simple test d’interface.

---

## Validation navigateur

Le dépôt possède plusieurs scripts Playwright spécialisés :

- parcours MJ/joueur ;
- startup Chromium + WebKit ;
- table de jeu ;
- scénario / placement tactile ;
- plein écran, pointeur partagé et backups ;
- brouillard mobile Chromium/WebKit ;
- campagne vide / fiches fournies ;
- terminaux ;
- UI générale.

Le smoke principal démarre `vite preview`, donc exerce le build de production.

Il vérifie notamment :

- import/envoi/retrait de contenu ;
- persistance locale ;
- holobandes sans autoplay ;
- sauvegardes en erreur sans perte de brouillon ;
- notes lorsque le stockage est plein ;
- comportements de modales ;
- affichage à différentes tailles.

C’est un bon niveau de validation fonctionnelle.

---

## CI : bonne, mais deux workflows de niveaux différents

### Validation lourde

`Validate Pip-Boy` exécute :

- `npm test` ;
- synchronisation métadonnées holobandes ;
- build ;
- installation Chromium + WebKit ;
- tous les smoke tests spécialisés ;
- upload des résultats/captures.

La révision auditée a passé ce workflow avec succès.

### Déploiement Pages

Le workflow `main` exécute :

- `npm ci` ;
- `npm test` ;
- synchronisation holobandes ;
- build ;
- déploiement Pages.

Il ne relance pas les smoke tests Playwright lourds.

### P1 — push direct sur `main`

Le workflow de validation lourde est déclenché sur pull request et sur une branche de travail spécifique, pas sur chaque push `main`.

Un push direct sur `main` peut donc être déployé après tests Node/build sans refaire Chromium/WebKit.

**Correction recommandée :** soit faire dépendre le déploiement d’un workflow de validation complet, soit exécuter au minimum un smoke navigateur rapide sur `main` avant Pages.

---

## P0 — contradiction sur un asset Bethesda redistribué

Le README annonce :

> « Aucun asset Bethesda redistribué. »

Mais `public/maps/commonwealth.jpg` est documenté dans `public/maps/README.md` comme :

- provenant des fichiers de Fallout 4 ;
- artwork © Bethesda ;
- téléchargé inchangé depuis une source tierce.

Comme le fichier est placé dans `public/`, il est copié dans le build Vite et redistribué par GitHub Pages.

La promesse actuelle est donc factuellement incorrecte.

### Recommandation

**Remplacer cette carte par un schéma original ou généré**, puis retirer le fichier officiel du dépôt/publication.

Une simple attribution ne résout pas automatiquement la question du droit de redistribution.

Les cartes de la mission Smoky Waters ne posent pas la même ambiguïté : leur README documente explicitement qu’elles ont été générées par IA pour la campagne et qu’elles ne sont pas des artworks officiels.

Les 16 illustrations de personnages/créatures Smoky sont également documentées comme générées par l’outil d’image pour ce projet.

---

## Holobandes : liens externes, pas redistribution des fichiers audio

`public/holotapes.json` référence des fichiers hébergés par le wiki Fallout.

Le dépôt n’embarque pas les fichiers audio ni leurs transcriptions protégées : il conserve métadonnées et URLs, puis le navigateur lit les fichiers depuis l’hébergeur externe.

Le README est transparent sur :

- l’absence d’autoplay ;
- la dépendance à l’hébergeur ;
- les problèmes de compatibilité OGG ;
- le fait que l’indexation massive du wiki est actuellement bloquée par HTTP 403 en CI.

Ce point peut être présenté comme **intégration externe expérimentale**, pas comme bibliothèque audio possédée par le projet.

---

## Configuration Supabase : documentation à actualiser

Le README indique encore, dans ses limites, que les tests Supabase réels n’ont pas été exécutés et qu’aucun projet n’était configuré au moment de la livraison.

Or `src/supabase-public.ts` contient aujourd’hui :

- une URL de projet Supabase réelle ;
- une clé `sb_publishable_...`.

Une clé publishable est destinée à être embarquée dans un frontend ; ce n’est pas un secret service-role.

Le problème n’est donc pas l’exposition de la clé, mais la **désynchronisation de la documentation** et l’absence de preuve auditée d’une recette réelle à deux appareils avec ce backend.

### Recommandation

Avant présentation Labz définitive :

1. tester MJ connecté sur un appareil ;
2. rejoindre par code depuis un second appareil ;
3. transmettre/retirer plusieurs types de fiches ;
4. recharger les deux appareils ;
5. tester Realtime + fallback 10 s ;
6. vérifier qu’un secret n’apparaît jamais dans Network/JSON côté joueur ;
7. tester terminaux et concurrence ;
8. documenter le résultat.

---

## P2 — code d’invitation et abus

Le code de session est construit à partir des huit premiers caractères hexadécimaux d’un UUID, soit environ 32 bits d’espace.

Pour un petit groupe JDR avec un code transmis directement, c’est raisonnable.

Mais `join_session` ne possède pas de throttling métier comparable à celui des terminaux. Si l’outil devenait un service largement public, il serait préférable de :

- augmenter l’entropie du code ;
- ajouter un rate limit côté RPC/Edge/gateway ;
- éventuellement permettre de régénérer/révoquer le code d’invitation.

Ce n’est pas un bloqueur pour un usage privé de campagne.

---

## Accessibilité / mobile

Le projet est réellement conçu mobile-first : styles à 320 px, tests 320/390/1440, WebKit, placements tactiles, responsive et réduction d’effets.

Les tests WebKit constituent un bon proxy Safari, mais ne remplacent pas une vraie recette iPhone pour :

- audio distant ;
- plein écran ;
- veille/réveil ;
- Realtime ;
- interaction tactile prolongée.

Le README reconnaît déjà ce besoin.

---

## Licence

Aucun fichier `LICENSE` n’apparaît dans l’arbre audité.

Le dépôt mélange :

- code original ;
- contenu JDR original ;
- illustrations/cartes IA ;
- URLs vers des médias Fallout ;
- actuellement une carte officielle Fallout 4 à retirer.

Une future licence devra donc distinguer clairement code et contenu/assets.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que `Pipboy` :

- est un compagnon JDR mobile-first React/TypeScript ;
- fonctionne en démo locale sans backend ;
- propose une console MJ et une vue joueur ;
- gère fiches secrètes/publiques, carte, tokens, brouillard, table et terminaux ;
- possède une architecture Supabase où les secrets joueurs sont filtrés côté SQL ;
- possède une concurrence optimiste par révision ;
- possède des tests SQL d’isolation propriétaire/joueur/tiers dans PGlite ;
- possède plusieurs smoke tests Chromium/WebKit sur le build ;
- est déployé sur GitHub Pages ;
- possède une configuration Supabase publishable embarquée ;
- utilise des illustrations/cartes Smoky générées par IA ;
- référence des holobandes hébergées par un wiki sans embarquer leurs fichiers audio.

## À ne pas sur-vendre

- « aucun asset Bethesda redistribué » : faux tant que `commonwealth.jpg` reste publié ;
- « session Supabase validée de bout en bout sur plusieurs appareils » : non documenté ;
- « tous les smoke tests bloquent chaque déploiement `main` » : faux ;
- « bibliothèque Fallout autonome » : faux, les audios dépendent du wiki ;
- « application officielle Fallout » : évidemment faux ; rester sur une présentation de **compagnon JDR fan-made / expérimental**.

---

## Plan de remédiation prioritaire

1. **Retirer/remplacer `public/maps/commonwealth.jpg` par une carte originale/générée.**
2. Corriger le README après suppression afin que la promesse sur les assets soit vraie.
3. Faire une recette Supabase réelle MJ + joueur sur deux appareils.
4. Faire passer au moins un smoke navigateur avant tout déploiement direct de `main`.
5. Durcir/rallonger le code d’invitation si l’usage dépasse le cercle privé.
6. Tester iPhone réel, notamment audio, veille, Realtime et tactile.
7. Clarifier licence du code et statut des contenus/assets.

## Décision finale

**`Pipboy` reste dans Labz avec un statut `démo navigateur / compagnon JDR testable`.**

Son intérêt portfolio n’est pas seulement le thème Fallout : l’élément le plus défendable techniquement est la séparation de visibilité MJ/joueur **côté base**, accompagnée de tests SQL et de tests navigateur assez complets.

La priorité avant de retravailler sa fiche n’est pas d’ajouter des fonctions. C’est de **supprimer l’asset Bethesda redistribué, revalider la session Supabase réelle et aligner le déploiement `main` sur le niveau de test déjà disponible dans le dépôt**.