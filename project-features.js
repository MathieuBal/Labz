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

window.addEventListener('hashchange', () => { void loadProjectFeatures(); });
void loadProjectFeatures();
