# Labz | Mathieu / Labs

Un point d'entrée pour découvrir les jeux, expériences et outils de Mathieu, puis lui envoyer des retours privés sans compte.

Site : https://mathieubal.github.io/Labz/

## État courant

Le numéro de version et les nouveautés viennent de `release-notes.js` ; ils sont validés contre `package.json` et publiés ensemble.

- Catalogue éditorial de **douze fiches**, dont **sept projets ou outils directement essayables**. Les projets non testables sont distingués comme présentations, études de cas ou R&D ; Constella est présenté comme une seule suite avec Explore et Watch sur un Core commun.
- `catalog.js` est la source canonique des statuts, accès publics, guides de découverte et métadonnées essentielles des fiches.
- Pages projet enrichies selon leur nature, avec chargement différé des modules lourds.
- Chaque projet possède une URL statique `/Labz/projets/.../` générée au build avec titre, description, canonical, OpenGraph et entrée sitemap.
- Favoris et historique locaux, partage natif ou copie d’une vraie URL publique de projet.
- Retours privés via Supabase, sans compte visiteur, avec brouillon local, relance idempotente et réception bornée.
- Administration `#/admin` : recherche, filtres, suppression de retours non pertinents, sujets durables, impact, effort, états et historique de décisions. Maximum trois sujets peuvent être `En cours` simultanément, avec contrôle en base.
- Jetons et messages privés en mémoire ; sortie de l'admin, rechargement, expiration et déconnexion effacent l'état sensible local.
- Activité publique GitHub de huit dépôts explicitement autorisés, avec cache mémoire et gestion explicite des limites API.
- Navigation mobile dédiée et garde-fous de position de scroll.
- CI avec tests Node, build GitHub Pages, vérification des chemins puis parcours Playwright Chromium avant publication.

Les visuels ne sont pas tous des captures d'écran. Les projets sans démo validée restent des présentations. Un binaire public peut être distribué sans exposer automatiquement le dépôt source privé correspondant.

Vue de pilotage du portefeuille : [état des projets](docs/portfolio-status.md).

## Développement et validation

Node 22 ou plus récent.

```sh
npm ci
npm run check
npm run build
node scripts/check-pages.mjs
npm run e2e
```

`npm ci` installe notamment Playwright Test. La CI installe Chromium et exécute les parcours critiques, avec émulation Pixel 7 pour le scénario mobile. Cela ne remplace pas une recette ponctuelle sur appareil physique ni une validation multi-navigateurs.

`npm start` sert le build local sur `http://127.0.0.1:4173`. Le site compilé est dans `dist/` et les chemins relatifs supportent `/Labz/`.

## Structure

- `catalog.js` : catalogue canonique, statuts, accès et guides éditoriaux.
- `project-pages.js`, `project-pages.css` : présentations riches par famille de projet.
- `project-features.js` : chargement différé des modules riches uniquement sur les routes projet.
- `navigation-fixes.js` : garde-fous de navigation mobile et de position de scroll.
- `release-notes.js` : historique public et version affichée.
- `app.js`, `model.js`, `styles.css` : navigation, rendu et état public local.
- `project-gallery.js`, `project-gallery.css` : galeries des fiches projet.
- `feedback-client.js`, `feedback-config.js`, `feedback-drafts.js` : envoi privé et reprise locale.
- `admin-client.js`, `admin-view.js`, `admin-config.js`, `admin.css` : espace propriétaire et pilotage Retours → Sujets → Décisions.
- `github-activity.js` : lecture défensive des nouveautés publiques.
- `supabase/` : migrations, réception serveur et configuration.
- `scripts/`, `tests/`, `e2e/` : validation, préparation de version, build, tests navigateur et publication.

## Publication

GitHub Pages est activé via Actions. `.github/workflows/check.yml` teste et compile les PR ; les pushs sur `main` publient après validation. Vérifier le job `deploy`, puis la version en ligne.

Préparer une livraison avec `npm run release` : [procédure](docs/releases.md). La CI compare les changements au commit précédent : une modification applicative exige une version supérieure et une note modifiée. Les scripts et styles partagent une empreinte de cache.

## Limites à connaître

- Réception : 100 admissions par jour UTC, 500 messages présents. Le statut Traité ne libère pas de capacité ; un retour non pertinent peut être supprimé depuis l’administration.
- Messages de plus de 90 jours purgés lors du prochain envoi, sans tâche périodique actuellement.
- Récupération de mot de passe propriétaire non intégrée.
- Protection Supabase contre les mots de passe compromis encore désactivée.
- Recette avec le vrai compte propriétaire sur téléphone physique encore à terminer.
- Tests navigateur automatisés limités à Chromium.
- Certaines preuves visuelles restent représentatives plutôt que de vraies captures.
- Quelques ressources externes, notamment Pip-Boy, dépendent encore d’assets servis depuis une branche `main` distante.
- `app.js`, certains `MutationObserver` et `navigation-fixes.js` restent des dettes de maintenabilité ciblées, sans justifier une migration de framework.

## Documents de continuité

- [État actuel du portefeuille](docs/portfolio-status.md)
- [Plan de développement et validations](docs/development-plan.md)
- [Évolution des retours et des décisions](docs/feedback-roadmap.md)
- [Administration : état et protections](docs/admin-handoff.md)
- [Réception privée : architecture et limites](docs/private-feedback.md)
- [Choix éditoriaux historiques](docs/selection.md)

Conserver les accès privilégiés hors du client public et réutiliser le projet Supabase existant.
