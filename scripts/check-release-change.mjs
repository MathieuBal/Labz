import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {validateReleaseChange} from './release-change.mjs';

const git = (...args) => execFileSync('git', args, {encoding:'utf8'}).trim();
let base = process.argv[2];
if (!base && process.env.GITHUB_EVENT_PATH) {
  const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
  base = event.pull_request?.base?.sha || event.before;
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    console.log('Republication manuelle : cohérence du journal contrôlée par npm run check.');
    process.exit(0);
  }
}
if (!base || /^0+$/.test(base)) throw new Error('Révision précédente absente : fournir un commit de référence.');
// Resolve a commit, then use only that SHA in subsequent git commands.
base = git('rev-parse', '--verify', '--end-of-options', `${base}^{commit}`);
const paths = git('diff', '--name-only', '--no-renames', base, 'HEAD').split('\n').filter(Boolean);
const previous = JSON.parse(git('show', `${base}:package.json`));
const current = JSON.parse(git('show', 'HEAD:package.json'));
validateReleaseChange(paths, previous.version, current.version, paths.includes('release-notes.js'));
console.log('Évolution de version vérifiée depuis ' + base.slice(0,7) + '.');
