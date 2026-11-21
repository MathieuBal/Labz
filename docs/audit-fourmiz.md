# Fourmiz · audit du 21 novembre 2026

Version examinée dans [le dépôt Fourmiz](https://github.com/MathieuBal/Fourmiz/tree/539facce0d69589e263ec679c595c763dbe9f6bc). La fiche Labz ouvre le duel sur grand terrain. Le sélecteur de la simulation donne aussi accès au solo et aux deux nids voisins.

## Ce que montrent les parties

Neuf parties sans intervention, quinze minutes simulées chacune, trois graines du générateur par scène. Les effectifs comptent les ouvrières vivantes, en ordre ocre / bleu. Les réserves finales sont arrondies. Les offensives comptent les engagements initiés, y compris ceux qui se terminent très vite. Les pertes indiquées sont les décès au combat.

| Scène | Graine | Effectifs à 5 min | À 10 min | À 15 min | Réserves | Offensives | Pertes | Cycle p95 en ms |
|---|---:|---|---|---|---|---|---|---:|
| Grand terrain | 17 | 71 / 66 | 73 / 80 | 79 / 80 | 239 / 128 | 3 / 2 | 4 / 3 | 3.06 |
| Grand terrain | 41 | 71 / 65 | 81 / 78 | 70 / 77 | 152 / 170 | 1 / 0 | 7 / 4 | 3.03 |
| Grand terrain | 83 | 53 / 53 | 81 / 84 | 82 / 79 | 234 / 251 | 3 / 6 | 1 / 2 | 3.01 |
| Nids voisins | 17 | 20 / 13 | 32 / 16 | 21 / 22 | 11 / 7 | 16 / 12 | 5 / 6 | 2.73 |
| Nids voisins | 41 | 20 / 21 | 51 / 18 | 50 / 11 | 59 / 5 | 17 / 7 | 6 / 4 | 2.78 |
| Nids voisins | 83 | 23 / 18 | 20 / 9 | 58 / 46 | 16 / 6 | 17 / 13 | 8 / 7 | 2.77 |
| Solo | 17 | 67 | 81 | 74 | 744 | 0 | 0 | 0.77 |
| Solo | 41 | 71 | 86 | 82 | 564 | 0 | 0 | 0.54 |
| Solo | 83 | 63 | 85 | 78 | 512 | 0 | 0 | 0.73 |

Sur grand terrain, les trois duels finissent avec au plus sept ouvrières d’écart. Avec la graine 17, les réserves finales atteignent 239 contre 128 pour des effectifs de 79 contre 80. Sur nids voisins, la graine 41 produit au contraire un écart durable entre la dixième et la quinzième minute. Les trois essais voisins totalisent 82 offensives contre 15 sur grand terrain. La proximité et les ressources diffèrent entre les scènes : cette comparaison ne permet pas d’isoler leurs effets.

## Comportements et économie

- Les ouvrières explorent, suivent les pistes et livrent des graines. Au nid, la consommation, la ponte et les visites des nourrices relient les livraisons aux effectifs avec un délai. Le renouvellement local des graines toutes les vingt secondes sous condition de stock et le plafond de 180 ouvrières et individus du couvain contribuent à encadrer la croissance. Aucun décès de faim dans cet échantillon. La mortalité par âge domine.
- Une rencontre peut provoquer un repli, une alarme locale ou un combat. Des contacts répétés peuvent modifier un trajet ou déclencher une garde temporaire. Au maximum deux gardiennes actives relevées à un même nid lors des échantillons à une seconde. Cette mesure porte sur leur activité et ne mesure pas directement les bouchons à l’entrée.
- Une offensive demande un tas assez fourni à distance des deux nids, une rivale et du soutien local. Une porteuse poursuit sa tâche ou se retire. Le groupe compte jusqu’à trois participantes. Le ravitaillement individuel augmente la durée d’engagement possible. Un stock important ne donne donc pas automatiquement la supériorité sur le tas.
- Le suivi individuel, les pistes, la vue du nid et le bouton « Observer le tas disputé » permettent de relier les rencontres au travail des ouvrières. Le bilan d’un tas compte des livraisons réelles. Son « avant » cumule les livraisons depuis le début du tas, et son « après » peut encore augmenter après le retrait du groupe. La comparaison seule ne mesure pas le bénéfice de l’offensive.

## Qualité et limites de la vérification

Les 11 tests de décision passent, dont la récolte en solo et en duel, le soin interrompu, le repli, le recrutement, le détour, la garde, le passage d’une porteuse et la livraison issue d’un tas disputé. Pendant les neuf parties, les réserves sont restées finies et positives ou nulles à chaque cycle. Les positions et les libellés d’activité étaient valides aux relevés à une seconde.

Le p95 mesure le calcul du moteur sous Node, sans affichage, à trente cycles par seconde simulée. Il varie de 0,54 à 3,06 ms selon la partie. Il ne mesure ni la fluidité de la carte sur iPhone, ni le coût graphique du zoom ou de la vitesse accélérée. Trois graines par scène permettent de reproduire un écart, pas d’estimer un taux de victoire. L’ordre de calcul ocre puis bleu mérite un essai symétrique avant de conclure à un avantage de couleur.

## Prochaines vérifications proposées

1. Rejouer un même duel avec réserves initiales égales, puis doublées pour une colonie et inversées entre les couleurs. Comparer livraisons par minute, nouvelles ouvrières et accès au tas à 5, 10 et 15 minutes.
2. Comparer des fenêtres de même durée avant et après chaque offensive. Consigner les retraits, les livraisons et le temps d’accès au tas. Pour le nid, mesurer le délai d’entrée des porteuses pendant une garde.
3. Vérifier sur Safari iPhone le premier lancement depuis Labz, la sélection au doigt, le zoom et la fluidité en accéléré lors d’un duel dense.

## Reproduction

Dans un checkout de Fourmiz à la révision indiquée, lancer `node --test tests/decisions.cjs`. Pour le tableau, lancer le script suivant avec Node depuis la racine de ce même checkout. Les temps de calcul dépendent de la machine.

```js
const fs=require('fs'),assert=require('assert/strict');
const engine=fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const mode of ['?duel=1','?duel=1&scene=entrees','?duel=0'])for(const seed of [17,41,83]){
 const {colony,STEP,activityReason}=new Function('location',engine+'; return {colony,STEP,activityReason}')({search:mode});
 let state=seed;const rng=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 const cs=[colony(rng,0)];if(mode!=='?duel=0')cs.push(colony(rng,1));
 const raids=cs.map(()=>new Set()),times=[],snap=[];let maxGuards=0,maxRaid=0;
 for(let i=0;i<27000;i++){
  const t=performance.now();for(const c of cs)c.tick(STEP);times.push(performance.now()-t);
  cs.forEach((c,j)=>{assert.ok(c.reserve>=0 && Number.isFinite(c.reserve));if(c.lastOffensive)raids[j].add(c.lastOffensive);
   if(c.offensive)maxRaid=Math.max(maxRaid,c.offensive.members.size);
   if(i%30===0){maxGuards=Math.max(maxGuards,c.ants.filter(a=>a.guardUntil>c.time).length);assert.ok(c.ants.every(a=>Number.isFinite(a.x+a.y)&&activityReason[a.activity]));}});
  if([8999,17999,26999].includes(i))snap.push(cs.map(c=>c.ants.length));
 }
 times.sort((a,b)=>a-b);console.log(JSON.stringify({mode,seed,snap,raids:raids.map(r=>r.size),maxGuards,maxRaid,deaths:cs.map(c=>c.deaths),reserve:cs.map(c=>Math.round(c.reserve)),ms95:times[25650].toFixed(2)}));
}
```
