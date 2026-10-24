# Audit pré-intégration Labz — Perfoptimize

**Dépôt audité :** `MathieuBal/Perfoptimize`  
**Révision :** `b4e812d6b09e573fe81667551f3cd2531b559906`  
**Date :** 24 octobre 2026  
**Statut proposé :** **conserver dans Labz · alpha Windows publique/testable, techniquement forte mais encore à durcir pour une diffusion grand public**

## Verdict

`Perfoptimize` est l'un des projets les plus solides techniquement du portfolio actuel.

Le dépôt ne contient pas seulement une interface de recommandations : il possède un moteur partagé entre CLI et application de bureau, détection matérielle, découverte de jeux, lecture de configurations, télémétrie, analyse de frametimes PresentMon, diagnostic de goulots, historique SQLite, recommandations, sauvegarde/restauration de configurations, analyse d'incidents Windows, réseau, moniteur continu et distribution Windows autonome.

Le niveau de discipline est également supérieur à la moyenne du portfolio : nombreux tests .NET, CI Linux + Windows, tests d'endpoints, paquet Windows auto-contenu et publication d'une alpha avec checksum SHA-256.

La révision auditée possède une CI verte et le workflow de packaging alpha Windows a également abouti avec succès.

Le statut Labz conseillé est donc **alpha Windows testable**, pas simple prototype conceptuel.

Les principales remédiations avant de parler de logiciel grand public concernent surtout la chaîne de confiance : signature du binaire, validation d'intégrité de PresentMon téléchargé, durcissement de l'API locale et validation sur davantage de vraies configurations matérielles.

---

## Architecture réelle

Le dépôt est structuré en trois couches principales :

- `Perfoptimize.Core` : logique métier partagée ;
- `Perfoptimize.Cli` : interface ligne de commande ;
- `Perfoptimize.App` : application locale ASP.NET + cockpit web embarqué.

Le Core contient notamment des modules dédiés à :

- matériel ;
- détection de jeux ;
- profils ;
- scan Steam/Epic ;
- configs ;
- monitoring ;
- frametimes ;
- optimisation ;
- diagnostic ;
- incidents ;
- réseau ;
- stockage de sessions ;
- outils externes.

Cette séparation justifie l'affirmation selon laquelle la CLI et l'UI utilisent le même moteur plutôt que deux implémentations différentes.

---

## Application locale

### Bon choix de sécurité par défaut

Le serveur ASP.NET écoute sur :

`http://127.0.0.1:0`

Donc :

- loopback uniquement ;
- port éphémère ;
- pas d'exposition LAN par défaut ;
- faible risque de conflit de port.

L'application ouvre ensuite le navigateur sur cette adresse locale.

C'est une architecture raisonnable pour distribuer une UI web avec un outil système Windows sans embarquer un moteur navigateur complet.

### Service de monitoring

`LiveMonitorHostedService` tourne côté processus de bureau indépendamment de la vue affichée. Le cockpit lit donc un état produit côté application et ne dépend pas de timers JavaScript pour effectuer les mesures machine.

---

## Qualité et CI

### Suite de tests

Le dépôt possède une suite xUnit importante couvrant notamment :

- détection de goulot ;
- recommandations ;
- sémantique des réglages ;
- application/restauration de configs ;
- écritures sûres ;
- stockage de sessions ;
- détection de jeu ;
- scan Steam/Epic ;
- parsers Linux/Windows ;
- frametimes ;
- PresentMon ;
- diagnostics v2/v3 ;
- incidents ;
- réseau ;
- alertes ;
- boucle d'optimisation ;
- garde-fous de `tune` ;
- endpoints de l'application.

Les smoke tests ASP.NET démarrent la vraie application en mémoire et vérifient les principaux endpoints ainsi que les assets embarqués.

### CI multi-OS

`.github/workflows/ci.yml` exécute sur **Ubuntu et Windows** :

1. restore ;
2. build Release ;
3. tests Release.

Le dernier run de la révision auditée est vert.

C'est une vraie force du projet.

### Limite de la CI

Même sur un runner Windows, GitHub Actions ne reproduit pas un PC de jeu réel :

- pas de charge GPU de jeu représentative ;
- pas de parc NVIDIA/AMD/Intel ;
- pas de laptop hybride ;
- températures/capteurs réels limités ;
- DPC/ISR et événements système non représentatifs ;
- diversité de pilotes absente.

La CI protège très bien la **logique et le câblage**, mais elle ne prouve pas la justesse de toutes les mesures matérielles sur toutes les machines.

Labz doit conserver cette nuance.

---

## Écriture des configurations : garde-fous solides

La partie la plus sensible du produit — modifier les fichiers de configuration des jeux — possède plusieurs protections importantes.

### Prévisualisation par défaut

`SettingsApplier.Apply(..., write: false)` ne fait qu'établir le plan.

L'écriture demande donc un chemin explicite.

### Sauvegarde avant modification

Chaque fichier modifié est sauvegardé avant écriture.

L'application conserve le backup exact créé pendant cette application, ce qui permet de restaurer **cette opération précise** plutôt qu'une sauvegarde arbitraire plus récente.

### Écriture atomique et encodage

Le code :

- détecte l'encodage original ;
- génère le nouveau texte ;
- remplace le fichier atomiquement.

### Rollback en cas d'erreur

Si plusieurs fichiers sont concernés et qu'une écriture échoue, les fichiers déjà modifiés dans cette tentative sont restaurés depuis leurs sauvegardes fraîches.

### Refus si le jeu tourne

L'endpoint `/api/apply` refuse l'écriture si le jeu concerné est actuellement lancé afin d'éviter que le jeu réécrive sa configuration en quittant.

La restauration possède la même protection.

### Plan figé

Le cockpit applique le plan exact enregistré lors de l'analyse : fichier, section, clé, valeur observée et valeur proposée.

Si la configuration a changé depuis l'analyse, le plan est refusé plutôt que partiellement adapté ou recalculé silencieusement.

C'est un excellent garde-fou pour un outil qui touche aux fichiers utilisateur.

---

## Distribution Windows alpha

Le workflow `Alpha Windows package` :

- tourne sur Windows ;
- exécute les tests ;
- publie une app `win-x64` self-contained ;
- génère un exécutable single-file ;
- crée une archive ZIP ;
- génère un SHA-256 du ZIP ;
- publie le téléchargement via GitHub Pages.

La révision auditée a produit ce paquet avec succès.

### P1 — binaire non signé

Le workflow précise lui-même que l'alpha n'est pas signée et que SmartScreen peut afficher un avertissement.

Pour des testeurs techniques, c'est acceptable.

Pour une diffusion grand public d'un outil qui analyse la machine, lit des configurations et peut lancer un exécutable de mesure, la signature de code devient importante pour :

- identifier l'éditeur ;
- réduire les avertissements SmartScreen ;
- donner un signal de confiance au téléchargement.

**Avant un statut autre qu'alpha :** signer l'exécutable/package Windows.

---

## P1 — installation PresentMon : intégrité à renforcer

Perfoptimize peut installer PresentMon directement depuis l'interface.

Points positifs :

- source codée en dur vers le dépôt officiel `GameTechDev/PresentMon` ;
- URL non contrôlée par l'utilisateur ;
- sélection du build console ;
- exclusion des variantes Overlay / Service ;
- installation dans le dossier local de Perfoptimize.

Cependant, après téléchargement, le code **ne valide ni checksum attendu, ni signature Authenticode, ni signature cryptographique du binaire**.

Il fait donc confiance à HTTPS + GitHub Releases + métadonnées de la release.

Pour un exécutable tiers qui sera ensuite lancé pour mesurer les frametimes, c'est une chaîne de confiance perfectible.

### Remédiation recommandée

Au minimum :

1. vérifier la signature Authenticode attendue lorsque disponible ;
2. ou valider un hash publié par l'éditeur ;
3. afficher clairement source + version installée ;
4. conserver une confirmation utilisateur avant téléchargement/installation.

---

## P2 — durcir les endpoints locaux modifiant la machine

L'application bénéficie déjà de protections importantes :

- loopback uniquement ;
- port aléatoire ;
- endpoints d'écriture en POST ;
- plusieurs POST sensibles attendent du JSON, ce qui limite les soumissions cross-origin triviales.

Mais les endpoints locaux ne possèdent pas de jeton de session local ni de vérification explicite de l'`Origin` pour les actions sensibles.

Certaines actions sans corps, par exemple :

- installation de PresentMon ;
- arrêt de l'application,

mériteraient un garde-fou supplémentaire si le port local était découvert par un autre contexte navigateur.

Ce n'est pas une vulnérabilité distante démontrée par cet audit : le port éphémère et le loopback réduisent déjà fortement la surface. C'est une **défense en profondeur** cohérente avec la puissance de l'application.

### Remédiation possible

Générer au démarrage un token local aléatoire injecté dans l'UI et exigé sur tous les endpoints mutateurs, ou contrôler strictement Host/Origin.

---

## Rapport alpha / vie privée

Le rapport d'assistance exporté exclut explicitement :

- nom d'utilisateur Windows ;
- chemins absolus de configuration.

Le plan conserve les chemins logiques relatifs définis dans les profils, pas les chemins résolus du PC.

L'export se fait uniquement après clic utilisateur.

### Formulation à améliorer : « anonymisé »

Le rapport contient cependant :

- modèle CPU ;
- GPU(s) ;
- versions de pilotes ;
- RAM ;
- résolutions/rafraîchissements d'écrans ;
- stockage ;
- OS ;
- métriques de la session.

Cette combinaison peut être assez distinctive pour servir d'empreinte technique d'une machine.

Il serait donc plus précis de parler de :

**« rapport technique sans nom d'utilisateur ni chemins absolus »**

plutôt que de promettre un rapport « anonymisé » au sens fort.

---

## Diagnostic et recommandations : bien distinguer mesure et connaissance

Le code fait un effort intéressant pour attribuer un **niveau de preuve** aux réglages et ne pas prétendre que toute recommandation est mesurée localement.

Les réglages peuvent être décrits comme :

- estimés ;
- validés communautairement ;
- benchmarkés ;
- mesurés localement.

La logique supporte aussi des actions différentes de « baisser » : garder activé, tester des alternatives ou modifier manuellement.

C'est une bonne protection contre le classique « optimiseur » qui prétend améliorer arbitrairement toute configuration.

### À maintenir

Les advisories communautaires vieillissent avec :

- patches de jeux ;
- pilotes ;
- nouvelles versions DLSS/FSR ;
- changements de moteurs.

Si Perfoptimize continue à évoluer, chaque advisory gagnerait à porter provenance/date/version ou au minimum une date de dernière vérification.

---

## Licence

Aucun fichier `LICENSE` n'apparaît dans l'arbre audité.

Pour un dépôt public aussi structuré, choisir explicitement si le code est :

- visible uniquement ;
- réutilisable ;
- contributif.

La licence de PresentMon reste bien sûr distincte de celle de Perfoptimize.

---

## Présentation Labz : affirmations validées

La fiche peut honnêtement dire que Perfoptimize :

- est une application Windows d'analyse et d'optimisation orientée jeu ;
- possède un moteur .NET partagé entre CLI et UI ;
- détecte matériel et jeux ;
- scanne les bibliothèques Steam/Epic ;
- analyse des configurations ;
- exploite PresentMon pour les FPS/frametimes lorsque disponible ;
- conserve un historique local SQLite ;
- produit des diagnostics et recommandations avec niveaux de preuve ;
- peut prévisualiser puis appliquer certaines modifications de configuration ;
- sauvegarde les fichiers avant écriture et permet leur restauration ;
- refuse d'appliquer/restaurer pendant que le jeu tourne ;
- possède un moniteur continu local ;
- contient des modules de diagnostic incidents/réseau ;
- possède une suite de tests importante ;
- est testé en CI sur Linux et Windows ;
- possède une alpha Windows x64 self-contained téléchargeable ;
- écoute uniquement sur loopback avec un port local éphémère.

## À ne pas sur-vendre

- « optimisation automatique universelle de tous les jeux » : faux ; l'application distingue profils détaillés et analyse générique ;
- « gains FPS garantis » : faux ; le projet distingue estimations, données communautaires et mesures locales ;
- « toutes les métriques fonctionnent sur tous les PC » : non démontré ; certains capteurs sont optionnels ;
- « entièrement validé sur parc matériel réel » : non ; la CI ne remplace pas des machines de jeu variées ;
- « téléchargement tiers vérifié cryptographiquement » : faux actuellement pour PresentMon ;
- « application Windows signée » : faux actuellement ;
- « rapport totalement anonyme » : formulation trop forte compte tenu du niveau de détail matériel.

---

## Plan de remédiation prioritaire

1. **Signer l'exécutable Windows** avant toute diffusion grand public.
2. **Vérifier l'intégrité/signature de PresentMon** avant installation.
3. Ajouter un **token local/contrôle Origin** aux endpoints mutateurs comme défense en profondeur.
4. Tester l'application sur un petit parc réel : NVIDIA, AMD, Intel, laptop hybride, plusieurs versions Windows.
5. Documenter les résultats réels des capteurs absents/partiels par plateforme.
6. Renommer la promesse du rapport alpha en « rapport technique sans données nominatives directes / chemins absolus ».
7. Versionner/date les connaissances communautaires sensibles aux patches.
8. Ajouter une licence explicite si la réutilisation du code est souhaitée.

## Décision finale

**Perfoptimize reste dans Labz et mérite un statut plus fort que simple prototype : `Alpha Windows · testable`.**

C'est un projet particulièrement intéressant parce que son ambition pourrait facilement conduire à un faux « booster PC » rempli de promesses invérifiables. Le code audité fait au contraire plusieurs choix sérieux : niveaux de preuve, preview avant écriture, plans figés, backups, rollback, refus si le jeu tourne, métriques nullables et tests nombreux.

La prochaine étape n'est pas une réécriture. Elle consiste surtout à **augmenter la confiance de distribution et la validation matérielle réelle** : signature, chaîne de confiance PresentMon, sécurité locale défensive et retours de plusieurs configurations Windows.