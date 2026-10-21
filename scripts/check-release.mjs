import {readFile} from 'node:fs/promises';
import {releases} from '../release-notes.js';
import {validateReleases} from './release-model.mjs';
const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
validateReleases(releases,pkg.version);
console.log(`Journal des versions synchronisé : v${pkg.version}.`);
