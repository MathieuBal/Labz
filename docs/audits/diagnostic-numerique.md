# Audit pré-intégration Labz — Diagnostic numérique

**Dépôt audité :** `MathieuBal/diagnostic-numerique`  
**Révision :** `e7f79ff88bca2395b1a9d5ce413641ed74069fc4`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · outil de médiation sérieux et démontrable, avec collecte connectée à revalider en conditions réelles**

## Verdict

`diagnostic-numerique` mérite de rester dans Labz.

Contrairement à un simple questionnaire, le dépôt contient un **vrai outil de préparation d'ateliers de médiation numérique** : parcours participant, exercices, mini-jeux, manipulations observées, espace animateur, analyse par domaines, proposition de programme de 12 ateliers, export CSV, sauvegardes de séance et mode de récupération par fichiers.

Le projet possède également une chaîne de publication plus disciplinée que plusieurs jeux du portfolio : tests Node sans dépendances, contrôle syntaxique et déploiement GitHub Pages bloqué si ces vérifications échouent. Le dernier workflow Pages de la révision auditée est en succès.

La partie Supabase est conçue avec de bons principes de sécurité : tables privées, RLS, retraits de privilèges directs et exposition seulement de RPC explicitement autorisées. La clé présente côté navigateur est une **clé publishable**, ce qui est adapté à un frontend public lorsqu'elle est couplée à des contrôles d'accès côté base.

En revanche, la documentation est aujourd'hui partiellement désynchronisée : le README affirme encore à plusieurs endroits que Supabase n'est pas configuré, alors que `dist/config.js` pointe vers un projet réel et qu'un commit du 11 septembre 2026 indique explicitement la connexion de la plateforme à Supabase.

L'audit n'a pas pu vérifier le backend réel associé à cette URL depuis la connexion Supabase disponible dans cette session : ce projet n'apparaît pas parmi les projets actuellement accessibles. La **collecte connectée doit donc rester considérée comme à revalider**, même si le code client et le schéma sont présents.

---

## Ce qui existe réellement

### Parcours participant

Le parcours n'est pas un simple quiz. Il combine :

- habitudes et aisance déclarée ;
- questions de connaissances ;
- mini-jeux ;
- manipulations réelles à effectuer sur l'ordinateur ;
- situations ouvertes ;
- bilan et intérêts pour la suite.

La version actuelle documente 12 questions, 12 mini-jeux, 6 manipulations et 3 situations, avec un programme d'environ 90 minutes.

Les réponses non fournies restent distinctes d'une erreur, et le projet évite volontairement le score global / classement.

### Mode sans backend

Le mode local/par fichiers est une vraie voie de fonctionnement, pas un placeholder.

Le participant peut :

- remplir son diagnostic ;
- conserver les réponses localement ;
- télécharger un résultat JSON.

L'animateur peut ensuite :

- créer une séance locale ;
- importer plusieurs fichiers ;
- fusionner les versions par identifiant/révision ;
- conserver les observations ;
- exporter CSV et sauvegarde de séance.

Les tests couvrent notamment les réimports, versions anciennes, doublons, personnes de même prénom et refus de fichiers invalides.

### Espace animateur

L'espace animateur contient réellement :

- liste de séances ;
- participants ;
- recherche / filtres ;
- observations ;
- graphiques ;
- synthèse pédagogique ;
- programme « Mes 12 ateliers » ;
- préparation de séance ;
- export/sauvegarde ;
- ouverture/fermeture de collecte ;
- suppression sécurisée d'une séance fermée.

La démonstration utilise des données explicitement fictives, ce qui est une bonne séparation pour Labz.

---

## Qualité / CI

### Tests présents

Le dépôt utilise le test runner natif de Node et couvre notamment :

- analyse ;
- logique cœur ;
- mini-jeux ;
- reporting ;
- transfert/import/export.

Le test de transfert vérifie entre autres qu'un export participant n'embarque pas son secret navigateur, que les observations ne peuvent pas être injectées depuis un fichier participant, que les anciennes révisions n'écrasent pas les nouvelles et que le CSV survit au round-trip.

### Workflow Pages

Le workflow de publication exécute :

1. checkout ;
2. Node 22 ;
3. `npm test` ;
4. `npm run check` ;
5. publication de `dist/`.

Le dernier run associé à la révision auditée s'est terminé avec succès le 11 septembre 2026.

### Limite actuelle

Les tests sont essentiellement des tests de logique Node. Le README reconnaît lui-même qu'il reste à faire :

- une vraie recette navigateur ;
- une validation connectée Supabase ;
- des essais sur les postes de l'atelier.

Le projet est donc mieux protégé contre les régressions logiques que contre les régressions de parcours réel.

**Remédiation recommandée :** ajouter un smoke Playwright couvrant au minimum le parcours local, l'import animateur et la démonstration.

---

## Supabase / sécurité

### Points solides

Le schéma :

- active RLS sur les tables ;
- retire les accès directs `anon` et `authenticated` ;
- utilise des fonctions RPC `SECURITY DEFINER` avec `search_path=''` ;
- retire `EXECUTE` de `PUBLIC`, `anon` et `authenticated` avant de réaccorder uniquement les fonctions voulues ;
- contrôle `auth.uid()` et la table `trainers` pour les opérations animateur ;
- vérifie l'appartenance de chaque séance à son propriétaire ;
- limite taille et forme des JSON sensibles ;
- protège la suppression par propriété, fermeture préalable et confirmation du titre.

Les RPC participants utilisent un identifiant + secret navigateur haché côté base. Côté navigateur, le secret est généré avec deux `crypto.randomUUID()` concaténés et n'est pas inclus dans l'export participant.

Ces choix sont cohérents avec l'usage d'une clé publishable côté frontend : une clé publishable est faite pour être visible dans le navigateur ; les secrets serveur/service-role ne doivent en revanche jamais y apparaître.

### P1 — inscription publique susceptible d'abus

`join_active` est volontairement exécutable par `anon` afin qu'un participant puisse rejoindre le lien unique sans compte.

Quand une séance d'accueil est ouverte, un visiteur connaissant simplement l'URL publique peut donc créer un nouveau participant. La limite de 250 participants protège la taille maximale, mais il n'existe pas dans le schéma de mécanisme anti-abus par IP, CAPTCHA/Turnstile ou rate limit métier.

Dans un atelier fermé et une fenêtre d'ouverture courte, le risque est limité. Sur une URL publique ouverte longtemps, un tiers pourrait théoriquement remplir les 250 places et perturber la séance.

**Remédiation possible :** conserver le lien ouvert uniquement pendant l'accueil, ou ajouter une couche de rate limiting / challenge si l'outil devient réellement public à grande échelle.

### P2 — durcir les privilèges par défaut

Chaque fonction actuelle révoque explicitement puis réaccorde ses droits d'exécution, ce qui est bon.

Une défense en profondeur supplémentaire serait de modifier les **default privileges** afin que les futures fonctions ne soient jamais exécutables par `PUBLIC`, `anon` ou `authenticated` par défaut. Cela évite qu'une future RPC oubliée soit exposée accidentellement.

---

## P1 — documentation Supabase désynchronisée

Le README dit encore notamment :

- « connexion de la collecte centrale — à faire plus tard » ;
- « la transmission automatique reste désactivée tant que `dist/config.js` et Supabase ne sont pas configurés » ;
- « la collecte automatique n'est pas activée tant que le projet Supabase reste non configuré ».

Or `dist/config.js` contient aujourd'hui une URL Supabase et une clé publishable réelles, et l'historique Git contient un commit intitulé « Connecter la plateforme au projet Supabase avec sa configuration publique ».

**Correction :** réécrire le README pour distinguer clairement :

1. le backend est **configuré dans le code** ;
2. son état opérationnel réel doit être **revalidé** avant une séance ;
3. le mode fichiers reste une voie autonome et sûre si le backend n'est pas disponible.

---

## Vie privée / données

Le projet manipule potentiellement des prénoms/pseudonymes, réponses, observations et difficultés numériques.

Points positifs :

- aucune donnée réelle n'est versionnée dans GitHub ;
- la démo est fictive ;
- le prénom n'est pas présenté comme une authentification ;
- le mode fichier n'exporte pas le secret navigateur ;
- la suppression en cascade d'une séance existe ;
- le README rappelle qu'une durée de conservation doit être définie avec la structure.

Pour un usage réel récurrent, Labz ne doit pas présenter l'outil comme une solution de conformité prête à l'emploi : politique de conservation, information des participants et pratiques de la structure restent à cadrer opérationnellement.

---

## Accessibilité / ergonomie

Le code montre plusieurs bons réflexes :

- labels de formulaires ;
- `role="status"` / `aria-live` pour les sauvegardes ;
- navigation par onglets avec gestion clavier ;
- liens et aides visibles ;
- réglages de taille de texte / contraste documentés ;
- absence de score global stigmatisant ;
- possibilité de passer des questions.

La vraie validation avec le public cible reste néanmoins plus importante ici qu'un audit DOM : la lisibilité, le temps réel nécessaire, la fatigue et la compréhension des consignes doivent être testés en situation.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que `diagnostic-numerique` :

- est une plateforme conçue pour préparer des ateliers de médiation numérique ;
- propose un parcours participant d'environ 90 minutes ;
- combine questions, mini-jeux, manipulations et situations ;
- ne produit pas de score global ni de classement ;
- fonctionne en mode local avec récupération de fichiers ;
- possède un tableau de bord animateur avec analyses, observations, CSV et programme de 12 ateliers ;
- possède une démonstration avec données fictives ;
- possède une intégration Supabase préparée et configurée dans le dépôt ;
- utilise une architecture Supabase à accès tables bloqué + RPC contrôlées ;
- possède des tests de logique exécutés avant publication GitHub Pages ;
- est actuellement déployé par une CI dont le dernier run audité est vert.

## À ne pas sur-vendre

- « collecte Supabase validée en production » : non vérifié dans cet audit ;
- « utilisé à grande échelle » : non établi ;
- « entièrement testé dans un vrai navigateur » : non ;
- « outil d'évaluation clinique / certification de compétences » : non ;
- « conforme juridiquement par défaut » : non ;
- « impossible à perturber depuis Internet » : le lien participant anonyme reste volontairement public quand une séance est active.

---

## Plan de remédiation court

1. Mettre le README en cohérence avec la configuration Supabase actuelle.
2. Revalider le backend connecté avec une vraie séance test à deux navigateurs.
3. Ajouter un smoke Playwright local/démo avant publication.
4. Tester le parcours sur les postes réellement utilisés en atelier.
5. Ajouter une protection anti-abus si le lien unique doit rester ouvert longtemps/publicement.
6. Durcir les default privileges des futures fonctions Supabase.
7. Formaliser les règles de conservation/information si l'outil est utilisé avec de vraies données.

## Décision finale

**`diagnostic-numerique` reste dans Labz.**

Il apporte quelque chose que les jeux du portfolio n'apportent pas : la capacité à transformer un besoin de médiation en un outil structuré, exploitable sans backend et capable de produire une lecture pédagogique plutôt qu'un simple score.

Son statut conseillé reste **démo guidée / outil testable**, tant que la collecte Supabase réelle n'a pas été revalidée de bout en bout. Le code de la partie connectée est suffisamment sérieux pour justifier sa présence, mais la présentation Labz doit distinguer clairement **fonctionnalité implémentée** et **fonctionnalité validée en conditions réelles**.