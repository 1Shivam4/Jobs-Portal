import { login, register, logout } from './login';
import { createJob } from './jobPost';

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('registerForm');
const logOutBtn = document.getElementById('logoutBtn');
const jobForm = document.getElementById('jobForm');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('loginName').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Login Data:', { email, password }); // Log to check values

    // Call your login function
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const number = document.getElementById('phoneNumber').value;
    const email = document.getElementById('clientEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    register(name, number, email, password, confirmPassword);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (jobForm) {
  jobForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('jobTitle', document.getElementById('jobTitle').value);

    // Nested employer object
    form.append(
      'employer[companyName]',
      document.getElementById('companyName').value
    );
    form.append(
      'employer[companyEmail]',
      document.getElementById('companyEmail').value
    );
    form.append('requirements', document.getElementById('requirements').value);

    // Add required fields
    form.append('location', document.getElementById('location').value); // Make sure this input exists
    form.append(
      'applicationLink',
      document.getElementById('applicationLink').value
    ); // Make sure this input exists

    form.append('salaryRange', document.getElementById('salaryRange').value);
    form.append(
      'jobDescription',
      document.getElementById('jobDescription').value
    );
    form.append(
      'resoponsibility',
      document.getElementById('resoponsibility').value
    ); // Make sure this input exists
    form.append('openDate', document.getElementById('openDate').value);
    form.append('closeDate', document.getElementById('closeDate').value);
    form.append('companyLogo', document.getElementById('companyLogo').files[0]);

    createJob(form);
  });
}

//////////////////////////////////// SCROLLING STUFF ////////////////////
(function () {
  'use strict';

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
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
  document.querySelectorAll('#navmenu a').forEach((navmenu) => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach((navmenu) => {
    navmenu.addEventListener('click', function (e) {
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
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Password validation for register form
   */
  const registerPassword = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const registerBtn = document.getElementById('registerBtn');
  const passwordMatchError = document.getElementById('passwordMatchError');

  // Function to check if both passwords match and are at least 8 characters long
  function validatePasswords() {
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    // Check if password is at least 8 characters long
    if (password.length >= 8) {
      // Check if both passwords match
      if (password === confirm) {
        passwordMatchError.textContent = ''; // No error message
        registerBtn.disabled = false; // Enable the register button
      } else {
        passwordMatchError.textContent = 'Passwords do not match.';
        registerBtn.disabled = true; // Disable the register button
      }
    } else {
      passwordMatchError.textContent =
        'Password must be at least 8 characters long.';
      registerBtn.disabled = true; // Disable the register button
    }
  }

  // Add event listeners for password and confirm password fields
  if (registerPassword && confirmPassword) {
    registerPassword.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll('.init-swiper').forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector('.swiper-config').innerHTML.trim()
      );

      if (swiperElement.classList.contains('swiper-tab')) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener('load', initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll('.faq-item h3, .faq-item .faq-toggle')
    .forEach((faqItem) => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      },
    });
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector('.isotope-container'),
        {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll('.isotope-filters li')
      .forEach(function (filters) {
        filters.addEventListener(
          'click',
          function () {
            isotopeItem
              .querySelector('.isotope-filters .filter-active')
              .classList.remove('filter-active');
            this.classList.add('filter-active');
            initIsotope.arrange({
              filter: this.getAttribute('data-filter'),
            });
            if (typeof aosInit === 'function') {
              aosInit();
            }
          },
          false
        );
      });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth',
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
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll('.navmenu a.active')
          .forEach((link) => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
})();
