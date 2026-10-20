/** Pure helpers shared by the interface and Node tests. */
export const COLLECTION_KEY = 'labz-collection-v1';
export const emptyCollection = () => ({ favorites: [], recent: [] });
export function sanitizeCollection(value, knownIds) {
  if (!value || typeof value !== 'object') return emptyCollection();
  const clean = (list, limit) => Array.isArray(list)
    ? [...new Set(list.filter(id => typeof id === 'string' && knownIds.has(id)))].slice(0, limit)
    : [];
  return { favorites: clean(value.favorites, 100), recent: clean(value.recent, 8) };
}
export function readCollection(storage, knownIds) {
  try { return sanitizeCollection(JSON.parse(storage.getItem(COLLECTION_KEY)), knownIds); }
  catch { return emptyCollection(); }
}
export function writeCollection(storage, value) {
  try { storage.setItem(COLLECTION_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}
export function rememberLaunch(collection, id) {
  return { ...collection, recent: [id, ...collection.recent.filter(item => item !== id)].slice(0, 8) };
}
export function parseRoute(hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const split = raw.indexOf('?');
  const path = split < 0 ? raw : raw.slice(0, split);
  const params = new URLSearchParams(split < 0 ? '' : raw.slice(split + 1));
  return { segments: path.split('/').filter(Boolean), query: params.get('q') || '',
    playable: params.get('playable') === '1', favorites: params.get('collection') === 'favorites',
    sort: params.get('sort') === 'name' ? 'name' : 'selection' };
}
export function catalogueHref({category='all', query='', playable=false, favorites=false, sort='selection'}={}) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (playable) params.set('playable', '1');
  if (favorites) params.set('collection', 'favorites');
  if (sort === 'name') params.set('sort', 'name');
  return `#/catalogue${category === 'all' ? '' : '/' + category}${params.size ? '?' + params : ''}`;
}
export const feedbackKinds = {idea:'Idée', bug:'Problème', opinion:'Avis'};
export function validateFeedback(data) {
  if (!feedbackKinds[data.kind]) return 'Choisis un type de retour.';
  if (data.summary.trim().length < 3) return 'Ajoute un titre d’au moins 3 caractères.';
  if (data.message.trim().length < 5) return 'Ajoute quelques détails (au moins 5 caractères).';
  return '';
}
export function feedbackText(data) {
  return `Projet : ${data.projectName}\nType : ${feedbackKinds[data.kind]}\nPseudo : ${data.nickname || 'Anonyme'}\n\n${data.summary}\n\n${data.message}\n\nBrouillon local — non envoyé.\n`;
}
export function githubFeedbackUrl(data) {
  const title = `[${feedbackKinds[data.kind]}] ${data.projectName} — ${data.summary}`;
  // Bound the prefilled URL for mobile browsers; never silently truncate a user's text.
  const body = `## Projet\n${data.projectName}\n\n## Retour\n${data.message}\n\n${data.nickname ? `Pseudo : ${data.nickname}\n` : ''}\n---\nPréparé depuis Labz. Publication validée par son auteur sur GitHub.`;
  const url = new URL('https://github.com/MathieuBal/Labz/issues/new');
  url.searchParams.set('title', title); url.searchParams.set('body', body);
  return url.href.length <= 7500 ? url.href : null;
}
