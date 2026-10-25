import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la navigation mobile expose quatre destinations dans une grille à quatre colonnes', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('project-pages.css')]);
  const nav = html.match(/<nav class="mobile-nav"[\s\S]*?<\/nav>/)?.[0] || '';
  assert.equal((nav.match(/<a /g) || []).length, 4);
  assert.match(nav, /data-nav="home"/);
  assert.match(css, /\.mobile-nav\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)\}/);
});

test('les routes accueil et projet forcent un retour en haut sans restauration navigateur', async () => {
  const source = await read('navigation-fixes.js');
  assert.match(source, /history\.scrollRestoration = 'manual'/);
  assert.match(source, /\^#\\\/projet\\\//);
  assert.match(source, /location\.hash = '#\/'/);
  assert.match(source, /window\.scrollTo\(\{top:0,left:0,behavior:'auto'\}\)/);
});

test('les modules de pages riches sont publiés sans couche de catalogue runtime', async () => {
  const [html, build] = await Promise.all([read('index.html'), read('scripts/build.mjs')]);
  for (const name of ['project-pages.js','navigation-fixes.js','project-pages.css']) {
    assert.match(html, new RegExp(name.replace('.', '\\.')));
    assert.match(build, new RegExp(name.replace('.', '\\.')));
  }
  assert.doesNotMatch(html, /catalog-runtime\.js/);
  assert.doesNotMatch(build, /catalog-runtime\.js/);
});
