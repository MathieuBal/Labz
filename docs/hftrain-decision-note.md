# Décision de portefeuille — HFTrain

**Date : 24 octobre 2026**  
**Dépôt : `MathieuBal/HFTrain`**  
**Visibilité : privé**  
**État GitHub : dépôt vide (`size: 0`)**

## Pourquoi il a été créé

HFTrain venait d’une idée autour du trading haute fréquence. L’intention n’était pas encore stabilisée :

- soit créer un outil qui simule automatiquement une activité de trading haute fréquence en mode entraînement ;
- soit simuler un marché ;
- soit reproduire ou rejouer des marchés réels/live pour permettre à un utilisateur de s’entraîner à trader rapidement sans risquer d’argent réel.

## Analyse

Le concept mélange en réalité deux idées différentes.

### HFT réel

Le trading haute fréquence au sens strict est surtout un problème d’algorithmes, de latence, d’infrastructure, de microstructure de marché et d’exécution automatisée. Il se prête mal à un produit d’« entraînement utilisateur » manuel.

### Simulation / replay de marché

L’idée de rejouer un marché, simuler un carnet d’ordres ou proposer du paper trading accéléré peut en revanche avoir une valeur pédagogique. Mais ce serait un autre projet : un simulateur de marché ou un outil de market replay, pas vraiment un entraînement au HFT.

## Valeur actuelle

- aucun code à préserver dans le dépôt ;
- aucune base technique à reprendre ;
- intention d’origine encore floue ;
- l’idée générique de simulation/replay peut être notée sans nécessiter un dépôt GitHub dédié ;
- repartir plus tard de zéro serait plus sain que conserver ce dépôt vide comme pseudo-projet actif.

## Décision recommandée

**Supprimer le dépôt GitHub `HFTrain`**, après confirmation explicite de Mathieu.

Conserver uniquement l’idée résiduelle dans la documentation Labz :

> Éventuelle exploration future : simulateur/replay de marché permettant de s’entraîner sans argent réel. À considérer comme un nouveau projet si un besoin précis apparaît, et non comme la reprise de HFTrain.

## Statut

**Recommandation : SUPPRIMER**  
**Action destructive : non exécutée tant que Mathieu ne l’a pas explicitement confirmée.**
