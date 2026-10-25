import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const forbidden = '\u2014';
const roots = ['.'];
const ignoredDirs = new Set(['.git', 'node_modules', 'dist']);
const textExtensions = new Set(['.js', '.mjs', '.html', '.md', '.json', '.css', '.yml', '.yaml', '.txt', '.svg', '.sql']);
const violations = [];

async function scan(path) {
  const info = await stat(path);
  if (info.isDirectory()) {
    const name = path.split('/').pop();
    if (ignoredDirs.has(name)) return;
    for (const entry of await readdir(path)) await scan(join(path, entry));
    return;
  }

  if (!textExtensions.has(extname(path))) return;
  const content = await readFile(path, 'utf8');
  content.split(/\r?\n/).forEach((line, index) => {
    if (line.includes(forbidden)) violations.push(`${path}:${index + 1}`);
  });
}

for (const root of roots) await scan(root);

if (violations.length) {
  console.error('Caractère typographique interdit détecté. Reformuler les phrases concernées :');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Style éditorial validé : aucun caractère interdit.');
