import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {releases as siteReleases} from '../release-notes.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('AFK Farm raconte son vrai point de départ dans Sensoria', async () => {
  const [story, catalog] = await Promise.all([read('project-pages.js'), read('catalog.js')]);
  assert.match(story, /AFK Farm est né du Champ magnétique de Sensoria/);
  assert.match(story, /Le point de départ, c’était simplement un geste qui fonctionnait bien/);
  assert.match(story, /LA BOUCLE DE PROGRESSION/);
  assert.match(story, /prototype avancé/);
  assert.doesNotMatch(story, /ne pas trouver exactement l’idle que j’avais envie de jouer/);
  assert.match(catalog, /Le Champ magnétique de Sensoria devenu un idle web/);
});

test('Total War AI est présenté comme une expérimentation arrêtée sur une information incomplète', async () => {
  const [story, catalog] = await Promise.all([read('project-pages.js'), read('catalog.js')]);
  assert.match(story, /R&D · EXPÉRIMENTATION ARRÊTÉE/);
  assert.match(story, /vision incomplète de la bataille/);
  assert.match(story, /moral, la fatigue, la largeur de front/);
  assert.match(story, /coût devenu disproportionné/);
  assert.match(catalog, /R&D · expérimentation arrêtée/);
});

test('le catalogue canonique porte les statuts et la v0.18.9 publie le remboursement de dette', async () => {
  const [catalog, html] = await Promise.all([read('catalog.js'), read('index.html')]);
  for (const label of [
    'Public · expérience jouable',
    'Prototype avancé · jouable',
    'Étude de cas · usage réel',
    'R&D · expérimentation arrêtée',
  ]) assert.match(catalog, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(html, /catalog-runtime\.js/);
  const debtRelease = siteReleases.find(release => release.version === '0.18.9');
  assert.ok(debtRelease, 'La note 0.18.9 doit rester dans le journal publié.');
  assert.match([debtRelease.title,debtRelease.description,...(debtRelease.items||[])].join(' '), /dette de synchronisation/);
});
