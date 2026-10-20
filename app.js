import { projects, categories, updates, filterProjects } from './catalog.js';
import { COLLECTION_KEY, readCollection, writeCollection, rememberLaunch, parseRoute,
  catalogueHref, feedbackKinds, validateFeedback, feedbackText, githubFeedbackUrl } from './model.js';

const main = document.querySelector('#main');
const dialog = document.querySelector('#feedback');
const form = document.querySelector('#feedback-form');
const knownIds = new Set(projects.map(p => p.id));
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let collection = readCollection(storage, knownIds);
let feedbackProject = null, feedbackOpener = null, toastTimer, draftTimer;
let dirtyDraft = false;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const favorite = id => collection.favorites.includes(id);

function saveCollection() {
  if (!writeCollection(storage, collection)) toast('La sélection reste disponible pour cette session. Le stockage de cet appareil est indisponible.');
}
function external(url, label, cls='secondary', id='') {
  return `<a class="button ${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${id ? `data-launch="${id}"` : ''}>${label} <span aria-hidden="true">↗</span></a>`;
}
function art(p, hero=false) {
  return `<div class="art art-${p.art}${hero ? ' hero-art' : ''}" aria-hidden="true"><img src="assets/${p.art}.svg" alt="" ${hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} width="960" height="540"></div>`;
}
function favoriteButton(p, full=false) {
  return `<button class="${full ? 'button secondary full' : 'favorite-button'}" data-favorite="${p.id}" aria-pressed="${favorite(p.id)}" aria-label="${favorite(p.id) ? 'Retirer' : 'Ajouter'} ${esc(p.name)} ${favorite(p.id) ? 'des' : 'aux'} favoris"><span aria-hidden="true">${favorite(p.id) ? '♥' : '♡'}</span>${full ? (favorite(p.id) ? 'Dans mes favoris' : 'Garder en favori') : ''}</button>`;
}
function card(p) {
  return `<article class="project-card"><div class="cover-wrap"><a class="card-cover" href="#/projet/${p.id}" aria-label="Découvrir ${esc(p.name)}">${art(p)}<span class="cover-label">${p.live ? 'À ESSAYER' : 'À DÉCOUVRIR'}</span></a>${favoriteButton(p)}</div><div class="card-body"><span class="eyebrow">${categories[p.category]} <span class="separator">/</span> ${esc(p.mode)}</span><h3><a href="#/projet/${p.id}">${esc(p.name)}</a></h3><p>${esc(p.description)}</p><a class="card-link" href="#/projet/${p.id}">Découvrir le projet <span>↗</span></a></div></article>`;
}
function heading(kicker, title, link='') {
  return `<div class="section-heading"><div><span class="eyebrow">${kicker}</span><h2>${title}</h2></div>${link}</div>`;
}
function recentSection() {
  const recent = collection.recent.map(id => projects.find(p => p.id === id)).filter(p => p?.live);
  if (!recent.length) return '';
  return `<section class="recent-section">${heading('TU ÉTAIS PASSÉ PAR LÀ', 'Un autre tour ?')}<div class="recent-list">${recent.map(p => `<article class="recent-card">${art(p)}<div><a href="#/projet/${p.id}">${esc(p.name)}</a><small>Récemment ouvert</small></div>${external(p.live, 'Relancer', 'secondary', p.id)}</article>`).join('')}</div></section>`;
}
function home() {
  return `<section class="hero">${art(projects[0], true)}<div class="hero-content"><span class="eyebrow"><span class="dot"></span> LE LABO DE MATHIEU</span><h1>La curiosité<br>a un terrain de jeu.</h1><p>Des jeux, des expériences et des outils.<br>Entre, essaie un truc. Fais comme chez toi.</p><div class="hero-actions"><a class="button primary" href="#/projet/sensoria">Explorer Sensoria <span>↗</span></a><button class="text-link random-button" data-random>Surprends-moi ↗</button></div></div><span class="art-caption">SENSORIA · ILLUSTRATION PROVISOIRE</span></section>
    ${recentSection()}
    <section>${heading('COMMENCE PAR ICI', 'À toi de jouer.', '<a class="text-link" href="#/catalogue?playable=1">À essayer maintenant →</a>')}<div class="project-grid featured">${[projects[1], projects[2], projects[0]].map(card).join('')}</div><p class="rail-hint">Fais défiler pour explorer →</p></section>
    <section>${heading('UNE AUTRE FAÇON D’EXPLORER', 'Apprendre. Créer. Comprendre.')}<div class="project-grid">${projects.slice(3,6).map(card).join('')}</div></section>
    <section class="participate"><span class="participate-symbol" aria-hidden="true">✳</span><div><span class="eyebrow">ÇA SE CONSTRUIT ENSEMBLE</span><h2>Ton regard change la suite.</h2><p>Une idée, un bug ou un ressenti ? Chaque fiche te permet de préparer un retour.</p></div><a class="button secondary" href="#/catalogue">Choisir un projet →</a></section>
    <section>${heading('CARNET DU LABO', 'Le travail continue.', '<a class="text-link" href="#/nouveautes">Les nouveautés →</a>')}${updateCard(updates[0])}</section>`;
}
function catalogueOptions() {
  const route = parseRoute(location.hash);
  return {...route, category: categories[route.segments[1]] ? route.segments[1] : 'all'};
}
function chips(options) {
  return `<div class="filters" aria-label="Catégories">${[['all', 'Tout'], ...Object.entries(categories)].map(([key, value]) => `<a class="filter ${options.category === key ? 'selected' : ''}" href="${esc(catalogueHref({...options, category:key}))}" ${options.category === key ? 'aria-current="page"' : ''}>${value}</a>`).join('')}</div>`;
}
function catalogue(options) {
  let list = filterProjects(options.query, options.category);
  if (options.playable) list = list.filter(p => p.live);
  if (options.favorites) list = list.filter(p => favorite(p.id));
  if (options.sort === 'name') list = [...list].sort((a,b) => a.name.localeCompare(b.name, 'fr'));
  const emptyFavorites = options.favorites && !collection.favorites.length;
  return `<div class="page-intro"><span class="eyebrow">${options.favorites ? 'TES ENVIES DE DÉCOUVERTE' : 'LA COLLECTION'}</span><h1>${options.favorites ? 'Garde une place pour la suite.' : 'Trouve ton prochain détour.'}</h1><p>${options.favorites ? 'Ta sélection reste sur cet appareil, sans créer de compte.' : 'Un petit jeu, une expérience inattendue ou un outil à découvrir.'}</p></div>
    ${chips(options)}
    <div class="catalogue-toolbar"><div class="quick-filters"><button class="filter-toggle ${options.playable ? 'active' : ''}" data-toggle="playable" aria-pressed="${options.playable}"><span aria-hidden="true">▷</span> À essayer maintenant</button><button class="filter-toggle ${options.favorites ? 'active' : ''}" data-toggle="favorites" aria-pressed="${options.favorites}"><span aria-hidden="true">♡</span> Mes favoris</button></div><label class="sort-label">Trier <select id="catalogue-sort"><option value="selection" ${options.sort === 'selection' ? 'selected' : ''}>Sélection du labo</option><option value="name" ${options.sort === 'name' ? 'selected' : ''}>Nom A–Z</option></select></label></div>
    <p class="results-count" role="status">${list.length} projet${list.length > 1 ? 's' : ''}${options.query ? ` pour « ${esc(options.query)} »` : ''}</p>
    ${list.length ? `<div class="project-grid catalogue-grid">${list.map(card).join('')}</div>` : `<div class="empty"><span class="empty-symbol" aria-hidden="true">${emptyFavorites ? '♡' : '⌕'}</span><h2>${emptyFavorites ? 'Ta sélection commence ici.' : 'Aucun projet avec ces critères.'}</h2><p>${emptyFavorites ? 'Touche le cœur d’un projet pour le retrouver ici.' : 'Essaie une recherche plus courte ou retire un filtre.'}</p><a href="#/catalogue" class="button secondary">Explorer tous les projets →</a></div>`}`;
}
function updateCard(update) {
  return `<article class="update"><time datetime="${update.date}">${new Date(update.date+'T12:00:00Z').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Paris'})}</time><div><span class="eyebrow">${esc(update.project)}</span><h3>${esc(update.title)}</h3><p>${esc(update.description)}</p>${update.items ? `<ul class="update-items">${update.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</div><span class="update-arrow" aria-hidden="true">↗</span></article>`;
}
function detail(project) {
  const related = projects.filter(p => p.id !== project.id).sort((a,b) => Number(b.category === project.category) - Number(a.category === project.category)).slice(0,3);
  return `<a class="back" href="#/catalogue">← Retour aux projets</a><section class="detail-hero">${art(project,true)}<div class="detail-content"><span class="eyebrow">${categories[project.category]} <span class="separator">/</span> ${esc(project.mode)}</span><h1>${esc(project.name)}</h1><p>${esc(project.description)}</p><div class="detail-actions">${project.live ? external(project.live, esc(project.action), 'primary', project.id) : '<span class="availability">Présentation · accès public à préparer</span>'}<button class="button secondary" data-feedback="${project.id}">Laisser un retour</button></div>${project.live ? '<small>S’ouvre dans un nouvel onglet.</small>' : ''}</div><span class="art-caption">ILLUSTRATION PROVISOIRE</span></section>
    <nav class="detail-tabs" aria-label="Sections du projet"><a href="#presentation">Présentation</a><a href="#evolutions">Évolutions</a><a href="#retours">Retours</a></nav>
    <div class="detail-columns"><div><section id="presentation" tabindex="-1"><span class="eyebrow">L’IDÉE DE DÉPART</span><h2>${project.id === 'sensoria' ? 'Un geste, une réaction.' : 'Une idée à explorer.'}</h2><p class="body-copy">${esc(project.detail || project.description)}</p><p class="muted">${esc(project.hint || 'Cette fiche présente le concept. Une version accessible ou un téléchargement testé reste à préparer.')}</p></section>
    <section id="evolutions" tabindex="-1"><span class="eyebrow">LE PROJET AVANCE</span><h2>Au fil des versions.</h2><p class="muted">Le journal des évolutions de ce projet n’est pas encore relié au Labs.</p>${project.repo ? external(project.repo, 'Voir le dépôt GitHub') : ''}</section>
    <section id="retours" tabindex="-1"><span class="eyebrow">UNE PLACE POUR TES IDÉES</span><h2>Qu’est-ce que tu en penses ?</h2><p class="muted">Prépare ton retour ici. Garde-le en brouillon privé sur ton appareil, exporte-le, ou choisis de le publier sur GitHub.</p><button class="button secondary" data-feedback="${project.id}">Préparer mon retour →</button></section></div>
    <aside class="project-info"><span class="eyebrow">EN QUELQUES MOTS</span><dl><dt>Catégorie</dt><dd>${categories[project.category]}</dd><dt>Accès</dt><dd>${esc(project.mode)}</dd><dt>Création</dt><dd>Mathieu</dd></dl><hr>${favoriteButton(project, true)}<button class="button secondary full" data-share="${project.id}">Partager le projet ↗</button><p class="local-note">Les favoris sont conservés sur cet appareil.</p></aside></div>
    <section>${heading('ENCORE UN DÉTOUR ?', 'À découvrir aussi.')}<div class="project-grid">${related.map(card).join('')}</div></section>`;
}
function render({focus=true, scroll=true}={}) {
  const route = parseRoute(location.hash);
  let active = 'home';
  if (route.segments[0] === 'projet') {
    const project = projects.find(p => p.id === route.segments[1]);
    main.innerHTML = project ? detail(project) : '<div class="empty"><h1>Projet introuvable.</h1><a href="#/catalogue" class="button secondary">Retour au catalogue</a></div>';
    document.title = project ? `${project.name} — Mathieu / Labs` : 'Projet introuvable — Mathieu / Labs';
  } else if (route.segments[0] === 'catalogue') {
    const options = catalogueOptions();
    main.innerHTML = catalogue(options);
    active = options.favorites ? 'favorites' : options.category === 'all' ? 'catalogue' : options.category;
    document.title = `${options.favorites ? 'Mes favoris' : 'Le catalogue'} — Mathieu / Labs`;
  } else if (route.segments[0] === 'nouveautes') {
    main.innerHTML = `<div class="page-intro"><span class="eyebrow">LE CARNET DU LABO</span><h1>Ce qui bouge ici.</h1><p>Des étapes concrètes, au fil des projets.</p></div>${updates.map(updateCard).join('')}`;
    active = 'nouveautes'; document.title = 'Nouveautés — Mathieu / Labs';
  } else if (!route.segments.length) {
    main.innerHTML = home(); document.title = 'Mathieu / Labs — Des créations à explorer';
  } else {
    main.innerHTML = '<div class="empty"><h1>Un détour imprévu.</h1><p>Cette page n’existe pas.</p><a href="#/" class="button secondary">Retour au Labs</a></div>';
  }
  document.querySelector('#search').value = route.segments[0] === 'catalogue' ? route.query : '';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const match = a.dataset.nav === active || (a.closest('.mobile-nav') && ['jeux','experiences','outils'].includes(active) && a.dataset.nav === 'catalogue');
    if (match) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
  if (scroll) window.scrollTo(0,0);
  if (focus) main.focus({preventScroll:true});
}
function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message; element.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => element.hidden = true, 4500);
}
function payload() {
  const data = new FormData(form);
  return {project:feedbackProject.id, projectName:feedbackProject.name, kind:data.get('kind'),
    summary:String(data.get('summary')).trim(), message:String(data.get('message')).trim(),
    nickname:String(data.get('nickname')).trim(), createdAt:new Date().toISOString(), status:'local-draft'};
}
function draftKey() { return `labs-draft-${feedbackProject.id}`; }
function readDraft(id) {
  try { const data = JSON.parse(storage.getItem(`labs-draft-${id}`) || 'null'); return data && typeof data === 'object' ? data : null; }
  catch { return null; }
}
function saveDraft(explicit=false) {
  clearTimeout(draftTimer);
  if (!feedbackProject || (!dirtyDraft && !explicit)) return;
  const result = document.querySelector('#feedback-result');
  try {
    storage.setItem(draftKey(), JSON.stringify(payload())); dirtyDraft = false;
    result.textContent = 'Brouillon enregistré sur cet appareil. Aucun message envoyé.';
  } catch {
    result.textContent = 'Stockage indisponible. Copie ou exporte ton retour pour le conserver.';
  }
}
function updateFeedbackHint() {
  const kind = form.elements.kind.value;
  form.elements.message.placeholder = kind === 'bug' ? 'Que faisais-tu ? Que s’est-il passé ? Sur quel appareil ?' : kind === 'opinion' ? 'Ce qui t’a plu, ce qui t’a gêné…' : 'Explique ton idée et ce qu’elle apporterait.';
}
function openFeedback(id, opener) {
  feedbackProject = projects.find(p => p.id === id);
  if (!feedbackProject) return;
  feedbackOpener = opener; form.reset(); dirtyDraft = false;
  const draft = readDraft(id);
  if (draft) {
    for (const key of ['summary','message','nickname']) if (typeof draft[key] === 'string') form.elements[key].value = draft[key];
    if (feedbackKinds[draft.kind]) form.elements.kind.value = draft.kind;
  }
  updateFeedbackHint();
  document.querySelector('#feedback-context').textContent = `À propos de ${feedbackProject.name}`;
  document.querySelector('#feedback-result').textContent = draft ? 'Ton dernier brouillon a été retrouvé.' : '';
  document.querySelector('#github-handoff').hidden = true;
  dialog.showModal();
}
function validPayload() {
  if (!form.reportValidity()) return null;
  const data = payload(), error = validateFeedback(data);
  if (error) { document.querySelector('#feedback-result').textContent = error; return null; }
  return data;
}
form.addEventListener('submit', event => { event.preventDefault(); if (validPayload()) saveDraft(true); });
form.addEventListener('input', () => {
  dirtyDraft = true;
  document.querySelector('#github-handoff').hidden = true;
  document.querySelector('#feedback-result').textContent = 'Enregistrement du brouillon…';
  clearTimeout(draftTimer); draftTimer = setTimeout(() => saveDraft(), 650);
});
form.addEventListener('change', updateFeedbackHint);
document.querySelector('#export-feedback').addEventListener('click', () => {
  const data = validPayload(); if (!data) return;
  const url = URL.createObjectURL(new Blob([feedbackText(data)], {type:'text/plain;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = `retour-${data.project}.txt`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Retour exporté. Il n’a pas été envoyé.');
});
document.querySelector('#prepare-github').addEventListener('click', () => {
  const data = validPayload(); if (!data) return;
  saveDraft(true);
  const link = document.querySelector('#github-feedback-link'), handoff = document.querySelector('#github-handoff');
  const url = githubFeedbackUrl(data);
  handoff.hidden = false;
  link.href = url || 'https://github.com/MathieuBal/Labz/issues/new';
  document.querySelector('#github-prefill-note').textContent = url ? 'Le titre et le message seront préremplis. Tu pourras les relire avant de publier.' : 'Ton retour est trop long pour le préremplissage. Copie-le ci-dessous, puis colle-le sur GitHub.';
  handoff.scrollIntoView({block:'nearest', behavior:'auto'});
});
document.querySelector('#copy-feedback').addEventListener('click', async () => {
  const data = validPayload(); if (!data) return;
  try { await navigator.clipboard.writeText(feedbackText(data)); toast('Texte du retour copié.'); }
  catch { document.querySelector('#feedback-result').textContent = 'Copie indisponible. Utilise « Exporter le retour ».'; }
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { saveDraft(); feedbackOpener?.focus(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) saveDraft(); });

function refreshFavoriteButtons(id) {
  document.querySelectorAll(`[data-favorite="${id}"]`).forEach(button => {
    const project = projects.find(p => p.id === id);
    const wrapper = document.createElement('div'); wrapper.innerHTML = favoriteButton(project, button.classList.contains('full'));
    const newButton = wrapper.firstElementChild;
    button.innerHTML = newButton.innerHTML;
    button.setAttribute('aria-pressed', String(favorite(id)));
    button.setAttribute('aria-label', newButton.getAttribute('aria-label'));
  });
}
document.addEventListener('click', async event => {
  const feedback = event.target.closest('[data-feedback]');
  if (feedback) openFeedback(feedback.dataset.feedback, feedback);
  const toggleFavorite = event.target.closest('[data-favorite]');
  if (toggleFavorite) {
    const id = toggleFavorite.dataset.favorite;
    collection.favorites = favorite(id) ? collection.favorites.filter(item => item !== id) : [...collection.favorites, id];
    saveCollection(); refreshFavoriteButtons(id);
    const route = parseRoute(location.hash);
    if (route.favorites && route.segments[0] === 'catalogue') render({scroll:false});
  }
  const launch = event.target.closest('[data-launch]');
  if (launch) { collection = rememberLaunch(collection, launch.dataset.launch); saveCollection(); }
  const filter = event.target.closest('[data-toggle]');
  if (filter) {
    const options = catalogueOptions();
    options[filter.dataset.toggle] = !options[filter.dataset.toggle]; location.hash = catalogueHref(options);
  }
  if (event.target.closest('[data-random]')) {
    const available = projects.filter(p => p.live);
    if (available.length) location.hash = `/projet/${available[Math.floor(Math.random() * available.length)].id}`;
  }
  const share = event.target.closest('[data-share]');
  if (share) {
    try {
      if (navigator.share) await navigator.share({title:document.title, url:location.href});
      else { await navigator.clipboard.writeText(location.href); toast('Lien copié.'); }
    } catch (error) { if (error.name !== 'AbortError') toast('Copie l’adresse depuis la barre de ton navigateur.'); }
  }
  const sectionLink = event.target.closest('.detail-tabs a');
  if (sectionLink) {
    event.preventDefault();
    const section = document.querySelector(sectionLink.getAttribute('href'));
    section?.focus({preventScroll:true});
    section?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
});
document.addEventListener('change', event => {
  if (event.target.id === 'catalogue-sort') location.hash = catalogueHref({...catalogueOptions(), sort:event.target.value});
});
document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const route = parseRoute(location.hash);
  const options = route.segments[0] === 'catalogue' ? catalogueOptions() : {};
  const href = catalogueHref({...options, query:document.querySelector('#search').value.trim()});
  if (location.hash === href) render(); else location.hash = href;
});
window.addEventListener('storage', event => {
  if (event.key === COLLECTION_KEY) {
    collection = readCollection(storage, knownIds);
    if (!dialog.open) render({focus:false, scroll:false});
  }
});
window.addEventListener('hashchange', () => {
  if (dialog.open) dialog.close();
  render();
});
render({focus:false});
