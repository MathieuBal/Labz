# Plan de développement Labz

**Créé : 21 octobre 2026**  
**Dernière mise à jour : 26 octobre 2026**  
**Version de référence : v0.18.12**

## Objectif produit

Labz doit permettre de :

1. comprendre ce qu’est réellement un projet ;
2. essayer honnêtement ce qui peut l’être ;
3. envoyer un retour privé simplement ;
4. transformer ces retours en décisions utiles sur la suite du portefeuille.

Une fonctionnalité qui n’améliore aucun de ces quatre axes doit être différée sauf besoin explicite.

## État actuel

La plateforme possède :

- douze fiches éditoriales ;
- sept accès directs ;
- pages riches adaptées aux produits, suites, études de cas et R&D ;
- pages statiques projet générées pour l’indexation et le partage ;
- favoris et historique locaux ;
- journal de versions ;
- activité GitHub publique bornée ;
- feedback privé Supabase ;
- reprise des brouillons et relances idempotentes ;
- administration propriétaire ;
- sujets durables distincts des messages bruts ;
- impact, effort, état et historique de décisions ;
- maximum trois sujets `en cours` garanti en base ;
- CI, versioning et déploiement GitHub Pages.

La v0.18.9 a remboursé la dette de synchronisation du catalogue et du feedback. La v0.18.10 a retiré les modules projet lourds du chargement initial. La v0.18.11 a donné une vraie URL publique aux douze projets sans changer d’hébergement. La v0.18.12 ajoute le flux Retours → Sujets → Décisions.

## Priorité 1 | Tests navigateur ciblés

Le plus gros angle mort restant est maintenant la recette réelle dans un navigateur.

Ajouter quelques E2E qui couvrent les invariants que les tests unitaires et contractuels ne peuvent pas garantir :

- accueil → fiche projet ;
- navigation mobile ;
- formulaire feedback ;
- erreur réseau puis reprise ;
- rendu d’une page riche ;
- ouverture d’une vraie URL `/projets/.../` puis arrivée sur la bonne fiche ;
- connexion admin simulée ;
- création d’un sujet depuis un retour ;
- décision et blocage du quatrième sujet `en cours` côté interface.

L’objectif n’est pas une grosse suite E2E. Quelques parcours critiques bien choisis valent davantage qu’un grand volume de tests fragiles.

### Validation attendue

- exécution automatisée dans un vrai moteur navigateur ;
- échec explicite si une navigation, un formulaire ou un rendu critique casse ;
- pas de faux test mobile annoncé comme recette appareil réel ;
- temps d’exécution raisonnable dans la CI.

## Priorité 2 | Administration autonome

### Récupération d’accès

Intégrer un parcours de récupération de mot de passe propriétaire compatible avec Supabase Auth et les redirections réelles de Labz.

Ne jamais demander, stocker ou transmettre un mot de passe dans la conversation ou le dépôt.

### Recette propriétaire réelle

Valider le parcours avec le vrai compte propriétaire dans un navigateur réel, puis sur téléphone. Cette recette doit rester distincte des tests automatisés.

### Cycle de vie des messages bruts

La rétention de 90 jours reste pilotée par la réception de nouveaux retours. Les sujets et décisions survivent déjà à la suppression des messages source grâce à la séparation introduite en v0.18.12.

À surveiller avant toute évolution :

- besoin réel d’une purge plus proactive ;
- capacité maximale de 500 messages ;
- sauvegarde avant toute suppression destructive ;
- absence de copie inutile de données privées dans les synthèses.

### Protection contre les abus

Le quota global protège le stockage mais peut être saturé. N’ajouter CAPTCHA ou mécanisme équivalent qu’en réponse à un risque réel ou à une hausse de trafic mesurée.

## Priorité 3 | Qualité de la vitrine

Avant d’ajouter de nouvelles fiches :

- remplacer progressivement les illustrations génériques par des preuves visuelles réelles ;
- figer les ressources externes importantes au lieu de dépendre de fichiers `main` d’un autre dépôt ;
- vérifier périodiquement les liens et téléchargements publics ;
- améliorer les images sociales projet par projet seulement lorsque des visuels réels de bonne qualité existent ;
- garder l’architecture GitHub Pages légère tant qu’elle répond au besoin.

Le SEO structurel n’est plus une priorité forte : les projets disposent maintenant d’URLs statiques, de métadonnées propres, d’un sitemap et d’un partage sans hash. Une stratégie SEO éditoriale plus lourde aurait aujourd’hui un rendement faible pour un portfolio personnel.

## Dette technique restante

### Front

L’architecture vanilla reste adaptée à la taille actuelle et ne justifie pas une migration de framework. Les dettes restantes doivent être traitées localement :

- `app.js` concentre encore plusieurs responsabilités ;
- les pages riches et galeries utilisent encore des `MutationObserver` pour se greffer après le rendu principal ;
- `navigation-fixes.js` compense explicitement certains comportements de scroll ;
- l’administration reste rendue par chaînes HTML et mérite surtout des tests navigateur avant un éventuel refactoring.

Les modules riches sont déjà chargés à la demande depuis la v0.18.10. Ne pas réintroduire leur chargement global.

Ordre recommandé : mesurer d’abord, ajouter les E2E, puis remplacer progressivement les coordinations implicites par des points d’extension explicites. Ne pas réécrire l’application uniquement pour obtenir une architecture plus « moderne ».

### Supabase

Le modèle Retours → Sujets → Décisions est maintenant en production avec RLS, triggers privés et limite WIP transactionnelle.

Durcissements encore utiles :

- activer la protection contre les mots de passe compromis si le plan et la configuration le permettent ;
- conserver les nouvelles tables avec grants explicites, car Supabase retire progressivement l’exposition automatique des nouvelles tables ;
- continuer à lancer les advisors après chaque migration sensible.

## Publication éventuelle des décisions

Les sujets et décisions sont privés. Si Labz publie un jour une roadmap ou des décisions :

- créer un objet public distinct et volontaire ;
- ne jamais publier automatiquement un retour brut ;
- ne jamais exposer le pseudo du visiteur par défaut ;
- rédiger une synthèse propre pour le public ;
- permettre de garder une décision entièrement privée.

Ce chantier n’est pas prioritaire tant qu’un besoin réel de communication publique n’est pas observé.

## Règles de validation communes

Pour toute livraison applicative :

```sh
npm run check
npm run build
node scripts/check-pages.mjs
```

Puis vérifier la CI, le déploiement Pages et la version réellement publiée.

Règles permanentes :

- préserver les changements distants existants ;
- une modification applicative visible exige une nouvelle version et une note ;
- ne jamais annoncer un test mobile, connecté ou de sécurité non réalisé ;
- ne pas confondre activité GitHub et avancement produit ;
- ne pas introduire une deuxième source de vérité pour une donnée déjà portée par `catalog.js` ;
- aucun dépôt privé ne devient public automatiquement ;
- les retours utilisateurs peuvent diminuer une priorité autant que l’augmenter ;
- maximum trois sujets Labz réellement actifs en parallèle.

## Ordre recommandé après v0.18.12

1. quelques vrais tests navigateur ;
2. récupération propriétaire et recette réelle ;
3. amélioration progressive des preuves visuelles ;
4. refactoring ciblé des coordinations `MutationObserver` seulement si les tests rendent l’opération sûre.
