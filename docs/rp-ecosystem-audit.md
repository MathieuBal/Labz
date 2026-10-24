# Écosystème RP — Saloon / HotzDoggz / Zep

Ce document complète `docs/github-portfolio-audit.md` pour préciser la filiation des outils RP.

## Intention commune

Le fil conducteur de ces projets n’est pas de créer des outils externes qui remplacent le RP, mais au contraire de **réduire le temps passé hors jeu** en automatisant la logistique et l’administration.

Les problèmes observés étaient concrets : entreprises RP gérées dans des tableurs fragiles, ventes et salaires à recalculer, stocks à suivre, inscriptions et votes d’événements à centraliser, loteries à administrer et résultats à produire. L’objectif était de laisser les joueurs jouer et de déplacer le minimum nécessaire vers une interface simple.

## `discortbotsaloon`

Première génération, développée pour un saloon sur Red Dead RP. Le bot tournait localement et a réellement servi pour la caisse, les tickets, les stocks, les salaires, les commissions et la comptabilité.

**Décision : conserver comme première génération / historique fonctionnel.** Pas de fiche Labz isolée si l’écosystème RP est présenté comme une seule histoire.

## `HotzDoggz-bot`

Nouvelle génération développée pour une entreprise GTA RP. Le bot a été réellement mis en service en auto-hébergement : le PC de Mathieu restait allumé pour le rendre accessible pendant environ 15 jours, avec environ 40 utilisateurs. Un proche était prêt à financer un hébergement permanent avant que la panne du PC n’interrompe cette continuité.

Le projet couvre une gestion d’entreprise beaucoup plus robuste : ventes, validation, comptabilité, paies, audit, persistance, clôtures et exports.

**Décision : conserver — candidat fort Labz.** Il constitue la pièce technique centrale de l’écosystème.

## `ZepRasso`

Point de départ de la branche événementielle. L’outil a d’abord été pensé pour les rassemblements automobiles GTA RP : inscriptions, véhicules, votes, classement et accès participant via une URL/QR code diffusé dans le jeu.

L’idée UX est importante : le joueur scanne le QR code, effectue rapidement l’action nécessaire sur le site — s’inscrire, noter ou participer — puis revient au jeu. L’interface externe doit servir le RP, pas le remplacer.

**Décision : conserver comme première implémentation spécialisée de la branche événementielle.**

## `Zepevents`

L’idée issue de `ZepRasso` s’est ensuite élargie : ne plus gérer uniquement un rassemblement automobile, mais des événements RP plus généraux, avec inscriptions, concours, votes, caisse, loteries, résultats et outils d’organisation.

Le dépôt actuel met davantage l’accent sur le poste de contrôle côté organisateur et sur une utilisation locale, tandis que `ZepRasso` matérialise mieux la couche participant accessible par QR code. Les deux dépôts représentent donc des étapes/branches complémentaires d’une même évolution fonctionnelle, plutôt que deux produits sans lien.

Les événements et loteries associés à cette organisation ont connu un réel succès en jeu. Les tirages de certaines loteries étaient prolongés par des vidéos de courses de billes publiées sur YouTube afin de rendre le résultat visible et ludique.

**Décision : conserver — candidat Labz groupé avec `ZepRasso` et `HotzDoggz-bot`.**

## Présentation Labz recommandée

Ne pas multiplier les fiches indépendantes. Présenter une seule histoire de portfolio autour de la conception d’un **écosystème d’outils pour organisations et événements RP** :

1. problème réel observé dans la gestion RP ;
2. première automatisation avec le bot Saloon ;
3. montée en robustesse avec HotzDoggz et usage réel ;
4. extension vers l’événementiel avec ZepRasso ;
5. généralisation avec Zepevents.

Le message central : **concevoir des outils qui absorbent la logistique pour redonner du temps au jeu et au RP.**
