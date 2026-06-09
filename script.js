/* ============================================================
   AMERICANA MAINTENANCE & REPAIRS — script.js
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   STICKY NAV — add .scrolled class after hero
------------------------------------------------------------ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const threshold = window.innerHeight * 0.3;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ------------------------------------------------------------
   MOBILE MENU TOGGLE
------------------------------------------------------------ */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ------------------------------------------------------------
   SCROLL REVEAL — IntersectionObserver
------------------------------------------------------------ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ------------------------------------------------------------
   SMOOTH SCROLL — for anchor links
------------------------------------------------------------ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ------------------------------------------------------------
   CONTACT FORM — simple submit handling
   (Connects to Netlify Forms or Formspree when deployed;
    shows success state immediately for now)
------------------------------------------------------------ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation feedback
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate send (swap for fetch() call to your backend / Formspree)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);
  });
})();

/* ------------------------------------------------------------
   MOBILE CTA — hide while contact section is in view
   (so the floating button doesn't cover the form)
------------------------------------------------------------ */
(function initMobileCta() {
  const cta     = document.querySelector('.mobile-cta');
  const contact = document.getElementById('contact');
  if (!cta || !contact) return;

  const observer = new IntersectionObserver(([entry]) => {
    cta.style.opacity    = entry.isIntersecting ? '0' : '';
    cta.style.pointerEvents = entry.isIntersecting ? 'none' : '';
  }, { threshold: 0.2 });

  observer.observe(contact);
})();

/* ------------------------------------------------------------
   HERO PARALLAX — subtle depth on scroll
------------------------------------------------------------ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroBg.style.transform = `translateY(${offset * 0.3}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ------------------------------------------------------------
   SERVICE CARDS — stagger entrance on viewport entry
   (supplements CSS delay already set; ensures accuracy)
------------------------------------------------------------ */
(function initCardStagger() {
  const grids = document.querySelectorAll('.services-grid, .features-grid, .testimonials-grid');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }, i * 60);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    cards.forEach(card => observer.observe(card));
  });
})();

/* ------------------------------------------------------------
   ACTIVE NAV LINK — highlight current section
------------------------------------------------------------ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const navH     = document.getElementById('navbar')?.offsetHeight ?? 72;

  function update() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 60) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--orange)'
        : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
