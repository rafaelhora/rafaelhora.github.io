/* =========================================================
   main.js — Rafael Fraga Portfolio
   Vanilla JS: no jQuery dependencies
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. Navbar: scroll state + active link highlighting
   --------------------------------------------------------- */

(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Add frosted-glass style when scrolled
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  // Highlight active nav link based on which section is in view
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('is-active', href === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();

/* ---------------------------------------------------------
   2. Mobile Menu: hamburger toggle
   --------------------------------------------------------- */

(function initMobileMenu() {
  var btn      = document.getElementById('hamburger-btn');
  var nav      = document.getElementById('navbar-nav');
  var navLinks = document.querySelectorAll('.navbar__link');

  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });
})();

/* ---------------------------------------------------------
   3. Scroll Reveal: fade-up animation on scroll
   --------------------------------------------------------- */

(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything if IntersectionObserver is not supported
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();

/* ---------------------------------------------------------
   4. Contact Form: fetch submission with status feedback
   --------------------------------------------------------- */

(function initContactForm() {
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl  = document.getElementById('form-status');

  if (!form || !submitBtn || !statusEl) return;

  var btnText    = submitBtn.querySelector('.btn__text');
  var btnLoading = submitBtn.querySelector('.btn__loading');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Set loading state
    submitBtn.disabled = true;
    if (btnText)    btnText.hidden    = true;
    if (btnLoading) btnLoading.hidden = false;
    statusEl.hidden = true;
    statusEl.className = 'form-status';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          statusEl.textContent = 'Message sent! I will get back to you soon.';
          statusEl.classList.add('success');
        } else {
          throw new Error('server error');
        }
      })
      .catch(function () {
        statusEl.textContent = 'Something went wrong. Please email me directly at f.rafaelhora@gmail.com';
        statusEl.classList.add('error');
      })
      .finally(function () {
        statusEl.hidden = false;
        submitBtn.disabled = false;
        if (btnText)    btnText.hidden    = false;
        if (btnLoading) btnLoading.hidden = true;
      });
  });
})();
