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

test('les pages riches sont chargées seulement sur une route projet', async () => {
  const [html, build, loader] = await Promise.all([read('index.html'), read('scripts/build.mjs'), read('project-features.js')]);
  assert.match(html, /project-features\.js/);
  assert.match(build, /project-features\.js/);
  assert.match(loader, /\^#\\\/projet\\\//);
  for (const name of ['project-gallery.js','project-pages.js','rp-case-study.js']) {
    assert.doesNotMatch(html, new RegExp(`src="${name.replace('.', '\\.')}"`));
    assert.match(build, new RegExp(name.replace('.', '\\.')));
    assert.match(loader, new RegExp(name.replace('.', '\\.')));
  }
  assert.match(loader, /searchParams\.get\('v'\)/);
  assert.match(loader, /searchParams\.set\('v', revision\)/);
});

test('le partage projet utilise une URL statique sans abandonner les routes SPA', async () => {
  const [loader, build, html] = await Promise.all([read('project-features.js'), read('scripts/build.mjs'), read('index.html')]);
  assert.match(loader, /new URL\(`projets\/\$\{encodeURIComponent\(id\)\}\//);
  assert.match(loader, /navigator\.share\(\{title: document\.title, url\}\)/);
  assert.match(build, /dist\/projets\/\$\{project\.id\}/);
  assert.match(build, /sitemap\.xml/);
  assert.match(build, /robots\.txt/);
  assert.match(html, /rel="canonical" href="https:\/\/mathieubal\.github\.io\/Labz\/"/);
});
