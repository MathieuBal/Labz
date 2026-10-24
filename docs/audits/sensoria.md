# Audit pré-intégration Labz — Sensoria

**Dépôt audité :** `MathieuBal/Sensoria`  
**Révision :** `7793002071fdd38e61fc52181ced4d6d94c8fb40`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · projet public et réellement testable, avec quelques remédiations qualité/accessibilité**

## Verdict

Sensoria est l'un des projets actuels de Labz dont la présentation est déjà la plus proche de l'état réel du code.

Les **22 tableaux annoncés existent bien dans le registry et sont tous marqués jouables**. Le projet possède un socle commun pour les entrées, le rendu, les réglages et le cycle de vie ; les scènes historiques en Canvas 2D cohabitent avec des scènes Three.js/WebGL2 chargées à la demande. La PWA, les icônes, le déploiement GitHub Pages et le repli en absence de WebGL2 sont réellement implémentés.

Le dernier workflow Pages du commit audité est vert. Le build de déploiement exécute `tsc --noEmit` puis `vite build`, ce qui protège au minimum la compilation TypeScript et la génération de production.

Sensoria peut donc rester présenté dans Labz comme **prototype public jouable / galerie d'expériences interactives**.

Ce qui manque avant de qualifier l'ensemble de « très fiabilisé » est surtout de transformer les bons scripts de vérification navigateur existants en garde-fous continus, puis d'effectuer un vrai contrôle sur appareils mobiles et sur le build PWA distribué.

---

## Ce qui existe réellement

### 22 tableaux jouables

Le registry contient 22 entrées `available: true` :

1. Mosaïque infinie
2. Verre liquide
3. Champ magnétique
4. Nuée
5. Toile de tissu
6. Jardin de lumière
7. Lac nocturne
8. Ferrofluide
9. Cordes
10. Cristaux
11. Portail cosmique
12. Poudre réactive
13. Méduse lumineuse
14. Bulles
15. Brise
16. Monde miniature
17. Argile vivante
18. Théâtre d'ombres
19. Équilibre suspendu
20. Papier plié
21. Encres flottantes
22. Échos du geste

Les six scènes « studio » sont chargées dynamiquement ; les autres sont disponibles immédiatement.

### Socle commun

Le code isole plusieurs responsabilités :

- `InputManager` : Pointer Events souris / stylet / multi-touch, capture du pointeur, événements coalescés et vitesse lissée ;
- `RenderLoop` : une seule boucle `requestAnimationFrame`, delta borné, pause automatique quand l'application est masquée ;
- `SceneManager` : montage, démontage, resize, update et routage des entrées ;
- `SettingsStore` : palette, réglage, mode automatique, effets réduits et persistance locale ;
- `PerformanceMonitor` : estimation FPS et facteur de qualité ;
- `Controls` / `Gallery` : navigation, aide, paramètres et catalogue.

Ce découpage justifie l'affirmation du README selon laquelle les tableaux s'appuient sur un socle réutilisable.

### Cycle de vie

Le passage d'une scène à une autre n'empile pas simplement des simulations : `SceneManager` appelle `unmount()` sur la scène précédente.

Les scènes Three.js partagent un seul `WebGLRenderer`, puis libèrent à la sortie les géométries, matériaux, textures, ombres et listes de rendu. Les handlers de perte/restauration du contexte WebGL sont également retirés.

C'est un bon point de robustesse pour une galerie où l'utilisateur ouvre plusieurs expériences successivement.

### Entrées tactiles / souris

`InputManager` utilise Pointer Events au lieu de chemins séparés souris/tactile. Les événements coalescés sont exploités lorsqu'ils existent afin de conserver un tracé continu pendant les gestes rapides.

Le Canvas bloque volontairement les gestes natifs du navigateur pendant l'interaction afin que glisser, dessiner ou manipuler une matière reste dédié à la scène.

### Performance adaptative

Le projet possède bien un `PerformanceMonitor` qui fait évoluer un facteur de qualité entre 0,4 et 1 selon le FPS lissé.

Les scènes Three.js l'utilisent réellement : toutes les 1,5 seconde environ, `StudioScene` ajuste le pixel ratio du renderer, et les effets réduits désactivent notamment les ombres et limitent davantage la résolution.

Certaines scènes Canvas l'utilisent aussi, mais pas nécessairement de façon continue. Par exemple, `MagneticScene` dimensionne le nombre de grains selon la qualité **lors de la reconstruction de la grille** ; une baisse du facteur de qualité pendant une scène déjà ouverte ne reconstruit pas immédiatement cette grille.

**Formulation Labz conseillée :** le socle permet une dégradation de qualité et plusieurs scènes l'exploitent, plutôt que prétendre que les 22 scènes adaptent continuellement tous leurs coûts de rendu.

### PWA / hors ligne

`vite-plugin-pwa` est configuré avec :

- mise à jour automatique ;
- manifest ;
- icônes 192 / 512 / maskable ;
- plein écran ;
- précache des assets de build ;
- cache runtime des Google Fonts.

La promesse « installable / utilisable hors ligne après première visite » est donc techniquement cohérente avec le code.

Les polices distantes restent une dépendance au premier chargement ; des fallbacks système sont définis et Workbox les met en cache ensuite.

---

## Validation existante

### Build de production

La GitHub Action Pages :

1. installe avec `npm ci` ;
2. exécute `npm run build` ;
3. publie `dist/`.

`npm run build` exécute `tsc --noEmit && vite build`.

Le dernier workflow sur la révision auditée s'est terminé avec succès.

### Tests navigateur « studio »

`scripts/verify-studio.mjs` est un vrai script Playwright, pas une simple checklist. Il :

- vérifie la présence des 22 cartes ;
- ouvre les six scènes studio en desktop et format mobile ;
- simule des gestes souris et tactiles ;
- manipule réglages, palettes, effets réduits, aide et reset ;
- parcourt également les seize scènes historiques ;
- effectue des assertions d'état sur Argile, Papier, Équilibre et Échos ;
- vérifie qu'aucune erreur JS/console inattendue n'est produite ;
- vérifie le repli sans WebGL2 et la possibilité de continuer à utiliser une scène Canvas.

### Tests navigateur « rework »

`verify-rework.mjs` contrôle plus spécifiquement Ferrofluide, Cordes, Brise et Équilibre après les retours utilisateurs :

- bureau + mobile émulé ;
- gestes ;
- signal audio non silencieux ;
- fermeture effective du contexte audio à la sortie ;
- attraction / retour du ferrofluide ;
- manipulation directe de l'équilibre ;
- borne et expiration des particules de Brise ;
- amortissement des cordes ;
- absence de démarrage audio sans consentement.

Ces scripts constituent une base de test remarquable pour un projet artistique interactif.

---

## Principal écart qualité : les tests navigateur ne sont pas dans la CI

Le workflow GitHub Pages ne lance **ni `test:studio` ni `test:rework`**. Un commit peut donc être déployé alors qu'une interaction ou une scène régresse, tant que TypeScript compile et que Vite construit le site.

De plus, les scripts Playwright démarrent le **serveur Vite de développement**, pas `vite preview` sur le `dist/` de production. Ils ne valident donc pas directement :

- le bundle publié ;
- le service worker ;
- le precache PWA ;
- l'installation ;
- le comportement réellement hors ligne.

### Remédiation recommandée

Créer un workflow qualité séparé ou enrichir le workflow actuel :

1. `npm ci` ;
2. `npm run build` ;
3. test smoke Playwright sur `vite preview` ;
4. au minimum un sous-ensemble rapide des scènes desktop/mobile ;
5. garder les captures / tests lourds complets déclenchables manuellement si leur coût CI est trop élevé.

Un smoke test PWA doit vérifier le chargement après passage hors ligne une fois les assets mis en cache.

---

## Accessibilité

### Points positifs

- cartes de galerie réellement rendues comme boutons ;
- boutons et groupes de réglages sémantiques ;
- focus visible ;
- aide dans un vrai `<dialog>` ;
- titre et description associés au dialogue ;
- statut de scène en `aria-live` ;
- boutons navigation / réglages / aide avec `aria-label` ;
- `prefers-reduced-motion` pris en compte dans `SettingsStore` au premier lancement ;
- CSS global qui réduit également les animations et transitions lorsque l'OS demande moins de mouvement ;
- option manuelle « Effets réduits » persistée localement ;
- son désactivé par défaut dans les scènes musicales et démarré après action explicite.

### P1 — zoom utilisateur interdit

Le viewport contient :

`maximum-scale=1.0, user-scalable=no`.

Cela empêche le pinch-to-zoom du navigateur, ce qui est une restriction d'accessibilité inutile pour la galerie, les aides et les réglages.

**Correction :** retirer `maximum-scale=1.0` et `user-scalable=no`. Le Canvas peut conserver ses propres contraintes gestuelles via `touch-action` / Pointer Events lorsqu'une scène est active.

### P2 — expériences essentiellement pointeur/tactile

Les contrôles de navigation sont accessibles au clavier, mais le contenu artistique principal repose naturellement sur le geste dans un Canvas et ne possède pas d'alternative clavier équivalente.

Ce n'est pas une anomalie cachée : c'est une limite inhérente au concept. Labz peut présenter Sensoria comme expérience visuelle / gestuelle et éviter une revendication d'accessibilité universelle.

### P2 — écoute dynamique de `prefers-reduced-motion`

La préférence OS n'est utilisée qu'à la création du `SettingsStore` lorsqu'aucun réglage utilisateur n'existe. Un changement du réglage système pendant que l'application est déjà ouverte ne modifie pas automatiquement `reducedEffects`.

Le CSS réagit cependant dynamiquement au media query pour ses propres animations.

---

## PWA / réseau : amélioration optionnelle

Les Google Fonts sont chargées depuis Google puis mises en cache par Workbox. Cela fonctionne, mais des polices auto-hébergées apporteraient :

- un premier lancement réellement indépendant de Google ;
- une meilleure cohérence hors ligne ;
- moins de requêtes tierces ;
- une politique de confidentialité plus simple.

Ce n'est pas un bloqueur Labz.

---

## Petites dettes de code

### Listener `contextmenu`

`InputManager.attach()` ajoute un listener `contextmenu` via une fonction anonyme, alors que `dispose()` ne peut pas le retirer.

L'instance `InputManager` vit pendant toute la vie de l'application, donc cela ne provoque pas d'accumulation dans l'architecture actuelle. C'est simplement une asymétrie de cycle de vie à corriger si ce composant devient réellement recréable.

### Validation des réglages persistés

`SettingsStore.load()` caste directement le JSON de `localStorage` en `Partial<SceneSettings>`. Les scènes bornent généralement leurs indexes, ce qui limite le risque, mais une validation légère du schéma rendrait la persistance plus robuste en cas de données anciennes/corrompues.

### Métadonnées du dépôt

GitHub Pages est actif, mais le champ `homepage` du dépôt est vide. Ajouter l'URL publique au dépôt améliorerait la découvrabilité.

---

## Licence

GitHub ne détecte aucune licence et aucun fichier de licence n'apparaît dans l'arbre audité.

Le dépôt public peut parfaitement rester visible sans accorder de droit de réutilisation, mais si Sensoria est présenté comme un projet que d'autres peuvent étudier, reprendre ou contribuer, une licence explicite est recommandée.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que Sensoria :

- est une galerie publique de **22 tableaux interactifs jouables** ;
- utilise un socle commun TypeScript pour les entrées, le cycle de vie et les réglages ;
- combine Canvas 2D et Three.js/WebGL2 ;
- est pensée pour souris, stylet et tactile via Pointer Events ;
- propose plusieurs palettes / réglages par scène ;
- prend en compte les effets réduits ;
- réutilise un seul contexte WebGL pour les scènes 3D et libère leurs ressources à la sortie ;
- possède une PWA installable et un service worker ;
- possède des scripts Playwright de vérification desktop/mobile émulé ;
- possède un repli lorsque WebGL2 n'est pas disponible ;
- a fait l'objet de modifications explicites après des retours utilisateurs sur certaines scènes.

La fiche doit continuer à préciser que les simulations sont **artistiques / interactives**, pas des modèles physiques de mesure.

## Ce qu'il vaut mieux ne pas sur-vendre

- « testé automatiquement à chaque déploiement » : faux actuellement ; seuls build/typecheck sont imposés par la CI ;
- « testé sur mobile réel » : le README reconnaît lui-même que les tests mobiles actuels sont simulés ;
- « totalement hors ligne dès le premier lancement » : le premier chargement des polices dépend du réseau ;
- « optimisation dynamique uniforme des 22 scènes » : le niveau d'utilisation du facteur de qualité dépend de la scène ;
- « accessible à tous les modes d'entrée » : les expériences restent fondamentalement gestuelles.

---

## Plan de remédiation court

1. Ajouter un smoke Playwright au workflow CI avant déploiement.
2. Faire tourner ce smoke sur le build `dist/`, pas uniquement le serveur de développement.
3. Ajouter un test PWA/offline minimal.
4. Retirer l'interdiction de zoom du viewport.
5. Faire au moins une recette réelle iPhone + Android sur quelques scènes lourdes et quelques scènes Canvas.
6. Ajouter l'URL Pages dans les métadonnées / README.
7. Choisir une licence si la réutilisation du code doit être autorisée.
8. Optionnel : auto-héberger les polices.

## Décision finale

**Sensoria reste dans Labz et peut conserver un statut public/testable.**

Contrairement à plusieurs projets audités auparavant, aucune incohérence centrale ne remet en cause sa promesse principale. Le catalogue existe réellement, la navigation et le cycle de vie sont structurés, la version courante construit et se déploie, et les tests navigateur existants donnent déjà une bonne base de confiance.

La prochaine amélioration n'est donc pas une réécriture du produit mais une **élévation du niveau de preuve** : faire de ces validations navigateur une partie de la livraison, tester le vrai build/PWA et corriger le zoom/accessibilité avant de considérer la fiche Labz comme complètement verrouillée.