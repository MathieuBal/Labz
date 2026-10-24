# Audit pré-intégration Labz — Lootchest

**Dépôt audité :** `MathieuBal/Lootchest`  
**Révision :** `3081ac328bdb162bd5d6ef97a1608a8843b76353`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · projet public/testable riche, mais moins fiabilisé que les meilleurs dépôts du portfolio**

## Verdict

`Lootchest` mérite de rester dans Labz.

Le jeu réel est largement plus riche qu'un simple prototype de coffre : combat, progression d'étages, biomes, boss, affixes, plongée roguelite, village idle, forge, inventaire, loot procédural, talents, factions, prestige, reliques, contrats, histoire, mascotte et cinématiques sont réellement représentés dans le code.

Le dépôt est également intéressant parce qu'il montre jusqu'où un jeu relativement vaste peut être construit en **vanilla JavaScript, HTML et CSS sans chaîne de build**.

En revanche, il ne faut pas le présenter avec le même niveau de confiance technique que `million-de-pixels` ou les projets disposant d'une CI de qualité : **aucune suite de tests automatisés n'est versionnée et le déploiement Pages publie directement le contenu statique sans gate fonctionnelle**.

La fiche Labz peut donc rester en statut **public / testable**, en parlant de jeu navigateur riche et expérimental, pas de produit durci.

---

## Ce qui existe réellement

### Boucle RPG / looter

Le README décrit la boucle :

`Donjon → clés/or → coffres → équipement → donjon plus profond`.

Le code contient effectivement les modules correspondants :

- `combat.js` / `combatTurn.js` ;
- `chest.js` ;
- `loot.js` ;
- `inventory.js` ;
- `character.js` ;
- `forge.js` ;
- `skills.js` / `talents.js` ;
- `prestige.js` / `relics.js`.

Le jeu est donc bien un RPG-looter et pas seulement une maquette d'interface.

### Combat et progression

Le dépôt sépare génération de monstres, résolution de combat, combat au tour par tour, compétences actives, affinités, boss/biomes, affixes, difficulté et progression d'étage.

La Plongée possède son propre module (`dive.js`) et correspond bien à une boucle roguelite distincte du donjon standard.

### Village / idle

Le village est une vraie couche de gestion : bâtiments, mairie et paliers, ouvriers limités, production bois/pierre/métal/clés/orbes/essence, constructions temporisées, bonus croisés et forge de craft.

`accruePassive()` calcule la production selon le temps réel écoulé et applique une borne `OFFLINE_CAP_MIN = 480`, soit **8 heures**.

Les clés et les orbes conservent des buffers fractionnaires afin que les producteurs lents ne perdent pas leurs fractions entre deux appels.

La fonction est appelée au chargement puis toutes les cinq secondes via la boucle de `main.js`. Si le navigateur bride le timer en arrière-plan, le prochain appel récupère le temps réellement écoulé depuis `lastTick`.

Cette conception évite le défaut de cycle idle trouvé dans `afk-farm` et `million-de-pixels` : **le simple retour d'arrière-plan est naturellement rattrapé par le calcul temporel**, dans la limite des 8 h.

### Visuel / assets

Le dépôt embarque une quantité importante d'assets : monstres, boss, coffres, mimics, orbes, trésors, mascotte, bâtiments de village et scènes cinématiques multi-couches.

L'équipement reste en grande partie généré procéduralement dans le code (`partsHD.js`, sprites/composition), ce qui est une vraie spécificité technique du projet.

Le système de sprites prévoit aussi des fallbacks procéduraux / SVG / emoji lorsque certains PNG manquent.

---

## Architecture

Pour un projet sans framework ni bundler, la séparation en modules est respectable.

Le dépôt répartit les responsabilités entre plusieurs dizaines de fichiers ES modules : état/persistance, données, combat, loot, forge, village, UI, mascotte, audio, effets, cinématiques et progression.

`main.js` sert de bootstrap et d'orchestrateur d'interactions tandis que la logique métier est distribuée dans des modules dédiés.

Ce n'est pas une architecture légère : `ui.js` dépasse 140 Ko, `data.js` 60 Ko, `main.js` 55 Ko et plusieurs modules de rendu / combat dépassent largement 30 Ko. Le coût de régression augmente donc rapidement en l'absence de tests.

---

## Persistance

### Points positifs

Le jeu possède :

- autosave `localStorage` debounced ;
- export JSON ;
- import JSON ;
- migrations séquentielles ;
- conservation des références de l'objet `state` lors du remplacement ;
- réparation de nombreux champs manquants pour les anciennes sauvegardes.

Le save courant est déclaré en version 5 et le dépôt contient les migrations 1→2→3→4→5.

### P1 — version initiale incohérente

`save.js` déclare `CURRENT_SAVE_VERSION = 5`, mais l'état initial dans `state.js` contient encore `version: 4`.

Une nouvelle partie est donc enregistrée comme v4 puis migrée en v5 au prochain chargement/import.

La migration 4→5 actuelle ne touche que les noms générés d'objets, donc l'impact est limité aujourd'hui. Mais cette incohérence peut devenir dangereuse lors d'une future migration plus structurante.

**Correction :** centraliser la version de save et initialiser immédiatement tout état neuf avec la version courante.

### P1 — import sans validation de schéma

`importSave()` fait essentiellement :

1. `JSON.parse()` ;
2. migrations ;
3. `replaceState(data)`.

`replaceState()` ajoute de nombreux champs manquants, mais ne valide pas réellement les types, bornes numériques, structure des items, tableaux, valeurs d'énumération ni cohérence des sous-objets.

Un fichier JSON malformé peut donc être accepté puis casser le jeu plus loin.

### P1 — compatibilité future dangereuse

Si une sauvegarde porte déjà un numéro **supérieur** à `CURRENT_SAVE_VERSION`, `migrateSave()` ne la rejette pas : la boucle de migration n'est pas exécutée puis `data.version` est forcé à la version courante.

Une sauvegarde future v6 ouverte dans un ancien client v5 peut donc être présentée comme v5 sans conversion fiable.

**Correction :** refuser explicitement les saves dont `version > CURRENT_SAVE_VERSION` avec un message « sauvegarde créée par une version plus récente ».

### P1 — « Reset complet » incomplet

L'interface appelle `clearLocal()` puis `resetState()` sous le libellé **« Reset complet »**.

Or `resetState()` ne réinitialise notamment pas :

- `state.dive` ;
- `state.settings`.

Le record/compteur de plongées et plusieurs préférences peuvent donc survivre dans l'objet vivant après ce reset, jusqu'à un éventuel rechargement complet qui repartira de l'état module par défaut puisque le `localStorage` a été effacé.

C'est une incohérence visible : le résultat du reset dépend du fait que l'utilisateur recharge ou non la page ensuite.

**Correction :** reconstruire l'état complet depuis une factory `createDefaultState()` unique, puis persister/rafraîchir explicitement.

---

## P0/P1 sécurité locale — import JSON + `innerHTML`

Le jeu n'a pas de backend ni de comptes : sa surface de sécurité est donc faible. Mais le **partage de sauvegardes JSON** crée un vrai chemin d'entrée.

L'UI construit de nombreux fragments avec `innerHTML` et injecte directement des propriétés issues des items :

- `item.name` ;
- `item.flavor` ;
- labels de sources / affixes ;
- certains identifiants / attributs.

Dans une partie normale, ces valeurs viennent des constantes internes et sont de confiance.

Mais `importSave()` accepte un JSON externe sans validation ni assainissement. Un fichier de sauvegarde volontairement forgé peut donc placer du HTML dans un nom ou un libellé, qui sera ensuite réinjecté dans le DOM.

**Impact :** XSS locale / stockée via fichier de sauvegarde importé. Elle peut exécuter du JavaScript dans l'origine GitHub Pages, lire la sauvegarde `localStorage`, modifier l'état ou effectuer des requêtes réseau depuis le navigateur du joueur.

Ce n'est pas une exposition comparable à un formulaire public distant : l'utilisateur doit importer un fichier. Mais dès lors que l'export/import est présenté comme fonctionnalité de backup/partage, le fichier doit être considéré comme non fiable.

**Correction recommandée :**

- valider strictement la structure d'une save avant import ;
- reconstruire les objets connus à partir d'identifiants autorisés ;
- utiliser `textContent` pour toute chaîne pouvant provenir du fichier ;
- à défaut, échapper systématiquement les chaînes avant interpolation HTML.

---

## Principal écart qualité — aucun test automatisé versionné

L'arbre audité ne contient ni dossier `tests/`, ni `package.json`, ni framework de test.

`assets/README.md` mentionne un « test runtime » effectué lors d'une vérification des sprites, mais ce test n'est pas présent comme garde-fou reproductible dans le dépôt actuel.

Pour un jeu comportant autant de systèmes interconnectés, c'est la dette la plus importante.

### Risques

Une modification peut casser sans signal automatique :

- une migration de save ;
- un calcul de combat ;
- le pity ;
- un upgrade ;
- un bâtiment ;
- l'économie ;
- l'import/export ;
- un parcours tactile ;
- une dépendance entre modules.

L'historique montre que des bugs de logique ont déjà été découverts et corrigés par simulations ponctuelles — par exemple le Mimic contournable lors d'ouvertures multiples. Cette démarche de vérification est utile, mais ses preuves ne restent pas exécutables dans le dépôt.

### Remédiation minimale

Il n'est pas nécessaire de convertir immédiatement le jeu vers un framework ou TypeScript.

Un socle léger suffirait :

1. ajouter `package.json` uniquement pour les outils de qualité ;
2. utiliser Vitest ou le Node test runner pour les modules purs ;
3. ajouter Playwright pour un smoke navigateur ;
4. exécuter ces tests dans GitHub Actions ;
5. protéger au minimum sauvegarde, combat, loot, village et un parcours mobile.

---

## Déploiement

GitHub Pages est bien actif via le workflow dynamique géré par GitHub. Le dépôt possède **53 runs Pages** et le run correspondant à la révision auditée s'est terminé avec succès le 16 juin 2026.

Il n'existe cependant aucun workflow de qualité versionné dans le dépôt : Pages publie directement le contenu statique de la branche configurée.

La réussite du déploiement prouve donc que GitHub a publié les fichiers, **pas que le jeu a passé des tests**.

**Formulation Labz conseillée :** « jeu navigateur public/testable, déployé sur GitHub Pages », pas « version validée par CI ».

---

## Mobile / accessibilité

### Points positifs

Le README et le code montrent une attention réelle au mobile :

- safe areas ;
- interactions tactiles ;
- bottom sheet pour remplacer les raccourcis clavier ;
- plusieurs breakpoints ;
- boutons adaptés au tactile ;
- option de réduction de particules ;
- plusieurs animations coupées via `prefers-reduced-motion`.

### P1 — zoom navigateur désactivé

`index.html` impose `maximum-scale=1.0, user-scalable=no`.

Cela empêche l'utilisateur de zoomer l'interface au niveau navigateur.

**Correction :** retirer ces deux valeurs et garder la maîtrise des gestes uniquement sur les zones de jeu concernées.

### P1 — préférence OS de mouvement volontairement ignorée sur la carte du village

Une partie du CSS prend correctement en compte `prefers-reduced-motion`, notamment les anciennes animations village et la cinématique.

Mais la nouvelle carte illustrée contient un commentaire explicite disant que ses effets ne sont **pas** coupés par `prefers-reduced-motion`, car ils sont pilotés uniquement par l'option interne « Particules réduites ».

Cela va à l'encontre de l'attente standard : une préférence d'accessibilité système devrait être respectée automatiquement, même si le jeu propose en plus son propre réglage.

**Correction :** faire de `prefers-reduced-motion` un minimum obligatoire et laisser le réglage interne réduire davantage les effets si nécessaire.

---

## Assets / poids du dépôt

Le dépôt dépasse 100 Mo et contient de nombreux assets HD ainsi que plusieurs couches cinématiques lourdes.

### P1 — duplication exacte du dossier cinématique

L'arbre contient à la fois :

- `assets/cinematic/` ;
- `cinematic/` à la racine.

Les deux entrées pointent vers **le même tree SHA**, donc contiennent les mêmes fichiers.

Le code actuel (`js/cinematicScenes.js` et le script standalone) charge les PNG via `assets/cinematic/...`.

La copie racine paraît donc redondante et représente plusieurs dizaines de Mo de fichiers dupliqués dans l'arbre de travail / l'historique.

**Correction :** vérifier qu'aucun outil externe n'utilise le dossier racine puis supprimer cette copie et les scripts standalone historiques s'ils ne servent plus.

### Provenance / droits

Les assets possèdent une documentation technique de nommage et de fallback, mais l'audit n'a pas trouvé de licence globale ni de notice générale sur leur provenance/droits.

Cela ne prouve aucun problème de droits ; la provenance doit simplement être documentée avant de présenter les illustrations comme réutilisables.

---

## Documentation à réaligner

Le README a dérivé par rapport au code actuel :

- il annonce encore « migrations v1 → v2 → v3 », alors que le code est en v5 ;
- la structure technique décrit encore plusieurs éléments d'une version précédente ;
- `index.html` est désormais un shell minimal rendu entièrement par `ui.js` ;
- l'option « ouvrir directement `index.html` » n'est pas fiable selon les politiques `file://` des navigateurs avec les modules ES ; le petit serveur HTTP doit être présenté comme méthode normale.

Cette dette documentaire n'empêche pas le jeu de fonctionner, mais une fiche Labz doit s'appuyer sur le code courant et non recopier le README sans contrôle.

---

## Licence

GitHub ne détecte aucune licence et aucun fichier `LICENSE` n'apparaît dans l'arbre.

Si la réutilisation du code ou des assets doit être autorisée, choisir une licence explicite et séparer si nécessaire les droits du code de ceux des illustrations.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que `Lootchest` :

- est un RPG-looter navigateur en vanilla JavaScript ;
- possède une boucle donjon → clés/coffres → équipement → progression ;
- contient cinq biomes et un endgame Néant ;
- possède boss, élites et affixes ;
- possède une Plongée roguelite avec butin sécurisé / à risque ;
- possède un village idle avec ouvriers, bâtiments, ressources et production hors-ligne plafonnée à 8 h ;
- possède forge, loot procédural, factions, éléments, sets, uniques, talents et prestige ;
- propose une interface pensée pour tactile/mobile ;
- sauvegarde localement et permet export/import JSON ;
- possède une chaîne de migrations de sauvegarde ;
- combine sprites PNG et génération procédurale d'équipements ;
- est public et déployé sur GitHub Pages ;
- possède un système de fallback procédural lorsque certains sprites externes sont absents.

## À ne pas sur-vendre

- « testé automatiquement » : faux actuellement ;
- « CI/CD fiabilisée » : faux : seul le déploiement Pages est automatique ;
- « sauvegardes robustement validées » : faux, l'import manque de validation de schéma ;
- « import de save sûr quelle que soit sa provenance » : faux actuellement ;
- « reset complet » : le comportement actuel ne remet pas réellement tous les champs à zéro sans reload ;
- « accessibilité mobile complète » : le zoom navigateur est bloqué et une partie des animations ignore le réglage OS de réduction de mouvement ;
- « architecture légère » : le projet a fortement grossi et plusieurs modules sont très volumineux ;
- « assets librement réutilisables » : aucun cadre de licence/provenance global n'est documenté.

---

## Plan de remédiation

1. Corriger `state.version` pour qu'il corresponde à la version de save courante.
2. Rejeter explicitement les sauvegardes créées par une version future.
3. Ajouter une validation stricte des saves importées et chargées.
4. Éliminer le risque XSS des données importées (`textContent` / échappement + reconstruction d'objets connus).
5. Corriger `resetState()` avec une factory d'état par défaut unique.
6. Ajouter des tests unitaires sur sauvegarde/migration, combat, loot et village.
7. Ajouter un smoke Playwright du parcours : nouveau joueur → coffre → équipement → combat → save/reload.
8. Ajouter une GitHub Action de qualité séparée du simple déploiement Pages.
9. Retirer l'interdiction de zoom navigateur et respecter `prefers-reduced-motion` sur la carte du village.
10. Supprimer la duplication du dossier cinématique après vérification.
11. Documenter provenance/licence des assets et choisir une licence pour le code si nécessaire.
12. Faire une recette réelle desktop + mobile sur la version Pages actuelle.
13. À moyen terme, découper certains gros modules si le développement reprend.

## Décision finale

**`Lootchest` reste dans Labz avec un statut public/testable.**

Sa force est sa **profondeur de conception et son volume de systèmes jouables**, beaucoup plus que sa discipline de livraison. Il constitue un bon contrepoint à `million-de-pixels` : moins industrialisé techniquement, mais très riche en design de jeu, progression, loot et contenu.

Si le projet reprend, la priorité ne devrait pas être d'ajouter encore des systèmes. Elle devrait être de **stabiliser ce qui existe déjà** : sauvegardes, import, reset, sécurité locale et tests automatiques avant publication.