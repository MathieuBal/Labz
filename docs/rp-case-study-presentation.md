# Présentation Labz : Écosystème RP

## Voix éditoriale

Labz est mon site. Quand une fiche raconte mon parcours, mes décisions ou mon contexte, elle doit employer la première personne.

Les formulations neutres restent adaptées pour décrire une fonction technique ou un comportement du logiciel, mais la page ne doit pas parler de « Mathieu » comme si un tiers racontait mon travail.

## Intention

Présenter les quatre outils comme une seule étude de cas, sans inventer une continuité technique qui n'existe pas et sans raconter les choix de conception avant d'avoir expliqué ce que fait chaque produit.

La page doit faire comprendre deux histoires distinctes :

1. Saloon puis HotzDoggz : le même type de besoin métier revient plusieurs années plus tard, avec un autre contexte RP et beaucoup plus d'expérience technique. HotzDoggz n'est pas la V2 du code Saloon.
2. ZepRasso puis Zepevents puis retour vers ZepRasso : un cycle d'expérimentation événementielle guidé par les contraintes du serveur, l'usage des QR codes et les réactions du terrain.

La chronologie publique comporte cinq étapes pour quatre outils :

1. Saloon : première automatisation d'une entreprise RP dans Discord.
2. HotzDoggz : nouveau bot plusieurs années plus tard pour une entreprise GTA RP, avec une architecture beaucoup plus mature.
3. ZepRasso : plateforme web locale pour organiser des rassemblements et événements automobiles GTA RP. Les joueurs peuvent rejoindre l'événement, inscrire leur véhicule et voter depuis leur téléphone, tandis que l'organisateur pilote participants, résultats, paiements et données depuis une interface séparée.
4. Zepevents : application locale côté organisateur pour gérer inscriptions, véhicules, concours, paiements, caisse, loteries et résultats sans demander aux joueurs d'ouvrir un site.
5. Retour à ZepRasso : les premiers usages ne déclenchent pas le blocage redouté, les joueurs accueillent bien le principe et la plateforme web s'élargit ensuite aux loteries, courses, paris et au suivi financier.

## Ce que la comparaison ZepRasso / Zepevents doit montrer

Le visiteur doit d'abord comprendre ce que sont les deux outils avant de lire pourquoi ils existent.

### ZepRasso

ZepRasso est la plateforme web événementielle la plus large :

- événements multiples ;
- véhicules, participants, votes et paiements ;
- accès mobile par lien ou QR code ;
- administration séparée ;
- loteries ;
- courses chronométrées ;
- paris ;
- suivi financier global ;
- sauvegardes et audit anti-triche.

Le QR code n'est qu'un moyen d'accès et n'est pas obligatoire. Je peux aussi saisir et gérer les informations manuellement côté organisateur.

Sa loterie suit notamment le prix du ticket, le coût réel du lot, les tickets payés, le revenu et le bénéfice.

### Zepevents

Zepevents est un poste de contrôle local pour l'organisateur. Il conserve notamment des idées intéressantes côté préparation :

- valeur estimée du lot ;
- marge souhaitée ;
- nombre de tickets estimé ;
- prix conseillé ;
- seuil de rentabilité ;
- objectif de tickets ;
- corrections de tickets, probabilités et tirages auditables.

Une convergence fonctionnelle de certaines idées dans ZepRasso peut être évoquée comme possibilité à long terme, mais elle ne doit jamais être présentée comme un développement planifié aujourd'hui.

## Ce que la comparaison Saloon / HotzDoggz doit montrer

Le besoin se ressemble, pas le code.

Saloon correspond à une première expérience réellement utilisée pour réduire la gestion manuelle d'un saloon Red Dead RP.

Plusieurs années plus tard, Zep rachète une entreprise GTA RP, je deviens copatron et je retrouve les mêmes contraintes de ventes, stock, comptabilité et paie. Je repars alors de zéro pour construire HotzDoggz.

La différence de maturité est le sujet : TypeScript, PostgreSQL, Prisma, transactions, preuves, journal d'audit, tests, CI, idempotence et workflows de validation remplacent une architecture Python beaucoup plus artisanale.

## Visuels

Aucune fausse capture ne doit être produite.

Quand le PC permettant de relancer les projets sera disponible :

- Saloon : capture Discord si un serveur ou une archive permet de retrouver l'interface réelle ;
- HotzDoggz : captures du workflow employé/direction et des tableaux persistants, sur serveur de démonstration avec données fictives ;
- ZepRasso : captures visiteur mobile, vote, loterie, résultats et administration ;
- Zepevents : captures du dashboard, concours, loterie et caisse dans l'interface CustomTkinter.

En attendant, les flux sont représentés dans Labz par des schémas HTML/CSS explicitement structurels, jamais comme des screenshots.

## Démo future

ZepRasso reste le meilleur candidat pour une éventuelle démo publique autonome, mais seulement après durcissement de l'accès administrateur et des écritures publiques.

HotzDoggz est mieux servi par une simulation documentée du workflow que par la connexion à un vrai serveur Discord de production.

Zepevents pourra être montré avec son interface locale réelle lorsqu'une machine permettra de le relancer proprement.
