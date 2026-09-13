# Econometrics with AI

> **EcoIntuition Academy**  
> *Understand economic relationships through data, models, and intuition.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Course-1d4ed8?style=flat-square&logo=github)](https://EcoIntuition-Academy.github.io/Econometrics-with-AI-/)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e?style=flat-square)](LICENSE)
[![Pedagogy: Rigorous & Intuitive](https://img.shields.io/badge/Pedagogy-Theory%20%E2%80%A2%20Math%20%E2%80%A2%20Code%20%E2%80%A2%20AI-4338ca?style=flat-square)](#pedagogical-sequence)

---

## Course Overview

**Econometrics with AI** is an open, modern, interactive university-level course developed by **EcoIntuition Academy**. It bridges classical econometrics (regression analysis, statistical inference, causal identification, time series, and panel data) with modern machine learning and responsible artificial intelligence.

The platform is designed to be beginner-accessible while maintaining the mathematical and statistical rigor expected in undergraduate and graduate economics programs.

---

## Core Pedagogical Sequence

Every lesson adheres to a strict 17-part learning progression designed to prevent formula fatigue and ensure deep conceptual retention:

```
QUESTION 
   ↓
ECONOMIC INTUITION 
   ↓
ECONOMETRIC MODEL 
   ↓
MATHEMATICAL SPECIFICATION 
   ↓
STEP-BY-STEP DERIVATION 
   ↓
GRAPHICAL INTUITION (with 4 mandatory explanatory areas)
   ↓
WORKED EXAMPLE 
   ↓
INTERACTIVE LAB EXPERIMENT 
   ↓
EMPIRICAL CODE (Python & R)
   ↓
AI INSIGHT & CRITICAL PROMPTING 
   ↓
COMMON MISTAKE ANALYSIS 
   ↓
ECONOMIC INTERPRETATION 
   ↓
PRACTICE QUESTIONS 
   ↓
LESSON SUMMARY
```

---

## Curriculum Roadmap

1. **Module 1: Introduction to Econometrics** — Economic questions, empirical workflow, and foundational model concepts.
2. **Module 2: Simple Linear Regression** — Bivariate OLS, population vs. sample regression functions, residuals, and variance decomposition.
3. **Module 3: Multiple Linear Regression** — Control variables, ceteris paribus, multi-parameter OLS, and $R^2$ / Adjusted $R^2$.
4. **Module 4: Statistical Inference** — Sampling distributions, standard errors, $t$-tests, $p$-values, confidence intervals, and joint $F$-tests.
5. **Module 5: Regression Assumptions and Model Problems** — Gauss-Markov theorem, multicollinearity, heteroskedasticity, autocorrelation, and misspecification.
6. **Module 6: Functional Forms and Dummy Variables** — Categorical dummies, interaction terms, log transformations, elasticities, and polynomials.
7. **Module 7: Endogeneity and Causal Inference** — Omitted variable bias, simultaneity, instrumental variables (IV/2SLS), and natural experiments.
8. **Module 8: Time Series Econometrics** — Trends, stationarity, autocorrelation, AR/MA modeling, distributed lags, unit roots, and forecasting.
9. **Module 9: Panel Data** — Pooled OLS, fixed effects, random effects, individual heterogeneity, and Hausman diagnostics.
10. **Module 10: Panel Data II** — First differences, cluster-robust standard errors, choosing the cluster level, small-cluster issues, and the Hausman test.
11. **Module 11: Instrumental Variables & Two-Stage Least Squares (2SLS)** — Endogeneity, instrument validity/relevance/monotonicity, supply-demand simultaneity, matrix formulation, and 2SLS projection matrix $P_Z$.

---

## Architecture & Directory Structure

```
econometrics-with-ai/
├── index.html                           # Main Course Homepage
├── assets/
│   ├── css/
│   │   ├── variables.css                # Academic color palette, typography & tokens
│   │   ├── main.css                     # Reset, base typography, buttons, navbar, footer
│   │   ├── course.css                   # Homepage sections (Hero, Modules, Workflow)
│   │   ├── lesson.css                   # Lesson layout, sidebar, formulas, code tabs
│   │   └── responsive.css               # Media queries for all device sizes
│   ├── js/
│   │   ├── main.js                      # Theme switcher (Dark/Light) & mobile navbar
│   │   ├── navigation.js                # Lesson sidebar drawer controller
│   │   ├── progress.js                  # LocalStorage lesson completion tracker
│   │   └── interactions.js              # Tabs, practice accordions, regression lab
│   └── images/
│       └── logo.svg                     # EcoIntuition vector logo
├── modules/
│   ├── module-01/
│   │   ├── index.html                   # Module 1 Overview & Syllabus
│   │   └── lesson-01.html               # Demo Lesson 1.1 with all 17 components
│   ├── module-02/ ... module-10/        # Prepared module directories
└── README.md
```

---

## How to Add New Lessons

When expanding the course with additional lessons (e.g. `modules/module-01/lesson-02.html`):

1. Duplicate `modules/module-01/lesson-01.html`.
2. Update the `data-current-lesson-id` attribute on `<body>` (e.g. `data-current-lesson-id="module-01-lesson-02"`).
3. Set the active class on the corresponding sidebar item in `<nav class="sidebar-nav-list">`.
4. Fill in the 17 pedagogical sections while preserving the component CSS classes (`.formula-card`, `.chart-card`, `.worked-example-card`, `.ai-insight-box`, etc.).
5. Ensure equations are wrapped inside `.formula-math-render` with `$$...$$` delimiters for automatic KaTeX rendering.
6. Every graph must include the 4 mandatory explanation blocks (`What you are seeing`, `Why it matters`, `What changes when parameters change`, and `Economic interpretation`).

---

## Local Development & Testing

Since this project uses vanilla HTML, CSS, and JavaScript with zero build dependencies, you can serve it locally using any static HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Then navigate to `http://localhost:8000` in your web browser.

---

## License

Created by **EcoIntuition Academy**. Distributed under the [MIT License](LICENSE).
