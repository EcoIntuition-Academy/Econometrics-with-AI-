/**
 * EcoIntuition Academy — Centralized Math Configuration
 * MathJax 3 configuration, local font resolution, and dynamic re-typeset utility
 */
(function() {
  'use strict';

  // Determine relative root for vendor assets
  var path = window.location.pathname || '';
  var depth = (path.match(/modules\/module-[0-9]+/)) ? '../../' : '';

  window.MathJax = {
    tex: {
      inlineMath: [['\\(', '\\)'], ['$', '$']],
      displayMath: [['\\[', '\\]'], ['$$', '$$']],
      processEscapes: true,
      processEnvironments: true,
      packages: { '[+]': ['ams'] },
      macros: {
        boldsymbol: ['\\mathbf{#1}', 1]
      }
    },
    chtml: {
      fontURL: depth + 'assets/vendor/mathjax/output/chtml/fonts/woff-v2'
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    },
    startup: {
      pageReady: function() {
        return MathJax.startup.defaultPageReady().then(function() {
          // Document typesetting finished successfully
        }).catch(function(err) {
          console.warn('Initial MathJax typeset warning:', err);
        });
      }
    }
  };

  var typesetPromise = Promise.resolve();

  /**
   * Helper to re-typeset math in dynamic elements or after innerHTML updates
   * Properly chains onto any ongoing MathJax typesetting promise.
   * @param {HTMLElement|Array<HTMLElement>} elements - Optional DOM element(s) to re-render
   * @returns {Promise}
   */
  window.renderEcoMath = function(elements) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      var targets = elements ? (Array.isArray(elements) ? elements : [elements]) : undefined;
      typesetPromise = typesetPromise.then(function() {
        return window.MathJax.typesetPromise(targets);
      }).catch(function(err) {
        console.warn('MathJax typesetting notice:', err);
      });
      return typesetPromise;
    }
    return Promise.resolve();
  };
})();
