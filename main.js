/* Extracted from index.html bottom <script> */

/* ─── CURSOR ─── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document
    .querySelectorAll('a, button, input, textarea, select, .format-card, .svc-card')
    .forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 },
);
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

/* ─── NAV SHRINK ON SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const wide = window.innerWidth > 900;
  nav.style.padding = window.scrollY > 60
    ? (wide ? '14px 56px' : '14px 24px')
    : (wide ? '20px 56px' : '16px 24px');
});

/* ─── NAV CTA HREF (mobile → form, desktop → section) ─── */
const navCta = document.querySelector('.nav-cta');
function updateCtaHref() {
  navCta.href = window.innerWidth <= 900 ? '#contact-form' : '#contact';
}
updateCtaHref();
window.addEventListener('resize', updateCtaHref);

/* ─── FORM SUBMIT ─── */
async function submitForm(btn) {
  const hp = document.getElementById('hp-website');
  if (hp && hp.value.trim() !== '') {
    showFeedback('ok', '✓ Заявка отправлена! Свяжусь с вами в течение 24 часов.');
    return;
  }

  const name    = document.getElementById('f-name').value.trim();
  const contact = document.getElementById('f-contact').value.trim();
  const format  = document.getElementById('f-format').value;
  const message = document.getElementById('f-message').value.trim();

  if (!name || !contact) {
    showFeedback('err', '⚠ Пожалуйста, укажите имя и способ связи.');
    return;
  }

  const now  = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const text = `📬 <b>Новая заявка с сайта</b>\n\n`
             + `👤 <b>Имя:</b> ${esc(name)}\n`
             + `📞 <b>Контакт:</b> ${esc(contact)}\n`
             + `🖥 <b>Формат:</b> ${esc(format || 'не указан')}\n`
             + `💬 <b>Запрос:</b> ${esc(message || '—')}\n\n`
             + `🕐 ${now} (МСК)`;

  btn.disabled    = true;
  btn.textContent = 'Отправляю...';

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3nXa0b3HXUCfd1y4Kl5rk5YMlchwiBAuQkXySsHn-3V9LUkEKOVmTvzAgRc5V4Ty9/exec';

  try {
    const res  = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        text: text,
        key: 'titkov_site_nevitaly',
      }),
    });
    const data = await res.json();

    if (data.ok) {
      if (typeof ym !== 'undefined') {
        ym(107284276, 'reachGoal', 'form_lead');
      }

      btn.textContent = '✓ Отправлено';
      showFeedback('ok', '✓ Заявка отправлена! Свяжусь с вами в течение 24 часов.');
      ['f-name', 'f-contact', 'f-format', 'f-message'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    } else {
      throw new Error(data.error || 'Google Script error');
    }
  } catch (err) {
    console.error(err);
    btn.disabled    = false;
    btn.textContent = 'Отправить заявку →';
    showFeedback('err', '⚠ Ошибка отправки. Напишите напрямую в Telegram или WhatsApp.');
  }
}

function showFeedback(type, msg) {
  const el = document.getElementById('formFeedback');
  el.className   = 'form-feedback ' + type;
  el.textContent = msg;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─── TRACK MESSENGERS CLICK ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Ищем все ссылки на WhatsApp и Telegram на странице
  const links = document.querySelectorAll('a[href*="t.me"], a[href*="wa.me"], a[href*="api.whatsapp.com"]');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof ym !== 'undefined') {
        ym(107284276, 'reachGoal', 'click_messenger');
      }
    });
  });
});

/* ─── CERTIFICATES SLIDER ─── */
const certImages = [
  'img/sert/sert1.jpg',
  'img/sert/sert2.jpg',
  'img/sert/sert3.jpg',
  'img/sert/sert4.jpg',
  'img/sert/sert5.jpg',
  'img/sert/sert6.jpg',
  'img/sert/sert7.jpg',
];
let currentCert = 0;

function openCert(src) {
  currentCert = certImages.indexOf(src);
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function nextCert() {
  currentCert = (currentCert + 1) % certImages.length;
  document.getElementById('lightbox-img').src = certImages[currentCert];
}

function prevCert() {
  currentCert = (currentCert - 1 + certImages.length) % certImages.length;
  document.getElementById('lightbox-img').src = certImages[currentCert];
}

function scrollCerts(dir) {
  const scroll = document.querySelector('.certs-scroll');
  if (!scroll) return;
  const cardW      = 140 + 16;
  const visible    = Math.floor(scroll.clientWidth / cardW) || 1;
  const step       = visible * cardW;
  const maxScroll  = scroll.scrollWidth - scroll.clientWidth;
  let next = scroll.scrollLeft + dir * step;
  if (next > maxScroll) next = 0;
  if (next < 0) next = maxScroll;
  scroll.scrollTo({ left: next, behavior: 'smooth' });
}

/* ─── OFFICE GALLERY ─── */
const officeImages = [
  'img/office/office1.jpg',
  'img/office/office2.jpg',
  'img/office/office3.jpg',
  'img/office/office4.jpg',
];
let currentOffice = 0;

function openOffice() {
  document.getElementById('cursor').style.zIndex = '999999';
  currentOffice = 0;
  document.getElementById('office-img').src = officeImages[0];
  document.getElementById('office-lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeOffice() {
  document.getElementById('cursor').style.zIndex = '9999';
  document.getElementById('office-lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function nextOffice() {
  currentOffice = (currentOffice + 1) % officeImages.length;
  document.getElementById('office-img').src = officeImages[currentOffice];
}

function prevOffice() {
  currentOffice = (currentOffice - 1 + officeImages.length) % officeImages.length;
  document.getElementById('office-img').src = officeImages[currentOffice];
}

/* ─── KEYBOARD NAVIGATION ─── */
document.addEventListener('keydown', (e) => {
  const certOpen   = document.getElementById('lightbox').style.display === 'flex';
  const officeOpen = document.getElementById('office-lightbox').style.display === 'flex';

  if (e.key === 'Escape') {
    if (certOpen)   closeCert();
    if (officeOpen) closeOffice();
  }
  if (e.key === 'ArrowRight') {
    if (certOpen)   nextCert();
    if (officeOpen) nextOffice();
  }
  if (e.key === 'ArrowLeft') {
    if (certOpen)   prevCert();
    if (officeOpen) prevOffice();
  }
});

/* ─── FORM INPUT SCROLL FIX ─── */
document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach((el) => {
  el.addEventListener('focus', () => document.body.style.overscrollBehaviorX = 'none');
  el.addEventListener('blur',  () => document.body.style.overscrollBehaviorX = 'auto');
});

/* ─── PHONE INPUT MASK ─── */
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('f-contact');
  if (phoneInput) {
    IMask(phoneInput, {
      mask: '+{7} (000) 000-00-00',
    });
  }
});

// Expose functions for inline onclick handlers
window.submitForm = submitForm;
window.openCert = openCert;
window.closeCert = closeCert;
window.nextCert = nextCert;
window.prevCert = prevCert;
window.scrollCerts = scrollCerts;
window.openOffice = openOffice;
window.closeOffice = closeOffice;
window.nextOffice = nextOffice;
window.prevOffice = prevOffice;

