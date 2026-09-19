# EcoIntuition Academy — Permanent Course UI / CSS Guardrails
**Repository Standard for Econometrics with AI (Modules 1–15 & All Future Modules)**

---

## 🔒 Primary Axiom: One Course, One CSS System, One Component Library
* A learner moving across **any module (1 through 15+)** must experience an identical visual identity, typography, layout, and component system.
* **Only academic content, lesson numbers, and pedagogical semantic colors change.** The UI, CSS classes, card dimensions, button styles, and responsive structures must NEVER change.
* **Never create module-specific stylesheets** (e.g., `module16.css`, `.module16-card`, `#lesson16 button`). All styles belong to the shared architecture:
  * `variables.css`
  * `main.css`
  * `course.css`
  * `lesson.css`
  * `responsive.css`

---

## 1. Pre-Flight Inspection (Before Writing Any New HTML)
Before creating or editing any module/lesson, open and inspect actual finalized reference pages:
* **Canonical Overview**: `modules/module-14/index.html` or `modules/module-15/index.html`
* **Canonical Lesson**: `modules/module-14/lesson-01.html`
* **Canonical Interactive Lab**: `modules/module-15/lesson-06.html` or `modules/module-14/lesson-01.html`
* **Canonical Derivation**: `modules/module-02/lesson-02.html`
* **Canonical Final Lesson**: `modules/module-15/lesson-06.html`

---

## 2. Shared Canonical Component Library

### A. Navbar (`.site-header`)
* Standardized 15-module dropdown menu inside `<div class="nav-dropdown-menu">`.
* Whichever module is active receives `class="nav-dropdown-item active"`.
* Never add individual top-level module links.

### B. Sticky Top Lesson Context Bar (`.top-lesson-nav`)
* Left: Hierarchy link `<a href="index.html" class="module-kicker">MODULE XX</a>`, title `.module-nav-title`, and `.lesson-nav-current`.
* Right: Custom dropdown `.lesson-dropdown-wrapper` + `.top-nav-progress`:
  ```html
  <div class="top-nav-progress">
    <div class="progress-info-text">
      <span>Progress</span>
      <span class="progress-percent" id="lessonTopProgressText">XX%</span>
    </div>
    <div class="progress-bar-track">
      <div class="progress-bar-fill" id="lessonTopProgressBar" style="width: XX%;"></div>
    </div>
  </div>
  ```
* **Lesson Position Progress Rule**: Lesson position progress = `round((lesson_number / total_lessons) * 100)`.
  * For 6 lessons: 17%, 33%, 50%, 67%, 83%, 100%.
  * **Final lesson must ALWAYS show 100% and a fully filled bar. 0% is an absolute bug.**

### C. Module Overview Architecture
1. `.site-header`
2. `.module-hero` (badges, title, description, Start/Explore buttons, `.module-progress-card`)
3. `.module-learning-path-card` (compact wrapping concept nodes `.module-learning-path-flow`)
4. `.module-lessons-section` with `.module-lessons-list` containing **single-column** `.module-lesson-card` items.
5. `.site-footer`

### D. Standard Lesson Architecture
1. `.site-header`
2. `.top-lesson-nav`
3. Compact Lesson Hero (`.lesson-hero`)
4. Learning Objectives (`.learning-objectives-card` or `.study-card`)
5. Study Sections (`.study-section`)
6. Major Equation Cards (`.equation-card`)
7. Derivations: Must use 3+ step `.derivation-journey` with vertical connecting rail (Goal $ightarrow$ Steps $ightarrow$ Why $ightarrow$ Key Result $ightarrow$ Big Picture).
8. Interactive Labs (`.interactive-lab-card`):
   * Header: Eyebrow `.lab-badge`, `.lab-title`, `.lab-desc`
   * Controls: Segmented buttons (`.btn.btn-sm.btn-primary.active` / `.btn-outline`), full-width `.lab-slider-group`
   * Metrics: 2 × 2 `.lab-metrics-grid` with `.metric-card`
   * Legend: Compact `.external-legend-bar` ABOVE the plot
   * Plot: Centered `.visualization-card` (height 340–430px), no clipping, UI font labels
   * Insight: `.study-card#labInsightContainer` with `SCENARIO INSIGHT`
   * Explanations: 2 × 2 `.chart-explanations-grid` (What You Are Seeing, What To Notice, Why It Matters, Econometric Interpretation) + full-width TRY THIS
9. Quick Check: Canonical `.quick-check-card` with `.btn.btn-secondary.btn-sm.toggle-hint-btn` and `.btn.btn-primary.btn-sm.toggle-sol-btn`. Initial: hidden. Expanded: HINT, ANSWER, WHY. Content-driven height, never placed in an oversized empty section.
10. Summary: `.summary-takeaways-card` with 4–6 concise takeaway bullets.
11. Bottom Navigation: Canonical `.lesson-pagination` cards.
    * Middle lessons: `← Previous Lesson` / `Next Lesson →`
    * Final lesson: `← Previous Lesson` / `Return to Module →`
12. `.site-footer`

---

## 3. Strict Prohibitions & Build Failure Conditions
The build/PR must be REJECTED if any of the following are detected:
* [ ] Any browser-default unstyled `<button>`, `<select>`, `<input type="range">`, checkbox, or native dropdown.
* [ ] Any local `<style>` tags or module-specific patch classes (`.moduleXX-...`).
* [ ] Any fallback browser serif fonts (Times New Roman).
* [ ] Any broken local paths (`file:///`, `C:\`, `G:\`). All paths must be relative (e.g. `../../assets/css/...`).
* [ ] Final lesson having a different footer, sparse white space, or non-standard review layout.
* [ ] Blank or placeholder graphs.
* [ ] Legend covering plot data.
* [ ] 0% progress on the final lesson.
