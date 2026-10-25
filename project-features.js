const isProjectRoute = () => /^#\/projet\/[^/?]+/.test(location.hash || '');
const isRpRoute = () => /^#\/projet\/ecosysteme-rp(?:[/?]|$)/.test(location.hash || '');

let commonModules = null;
let rpModule = null;

function moduleUrl(path) {
  const url = new URL(path, import.meta.url);
  const revision = new URL(import.meta.url).searchParams.get('v');
  if (revision) url.searchParams.set('v', revision);
  return url.href;
}

function publicProjectUrl(id) {
  return new URL(`projets/${encodeURIComponent(id)}/`, document.baseURI).href;
}

function notify(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => { if (toast.textContent === message) toast.hidden = true; }, 4500);
}

async function loadProjectFeatures() {
  if (!isProjectRoute()) return;

  if (!commonModules) {
    commonModules = Promise.all([
      import(moduleUrl('./project-gallery.js')),
      import(moduleUrl('./project-pages.js')),
    ]).catch(error => {
      commonModules = null;
      throw error;
    });
  }

  try {
    await commonModules;
    if (isRpRoute() && !rpModule) {
      rpModule = import(moduleUrl('./rp-case-study.js')).catch(error => {
        rpModule = null;
        throw error;
      });
      await rpModule;
    }
  } catch (error) {
    console.error('Impossible de charger les modules de la fiche projet.', error);
  }
}

document.addEventListener('click', async event => {
  const share = event.target.closest('[data-share]');
  if (!share?.dataset.share) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const url = publicProjectUrl(share.dataset.share);
  try {
    if (navigator.share) await navigator.share({title: document.title, url});
    else {
      await navigator.clipboard.writeText(url);
      notify('Lien public du projet copié.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') notify('Copie l’adresse publique du projet depuis sa page.');
  }
}, true);

window.addEventListener('hashchange', () => { void loadProjectFeatures(); });
void loadProjectFeatures();
