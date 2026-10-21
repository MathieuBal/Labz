# Brouillons et accusés locaux — v0.11

Le formulaire conserve sur cet appareil le texte courant et les dix dernières tentatives par projet, pendant au plus 30 jours pour chaque tentative. Un brouillon expire 30 jours après sa dernière modification. Le nettoyage se produit à l'ouverture de Labz ou à la prochaine utilisation du brouillon ; rien ne s'exécute quand le site est fermé.

Avant l'appel réseau, le client sauvegarde un UUID et le contenu normalisé correspondant (type, titre, message, pseudo). Après réponse perdue ou rechargement, une relance du même texte réutilise cet UUID. Le serveur existant déduplique par request_id. La v0.11 ne change ni la base ni les quotas.

Un accusé positif marque seulement la tentative envoyée. Modifier le texte, ouvrir un autre projet ou fermer le formulaire n'autorise pas une réponse tardive à remplacer le brouillon actuel. Le bouton est désactivé pour un texte déjà reçu ; une modification permet un nouveau retour.

L'effacement volontaire supprime le texte ET les identifiants/accusés de ce projet sur cet appareil, après confirmation. Il ne supprime pas le message du serveur. Une réponse tardive ne recrée pas le brouillon effacé. Retaper le même texte après effacement constitue un nouvel envoi.

## Garanties limitées

- Aucune garantie de déduplication entre appareils, stockages différents ou deux onglets envoyant simultanément un texte nouveau.
- Si le stockage local est bloqué ou plein, un avertissement l'indique ; la relance dans l'onglet garde son UUID, mais un rechargement peut perdre cet état.
- Les tentatives dépassant dix entrées ou 30 jours ne sont plus reconnues. Les anciens brouillons sans identifiant sont repris comme non confirmés ; leur éventuel envoi antérieur ne peut être déduit.
- L'accusé local sert au confort de navigation, pas de preuve de sécurité ou d'autorisation. Il peut être modifié par l'utilisateur de l'appareil.
- Les autres sites sous la même origine GitHub Pages partagent le stockage du navigateur. Ne pas y écrire d'informations sensibles.

## Vérification

Tests Node de réponse perdue/rechargement avec récepteur simulé, modification en cours d'envoi, réponse après effacement, projet différent, stockage indisponible, expiration, migration d'ancien brouillon et contenu stocké mal formé. Ces tests ne constituent ni une nouvelle campagne de tests SQL/RLS ni un envoi de message réel.

La recette navigateur porte sur restauration du texte après rechargement, ouverture/fermeture, libellés et commande d'effacement. Le parcours Safari sur iPhone réel reste à vérifier.
