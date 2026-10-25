import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la fiche RP enrichie est chargée et publiée', async () => {
  const [html, build] = await Promise.all([read('index.html'), read('scripts/build.mjs')]);
  for (const name of ['rp-case-study.js','rp-case-study.css']) {
    assert.match(html, new RegExp(name.replace('.', '\\.')));
    assert.match(build, new RegExp(name.replace('.', '\\.')));
  }
});

test('la fiche RP conserve les quatre générations et leurs flux', async () => {
  const source = await read('rp-case-study.js');
  for (const project of ['Saloon','HotzDoggz','ZepRasso','Zepevents']) assert.match(source, new RegExp(project));
  assert.match(source, /≈ 40/);
  assert.match(source, /≈ 15 j/);
  assert.match(source, /165/);
  assert.match(source, /PostgreSQL/);
  assert.match(source, /QR \/ lien/);
  assert.match(source, /Human-in-the-loop/);
});

test('la fiche explique honnêtement l’absence de démo publique', async () => {
  const source = await read('rp-case-study.js');
  assert.match(source, /Pourquoi il n’y a pas encore de bouton « Essayer »/);
  assert.match(source, /ZepRasso est aujourd’hui le meilleur candidat/);
  assert.match(source, /Aucun faux screenshot ne sera fabriqué/);
});

test('la timeline ne transforme jamais les listes internes en sous-timelines', async () => {
  const [baseCss, rpCss] = await Promise.all([read('project-pages.css'), read('rp-case-study.css')]);
  assert.match(baseCss, /\.project-timeline>li\{/);
  assert.match(baseCss, /\.project-timeline>li:not\(:last-child\)::before/);
  assert.doesNotMatch(baseCss, /\.project-timeline li\{/);
  assert.match(rpCss, /\.rp-capabilities li\{/);
  assert.match(rpCss, /@media\(max-width:760px\)/);
  assert.match(rpCss, /\.rp-stage-grid\{display:block\}/);
  assert.match(rpCss, /grid-template-columns:34px minmax\(0,1fr\)/);
});
