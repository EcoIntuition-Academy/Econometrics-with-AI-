/**
 * EcoIntuition Academy — Econometrics with AI
 * Lesson Navigation & Sidebar Drawer Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const sidebar = document.getElementById('lessonSidebar');
  const sidebarToggleBtn = document.getElementById('sidebarDrawerToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('drawer-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('drawer-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', openSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
  }

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('drawer-open')) {
      closeSidebar();
    }
  });
});
