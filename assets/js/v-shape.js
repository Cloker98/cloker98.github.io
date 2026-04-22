/**
 * V-Shape Plan Navigation and Interactions
 */
(function() {
  'use strict';

  // Constants
  const SELECTORS = {
    navButtons: '.nav-btn',
    sections: '.section',
    nav: '.nav'
  };

  const CLASSES = {
    active: 'active',
    hidden: 'hidden'
  };

  const ATTRIBUTES = {
    section: 'data-section',
    ariaSelected: 'aria-selected',
    hidden: 'hidden'
  };

  // State
  let navButtons = [];
  let sections = [];
  let navElement = null;

  /**
   * Initialize the application
   */
  function init() {
    try {
      cacheElements();
      bindEvents();
      setActiveSection('alimentacao');
      
      // Add keyboard navigation support
      addKeyboardSupport();
      
      // Add intersection observer for scroll-based navigation
      addScrollNavigation();
      
    } catch (error) {
      console.error('Error initializing V-Shape app:', error);
    }
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    navButtons = Array.from(document.querySelectorAll(SELECTORS.navButtons));
    sections = Array.from(document.querySelectorAll(SELECTORS.sections));
    navElement = document.querySelector(SELECTORS.nav);

    if (navButtons.length === 0) {
      throw new Error('No navigation buttons found');
    }

    if (sections.length === 0) {
      throw new Error('No sections found');
    }
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    navButtons.forEach(function(button) {
      button.addEventListener('click', handleNavClick);
    });

    // Add resize listener for responsive adjustments
    window.addEventListener('resize', debounce(handleResize, 250));
  }

  /**
   * Handle navigation button clicks
   * @param {Event} event - Click event
   */
  function handleNavClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const sectionId = button.getAttribute(ATTRIBUTES.section);

    if (!sectionId) {
      console.warn('Navigation button missing data-section attribute');
      return;
    }

    setActiveSection(sectionId);
    scrollToNav();
    
    // Announce to screen readers
    announceNavigation(sectionId);
  }

  /**
   * Set the active section
   * @param {string} sectionId - ID of the section to activate
   */
  function setActiveSection(sectionId) {
    if (!sectionId) {
      console.warn('setActiveSection called without sectionId');
      return;
    }

    // Update sections
    sections.forEach(function(section) {
      const isActive = section.id === sectionId;
      
      if (isActive) {
        section.removeAttribute(ATTRIBUTES.hidden);
      } else {
        section.setAttribute(ATTRIBUTES.hidden, '');
      }
    });

    // Update navigation buttons
    navButtons.forEach(function(button) {
      const isActive = button.getAttribute(ATTRIBUTES.section) === sectionId;
      
      button.classList.toggle(CLASSES.active, isActive);
      button.setAttribute(ATTRIBUTES.ariaSelected, String(isActive));
    });
  }

  /**
   * Scroll to navigation with smooth behavior
   */
  function scrollToNav() {
    if (!navElement) return;

    const top = navElement.offsetTop - 10;
    
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  }

  /**
   * Add keyboard navigation support
   */
  function addKeyboardSupport() {
    navButtons.forEach(function(button, index) {
      button.addEventListener('keydown', function(event) {
        let targetIndex = -1;

        switch (event.key) {
          case 'ArrowLeft':
            targetIndex = index > 0 ? index - 1 : navButtons.length - 1;
            break;
          case 'ArrowRight':
            targetIndex = index < navButtons.length - 1 ? index + 1 : 0;
            break;
          case 'Home':
            targetIndex = 0;
            break;
          case 'End':
            targetIndex = navButtons.length - 1;
            break;
          default:
            return;
        }

        if (targetIndex >= 0) {
          event.preventDefault();
          navButtons[targetIndex].focus();
        }
      });
    });
  }

  /**
   * Add scroll-based navigation using Intersection Observer
   */
  function addScrollNavigation() {
    if (!('IntersectionObserver' in window)) {
      return; // Fallback for older browsers
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          updateActiveNavButton(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(function(section) {
      observer.observe(section);
    });
  }

  /**
   * Update active navigation button based on scroll position
   * @param {string} sectionId - ID of the visible section
   */
  function updateActiveNavButton(sectionId) {
    navButtons.forEach(function(button) {
      const isActive = button.getAttribute(ATTRIBUTES.section) === sectionId;
      button.classList.toggle(CLASSES.active, isActive);
      button.setAttribute(ATTRIBUTES.ariaSelected, String(isActive));
    });
  }

  /**
   * Handle window resize events
   */
  function handleResize() {
    // Recalculate any position-dependent elements if needed
    // Currently no specific resize handling needed
  }

  /**
   * Announce navigation change to screen readers
   * @param {string} sectionId - ID of the active section
   */
  function announceNavigation(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const title = section.querySelector('.section-title');
    if (title) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Navegando para seção: ${title.textContent}`;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(function() {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const later = function() {
        clearTimeout(timeout);
        func.apply(this, arguments);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Polyfill for older browsers
   */
  function addPolyfills() {
    // Array.from polyfill
    if (!Array.from) {
      Array.from = function(arrayLike) {
        return Array.prototype.slice.call(arrayLike);
      };
    }

    // Element.matches polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                  Element.prototype.webkitMatchesSelector;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      addPolyfills();
      init();
    });
  } else {
    addPolyfills();
    init();
  }

  // Expose public API for testing or external use
  window.VShapeApp = {
    setActiveSection: setActiveSection,
    init: init
  };

})();