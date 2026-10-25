import { readFile } from 'node:fs/promises';

const forbidden = '\u2014';
const publicTextFiles = [
  'README.md',
  'index.html',
  'app.js',
  'model.js',
  'catalog.js',
  'catalog-runtime.js',
  'release-notes.js',
  'project-pages.js',
  'rp-case-study.js',
  'feedback-client.js',
  'admin-view.js',
  'scripts/build.mjs',
];

const violations = [];

for (const path of publicTextFiles) {
  const content = await readFile(path, 'utf8');
  content.split(/\r?\n/).forEach((line, index) => {
    if (line.includes(forbidden)) violations.push(`${path}:${index + 1}`);
  });
}

if (violations.length) {
  console.error('Caractère typographique interdit détecté dans un texte public. Reformuler les phrases concernées :');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Style éditorial public validé.');
