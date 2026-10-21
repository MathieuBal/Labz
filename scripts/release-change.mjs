import {compareVersions} from './release-model.mjs';

// Only prose-only documentation is exempt; scripts, tests and workflow edits
// still describe a new revision of the maintained application.
export function requiresRelease(paths) {
  return paths.some(path => path !== 'README.md' && !/^docs\/.*\.md$/.test(path));
}
export function validateReleaseChange(paths, previousVersion, currentVersion, notesChanged) {
  if (!requiresRelease(paths)) return;
  if (compareVersions(currentVersion, previousVersion) <= 0 || !notesChanged) {
    throw new Error('Cette livraison modifie le projet sans nouvelle version et nouvelle note. Utiliser npm run release.');
  }
}
