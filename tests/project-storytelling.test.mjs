import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source = await readFile(new URL('../project-pages.js', import.meta.url), 'utf8');

const has = (...patterns) => {
  for (const pattern of patterns) assert.match(source, pattern);
};

test('le renderer sait raconter origine, fonctionnement et contexte au-delà des produits', () => {
  has(/function originBlock\(profile\)/, /function flowBlock\(profile\)/, /function aboutBlock\(profile\)/);
  has(/\$\{originBlock\(profile\)\}/, /\$\{flowBlock\(profile\)\}/, /\$\{aboutBlock\(profile\)\}/);
});

test('Sensoria raconte le laboratoire web et ses limites pratiques', () => {
  has(/Jusqu’où peut-on pousser un navigateur \?/, /22 terrains d’essai distincts/, /COMMENT NAÎT UNE EXPÉRIENCE/);
});

test('Million de Pixels raconte la pub mobile puis la transformation de toute image en niveau', () => {
  has(/Une pub de jeu mobile m’a donné une idée beaucoup plus grande/, /n’importe quelle photo/, /COMMENT UNE IMAGE DEVIENT UN NIVEAU/);
});

test('Lootchest raconte le loot, le craft inspiré de Path of Exile et les retours joueurs', () => {
  has(/profondeur de craft de Path of Exile/, /partager le lien à plusieurs personnes/, /LA BOUCLE QUE JE VOULAIS JOUER/);
});

test('AFK Farm repart du Champ magnétique de Sensoria', () => {
  has(/AFK Farm est né du tableau Champ magnétique de Sensoria/, /Le point de départ, c’était vraiment le feeling du Champ magnétique/, /arbre à sept branches/);
  assert.doesNotMatch(source, /ne pas trouver exactement l’idle que j’avais envie de jouer/);
});

test('Diagnostic numérique raconte les douze ateliers et son usage réel immédiat', () => {
  has(/cycle réel de douze ateliers numériques/, /Je devais préparer douze vendredis d’ateliers/, /Je l’ai codé dans la semaine, puis utilisé le vendredi suivant/, /33 activités/);
});

test('Perfoptimize part des lags du PC et montre les itérations sur matériel réel', () => {
  has(/Pourquoi mon PC rame alors qu’il devrait tenir ce jeu/, /zéro échantillon/, /Engine Multithreading/, /mon PC tombe en panne/);
});

test('Pip-Boy raconte l’objet de jeu et la relation MJ joueur', () => {
  has(/Faire du Pip-Boy un véritable objet de la partie/, /Smoky Waters/, /COMMENT ÇA SE PASSE À TABLE/, /projection filtrée/);
});

test('Constella raconte Explore puis le passage organique vers Watch', () => {
  has(/cartographier des goûts et des préférences personnelles/, /La constellation devient le vrai concept/, /Des goûts personnels à une mémoire de veille/, /synthèse multi-source/);
});

test('les outils mémoire racontent le passage de PowerPoint aux petits programmes', () => {
  has(/Quand PowerPoint devient trop lourd/, /chemins, flèches, décisions, énigmes/, /ClicReflexe/, /Ball Passing Simulation/, /tables de rappel/);
});

test('Crimson’s Blade raconte le temps perdu avant les raids et l’usage OVH', () => {
  has(/18 h prévu\. 20 h, toujours pas de raid/, /disponibilités et ce qu’il cherchait à obtenir/, /Hébergé sur OVH/, /resté en ligne et utilisable/);
});

test('Total War AI est une expérimentation arrêtée sur une information incomplète', () => {
  has(/R&D · EXPÉRIMENTATION ARRÊTÉE/, /vision incomplète de la bataille/, /moral, la fatigue, la largeur de front/, /sans victoire/);
});

test('la fiche RP de secours respecte les deux arcs plutôt qu’une fausse évolution linéaire', () => {
  has(/deux rencontres, séparées de plusieurs années/, /Le détour par Zepevents/, /Retour à ZepRasso/);
});

test('aucun tiret cadratin ne revient dans les récits publics', () => {
  assert.equal(source.includes('—'), false);
});
