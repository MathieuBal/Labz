# Passe de dette technique du 25 octobre 2026

Cette passe fait suite à l’audit global de Labz v0.18.8.

## Défaut production corrigé

Le formulaire public était disponible sur les douze fiches, mais la fonction Supabase et la contrainte SQL conservaient une ancienne whitelist de huit projets. Six fiches actives étaient donc rejetées par le serveur.

Correction :

- migration production `20261025225014_feedback_project_slug_constraint` ;
- Edge Function `labz-feedback` version 2 ;
- validation d’un slug propre et borné au lieu d’une liste dupliquée ;
- vérification transactionnelle des douze slugs actifs, sans conservation de données de test ;
- test automatique catalogue → validateur serveur.

## Source de vérité

`catalog-runtime.js` a été supprimé. Les statuts, accès, guides et corrections essentielles sont désormais portés directement par `catalog.js`.

Cela supprime notamment les doubles définitions de :

- l’accès public Pip-Boy ;
- l’origine et le statut AFK Farm ;
- le statut et la formulation Total War AI ;
- les libellés de maturité du catalogue.

## Documentation

Le README, l’état du portefeuille, le plan de développement et la documentation du feedback ont été réalignés sur l’état réel v0.18.9.

## Dette restante assumée

Cette passe ne transforme pas Labz en nouvelle architecture. Restent volontairement :

- `app.js` encore très central ;
- coordination de certaines pages secondaires par `MutationObserver` ;
- `navigation-fixes.js` encore présent ;
- absence de vrais tests navigateur de bout en bout ;
- SEO / OpenGraph encore génériques ;
- récupération de mot de passe admin non intégrée ;
- modèle Retours → Décisions non implémenté.

Ces éléments sont maintenant explicitement priorisés dans `development-plan.md` au lieu d’être mélangés avec des états historiques périmés.
