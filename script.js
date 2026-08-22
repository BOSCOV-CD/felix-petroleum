'use strict';
/* ══════════════════════════════════════════════
   FELIX PETROLEUM — ADVANCED SCRIPT v3
══════════════════════════════════════════════ */

/* ─── HELPERS ────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── YEAR ───────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── PRELOADER ──────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader')?.classList.add('done'), 1800);
});

/* ─── NEWS TICKER CLOSE ──────────────────────── */
const tickerBar = document.getElementById('news-ticker-bar');
document.getElementById('ntb-close')?.addEventListener('click', () => {
  tickerBar?.classList.add('hidden');
  recalcOffsets();
});

/* ─── TOPBAR / HEADER SCROLL MANAGEMENT ─────── */
const topbar  = document.getElementById('topbar');
const header  = document.getElementById('site-header');
const bttBtn  = document.getElementById('back-to-top');
let lastY     = 0;
let tickerH   = 32;

function recalcOffsets() {
  tickerH = tickerBar?.classList.contains('hidden') ? 0 : 32;
  if (!header?.classList.contains('compact')) {
    header.style.top = (tickerH + (topbar?.offsetHeight || 34)) + 'px';
  }
}
recalcOffsets();

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Sticky header
  if (y > 80) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }

  // Compact (hide topbar + ticker when scrolling down)
  if (y > 400) {
    if (y > lastY) {
      header?.classList.add('compact');
      if (header) header.style.top = '0';
    } else {
      header?.classList.remove('compact');
      recalcOffsets();
    }
  } else {
    header?.classList.remove('compact');
    recalcOffsets();
  }

  lastY = y <= 0 ? 0 : y;

  // Back to top
  bttBtn?.classList.toggle('visible', y > 600);
}, { passive: true });

/* ─── BACK TO TOP ────────────────────────────── */
bttBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── MOBILE NAV ─────────────────────────────── */
const menuBtn  = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

$$('#nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks?.classList.remove('open');
  menuBtn?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && e.target !== menuBtn) {
    navLinks.classList.remove('open');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ─── HERO WALLPAPER SLIDESHOW ───────────────── */
const slides      = $$('.hero-slide');
const dots        = $$('.slide-dot');
const heroQuotes  = $$('.hero-quote');
let   slideIndex  = 0;
let   slideTimer  = null;

// Lazy-load background images on slides
slides.forEach(slide => {
  const bg = slide.dataset.bg;
  if (bg) slide.style.backgroundImage = `url('${bg}')`;
});

function goToSlide(n) {
  slides[slideIndex]?.classList.remove('active');
  dots[slideIndex]?.classList.remove('active');
  heroQuotes[slideIndex]?.classList.remove('active');

  slideIndex = (n + slides.length) % slides.length;

  slides[slideIndex]?.classList.add('active');
  dots[slideIndex]?.classList.add('active');
  heroQuotes[slideIndex]?.classList.add('active');
}

function nextSlide() { goToSlide(slideIndex + 1); }
function prevSlide() { goToSlide(slideIndex - 1); }

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 6000);
}

document.getElementById('slide-next')?.addEventListener('click', () => { nextSlide(); startSlideTimer(); });
document.getElementById('slide-prev')?.addEventListener('click', () => { prevSlide(); startSlideTimer(); });
dots.forEach(dot => dot.addEventListener('click', () => { goToSlide(+dot.dataset.slide); startSlideTimer(); }));

startSlideTimer();

// Pause on hover
document.getElementById('hero')?.addEventListener('mouseenter', () => clearInterval(slideTimer));
document.getElementById('hero')?.addEventListener('mouseleave', startSlideTimer);

// Touch swipe support
let touchStartX = 0;
document.getElementById('hero')?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
document.getElementById('hero')?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) { dx > 0 ? prevSlide() : nextSlide(); startSlideTimer(); }
}, { passive: true });

/* ─── QUOTES CAROUSEL ────────────────────────── */
const quoteSlides  = $$('.quote-slide');
const qDots        = $$('.q-dot');
let   qIndex       = 0;
let   quoteTimer   = null;

function goToQuote(n) {
  quoteSlides[qIndex]?.classList.remove('active');
  qDots[qIndex]?.classList.remove('active');
  qIndex = (n + quoteSlides.length) % quoteSlides.length;
  quoteSlides[qIndex]?.classList.add('active');
  qDots[qIndex]?.classList.add('active');
}

function startQuoteTimer() {
  clearInterval(quoteTimer);
  quoteTimer = setInterval(() => goToQuote(qIndex + 1), 5000);
}

document.getElementById('q-next')?.addEventListener('click', () => { goToQuote(qIndex + 1); startQuoteTimer(); });
document.getElementById('q-prev')?.addEventListener('click', () => { goToQuote(qIndex - 1); startQuoteTimer(); });
qDots.forEach(dot => dot.addEventListener('click', () => { goToQuote(+dot.dataset.q); startQuoteTimer(); }));

startQuoteTimer();

// Touch swipe on quotes
let qTouchX = 0;
document.getElementById('quotes-carousel')?.addEventListener('touchstart', e => { qTouchX = e.changedTouches[0].screenX; }, { passive: true });
document.getElementById('quotes-carousel')?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - qTouchX;
  if (Math.abs(dx) > 40) { dx > 0 ? goToQuote(qIndex - 1) : goToQuote(qIndex + 1); startQuoteTimer(); }
}, { passive: true });

/* ─── REVEAL ON SCROLL ───────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
$$('[data-reveal]').forEach(el => revealObs.observe(el));

/* ─── PROCESS CARD LINES ─────────────────────── */
const procObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in-view'), i * 130); procObs.unobserve(e.target); }
  });
}, { threshold: 0.3 });
$$('.process-card').forEach(el => procObs.observe(el));

/* ─── COUNT-UP ────────────────────────────────── */
function animateCount(el) {
  const raw = el.dataset.target;
  const target = parseInt(raw, 10);
  if (isNaN(target)) return;
  // Preserve suffix characters after the number in innerHTML
  const suffix = el.innerHTML.replace(/[\d,]/g, '').replace(raw, '').trim();
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target) + (suffix || '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); } });
}, { threshold: 0.5 });
$$('.count-up').forEach(el => countObs.observe(el));

/* ─── ACTIVE NAV ─────────────────────────────── */
const sections = $$('section[id], main[id]');
const navItems = $$('.nav-item');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => secObs.observe(s));

/* ─── LIGHTBOX ────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');
let galleryImgs     = [];
let lbIndex         = 0;

function openLightbox(imgs, idx) {
  galleryImgs = imgs;
  lbIndex     = idx;
  lightboxImg.src = imgs[idx].src;
  lightboxImg.alt = imgs[idx].alt;
  lightbox?.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox?.setAttribute('hidden', '');
  document.body.style.overflow = '';
  if (lightboxImg) lightboxImg.src = '';
}
function lbGo(dir) {
  lbIndex = (lbIndex + dir + galleryImgs.length) % galleryImgs.length;
  lightboxImg.src = galleryImgs[lbIndex].src;
  lightboxImg.alt = galleryImgs[lbIndex].alt;
}

const galleryFigures = $$('[data-lightbox]');
const galleryImgEls  = galleryFigures.map(f => f.querySelector('img'));
galleryFigures.forEach((fig, i) => {
  fig.addEventListener('click', () => openLightbox(galleryImgEls, i));
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', e => { e.stopPropagation(); lbGo(-1); });
lightboxNext?.addEventListener('click', e => { e.stopPropagation(); lbGo(1); });
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox?.hasAttribute('hidden')) {
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    lbGo(-1);
    if (e.key === 'ArrowRight')   lbGo(1);
  }
});

/* ─── SMOOTH SCROLL ──────────────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const tgt = document.querySelector(a.getAttribute('href'));
    if (!tgt) return;
    e.preventDefault();
    const hh = (header?.offsetHeight || 72) + 8;
    window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
  });
});

/* ─── AI CHAT ─────────────────────────────────── */
const aiToggle  = document.getElementById('ai-chat-toggle');
const aiBox     = document.getElementById('ai-chat-box');
const aiClose   = document.getElementById('ai-close');
const aiMsgs    = document.getElementById('ai-messages');
const aiInput   = document.getElementById('ai-input');
const aiSend    = document.getElementById('ai-send');
const quickBtns = document.getElementById('ai-quick-btns');

const AI_KNOWLEDGE = {
  "products": "Felix Petroleum supplies:\n• **Automotive Gas Oil (Diesel / AGO)**\n• **Premium Motor Spirit (Petrol / PMS)**\n• **Kerosene (DPK)**\n• **Liquefied Petroleum Gas (LPG)**\n\nAll products are quality-assured and available for commercial and industrial buyers.",
  "order":    "To place an order:\n1. Call **0903 375 8973** or **0707 044 5570**\n2. WhatsApp us at **+234 903 375 8973**\n3. Email **Wanoghofelix@gmail.com**\n4. Or fill the enquiry form on this page\n\nWe'll get back to you within hours!",
  "delivery": "Felix Petroleum is based in **Rivers State, Nigeria** and serves customers across the **Niger Delta** and nationally. We have logistics and haulage capacity to reach all 36 states of Nigeria.",
  "contact":  "📞 **0903 375 8973**\n📞 **0707 044 5570**\n✉ **Wanoghofelix@gmail.com**\n📍 **Rivers State, Nigeria**\n\nYou can also message us on WhatsApp — click the green button on this page.",
  "price":    "For pricing, please contact us directly — we offer **competitive bulk rates** and tailor pricing to order volumes. Call **0903 375 8973** or send a WhatsApp message for a quick quote.",
  "about":    "Felix Petroleum is an emerging oil and gas trading and distribution company founded by **Felix Wanogho** and based in Rivers State, Nigeria. Our motto is **'Catering to Your Energy Needs'** — we deliver reliable, quality petroleum products with a focus on long-term partnerships.",
  "logistics":"Yes! Felix Petroleum provides **logistics and haulage services** including last-mile delivery and bulk fuel transport across the Niger Delta and beyond.",
  "lpg":      "Yes, we supply **Liquefied Petroleum Gas (LPG)** for both commercial and domestic customers. Contact us for availability and pricing in your area.",
  "diesel":   "We supply **Automotive Gas Oil (AGO/Diesel)** in bulk for industrial, commercial and generator use. Call **0903 375 8973** for current availability and pricing.",
  "default":  "Thanks for your question! For specific enquiries, please contact us directly:\n📞 **0903 375 8973**\n✉ **Wanoghofelix@gmail.com**\n\nOr I can help you with:\n• Our products\n• How to place an order\n• Delivery areas\n• Contact information"
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('product') || m.includes('supply') || m.includes('sell') || m.includes('offer'))
    return AI_KNOWLEDGE.products;
  if (m.includes('order') || m.includes('buy') || m.includes('purchase') || m.includes('how'))
    return AI_KNOWLEDGE.order;
  if (m.includes('deliver') || m.includes('location') || m.includes('area') || m.includes('state') || m.includes('where'))
    return AI_KNOWLEDGE.delivery;
  if (m.includes('contact') || m.includes('phone') || m.includes('number') || m.includes('email') || m.includes('reach'))
    return AI_KNOWLEDGE.contact;
  if (m.includes('price') || m.includes('cost') || m.includes('rate') || m.includes('cheap') || m.includes('expensive'))
    return AI_KNOWLEDGE.price;
  if (m.includes('about') || m.includes('who') || m.includes('company') || m.includes('felix') || m.includes('history'))
    return AI_KNOWLEDGE.about;
  if (m.includes('logistic') || m.includes('haul') || m.includes('transport') || m.includes('truck'))
    return AI_KNOWLEDGE.logistics;
  if (m.includes('lpg') || m.includes('gas') || m.includes('cooking'))
    return AI_KNOWLEDGE.lpg;
  if (m.includes('diesel') || m.includes('ago') || m.includes('generator'))
    return AI_KNOWLEDGE.diesel;
  if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('good'))
    return "Hello! 👋 Welcome to Felix Petroleum. How can I help you today? I can answer questions about our products, pricing, delivery areas, or how to place an order.";
  if (m.includes('thank'))
    return "You're welcome! 😊 Don't hesitate to reach out if you need anything else. Felix Petroleum — Catering to Your Energy Needs!";
  return AI_KNOWLEDGE.default;
}

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `ai-msg ${who}`;
  // Simple markdown bold
  div.innerHTML = `<p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`;
  aiMsgs?.appendChild(div);
  aiMsgs?.scrollTo({ top: aiMsgs.scrollHeight, behavior: 'smooth' });
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'ai-typing';
  div.id = 'ai-typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  aiMsgs?.appendChild(div);
  aiMsgs?.scrollTo({ top: aiMsgs.scrollHeight, behavior: 'smooth' });
}
function removeTyping() { document.getElementById('ai-typing-indicator')?.remove(); }

function sendMessage(msg) {
  if (!msg.trim()) return;
  if (quickBtns) quickBtns.style.display = 'none';
  addMsg(msg, 'user');
  if (aiInput) aiInput.value = '';
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMsg(getAIResponse(msg), 'bot');
  }, 800 + Math.random() * 600);
}

aiSend?.addEventListener('click', () => sendMessage(aiInput?.value || ''));
aiInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(aiInput.value); });

$$('.ai-quick').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q || btn.textContent));
});

aiToggle?.addEventListener('click', () => {
  const hidden = aiBox?.hasAttribute('hidden');
  if (hidden) {
    aiBox?.removeAttribute('hidden');
    aiToggle.setAttribute('aria-expanded', 'true');
    aiInput?.focus();
  } else {
    aiBox?.setAttribute('hidden', '');
    aiToggle.setAttribute('aria-expanded', 'false');
  }
});
aiClose?.addEventListener('click', () => {
  aiBox?.setAttribute('hidden', '');
  aiToggle?.setAttribute('aria-expanded', 'false');
});
document.addEventListener('click', e => {
  const widget = document.getElementById('ai-chat');
  if (widget && !widget.contains(e.target) && !aiBox?.hasAttribute('hidden')) {
    aiBox?.setAttribute('hidden', '');
    aiToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ─── CONTACT FORM ────────────────────────────── */
function handleSubmit(event) {
  event.preventDefault();
  const form    = event.currentTarget;
  const note    = document.getElementById('form-note');
  const btnText = form.querySelector('.btn-text');
  const btn     = form.querySelector('.btn');

  const name    = (form.name?.value    || '').trim();
  const company = (form.company?.value || '').trim();
  const email   = (form.email?.value   || '').trim();
  const phone   = (form.phone?.value   || '').trim();
  const message = (form.message?.value || '').trim();

  if (!name || !email || !message) {
    note.style.color = '#f87171';
    note.textContent = 'Please fill in all required fields.';
    return false;
  }

  if (btn) { btn.disabled = true; btn.style.opacity = '.7'; }
  if (btnText) btnText.textContent = 'Sending…';

  const waText = [
    '🔶 *New Enquiry — Felix Petroleum Website*',
    '',
    `👤 *Name:* ${name}`,
    company ? `🏢 *Company:* ${company}` : null,
    `📧 *Email:* ${email}`,
    phone    ? `📞 *Phone:* ${phone}`   : null,
    '',
    `📝 *Message:*\n${message}`,
  ].filter(Boolean).join('\n');

  const waUrl = `https://wa.me/2349033758973?text=${encodeURIComponent(waText)}`;
  const waLink = Object.assign(document.createElement('a'), { href: waUrl, target: '_blank', rel: 'noopener noreferrer' });
  document.body.appendChild(waLink); waLink.click(); waLink.remove();

  setTimeout(() => {
    const mailSubject = `Enquiry from ${name}${company ? ' — ' + company : ''}`;
    const mailBody    = `Name: ${name}\nCompany: ${company || 'N/A'}\nPhone: ${phone || 'N/A'}\n\n${message}`;
    const mailLink    = Object.assign(document.createElement('a'), {
      href: `mailto:Wanoghofelix@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
    });
    document.body.appendChild(mailLink); mailLink.click(); mailLink.remove();
  }, 400);

  note.style.color = '';
  note.textContent = '✓ WhatsApp is opening — press Send to deliver your enquiry. An email draft is also ready.';
  form.reset();

  setTimeout(() => {
    if (btn)     { btn.disabled = false; btn.style.opacity = ''; }
    if (btnText) btnText.textContent = 'Send Enquiry';
    note.textContent = '';
  }, 7000);

  return false;
}
window.handleSubmit = handleSubmit;

/* ══════════════════════════════════════════════
   FELIX BRANDING INJECTIONS — v4
   Truck matte-black overlay + helmet logo swap
══════════════════════════════════════════════ */

(function brandingInjections() {
  /* Dragon SVG string reused in overlays */
  const dragonSVG = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4 C14 4 9 9 9 15 C9 21 13 25 18 27 L18 31 C18 32 19 33 20 33 C21 33 22 32 22 31 L22 27 C27 25 31 21 31 15 C31 9 26 4 20 4Z" fill="#0A1A2F"/>
    <path d="M20 4 C14 4 9 9 9 15 C9 21 13 25 18 27 L18 31 C18 32 19 33 20 33 C21 33 22 32 22 31 L22 27 C27 25 31 21 31 15 C31 9 26 4 20 4Z" stroke="#FFC107" stroke-width="1" fill="none" opacity="0.7"/>
    <circle cx="17" cy="14" r="1.8" fill="#FFC107"/>
    <circle cx="23" cy="14" r="1.8" fill="#FFC107"/>
    <path d="M10 10 L6 7 L9 11" stroke="#FFC107" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M30 10 L34 7 L31 11" stroke="#FFC107" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  /* 1. Add FELIX brand overlay to all truck images */
  const truckKeywords = ['truck-black', 'truck-fleet', 'truck', 'fleet', 'tanker'];
  document.querySelectorAll('img').forEach(img => {
    const src = (img.getAttribute('src') || '').toLowerCase();
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    const isTruck = truckKeywords.some(k => src.includes(k) || alt.includes(k));
    if (!isTruck) return;

    /* Wrap in position:relative container if not already */
    const parent = img.parentElement;
    if (!parent) return;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    /* Inject overlay badge */
    if (!parent.querySelector('.truck-logo-overlay')) {
      const badge = document.createElement('div');
      badge.className = 'truck-logo-overlay';
      badge.style.display = 'flex';
      badge.innerHTML = dragonSVG + `<span>FELIX</span>`;
      parent.appendChild(badge);
    }
  });

  /* 2. Wrap the helmet/office image and inject FELIX badge */
  document.querySelectorAll('img').forEach(img => {
    const src = (img.getAttribute('src') || '').toLowerCase();
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    const isHelmet = src.includes('felix-pic-2') ||
                     alt.includes('helmet') ||
                     alt.includes('office') ||
                     alt.includes('command') ||
                     alt.includes('operations hub');
    if (!isHelmet) return;

    /* Wrap if not already wrapped */
    if (!img.parentElement.classList.contains('helmet-img-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'helmet-img-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    }

    const wrap = img.parentElement;
    if (!wrap.querySelector('.helmet-logo-badge')) {
      const badge = document.createElement('div');
      badge.className = 'helmet-logo-badge';
      badge.innerHTML = dragonSVG + `<span>FELIX</span>`;
      wrap.appendChild(badge);
    }
  });
})();

/* ══════════════════════════════════════════════
   FELIX v5 — GALLERY SLIDESHOW + HISTORY MODALS
   + AI CHAT X FIX
══════════════════════════════════════════════ */

/* ─── GALLERY SLIDESHOW ──────────────────────── */
(function initGallerySlider() {
  const slides   = document.querySelectorAll('.gslide');
  const dots     = document.querySelectorAll('.gsdot');
  const prevBtn  = document.getElementById('gslider-prev');
  const nextBtn  = document.getElementById('gslider-next');
  const bar      = document.getElementById('gslider-bar');
  const DURATION = 4000; // 4 seconds
  let current    = 0;
  let timer      = null;
  let barTimer   = null;

  if (!slides.length) return;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    resetBar();
  }

  function resetBar() {
    if (!bar) return;
    clearTimeout(barTimer);
    bar.style.transition = 'none';
    bar.style.width = '0%';
    // Force reflow
    bar.offsetWidth; // eslint-disable-line
    bar.style.transition = `width ${DURATION}ms linear`;
    bar.style.width = '100%';
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DURATION);
    resetBar();
  }

  function stopTimer() {
    clearInterval(timer);
    if (bar) { bar.style.transition = 'none'; }
  }

  prevBtn && prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current - 1);
    startTimer();
  });
  nextBtn && nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current + 1);
    startTimer();
  });
  dots.forEach(dot => dot.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(parseInt(dot.dataset.gs, 10));
    startTimer();
  }));

  // Pause on hover
  const slider = document.getElementById('gslider');
  slider && slider.addEventListener('mouseenter', stopTimer);
  slider && slider.addEventListener('mouseleave', startTimer);

  // Touch swipe
  let tx = 0;
  slider && slider.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
  slider && slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - tx;
    if (Math.abs(dx) > 40) { goTo(current + (dx > 0 ? -1 : 1)); startTimer(); }
  }, { passive: true });

  startTimer();
})();

/* ─── UNIVERSAL HISTORY MODAL ────────────────── */
(function initHistoryModals() {
  const overlay  = document.getElementById('hmodal-overlay');
  const closeBtn = document.getElementById('hmodal-close');
  const imgWrap  = document.getElementById('hmodal-img-wrap');
  const img      = document.getElementById('hmodal-img');
  const titleEl  = document.getElementById('hmodal-title');
  const bodyEl   = document.getElementById('hmodal-body');
  const tagEl    = document.getElementById('hmodal-tag');

  if (!overlay) return;

  function openModal(el) {
    const title   = el.dataset.title   || '';
    const history = el.dataset.history || '';
    const imgSrc  = el.dataset.img     || (el.querySelector('img') ? el.querySelector('img').src : '');
    const tag     = el.dataset.tag     || el.querySelector('.gslide-tag, .ntb-label, .news-tag, .card-num')?.textContent || 'Felix Petroleum';

    titleEl.innerHTML = title;
    bodyEl.innerHTML  = history;
    tagEl.textContent = tag;

    if (imgSrc) {
      img.src = imgSrc;
      img.alt = title;
      imgWrap.classList.remove('no-img');
    } else {
      imgWrap.classList.add('no-img');
    }

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Bind all [data-modal] elements
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', function(e) {
      // Don't open if they clicked a child link/button
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
      openModal(el);
    });
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(el);
      }
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });
})();

/* ─── AI CHAT X BUTTON — DEFINITIVE FIX ─────── */
(function fixAIChatClose() {
  // Run after DOM is ready — use multiple selectors as fallback
  function bindClose() {
    const closeBtn = document.getElementById('ai-close');
    const box      = document.getElementById('ai-chat-box');
    const toggle   = document.getElementById('ai-chat-toggle');

    if (!closeBtn || !box) return;

    // Remove any old listeners by cloning
    const newClose = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newClose, closeBtn);

    newClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      box.setAttribute('hidden', '');
      toggle && toggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindClose);
  } else {
    bindClose();
    // Also try after a short delay in case other scripts re-render
    setTimeout(bindClose, 500);
  }
})();
