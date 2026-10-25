import { readFile, writeFile } from 'node:fs/promises';

const rewrites = {
  'README.md': [
    ['# Labz — Mathieu / Labs', '# Labz | Mathieu / Labs'],
  ],
  'index.html': [
    ['Mathieu / Labs — Des créations à explorer', 'Mathieu / Labs | Des créations à explorer'],
  ],
  'app.js': [
    ['Administration — Mathieu / Labs', 'Administration | Mathieu / Labs'],
    ['${project.name} — Mathieu / Labs', '${project.name} | Mathieu / Labs'],
    ['Projet introuvable — Mathieu / Labs', 'Projet introuvable | Mathieu / Labs'],
    ["${options.favorites ? 'Mes favoris' : 'Le catalogue'} — Mathieu / Labs", "${options.favorites ? 'Mes favoris' : 'Le catalogue'} | Mathieu / Labs"],
    ['Nouveautés — Mathieu / Labs', 'Nouveautés | Mathieu / Labs'],
    ['Mathieu / Labs — Des créations à explorer', 'Mathieu / Labs | Des créations à explorer'],
  ],
  'model.js': [
    ['Brouillon local — non envoyé.', 'Brouillon local, non envoyé.'],
    ['${data.projectName} — ${data.summary}', '${data.projectName} : ${data.summary}'],
  ],
  'project-pages.js': [
    ['On ne regarde pas simplement l’image — on la provoque.', 'On ne regarde pas simplement l’image. On la provoque.'],
    ['Chaque système ajouté — drones, chantiers, biomes, prestige ou arbre — cherche à déplacer progressivement le joueur de la récolte immédiate vers la construction d’une machine qui travaille pour lui.', 'Chaque système ajouté, des drones au prestige en passant par les biomes et l’arbre, cherche à déplacer progressivement le joueur de la récolte immédiate vers la construction d’une machine qui travaille pour lui.'],
    ['Le projet a construit beaucoup de briques sérieuses — pont Lua/Python, télémétrie, règles, mémoire, simulateur et tests — mais l’objectif final n’a pas été atteint en vraie bataille.', 'Le projet a construit beaucoup de briques sérieuses : pont Lua/Python, télémétrie, règles, mémoire, simulateur et tests. Malgré cela, l’objectif final n’a pas été atteint en vraie bataille.'],
  ],
  'rp-case-study.js': [
    ['Automatiser ce qui coupe le RP — sans automatiser le RP lui-même.', 'Automatiser ce qui coupe le RP, sans automatiser le RP lui-même.'],
    ['Le support change — bot Discord, application web par QR code, poste de contrôle local — mais le problème reste le même.', 'Le support change : bot Discord, application web par QR code ou poste de contrôle local. Le problème reste le même.'],
    ['ce qui s’est passé — pas seulement à afficher un joli tableau.', 'ce qui s’est passé, au lieu de seulement afficher un joli tableau.'],
    ['sur une machine adaptée — sans fabriquer de faux screenshots entre-temps.', 'sur une machine adaptée. Aucun faux screenshot ne sera fabriqué entre-temps.'],
  ],
  'scripts/build.mjs': [
    ['Page introuvable — Labz', 'Page introuvable | Labz'],
  ],
};

for (const [path, replacements] of Object.entries(rewrites)) {
  let content = await readFile(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!content.includes(from)) throw new Error(`Texte attendu introuvable dans ${path}: ${from}`);
    content = content.split(from).join(to);
  }
  await writeFile(path, content);
}

console.log('Textes publics réécrits.');
