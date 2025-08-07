// Enhanced utilities and components
class EnhancedUtilities {
  constructor() {
    this.init();
  }

  init() {
    this.setupModals();
    this.setupAccordions();
    this.setupTabs();
    this.setupTooltips();
    this.setupProgressBars();
    this.setupNewsletterForm();
    this.setupLazyLoading();
    this.setupScrollToTop();
    this.setupCopyToClipboard();
  }

  // Modal functionality
  setupModals() {
    // Create modal HTML if it doesn't exist
    if (!document.querySelector('.modal')) {
      const modalHTML = `
        <div class="modal" id="defaultModal">
          <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
              <h3>Modal Title</h3>
              <p>Modal content goes here.</p>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Modal triggers
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal]')) {
        const modalId = e.target.getAttribute('data-modal');
        this.openModal(modalId);
      }
      
      if (e.target.matches('.modal-close') || e.target.matches('.modal')) {
        this.closeModal();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId) || document.querySelector('.modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Accordion functionality
  setupAccordions() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.accordion-header')) {
        const header = e.target.closest('.accordion-header');
        const item = header.closest('.accordion-item');
        const accordion = item.closest('.accordion');
        
        // Close other items if single-open accordion
        if (accordion.hasAttribute('data-single')) {
          accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
        }
        
        item.classList.toggle('active');
      }
    });
  }

  // Tabs functionality
  setupTabs() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tab-button')) {
        const button = e.target;
        const tabGroup = button.closest('.tabs');
        const targetId = button.getAttribute('data-tab');
        
        // Remove active from all buttons and contents
        tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        tabGroup.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = tabGroup.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  }

  // Tooltip functionality
  setupTooltips() {
    // Tooltips are handled via CSS, but we can add dynamic positioning
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        const tooltip = e.target.querySelector('::after');
        
        // Add logic for tooltip positioning if needed
        if (rect.top < 60) {
          e.target.classList.add('tooltip-bottom');
        }
      });
    });
  }

  // Progress bar animations
  setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const animateProgress = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute('data-progress') || '0';
          progressBar.style.width = targetWidth + '%';
          observer.unobserve(progressBar);
        }
      });
    };

    const observer = new IntersectionObserver(animateProgress, { threshold: 0.1 });
    progressBars.forEach(bar => observer.observe(bar));
  }

  // Newsletter form handling
  setupNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        
        // Add loading state
        button.classList.add('loading');
        button.disabled = true;
        
        try {
          // Simulate API call
          await this.subscribeToNewsletter(email);
          this.showNotification('Successfully subscribed to newsletter!', 'success');
          form.reset();
        } catch (error) {
          this.showNotification('Subscription failed. Please try again.', 'error');
        } finally {
          button.classList.remove('loading');
          button.disabled = false;
        }
      });
    });
  }

  async subscribeToNewsletter(email) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@')) {
          resolve();
        } else {
          reject(new Error('Invalid email'));
        }
      }, 1000);
    });
  }

  // Lazy loading for images
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('loading');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });
  }

  // Scroll to top button
  setupScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    Object.assign(scrollButton.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      display: 'none',
      zIndex: '1000',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollButton.style.display = 'block';
      } else {
        scrollButton.style.display = 'none';
      }
    });

    // Smooth scroll to top
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Copy to clipboard functionality
  setupCopyToClipboard() {
    document.addEventListener('click', async (e) => {
      if (e.target.matches('[data-copy]')) {
        const textToCopy = e.target.getAttribute('data-copy');
        
        try {
          await navigator.clipboard.writeText(textToCopy);
          this.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          this.showNotification('Copied to clipboard!', 'success');
        }
      }
    });
  }

  // Enhanced notification system
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };

    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: this.getNotificationColor(type),
      zIndex: '1001',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      maxWidth: '400px'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove
    const autoRemove = setTimeout(() => {
      this.removeNotification(notification);
    }, duration);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(autoRemove);
      this.removeNotification(notification);
    });
  }

  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }

  removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Utility methods for external use
  static createAccordion(items) {
    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    
    items.forEach(item => {
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';
      accordionItem.innerHTML = `
        <div class="accordion-header">
          <span>${item.title}</span>
          <span class="accordion-toggle">▼</span>
        </div>
        <div class="accordion-content">
          ${item.content}
        </div>
      `;
      accordion.appendChild(accordionItem);
    });
    
    return accordion;
  }

  static createTabs(tabs) {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tabs';
    
    const tabNav = document.createElement('div');
    tabNav.className = 'tab-nav';
    
    const tabContents = document.createElement('div');
    
    tabs.forEach((tab, index) => {
      // Create tab button
      const button = document.createElement('button');
      button.className = `tab-button ${index === 0 ? 'active' : ''}`;
      button.setAttribute('data-tab', tab.id);
      button.textContent = tab.title;
      tabNav.appendChild(button);
      
      // Create tab content
      const content = document.createElement('div');
      content.className = `tab-content ${index === 0 ? 'active' : ''}`;
      content.id = tab.id;
      content.innerHTML = tab.content;
      tabContents.appendChild(content);
    });
    
    tabContainer.appendChild(tabNav);
    tabContainer.appendChild(tabContents);
    
    return tabContainer;
  }
}

// Initialize enhanced utilities
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedUtilities = new EnhancedUtilities();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedUtilities;
}
