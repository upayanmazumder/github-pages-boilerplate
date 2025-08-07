// Enhanced include.js with modern functionality
class SiteManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadComponents();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupAnimations();
    this.setupThemeToggle();
    this.setupFormHandling();
  }

  // Load header and footer components
  async loadComponents() {
    try {
      await Promise.all([
        this.loadHTML('#header', '/components/header.html'),
        this.loadHTML('#footer', '/components/footer.html')
      ]);
      
      // Setup navigation after components are loaded
      this.setupActiveNavigation();
      this.setupMobileMenu();
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }

  async loadHTML(selector, file) {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      
      const html = await response.text();
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
      });

      // Close menu when clicking on nav links
      nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          menuToggle.classList.remove('active');
          nav.classList.remove('active');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
          menuToggle.classList.remove('active');
          nav.classList.remove('active');
        }
      });
    }
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  // Active navigation highlighting
  setupActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath === '/') ||
          (currentPath.startsWith(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Scroll animations
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .hero, main > h1, main > h2, main > h3');
    animateElements.forEach(el => observer.observe(el));
  }

  // Theme toggle functionality
  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Form handling with validation
  setupFormHandling() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(form);
      });
    });
  }

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showFieldError(field, 'This field is required');
        isValid = false;
      } else {
        this.clearFieldError(field);
      }
    });

    if (!isValid) return;

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
      // Simulate form submission (replace with your actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.showNotification('Message sent successfully!', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
  }

  clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    field.style.borderColor = '';
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
      zIndex: '1000',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Utility functions
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format date
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },

  // Get query parameters
  getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }
};

// Initialize site manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SiteManager();
});

// Export for use in other scripts
window.SiteManager = SiteManager;
window.utils = utils;
