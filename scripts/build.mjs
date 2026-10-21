import './check-release.mjs';
import {currentRelease} from '../release-notes.js';
import {createHash} from 'node:crypto';
import {readdir} from 'node:fs/promises';
import {rm,mkdir,copyFile,cp,writeFile,readFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of ['index.html','styles.css','app.js','catalog.js','model.js','github-activity.js','feedback-config.js','feedback-client.js','feedback-drafts.js','admin-client.js','admin-view.js','admin-config.js','admin.css','release-notes.js'])await copyFile(name,`dist/${name}`);
await cp('assets','dist/assets',{recursive:true});
await writeFile('dist/.nojekyll','');
await writeFile('dist/404.html',`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page introuvable — Labz</title><body style="background:#090c12;color:#f2f2e9;font:18px system-ui;padding:10vh 8vw"><h1>Un détour imprévu.</h1><p>Cette page n’existe pas. Les projets t’attendent dans le catalogue.</p><a style="color:#d9ff4f" href="/Labz/#/catalogue">Retour au Labs →</a></body></html>`);
console.log('Static site ready in dist/ (relative URLs support GitHub Pages subpaths).');

// One fingerprint for the full module graph: no old/new module mix after deploy.
const assets=(await readdir('dist')).filter(name=>/\.(js|css)$/.test(name)).sort();
const sources=await Promise.all(assets.map(name=>readFile(`dist/${name}`,'utf8')));
const revision=createHash('sha256').update(sources.join('\n')).digest('hex').slice(0,16);
for(const [i,name] of assets.entries())if(name.endsWith('.js')) {
  await writeFile(`dist/${name}`,sources[i].replace(/(from\s+['"])(\.\/[^'"?]+\.js)(['"])/g,`$1$2?v=${revision}$3`));
}
const html=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',html
  .replace('<span data-site-version></span>',`<span data-site-version>v${currentRelease.version}</span>`)
  .replace(/((?:src|href)=")([^"?]+\.(?:js|css))(")/g,`$1$2?v=${revision}$3`));
