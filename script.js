/* ============================================
   MOBILE HAMBURGER MENU FUNCTIONS
   ============================================ */

/**
 * Toggle the mobile navigation menu open/closed
 * Adds/removes 'active' class to show/hide menu
 */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle 'active' class on menu (shows/hides dropdown)
    menu.classList.toggle('active');
    
    // Toggle 'active' class on hamburger (animates icon to X)
    hamburger.classList.toggle('active');
}

/**
 * Close the mobile navigation menu
 * Called when user clicks on a menu link
 */
function closeMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    // Remove 'active' class to close menu
    menu.classList.remove('active');
    
    // Reset hamburger icon to normal
    hamburger.classList.remove('active');
}


/* ============================================
   DROPDOWN MENU FUNCTIONALITY (Mobile)
   ============================================ */

/**
 * Handle dropdown toggle on mobile devices
 */
document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.querySelector('.dropdown .dropbtn');
    const dropdown = document.querySelector('.dropdown');
    
    if (dropdownBtn && window.innerWidth <= 768) {
        dropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    }
});


/* ============================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================ */

/**
 * Add smooth scroll behavior to all navigation links
 * When clicking on #about, #contact, etc., page scrolls smoothly
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Prevent default jump behavior
        e.preventDefault();
        
        // Get the target section from href attribute
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Smooth scroll to the target section
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


/* ============================================
   ANIMATED COUNTER FOR STATISTICS
   ============================================ */

/**
 * Animate a counter from 0 to target number
 * @param {HTMLElement} element - The stat number element to animate
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

/**
 * Initialize counter animation when stats section is visible
 */
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function animateCounterNew(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const step = target / (duration / 16);

        let count = 0;
        const update = () => {
            count += step;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target + "+";
            }
        };
        update();
    }

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !started) {
                counters.forEach(counter => animateCounterNew(counter));
                started = true;
            }
        }, {
            threshold: 0.5
        });

        observer.observe(statsSection);
    }
});


/* ============================================
   CAROUSEL FUNCTIONALITY
   ============================================ */

/**
 * Object to store the current position/index of each carousel
 */
const carouselStates = {};

/**
 * Scroll carousel left or right
 * @param {string} carouselId - The ID of the carousel wrapper element
 * @param {number} direction - Direction to scroll: -1 (left) or 1 (right)
 */
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const container = carousel.parentElement;
    const items = carousel.querySelectorAll('.carousel-item');
    
    if (items.length === 0) return;

    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = { currentIndex: 0 };
    }

    const state = carouselStates[carouselId];
    
    const itemWidth = items[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(carousel).gap) || 32;
    const scrollAmount = itemWidth + gap;

    state.currentIndex += direction;

    let visibleItems = 3;
    if (window.innerWidth <= 768) {
        visibleItems = 1;
    } else if (window.innerWidth <= 1024) {
        visibleItems = 2;
    }

    const maxIndex = items.length - visibleItems;
    
    if (state.currentIndex < 0) {
        state.currentIndex = maxIndex;
    } else if (state.currentIndex > maxIndex) {
        state.currentIndex = 0;
    }

    const translateX = -(state.currentIndex * scrollAmount);
    carousel.style.transform = `translateX(${translateX}px)`;
}


/* ============================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================ */

/**
 * Highlight the current section in navigation menu
 */
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav ul a:not(.logo-link)').forEach(a => {
        if (a.getAttribute('href') && a.getAttribute('href').startsWith('#')) {
            a.style.opacity = '0.7';
            if (a.getAttribute('href') === `#${current}`) {
                a.style.opacity = '1';
            }
        }
    });
});


/* ============================================
   CAROUSEL RESPONSIVE ADJUSTMENT
   ============================================ */

/**
 * Reset all carousels when window is resized
 */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        Object.keys(carouselStates).forEach(key => {
            carouselStates[key].currentIndex = 0;
            
            const carousel = document.getElementById(key);
            if (carousel) {
                carousel.style.transform = 'translateX(0)';
            }
        });
    }, 250);
});


/* ============================================
   PAGE SPECIFIC ANIMATIONS
   ============================================ */

/**
 * Fade in elements on scroll (for detail pages)
 */
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".exp-card, .expertise-card, .education-card");

    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        cards.forEach(card => observer.observe(card));
    }
});

// Generic carousel function (works for testimonials or any carousel)
function scrollCarousel(id, direction) {
  const carousel = document.getElementById(id);
  const items = carousel.querySelectorAll('.carousel-item');
  const itemWidth = carousel.offsetWidth;
  const currentTransform = getComputedStyle(carousel).transform;

  // Extract current translateX
  let currentX = currentTransform !== 'none' ? parseFloat(currentTransform.split(',')[4]) : 0;
  
  // Move one slide left or right
  let newX = currentX - direction * itemWidth;

  // Limit so it doesn’t scroll beyond
  const maxTranslate = -(itemWidth * (items.length - 1));
  if (newX < maxTranslate) newX = 0;
  if (newX > 0) newX = maxTranslate;

  carousel.style.transform = `translateX(${newX}px)`;
}

/* Looping carousel with pointer/touch drag support */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('testimonials-carousel');
  if (!carousel) return;

  // Prevent double init
  if (carousel.dataset.loopInit === '1') return;
  carousel.dataset.loopInit = '1';

  // Grab original items
  const originalItems = Array.from(carousel.querySelectorAll('.carousel-item'));
  const origCount = originalItems.length;
  if (origCount === 0) return;

  // Clone first and last
  const firstClone = originalItems[0].cloneNode(true);
  const lastClone = originalItems[origCount - 1].cloneNode(true);
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, carousel.firstChild);

  const slides = carousel.querySelectorAll('.carousel-item'); // now includes clones
  const totalSlides = slides.length;

  // state
  let currentIndex = 1; // start at first real slide (after prepended clone)
  let isTransitioning = false;

  // helper: width of one slide (use bounding rect of a slide)
  function getSlideWidth() {
    const firstItem = carousel.querySelector('.carousel-item');
    return firstItem ? Math.round(firstItem.getBoundingClientRect().width) : carousel.clientWidth;
  }

  // set initial translate (no animation)
  function setInitialPosition() {
    const w = getSlideWidth();
    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(-${w * currentIndex}px)`;
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    carousel.offsetHeight;
    carousel.style.transition = 'transform 0.5s ease';
  }
  setInitialPosition();

  // core move function used by arrows and after drag
  function moveToIndex(index, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    const w = getSlideWidth();
    if (!animate) carousel.style.transition = 'none';
    else carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(-${w * index}px)`;

    const onEnd = () => {
      carousel.removeEventListener('transitionend', onEnd);

      // jump if on clones
      if (index === 0) {
        // moved to prepended clone -> jump to real last
        carousel.style.transition = 'none';
        currentIndex = totalSlides - 2;
        carousel.style.transform = `translateX(-${w * currentIndex}px)`;
        // force reflow then reenable
        // eslint-disable-next-line no-unused-expressions
        carousel.offsetHeight;
        carousel.style.transition = 'transform 0.5s ease';
      } else if (index === totalSlides - 1) {
        // moved to appended clone -> jump to real first
        carousel.style.transition = 'none';
        currentIndex = 1;
        carousel.style.transform = `translateX(-${w * currentIndex}px)`;
        // eslint-disable-next-line no-unused-expressions
        carousel.offsetHeight;
        carousel.style.transition = 'transform 0.5s ease';
      } else {
        currentIndex = index;
      }

      isTransitioning = false;
    };

    carousel.addEventListener('transitionend', onEnd, { once: true });
  }

  // exposed function (keeps compatibility with your buttons)
  window.scrollCarousel = function(id, direction) {
    // direction = -1 or +1
    if (isTransitioning) return;
    moveToIndex(currentIndex + direction);
  };

  // handle window resize (recalculate slide width)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // reposition without animation so the same slide stays visible
      const w = getSlideWidth();
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(-${w * currentIndex}px)`;
      setTimeout(() => {
        carousel.style.transition = 'transform 0.5s ease';
      }, 50);
    }, 120);
  });

  // -------------------------
  // Pointer / Touch drag support
  // -------------------------
  let dragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  const threshold = 50; // px required to consider as swipe

  // Pointer events are preferred
  function onPointerDown(e) {
    if (isTransitioning) return;
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    // get current translate value
    const style = window.getComputedStyle(carousel);
    const matrix = new WebKitCSSMatrix(style.transform);
    prevTranslate = matrix.m41 || 0;
    // disable transition while dragging
    carousel.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const delta = x - startX;
    const w = getSlideWidth();
    currentTranslate = prevTranslate + delta;
    // limit dragging a bit beyond bounds so it feels natural
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    const x = (e.changedTouches ? e.changedTouches[0].clientX : (e.clientX || startX));
    const delta = x - startX;
    const w = getSlideWidth();

    // snap logic
    if (Math.abs(delta) > threshold) {
      if (delta < 0) {
        // dragged left -> next
        moveToIndex(currentIndex + 1, true);
      } else {
        // dragged right -> prev
        moveToIndex(currentIndex - 1, true);
      }
    } else {
      // not enough movement -> snap back to currentIndex
      moveToIndex(currentIndex, true);
    }
  }

  // Add pointer/touch event listeners (support both)
  // Use capture false and passive false where necessary so touchend works reliably on mobile
  carousel.addEventListener('pointerdown', (e) => {
    // ensure only left button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    carousel.setPointerCapture && carousel.setPointerCapture(e.pointerId);
    onPointerDown(e);
  });

  carousel.addEventListener('pointermove', (e) => onPointerMove(e));
  carousel.addEventListener('pointerup', (e) => {
    carousel.releasePointerCapture && carousel.releasePointerCapture(e.pointerId);
    onPointerUp(e);
  });
  carousel.addEventListener('pointercancel', (e) => {
    carousel.releasePointerCapture && carousel.releasePointerCapture(e.pointerId);
    onPointerUp(e);
  });

  // Fallback for older mobile browsers: touch events
  carousel.addEventListener('touchstart', (e) => onPointerDown(e), { passive: true });
  carousel.addEventListener('touchmove', (e) => onPointerMove(e), { passive: true });
  carousel.addEventListener('touchend', (e) => onPointerUp(e), { passive: true });

  // Prevent accidental image dragging
  carousel.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
});

// ==========
// Preloader CSS
//  ==========
 window.addEventListener("load", function () {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 1000); // stays visible for 2.5 seconds
});


// ========================
// HERO SLIDER
// ========================
let currentHero = 0;
const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.querySelector(".hero-dots");

// Create dots dynamically
slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("hero-dot");
    if (i === 0) dot.classList.add("active");
    dot.onclick = () => showHeroSlide(i);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".hero-dot");

function showHeroSlide(index) {
    slides[currentHero].classList.remove("active");
    dots[currentHero].classList.remove("active");

    currentHero = index;

    slides[currentHero].classList.add("active");
    dots[currentHero].classList.add("active");
}

document.querySelector(".hero-next").onclick = () => {
    let next = currentHero + 1;
    if (next >= slides.length) next = 0;
    showHeroSlide(next);
};

document.querySelector(".hero-prev").onclick = () => {
    let prev = currentHero - 1;
    if (prev < 0) prev = slides.length - 1;
    showHeroSlide(prev);
};

// Hero Slider JS 

