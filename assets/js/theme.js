// Theme management system
class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        '--primary-color': '#2563eb',
        '--secondary-color': '#64748b',
        '--accent-color': '#f59e0b',
        '--background-color': '#ffffff',
        '--surface-color': '#f8fafc',
        '--text-primary': '#1e293b',
        '--text-secondary': '#64748b',
        '--border-color': '#e2e8f0'
      },
      dark: {
        '--primary-color': '#3b82f6',
        '--secondary-color': '#94a3b8',
        '--accent-color': '#fbbf24',
        '--background-color': '#0f172a',
        '--surface-color': '#1e293b',
        '--text-primary': '#f1f5f9',
        '--text-secondary': '#cbd5e1',
        '--border-color': '#334155'
      }
    };
    
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.setupThemeToggle();
    this.detectSystemTheme();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme && this.themes[savedTheme]) {
      this.applyTheme(savedTheme);
    } else {
      this.detectSystemTheme();
    }
  }

  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.applyTheme('dark');
    } else {
      this.applyTheme('light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('preferred-theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    document.documentElement.setAttribute('data-theme', themeName);
    this.updateThemeToggle(themeName);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    this.applyTheme(newTheme);
    localStorage.setItem('preferred-theme', newTheme);
  }

  setupThemeToggle() {
    // Create theme toggle button if it doesn't exist
    let themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
      themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.setAttribute('aria-label', 'Toggle theme');
      themeToggle.innerHTML = `
        <span class="theme-icon-light">🌙</span>
        <span class="theme-icon-dark">☀️</span>
      `;
      
      // Add styles
      Object.assign(themeToggle.style, {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        transition: 'all 0.3s ease'
      });

      // Add to navigation
      const nav = document.querySelector('nav');
      if (nav) {
        nav.appendChild(themeToggle);
      }
    }

    themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  updateThemeToggle(themeName) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const lightIcon = themeToggle.querySelector('.theme-icon-light');
    const darkIcon = themeToggle.querySelector('.theme-icon-dark');

    if (themeName === 'dark') {
      if (lightIcon) lightIcon.style.display = 'none';
      if (darkIcon) darkIcon.style.display = 'inline';
    } else {
      if (lightIcon) lightIcon.style.display = 'inline';
      if (darkIcon) darkIcon.style.display = 'none';
    }
  }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
