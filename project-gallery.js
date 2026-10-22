import { projects } from './catalog.js';

const main = document.querySelector('#main');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

function currentProject() {
  const match = (location.hash || '').match(/^#\/projet\/([^/?]+)/);
  if (!match) return null;
  const id = decodeURIComponent(match[1]);
  return projects.find(project => project.id === id) || null;
}

function position(value, fallback='50%') {
  return typeof value === 'string' && /^\d{1,3}%$/.test(value) ? value : fallback;
}

function galleryItems(project) {
  const fallback = {
    src: project.cover || `assets/${project.art}.svg`,
    alt: `Aperçu de ${project.name}`,
    label: project.coverLabel || 'Aperçu du projet'
  };
  const source = Array.isArray(project.gallery) && project.gallery.length ? project.gallery : [fallback];
  return source.map((item, index) => ({
    src: item.src || fallback.src,
    alt: item.alt || (source.length > 1 ? `Aperçu ${index + 1} de ${project.name}` : fallback.alt),
    label: item.label || fallback.label,
    zoom: Number.isFinite(Number(item.zoom)) ? Math.max(1, Math.min(2.4, Number(item.zoom))) : 1,
    x: position(item.x),
    y: position(item.y)
  }));
}

function galleryMarkup(project) {
  const items = galleryItems(project);
  const multi = items.length > 1;
  return `<section class="project-gallery" data-project-gallery aria-label="Aperçus de ${esc(project.name)}" aria-roledescription="carrousel">
    <div class="project-gallery-track" data-gallery-track tabindex="0" aria-label="Galerie de ${esc(project.name)}">
      ${items.map((item, index) => `<figure class="project-gallery-slide" data-gallery-slide aria-label="${index + 1} sur ${items.length}">
        <div class="project-gallery-media"><img src="${esc(item.src)}" alt="${esc(item.alt)}" ${index ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"'} style="--gallery-zoom:${item.zoom};--gallery-x:${item.x};--gallery-y:${item.y}"></div>
        <figcaption><span class="project-gallery-index">${index + 1}/${items.length}</span><span>${esc(item.label)}</span></figcaption>
      </figure>`).join('')}
    </div>
    ${multi ? `<button type="button" class="project-gallery-arrow project-gallery-prev" data-gallery-prev aria-label="Aperçu précédent">←</button>
    <button type="button" class="project-gallery-arrow project-gallery-next" data-gallery-next aria-label="Aperçu suivant">→</button>
    <div class="project-gallery-dots" aria-label="Choisir un aperçu">${items.map((_, index) => `<button type="button" data-gallery-dot="${index}" aria-label="Afficher l’aperçu ${index + 1}" ${index === 0 ? 'aria-current="true"' : ''}></button>`).join('')}</div>` : ''}
  </section>`;
}

function wireGallery(root) {
  const track = root.querySelector('[data-gallery-track]');
  const slides = [...root.querySelectorAll('[data-gallery-slide]')];
  const dots = [...root.querySelectorAll('[data-gallery-dot]')];
  const previous = root.querySelector('[data-gallery-prev]');
  const next = root.querySelector('[data-gallery-next]');
  if (!track || !slides.length) return;

  let frame = 0;
  const index = () => Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(track.clientWidth, 1))));
  const sync = () => {
    frame = 0;
    const active = index();
    dots.forEach((dot, dotIndex) => dot.toggleAttribute('aria-current', dotIndex === active));
    if (previous) previous.disabled = active === 0;
    if (next) next.disabled = active === slides.length - 1;
  };
  const scheduleSync = () => {
    if (!frame) frame = requestAnimationFrame(sync);
  };
  const go = target => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, target));
    track.scrollTo({left: nextIndex * track.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth'});
  };

  track.addEventListener('scroll', scheduleSync, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(index() + (event.key === 'ArrowRight' ? 1 : -1));
  });
  previous?.addEventListener('click', () => go(index() - 1));
  next?.addEventListener('click', () => go(index() + 1));
  dots.forEach(dot => dot.addEventListener('click', () => go(Number(dot.dataset.galleryDot))));
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(track);
  sync();
}

function mountProjectGallery() {
  const project = currentProject();
  const overview = main?.querySelector('.project-overview');
  if (!project || !overview || main.querySelector('[data-project-gallery]')) return;

  const template = document.createElement('template');
  template.innerHTML = galleryMarkup(project).trim();
  const gallery = template.content.firstElementChild;
  overview.before(gallery);
  overview.classList.add('project-overview-with-gallery');
  overview.querySelector('.project-visual')?.remove();
  wireGallery(gallery);
}

const observer = new MutationObserver(() => mountProjectGallery());
if (main) observer.observe(main, {childList:true, subtree:true});
window.addEventListener('hashchange', () => queueMicrotask(mountProjectGallery));
mountProjectGallery();
