/**
 * EcoIntuition Academy — Econometrics with AI
 * Main Application Logic (Theme, Mobile Nav, Global Utilities)
 */

(function () {
  'use strict';

  // 1. Theme Management (Light / Dark)
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

  // Initialize theme early
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    // Global Quick Check Hint & Solution Toggles
    document.addEventListener('click', (e) => {
      const hintBtn = e.target.closest('.toggle-hint-btn');
      if (hintBtn) {
        e.preventDefault();
        const card = hintBtn.closest('.quick-check-card');
        if (card) {
          const hint = card.querySelector('.quick-check-hint');
          if (hint) {
            const isHidden = window.getComputedStyle(hint).display === 'none' || hint.style.display === 'none';
            hint.style.display = isHidden ? 'block' : 'none';
            hintBtn.textContent = isHidden ? 'Hide Hint' : 'Hint';
          }
        }
        return;
      }

      const solBtn = e.target.closest('.toggle-sol-btn');
      if (solBtn) {
        e.preventDefault();
        const card = solBtn.closest('.quick-check-card');
        if (card) {
          const sol = card.querySelector('.quick-check-solution');
          if (sol) {
            const isHidden = window.getComputedStyle(sol).display === 'none' || sol.style.display === 'none';
            sol.style.display = isHidden ? 'block' : 'none';
            solBtn.textContent = isHidden ? 'Hide Solution' : 'Show Solution';
          }
        }
        return;
      }
    });

    // Theme toggle button handler
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }

    // 2. Mobile Navbar Menu Toggle
    const mobileNavBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileNavBtn && navLinks) {
      mobileNavBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        mobileNavBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileNavBtn.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('mobile-open');
          mobileNavBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 2.5 Navbar Modules Dropdown (Desktop Click & Mobile Tap Support)
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown.is-open').forEach(dropdown => {
          dropdown.classList.remove('is-open');
          const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
          if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
          }
        });
      }
    });

    // 3. Syllabus Overview Modal
    const modal = document.getElementById('syllabusModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    function openSyllabusModal(btn) {
      if (!modal) return;
      const title = btn.getAttribute('data-mod-title') || 'Module Overview';
      const num = btn.getAttribute('data-mod-num') || 'Module';
      const group = btn.getAttribute('data-mod-group') || 'Curriculum';
      const desc = btn.getAttribute('data-mod-desc') || '';
      const topics = (btn.getAttribute('data-mod-topics') || '').split('|');

      const modalNum = document.getElementById('modalModNum');
      const modalGroup = document.getElementById('modalModGroup');
      const modalTitle = document.getElementById('modalModTitle');
      const modalDesc = document.getElementById('modalModDesc');
      const modalTopics = document.getElementById('modalModTopics');

      if (modalNum) modalNum.textContent = num;
      if (modalGroup) modalGroup.textContent = group;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalTopics) {
        modalTopics.innerHTML = '';
        topics.forEach(t => {
          if (!t.trim()) return;
          const li = document.createElement('li');
          li.className = 'modal-topic-item';
          li.textContent = t.trim();
          modalTopics.appendChild(li);
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSyllabusModal() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.open-syllabus-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSyllabusModal(btn);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeSyllabusModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeSyllabusModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeSyllabusModal();
      }
    });
  });
})();
