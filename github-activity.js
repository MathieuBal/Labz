// Public, read-only GitHub activity. No credentials and no repository discovery.
export const activityRepositories = Object.freeze({
  sensoria: 'MathieuBal/Sensoria',
  'million-de-pixels': 'MathieuBal/million-de-pixels',
  lootchest: 'MathieuBal/Lootchest',
  diagnostic: 'MathieuBal/diagnostic-numerique',
});
const TTL = 15 * 60 * 1000;
const cache = new Map();
const safeText = (value, size) => typeof value === 'string' ? value.slice(0, size) : '';
function validDate(value) { return typeof value === 'string' && Number.isFinite(Date.parse(value)); }
function safeLink(value, repository, type) {
  try {
    const url = new URL(value);
    return url.origin === 'https://github.com' && !url.username && !url.password &&
      url.pathname.startsWith(`/${repository}/${type}/`) ? url.href : null;
  } catch { return null; }
}
export function normalizeReleases(items, repository) {
  if (!Array.isArray(items)) throw new Error('invalid-response');
  return items.filter(item => item && !item.draft && validDate(item.published_at))
    .map(item => ({kind:'release', title:safeText(item.name || item.tag_name, 160),
      date:item.published_at, url:safeLink(item.html_url, repository, 'releases/tag'),
      preview: Boolean(item.prerelease), excerpt:safeText(item.body, 600)}))
    .filter(item => item.title && item.url).sort((a,b) => Date.parse(b.date)-Date.parse(a.date)).slice(0,3);
}
export function normalizeCommits(items, repository) {
  if (!Array.isArray(items)) throw new Error('invalid-response');
  return items.filter(item => item && validDate(item.commit?.committer?.date))
    .map(item => ({kind:'commit', title:safeText(item.commit?.message?.split('\n')[0],160),
      date:item.commit.committer.date, url:safeLink(item.html_url, repository,'commit'),
      preview:false, excerpt:''}))
    .filter(item => item.title && item.url).slice(0,3);
}
async function request(url, fetcher, signal) {
  const response = await fetcher(url, {signal, credentials:'omit', headers:{Accept:'application/vnd.github+json'}});
  if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? 'rate-limit' : 'unavailable');
  return response.json();
}
export async function loadActivity(id, {fetcher=fetch, signal, force=false, now=Date.now()}={}) {
  const repository = Object.hasOwn(activityRepositories, id) ? activityRepositories[id] : null;
  if (!repository) return {state:'unsupported', items:[]};
  const saved = cache.get(id);
  if (!force && saved && now-saved.checkedAt < TTL) return {...saved, cached:true};
  try {
    const releases = normalizeReleases(await request(`https://api.github.com/repos/${repository}/releases?per_page=5`,fetcher,signal),repository);
    const items = releases.length ? releases : normalizeCommits(await request(`https://api.github.com/repos/${repository}/commits?per_page=3`,fetcher,signal),repository);
    const result = {state:items.length ? 'ready' : 'empty',items,checkedAt:now};
    cache.set(id,result);return result;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (saved?.items.length) return {...saved,state:'stale',error:error.message};
    return {state:'error',items:[],error:error.message === 'rate-limit' ? 'rate-limit' : 'unavailable'};
  }
}
export function clearActivityCache() { cache.clear(); }
