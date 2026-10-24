const mobileHome = '.mobile-nav [data-nav="home"]';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function scrollToTopNow() {
  window.scrollTo({top:0,left:0,behavior:'auto'});
}

function enforceTop() {
  scrollToTopNow();
  requestAnimationFrame(() => {
    scrollToTopNow();
    requestAnimationFrame(scrollToTopNow);
  });
  setTimeout(scrollToTopNow, 80);
}

function needsTopReset(hash=location.hash) {
  return /^#\/projet\//.test(hash) || hash === '#/' || hash === '';
}

document.addEventListener('click', event => {
  const home = event.target.closest(mobileHome);
  if (!home) return;
  event.preventDefault();
  if (location.hash === '#/' || location.hash === '') {
    if (location.hash !== '#/') history.replaceState(null, '', '#/');
    enforceTop();
    return;
  }
  location.hash = '#/';
});

window.addEventListener('hashchange', () => {
  if (needsTopReset()) enforceTop();
});

if (needsTopReset()) queueMicrotask(enforceTop);

export { needsTopReset };
