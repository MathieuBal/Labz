import {rm,mkdir,copyFile,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const name of ['index.html','styles.css','app.js','catalog.js'])await copyFile(name,`dist/${name}`);
await cp('assets','dist/assets',{recursive:true});
await copyFile('index.html','dist/404.html');
console.log('Static site ready in dist/ (relative URLs support GitHub Pages subpaths).');
