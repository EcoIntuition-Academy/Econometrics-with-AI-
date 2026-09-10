/**
 * EcoIntuition Academy — Centralized Math Configuration
 * MathJax 3 configuration and dynamic re-typeset utility
 */
(function() {
  'use strict';

  window.MathJax = {
    tex: {
      inlineMath: [['\\(', '\\)'], ['$', '$']],
      displayMath: [['\\[', '\\]'], ['$$', '$$']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    },
    startup: {
      pageReady: function() {
        return MathJax.startup.defaultPageReady();
      }
    }
  };

  /**
   * Helper to re-typeset math in dynamic elements or after innerHTML updates
   * @param {HTMLElement|Array<HTMLElement>} elements - Optional DOM element(s) to re-render
   */
  window.renderEcoMath = function(elements) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      var targets = elements ? (Array.isArray(elements) ? elements : [elements]) : [];
      return window.MathJax.typesetPromise(targets.length > 0 ? targets : undefined).catch(function(err) {
        console.warn('MathJax typesetting notice:', err);
      });
    }
    return Promise.resolve();
  };
})();
