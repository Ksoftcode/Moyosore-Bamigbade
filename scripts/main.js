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
  toggleScrolled(); // run immediately — DOM is parsed, no need to wait for load

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
   * Preloader — white background, brand wordmark + orange spinner + tagline.
   * Also serves as the page transition on navigation.
   */
  (function initPreloader() {
    // Wordmark characters; null = word-space between "MB" and "ARCHITECTS"
    const LETTERS = ['M', 'B', null, 'A', 'R', 'C', 'H', 'I', 'T', 'E', 'C', 'T', 'S'];

    function buildPreloader(el) {
      el.innerHTML = '';

      // Logo above the wordmark
      const logoWrap = document.createElement('div');
      logoWrap.className = 'mb-preloader__logo';
      const logoImg = document.createElement('img');
      logoImg.src = 'images/logo.png';
      logoImg.alt = 'MB Architects';
      logoWrap.append(logoImg);

      const wordmark = document.createElement('div');
      wordmark.className = 'mb-preloader__wordmark';
      LETTERS.forEach(ch => {
        if (!ch) {
          const sp = document.createElement('span');
          sp.className = 'mb-preloader__space';
          wordmark.append(sp); return;
        }
        const span = document.createElement('span');
        span.className = 'mb-preloader__letter';
        span.textContent = ch;
        wordmark.append(span);
      });

      const sub = document.createElement('p');
      sub.className = 'mb-preloader__sub';
      sub.textContent = 'Architecture · Design · Place';

      el.append(logoWrap, sub);
    }

    const el = document.getElementById('preloader');
    if (el) buildPreloader(el);

    // Dismiss the preloader as soon as the DOM is ready, after a short
    // minimum so the logo animation can breathe. It is deliberately NOT
    // gated on images, video, or web-font downloads — text renders with
    // fallback fonts immediately (font-display:swap) and swaps in later.
    // fonts.ready is raced against a hard 700ms cap purely as a nicety, so
    // a slow/blocked font CDN can never hold the curtain over the content.
    const dismiss = () => {
      const loader = document.getElementById('preloader');
      if (!loader) return;
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 550);
    };
    const minShow = new Promise(r => setTimeout(r, 450));
    const fontsOrCap = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => setTimeout(r, 700))
    ]);
    Promise.all([fontsOrCap, minShow]).then(dismiss);
    // Absolute backstop: whatever happens, never keep the curtain past 2.5s.
    setTimeout(dismiss, 2500);

    // Show on navigation (acts as exit transition)
    document.addEventListener('click', e => {
      // Let the browser handle modified / non-primary clicks (open in new tab, etc.)
      if (e.defaultPrevented || e.button !== 0
        || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href
        || href.startsWith('#')
        || href.startsWith('mailto:')
        || href.startsWith('tel:')
        || link.getAttribute('target') === '_blank'
        || link.hasAttribute('download')) return;
      if (!href.includes('.html') && !href.endsWith('/')) return;
      e.preventDefault();
      let loader = document.getElementById('preloader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'preloader';
        buildPreloader(loader);       // build content before inserting into DOM
        document.body.append(loader); // single paint: spinner + wordmark together
      }
      loader.classList.remove('is-hidden');
      setTimeout(() => { window.location.href = href; }, 520);
    });
  })();

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

  toggleScrollTop(); // run immediately
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init.
   * Called immediately — the script runs after the full DOM is parsed
   * (bottom of <body>), so no need to wait for window.load which blocks
   * on images/video and left data-aos elements invisible for 5-10s on mobile.
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  aosInit();

  /**
   * Reveal hardening. data-aos elements start at opacity:0 and only show once
   * AOS triggers them. Two things can leave content stuck hidden:
   *   1. Lazy-loaded images change the document height AFTER AOS computed its
   *      trigger offsets, so positions go stale -> recalc on load/resize.
   *   2. AOS failing to load/run at all -> nothing ever reveals.
   * The failsafe guarantees content is NEVER left invisible.
   */
  const refreshAOS = () => { try { window.AOS && AOS.refreshHard(); } catch (e) {} };
  window.addEventListener('load', refreshAOS);
  window.addEventListener('resize', refreshAOS);
  // Recompute once the webfonts settle (text metrics shift the layout).
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshAOS);
  // Absolute backstop: if anything above failed, force every data-aos visible.
  setTimeout(() => {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => el.classList.add('aos-animate'));
  }, 3000);

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
      // Pause the loop when off-screen (BUG-16)
      const waitVisible = () => new Promise(r => {
        if (el.dataset.mbLoopVisible === '1') { r(); return; }
        const poll = setInterval(() => {
          if (el.dataset.mbLoopVisible === '1') { clearInterval(poll); r(); }
        }, 200);
      });
      // First run: count up to end and stay there a little longer
      el.textContent = '0';
      while (true) {
        await waitVisible();
        await animateCount(el, 0, end, upMs);
        pulse();
        await wait(holdTopMs);
        await waitVisible();
        await animateCount(el, end, 0, downMs);
        await wait(holdBottomMs);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.mbLoopVisible = '1';
          if (!entry.target.dataset.mbLoopStarted) {
            entry.target.dataset.mbLoopStarted = '1';
            runLoop(entry.target);
          }
        } else {
          entry.target.dataset.mbLoopVisible = '0';
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
  // Hash scroll — DOM is parsed at this point, no need for window.load
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(() => {
        let scrollMarginTop = getComputedStyle(hashTarget).scrollMarginTop;
        window.scrollTo({
          top: hashTarget.offsetTop - parseInt(scrollMarginTop),
          behavior: 'smooth'
        });
      }, 100);
    }
  }

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
        card.querySelectorAll('.mb-cf-mat__chip').forEach(c => c.classList.remove('mb-cf-mat__chip--selected'));
        chip.classList.add('mb-cf-mat__chip--selected');
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
        hp: (document.getElementById('mb-cf-hp')?.value || ''), // honeypot
      });

      try {
        const res = await fetch('forms/contact.php', { method: 'POST', body });
        let data = null;
        try { data = await res.json(); } catch { /* non-JSON response */ }

        if (!res.ok) {
          showError(btn, data?.message || `Request failed (${res.status}). Please try again.`);
          return;
        }

        if (data?.status === 'ok') {
          showDone();
        } else {
          showError(btn, data?.message || 'Something went wrong. Please try again.');
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
  navmenuScrollspy(); // run immediately
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Film grain — subtle animated noise overlay (editorial feel).
   */
  (function initFilmGrain() {
    const grain = document.createElement('div');
    grain.id = 'mb-grain';
    document.body.prepend(grain);
  })();

  /**
   * Magnetic CTAs — buttons pull toward cursor when nearby.
   */
  (function initMagneticCTAs() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.cta-btn, .btn-getstarted').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.38;
        const y = (e.clientY - r.top  - r.height / 2) * 0.38;
        btn.style.transform = `translate(${x}px,${y}px)`;
        btn.style.transition = 'transform 0.08s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(.2,.7,.2,1)';
      });
    });
  })();

  /**
   * Ambient cursor glow — large soft orange orb that drifts toward cursor.
   */
  (function initAmbientGlow() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const glow = document.createElement('div');
    glow.id = 'mb-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.append(glow);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let gx = mx, gy = my;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function lerp() {
      gx += (mx - gx) * 0.04;
      gy += (my - gy) * 0.04;
      glow.style.transform = `translate(${gx}px,${gy}px)`;
      requestAnimationFrame(lerp);
    })();
  })();

  /**
   * Text scramble — eyebrow labels glitch through random chars on scroll-in.
   */
  (function initTextScramble() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—';
    function scramble(el) {
      const original = el.textContent;
      const upper    = original.toUpperCase();
      let frame = 0;
      const frames  = upper.length * 2 + 6;
      (function tick() {
        el.textContent = upper.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (frame > i * 2 + 3) return upper[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        if (++frame <= frames) requestAnimationFrame(tick);
        else el.textContent = original;
      })();
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.scrambled) {
          e.target.dataset.scrambled = '1';
          scramble(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[class*="eyebrow"]').forEach(el => obs.observe(el));
  })();

  /**
   * Hero parallax — title layer drifts upward and fades as user scrolls off hero.
   */
  (function initHeroParallax() {
    const container = document.querySelector('.hero-container');
    if (!container) return;
    const hero = document.querySelector('#hero');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroH = hero ? hero.offsetHeight : window.innerHeight;
        if (y <= heroH) {
          const p = y / heroH;
          container.style.transform = `translateY(${y * -0.22}px)`;
          container.style.opacity   = Math.max(0, 1 - p * 1.7).toFixed(3);
        }
        ticking = false;
      });
    }, { passive: true });
  })();

  /**
   * Scroll progress bar — thin accent line at top of page.
   */
  (function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'mb-scroll-progress';
    document.body.prepend(bar);
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /**
   * Custom cursor — dot + lagging ring, desktop/hover only.
   */
  (function initCustomCursor() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot  = document.createElement('div'); dot.id  = 'mb-cursor-dot';  dot.setAttribute('aria-hidden', 'true');
    const ring = document.createElement('div'); ring.id = 'mb-cursor-ring'; ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    let mx = -200, my = -200, rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    });

    (function lerp() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(lerp);
    })();

    const hoverSel = 'a, button, label, [role="button"], .pf-tile, .mb-svc-card, .mb-subs__card, .mb-team-card, .cta-btn, .filter-btn, .swiper-button-next, .swiper-button-prev';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) document.body.classList.add('mb-cursor--hover');
    });
    document.addEventListener('mouseout', e => {
      // Ignore child-to-child moves inside the same hovered element (avoids flicker)
      const from = e.target.closest(hoverSel);
      if (from && !from.contains(e.relatedTarget)) document.body.classList.remove('mb-cursor--hover');
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '';  ring.style.opacity = ''; });
  })();

  /**
   * 3-D card tilt — perspective lean on ALL card types with dynamic shadow.
   */
  (function initCardTilt() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    /**
     * @param {string}  selector   CSS selector for cards
     * @param {number}  maxDeg     Max tilt in degrees
     * @param {string}  [liftY]    Optional CSS translateY to preserve (e.g. team cards)
     */
    function attachTilt(selector, maxDeg, liftY) {
      document.querySelectorAll(selector).forEach(card => {
        const lift = liftY || '0px';
        card.addEventListener('mousemove', e => {
          const r  = card.getBoundingClientRect();
          const nx = ((e.clientX - r.left)  / r.width  - 0.5) * 2; // -1…1
          const ny = ((e.clientY - r.top)   / r.height - 0.5) * 2;
          // Dynamic shadow shifts opposite to tilt direction (gives 3-D lighting feel)
          const sx = (-nx * 16).toFixed(1);
          const sy = (-ny * 16 + 20).toFixed(1);
          card.style.transform  = `perspective(900px) rotateY(${(nx * maxDeg).toFixed(2)}deg) rotateX(${(-ny * maxDeg).toFixed(2)}deg) translateY(${lift}) translateZ(14px)`;
          card.style.boxShadow  = `${sx}px ${sy}px 40px rgba(15,29,39,0.22), 0 4px 12px rgba(15,29,39,0.14)`;
          card.style.transition = 'transform 0.07s linear';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform  = '';
          card.style.boxShadow  = '';
          card.style.transition = 'transform 0.55s cubic-bezier(.2,.7,.2,1), box-shadow 0.55s cubic-bezier(.2,.7,.2,1)';
        });
      });
    }

    attachTilt('.mb-svc-card',    7);
    attachTilt('.mb-subs__card',  7);
    attachTilt('.mb-team-card',   7,  '-6px');
    attachTilt('.pf-tile',        7);
  })();

  /**
   * "View Project" floating label — follows cursor over portfolio tiles.
   */
  (function initViewLabel() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!document.querySelector('.pf-tile, .pf-grid-item')) return;

    const label = document.createElement('div');
    label.id = 'mb-view-label';
    label.textContent = 'View Project →';
    label.setAttribute('aria-hidden', 'true');
    document.body.append(label);

    let lx = -200, ly = -200;
    document.addEventListener('mousemove', e => {
      lx = e.clientX; ly = e.clientY;
      label.style.left = lx + 'px';
      label.style.top  = ly + 'px';
    });

    const tileSel = '.pf-tile, .pf-grid-item';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(tileSel)) label.classList.add('is-visible');
    });
    document.addEventListener('mouseout', e => {
      // Keep the label visible while the pointer stays within the same tile
      const from = e.target.closest(tileSel);
      if (from && !from.contains(e.relatedTarget)) label.classList.remove('is-visible');
    });
  })();

  /**
   * Cinematic showreel band — one merged film (4 clips crossfaded in ffmpeg).
   * Lazy-loads on first scroll-in, plays only while visible, and lights a
   * 4-segment progress bar synced to the four phases of the film.
   */
  (function initShowreel() {
    const section = document.getElementById('showreel');
    if (!section) return;
    const video = section.querySelector('.mb-showreel__video');
    if (!video) return;
    const dots   = section.querySelectorAll('.mb-showreel__progress span');
    const reduce  = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // BUG-17: don't autoplay on metered/cellular connections
    const conn    = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = (conn && conn.saveData) ||
                     (conn && ['slow-2g','2g'].includes(conn.effectiveType));
    let loaded = false;

    function load() {
      if (loaded) return;
      loaded = true;
      video.src = video.dataset.src;
      video.load();
    }

    video.addEventListener('canplay',  () => section.classList.add('is-playing'));
    video.addEventListener('playing',  () => section.classList.add('is-playing'));

    // Phase boundaries = the crossfade midpoints baked into the film (4.5 / 9 / 13.5s)
    const bounds = [4.75, 9.25, 13.75];
    video.addEventListener('timeupdate', () => {
      const t = video.currentTime;
      let i = 0;
      while (i < bounds.length && t >= bounds[i]) i++;
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          load();
          // Show section immediately so the poster is visible while video loads
          section.classList.add('is-playing');
          if (!reduce && !saveData) video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });
    io.observe(section);

    if (reduce || saveData) {   // show first frame / poster, no autoplay
      load();
      section.classList.add('is-playing');
    }
  })();

  /**
   * Hero slide lazy-loader — promotes data-bg to background-image just in time.
   *
   * style.css schedules each .hero-slide's `heroFade` keyframe to start at
   * N * 5s (animation-delay). We preload each slide ~PRELOAD_LEAD_MS before
   * its keyframe begins so the JPEG is decoded and in the HTTP cache before
   * the cross-fade reveals it.
   *
   * Slide 0's image is also the #hero poster (modern.css), so by the time
   * we set its background-image the browser has already cached it.
   *
   * Result: initial network burst drops from 17 hero JPEGs to 1, while the
   * slideshow remains visually identical. After one full 85s cycle every
   * image is cached, so the `infinite` loop does no further network work.
   */
  (function initHeroLazyLoad() {
    const slides = Array.from(document.querySelectorAll('.hero-slide[data-bg]'));
    if (!slides.length) return;

    const SLIDE_INTERVAL_MS = 5000;   // matches style.css animation-delay step
    const PRELOAD_LEAD_MS   = 2000;   // how early to start the fetch

    const applyBg = (slide, src) => {
      slide.style.backgroundImage = `url('${src}')`;
      slide.dataset.bgLoaded = '1';
    };

    const loadSlide = (slide) => {
      if (slide.dataset.bgLoaded) return;
      const src = slide.getAttribute('data-bg');
      if (!src) return;
      // Use Image() so we only paint once the JPEG is decoded — avoids a
      // half-painted background flickering in.
      const img = new Image();
      img.onload  = () => applyBg(slide, src);
      img.onerror = () => applyBg(slide, src); // fallback: let the browser handle it
      img.src = src;
    };

    // Slide 0 is needed immediately (its keyframe starts at t=0).
    loadSlide(slides[0]);

    // Stagger the rest so each one is fetched shortly before it's needed.
    for (let i = 1; i < slides.length; i++) {
      const delay = Math.max(0, i * SLIDE_INTERVAL_MS - PRELOAD_LEAD_MS);
      setTimeout(() => loadSlide(slides[i]), delay);
    }
  })();

  /**
   * Hero slide annotations — cycles location caption + slide counter
   * in sync with the CSS heroFade animation (5 s per slide; total slides derived from DOM).
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