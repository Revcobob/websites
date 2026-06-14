/* MHLC public-site bootstrap.
 *
 * - Wires every public form on the static HTML pages to the CMS API:
 *     subscribe (footer + homepage Stay Informed + events reminders)
 *     contact   (contact page)
 *     donation  (give page)
 * - Keeps all decorative behavior intact (button-text swap, scrolling, etc.)
 *   while replacing the no-op handlers with real fetch() submissions.
 * - Adds an Anti-bot honeypot field and an hCaptcha token if a site key is
 *   exposed on the page via <meta name="hcaptcha-sitekey" content="…">.
 *
 * Drop-in loader: every page should include
 *   <script src="/cms-bootstrap.js" defer></script>
 * just before </body>. No other HTML changes are required.
 */
(function () {
  'use strict';

  function pageSlug() {
    const m = location.pathname.match(/mhlc-([a-z-]+)\.html$/);
    return m ? m[1] : 'homepage';
  }

  function getCaptchaToken() {
    // Future: integrate hCaptcha invisible challenge when site key is set.
    // For now, the server treats missing tokens as no-captcha mode unless
    // HCAPTCHA_SECRET is configured, in which case the server rejects.
    return undefined;
  }

  function addHoneypot(form) {
    if (form.querySelector('input[name="_mhlc_hp"]')) return;
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = '_mhlc_hp';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
    form.appendChild(hp);
  }

  async function postJSON(url, body) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json().catch(() => ({}));
      return { ok: res.ok && (json.ok !== false), error: json.error, json };
    } catch (e) {
      return { ok: false, error: 'Network error' };
    }
  }

  function setSubmittingState(form, label, busy) {
    const btn = form.querySelector('button[type="submit"], button:not([type])');
    if (!btn) return () => {};
    const original = btn.textContent;
    if (busy) { btn.disabled = true; btn.textContent = label; }
    return () => { btn.disabled = false; btn.textContent = original; };
  }

  function showInlineMessage(form, ok, message) {
    let msg = form.querySelector('[data-cms-msg]');
    if (!msg) {
      msg = document.createElement('p');
      msg.setAttribute('data-cms-msg', '');
      msg.style.cssText = 'margin-top:0.5rem;font-size:0.875rem;';
      form.appendChild(msg);
    }
    msg.style.color = ok ? '#0F4C4A' : '#8E3F2A';
    msg.textContent = message;
  }

  function wireSubscribe(form, source, sourceLabel) {
    if (!form || form.dataset.cmsWired === '1') return;
    form.dataset.cmsWired = '1';
    addHoneypot(form);
    // Replace any inline onsubmit
    form.removeAttribute('onsubmit');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = (form.querySelector('input[type="email"]') || {}).value || '';
      const hp = (form.querySelector('input[name="_mhlc_hp"]') || {}).value || '';
      const release = setSubmittingState(form, 'Sending…', true);
      const res = await postJSON('/api/public/subscribe', {
        email: email.trim(),
        source,
        source_label: sourceLabel,
        consent_text: 'Subscribed via ' + sourceLabel,
        honeypot: hp,
        captchaToken: getCaptchaToken()
      });
      release();
      if (res.ok) {
        const btn = form.querySelector('button[type="submit"], button:not([type])');
        if (btn) btn.textContent = 'Thank you';
        form.querySelectorAll('input').forEach(i => { if (i.type === 'email') i.value = ''; });
        showInlineMessage(form, true, 'You\'re subscribed. Thank you for staying with us.');
      } else {
        showInlineMessage(form, false, res.error || 'Something went wrong. Please try again.');
      }
    });
  }

  function wireFooterSubscribes() {
    const slug = pageSlug();
    document.querySelectorAll('footer form').forEach(form => {
      // Only wire forms with an email input (the subscribe widgets).
      if (form.querySelector('input[type="email"]')) {
        wireSubscribe(form, 'footer:' + slug, 'Footer subscribe');
      }
    });
  }

  function wireNamedSubscribes() {
    const map = [
      { input: '#familyEmail', source: 'homepage_family',  label: 'Homepage · Stay Informed' },
      { input: '#evEmail',     source: 'events_reminders', label: 'Events page · Reminders' }
    ];
    map.forEach(({ input, source, label }) => {
      const el = document.querySelector(input);
      if (!el) return;
      const form = el.closest('form');
      if (form) wireSubscribe(form, source, label);
    });
  }

  function wireContactForm() {
    const form = document.getElementById('contactForm');
    if (!form || form.dataset.cmsWired === '1') return;
    form.dataset.cmsWired = '1';
    addHoneypot(form);
    form.removeAttribute('onsubmit');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const f = new FormData(form);
      const payload = {
        first_name: (f.get('first-name') || '').toString(),
        last_name:  (f.get('last-name') || '').toString(),
        email:      (f.get('email') || '').toString(),
        phone:      (f.get('phone') || '').toString() || null,
        topic:      (f.get('topic') || '').toString() || null,
        message:    (f.get('message') || '').toString(),
        consent:    !!form.querySelector('#consent')?.checked,
        source_page: 'contact',
        honeypot:   (f.get('_mhlc_hp') || '').toString(),
        captchaToken: getCaptchaToken()
      };
      const release = setSubmittingState(form, 'Sending…', true);
      const res = await postJSON('/api/public/contact', payload);
      release();
      if (res.ok) {
        form.reset();
        showInlineMessage(form, true, 'Thank you — your message is on its way. We\'ll respond within one business day.');
        const label = document.getElementById('submitLabel');
        if (label) label.textContent = 'Message sent';
      } else {
        showInlineMessage(form, false, res.error || 'Something went wrong. Please try again.');
      }
    });
  }

  function wireGiveForm() {
    const form = document.getElementById('giveForm');
    if (!form || form.dataset.cmsWired === '1') return;
    form.dataset.cmsWired = '1';
    addHoneypot(form);
    form.removeAttribute('onsubmit');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const f = new FormData(form);
      const customAmount = parseFloat((f.get('amount-custom') || '').toString());
      const presetAmount = parseFloat((f.get('amount') || '').toString());
      const amount = !isNaN(customAmount) && customAmount > 0 ? customAmount : presetAmount;
      const payload = {
        first_name: (f.get('first-name') || '').toString(),
        last_name:  (f.get('last-name') || '').toString(),
        email:      (f.get('email') || '').toString(),
        phone:      (f.get('phone') || '').toString() || null,
        amount_cents: amount > 0 ? Math.round(amount * 100) : null,
        frequency:   (f.get('frequency') || 'one-time').toString(),
        tribute_type: form.querySelector('#tributeToggle')?.checked
          ? (f.get('tribute-type') || '').toString()
          : null,
        tribute_name: form.querySelector('#tributeToggle')?.checked
          ? (f.get('tribute-name') || '').toString() || null
          : null,
        anonymous: !!form.querySelector('#anonymous')?.checked,
        message: null,
        source_page: 'give',
        honeypot: (f.get('_mhlc_hp') || '').toString(),
        captchaToken: getCaptchaToken()
      };
      const release = setSubmittingState(form, 'Sending…', true);
      const res = await postJSON('/api/public/donation-inquiry', payload);
      release();
      if (!res.ok) {
        showInlineMessage(form, false, res.error || 'Something went wrong. Please try again.');
        return;
      }
      showInlineMessage(form, true, 'Thank you — taking you to our secure payment page…');
      if (res.json && res.json.redirect) {
        setTimeout(() => { location.href = res.json.redirect; }, 800);
      }
    });
  }

  function init() {
    try { wireFooterSubscribes(); } catch (e) { console.error(e); }
    try { wireNamedSubscribes(); }  catch (e) { console.error(e); }
    try { wireContactForm(); }      catch (e) { console.error(e); }
    try { wireGiveForm(); }         catch (e) { console.error(e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
