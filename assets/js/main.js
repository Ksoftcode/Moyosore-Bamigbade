// /**
// * Template Name: Dewi - v4.9.1
// * Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
// * Author: BootstrapMade.com
// * License: https://bootstrapmade.com/license/
// */
// (function() {
//   "use strict";

//   /**
//    * Easy selector helper function
//    */
//   const select = (el, all = false) => {
//     el = el.trim()
//     if (all) {
//       return [...document.querySelectorAll(el)]
//     } else {
//       return document.querySelector(el)
//     }
//   }

//   /**
//    * Easy event listener function
//    */
//   const on = (type, el, listener, all = false) => {
//     let selectEl = select(el, all)
//     if (selectEl) {
//       if (all) {
//         selectEl.forEach(e => e.addEventListener(type, listener))
//       } else {
//         selectEl.addEventListener(type, listener)
//       }
//     }
//   }

//   /**
//    * Easy on scroll event listener 
//    */
//   const onscroll = (el, listener) => {
//     el.addEventListener('scroll', listener)
//   }

//   /**
//    * Navbar links active state on scroll
//    */
//   let navbarlinks = select('#navbar .scrollto', true)
//   const navbarlinksActive = () => {
//     let position = window.scrollY + 200
//     navbarlinks.forEach(navbarlink => {
//       if (!navbarlink.hash) return
//       let section = select(navbarlink.hash)
//       if (!section) return
//       if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
//         navbarlink.classList.add('active')
//       } else {
//         navbarlink.classList.remove('active')
//       }
//     })
//   }
//   window.addEventListener('load', navbarlinksActive)
//   onscroll(document, navbarlinksActive)

//   /**
//    * Scrolls to an element with header offset
//    */
//   const scrollto = (el) => {
//     let header = select('#header')
//     let offset = header.offsetHeight

//     if (!header.classList.contains('header-scrolled')) {
//       offset -= 20
//     }

//     let elementPos = select(el).offsetTop
//     window.scrollTo({
//       top: elementPos - offset,
//       behavior: 'smooth'
//     })
//   }

//   /**
//    * Toggle .header-scrolled class to #header when page is scrolled
//    */
//   let selectHeader = select('#header')
//   if (selectHeader) {
//     const headerScrolled = () => {
//       if (window.scrollY > 100) {
//         selectHeader.classList.add('header-scrolled')
//       } else {
//         selectHeader.classList.remove('header-scrolled')
//       }
//     }
//     window.addEventListener('load', headerScrolled)
//     onscroll(document, headerScrolled)
//   }

//   /**
//    * Back to top button
//    */
//   let backtotop = select('.back-to-top')
//   if (backtotop) {
//     const toggleBacktotop = () => {
//       if (window.scrollY > 100) {
//         backtotop.classList.add('active')
//       } else {
//         backtotop.classList.remove('active')
//       }
//     }
//     window.addEventListener('load', toggleBacktotop)
//     onscroll(document, toggleBacktotop)
//   }

//   /**
//    * Mobile nav toggle
//    */
//   on('click', '.mobile-nav-toggle', function(e) {
//     select('#navbar').classList.toggle('navbar-mobile')
//     this.classList.toggle('bi-list')
//     this.classList.toggle('bi-x')
//   })

//   /**
//    * Mobile nav dropdowns activate
//    */
//   on('click', '.navbar .dropdown > a', function(e) {
//     if (select('#navbar').classList.contains('navbar-mobile')) {
//       e.preventDefault()
//       this.nextElementSibling.classList.toggle('dropdown-active')
//     }
//   }, true)

//   /**
//    * Scrool with ofset on links with a class name .scrollto
//    */
//   on('click', '.scrollto', function(e) {
//     if (select(this.hash)) {
//       e.preventDefault()

//       let navbar = select('#navbar')
//       if (navbar.classList.contains('navbar-mobile')) {
//         navbar.classList.remove('navbar-mobile')
//         let navbarToggle = select('.mobile-nav-toggle')
//         navbarToggle.classList.toggle('bi-list')
//         navbarToggle.classList.toggle('bi-x')
//       }
//       scrollto(this.hash)
//     }
//   }, true)

//   /**
//    * Scroll with ofset on page load with hash links in the url
//    */
//   window.addEventListener('load', () => {
//     if (window.location.hash) {
//       if (select(window.location.hash)) {
//         scrollto(window.location.hash)
//       }
//     }
//   });

//   /**
//    * Preloader
//    */
//   let preloader = select('#preloader');
//   if (preloader) {
//     window.addEventListener('load', () => {
//       preloader.remove()
//     });
//   }

//   /**
//    * Initiate glightbox 
//    */
//   const glightbox = GLightbox({
//     selector: '.glightbox'
//   });

//   /**
//    * Testimonials slider
//    */
//   new Swiper('.testimonials-slider', {
//     speed: 600,
//     loop: true,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false
//     },
//     slidesPerView: 'auto',
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       clickable: true
//     }
//   });

//   function getCurrentScroll() {
//     return window.pageYOffset || document.documentElement.scrollTop;
//   }

//   /**
//    * Porfolio isotope and filter
//    */
//   window.addEventListener('load', () => {

//     let portfolioContainer = select('.portfolio-container');

//     if (portfolioContainer) {
//       let portfolioIsotope = new Isotope(portfolioContainer, {
//         itemSelector: '.portfolio-item'
//       });

//       let portfolioFilters = select('#portfolio-flters li', true);

//       on('click', '#portfolio-flters li', function(e) {
//         e.preventDefault();
//         portfolioFilters.forEach(function(el) {
//           el.classList.remove('filter-active');
//         });
//         this.classList.add('filter-active');

//         portfolioIsotope.arrange({
//           filter: this.getAttribute('data-filter')
//         });
//         portfolioIsotope.on('arrangeComplete', function() {
//           AOS.refresh()
//         });

//       }, true);
//     }

//   });

//   /**
//    * Initiate portfolio lightbox 
//    */
//   const portfolioLightbox = GLightbox({
//     selector: '.portfolio-lightbox'
//   });

//   /**
//    * Portfolio details slider
//    */
//   new Swiper('.portfolio-details-slider', {
//     speed: 400,
//     loop: true,
//     autoplay: {
//       delay: 5000,
//       disableOnInteraction: false
//     },
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       clickable: true
//     }
//   });

//   /**
//    * Animation on scroll
//    */
//   window.addEventListener('load', () => {
//     AOS.init({
//       duration: 1000,
//       easing: "ease-in-out",
//       once: true,
//       mirror: false
//     });
//   });

//   /**
//    * Initiate Pure Counter 
//    */
//   new PureCounter();

// })()



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
   * Initiate Pure Counter
   */
  new PureCounter();

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
   * Navmenu Scrollspy
   */
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

})();