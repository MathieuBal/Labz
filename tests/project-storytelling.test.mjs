import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('les quatre premières fiches récupèrent le storytelling travaillé avant la PR 22', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /Jusqu’où peut-on pousser un navigateur/);
  assert.match(source, /Une pub de jeu mobile m’a donné une idée beaucoup plus grande/);
  assert.match(source, /Je voulais retrouver le plaisir du loot et de l’optimisation dans mon propre système/);
  assert.match(source, /Faire du Pip-Boy un véritable objet de la partie/);
});

test('AFK Farm part bien du Champ magnétique de Sensoria', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /AFK Farm est né du Champ magnétique de Sensoria/);
  assert.match(source, /Le point de départ, c’était simplement un geste qui fonctionnait bien/);
  assert.match(source, /LA BOUCLE DE PROGRESSION/);
});

test('Diagnostic numérique raconte le cycle de 12 ateliers et son usage terrain', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /cycle de 12 ateliers numériques dans un ESAT/);
  assert.match(source, /Je l’ai codé dans la semaine, puis utilisé le vendredi suivant/);
  assert.match(source, /33 activités/);
  assert.match(source, /Mes 12 ateliers/);
});

test('Perfoptimize raconte le problème personnel, les tests matériels et la limite de validation', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /je voulais simplement comprendre ce qui arrivait à mon propre PC/);
  assert.match(source, /Engine Multithreading/);
  assert.match(source, /mon PC est tombé en panne pendant le développement/);
  assert.match(source, /mesurer et expliquer avant de modifier/);
});

test('Constella raconte le passage de la carte de goûts à la veille', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /Je voulais voir mes préférences comme une carte, pas comme un classement/);
  assert.match(source, /importé beaucoup de morceaux depuis Deezer/);
  assert.match(source, /D’une constellation de goûts à une mémoire de veille/);
  assert.match(source, /digests/);
});

test('Crimson’s Blade raconte le problème de raids et l’usage OVH', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /Organiser un raid avant que deux heures disparaissent dans Discord/);
  assert.match(source, /déployé sur OVH/);
  assert.match(source, /resté en ligne et utilisable/);
});

test('les outils mémoire racontent le passage de PowerPoint aux petits programmes', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /Quand PowerPoint a commencé à ressembler à un jeu/);
  assert.match(source, /ClicReflex/);
  assert.match(source, /table de rappel personnelle/);
  assert.match(source, /pas des dispositifs thérapeutiques/);
});

test('Total War AI assume l’expérimentation arrêtée et le manque d’information', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /vision incomplète de la bataille/);
  assert.match(source, /certaines unités bougeaient mal, d’autres n’attaquaient pas/);
  assert.match(source, /LA BOUCLE DE R&D/);
  assert.match(source, /coût devenu disproportionné/);
});

test('les formats suite, étude de cas et recherche peuvent aussi porter origine et déroulé', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /function origin\(profile\)/);
  assert.match(source, /function flow\(profile\)/);
  assert.match(source, /function suite\(profile\)/);
  assert.match(source, /function caseStudy\(profile\)/);
  assert.match(source, /function research\(profile\)/);
});
