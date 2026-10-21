import {readFile,writeFile} from 'node:fs/promises';
import {releases} from '../release-notes.js';
import {addRelease,validateReleases} from './release-model.mjs';
const [version,title,description,...items]=process.argv.slice(2);
if(!version||!title||!description) {
  console.error('Usage : npm run release -- 0.10.0 "Titre" "Résumé" "Changement 1" "Changement 2"');
  process.exit(1);
}
const packageUrl=new URL('../package.json',import.meta.url);
const pkg=JSON.parse(await readFile(packageUrl,'utf8'));
validateReleases(releases,pkg.version);
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const next=addRelease(releases,{version,date,title,description,items});
const content='// Journal public des versions livrées avec ce site.\nexport const releases = '+JSON.stringify(next,null,2)+';\nexport const currentRelease = releases[0];\nexport const updates = releases.map(({version,...note}) => ({...note,project:`Labz · version ${version}`}));\n';
await writeFile(new URL('../release-notes.js',import.meta.url),content);
await writeFile(packageUrl,JSON.stringify({...pkg,version},null,2)+'\n');
console.log(`v${version} préparée. Relire les notes, lancer npm run check et npm run build, puis publier via GitHub Pages.`);
