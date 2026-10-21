export function compareVersions(a,b) {
  const aa=a.split('.').map(Number), bb=b.split('.').map(Number);
  for(let i=0;i<3;i++) if(aa[i]!==bb[i])return aa[i]-bb[i];
  return 0;
}
export function validateReleases(releases,version) {
  if(!Array.isArray(releases)||!releases.length)throw new Error('Journal des versions vide.');
  const seen=new Set();
  for(const [i,r] of releases.entries()) {
    if(!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(r.version))throw new Error('Version invalide.');
    if(seen.has(r.version))throw new Error('Version dupliquée.');seen.add(r.version);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(Date.parse(r.date))||new Date(r.date).toISOString().slice(0,10)!==r.date)throw new Error('Date invalide.');
    for(const field of ['title','description'])if(typeof r[field]!=='string'||!r[field].trim())throw new Error('Note de version incomplète.');
    if(r.items!==undefined&&(!Array.isArray(r.items)||r.items.some(s=>typeof s!=='string'||!s.trim())))throw new Error('Liste de changements invalide.');
    if(i&&(compareVersions(releases[i-1].version,r.version)<=0||releases[i-1].date<r.date))throw new Error('Journal désordonné.');
  }
  if(releases[0].version!==version)throw new Error('La version du site ne correspond pas à sa dernière nouveauté. Utiliser npm run release.');
}
export function addRelease(releases,entry) {
  const next=[entry,...releases];validateReleases(next,entry.version);return next;
}
