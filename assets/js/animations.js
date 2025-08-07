// Animation utilities and effects
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupTypewriter();
    this.setupCounters();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation || 'fade-in-up';
          entry.target.classList.add(animationType);
          
          // If it's a counter, start counting
          if (entry.target.classList.contains('counter')) {
            this.animateCounter(entry.target);
          }
        }
      });
    }, observerOptions);

    // Auto-detect elements to animate
    const elementsToAnimate = document.querySelectorAll(`
      .card, .hero, h1, h2, h3, 
      [data-animation], .animate-on-scroll
    `);
    
    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', this.debounce(handleScroll, 10));
  }

  setupTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(el => {
      const text = el.textContent;
      const speed = parseInt(el.dataset.speed) || 100;
      
      el.textContent = '';
      el.style.borderRight = '2px solid var(--primary-color)';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            el.style.borderRight = 'none';
          }, 1000);
        }
      };
      
      // Start typewriter when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(typeWriter, 500);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(el);
    });
  }

  setupCounters() {
    // Counters are handled in the scroll animation observer
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target) || parseInt(element.textContent) || 100;
    const duration = parseInt(element.dataset.duration) || 2000;
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    element.textContent = '0';
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  }

  // Utility: Create staggered animations
  staggerElements(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * delay}ms`;
    });
  }

  // Utility: Add floating animation
  addFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.animation = 'float 3s ease-in-out infinite';
    });
  }

  // Utility: Add pulse animation
  addPulseAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.animation = 'pulse 2s infinite';
    });
  }

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
  }
}

// Add CSS animations via JavaScript
const animationStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-left {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-in-right {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }

  .fade-in-left {
    animation: fade-in-left 0.6s ease-out forwards;
  }

  .fade-in-right {
    animation: fade-in-right 0.6s ease-out forwards;
  }

  .scale-in {
    animation: scale-in 0.6s ease-out forwards;
  }

  .typewriter {
    overflow: hidden;
    white-space: nowrap;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
  window.animationManager = new AnimationManager();
});
