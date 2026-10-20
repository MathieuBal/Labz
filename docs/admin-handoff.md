# Administration Labz — reprise du 20 octobre 2026

## État réel
- Base de départ : main, ed4bc9337f15957139cdd6ee11c1615a5c74d517.
- Aucun AGENTS.md présent dans l'arbre du dépôt. README et docs/feedback-roadmap.md lus.
- v0.7 : interface prête pour publication après CI, sur demande explicite de Mathieu. L'activation du propriétaire reste une étape distincte ; aucun accès privé n'est ouvert par cette publication.
- Migration labz_admin_inbox appliquée au projet existant kforawentogotkizxldl (version serveur 20261020210907).
- Aucun administrateur réel attribué. La recherche ciblée de l'adresse fournie par Mathieu n'a trouvé aucun compte.
- L'environnement d'exécution local était indisponible. Aucun clone local, serveur de prévisualisation ou navigateur de test n'a pu être lancé.

## Interface
Route #/admin, lien de pied de page, connexion par e-mail/mot de passe Supabase Auth.
Pas d'inscription publique ni de mécanisme du premier inscrit administrateur.
Liste complète (limite existante : 500 messages), recherche insensible aux accents,
filtres projet/statut, compteurs globaux, statuts Nouveau / En cours / Traité.
États chargement, vide, filtre sans résultat, erreur, compte non autorisé et session expirée.
Texte des visiteurs échappé avant insertion HTML ; aucune interprétation Markdown ou lien automatique.
Les jetons et messages restent en mémoire : rechargement ou sortie de la route ferme l'accès local.
Pas de refresh token conservé ; reconnexion explicite à expiration.
Déconnexion : effacement immédiat, interruption des requêtes, invalidation des réponses tardives,
puis tentative de révocation Auth. Une panne de révocation n'empêche pas l'effacement local.
Comme pour tout JWT, un access token déjà émis reste valide jusqu'à expiration côté serveur.
Seule une clé publique publishable est embarquée.

## Autorisation en base
labz_admins associe explicitement un identifiant Auth à des droits.
Un utilisateur authentifié ne peut consulter que sa propre appartenance, sans la modifier.
Les politiques de labz_feedback exigent cette appartenance.
Le rôle authenticated ne peut modifier que la colonne status, parmi trois valeurs imposées.
La réception publique, les quotas et la purge existants restent inchangés.

## Vérifications
Réalisées dans la base déployée, avec fixtures intégralement annulées par ROLLBACK :
- anonyme : SELECT et UPDATE interdits ;
- utilisateur sans droits : aucun retour lisible ou modifiable ;
- auto-promotion dans labz_admins interdite ;
- administrateur synthétique : lecture et passage new → in_progress → done ;
- modification du message et statut invalide refusés.
L'advisor Supabase n'indique que labz_feedback_quota sans politique : refus voulu pour cette table serveur.
Les tests Node de cette branche couvrent filtres, échappement, statut confirmé, compte refusé,
retours tardifs après déconnexion (lecture, connexion, écriture), expiration, erreur réseau et absence de ligne modifiée.
Exécution confirmée sur GitHub Actions : 23 tests réussis (dont 9 nouveaux), zéro échec.
Compilation et chemins Pages validés. Run : https://github.com/MathieuBal/Labz/actions/runs/39498690135
Commit de code testé : 99ec19d20c2ea936b2b3f3f07cdcc04bab29b5ad. Job deploy volontairement ignoré sur PR.
Contrôle après ROLLBACK : zéro administrateur attribué, zéro message/compte de test restant.
Non réalisés : parcours HTTP avec le vrai propriétaire, invitation Auth, contrôle DOM/XSS dans un navigateur,
rendu mobile/ordinateur, saisie clavier et gestion du focus après changement de statut.

## Blocage de création du compte
Le connecteur Supabase disponible expose SQL et les Edge Functions, mais pas l'invitation Auth
ni la configuration Auth (redirections, modèle d'e-mail). Aucun appel privilégié Auth n'a été bricolé
via SQL ou une fonction publique. Ne jamais demander le mot de passe dans la conversation.

À terminer avec un environnement permettant l'API d'administration Auth autorisée :
1. Configurer la redirection vers Labz et son parcours sécurisé de création de mot de passe
   (l'interface actuelle ne traite pas encore les liens d'invitation/récupération).
2. Inviter uniquement l'adresse explicitement fournie par Mathieu.
3. Vérifier ce compte précis et son adresse confirmée, puis insérer son identifiant Auth dans labz_admins.
   Ne pas chercher les autres comptes, ne pas utiliser user_metadata comme preuve.
4. Tester la connexion réelle et la récupération d'accès ; ne jamais afficher ou enregistrer de secret.
5. Effectuer la recette DOM/mobile et corriger les problèmes constatés.
6. Reprendre les changements éventuels de main, vérifier la CI, fusionner et confirmer le job Pages deploy.

## Suite proposée, après la boîte fonctionnelle
Un sujet de travail indépendant regroupe plusieurs retours via une table de liens.
Garder problème, résultat attendu, impact (1–3), effort (1–3), justification, décision et état.
Prioriser les blocages, puis impact/effort ; la fréquence des retours reste un signal imparfait.
Limiter les sujets en cours à trois par transaction, avec verrouillage en base pour éviter les courses.
Créer une publication distincte, rédigée et approuvée : titre public, synthèse, état, projet, date de livraison.
Ne donner aucun accès public aux sujets internes, messages ou pseudonymes.
Les liens vers des retours purgés peuvent disparaître ; les décisions et synthèses minimisées survivent.
Ne pas recopier les messages bruts dans les décisions. Ce chantier n'est pas implémenté.

## Activation ponctuelle sans transmettre de secret
En l'absence d'outil Auth administrateur, Mathieu peut créer lui-même son compte dans le tableau de bord Supabase du projet Labz, rubrique Authentication / Users. Utiliser uniquement son adresse choisie et définir un mot de passe personnel dans Supabase, jamais dans la conversation.
Après confirmation de la création, vérifier uniquement cette adresse et son état de confirmation, puis associer l'identifiant Auth obtenu à labz_admins. Aucun utilisateur n'est automatiquement promu.
Cette méthode permet la connexion par mot de passe déjà implémentée. Elle ne remplace pas le futur parcours de récupération de mot de passe dans Labz.
