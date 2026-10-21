# Labz — Mathieu / Labs

Un point d'entrée pour découvrir les jeux, expériences et outils de Mathieu, puis lui envoyer des retours privés sans compte.

Site : https://mathieubal.github.io/Labz/

## État courant

Le numéro de version et les nouveautés viennent de `release-notes.js` ; ils sont validés contre `package.json` et publiés ensemble.

- Catalogue éditorial de huit projets, dont trois expériences lançables. Présentations séparées, recherche, catégories et filtres combinables.
- Fiches compactes : Lancer et Déposer un avis en tête, guides et évolutions dépliables. Favoris et historique locaux ; partage natif ou copie du lien.
- Retours privés via Supabase, sans compte visiteur. Un seul bouton d'envoi. Brouillon automatiquement sauvegardé sur l'appareil ; aucun export ni publication GitHub dans ce parcours.
- Administration `#/admin`, accessible en pied de page : connexion propriétaire, recherche, filtres, compteurs et statuts Nouveau / En cours / Traité. Autorisation explicite en base, aucun premier inscrit automatiquement administrateur.
- Jetons et messages privés en mémoire ; sortie de l'admin, rechargement, expiration et déconnexion effacent l'état local.
- Activité publique GitHub de quatre dépôts autorisés : versions, ou commits clairement identifiés en leur absence. Cache mémoire de quinze minutes ; aucun token public privilégié.

Les visuels ne sont pas tous des captures d'écran. Les projets sans démo validée restent des présentations. Aucun dépôt privé n'est exposé automatiquement.

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

- `catalog.js` : catalogue et guides éditoriaux.
- `release-notes.js` : historique public et version affichée.
- `app.js`, `model.js`, `styles.css` : navigation, rendu et état public local.
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
- Brouillons persistants sans commande d'effacement ; déduplication garantie seulement pendant la session actuelle. Ce sont les prochains correctifs.
- Récupération de mot de passe non intégrée. La consultation propriétaire est autorisée mais la recette complète de connexion/récupération sur téléphone reste à terminer.
- Les nouveautés Labz sont rédigées dans le dépôt ; leur diffusion est automatisée, leur rédaction n'est pas encore gérée depuis l'administration.

## Documents de continuité

- [Plan de développement et validations](docs/development-plan.md)
- [Évolution des retours et des décisions](docs/feedback-roadmap.md)
- [Administration : état et protections](docs/admin-handoff.md)
- [Réception privée : architecture et limites](docs/private-feedback.md)
- [Choix éditoriaux](docs/selection.md)

Ne jamais embarquer de clé GitHub, de clé secrète Supabase ou de mot de passe dans le client. Réutiliser le projet Supabase existant ; aucun nouveau projet requis.
