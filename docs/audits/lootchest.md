# Audit pré-intégration Labz — Lootchest

**Dépôt audité :** `MathieuBal/Lootchest`  
**Révision :** `3081ac328bdb162bd5d6ef97a1608a8843b76353`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · projet public/testable riche, mais moins fiabilisé que les meilleurs dépôts du portfolio**

## Verdict

`Lootchest` mérite de rester dans Labz.

Le jeu réel est largement plus riche qu'un simple prototype de coffre : combat, progression d'étages, biomes, boss, affixes, plongée roguelite, village idle, forge, inventaire, loot procédural, talents, factions, prestige, reliques, contrats, histoire, mascotte et cinématiques sont réellement représentés dans le code.

Le dépôt est également intéressant parce qu'il montre jusqu'où un jeu relativement vaste peut être construit en **vanilla JavaScript, HTML et CSS sans chaîne de build**.

En revanche, il ne faut pas le présenter avec le même niveau de confiance technique que `million-de-pixels` ou les projets disposant d'une CI robuste : **aucune suite de tests versionnée ni workflow GitHub Actions n'apparaît dans l'arbre audité**. GitHub Pages est activé, mais le dépôt ne possède pas de garde-fou automatique avant publication.

La fiche Labz peut donc rester en statut **public / testable**, en parlant de jeu navigateur riche et expérimental, pas de produit durci.

---

## Ce qui existe réellement

### Boucle RPG / looter

Le README décrit une boucle :

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

La promesse du README sur une production passive plafonnée à 8 h est donc cohérente avec le code.

### Visuel / assets

Le dépôt embarque une quantité importante d'assets : monstres, boss, coffres, mimics, orbes, trésors, mascotte, bâtiments de village et scènes cinématiques multi-couches.

L'équipement reste en grande partie généré procéduralement dans le code (`partsHD.js`, sprites/composition), ce qui est une vraie spécificité technique du projet.

Le système de sprites prévoit aussi des fallbacks procéduraux / SVG / emoji lorsque certains PNG manquent.

---

## Architecture

Pour un projet sans framework ni bundler, la séparation en modules est respectable.

Le dépôt répartit les responsabilités entre plusieurs dizaines de fichiers ES modules : état/persistance, données, combat, loot, forge, village, UI, mascotte, audio, effets, cinématiques et progression.

`main.js` sert principalement de bootstrap et d'orchestrateur d'interactions tandis que la logique métier est distribuée dans des modules dédiés.

Ce n'est pas une architecture parfaite : `ui.js`, `main.js`, `data.js`, `parts.js` et plusieurs modules sont devenus très volumineux. Mais le projet n'est pas un monolithe unique.

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

Le save courant est déclaré en version 5 et le dépôt documente des migrations 1→2→3→4→5.

### P1 — version initiale incohérente

`save.js` déclare `CURRENT_SAVE_VERSION = 5`, mais l'état initial dans `state.js` contient encore `version: 4`.

Une nouvelle partie peut donc être enregistrée comme v4 puis migrée en v5 au prochain chargement/import.

La migration 4→5 actuelle ne touche que les noms générés d'objets, donc l'impact est limité aujourd'hui. Mais cette incohérence peut devenir dangereuse lors d'une future migration plus structurante.

**Correction :** initialiser directement l'état courant avec la version de save actuelle ou centraliser la constante.

### P1 — import sans validation de schéma

`importSave()` fait essentiellement :

1. `JSON.parse()` ;
2. migrations ;
3. `replaceState(data)`.

`replaceState()` ajoute de nombreux champs manquants, mais ne valide pas réellement les types, bornes numériques, structure des items, tableaux, valeurs d'énumération ni cohérence des sous-objets.

Un fichier JSON malformé peut donc être accepté puis casser le jeu plus loin.

**Correction recommandée :** ajouter un validateur de save central avec valeurs par défaut et rejet explicite des structures invalides avant de remplacer l'état courant.

---

## Principal écart qualité — aucun test automatisé versionné

L'arbre audité ne contient ni dossier `tests/`, ni `package.json`, ni framework de test, ni workflow GitHub Actions.

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

L'historique montre d'ailleurs que des bugs de logique ont été découverts et corrigés par simulations ponctuelles — par exemple le Mimic qui pouvait être contourné lors des ouvertures multiples. Cela montre une vraie démarche de vérification, mais ces simulations ne sont pas conservées comme tests reproductibles dans le dépôt.

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

GitHub indique que Pages est activé sur le dépôt.

Cependant, aucun workflow de déploiement n'apparaît dans l'arbre. L'audit ne possède donc pas de preuve automatisée équivalente à Sensoria ou `million-de-pixels` permettant de dire « cette révision a passé build/tests avant publication ».

Le projet étant statique, l'absence de build n'est pas un problème en soi. Le problème est l'absence de **validation**.

**Formulation Labz conseillée :** « jeu navigateur public/testable », pas « version déployée validée par CI ».

---

## Mobile / accessibilité

### Points positifs

Le README et le code montrent une attention réelle au mobile :

- safe areas ;
- interactions tactiles ;
- bottom sheet pour remplacer les raccourcis clavier ;
- plusieurs breakpoints ;
- boutons adaptés au tactile ;
- option de réduction de particules.

### P2 — zoom navigateur désactivé

`index.html` impose `maximum-scale=1.0, user-scalable=no`.

Cela empêche l'utilisateur de zoomer l'interface au niveau navigateur.

**Correction :** retirer ces deux valeurs et garder la maîtrise des gestes uniquement sur les zones de jeu concernées.

---

## Assets / poids du dépôt

Le dépôt fait plus de 100 Mo et contient de nombreux assets HD ainsi que plusieurs couches cinématiques très lourdes.

Ce n'est pas une incohérence fonctionnelle, mais cela augmente :

- le poids du clone ;
- le coût de l'historique Git ;
- le volume transféré au chargement si le préchargement n'est pas maîtrisé.

Les assets possèdent une documentation technique de nommage et de fallback, mais l'audit n'a pas trouvé de licence globale du dépôt ni de notice générale sur la provenance/droits des illustrations.

**Avant une présentation de réutilisation ou de contribution ouverte**, documenter leur provenance et les conditions de réutilisation. Pour une simple démo portfolio, il suffit de rester transparent sur la nature des assets.

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
- est public et GitHub Pages est activé.

## À ne pas sur-vendre

- « testé automatiquement » : faux actuellement ;
- « CI/CD fiabilisée » : faux ;
- « sauvegardes robustement validées » : faux, l'import manque de validation de schéma ;
- « accessibilité mobile complète » : le zoom navigateur est bloqué ;
- « architecture légère » : le projet a fortement grossi et plusieurs modules sont très volumineux ;
- « assets librement réutilisables » : aucun cadre de licence/provenance global n'est documenté.

---

## Plan de remédiation court

1. Corriger `state.version` pour qu'il corresponde à la version de save courante.
2. Ajouter une validation réelle des saves importées et chargées.
3. Ajouter un petit socle de tests unitaires sur les fonctions métier pures.
4. Ajouter un smoke Playwright du parcours : nouveau joueur → coffre → équipement → combat → save/reload.
5. Ajouter une CI GitHub Actions qui lance ces tests.
6. Retirer l'interdiction de zoom navigateur.
7. Documenter provenance/licence des assets et choisir une licence pour le code si nécessaire.
8. Faire une recette réelle desktop + mobile sur la version Pages actuelle.
9. À moyen terme, découper certains gros modules si le développement reprend.

## Décision finale

**`Lootchest` reste dans Labz avec un statut public/testable.**

Sa force est sa **profondeur de conception et son volume de systèmes jouables**, beaucoup plus que sa discipline de livraison. Il constitue un bon contrepoint à `million-de-pixels` : moins industrialisé techniquement, mais très riche en design de jeu, progression, loot et contenu.

Si le projet reprend, la priorité ne devrait pas être d'ajouter encore des systèmes. Elle devrait être de **stabiliser ce qui existe déjà** avec validation de save, smoke navigateur et tests des règles économiques/combat essentielles.