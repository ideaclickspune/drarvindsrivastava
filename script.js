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
                behavior: 'smooth',    // Smooth animation
                block: 'start'         // Align to top of viewport
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
    // Get the target number from data-target attribute
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;              // Animation duration in milliseconds
    const increment = target / (duration / 16);    // Increment per frame (60fps)
    let current = 0;                    // Start from 0

    // Run animation every 16ms (approximately 60fps)
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            // Animation complete - set final value
            element.textContent = target + '+';
            clearInterval(timer);        // Stop the timer
        } else {
            // Update with current value (rounded down)
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

/**
 * Initialize counter animation when hero section is visible
 * Uses Intersection Observer API to detect when element enters viewport
 */
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Check if hero section is visible
        if (entry.isIntersecting) {
            // Start all counter animations
            document.querySelectorAll('.stat-number').forEach(counter => {
                animateCounter(counter);
            });
            // Stop observing after animation starts (only animate once)
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });    // Trigger when 50% of element is visible

// Start observing the hero section
heroObserver.observe(document.querySelector('.hero'));


/* ============================================
   CAROUSEL FUNCTIONALITY
   ============================================ */

/**
 * Object to store the current position/index of each carousel
 * Example: { 'experience-carousel': { currentIndex: 0 } }
 */
const carouselStates = {};

/**
 * Scroll carousel left or right
 * @param {string} carouselId - The ID of the carousel wrapper element
 * @param {number} direction - Direction to scroll: -1 (left) or 1 (right)
 */
function scrollCarousel(carouselId, direction) {
    // Get carousel elements
    const carousel = document.getElementById(carouselId);
    const container = carousel.parentElement;
    const items = carousel.querySelectorAll('.carousel-item');
    
    // If no items, do nothing
    if (items.length === 0) return;

    // Initialize state for this carousel if it doesn't exist
    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = { currentIndex: 0 };
    }

    const state = carouselStates[carouselId];
    
    // Calculate scroll amount based on item width and gap
    const itemWidth = items[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(carousel).gap) || 32;
    const scrollAmount = itemWidth + gap;

    // Update current index based on direction
    state.currentIndex += direction;

    // Determine how many items are visible based on screen size
    let visibleItems = 3;                    // Desktop: 3 items
    if (window.innerWidth <= 768) {
        visibleItems = 1;                    // Mobile: 1 item
    } else if (window.innerWidth <= 1024) {
        visibleItems = 2;                    // Tablet: 2 items
    }

    // Calculate maximum index (prevents scrolling beyond last item)
    const maxIndex = items.length - visibleItems;
    
    // Loop around: if we go before first, jump to last
    if (state.currentIndex < 0) {
        state.currentIndex = maxIndex;
    } 
    // Loop around: if we go past last, jump to first
    else if (state.currentIndex > maxIndex) {
        state.currentIndex = 0;
    }

    // Apply smooth CSS transform to slide carousel
    const translateX = -(state.currentIndex * scrollAmount);
    carousel.style.transform = `translateX(${translateX}px)`;
}


/* ============================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================ */

/**
 * Highlight the current section in navigation menu
 * Updates on scroll to show which section is currently in view
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

    // Update nav links but exclude logo
    document.querySelectorAll('nav a:not(.logo-link):not(.contact-btn)').forEach(a => {

        a.style.opacity = '0.7';
        if (a.getAttribute('href') === `#${current}`) {
            a.style.opacity = '1';
        }
    });
});


/* ============================================
   CAROUSEL RESPONSIVE ADJUSTMENT
   ============================================ */

/**
 * Reset all carousels when window is resized
 * Prevents layout issues when switching between mobile/desktop
 */
let resizeTimer;
window.addEventListener('resize', () => {
    // Clear previous timer to debounce (wait until resize is complete)
    clearTimeout(resizeTimer);
    
    // Wait 250ms after resize stops, then reset carousels
    resizeTimer = setTimeout(() => {
        // Loop through all carousel states
        Object.keys(carouselStates).forEach(key => {
            // Reset to first item
            carouselStates[key].currentIndex = 0;
            
            // Get the carousel element
            const carousel = document.getElementById(key);
            if (carousel) {
                // Reset transform to show first items
                carousel.style.transform = 'translateX(0)';
            }
        });
    }, 250);
});


document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.stat-number');
  let started = false; // Prevents running multiple times

  // Function to animate numbers
  function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 1500; // total animation time (ms)
    const step = target / (duration / 16); // assuming 60fps

    let count = 0;
    const update = () => {
      count += step;
      if (count < target) {
        counter.textContent = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + "+"; // add "+" at the end
      }
    };
    update();
  }

  // Intersection Observer to detect when stats section is visible
  const statsSection = document.querySelector('.stats-section');
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !started) {
      counters.forEach(counter => animateCounter(counter));
      started = true; // ensures it runs only once
    }
  }, {
    threshold: 0.5 // start when 50% of the section is visible
  });

  observer.observe(statsSection);
});

/* ============================================
  EXPERIENCE CARD ANIMATION
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".exp-card");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.2
  });

  cards.forEach(card => observer.observe(card));
});






