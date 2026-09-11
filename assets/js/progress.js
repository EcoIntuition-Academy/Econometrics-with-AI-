/**
 * EcoIntuition Academy — Econometrics with AI
 * Progress Tracking System via LocalStorage
 */

const ProgressTracker = (function () {
  'use strict';

  const STORAGE_KEY = 'ecointuition_progress';

  // Module configuration: total lessons per module (skeleton defaults)
  const MODULE_LESSON_COUNTS = {
    'module-01': 9,
    'module-02': 8,
    'module-03': 7,
    'module-04': 8,
    'module-05': 7,
    'module-06': 8,
    'module-07': 7,
    'module-08': 9,
    'module-09': 7,
    'module-10': 8,
    'module-11': 8,
    'module-12': 8
  };

  function getProgressData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { completedLessons: [] };
    } catch (e) {
      return { completedLessons: [] };
    }
  }

  function saveProgressData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage unavailable for progress tracking');
    }
  }

  function isLessonCompleted(lessonId) {
    const data = getProgressData();
    return data.completedLessons.includes(lessonId);
  }

  function toggleLessonCompleted(lessonId) {
    const data = getProgressData();
    const index = data.completedLessons.indexOf(lessonId);
    if (index > -1) {
      data.completedLessons.splice(index, 1);
    } else {
      data.completedLessons.push(lessonId);
    }
    saveProgressData(data);
    updateAllUI();
    return index === -1;
  }

  function getModuleProgress(moduleId) {
    const data = getProgressData();
    const total = MODULE_LESSON_COUNTS[moduleId] || 1;
    const completed = data.completedLessons.filter(id => id.startsWith(moduleId)).length;
    const pct = Math.min(100, Math.round((completed / total) * 100));
    return { completed, total, pct };
  }

  function updateAllUI() {
    // 1. Update Homepage Module Cards
    Object.keys(MODULE_LESSON_COUNTS).forEach(modId => {
      const stats = getModuleProgress(modId);
      const fill = document.getElementById(`progress-fill-${modId}`);
      const text = document.getElementById(`progress-text-${modId}`);
      if (fill) fill.style.width = `${stats.pct}%`;
      if (text) text.textContent = `${stats.pct}%`;
    });

    // 2. Update Lesson Page Progress Indicators (Top Nav & Dropdown)
    const currentLessonEl = document.querySelector('[data-current-lesson-id]') || document.body;
    let currentLessonId = currentLessonEl.getAttribute('data-current-lesson-id');
    let currentModuleId = currentLessonEl.getAttribute('data-module-id') || document.body.getAttribute('data-module');
    if (!currentLessonId && document.body.getAttribute('data-lesson') && currentModuleId) {
      const lessonNum = String(document.body.getAttribute('data-lesson')).padStart(2, '0');
      currentLessonId = `${currentModuleId}-lesson-${lessonNum}`;
    }

    if (currentModuleId) {
      const stats = getModuleProgress(currentModuleId);
      // Sidebar progress (if present)
      const sidebarFill = document.getElementById('sidebarModuleProgressFill');
      const sidebarText = document.getElementById('sidebarModuleProgressText');
      if (sidebarFill) sidebarFill.style.width = `${stats.pct}%`;
      if (sidebarText) sidebarText.textContent = `${stats.pct}% Complete`;

      // Top nav lesson progress bar & text (supports both ID conventions)
      const topFill = document.getElementById('topNavProgressFill') || document.getElementById('lessonTopProgressBar');
      const topText = document.getElementById('topNavProgressText') || document.getElementById('lessonTopProgressText');
      if (topFill) topFill.style.width = `${stats.pct}%`;
      if (topText) topText.textContent = `${stats.pct}%`;

      // Update dropdown menu items status icons
      document.querySelectorAll('[data-lesson-dropdown-id], .lesson-dropdown-item, .dropdown-item').forEach(item => {
        let lessonId = item.getAttribute('data-lesson-dropdown-id');
        if (!lessonId && item.getAttribute('href')) {
          const match = item.getAttribute('href').match(/lesson-(\d+)\.html/);
          if (match) {
            lessonId = `${currentModuleId}-lesson-${match[1]}`;
          }
        }
        if (!lessonId) return;
        const statusIcon = item.querySelector('.lesson-dropdown-status, .status-indicator');
        if (statusIcon) {
          if (isLessonCompleted(lessonId)) {
            statusIcon.textContent = '✓';
            statusIcon.className = 'status-indicator status-completed';
          } else if (lessonId === currentLessonId) {
            statusIcon.textContent = '●';
            statusIcon.className = 'status-indicator status-active';
          } else {
            statusIcon.textContent = '○';
            statusIcon.className = 'status-indicator status-upcoming';
          }
        }
      });

      // Update horizontal stepper items (if present)
      document.querySelectorAll('[data-stepper-lesson-id]').forEach(step => {
        const lessonId = step.getAttribute('data-stepper-lesson-id');
        if (isLessonCompleted(lessonId)) {
          step.classList.add('completed');
        } else {
          step.classList.remove('completed');
        }
        if (lessonId === currentLessonId) {
          step.classList.add('current');
        } else {
          step.classList.remove('current');
        }
      });
    }

    const markBtn = document.getElementById('markLessonCompleteBtn') || document.querySelector('.mark-lesson-complete-btn');
    if (markBtn && currentLessonId) {
      const completed = isLessonCompleted(currentLessonId);
      markBtn.textContent = completed ? '✓ Lesson Completed' : '✓ Mark Lesson Complete';
      if (completed) {
        markBtn.classList.add('btn-primary');
        markBtn.classList.remove('btn-outline');
      } else {
        markBtn.classList.remove('btn-primary');
        markBtn.classList.add('btn-outline');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateAllUI();

    const markBtn = document.getElementById('markLessonCompleteBtn') || document.querySelector('.mark-lesson-complete-btn');
    if (markBtn) {
      markBtn.addEventListener('click', () => {
        const currentLessonEl = document.querySelector('[data-current-lesson-id]') || document.body;
        let currentLessonId = currentLessonEl.getAttribute('data-current-lesson-id');
        let currentModuleId = currentLessonEl.getAttribute('data-module-id') || document.body.getAttribute('data-module');
        if (!currentLessonId && document.body.getAttribute('data-lesson') && currentModuleId) {
          const lessonNum = String(document.body.getAttribute('data-lesson')).padStart(2, '0');
          currentLessonId = `${currentModuleId}-lesson-${lessonNum}`;
        }
        if (currentLessonId) {
          toggleLessonCompleted(currentLessonId);
        }
      });
    }
  });

  return {
    isLessonCompleted,
    toggleLessonCompleted,
    getModuleProgress,
    updateAllUI
  };
})();
