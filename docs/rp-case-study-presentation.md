# Présentation Labz : Écosystème RP

## Intention

Présenter les quatre outils comme une seule étude de cas, sans inventer une continuité technique qui n'existe pas.

La page doit faire comprendre deux histoires distinctes :

1. Saloon puis HotzDoggz : le même type de besoin métier revient plusieurs années plus tard, avec un autre contexte RP et beaucoup plus d'expérience technique. HotzDoggz n'est pas la V2 du code Saloon.
2. ZepRasso puis Zepevents puis retour vers ZepRasso : un cycle d'expérimentation événementielle guidé par les contraintes du serveur, l'usage des QR codes et les réactions du terrain.

La chronologie publique comporte donc cinq étapes pour quatre outils :

1. Saloon : première automatisation d'une entreprise RP dans Discord.
2. HotzDoggz : nouveau bot plusieurs années plus tard pour une entreprise GTA RP, avec une architecture beaucoup plus mature.
3. ZepRasso : première piste web participative, mobile, lien et QR code.
4. Zepevents : alternative locale créée quand l'usage d'un site externe et des QR codes semblait pouvoir poser un problème d'acceptation serveur.
5. Retour à ZepRasso : les premiers usages ne déclenchent pas le blocage redouté, les joueurs accueillent bien le principe et la plateforme web redevient la direction principale.

## Ce que la comparaison ZepRasso / Zepevents doit montrer

Le QR code n'est pas le cœur de ZepRasso et n'est pas obligatoire. L'organisateur peut aussi saisir et gérer les informations manuellement.

ZepRasso est la plateforme la plus large :

- événements multiples ;
- véhicules, participants, votes et paiements ;
- loteries ;
- courses chronométrées ;
- paris ;
- suivi financier global ;
- sauvegardes et audit anti-triche.

Sa loterie suit notamment le prix du ticket, le coût réel du lot, les tickets payés, le revenu et le bénéfice.

Zepevents conserve des idées intéressantes côté préparation :

- valeur estimée du lot ;
- marge souhaitée ;
- nombre de tickets estimé ;
- prix conseillé ;
- seuil de rentabilité ;
- objectif de tickets ;
- corrections de tickets, probabilités et tirages auditables.

Une convergence fonctionnelle de ces idées dans ZepRasso peut être évoquée comme possibilité à long terme, mais elle ne doit jamais être présentée comme un développement planifié aujourd'hui.

## Ce que la comparaison Saloon / HotzDoggz doit montrer

Le besoin se ressemble, pas le code.

Saloon correspond à une première expérience réellement utilisée pour réduire la gestion manuelle d'un saloon Red Dead RP.

Plusieurs années plus tard, HotzDoggz naît spontanément face à un problème familier : Mathieu devient copatron d'une entreprise GTA RP avec Zep et retrouve les mêmes contraintes de ventes, stock, comptabilité et paie.

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
