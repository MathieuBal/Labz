import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('AFK Farm raconte son vrai point de départ dans Sensoria', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /tableau Champ magnétique de Sensoria/);
  assert.match(source, /Le point de départ, c’était vraiment le feeling du Champ magnétique/);
  assert.match(source, /Prototype avancé · jouable/);
  assert.doesNotMatch(source, /ne pas trouver exactement l’idle que j’avais envie de jouer/);
});

test('Total War AI est présenté comme une expérimentation arrêtée sur une information incomplète', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /R&D · EXPÉRIMENTATION ARRÊTÉE/);
  assert.match(source, /vision incomplète de la bataille/);
  assert.match(source, /moral, la fatigue, la largeur de front/);
  assert.match(source, /coût devenu disproportionné/);
});

test('le catalogue harmonise les statuts et la v0.19.0 consolide la refonte éditoriale', async () => {
  const [runtime, releases] = await Promise.all([read('catalog-runtime.js'), read('release-notes.js')]);
  for (const label of [
    'Public · expérience jouable',
    'Prototype avancé · jouable',
    'Étude de cas · usage réel',
    'R&D · expérimentation arrêtée',
  ]) assert.match(runtime, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(releases, /"version": "0\.19\.0"/);
  assert.match(releases, /Les projets racontent enfin leur histoire/);
  assert.match(releases, /Diagnostic numérique utilisé en atelier/);
  assert.doesNotMatch(releases, /"version": "0\.18\.[1-7]"/);
});
