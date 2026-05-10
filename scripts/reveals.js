/* MB Architects — scroll-triggered reveal animations
 * Adds .in-view to elements when they enter the viewport.
 * Targets: .section-title (drafting-line underline) and .reveal-clip (image clip-path).
 * Auto-detects elements added dynamically after page load (e.g. project.html gallery).
 */
(function () {
  'use strict';

  // Fallback: no IntersectionObserver -> reveal everything immediately
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section-title, .reveal-clip').forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  const observeAll = (root) => {
    (root || document).querySelectorAll('.section-title, .reveal-clip').forEach(el => {
      if (!el.classList.contains('in-view') && !el.dataset.mbObserved) {
        el.dataset.mbObserved = '1';
        io.observe(el);
      }
    });
  };

  // Initial scan
  observeAll();

  // Re-scan when new nodes are inserted (covers dynamic gallery render in project.html)
  if ('MutationObserver' in window) {
    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) observeAll(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Public API: allow manual trigger after AJAX-style content swap
  window.MB_observeReveals = observeAll;
})();
