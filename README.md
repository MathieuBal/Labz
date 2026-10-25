# Labz | Mathieu / Labs

Un point d'entrée pour découvrir les jeux, expériences et outils de Mathieu, puis lui envoyer des retours privés sans compte.

Site : https://mathieubal.github.io/Labz/

## État courant

Le numéro de version et les nouveautés viennent de `release-notes.js` ; ils sont validés contre `package.json` et publiés ensemble.

- Catalogue éditorial de **douze fiches**, dont **sept projets ou outils directement essayables**. Les projets non testables sont distingués comme présentations, études de cas ou R&D ; Constella est présenté comme une seule suite avec Explore et Watch sur un Core commun.
- `catalog.js` est la source canonique des statuts, accès publics, guides de découverte et métadonnées essentielles des fiches. Il n’existe plus de couche runtime séparée qui corrige le catalogue après chargement.
- Pages projet enrichies : présentation produit pour les expériences et outils testables, structure de suite pour Constella, chronologies pour les études de cas et lecture R&D pour Total War AI.
- Fiches compactes : Lancer et Déposer un avis en tête, guides et évolutions dépliables. Favoris et historique locaux ; partage natif ou copie du lien.
- Retours privés via Supabase, sans compte visiteur. Le serveur valide un slug projet propre et borné plutôt qu’une whitelist dupliquée ; un test vérifie que les douze projets actifs satisfont ce contrat.
- Brouillon automatiquement sauvegardé sur l'appareil, accusé de réception conservé après rechargement quand le stockage local est disponible, et commande d’effacement explicite.
- Administration `#/admin`, accessible en pied de page : connexion propriétaire, recherche, filtres, compteurs et statuts Nouveau / En cours / Traité. Autorisation explicite en base, aucun premier inscrit automatiquement administrateur.
- Jetons et messages privés en mémoire ; sortie de l'admin, rechargement, expiration et déconnexion effacent l'état sensible local.
- Activité publique GitHub de huit dépôts explicitement autorisés : versions, ou commits clairement identifiés en leur absence. Cache mémoire de quinze minutes ; aucun token public privilégié.
- Guides d’essai pour les expériences lançables et les outils testables. Pip-Boy est essayable via sa démonstration locale ; la partie authentifiée Supabase et les sessions MJ/joueur restent une couche séparée.
- Navigation mobile fiabilisée : quatre destinations en barre basse, retour explicite à l’accueil et ouverture des fiches en haut de page sans restauration automatique de position.

Les visuels ne sont pas tous des captures d'écran. Les projets sans démo validée restent des présentations. Un binaire public peut être distribué sans exposer automatiquement le dépôt source privé correspondant.

Vue de pilotage du portefeuille : [état des projets](docs/portfolio-status.md).

## Développement et validation

Node 22 ou plus récent. Aucune dépendance npm nécessaire.

```sh
npm run check
npm run build
node scripts/check-pages.mjs
npm start
```

Ouvrir http://127.0.0.1:4173. Le site compilé est dans `dist/`. Les chemins relatifs supportent `/Labz/`. Les tests Node ne remplacent pas une recette navigateur, mobile ou propriétaire connecté.

## Structure

- `catalog.js` : catalogue canonique, statuts, accès et guides éditoriaux.
- `project-pages.js`, `project-pages.css` : présentations riches par famille de projet.
- `navigation-fixes.js` : garde-fous de navigation mobile et de position de scroll.
- `release-notes.js` : historique public et version affichée.
- `app.js`, `model.js`, `styles.css` : navigation, rendu et état public local.
- `project-gallery.js`, `project-gallery.css` : galeries des fiches projet.
- `feedback-client.js`, `feedback-config.js` : envoi privé.
- `admin-client.js`, `admin-view.js`, `admin-config.js`, `admin.css` : espace propriétaire.
- `github-activity.js` : lecture défensive des nouveautés publiques.
- `supabase/` : migrations, réception serveur et configuration.
- `scripts/`, `tests/` : validation, préparation de version, build et publication.

## Publication

GitHub Pages est activé via Actions. `.github/workflows/check.yml` teste et compile les PR ; les pushs sur `main` publient après validation. Vérifier le job `deploy`, puis la version en ligne.

Préparer une livraison avec `npm run release` : [procédure](docs/releases.md). La CI compare les changements au commit précédent : une modification autre que README/docs Markdown exige une version supérieure et une note modifiée. Une republication manuelle conserve la version. Les scripts et styles partagent une empreinte de cache ; les images remplacées doivent recevoir un nom versionné si nécessaire.

## Limites à connaître

- Réception : 100 admissions par jour UTC, 500 messages présents. Le statut Traité ne libère pas de capacité.
- Messages de plus de 90 jours purgés lors du prochain envoi, sans tâche périodique actuellement.
- Récupération de mot de passe propriétaire non intégrée.
- La recette complète de connexion/récupération sur téléphone réel reste à terminer.
- Les retours sont encore organisés message par message : la transformation en sujets, décisions et états de portefeuille reste un chantier distinct.
- Les nouveautés Labz sont rédigées dans le dépôt ; leur diffusion est automatisée, leur rédaction n'est pas encore gérée depuis l'administration.
- Les statuts publics de projet ne sont pas encore structurés comme un workflow : l’activité GitHub ne doit pas être interprétée comme un état produit.

## Documents de continuité

- [État actuel du portefeuille](docs/portfolio-status.md)
- [Plan de développement et validations](docs/development-plan.md)
- [Évolution des retours et des décisions](docs/feedback-roadmap.md)
- [Administration : état et protections](docs/admin-handoff.md)
- [Réception privée : architecture et limites](docs/private-feedback.md)
- [Choix éditoriaux historiques](docs/selection.md)

Ne jamais embarquer de clé GitHub, de clé secrète Supabase ou de mot de passe dans le client. Réutiliser le projet Supabase existant ; aucun nouveau projet requis.
