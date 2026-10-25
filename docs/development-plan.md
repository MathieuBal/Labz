# Plan de développement Labz

**Créé : 21 octobre 2026**  
**Dernière mise à jour : 25 octobre 2026**  
**Version de référence : v0.18.9**

## Objectif produit

Labz doit permettre de :

1. comprendre ce qu’est réellement un projet ;
2. essayer honnêtement ce qui peut l’être ;
3. envoyer un retour privé simplement ;
4. transformer ensuite ces retours en décisions utiles sur la suite du portefeuille.

Une fonctionnalité qui n’améliore aucun de ces quatre axes doit être différée sauf besoin explicite.

## État actuel

La plateforme possède :

- douze fiches éditoriales ;
- sept accès directs ;
- pages riches adaptées aux produits, suites, études de cas et R&D ;
- favoris et historique locaux ;
- journal de versions ;
- activité GitHub publique bornée ;
- feedback privé Supabase ;
- reprise des brouillons et relances idempotentes ;
- boîte d’administration propriétaire ;
- statuts Nouveau / En cours / Traité ;
- compteurs et capacité ;
- CI, versioning et déploiement GitHub Pages.

La v0.18.9 a remboursé une dette importante : `catalog.js` est à nouveau la source canonique des statuts, accès et guides essentiels, et le backend feedback ne maintient plus une ancienne whitelist de projets susceptible de diverger du catalogue.

## Priorité 1 | Retours vers décisions

C’est le prochain différenciateur réel de Labz.

Créer des sujets privés distincts des messages bruts :

- projet ;
- problème ou opportunité ;
- résultat attendu ;
- retours liés ;
- impact ;
- effort ;
- justification ;
- décision ;
- état.

États proposés : `à étudier`, `en cours`, `différé`, `abandonné`, `livré`.

Conserver un maximum de trois sujets `en cours` simultanément, garanti en base y compris lors de requêtes concurrentes.

La synthèse et la décision doivent survivre à l’expiration éventuelle des messages bruts. Ne pas recopier inutilement les textes visiteurs dans les décisions.

### Validation attendue

- regrouper plusieurs retours dans un sujet ;
- retrouver une décision différée ;
- garder une synthèse après purge des sources ;
- aucun accès public aux messages, sujets ou pseudonymes ;
- aucun dépassement concurrent de la limite des trois sujets actifs.

## Priorité 2 | Administration autonome

### Récupération d’accès

Intégrer un parcours de récupération de mot de passe propriétaire compatible avec Supabase Auth et les redirections réelles de Labz.

Ne jamais demander, stocker ou transmettre un mot de passe dans la conversation ou le dépôt.

### Capacité et purge

Le statut `Traité` ne libère actuellement pas de place. Il faut définir une règle explicite de cycle de vie : archivage, synthèse conservée, puis suppression sûre des messages bruts si nécessaire.

Avant toute suppression réelle : sauvegarde vérifiée, aperçu de l’action et possibilité de revenir en arrière lorsque c’est raisonnable.

### Protection contre les abus

Le quota global protège le stockage mais peut être saturé. N’ajouter CAPTCHA ou mécanisme équivalent qu’en réponse à un risque réel ou à une hausse de trafic mesurée.

### Validation attendue

- propriétaire réel ;
- compte authentifié sans droits ;
- expiration pendant requête ;
- récupération d’accès ;
- recette mobile réelle ;
- capacité effectivement libérée après le cycle choisi.

## Priorité 3 | Qualité de la vitrine

Avant d’ajouter de nouvelles fiches :

- remplacer progressivement les illustrations génériques par des preuves visuelles réelles ;
- figer les ressources externes importantes au lieu de dépendre de fichiers `main` d’un autre dépôt ;
- vérifier périodiquement les liens et téléchargements publics ;
- améliorer les métadonnées sociales et le partage par projet si Labz devient un outil de candidature ou de diffusion régulière ;
- ajouter une validation navigateur/accessibilité ciblée plutôt que multiplier les assertions textuelles.

## Dette technique restante

### Front

L’architecture vanilla reste adaptée à la taille actuelle et ne justifie pas une migration de framework. Les dettes restantes doivent être traitées localement :

- `app.js` concentre encore plusieurs responsabilités ;
- les pages riches et galeries utilisent des `MutationObserver` pour se greffer après le rendu principal ;
- `navigation-fixes.js` compense encore explicitement certains comportements de scroll ;
- les longs récits sont chargés même lorsque le visiteur reste sur l’accueil.

Ordre recommandé : mesurer d’abord, puis remplacer progressivement les coordinations implicites par des points d’extension explicites. Ne pas réécrire l’application uniquement pour obtenir une architecture plus « moderne ».

### Tests

Le test de contrat catalogue → feedback ajouté en v0.18.9 ferme l’angle mort qui avait laissé six fiches incapables d’envoyer un avis malgré une CI verte.

Étape suivante : quelques vrais tests navigateur couvrant les parcours critiques :

- accueil → fiche ;
- navigation mobile ;
- formulaire feedback ;
- erreur réseau / accusé reçu ;
- rendu d’une page riche ;
- connexion admin simulée et changement de statut.

L’objectif n’est pas un grand volume d’E2E, mais une couverture des invariants que les tests de source ne peuvent pas garantir.

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
- les retours utilisateurs peuvent diminuer une priorité autant que l’augmenter.

## Maximum de travail simultané

Maximum trois sujets Labz réellement actifs en parallèle.

Ordre recommandé après v0.18.9 :

1. modèle Retours → Décisions ;
2. récupération propriétaire + cycle de vie des messages ;
3. tests navigateur ciblés et amélioration des preuves visuelles.
