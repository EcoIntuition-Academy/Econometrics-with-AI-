# -*- coding: utf-8 -*-
"""
Verification & Normalization Audit for EcoIntuition Academy Module 18
Multinomial & Conditional Logit Models (Discrete Choice Models II)
Authoritative source: Econometrics (18).pdf
"""

import os
import re

m18_dir = 'modules/module-18'
files = [
    'index.html',
    'lesson-01.html',
    'lesson-02.html',
    'lesson-03.html',
    'lesson-04.html',
    'lesson-05.html'
]

expected_progress = {
    'lesson-01.html': 20,
    'lesson-02.html': 40,
    'lesson-03.html': 60,
    'lesson-04.html': 80,
    'lesson-05.html': 100
}

checks_passed = 0
checks_failed = 0

def assert_check(name, condition, details=""):
    global checks_passed, checks_failed
    if condition:
        checks_passed += 1
        print(f"  [PASS] {name}")
    else:
        checks_failed += 1
        print(f"  [FAIL] {name} - {details}")

print("=== STARTING MODULE 18 AUDIT ===\n")

# 1. Check all files exist
for f in files:
    path = os.path.join(m18_dir, f)
    assert_check(f"File exists: {f}", os.path.exists(path))

# 2. Check no custom module-18 stylesheets in CSS directory
css_dir = 'assets/css'
custom_css_found = False
for c_file in os.listdir(css_dir):
    if any(k in c_file.lower() for k in ['module18', 'module-18', 'lesson18']):
        custom_css_found = True
assert_check("Zero module18-specific stylesheets in assets/css", not custom_css_found)

# 3. Check overview file
idx_path = os.path.join(m18_dir, 'index.html')
if os.path.exists(idx_path):
    with open(idx_path, 'r', encoding='utf-8') as fh:
        idx_c = fh.read()
    assert_check("Overview has MODULE LEARNING PATH", 'MODULE LEARNING PATH' in idx_c)
    assert_check("Overview has single-column lesson list", 'module-lessons-list' in idx_c and 'module-lesson-card' in idx_c)
    assert_check("Overview has 5 lesson cards", idx_c.count('class="module-lesson-card"') == 5)
    assert_check("Overview has Start Module 18 button", 'Start Module 18' in idx_c)

# 4. Check each lesson file
canonical_dom_elements = [
    'lesson-content-area',
    'lesson-header-block',
    'objectives-card',
    'equation-box',
    'interactive-lab-card',
    'lab-metrics-grid',
    'metric-card',
    'study-card',
    'practice-item',
    'practice-accordion-panel',
    'summary-card',
    'lesson-pagination',
    'site-footer'
]

for lesson_file, exp_pct in expected_progress.items():
    path = os.path.join(m18_dir, lesson_file)
    if not os.path.exists(path):
        continue

    print(f"\nAuditing {lesson_file}...")
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()

    # Progress check
    pct_match = re.search(r'id=["\']lessonTopProgressText["\']>(\d+)%', content)
    actual_pct = int(pct_match.group(1)) if pct_match else -1
    assert_check(f"Top nav progress text is {exp_pct}%", actual_pct == exp_pct, f"Found {actual_pct}%")

    bar_match = re.search(r'id=["\']lessonTopProgressBar["\'][^>]*style=["\'][^"\']*width:\s*(\d+)%', content)
    actual_bar = int(bar_match.group(1)) if bar_match else -1
    assert_check(f"Top nav progress bar width is {exp_pct}%", actual_bar == exp_pct, f"Found {actual_bar}%")

    # Shell checks
    assert_check("No stray slash in header / nav-separator", 'nav-separator' not in content)
    assert_check("No native select or Lessons Menu", '<select' not in content and 'Lessons Menu' not in content)
    assert_check("Has canonical View Lessons toggle button", 'class="lesson-dropdown-toggle"' in content and 'View Lessons' in content)
    assert_check("Has canonical top-nav hierarchy", 'class="top-nav-module-hierarchy"' in content)

    # Inline style tag check
    assert_check("No inline <style> tags", '<style>' not in content and '<style ' not in content)

    # Canonical DOM classes check
    for elem in canonical_dom_elements:
        assert_check(f"Contains component class '{elem}'", elem in content)

    # Raw LaTeX check
    stripped = re.sub(r'\\\(.*?\\\)', '', content, flags=re.DOTALL)
    stripped = re.sub(r'\\\[.*?\\\]', '', stripped, flags=re.DOTALL)
    stripped = re.sub(r'<script.*?</script>', '', stripped, flags=re.DOTALL)
    stripped = re.sub(r'<style.*?</style>', '', stripped, flags=re.DOTALL)

    raw_keywords = [r'\\beta', r'\\alpha', r'\\theta', r'\\varepsilon', r'\\boldsymbol', r'\\mathbf', r'\\hat']
    raw_found = []
    for rk in raw_keywords:
        m = re.findall(rf'.{{0,20}}{rk}.{{0,20}}', stripped)
        if m:
            raw_found.append((rk, len(m), m[0]))
    assert_check("Zero raw LaTeX in body text", len(raw_found) == 0, f"Found {raw_found}")

# 5. Check lesson 18.5 specific return button
l5_path = os.path.join(m18_dir, 'lesson-05.html')
if os.path.exists(l5_path):
    with open(l5_path, 'r', encoding='utf-8') as fh:
        l5_content = fh.read()
    has_return = 'Return to Module 18 &rarr;' in l5_content or 'Return to Module 18 →' in l5_content
    has_index_link = 'href="index.html" class="lesson-nav-btn btn-next"' in l5_content
    assert_check("Lesson 18.5 pagination has 'Return to Module 18'", has_return)
    assert_check("Lesson 18.5 pagination links to index.html", has_index_link)

print("\n=== AUDIT SUMMARY ===")
print(f"Total Checks: {checks_passed + checks_failed}")
print(f"Passed: {checks_passed}")
print(f"Failed: {checks_failed}")

if checks_failed == 0:
    print("\nALL MODULE 18 PAGES PASSED PARITY AND NORMALIZATION AUDIT!")
else:
    print(f"\nAUDIT FAILED with {checks_failed} errors.")
    exit(1)
