# Synthèse du premier tri GitHub

**Date : 24 octobre 2026**

Cette synthèse clôt la première passe de tri du portefeuille GitHub de Mathieu. Elle ne remplace pas les audits techniques complets prévus avant toute intégration ou présentation définitive dans Labz.

## Candidats à un audit complet Labz

Ces projets méritent une seconde passe approfondie avant décision finale de présentation :

- `afk-farm` — jeu idle/PWA personnel poussé loin ; boucle de jeu, progression, prestige, biomes, hors-ligne et déploiement GitHub Pages. À auditer comme expérience jouable, sans présumer de sa qualité finale.
- `Crimson-s-Blade` — outil de coordination de guilde réellement mis en ligne et utilisé sur la durée ; candidat fort.
- `Clicreflexe` + `Tricat` + `ball-passing-simulation` — à regrouper comme famille d'outils ludiques pour ateliers mémoire / médiation. `ball-passing-simulation` a été utilisé ponctuellement en atelier ; `Tricat` et `Clicreflexe` appartiennent à la même démarche.
- Écosystème RP : `discortbotsaloon` + `HotzDoggz-bot` + `ZepRasso` + `Zepevents` — une seule histoire cohérente autour de l'automatisation de la logistique RP pour préserver le temps de jeu. `HotzDoggz-bot` a connu un usage réel (~40 utilisateurs pendant ~15 jours en auto-hébergement).
- `Totalwarai` — expérimentation technique ambitieuse dérivée/continuée à partir d'un projet tiers avec autorisation de poursuite. Le pont Python/Lua, l'observation et le pilotage réel de batailles ont été poussés loin, mais l'objectif d'une IA suffisamment performante pour gagner n'a pas été atteint. À présenter éventuellement comme expérimentation, jamais comme IA aboutie.

## GitHub seulement / conserver comme historique ou exploration

- `Antsimu` — bac à sable privé dérivé d'un projet tiers ; conserver, ne pas présenter comme création originale autonome.
- `equiperota` / AtelierFlow — exploration autour de la répartition du travail en atelier ; conserver comme réflexion/prototype, pas comme produit actif.

## À archiver / hors Labz

- `chess-vision-trainer` — idée intéressante, implémentation jugée peu utile et non satisfaisante.
- `OpenclassroomProject2` — exercice OpenClassrooms.
- `STUDI_Projet_fil_rouge` — projet de formation Studi interrompue.
- `EcoRide` — projet Studi.
- `ClicReflex` — ancien prototype Python antérieur à la version web.
- `Ilia` — ancien assistant vocal Python, dépôt incomplet et aujourd'hui obsolète.
- `gta-blackjack-assistant` — expérimentation personnelle GTA RP autour du blackjack, peu poussée.
- `botlecturevlc` — utilitaire personnel ancien pour automatiser la lecture de séries locales, aujourd'hui obsolète.
- `DeezerInfo` — petit outil d'intégration stream pour afficher le morceau Deezer en cours.
- `sudoku-solver` — exercice personnel d'algorithmique réalisé pour le plaisir.

## Suppression recommandée, non exécutée

- `HFTrain` — dépôt vide, intention ancienne et floue autour du HFT / simulateur de marché. La seule idée résiduelle utile est celle d'un futur simulateur/replay de marché sans risque ; si elle revient, repartir sur un dépôt neuf. **Aucune suppression n'est exécutée sans confirmation explicite.**

## Déjà présents dans Labz

Ces dépôts n'étaient pas la cible de ce premier tri hors Labz et feront partie de la future passe d'audit complet du catalogue :

- `Sensoria`
- `million-de-pixels`
- `Lootchest`
- `diagnostic-numerique`
- `Perfoptimize`
- `Pipboy`
- `constella`

## Règle pour la deuxième passe

Être « candidat Labz » signifie seulement : **mérite un audit complet**.

Avant toute intégration ou réécriture d'une fiche Labz, l'audit devra vérifier au minimum : architecture, qualité du code, dette technique, fonctionnalités réellement opérationnelles, bugs, UX, responsive/mobile si pertinent, performances, sécurité, tests, déploiement, documentation, état de maintenance, provenance/licences éventuelles et cohérence entre la promesse du projet et ce qu'il fait réellement.

La présentation Labz sera ensuite fondée sur cet audit, pas uniquement sur le souvenir du projet ni sur le README.