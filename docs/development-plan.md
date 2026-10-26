# Plan de développement Labz

**Créé : 21 octobre 2026**  
**Dernière mise à jour : 26 octobre 2026**  
**Version de référence : v0.18.15**

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
- suppression manuelle des retours non pertinents ;
- sujets durables distincts des messages bruts ;
- impact, effort, état et historique de décisions ;
- maximum trois sujets `en cours` garanti en base ;
- tests Node et parcours Playwright Chromium ;
- CI, versioning et déploiement GitHub Pages.

Les évolutions récentes ont remboursé la dette de synchronisation du catalogue, allégé le chargement initial, donné une vraie URL publique aux projets, ajouté le flux Retours → Sujets → Décisions puis intégré les parcours critiques dans un vrai navigateur.

## Priorité 1 | Administration autonome et sécurité d’accès

### Récupération d’accès

Intégrer un parcours de récupération de mot de passe propriétaire compatible avec Supabase Auth et les redirections réelles de Labz.

Ne jamais demander, stocker ou transmettre un mot de passe dans la conversation ou le dépôt.

### Protection des mots de passe

La protection Supabase contre les mots de passe compromis est encore désactivée. L’activer et vérifier le parcours de connexion réel avant de considérer ce point fermé.

### Recette propriétaire réelle

Valider le parcours avec le vrai compte propriétaire dans un navigateur desktop, puis sur téléphone physique. Cette recette doit rester distincte des tests automatisés et ne doit jamais créer de données factices sans nettoyage explicite.

## Priorité 2 | Qualité de la vitrine

Avant d’ajouter de nouvelles fiches :

- remplacer progressivement les illustrations génériques par des preuves visuelles réelles ;
- figer les ressources externes importantes au lieu de dépendre de fichiers `main` d’un autre dépôt ;
- vérifier périodiquement les liens et téléchargements publics ;
- améliorer les images sociales projet par projet seulement lorsque des visuels réels de bonne qualité existent ;
- garder l’architecture GitHub Pages légère tant qu’elle répond au besoin.

Le SEO structurel n’est plus une priorité forte : les projets disposent maintenant d’URLs statiques, de métadonnées propres, d’un sitemap et d’un partage sans hash. Une stratégie SEO éditoriale plus lourde aurait aujourd’hui un rendement faible pour un portfolio personnel.

## Priorité 3 | Qualité navigateur et accessibilité

Les parcours critiques sont maintenant testés dans Chromium, avec une émulation Pixel 7 pour la navigation mobile. Ne pas transformer cette base en grosse suite fragile.

Prochaines améliorations possibles seulement si elles répondent à un risque réel :

- ajouter un contrôle d’accessibilité navigateur ciblé sur les pages principales ;
- ajouter un petit smoke WebKit ou Firefox si une incompatibilité apparaît ou si le public le justifie ;
- conserver traces et captures uniquement en cas d’échec ;
- continuer à distinguer émulation mobile et appareil physique.

## Cycle de vie des messages bruts

La rétention de 90 jours reste pilotée par la réception de nouveaux retours. Les sujets et décisions survivent à la suppression des messages source. L’administrateur peut également supprimer immédiatement un retour non pertinent.

À surveiller avant toute évolution :

- besoin réel d’une purge plus proactive ;
- capacité maximale de 500 messages ;
- absence de copie inutile de données privées dans les synthèses ;
- éventuel besoin de protection anti-abus plus forte si le trafic augmente.

Le quota global protège le stockage mais peut être saturé. N’ajouter CAPTCHA ou mécanisme équivalent qu’en réponse à un risque réel ou à une hausse de trafic mesurée.

## Dette technique restante

### Front

L’architecture vanilla reste adaptée à la taille actuelle et ne justifie pas une migration de framework. Les dettes restantes doivent être traitées localement :

- `app.js` concentre encore plusieurs responsabilités ;
- les pages riches et galeries utilisent encore des `MutationObserver` pour se greffer après le rendu principal ;
- `navigation-fixes.js` compense explicitement certains comportements de scroll avec plusieurs réinitialisations temporisées ;
- l’administration reste rendue par chaînes HTML.

Les modules riches sont chargés à la demande depuis la v0.18.10. Ne pas réintroduire leur chargement global.

Ordre recommandé : conserver les E2E comme filet, puis remplacer progressivement les coordinations implicites par des points d’extension explicites seulement lorsqu’une modification fonctionnelle touche déjà cette zone. Ne pas réécrire l’application uniquement pour obtenir une architecture plus moderne.

### Supabase

Le modèle Retours → Sujets → Décisions est en production avec RLS, triggers privés, limite WIP transactionnelle et suppression admin des messages bruts.

Durcissements encore utiles :

- activer la protection contre les mots de passe compromis ;
- conserver des grants explicites sur les nouvelles tables et fonctions ;
- continuer à lancer les advisors après chaque migration sensible ;
- garder `labz_feedback_quota` inaccessible au navigateur, même si l’advisor signale volontairement RLS sans policy ;
- ne pas supprimer les index récents sur la seule base du lint `unused_index` tant qu’ils n’ont pas reçu de trafic représentatif.

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
npm ci
npm run check
npm run build
node scripts/check-pages.mjs
npm run e2e
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

## Ordre recommandé après v0.18.15

1. récupération propriétaire + protection contre les mots de passe compromis ;
2. recette ponctuelle sur vrais appareils ;
3. amélioration progressive des preuves visuelles et des assets externes ;
4. accessibilité navigateur ciblée ;
5. refactoring local des coordinations `MutationObserver` uniquement lorsqu’un besoin fonctionnel rend l’opération utile.
