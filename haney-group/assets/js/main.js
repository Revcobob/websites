/* The Haney Group — minimal site JS */

(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Section reveal on scroll (subtle)
  const reveal = (entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      }
    });
  };
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(reveal, { rootMargin: '-60px 0px', threshold: 0.05 });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1)';
      io.observe(el);
    });
    // Tiny stylesheet hook
    const style = document.createElement('style');
    style.textContent = '[data-reveal].is-in { opacity: 1 !important; transform: none !important; }';
    document.head.appendChild(style);
  }

  // Contact form — graceful UX (no backend)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const card = form.closest('.form-wrap') || form;
      const ok = document.createElement('div');
      ok.className = 'form__success';
      ok.setAttribute('role', 'status');
      ok.innerHTML = `
        <p class="eyebrow" style="color:#E1B265">Thank you</p>
        <h3 class="h3" style="margin-top:14px">Your inquiry has been received.</h3>
        <p class="body" style="margin-top:14px">Robert and Julie will be in touch within one business day — sooner if your matter is time-sensitive. If you need to reach us in the meantime, please call <a class="text-amber" href="tel:+15129255000">(512) 925-5000</a>.</p>
      `;
      ok.style.background = 'var(--navy-800)';
      ok.style.border = '1px solid var(--rule)';
      ok.style.borderRadius = '14px';
      ok.style.padding = '36px';
      card.replaceChildren(ok);
    });
  }

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
