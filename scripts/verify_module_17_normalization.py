# -*- coding: utf-8 -*-
"""
Verification & Normalization Audit for EcoIntuition Academy Module 17
Hypothesis, Specification Tests & Generalized Method of Moments
Authoritative source: Econometrics (17).pdf
"""

import os
import re

m17_dir = 'modules/module-17'
files = [
    'index.html',
    'lesson-01.html',
    'lesson-02.html',
    'lesson-03.html',
    'lesson-04.html',
    'lesson-05.html',
    'lesson-06.html'
]

expected_progress = {
    'lesson-01.html': 17,
    'lesson-02.html': 33,
    'lesson-03.html': 50,
    'lesson-04.html': 67,
    'lesson-05.html': 83,
    'lesson-06.html': 100
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

print("=== STARTING MODULE 17 AUDIT ===\n")

# 1. Check all files exist
for f in files:
    path = os.path.join(m17_dir, f)
    assert_check(f"File exists: {f}", os.path.exists(path))

# 2. Check no custom module-17 stylesheets in CSS directory
css_dir = 'assets/css'
custom_css_found = False
for c_file in os.listdir(css_dir):
    if 'module17' in c_file.lower() or 'module-17' in c_file.lower() or 'gmm' in c_file.lower():
        custom_css_found = True
assert_check("Zero module17-specific stylesheets in assets/css", not custom_css_found)

# 3. Check each lesson file
canonical_dom_elements = [
    'lesson-content-area',
    'lesson-header-block',
    'objectives-card',
    'equation-box',
    'interactive-lab-card',
    'lab-metrics-grid',
    'metric-card',
    'external-legend-bar',
    'interactive-plot-canvas',
    'visual-explanation-grid',
    'visual-card--seeing',
    'visual-card--notice',
    'visual-card--matters',
    'visual-card--interp',
    'visual-try-this',
    'practice-item',
    'practice-accordion-panel',
    'summary-card',
    'lesson-pagination',
    'site-footer'
]

for lesson_file, exp_pct in expected_progress.items():
    path = os.path.join(m17_dir, lesson_file)
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

    raw_keywords = [r'\\beta', r'\\theta', r'\\lambda', r'\\chi', r'\\boldsymbol', r'\\mathbf', r'\\hat']
    raw_found = []
    for rk in raw_keywords:
        m = re.findall(rf'.{{0,20}}{rk}.{{0,20}}', stripped)
        if m:
            raw_found.append((rk, len(m), m[0]))
    assert_check("Zero raw LaTeX in body text", len(raw_found) == 0, f"Found {raw_found}")

# 4. Check lesson 17.6 specific return button
l6_path = os.path.join(m17_dir, 'lesson-06.html')
if os.path.exists(l6_path):
    with open(l6_path, 'r', encoding='utf-8') as fh:
        l6_content = fh.read()
    has_return = 'Return to Module &rarr;' in l6_content or 'Return to Module →' in l6_content
    has_index_link = 'href="index.html" class="lesson-nav-btn btn-next"' in l6_content
    assert_check("Lesson 17.6 pagination has 'Return to Module'", has_return)
    assert_check("Lesson 17.6 pagination links to index.html", has_index_link)

print("\n=== AUDIT SUMMARY ===")
print(f"Total Checks: {checks_passed + checks_failed}")
print(f"Passed: {checks_passed}")
print(f"Failed: {checks_failed}")

if checks_failed == 0:
    print("\nALL MODULE 17 PAGES PASSED PARITY AND NORMALIZATION AUDIT!")
else:
    print(f"\nAUDIT FAILED with {checks_failed} errors.")
    exit(1)
