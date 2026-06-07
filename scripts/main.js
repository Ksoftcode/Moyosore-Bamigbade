/**
* Template Name: Dewi
* Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter (for any .purecounter NOT inside the looping stats grid)
   */
  new PureCounter();

  /**
   * Looping stats counter — count up → hold → count down → hold → repeat.
   * Replaces PureCounter behaviour for any [data-mb-loop-counter] element.
   * Starts when the element scrolls into view (IntersectionObserver).
   */
  (function initLoopingStatsCounters() {
    const counters = document.querySelectorAll('[data-mb-loop-counter]');
    if (!counters.length) return;

    const animateCount = (el, from, to, duration) => {
      return new Promise(resolve => {
        const start = performance.now();
        const delta = to - from;
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(from + delta * eased).toString();
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const runLoop = async (el) => {
      const end = parseInt(el.getAttribute('data-mb-loop-counter'), 10) || 0;
      const upMs = parseInt(el.getAttribute('data-mb-loop-up') || '1600', 10);
      const downMs = parseInt(el.getAttribute('data-mb-loop-down') || '1400', 10);
      const holdTopMs = parseInt(el.getAttribute('data-mb-loop-hold-top') || '4000', 10);
      const holdBottomMs = parseInt(el.getAttribute('data-mb-loop-hold-bottom') || '1500', 10);
      // initial pause so counters don't all start in unison
      const stagger = parseInt(el.getAttribute('data-mb-loop-stagger') || '0', 10);
      await wait(stagger);
      // Find the sibling icon (in the same .mb-stats__item) so we can pulse it at the peak
      const item = el.closest('.mb-stats__item');
      const icon = item ? item.querySelector('.mb-stats__icon') : null;
      const pulse = () => {
        if (!icon) return;
        icon.classList.remove('is-peak');
        // Force reflow so the animation can restart
        void icon.offsetWidth;
        icon.classList.add('is-peak');
      };
      // First run: count up to end and stay there a little longer
      el.textContent = '0';
      while (true) {
        await animateCount(el, 0, end, upMs);
        pulse();
        await wait(holdTopMs);
        await animateCount(el, end, 0, downMs);
        await wait(holdBottomMs);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.mbLoopStarted) {
          entry.target.dataset.mbLoopStarted = '1';
          runLoop(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  })();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Multi-step contact form — step navigation + AJAX submission
   * Gathers data across all steps and POSTs to forms/contact.php on final step.
   */
  (function initContactForm() {
    const card = document.querySelector('.mb-cf-mat__card');
    if (!card) return;

    // Step state
    let currentStep = 1;
    const totalSteps = 4;

    // Chip selection
    let selectedType = '';
    card.querySelectorAll('.mb-cf-mat__chip').forEach(chip => {
      chip.addEventListener('click', () => {
        card.querySelectorAll('.mb-cf-mat__chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        selectedType = chip.dataset.value || chip.textContent.trim();
        // Auto-advance after a short pause so the selection is visible
        setTimeout(() => goToStep(4), 320);
      });
    });

    function goToStep(step) {
      const current = card.querySelector(`.mb-cf-mat__step[data-step="${currentStep}"]`);
      const next    = card.querySelector(`.mb-cf-mat__step[data-step="${step}"]`);
      if (!next) return;

      if (current) current.classList.remove('mb-cf-mat__step--active');
      next.classList.add('mb-cf-mat__step--active');
      currentStep = step;

      // Update progress dots
      card.querySelectorAll('.mb-cf-mat__dot').forEach(dot => {
        const n = parseInt(dot.dataset.dot, 10);
        dot.classList.toggle('mb-cf-mat__dot--active', n <= step && step <= totalSteps);
      });

      // Focus first input in new step
      const firstInput = next.querySelector('input, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 80);
    }

    function showDone() {
      card.querySelectorAll('.mb-cf-mat__step').forEach(s => s.classList.remove('mb-cf-mat__step--active'));
      card.querySelectorAll('.mb-cf-mat__dot').forEach(d => d.classList.add('mb-cf-mat__dot--active'));
      const done = card.querySelector('.mb-cf-mat__done');
      if (done) done.classList.add('mb-cf-mat__step--active');
    }

    function showError(btn, msg) {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="bi bi-send"></i>';
      let err = card.querySelector('.mb-cf-mat__error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'mb-cf-mat__error';
        btn.parentNode.insertBefore(err, btn.nextSibling);
      }
      err.textContent = msg;
    }

    async function submitForm(btn) {
      const name    = (document.getElementById('mat-name')?.value    || '').trim();
      const email   = (document.getElementById('mat-email')?.value   || '').trim();
      const phone   = (document.getElementById('mat-phone')?.value   || '').trim();
      const message = (document.getElementById('mat-message')?.value || '').trim();

      if (!name || !email || !message) {
        showError(btn, 'Please complete all required fields before submitting.');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = 'Sending… <i class="bi bi-hourglass-split"></i>';

      const body = new URLSearchParams({
        name,
        email,
        phone,
        project_type: selectedType,
        message,
        hp: '',          // honeypot — always empty for real users
      });

      try {
        const res  = await fetch('forms/contact.php', { method: 'POST', body });
        const data = await res.json();
        if (data.status === 'ok') {
          showDone();
        } else {
          showError(btn, data.message || 'Something went wrong. Please try again.');
        }
      } catch {
        showError(btn, 'Network error. Please check your connection and try again.');
      }
    }

    // Button click handler
    card.addEventListener('click', e => {
      const btn = e.target.closest('.mb-cf-mat__btn');
      if (!btn) return;
      e.preventDefault();

      const next = btn.dataset.next;
      if (!next) return;

      if (next === 'done') {
        submitForm(btn);
        return;
      }

      // Validate required field in current step before advancing
      const step = card.querySelector(`.mb-cf-mat__step[data-step="${currentStep}"]`);
      const required = step ? step.querySelectorAll('[required]') : [];
      for (const field of required) {
        if (!field.value.trim()) {
          field.focus();
          field.classList.add('is-invalid');
          field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
          return;
        }
      }

      goToStep(parseInt(next, 10));
    });

    // Allow Enter key to advance in text inputs
    card.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const input = e.target;
      if (input.tagName === 'TEXTAREA') return; // allow newlines in message
      e.preventDefault();
      const activeStep = card.querySelector('.mb-cf-mat__step--active');
      const btn = activeStep?.querySelector('.mb-cf-mat__btn');
      if (btn) btn.click();
    });
  })();
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Hero slide annotations — cycles location caption + slide counter
   * in sync with the CSS heroFade animation (5 s per slide, 7 slides, 35 s loop).
   */
  (function initHeroAnnotations() {
    const slides  = Array.from(document.querySelectorAll('.hero-slide'));
    const locEl   = document.querySelector('.hero-loc');
    const numEl   = document.querySelector('.hero-slide-num');
    if (!slides.length || (!locEl && !numEl)) return;

    const total = slides.length;
    let idx = 0;

    const padded = (n) => String(n).padStart(2, '0');

    function setContent(i) {
      const caption = slides[i].dataset.caption || '';
      if (locEl) locEl.textContent = caption;
      if (numEl) numEl.textContent  = `${padded(i + 1)} / ${padded(total)}`;
    }

    function tick() {
      // fade out
      if (locEl) locEl.classList.add('is-fading');
      if (numEl) numEl.classList.add('is-fading');
      setTimeout(() => {
        idx = (idx + 1) % total;
        setContent(idx);
        if (locEl) locEl.classList.remove('is-fading');
        if (numEl) numEl.classList.remove('is-fading');
      }, 380);
    }

    // First frame — no fade
    setContent(0);
    idx = 0;
    // Sync to CSS: first slide appears at t=0, next at t=5000ms
    setInterval(tick, 5000);
  })();

})();