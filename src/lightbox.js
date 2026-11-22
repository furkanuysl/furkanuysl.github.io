// Click any image link inside a [data-gallery] container (game panel or classic CV)
// to open it in a popup; arrows / swipe / buttons step through that gallery.
const dlg = document.createElement('dialog');
dlg.className = 'lightbox';
dlg.setAttribute('aria-label', 'Görsel');
dlg.innerHTML = `
  <div class="lightbox__frame">
    <img class="lightbox__img" alt="">
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Kapat"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="Önceki"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="Sonraki"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
    <p class="lightbox__count" aria-live="polite"></p>
  </div>`;
document.body.append(dlg);

const img = dlg.querySelector('.lightbox__img');
const count = dlg.querySelector('.lightbox__count');
let items = [];
let index = 0;

function show(i) {
  index = (i + items.length) % items.length;
  const a = items[index];
  img.src = a.href;
  img.alt = a.querySelector('img')?.alt ?? '';
  count.textContent = `${index + 1} / ${items.length}`;
  dlg.classList.toggle('lightbox--single', items.length < 2);
}

document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-gallery] a');
  if (!a) return;
  e.preventDefault();
  items = [...a.closest('[data-gallery]').querySelectorAll('a')];
  show(items.indexOf(a));
  if (!dlg.open) dlg.showModal();
});

dlg.querySelector('.lightbox__close').onclick = () => dlg.close();
dlg.querySelector('.lightbox__prev').onclick = () => show(index - 1);
dlg.querySelector('.lightbox__next').onclick = () => show(index + 1);
// click on the dark backdrop (not the image or buttons) closes
let swiped = false;
dlg.addEventListener('click', (e) => {
  if (swiped) return void (swiped = false);
  if (e.target === dlg) dlg.close();
});

dlg.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(index - 1);
  else if (e.key === 'ArrowRight') show(index + 1);
  // keep keys away from the game's movement / panel shortcuts
  e.stopPropagation();
});

dlg.addEventListener('close', () => (img.src = ''));
let startX = null;
dlg.addEventListener('pointerdown', (e) => (startX = e.clientX));
dlg.addEventListener('pointerup', (e) => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 50) {
    swiped = true;
    show(index + (dx < 0 ? 1 : -1));
  }
});
