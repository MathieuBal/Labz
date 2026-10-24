# Audit pré-intégration Labz — AtelierFlow

**Dépôt audité :** `MathieuBal/equiperota`  
**Branche auditée :** `claude/atelier-placement-assistant-60b1do`  
**Révision :** `419726a267c6c4cd89b14f5d7dc7684165b598de`  
**Date :** 24 octobre 2026  
**Statut proposé :** **sortir du catalogue Labz principal · conserver comme exploration de conception / outil métier non déployé**

## Verdict

AtelierFlow est beaucoup plus sérieux techniquement que son statut d'expérimentation pourrait le laisser penser.

Le dépôt contient une application Next.js/PostgreSQL complète avec authentification, rôles, modèle Prisma riche, référentiels collaborateurs/activités/bureaux/compétences, disponibilités, historique, statistiques, tâches collectives et surtout un **vrai moteur de placement** séparé de l'interface et de la base.

Le moteur applique des contraintes obligatoires, calcule un score de candidature, tient compte de l'équité des tâches collectives et produit des explications lisibles. Les modifications manuelles réutilisent les mêmes contrôles et les dérogations restent visibles/auditées.

Ce n'est donc pas une maquette vide.

Mais l'objectif de Labz n'est pas de récompenser la quantité de code. L'outil est né comme **exploration d'une question d'organisation d'atelier**, n'a pas été validé par un usage opérationnel réel et manipulerait, s'il était déployé, des données collaborateurs sensibles. La base qualité actuelle n'est pas suffisante pour le présenter comme solution métier prête à l'emploi : pas de CI, tests concentrés sur le moteur, pas de recette navigateur/version déployée, pas de cadre de conservation/confidentialité documenté.

La décision recommandée reste donc : **retirer AtelierFlow du catalogue principal Labz**, mais conserver le dépôt et éventuellement le présenter plus tard dans une section « Explorations » comme exemple de formalisation d'un problème organisationnel en contraintes explicables.

---

## Ce qui existe réellement

### Application métier complète

Le dépôt contient des écrans pour :

- tableau de bord ;
- planning ;
- présences ;
- équipe ;
- compétences ;
- activités ;
- bureaux ;
- tâches collectives ;
- historique ;
- statistiques.

L'API couvre les mêmes domaines ainsi que la génération/validation du planning.

Le README parle de 27 routes d'API ; l'arbre audité confirme un backend Next.js réel et non une simple UI statique.

### Modèle de données

Le schéma Prisma modélise notamment :

- utilisateurs et rôles ;
- journal d'audit ;
- collaborateurs ;
- horaires habituels ;
- préférences ;
- activités ;
- bureaux ;
- compétences et niveaux ;
- disponibilités ;
- besoins d'effectifs ;
- snapshots de planning ;
- affectations ;
- tâches collectives et leur historique ;
- règles de planification configurables.

Une contrainte SQL empêche notamment une même personne d'avoir deux affectations sur le même créneau.

---

## Moteur de placement : vrai point fort

Le moteur est volontairement écrit en TypeScript pur et ne dépend ni de Prisma, ni de Next.js, ni de React.

Le contrat `PlanningContext → PlanningResult` permet de remplacer l'heuristique actuelle par un solveur plus avancé sans réécrire l'application.

### Heuristique explicable

`generatePlanning()` :

1. calcule les compteurs d'équité ;
2. identifie les personnes réellement disponibles ;
3. construit les sièges obligatoires et optionnels ;
4. trie les besoins par priorité ;
5. filtre chaque candidat par contraintes dures ;
6. score les candidats restants ;
7. produit une affectation expliquée ;
8. remonte explicitement sièges non pourvus, sous-effectifs et personnes non affectées ;
9. traite les tâches collectives séparément.

Le système ne prétend donc pas qu'un planning incomplet est une solution complète.

### Contraintes partagées avec le manuel

`checkHardConstraints()` est utilisé aussi bien par la génération automatique que par la modification manuelle.

Il contrôle notamment :

- collaborateur actif ;
- disponibilité atelier ;
- horaire habituel ;
- absence de double affectation ;
- disponibilité/compatibilité/capacité du bureau ;
- effectif maximal ;
- expiration de compétence ;
- niveau minimal ;
- apprenant accompagné par un référent lorsque nécessaire.

`validatePlanning()` recontrôle le placement global après coup.

C'est une bonne conception : le drag-and-drop n'introduit pas une deuxième vérité métier différente de celle du moteur.

---

## Dérogations : choix de conception sain

Lors d'un déplacement manuel incompatible, l'API refuse par défaut l'opération.

Un manager peut forcer la décision uniquement avec un `overrideReason`.

Le code :

- conserve la raison ;
- conserve les codes de conflits ignorés dans l'audit ;
- indique que la modification est une dérogation ;
- remet une affectation déjà validée en `DRAFT` ;
- efface sa validation précédente.

La dérogation explique donc l'exception sans faire disparaître le fait qu'une règle a été contournée.

C'est probablement l'un des aspects les plus intéressants du projet du point de vue produit.

---

## Équité : idée intéressante, mais modèle à valider humainement

Le projet ne compte pas simplement le nombre brut de tâches collectives réalisées.

Le dénominateur repose sur les créneaux où une personne était réellement mobilisable à l'atelier, ce qui évite qu'une personne souvent en tournée apparaisse artificiellement comme « sous-participante ».

Le seed de démonstration met volontairement en scène ce problème.

C'est une bonne intuition méthodologique.

Mais la formule de priorité — participation, moyenne d'équipe, récence, fenêtre de 30 jours — reste une **politique organisationnelle conçue pour le prototype**, pas une définition universelle de l'équité.

Avant un vrai déploiement, elle devrait être discutée avec l'équipe et testée sur plusieurs mois réels afin de vérifier qu'elle ne crée pas d'effets pervers ou de sentiment d'injustice.

Labz ne doit donc pas présenter l'outil comme « garantissant l'équité » mais comme **rendant explicites et mesurables des critères de répartition**.

---

## Tests : bons sur le moteur, insuffisants sur l'application

Le dépôt contient une suite Vitest dédiée au moteur de planning.

Les cas couvrent notamment :

- absence ;
- tournée sur un demi-créneau ;
- temps partiel ;
- compétence insuffisante ;
- référent obligatoire ;
- bureau indisponible ;
- sous-effectif ;
- équité des tâches collectives ;
- modification manuelle ;
- plusieurs contraintes simultanées.

Ces tests correspondent directement aux règles métier et constituent une vraie valeur.

### Limite

Aucun test versionné ne couvre de bout en bout :

- login/session ;
- rôles API ;
- CRUD collaborateurs ;
- PostgreSQL/Prisma ;
- génération puis validation réelle en base ;
- drag-and-drop navigateur ;
- dérogation ;
- historique/statistiques ;
- erreurs réseau ;
- responsive/accessibilité.

Les tests démontrent donc surtout la cohérence du **moteur pur**, pas celle du produit complet.

---

## P1 — aucune CI

Aucun workflow `.github/workflows` n'apparaît dans l'arbre audité.

`npm run test` existe, mais rien n'impose automatiquement :

- tests ;
- build Next.js ;
- typecheck ;
- migrations/base de démonstration ;
- recette API.

Pour une exploration locale, ce n'est pas dramatique.

Pour une solution métier manipulant des données d'équipe, ce serait insuffisant.

### Remédiation si reprise

Ajouter au minimum :

1. `npm ci` ;
2. `npm test` ;
3. `npm run build` ;
4. PostgreSQL de test ;
5. quelques tests d'intégration API ;
6. smoke navigateur login → génération → déplacement → validation.

---

## Authentification : base correcte, durcissement nécessaire en production

### Points positifs

- mots de passe bcrypt ;
- cookie `HttpOnly` ;
- `SameSite=Lax` ;
- `Secure` en production ;
- session signée HMAC-SHA256 ;
- expiration 12 h ;
- utilisateur actif revérifié en base ;
- rôles `ADMIN`, `MANAGER`, `EMPLOYEE` ;
- handlers centralisés avec `requireRole()` ;
- message de login identique pour compte absent/mauvais mot de passe.

### P1 — aucun rate limit de connexion

La route de login ne limite pas les tentatives.

Pour un déploiement accessible par Internet, ajouter une protection contre le brute-force : rate limit par IP/compte, délai progressif ou contrôle équivalent.

### P2 — session sans identifiant serveur/révocation fine

Le cookie contient l'ID utilisateur + timestamp signé. Il n'existe pas de table de sessions ni de version/token de session côté utilisateur.

Désactiver le compte invalide bien les sessions au prochain appel, mais il n'est pas possible de révoquer une session individuelle ou de faire « déconnecter tous les appareils » sans modifier le modèle.

Acceptable pour un prototype interne ; à renforcer si déploiement réel.

### P2 — défense CSRF implicite, pas explicite

`SameSite=Lax` et les requêtes JSON réduisent fortement les attaques cross-site triviales, mais le projet ne possède ni token CSRF ni contrôle explicite d'Origin sur les routes mutatrices.

Pour un outil interne, c'est une défense raisonnable de prototype. Pour une vraie application RH exposée, ajouter un contrôle Origin/CSRF serait préférable.

---

## P1 — exposition trop large des données collaborateurs au rôle EMPLOYEE

`GET /api/employees` autorise `ADMIN`, `MANAGER` **et `EMPLOYEE`**, puis renvoie chaque collaborateur avec :

- horaires ;
- compétences ;
- préférences ;
- champs du modèle `Employee`, dont `notes`.

Dans le MVP actuel, il n'existe pas vraiment d'espace collaborateur autonome, et le README dit d'ailleurs que ce périmètre n'est pas inclus.

Si des comptes `EMPLOYEE` étaient réellement distribués, ils auraient donc accès à davantage d'informations sur leurs collègues que ce qui semble nécessaire.

**Avant usage réel :** définir clairement la matrice de données visibles par rôle et utiliser des `select` explicites au lieu de renvoyer le modèle complet.

---

## Données sensibles / confidentialité

Le modèle peut contenir :

- identité des collaborateurs ;
- taux d'emploi ;
- notes libres ;
- horaires ;
- compétences et niveau ;
- préférences ;
- affectations ;
- rendez-vous extérieur ;
- formation ;
- congé ;
- absence ;
- arrêt maladie ;
- historique détaillé des décisions et dérogations.

Cela dépasse largement un simple tableau de placement.

Aucune donnée réelle n'est nécessaire pour la démo, ce qui est positif. Mais un vrai déploiement exigerait de cadrer :

- minimisation des données ;
- durée de conservation ;
- accès par rôle ;
- sauvegardes ;
- droit de rectification ;
- sécurité de l'hébergement ;
- contenu autorisé dans les champs de notes/audit.

L'audit ne considère donc pas AtelierFlow comme prêt à recevoir des données RH réelles.

---

## Pas de déploiement produit démontré

Le README propose :

- Docker local ;
- Codespaces avec PostgreSQL de démonstration.

C'est une bonne démo technique, mais ce n'est pas un déploiement d'application opérationnelle.

Il n'existe pas dans le dépôt audité de :

- workflow de livraison ;
- infrastructure production ;
- configuration reverse proxy/TLS ;
- stratégie de sauvegarde PostgreSQL ;
- observabilité ;
- procédure de mise à jour ;
- recette d'exploitation.

La fiche Labz ne doit donc pas présenter AtelierFlow comme un outil effectivement mis en service dans l'atelier.

---

## Valeur réelle pour le portfolio

La valeur d'AtelierFlow n'est pas « j'ai construit un logiciel RH ».

Elle est plutôt :

> partir d'une situation observée — affectations quotidiennes, compétences, référents, absences, tâches collectives et sentiment d'équité — puis essayer de transformer les arbitrages implicites d'un responsable en règles explicites, contrôlables et expliquées, tout en laissant la décision finale à l'humain.

C'est un bon exemple de **formalisation d'un problème métier**, même si le produit n'a jamais été validé en exploitation.

---

## Présentation Labz recommandée

### Ne plus le garder dans le catalogue principal

Les projets principaux devraient prioriser :

- usage réel ;
- expérience réellement testable ;
- intérêt technique distinctif ;
- ou trajectoire de produit activement poursuivie.

AtelierFlow est aujourd'hui surtout une exploration poussée.

Le garder au même niveau que Sensoria, Million de pixels, Perfoptimize ou une étude de cas réellement utilisée comme Crimson brouillerait cette hiérarchie.

### Bonne place future : « Explorations »

Une section distincte pourrait le présenter brièvement :

**AtelierFlow — exploration d'un assistant de répartition d'atelier**  
Prototype Next.js/PostgreSQL transformant disponibilités, compétences, contraintes et historique de tâches en propositions explicables. L'objectif n'était pas de remplacer le responsable mais de rendre visibles les contraintes et les biais de répartition. Projet non déployé en conditions réelles.

Cette formulation est honnête et conserve ce qui est intéressant sans sur-vendre.

---

## À ne pas sur-vendre

- « utilisé dans l'atelier Lunii » : non établi ;
- « améliore l'équité » : non validé empiriquement ;
- « planning optimal » : faux, le moteur est une heuristique gloutonne ;
- « solution RH prête à l'emploi » : faux ;
- « sécurité production validée » : faux ;
- « application entièrement testée » : les tests couvrent surtout le moteur ;
- « déployé » : Codespaces/local ne constituent pas une mise en production.

---

## Si le projet était repris

Priorité recommandée : **valider le besoin avant d'ajouter du code**.

1. Observer plusieurs semaines de décisions réelles sans automatisation.
2. Identifier les critères réellement utilisés par les responsables.
3. Faire relire les règles d'équité par l'équipe concernée.
4. Tester le moteur en shadow mode : générer une proposition sans influencer la décision.
5. Comparer proposition / décision humaine et noter les raisons des écarts.
6. Réduire éventuellement le modèle aux données strictement nécessaires.
7. Ensuite seulement durcir auth, permissions, CI, tests d'intégration et hébergement.

Un solveur OR-Tools n'a d'intérêt qu'après validation des règles ; optimiser parfaitement une mauvaise formalisation ne ferait qu'automatiser le mauvais problème.

## Décision finale

**Retirer AtelierFlow du catalogue actif Labz, conserver le dépôt et le classer comme exploration.**

L'audit améliore néanmoins nettement la lecture du projet : ce n'est pas une idée jetée en code. Le moteur, l'explicabilité, les dérogations et le calcul d'équité montrent une vraie réflexion de conception.

Mais le critère décisif reste l'usage : sans déploiement ni validation par les personnes concernées, AtelierFlow doit être présenté comme **une hypothèse métier bien prototypée**, pas comme une solution démontrée.