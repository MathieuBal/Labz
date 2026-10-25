import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('AFK Farm raconte son vrai point de départ dans Sensoria', async () => {
  const source = await read('project-pages.js');
  assert.match(source, /tableau Champ magnétique de Sensoria/);
  assert.match(source, /Un tableau de Sensoria avec un feeling assez fort pour devenir un jeu/);
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

test('le catalogue harmonise les statuts et publie la révision éditoriale dans les nouveautés', async () => {
  const source = await read('catalog-runtime.js');
  for (const label of [
    'Public · expérience jouable',
    'Prototype avancé · jouable',
    'Étude de cas · usage réel',
    'R&D · expérimentation arrêtée',
  ]) assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(source, /Labz · révision éditoriale/);
  assert.match(source, /Les fiches racontent désormais le vrai état des projets/);
});
