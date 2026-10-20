# Labz — Mathieu / Labs

Un point d’entrée pour découvrir les jeux, expériences et outils de Mathieu. Version 0.4 inspirée des maquettes validées : interface sombre, accents citron, titres éditoriaux et navigation mobile dédiée.

## Déjà développé

- Accueil avec Sensoria, Million de pixels et Lootchest mis en avant.
- Catalogue éditorial de 8 projets, catégories et recherche insensible aux accents.
- Fiches individuelles, liens partageables par fragment et liens externes des trois projets mis en avant.
- Mobile : navigation basse avec safe-area iPhone, rail horizontal de projets, fiches pleine largeur, formulaire en panneau inférieur.
- Favoris locaux, huit derniers projets lancés, filtres combinables « à essayer maintenant » / catégorie / favoris et tri par nom.
- Bouton de découverte aléatoire parmi les projets lançables et partage natif lorsqu’il est disponible.
- Retours : sauvegarde automatique des brouillons locaux, export texte et passage optionnel vers un formulaire GitHub prérempli. **Aucune publication automatique** : le visiteur est informé du caractère public et doit valider lui-même sur GitHub avec son compte. Les longs textes restent exportables sans troncature.
- Accessibilité de base : HTML sémantique, focus visible, lien d’évitement, dialog natif avec Escape et retour du focus, réduction des mouvements.
- Illustrations SVG originales provisoires, pas de captures des applications.
- Nouveautés GitHub en lecture publique pour les quatre dépôts explicitement autorisés : versions publiées (préversions identifiées), ou activité du code en leur absence. Cache mémoire de 15 minutes, délai maximal de 12 secondes et interruption lors d’un changement de page. Aucun token ni découverte de dépôts privés.

Les accroches reprennent les descriptions README examinées. Les projets privés ne sont pas automatiquement rendus publics, et aucun lien vers leur code n’est publié. Les fiches sans version publique validée restent des présentations. Les expériences lançables et les présentations sont regroupées séparément. Les anciennes adresses des 17 projets retirés expliquent le changement et renvoient à la sélection. Voir [les décisions éditoriales](docs/selection.md).

## Développement

Node 22 ou plus récent. Aucune dépendance npm à installer.

```sh
npm run check
npm run build
npm start
```

Puis ouvrir http://127.0.0.1:4173. Les commandes sont à lancer à la racine du dépôt.

Le site statique se trouve dans `dist/`. Les chemins relatifs et le routage `#/projet/...` permettent un hébergement sous `/Labz/`. Les pages projet s’ouvrent dans un nouvel onglet pour conserver le point de départ et l’origine de leurs sauvegardes.

## Structure

- `catalog.js` : contenu éditorial, catégories, liens et journal du Labs.
- `app.js` : navigation, rendu, recherche, formulaires locaux et partage.
- `github-activity.js` : lecture et normalisation défensive des releases/commits publics.
- `model.js` : filtres, persistance défensive, validation et préparation des retours GitHub.
- `tests/` : tests Node de persistance, navigation et préparation des retours.
- `styles.css` : thèmes et dispositions ordinateur/mobile.
- `assets/` : illustrations vectorielles et icône.
- `scripts/` : validation, compilation statique, serveur local, générateur d’illustrations.

## Vérification

`npm run check` vérifie la syntaxe JS, la cohérence des données, les assets et les recherches, puis exécute les tests de robustesse (données locales corrompues, filtres combinés et retours). `npm run build` produit un dossier statique autonome. Une recette visuelle sur iPhone et ordinateur reste nécessaire ; les contrôles statiques ne prouvent pas l’ergonomie ni la disponibilité des jeux tiers.

## Prochaines étapes

1. Recette visuelle réelle sur mobile et ordinateur, puis affinage des cartes et visuels.
2. Stockage serveur des retours privés, antispam, limites de taille/fréquence et interface de modération.
3. Publication de suggestions choisies, soutien aux idées et suivi de leur état.
4. Modération des retours anonymes et conversion choisie en issues, côté serveur. Le passage public vers GitHub existe déjà sans clé embarquée.
5. Étendre la liste de dépôts publics vérifiés ; enrichir le catalogue après validation éditoriale. Les releases des quatre dépôts actuellement reliés sont déjà lues à l’ouverture. Aucun nouveau projet n’est ajouté automatiquement.
6. Téléchargements uniquement lorsqu’un exécutable et sa notice ont été vérifiés.

Ne jamais placer une clé GitHub dans le JavaScript public. Une évolution serveur sera nécessaire pour la boîte de réception et les actions GitHub.

## Publication sur GitHub Pages

Le workflow `.github/workflows/check.yml` vérifie et compile le site, valide ses chemins sous `/Labz/`, puis déploie `dist/` sur GitHub Pages. Les pull requests sont vérifiées sans publication. Chaque push sur `main` publie après réussite des contrôles ; un lancement manuel est également disponible.

### Activation initiale (une seule fois)

Dans le dépôt GitHub, ouvrir **Settings → Pages → Build and deployment → Source**, puis sélectionner **GitHub Actions**. Cette activation demande l’accès d’administration du propriétaire et ne peut pas être faite par le connecteur utilisé ici.

Ensuite, dans **Actions → Build and deploy Labz**, relancer le job en échec ou choisir **Run workflow**. Les mises à jour suivantes de `main` sont automatiques.

Site publié (Pages activé le 19 octobre 2026) : https://mathieubal.github.io/Labz/

L’URL réelle du déploiement apparaît dans l’environnement `github-pages` et dans le résumé du workflow. Ne pas confondre réussite de la compilation et publication effective : le job `deploy` doit également réussir.

### Vérifications locales de publication

```sh
npm run check
npm run build
node scripts/check-pages.mjs
```

Le paquet contient une page 404 de retour au catalogue et un fichier `.nojekyll`. Aucun serveur ni secret n’est nécessaire pour cette première version. GitHub Pages héberge uniquement la partie statique ; la réception privée de commentaires anonymes et les actions automatiques sur GitHub demanderont un service séparé.

## Données GitHub

Les visiteurs consultent directement l’API publique GitHub depuis leur navigateur à l’ouverture d’une fiche reliée ou de la page Nouveautés. Le cache dure uniquement pendant la session de la page. Aucun appel n’est effectué en arrière-plan une fois le Labs fermé. Le bouton Actualiser force une nouvelle lecture. Une limite ou une panne affiche un message et conserve les données déjà reçues lorsque possible. Les commits restent explicitement séparés des releases : ils ne prouvent pas le déploiement d’une nouvelle version jouable. Les notes de version sont rendues en texte brut, limitées à 600 caractères, avec un lien vers leur source complète.
