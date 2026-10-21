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
for (const file of ['model.js','github-activity.js']) await access(new URL(file,root));
await access(new URL('.nojekyll',root));
console.log('GitHub Pages package verified under /Labz/: HTML assets, module import, covers and .nojekyll.');
