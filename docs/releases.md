# Publier une version sans oublier les nouveautés

`release-notes.js` est la source du journal public de Labz. L'accueil utilise sa première entrée, la page Nouveautés affiche l'historique et le pied de page utilise son numéro de version. Le build embarque ces données avec la version livrée : aucune requête GitHub supplémentaire n'est nécessaire pour les lire.

Pour préparer une livraison, après avoir terminé les changements :

```sh
npm run release -- 0.10.0 "Titre lisible" "Résumé pour les visiteurs" "Premier changement" "Deuxième changement"
npm run check
npm run build
```

La commande ajoute la date de Paris, conserve l'historique et met à jour package.json. Le titre, le résumé et les points sont rédigés par la personne qui prépare la livraison ; ils ne sont pas inventés à partir des commits. Ne jamais inclure de message privé ou d'information personnelle.

La CI et le build refusent une version sans note correspondante, les doublons et un historique désordonné. Fusionner ensuite la PR déclenche le déploiement Pages habituel. Une compilation n'est pas une preuve de publication : vérifier le succès du job deploy. En cas d'échec du déploiement, le site conserve son ancien journal avec son ancienne version.

Les changements sans nouveau numéro de version (corrections documentaires, par exemple) ne créent pas de nouveauté. Pour une modification visible, préparer une version, même corrective. Ne plus modifier le journal dans catalog.js ni écrire le numéro manuellement dans index.html.

Ce mécanisme concerne Labz. Les actualités des autres projets gardent leur source GitHub publique existante ; leurs commits ne sont pas présentés comme des versions déployées.

## Contrôle entre deux publications

La CI compare le commit testé à la base de la PR ou au commit précédant le push. Toute modification autre que `README.md` et `docs/**/*.md` exige un numéro supérieur et une modification du journal. `npm run check` valide ensuite leur cohérence. Ainsi, modifier le code sans changer ni la version ni le journal est aussi refusé.

Pour vérifier localement un commit préparé : `node scripts/check-release-change.mjs COMMIT_PRECEDENT`. Le contrôle porte sur les commits, pas les fichiers non enregistrés. Une republication manuelle (`workflow_dispatch`) n’exige pas d’incrément, mais garde tous les autres contrôles.
