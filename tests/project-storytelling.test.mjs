import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('les pages produit peuvent raconter origine et fonctionnement avant la technique', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /profile\.origin\?\.paragraphs/);
  assert.match(source, /profile\.flow\?\.length/);
  assert.match(source, /POURQUOI JE L’AI CRÉÉ/);
  assert.match(source, /COMMENT ÇA FONCTIONNE/);
});

test('la fiche Pip-Boy raconte son origine réelle à la première personne', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /Faire du Pip-Boy un véritable objet de la partie/);
  assert.match(source, /Le point de départ n’était pas de mieux ranger mes notes de MJ/);
  assert.match(source, /je voulais rendre l’expérience plus sombre et plus immersive/);
  assert.match(source, /Préparer, cacher, révéler/);
  assert.match(source, /PostgreSQL construit une projection filtrée de la campagne/);
});

test('la fiche Sensoria présente le projet comme un laboratoire des capacités du navigateur', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /LABORATOIRE WEB · 22 EXPÉRIENCES/);
  assert.match(source, /Jusqu’où peut-on pousser un navigateur/);
  assert.match(source, /me confronter à mes propres limites de développement et aux limites pratiques du web/);
  assert.match(source, /sans introduire un moteur de jeu dédié/);
  assert.match(source, /Pas un benchmark, un laboratoire perceptible/);
});
