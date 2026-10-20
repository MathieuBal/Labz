import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {projects,categories,filterProjects} from '../catalog.js';
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Duplicate project ID');
for(const p of projects){if(p.cover)await access(new URL(`../${p.cover}`,import.meta.url));assert.match(p.id,/^[a-z0-9-]+$/);assert.ok(categories[p.category]);assert.ok(p.description);await access(new URL(`../assets/${p.art}.svg`,import.meta.url));for(const key of ['repo','live'])if(p[key])assert.equal(new URL(p[key]).protocol,'https:');if(p.live)assert.ok(p.action);}
assert.ok(filterProjects('EXPÉRIENCE').length>0);assert.ok(filterProjects('numerique').some(p=>p.id==='diagnostic'));assert.equal(filterProjects('zzzinexistant').length,0);assert.ok(filterProjects('','jeux').every(p=>p.category==='jeux'));
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');for(const id of ['main','feedback','feedback-form','search-form','search','feedback-result','toast'])assert.ok(html.includes(`id="${id}"`),`Missing DOM mount ${id}`);
console.log(`Catalogue and assets valid: ${projects.length} projects; accent-insensitive search and category filtering checked.`);
