import { updates, currentRelease } from './release-notes.js';
import { mountAdmin } from './admin-view.js';
import { feedbackEndpoint } from './feedback-config.js';
import { sendPrivateFeedback } from './feedback-client.js';
import {createFeedbackDrafts,submissionSignature} from './feedback-drafts.js';
import { activityRepositories, loadActivity } from './github-activity.js';
import { projects, categories, filterProjects, retiredProjectIds } from './catalog.js';
import { COLLECTION_KEY, readCollection, writeCollection, rememberLaunch, parseRoute,
  catalogueHref, feedbackKinds, validateFeedback } from './model.js';

document.querySelector('[data-site-version]').textContent = `v${currentRelease.version}`;
const main = document.querySelector('#main');
let disposeAdmin = null;
const dialog = document.querySelector('#feedback');
const form = document.querySelector('#feedback-form');
const knownIds = new Set(projects.map(p => p.id));
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let collection = readCollection(storage, knownIds);
let feedbackProject = null, feedbackOpener = null, toastTimer, draftTimer;
let dirtyDraft = false;
let privateSendBusy = false;
const drafts = createFeedbackDrafts({storage});
for (const id of knownIds) drafts.read(id);
let feedbackView = 0;
let draftPersisted = true;
let activityController = null;
let activityBusy = false;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const favorite = id => collection.favorites.includes(id);

function saveCollection() {
  if (!writeCollection(storage, collection)) toast('La sélection reste disponible pour cette session. Le stockage de cet appareil est indisponible.');
}
function external(url, label, cls='secondary', id='') {
  return `<a class="button ${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${id ? `data-launch="${id}"` : ''}>${label} <span aria-hidden="true">↗</span></a>`;
}
function art(p, hero=false) {
  return `<div class="art art-${p.art}${p.cover ? ' source-art' : ''}${hero ? ' hero-art' : ''}" aria-hidden="true"><img src="${esc(p.cover || `assets/${p.art}.svg`)}" alt="" ${hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} width="960" height="540"></div>`;
}
function favoriteButton(p, full=false) {
  return `<button class="${full ? 'button secondary full' : 'favorite-button'}" data-favorite="${p.id}" aria-pressed="${favorite(p.id)}" aria-label="${favorite(p.id) ? 'Retirer' : 'Ajouter'} ${esc(p.name)} ${favorite(p.id) ? 'des' : 'aux'} favoris"><span aria-hidden="true">${favorite(p.id) ? '♥' : '♡'}</span>${full ? (favorite(p.id) ? 'Dans mes favoris' : 'Garder en favori') : ''}</button>`;
}
function card(p) {
  return `<article class="project-card"><div class="cover-wrap"><a class="card-cover" href="#/projet/${p.id}" aria-label="Découvrir ${esc(p.name)}">${art(p)}<span class="cover-label">${p.live ? 'À ESSAYER' : 'PRÉSENTATION'}</span></a>${favoriteButton(p)}</div><div class="card-body"><span class="eyebrow">${categories[p.category]} <span class="separator">/</span> ${esc(p.mode)}</span><h3><a href="#/projet/${p.id}">${esc(p.name)}</a></h3><p>${esc(p.invitation || p.description)}</p>${p.live ? external(p.live, esc(p.action), 'primary card-launch', p.id) : ''}<a class="card-link" href="#/projet/${p.id}">Découvrir le projet <span>↗</span></a></div></article>`;
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
    <section>${heading('DANS L’ATELIER', 'Les idées prennent forme.', '<a class="text-link" href="#/catalogue">Toute la sélection →</a>')}<div class="project-grid">${['diagnostic','constella','pipboy'].map(id => projects.find(p => p.id === id)).map(card).join('')}</div></section>
    <section class="participate"><span class="participate-symbol" aria-hidden="true">✳</span><div><span class="eyebrow">ÇA SE CONSTRUIT ENSEMBLE</span><h2>Ton regard change la suite.</h2><p>Une idée, un bug ou un ressenti ? Dépose ton avis directement depuis la fiche du projet.</p></div><a class="button secondary" href="#/catalogue">Choisir un projet →</a></section>
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
  return `<div class="page-intro"><span class="eyebrow">${options.favorites ? 'TES ENVIES DE DÉCOUVERTE' : 'LA COLLECTION'}</span><h1>${options.favorites ? 'Garde une place pour la suite.' : 'Trouve ton prochain détour.'}</h1><p>${options.favorites ? 'Ta sélection reste sur cet appareil, sans créer de compte.' : `${projects.length} créations choisies pour leur expérience ou leur utilité. Les projets sans accès direct sont présentés séparément.`}</p></div>
    ${chips(options)}
    <div class="catalogue-toolbar"><div class="quick-filters"><button class="filter-toggle ${options.playable ? 'active' : ''}" data-toggle="playable" aria-pressed="${options.playable}"><span aria-hidden="true">▷</span> À essayer maintenant</button><button class="filter-toggle ${options.favorites ? 'active' : ''}" data-toggle="favorites" aria-pressed="${options.favorites}"><span aria-hidden="true">♡</span> Mes favoris</button></div><label class="sort-label">Trier <select id="catalogue-sort"><option value="selection" ${options.sort === 'selection' ? 'selected' : ''}>Sélection du labo</option><option value="name" ${options.sort === 'name' ? 'selected' : ''}>Nom A–Z</option></select></label></div>
    <p class="results-count" role="status">${list.length} projet${list.length > 1 ? 's' : ''}${options.query ? ` pour « ${esc(options.query)} »` : ''}</p>
    ${list.length ? catalogueGroups(list) : `<div class="empty"><span class="empty-symbol" aria-hidden="true">${emptyFavorites ? '♡' : '⌕'}</span><h2>${emptyFavorites ? 'Ta sélection commence ici.' : 'Aucun projet avec ces critères.'}</h2><p>${emptyFavorites ? 'Touche le cœur d’un projet pour le retrouver ici.' : 'Essaie une recherche plus courte ou retire un filtre.'}</p><a href="#/catalogue" class="button secondary">Explorer tous les projets →</a></div>`}`;
}
function catalogueGroups(list) {
  const ready = list.filter(p => p.live);
  const workshop = list.filter(p => !p.live);
  return `${ready.length ? `<section class="catalogue-section">${heading('OUVRE ET EXPLORE', 'À essayer maintenant.')}<div class="project-grid catalogue-grid">${ready.map(card).join('')}</div></section>` : ''}
    ${workshop.length ? `<section class="catalogue-section">${heading('DANS L’ATELIER', 'À découvrir en présentation.')}<p class="muted">Des projets sélectionnés pour leur idée ou leur usage. Leur accès public reste à préparer ou à vérifier ; aucun lancement direct n’est proposé ici.</p><div class="project-grid catalogue-grid">${workshop.map(card).join('')}</div></section>` : ''}`;
}
function updateCard(update, level=3) {
  return `<article class="update"><time datetime="${update.date}">${new Date(update.date+'T12:00:00Z').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Paris'})}</time><div><span class="eyebrow">${esc(update.project)}</span><h${level}>${esc(update.title)}</h${level}><p>${esc(update.description)}</p>${update.items ? `<ul class="update-items">${update.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</div><span class="update-arrow" aria-hidden="true">↗</span></article>`;
}
function visitorGuide(project) {
  if (!project.steps) return '';
  return `<div class="visitor-guide"><span class="eyebrow">TES PREMIERS PAS</span><h3>${esc(project.firstTry)}</h3><ol>${project.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><dl><dt>Les commandes</dt><dd>${esc(project.controls)}</dd><dt>Ta sauvegarde</dt><dd>${esc(project.saveNote)}</dd><dt>Bon à savoir</dt><dd>${esc(project.comfort)}</dd></dl></div>`;
}
function detail(project) {
  const related = projects.filter(p => p.id !== project.id).sort((a,b) => Number(b.category === project.category) - Number(a.category === project.category)).slice(0,3);
  return `<a class="back" href="#/catalogue">← Tous les projets</a>
    <section class="project-overview"><div class="project-lead"><span class="eyebrow">${categories[project.category]} · ${esc(project.mode)}</span>
    <h1>${esc(project.name)}</h1><div class="detail-actions">
    ${project.live ? external(project.live, esc(project.launchLabel || 'Lancer'), 'primary', project.id) : '<span class="availability">Pas encore de démo publique</span>'}
    <button class="button secondary" data-feedback="${project.id}">${project.live ? 'Déposer un avis' : 'Donner un avis sur le concept'}</button></div>
    <p class="project-intro">${esc(project.invitation || project.description)}</p></div>
    <div class="project-visual">${art(project)}<small>${esc(project.coverLabel || 'Illustration provisoire')}</small></div></section>
    <div class="project-quick-tools">${favoriteButton(project, true)}<button class="text-link" data-share="${project.id}">Partager ↗</button></div>
    <section class="project-summary"><p>${esc(project.takeaway || project.detail || project.description)}</p>
    ${project.steps ? `<details class="project-disclosure"><summary>Comment en profiter ?</summary>${visitorGuide(project)}</details>` : ''}
    <details class="project-disclosure"><summary>À propos du projet</summary><div class="disclosure-body"><p class="muted">${esc(project.hint || 'Cette fiche présente le concept. Une version publique reste à préparer.')}</p>${project.repo ? external(project.repo, 'Voir le code sur GitHub') : ''}</div></details>
    ${activityRepositories[project.id] ? `<details class="project-disclosure" data-project-activity><summary>Dernières évolutions</summary><div class="disclosure-body"><div id="github-activity" data-project="${project.id}" aria-busy="false"><p class="muted">Ouvre cette rubrique pour consulter les évolutions.</p></div><button class="text-link activity-refresh" data-refresh-activity>Actualiser ↻</button></div></details>` : ''}</section>
    <section>${heading('POURSUIVRE LA DÉCOUVERTE', 'À découvrir aussi.')}<div class="project-grid">${related.map(card).join('')}</div></section>`;
}
function render({focus=true, scroll=true}={}) {
  disposeAdmin?.(); disposeAdmin = null;
  activityController?.abort();
  activityController = null;
  const route = parseRoute(location.hash);
  let active = 'home';
  if (route.segments[0] === 'admin') {
    disposeAdmin = mountAdmin(main, projects);
    active = 'admin'; document.title = 'Administration | Mathieu / Labs';
  } else if (route.segments[0] === 'projet') {
    const project = projects.find(p => p.id === route.segments[1]);
    main.innerHTML = project ? detail(project) : retiredProjectIds.includes(route.segments[1]) ? '<div class="empty"><span class="eyebrow">LA SÉLECTION ÉVOLUE</span><h1>Ce projet a quitté la sélection.</h1><p>Le Labs se concentre sur quelques créations. Le dépôt d’origine reste conservé.</p><a href="#/catalogue" class="button primary">Découvrir la sélection →</a></div>' : '<div class="empty"><h1>Projet introuvable.</h1><a href="#/catalogue" class="button secondary">Retour au catalogue</a></div>';
    document.title = project ? `${project.name} | Mathieu / Labs` : 'Projet introuvable | Mathieu / Labs';
  } else if (route.segments[0] === 'catalogue') {
    const options = catalogueOptions();
    main.innerHTML = catalogue(options);
    active = options.favorites ? 'favorites' : options.category === 'all' ? 'catalogue' : options.category;
    document.title = `${options.favorites ? 'Mes favoris' : 'Le catalogue'} | Mathieu / Labs`;
  } else if (route.segments[0] === 'nouveautes') {
    main.innerHTML = `<div class="page-intro"><span class="eyebrow">LE CARNET DU LABO</span><h1>Ce qui bouge ici.</h1><p>Des étapes concrètes, au fil des projets.</p></div>${updates.map(update => updateCard(update, 2)).join('')}<section class="activity-section">${heading('LES PROJETS BOUGENT AUSSI', 'Du côté des projets.')}<p class="muted">Versions publiées sur GitHub ou, à défaut, derniers changements du code. Un commit ne garantit pas une mise à jour du jeu en ligne.</p><div id="github-activity" data-project="all" aria-busy="true"><p class="muted" role="status">Lecture des nouveautés GitHub…</p></div><button class="button secondary" data-refresh-activity>Actualiser les projets ↻</button></section>`;
    active = 'nouveautes'; document.title = 'Nouveautés | Mathieu / Labs';
  } else if (!route.segments.length) {
    main.innerHTML = home(); document.title = 'Mathieu / Labs | Des créations à explorer';
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
  const activityDetails = document.querySelector('[data-project-activity]');
  if (activityDetails) activityDetails.addEventListener('toggle', () => {
    if (activityDetails.open && !activityDetails.dataset.loaded) {
      activityDetails.dataset.loaded = 'true'; void refreshActivity();
    }
  });
  else if (document.querySelector('#github-activity')) void refreshActivity();
}

function activityMarkup(result, project) {
  const label = result.state === 'stale' ? '<p class="activity-warning">Actualisation impossible. Les dernières données déjà reçues sont affichées.</p>' : '';
  if (result.state === 'error') return `<p class="muted" role="status">${result.error === 'rate-limit' ? 'GitHub limite temporairement les consultations. Réessaie plus tard.' : 'Les nouveautés GitHub sont momentanément indisponibles.'} Tu peux toujours explorer le projet.</p>`;
  if (!result.items.length) return '<p class="muted">Aucune version ni activité disponible pour le moment.</p>';
  const commits = result.items[0].kind === 'commit';
  return `${label}<p class="activity-source">${commits ? 'Activité du code · aucune version publiée trouvée' : 'Versions publiées sur GitHub'}</p><div class="activity-list">${result.items.map(item => `<article class="activity-entry"><div><span class="activity-badge ${item.kind}">${item.kind === 'commit' ? 'CODE' : item.preview ? 'PRÉVERSION' : 'VERSION'}</span><time datetime="${esc(item.date)}">${new Date(item.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Paris'})}</time></div><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)} ↗</a>${item.excerpt ? `<details><summary>Lire les notes de version</summary><p class="release-excerpt">${esc(item.excerpt)}${item.excerpt.length === 600 ? '…' : ''}</p></details>` : ''}</article>`).join('')}</div>`;
}
async function refreshActivity(force=false) {
  const target = document.querySelector('#github-activity');
  if (!target) return;
  activityController?.abort();
  const controller = new AbortController();
  activityController = controller; activityBusy = true;
  const refresh = document.querySelector('[data-refresh-activity]');
  if (refresh) refresh.disabled = true;
  target.setAttribute('aria-busy','true');
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const ids = target.dataset.project === 'all' ? Object.keys(activityRepositories) : [target.dataset.project];
    const results = await Promise.all(ids.map(id => loadActivity(id,{signal:controller.signal,force})));
    if (activityController !== controller || !target.isConnected) return;
    if (ids.length === 1) target.innerHTML = activityMarkup(results[0], projects.find(p => p.id === ids[0]));
    else target.innerHTML = ids.map((id,index) => `<section class="project-activity"><h3><a href="#/projet/${id}">${esc(projects.find(p => p.id === id).name)} →</a></h3>${activityMarkup(results[index],projects.find(p => p.id === id))}</section>`).join('');
  } catch {
    if (activityController === controller && target.isConnected) target.innerHTML = '<p class="muted" role="status">La réponse de GitHub prend trop de temps. Tu peux réessayer.</p>';
  } finally {
    clearTimeout(timeout);
    if (activityController === controller) {
      activityBusy = false; target.setAttribute('aria-busy','false');
      if (refresh?.isConnected) refresh.disabled = false;
    }
  }
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
function feedbackStatus(message='') {
  if (!feedbackProject) return;
  const state = drafts.state(feedbackProject.id,payload());
  const button = document.querySelector('#send-private-feedback');
  button.disabled = privateSendBusy || !feedbackEndpoint || state === 'received';
  button.textContent = privateSendBusy ? 'Envoi en cours…' : state === 'received' ? 'Retour déjà reçu' : state === 'uncertain' || state === 'pending' ? 'Réessayer l’envoi' : 'Envoyer à Mathieu';
  document.querySelector('#erase-feedback-draft').disabled = privateSendBusy;
  draftPersisted = drafts.isPersistent(feedbackProject.id);
  const warning = draftPersisted ? '' : ' Le stockage local est indisponible : le texte reste seulement dans cet onglet et une relance après rechargement peut créer un doublon.';
  document.querySelector('#feedback-result').textContent = (message ||
    (state === 'received' ? 'Ce retour a été reçu en privé. Tu peux fermer ce formulaire ou modifier le texte pour écrire un nouveau retour.' :
     state === 'pending' || state === 'uncertain' ? 'La réception de ce texte n’est pas confirmée. Réessaie : le même identifiant sera réutilisé.' :
     drafts.read(feedbackProject.id) ? 'Brouillon conservé. Le texte actuel n’a pas été confirmé comme reçu.' : '')) + warning;
}
function saveDraft(explicit=false) {
  clearTimeout(draftTimer);
  if (!feedbackProject || (!dirtyDraft && !explicit)) return;
  draftPersisted = drafts.save(feedbackProject.id,payload()).persisted;
  dirtyDraft = false;
  if (!privateSendBusy) feedbackStatus();
}
function updateFeedbackHint() {
  const kind = form.elements.kind.value;
  form.elements.message.placeholder = kind === 'bug' ? 'Que faisais-tu ? Que s’est-il passé ? Sur quel appareil ?' : kind === 'opinion' ? 'Ce qui t’a plu, ce qui t’a gêné…' : 'Explique ton idée et ce qu’elle apporterait.';
}
function openFeedback(id, opener) {
  feedbackProject = projects.find(p => p.id === id);
  if (!feedbackProject) return;
  feedbackOpener = opener; feedbackView++; form.reset(); dirtyDraft = false; draftPersisted = true;
  const draft = drafts.read(id)?.data;
  if (draft) {
    for (const key of ['summary','message','nickname']) if (typeof draft[key] === 'string') form.elements[key].value = draft[key];
    if (feedbackKinds[draft.kind]) form.elements.kind.value = draft.kind;
  }
  updateFeedbackHint();
  document.querySelector('#feedback-context').textContent = `À propos de ${feedbackProject.name}`;
  feedbackStatus();
  document.querySelector('#private-feedback').hidden = false;
  if (!feedbackEndpoint) document.querySelector('#feedback-result').textContent = 'La messagerie est temporairement indisponible. Ton brouillon est conservé.';
  dialog.showModal();
}
function validPayload() {
  if (!form.reportValidity()) return null;
  const data = payload(), error = validateFeedback(data);
  if (error) { document.querySelector('#feedback-result').textContent = error; return null; }
  return data;
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!feedbackEndpoint || privateSendBusy) return;
  const data = validPayload(); if (!data) return;
  clearTimeout(draftTimer); dirtyDraft = false;
  const ticket = drafts.prepare(data.project,data);
  draftPersisted = ticket.persisted;
  if (ticket.alreadyReceived) { feedbackStatus(); return; }
  const view = feedbackView;
  const message = {project:data.project,kind:data.kind,summary:data.summary,message:data.message,nickname:data.nickname,website:form.elements.website.value};
  privateSendBusy = true; feedbackStatus('Envoi en cours…');
  let result;
  try {
    await sendPrivateFeedback(feedbackEndpoint,{...message,requestId:ticket.requestId},{signal:AbortSignal.timeout(12000)});
    drafts.settle(ticket,true);
    result = 'Le texte envoyé a été reçu en privé. Merci !';
  } catch (error) {
    drafts.settle(ticket,false);
    result = error.message === 'limited' ? 'La réception est temporairement limitée. Ton texte est conservé ; réessaie plus tard.' : 'La réception n’a pas pu être confirmée. Tu peux réessayer sans changer le texte.';
  } finally {
    privateSendBusy = false;
    if (dialog.open) {
      // A late acknowledgement belongs to the submitted snapshot, not to edits
      // or another project's dialog opened while the request was in flight.
      if (feedbackView === view && feedbackProject?.id === data.project) {
        feedbackStatus(submissionSignature(payload()) !== ticket.attempt.signature ? result + ' Ce résultat concerne le texte précédent, pas tes modifications actuelles.' : result);
      } else feedbackStatus();
    }
    if (!dialog.open || feedbackView !== view) toast(result);
  }
});
form.addEventListener('input', () => {
  dirtyDraft = true;
  if (!privateSendBusy) feedbackStatus('Enregistrement du brouillon…');
  clearTimeout(draftTimer); draftTimer = setTimeout(() => saveDraft(), 650);
});
form.addEventListener('change', updateFeedbackHint);
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { saveDraft(); feedbackOpener?.focus(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) saveDraft(); });
document.querySelector('#erase-feedback-draft').addEventListener('click', () => {
  if (privateSendBusy || !feedbackProject) return;
  if (!window.confirm('Effacer le texte et son accusé sur cet appareil ? Cela ne supprime pas un retour déjà reçu par Mathieu.')) return;
  clearTimeout(draftTimer); dirtyDraft = false; feedbackView++;
  const erased = drafts.erase(feedbackProject.id);
  form.reset(); updateFeedbackHint(); draftPersisted = true;
  feedbackStatus(erased ? 'Texte et accusé effacés sur cet appareil.' : 'L’effacement du stockage local a échoué. Efface les données du site dans ton navigateur.');
});

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
  if (event.target.closest('.skip')) {
    event.preventDefault();
    main.focus({preventScroll:true});
    main.scrollIntoView({block:'start'});
    return;
  }
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
  if (event.target.closest('[data-refresh-activity]') && !activityBusy) void refreshActivity(true);
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
