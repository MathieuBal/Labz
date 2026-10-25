// Validate the packaged files resolve beneath the actual repository subpath.
import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {projects} from '../catalog.js';
const root=new URL('../dist/',import.meta.url);
const origin=new URL('https://mathieubal.github.io/Labz/');
const html=await readFile(new URL('index.html',root),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  const value=match[1];if(/^(https?:|mailto:)/.test(value))continue;
  const url=new URL(value,origin);
  assert.ok(url.pathname.startsWith('/Labz/'),`Asset escapes repository base: ${value}`);
  await access(new URL(url.pathname.slice('/Labz/'.length),root));
}
for(const p of projects)await access(new URL(`assets/${p.art}.svg`,root));
assert.match(html,/<link rel="canonical" href="https:\/\/mathieubal\.github\.io\/Labz\/">/,'Home needs a canonical URL');
const app=await readFile(new URL('app.js',root),'utf8');
assert.match(app,/from '\.\/catalog\.js\?v=[a-f0-9]+'/,'Catalogue must resolve relative to the Pages base with a build fingerprint');
const revision=html.match(/app\.js\?v=([a-f0-9]+)/)?.[1];
assert.ok(revision,'Entry script needs a build fingerprint');
for(const file of ['app.js','catalog.js','release-notes.js','admin-view.js']) {
  const source=await readFile(new URL(file,root),'utf8');
  for(const match of source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)) {
    assert.ok(match[1].endsWith(`?v=${revision}`),'Module fingerprint mismatch');
    await access(new URL(match[1].split('?')[0],root));
  }
}
const projectFeatures=await readFile(new URL('project-features.js',root),'utf8');
assert.match(html,new RegExp(`project-features\\.js\\?v=${revision}`),'Project feature loader needs the same build fingerprint');
for(const file of ['project-gallery.js','project-pages.js','rp-case-study.js']) {
  await access(new URL(file,root));
  assert.match(projectFeatures,new RegExp(file.replace('.', '\\.')));
  assert.doesNotMatch(html,new RegExp(`<script[^>]+src="${file.replace('.', '\\.')}"`),'Heavy project modules must stay lazy');
}
assert.match(projectFeatures,/searchParams\.get\('v'\)/,'Lazy modules must inherit the build fingerprint');
assert.match(projectFeatures,/searchParams\.set\('v', revision\)/,'Lazy module URLs must preserve cache coherence');
assert.match(projectFeatures,/projets\/\$\{encodeURIComponent\(id\)\}\//,'Project sharing must target the crawlable URL');

const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
const robots=await readFile(new URL('robots.txt',root),'utf8');
assert.match(sitemap,/https:\/\/mathieubal\.github\.io\/Labz\//,'Sitemap needs the Labz root');
assert.match(robots,/Sitemap: https:\/\/mathieubal\.github\.io\/Labz\/sitemap\.xml/,'robots.txt must advertise the sitemap');
for(const project of projects) {
  const canonical=`https://mathieubal.github.io/Labz/projets/${project.id}/`;
  const page=await readFile(new URL(`projets/${project.id}/index.html`,root),'utf8');
  assert.match(page,/<base href="\/Labz\/">/,`${project.id}: static page needs the GitHub Pages base`);
  assert.ok(page.includes(`<link rel="canonical" href="${canonical}">`),`${project.id}: canonical URL mismatch`);
  assert.ok(page.includes(`<meta property="og:url" content="${canonical}">`),`${project.id}: OpenGraph URL mismatch`);
  assert.ok(page.includes(`#/projet/${project.id}`),`${project.id}: browser bootstrap must open the interactive route`);
  assert.ok(page.includes(project.name),`${project.id}: static fallback must expose the project name`);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`),`${project.id}: sitemap entry missing`);
}
for (const file of ['model.js','github-activity.js']) await access(new URL(file,root));
await access(new URL('.nojekyll',root));
console.log(`GitHub Pages package verified under /Labz/: ${projects.length} static project pages, sitemap, module imports, lazy features, covers and .nojekyll.`);
