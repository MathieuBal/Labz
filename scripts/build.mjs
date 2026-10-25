import './check-release.mjs';
import {currentRelease} from '../release-notes.js';
import {projects,categories} from '../catalog.js';
import {createHash} from 'node:crypto';
import {readdir} from 'node:fs/promises';
import {rm,mkdir,copyFile,cp,writeFile,readFile} from 'node:fs/promises';

const siteRoot='https://mathieubal.github.io/Labz/';
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const xml=value=>esc(value).replace(/'/g,'&apos;');

await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of ['index.html','styles.css','project-gallery.css','project-pages.css','rp-case-study.css','app.js','project-features.js','project-gallery.js','project-pages.js','rp-case-study.js','navigation-fixes.js','catalog.js','model.js','github-activity.js','feedback-config.js','feedback-client.js','feedback-drafts.js','admin-client.js','admin-view.js','admin-config.js','admin.css','release-notes.js'])await copyFile(name,`dist/${name}`);
await cp('assets','dist/assets',{recursive:true});
await writeFile('dist/.nojekyll','');
await writeFile('dist/404.html',`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page introuvable | Labz</title><body style="background:#090c12;color:#f2f2e9;font:18px system-ui;padding:10vh 8vw"><h1>Un détour imprévu.</h1><p>Cette page n’existe pas. Les projets t’attendent dans le catalogue.</p><a style="color:#d9ff4f" href="/Labz/#/catalogue">Retour au Labs →</a></body></html>`);
console.log('Static site ready in dist/ (relative URLs support GitHub Pages subpaths).');

// One fingerprint for the full module graph: no old/new module mix after deploy.
const assets=(await readdir('dist')).filter(name=>/\.(js|css)$/.test(name)).sort();
const sources=await Promise.all(assets.map(name=>readFile(`dist/${name}`,'utf8')));
const revision=createHash('sha256').update(sources.join('\n')).digest('hex').slice(0,16);
for(const [i,name] of assets.entries())if(name.endsWith('.js')) {
  await writeFile(`dist/${name}`,sources[i].replace(/(from\s+['"])(\.\/[^'"?]+\.js)(['"])/g,`$1$2?v=${revision}$3`));
}
const html=await readFile('dist/index.html','utf8');
const fingerprintedHtml=html
  .replace('<span data-site-version></span>',`<span data-site-version>v${currentRelease.version}</span>`)
  .replace(/((?:src|href)=")([^"?]+\.(?:js|css))(\")/g,`$1$2?v=${revision}$3`);
await writeFile('dist/index.html',fingerprintedHtml);

function projectPage(template,project) {
  const canonical=new URL(`projets/${project.id}/`,siteRoot).href;
  const image=new URL(project.cover||`assets/${project.art}.svg`,siteRoot).href;
  const title=`${project.name} | Mathieu / Labs`;
  const description=project.description;
  const destination=project.live||project.repo||siteRoot;
  const destinationLabel=project.live?'Essayer le projet':project.repo?'Voir le code disponible':'Retour au Labz';
  const fallback=`<section class="page-intro"><span class="eyebrow">${esc(categories[project.category])} · ${esc(project.mode)}</span><h1>${esc(project.name)}</h1><p>${esc(project.description)}</p><p>${esc(project.detail||project.takeaway||'Découvre le projet dans Labz.')}</p><p><a class="button primary" href="${esc(destination)}">${destinationLabel} →</a></p></section>`;
  return template
    .replace('<head>','<head><base href="../../">')
    .replace(/<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(description)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${canonical}">`)
    .replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${image}">`)
    .replace(/<meta name="twitter:card" content="[^"]*">/,'<meta name="twitter:card" content="summary_large_image">')
    .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${canonical}">`)
    .replace('</head>',`<script>if(!location.hash)history.replaceState(null,'',location.pathname+location.search+'#/projet/${project.id}')</script></head>`)
    .replace('<main id="main" tabindex="-1"></main>',`<main id="main" tabindex="-1">${fallback}</main>`);
}

for(const project of projects) {
  const dir=`dist/projets/${project.id}`;
  await mkdir(dir,{recursive:true});
  await writeFile(`${dir}/index.html`,projectPage(fingerprintedHtml,project));
}

const urls=[siteRoot,...projects.map(project=>new URL(`projets/${project.id}/`,siteRoot).href)];
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${xml(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',siteRoot).href}\n`);
console.log(`Generated ${projects.length} crawlable project pages plus sitemap.xml.`);
