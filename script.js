/* ══════════════════════════════════════════════
   FELIX PETROLEUM — ADVANCED SCRIPT
══════════════════════════════════════════════ */

'use strict';

/* ─── PRELOADER ─────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => preloader.classList.add('done'), 1800);
});

/* ─── YEAR ───────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── TOPBAR HIDE ON SCROLL ──────────────────── */
const topbar  = document.getElementById('topbar');
const header  = document.getElementById('site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  // Sticky header
  if (current > 80) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }

  // Hide topbar when scrolling down, show when scrolling up
  if (current > 300) {
    if (current > lastScroll) {
      topbar?.classList.add('hidden');
      header?.classList.add('topbar-hidden');
    } else {
      topbar?.classList.remove('hidden');
      header?.classList.remove('topbar-hidden');
    }
  } else {
    topbar?.classList.remove('hidden');
    header?.classList.remove('topbar-hidden');
  }

  lastScroll = current <= 0 ? 0 : current;

  // Back to top button
  bttBtn?.classList.toggle('visible', current > 600);
}, { passive: true });

/* ─── MOBILE NAV ─────────────────────────────── */
const menuBtn  = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuBtn?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('#nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      e.target !== menuBtn) {
    navLinks.classList.remove('open');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ─── BACK TO TOP ────────────────────────────── */
const bttBtn = document.getElementById('back-to-top');
bttBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── REVEAL ON SCROLL ───────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

/* ─── PROCESS CARDS LINE ANIMATION ──────────── */
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate');
      }, i * 120);
      processObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.process-card').forEach(el => {
  processObserver.observe(el);
});

/* ─── COUNT-UP ANIMATION ─────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const suffix = el.innerHTML.replace(/[0-9]/g, '').replace(target.toString(), '').trim();
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + (suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => {
  countObserver.observe(el);
});

/* ─── ACTIVE NAV LINK ON SCROLL ──────────────── */
const sections = document.querySelectorAll('section[id], main[id]');
const navItems = document.querySelectorAll('.nav-item');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.classList.toggle(
          'active',
          a.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── GALLERY LIGHTBOX ───────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('[data-lightbox]').forEach(figure => {
  figure.addEventListener('click', () => {
    const img = figure.querySelector('img');
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox?.setAttribute('hidden', '');
  document.body.style.overflow = '';
  if (lightboxImg) lightboxImg.src = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ─── CONTACT FORM → WHATSAPP + EMAIL ───────── */
function handleSubmit(event) {
  event.preventDefault();
  const form    = event.currentTarget;
  const note    = document.getElementById('form-note');
  const btn     = form.querySelector('.btn');
  const btnText = form.querySelector('.btn-text');

  // Basic client-side validation
  const name    = (form.name?.value || '').trim();
  const company = (form.company?.value || '').trim();
  const email   = (form.email?.value || '').trim();
  const phone   = (form.phone?.value || '').trim();
  const message = (form.message?.value || '').trim();

  if (!name || !email || !message) {
    note.style.color = '#f87171';
    note.textContent = 'Please fill in all required fields.';
    return false;
  }

  // Disable button while processing
  if (btn) { btn.disabled = true; btn.style.opacity = '.7'; }
  if (btnText) btnText.textContent = 'Sending…';

  // Build WhatsApp message
  const waText = [
    '🔶 *New Enquiry — Felix Petroleum Website*',
    '',
    `👤 *Name:* ${name}`,
    company ? `🏢 *Company:* ${company}` : '',
    `📧 *Email:* ${email}`,
    phone    ? `📞 *Phone:* ${phone}` : '',
    '',
    `📝 *Message:*\n${message}`,
  ].filter(Boolean).join('\n');

  // Open WhatsApp with primary number
  const waUrl = 'https://wa.me/2349033758973?text=' + encodeURIComponent(waText);
  const a = Object.assign(document.createElement('a'), {
    href:   waUrl,
    target: '_blank',
    rel:    'noopener noreferrer',
  });
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Also build mailto link as fallback
  const mailSubject = `Enquiry from ${name}${company ? ' — ' + company : ''}`;
  const mailBody    = `Name: ${name}\nCompany: ${company || 'N/A'}\nPhone: ${phone || 'N/A'}\n\n${message}`;
  const mailUrl     = `mailto:Wanoghofelix@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  setTimeout(() => {
    const m = Object.assign(document.createElement('a'), { href: mailUrl });
    document.body.appendChild(m);
    m.click();
    m.remove();
  }, 400);

  // Success feedback
  note.style.color = '';
  note.textContent = '✓ WhatsApp is opening — press Send to deliver your enquiry. An email draft is also being prepared.';
  form.reset();

  // Re-enable button
  setTimeout(() => {
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
    if (btnText) btnText.textContent = 'Send Enquiry';
    note.textContent = '';
  }, 6000);

  return false;
}

/* expose to HTML */
window.handleSubmit = handleSubmit;

/* ─── SMOOTH ANCHOR SCROLL ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = (header?.offsetHeight || 76) + (topbar?.classList.contains('hidden') ? 0 : 36);
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
