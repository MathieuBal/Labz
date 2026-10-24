# Audit pré-intégration Labz — Constella

**Dépôt audité :** `MathieuBal/constella`  
**Branche de référence :** `claude/setup-cosmic-explorer-RBada`  
**Base fonctionnelle intégrée :** `e27826d90299c7d201f333e4d5fe0d074a388946` (ARCH-030)  
**Révision documentaire actuelle :** `13b99384fa4995b56c95ee949a2b17f362f07035`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · une seule étude de cas Constella avec deux surfaces Explore / Watch · prototype privé avancé, volontairement en pause avant bêta**

## Verdict

Constella est l'un des projets les plus ambitieux et les plus structurés du portfolio, mais il ne faut pas le présenter comme un produit cloud disponible aujourd'hui.

Le dépôt contient réellement deux surfaces produit distinctes :

- **Constella Explore** : cartographie de goûts, scoring, duels, historiques et visualisation spatiale 3D ;
- **Constella Watch** : veille multi-sources, ranking, suivi d'articles, journaux et digests assistés par LLM.

Ces deux surfaces partagent un Core, une composition React/TypeScript, une couche de persistance et une trajectoire cloud communes. Des garde-fous automatisés vérifient les frontières entre Core, Explore et Watch, et les builds dédiés sont réellement produits séparément.

Pour Labz, il est donc plus cohérent de **fusionner les deux cartes historiques “Constella Explore” et “Constella Watch” en une seule fiche Constella**, puis de présenter Explore et Watch comme deux facettes de la même suite. Les maintenir comme deux projets autonomes sur-vendrait leur indépendance alors qu'ils partagent le même dépôt, le même Core, la même infrastructure et le même état de maturité.

La base intégrée jusqu'à **ARCH-030** a réellement passé le quality gate complet : frontend, tests, builds Suite/Explore/Watch, Worker, sidecar et dry-runs de déploiement beta. Le blocage GitHub Actions observé ensuite ne correspond pas à des tests Constella en échec : les jobs concernés sont créés puis terminés sans runner ni étapes exécutées.

La décision de pause est donc saine : ne pas merger la synchronisation workspace cloud (ARCH-031) ni les changements CI associés tant que les contrôles distants ne s'exécutent pas à nouveau.

---

## État intégré vs travaux ouverts

### Intégré

La base ARCH-030 contient notamment :

- séparation Core / Explore / Watch ;
- entrées/builds Suite, Explore et Watch ;
- moteur spatial partagé ;
- persistance abstraite ;
- sidecar SQLite local ;
- adapter HTTP remote ;
- façade publique `/v1` ;
- Worker de persistance D1 ;
- isolation de tenant/sujet opaque ;
- sécurité Worker (auth/CORS/rate limit) ;
- topologie de beta same-origin ;
- workflows de dry-run backend et web.

### Non intégré

La PR #49 **ARCH-031** reste ouverte et non mergée.

Elle porte la synchronisation du workspace navigateur vers D1 : domaines, items et état produit, bootstrap cloud, cache local, autosave et conflits optimistes.

Cette fonctionnalité **ne doit pas être présentée comme acquise** tant que la PR n'est pas validée puis mergée.

La PR #50 **CI-001** reste elle aussi ouverte. Elle réduit le nombre de runners sans supprimer les contrôles, mais son nouveau quality gate n'a pas obtenu de runner lors de la dernière tentative.

---

## Preuve de validation de la base intégrée

Le commit ARCH-030 `e27826d...` possède un run GitHub Actions réussi le 24 octobre 2026.

Les cinq jobs ont réellement exécuté leurs étapes et terminé en succès :

- frontend ;
- Worker ;
- sidecar ;
- beta backend dry-run ;
- beta web dry-run.

Le job frontend a notamment exécuté :

- garde des frontières produit ;
- garde anti-secrets fournisseur dans le navigateur ;
- typecheck ;
- tests frontend/core ;
- build Suite ;
- builds Explore + Watch ;
- vérification des artifacts produits.

Le Worker a passé son typecheck et les dry-runs des deux Workers public/persistance.

Cette base peut donc être décrite comme **validée par CI**, contrairement aux travaux ouverts qui suivent.

---

## Explore / Watch : séparation réelle

### Entry points dédiés

`src/main.explore.tsx` monte explicitement `mountConstella('explore')`.

`src/main.watch.tsx` monte explicitement `mountConstella('watch')`.

La portée produit n'est pas stockée comme préférence utilisateur : elle est fixée par la composition/build.

### UI réellement élagable

`App.tsx` charge les composants propres à Explore ou Watch derrière des constantes de build :

- Explore : évaluation, insights, ajout d'item, duel ;
- Watch : articles/brouillons.

Les builds dédiés peuvent donc retirer le graphe UI du produit opposé au lieu de simplement masquer une navigation.

### Garde architecture automatisée

`scripts/check-product-boundaries.mjs` analyse les imports et interdit notamment :

- Core → Explore/Watch ;
- Explore → Watch ;
- Watch → Explore ;
- dépendances Watch dans les moteurs neutres ;
- lecture directe du root store depuis plusieurs consommateurs produit ;
- réintroduction de logique métier produit dans le root store.

Ce garde-fou est exécuté par la CI intégrée.

**Conclusion Labz :** Explore et Watch sont bien deux surfaces distinctes, mais elles restent deux produits d'une **même suite technique**, pas deux projets indépendants.

---

## Persistance locale

Le mode local reste le comportement par défaut.

### Sidecar

Le sidecar Fastify :

- écoute uniquement sur `127.0.0.1` ;
- utilise SQLite ;
- exécute des migrations ;
- expose les routes d'historique, digests, duels, comparaisons, snapshots de goût, mémoire, articles et santé ;
- limite les corps à 10 MiB ;
- limite le CORS aux origines locales Vite par défaut.

C'est une bonne architecture pour conserver des historiques plus riches que ce que le `localStorage` doit porter.

### Compatibilité legacy

Le dépôt garde une frontière dédiée de migration/rehydratation du store historique `cosmic-explorer-store`.

La dette legacy est donc encapsulée plutôt qu'éparpillée directement dans le Core.

---

## Persistance cloud intégrée : infrastructure oui, workspace complet non

L'adapter HTTP remote existe et s'installe avant le montage React lorsque `VITE_CONSTELLA_PERSISTENCE_MODE=remote`.

Le contrat intégré couvre les historiques : archives d'échanges, digests, duels, comparaisons, snapshots de goût, articles, mémoire et suppression/restauration de données domaine.

Le proxy `/v1` :

- possède une allowlist route/méthode ;
- borne les corps à 2 MiB ;
- ne transfère pas cookies/bearer/headers Access au Worker interne ;
- dérive un sujet opaque SHA-256 ;
- injecte uniquement `X-Constella-Subject` au service interne ;
- retire les headers CORS/cookies provenant du backend interne.

C'est une frontière de confiance bien dessinée.

### Limite majeure

Le **workspace complet** (domaines, items et état produit navigateur) n'est pas encore synchronisé dans la base intégrée.

Cette fonction appartient à ARCH-031 / PR #49.

**À ne pas dire dans Labz aujourd'hui :** « Constella synchronise entièrement ton espace de travail dans le cloud ».

**Formulation correcte :** l'architecture de persistance cloud et les historiques sont préparés/intégrés ; la synchronisation complète du workspace est le prochain jalon bloqué en validation.

---

## Sécurité Worker

### Auth fail-closed

En production, `authorizeRequest()` :

- accepte Cloudflare Access lorsque requis ;
- peut accepter un bearer serveur configuré ;
- refuse le Worker avec `503 security_unconfigured` lorsqu'aucun mécanisme de sécurité n'est configuré.

Localhost reste explicitement exempté pour le développement.

### CORS

Les origines navigateur sont sur allowlist exacte.

Le Worker enveloppe les réponses legacy et retire leurs headers CORS permissifs avant de réappliquer la politique restreinte.

### Cloudflare Access

Le code utilise `ctx.access` / `getIdentity()` pour obtenir l'identité authentifiée lorsqu'Access protège directement le Worker, puis ne transmet qu'un sujet opaque au service D1 interne.

Cette approche correspond au modèle Workers Access actuel : le contexte Access existe sur l'invocation authentifiée directe et n'est pas propagé automatiquement via Service Bindings — ce qui justifie précisément la dérivation explicite du sujet avant l'appel au Worker interne.

### Agentic remote fetch fail-closed

Le pipeline LLM contient encore un outil `fetch_article_url` capable d'appeler une URL d'article.

La frontière publique retire cependant les propriétés `url` de tous les items avant les routes agentiques complètes. Dans l'état intégré, l'outil reçoit donc « article has no URL » et ne peut pas effectuer ce fetch arbitraire.

C'est une bonne mesure temporaire contre SSRF / fetch non borné, même si le code de l'outil historique reste présent.

---

## P1 — rate limiting applicatif insuffisant pour une vraie exposition publique

Le rate limiter actuel est volontairement stocké dans une `Map` en mémoire d'isolate Worker.

Le commentaire du code reconnaît lui-même la limite : plusieurs isolates Cloudflare peuvent traiter les requêtes, donc ce compteur ne constitue pas un quota global fiable.

Pour une beta fermée derrière Access, c'est acceptable comme première barrière.

Avant une exposition plus large, ajouter :

- Cloudflare Rate Limiting / WAF / binding approprié ;
- quotas par utilisateur/sujet ;
- éventuellement budgets spécifiques pour les routes LLM coûteuses.

---

## P1 — entrées LLM insuffisamment bornées

Le Worker valide la présence des champs de base, mais plusieurs routes publiques LLM ne bornent pas explicitement :

- nombre/longueur des `queries` sur `/api/watch` ;
- longueur de `description` sur `/api/suggest-watch` ;
- taille globale des corps `/api/*` à la frontière publique.

La persistance `/v1` a bien une limite à 2 MiB, mais les routes Watch/LLM n'utilisent pas ce même garde-fou.

Comme le rate limiter est principalement basé sur le **nombre de requêtes**, une seule requête authentifiée anormalement volumineuse peut amplifier coût, latence ou mémoire.

### Remédiation

Ajouter une validation de schéma et des bornes explicites :

- nombre de queries ;
- longueur par query ;
- nombre de sources ;
- taille des descriptions/items ;
- taille maximale du JSON entrant ;
- budgets de tokens/usage par sujet.

---

## Watch : richesse réelle et dette de cohérence réseau

Le type frontend supporte actuellement **20 sources** :

- sources historiques Worker : GDELT, Guardian, Reddit, Hacker News, Google News, RAWG, TMDB ;
- RSS custom ;
- sources publiques supplémentaires : Wikipedia, Mastodon, Bluesky, arXiv, Lobsters, Dev.to, GitHub, StackExchange, OpenAlex, PubMed, Wikinews, OpenLibrary.

### P1/P2 — 12 sources restent client-only

Le code déclare explicitement `CLIENT_ONLY_SOURCES` pour :

- Wikipedia ;
- Mastodon ;
- Bluesky ;
- arXiv ;
- Lobsters ;
- Dev.to ;
- GitHub ;
- StackExchange ;
- OpenAlex ;
- PubMed ;
- Wikinews ;
- OpenLibrary.

Même lorsqu'un Worker est configuré, ces sources sont fetchées directement depuis le navigateur puis fusionnées avec les résultats du Worker.

Le README actuel affirme plus largement que « les intégrations de sources sont servies par le Worker ». Cette formulation est donc trop générale.

### Impacts

- dépendance aux politiques CORS de chaque fournisseur ;
- IP/agent du navigateur directement visible de ces fournisseurs ;
- termes de recherche potentiellement envoyés directement depuis le poste utilisateur ;
- robustesse différente entre sources Worker et sources navigateur ;
- difficulté à appliquer quotas/cache centralisés de façon homogène.

Ce n'est pas un bloqueur pour un outil personnel, mais il faut **documenter honnêtement cette architecture**.

À terme, le Worker pourrait absorber progressivement ces fetchers si un backend homogène devient souhaitable.

---

## Watch : pipeline LLM réellement riche, mais coûteux et à garder borné

Le Worker implémente réellement :

- expansion de requêtes ;
- filtrage de pertinence ;
- digest court ;
- digest agentique multi-étapes ;
- contradictions ;
- évolution ;
- questions ouvertes ;
- recommandations ;
- mode streaming NDJSON ;
- comptage d'usage tokens ;
- prompt caching Anthropic ;
- concurrence limitée pour les thèmes.

Le code limite notamment le corpus LLM à 60 items et borne le nombre de thèmes/contradictions.

Le pipeline dégrade certaines étapes plutôt que d'échouer entièrement lorsqu'une sortie JSON n'est pas exploitable.

### Nuance

La présence d'un LLM ne garantit évidemment pas l'exactitude des synthèses. Le projet possède des mécanismes de grounding et conserve les articles sources, mais Labz doit parler d'**assistance à la synthèse / veille**, pas de vérification factuelle automatique infaillible.

---

## P2 — import de domaine peu validé côté UI

`App.tsx` accepte un fichier JSON d'import dès lors que :

- `data.domain` existe ;
- `data.items` est un tableau ;
- le produit du domaine correspond éventuellement au scope fixe.

Il n'y a pas de validation structurelle complète des items, critères, comparaisons ou valeurs numériques avant `importDomain()`.

Un fichier d'import corrompu ou fabriqué peut donc injecter un état incohérent dans le store local.

**Remédiation :** valider le format import/export par un schéma versionné avant mutation du store.

---

## P2 — timeout Watch ne retourne pas réellement les résultats partiels

Le commentaire de `fetchWatchItemsWithErrors()` explique qu'après le timeout global le système retourne les résultats partiels.

En pratique, la Promise de timeout résout avec :

- `items: []` ;
- une erreur de délai global.

Les fetches déjà lancés continuent en arrière-plan, mais les résultats accumulés par l'autre branche ne sont pas récupérés lorsque le timeout gagne le `Promise.race`.

Ce n'est pas une corruption de données, mais la formulation/commentaire et l'UX devraient être alignés : soit annuler réellement les sous-requêtes, soit conserver les résultats déjà collectés.

---

## Beta Cloudflare : workflow prêt, exploitation non réalisée

Le workflow backend :

- est manuel ;
- demande la confirmation exacte `DEPLOY-BETA` ;
- vérifie secrets/variables requis ;
- exige une origine HTTPS ;
- découvre D1 ;
- génère des configs éphémères ;
- dry-run les Workers ;
- applique les migrations ;
- déploie Worker persistance + API publique.

La CI ARCH-030 valide la **capacité de générer et dry-run** cette topologie.

En revanche, le dépôt/document de statut indique encore comme préconditions non réalisées : DNS, Access, base D1 beta, variables/secrets, premier déploiement et recette end-to-end.

**Conclusion :** architecture de déploiement validée, **beta live non prouvée**.

---

## CI bloquée après ARCH-030

La situation doit être présentée précisément :

- ARCH-030 a passé une vraie CI complète ;
- les runs suivants sur PR #49/#50 échouent avant toute étape ;
- le dernier quality gate CI-001 montre `steps: null` ;
- aucune conclusion sur la qualité du code de ces PR ne peut être tirée de ces échecs ;
- elles ne doivent pas être mergées sans run réel réussi.

La règle de pause documentée est donc saine.

---

## Dette de dépôt / identité

### Package historique

`package.json` utilise toujours :

- `name: cosmic-explorer` ;
- `version: 0.1.0`.

Cela doit être réaligné avec Constella avant une release externe.

### Fichiers générés/outillage

Le dépôt contient aussi des fichiers `__pycache__/*.pyc` sous `.claude/skills/...` ainsi qu'un volume important d'outillage de développement qui n'appartient pas au produit livré.

Ce n'est pas fonctionnellement grave, mais un nettoyage de l'hygiène Git réduirait le bruit du dépôt avant une ouverture externe.

### Licence

Aucun fichier `LICENSE` n'apparaît dans l'arbre audité.

Comme le dépôt est actuellement privé, ce n'est pas urgent. Une ouverture publique devra choisir explicitement le cadre de réutilisation.

---

## Présentation Labz recommandée

### Une seule fiche

**Nom : Constella**  
**Sous-produits : Explore + Watch**  
**Statut : prototype privé avancé · en pause avant bêta fermée**

### Ce que la fiche peut honnêtement dire

Constella :

- est une suite personnelle composée de deux surfaces Explore et Watch ;
- possède un Core partagé et des frontières produit testées ;
- produit des builds séparés Suite / Explore / Watch ;
- propose dans Explore scoring, duels, historique de goût et visualisation 3D ;
- propose dans Watch collecte multi-sources, ranking, lifecycle, journal et digests assistés par LLM ;
- possède un sidecar SQLite local ;
- possède une abstraction de persistance locale/remote ;
- possède une façade Worker sécurisée et un backend D1 pour les historiques ;
- protège les secrets fournisseurs côté Worker ;
- utilise Cloudflare Access/bearer en fail-closed selon le déploiement ;
- isole la persistance par sujet opaque ;
- possède des tests, guards d'architecture, typechecks et dry-runs cloud ;
- a validé la base ARCH-030 par une vraie CI complète ;
- est volontairement en pause avant merge de la synchronisation workspace cloud et avant première beta réelle.

### À ne pas sur-vendre

- « application publique disponible » : faux ;
- « bêta Cloudflare déployée et validée » : non prouvé ;
- « synchronisation complète du workspace dans D1 » : ARCH-031 non mergé ;
- « toutes les sources passent par le Worker » : faux, 12 sources sont client-only ;
- « comptes/SaaS opérationnels » : faux ;
- « synthèses LLM factuellement garanties » : faux ;
- « CI actuellement verte sur les travaux ouverts » : faux ; la CI ne reçoit actuellement pas de runner sur ces PR ;
- présenter Explore et Watch comme deux projets totalement indépendants : trompeur par rapport à l'architecture réelle.

---

## Plan de reprise recommandé

Conserver l'ordre déjà documenté :

1. rétablir l'exécution GitHub Actions ;
2. valider puis merger CI-001 ;
3. rebaser/réaligner ARCH-031 ;
4. obtenir un quality gate complet vert sur ARCH-031 ;
5. merger ARCH-031 ;
6. concevoir ARCH-032 pour la migration des historiques sidecar ;
7. provisionner la beta Cloudflare réelle ;
8. faire une recette end-to-end fresh browser + données locales + offline/conflit ;
9. ensuite seulement passer à une phase UX, simplification Watch et retours utilisateurs.

En parallèle/non critique :

- borner les payloads LLM ;
- prévoir un rate limit edge/global ;
- clarifier les sources client-only ;
- valider les imports JSON ;
- corriger le timeout « partiel » ;
- nettoyer l'identité npm et les fichiers générés du dépôt.

## Décision finale

**Constella reste dans Labz, mais Explore et Watch doivent être regroupés sous une seule entrée.**

La valeur du projet vient précisément de l'ensemble : deux besoins différents, un Core commun, des frontières d'architecture progressivement extraites, une persistance locale puis cloud, et une attention inhabituelle aux frontières de sécurité pour un projet personnel.

Le statut doit rester **« prototype privé avancé · en pause avant bêta »**. C'est plus crédible — et plus intéressant — que de masquer le fait que le dernier kilomètre cloud n'est pas encore franchi.

L'audit confirme aussi que la pause actuelle n'est pas un abandon dû à un code cassé : **la dernière base intégrée critique a passé son quality gate complet ; ce sont les travaux suivants qui sont volontairement retenus tant que l'environnement distant ne permet plus de les valider correctement.**