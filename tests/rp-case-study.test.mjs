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

test('la fiche RP distingue quatre outils et cinq étapes de parcours', async () => {
  const source = await read('rp-case-study.js');
  for (const project of ['Saloon','HotzDoggz','ZepRasso','Zepevents']) assert.match(source, new RegExp(project));
  assert.match(source, /4 OUTILS · 5 ÉTAPES/);
  assert.match(source, /Retour à ZepRasso/);
  assert.match(source, /plusieurs années/);
  assert.match(source, /≈ 40/);
  assert.match(source, /≈ 15 j/);
  assert.match(source, /165/);
  assert.match(source, /PostgreSQL/);
  assert.match(source, /prix conseillé, seuil de rentabilité/);
  assert.match(source, /coût réel du lot, statut payé, revenus, bénéfice/);
});

test('la fiche explique concrètement ce que sont ZepRasso et Zepevents', async () => {
  const source = await read('rp-case-study.js');
  assert.match(source, /ZepRasso est une plateforme web locale/);
  assert.match(source, /rassemblements et événements automobiles GTA RP/);
  assert.match(source, /Zepevents est le plan B que je développe/);
  assert.match(source, /inscriptions, véhicules, concours, paiements, caisse, loterie et résultats/);
  assert.match(source, /Le QR code reste un moyen d’accès, pas une obligation/);
});

test('la narration du parcours emploie la première personne', async () => {
  const source = await read('rp-case-study.js');
  assert.match(source, /je deviens copatron/);
  assert.match(source, /J’ai d’abord construit Saloon/);
  assert.match(source, /POURQUOI JE REVIENS À ZEPRASSO/);
  assert.doesNotMatch(source, /Mathieu/);
});

test('la fiche explique honnêtement l’absence de démo publique et la suite non planifiée', async () => {
  const source = await read('rp-case-study.js');
  assert.match(source, /Pourquoi il n’y a pas encore de bouton « Essayer »/);
  assert.match(source, /ZepRasso reste le meilleur candidat/);
  assert.match(source, /possibilité, pas un développement planifié aujourd’hui/);
  assert.match(source, /je ne fabriquerai pas de faux screenshots/);
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
