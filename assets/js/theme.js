/**
 * EcoIntuition Academy — Econometrics with AI
 * Theme Management Script (Light / Dark mode controller)
 */
(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'ecointuition_theme';

  function getPreferredTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') return themeParam;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  // Apply theme immediately to prevent flashing
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }
  });
})();
