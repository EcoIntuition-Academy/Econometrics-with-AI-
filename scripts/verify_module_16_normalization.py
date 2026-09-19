# scripts/verify_module_16_normalization.py
import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m16_dir = os.path.join(base_dir, 'modules', 'module-16')

expected_progress = {
    'lesson-01.html': ('17%', '17%'),
    'lesson-02.html': ('33%', '33%'),
    'lesson-03.html': ('50%', '50%'),
    'lesson-04.html': ('67%', '67%'),
    'lesson-05.html': ('83%', '83%'),
    'lesson-06.html': ('100%', '100%'),
}

errors = []
warnings = []

# 1. Check all lessons
for fname, (exp_txt, exp_width) in expected_progress.items():
    fpath = os.path.join(m16_dir, fname)
    if not os.path.exists(fpath):
        errors.append(f"Missing file: {fname}")
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for <style> tags
    if '<style>' in content or '<style ' in content:
        errors.append(f"{fname}: Contains inline <style> tag!")

    # Check for module16.css or lesson16.css
    if 'module16.css' in content or 'module-16.css' in content or 'lesson16.css' in content:
        errors.append(f"{fname}: References non-shared module16 stylesheet!")

    # Check for broken latex escapes (e.g., raw begin{ without backslash, or formfeed \f replaced)
    if '\x08' in content or '\x0c' in content:
        errors.append(f"{fname}: Contains ASCII escape character (formfeed or backspace)")
    missing_slash_begin = re.findall(r'(?<!\\)begin\{', content)
    missing_slash_frac = re.findall(r'(?<!\\)frac\{', content)
    if missing_slash_begin:
        errors.append(f"{fname}: Found 'begin{{' without backslash: {len(missing_slash_begin)} instance(s)")
    if missing_slash_frac:
        errors.append(f"{fname}: Found 'frac{{' without backslash: {len(missing_slash_frac)} instance(s)")
    if 'Misplaced &' in content:
        errors.append(f"{fname}: Found visible 'Misplaced &' text!")

    # Check progress text and bar fill
    if exp_txt not in content:
        errors.append(f"{fname}: Missing progress text {exp_txt}")
    if f'style="width: {exp_width};"' not in content:
        errors.append(f"{fname}: Missing progress bar width {exp_width}")

    # Check essential stylesheets
    for css in ['variables.css', 'main.css', 'course.css', 'lesson.css', 'responsive.css']:
        if css not in content:
            errors.append(f"{fname}: Missing stylesheet {css}")

    # Check MathJax
    if 'math-config.js' not in content or 'tex-chtml.js' not in content:
        errors.append(f"{fname}: Missing standard MathJax import")

    # Check canonical components
    if 'lesson-header-block' not in content:
        errors.append(f"{fname}: Missing .lesson-header-block")
    if 'objectives-card' not in content:
        errors.append(f"{fname}: Missing .objectives-card")
    if 'practice-item' not in content:
        errors.append(f"{fname}: Missing Quick Check .practice-item")
    if 'hint-toggle' not in content or 'solution-toggle' not in content:
        errors.append(f"{fname}: Missing Quick Check buttons .hint-toggle / .solution-toggle")
    if 'mark-lesson-complete-btn' not in content:
        errors.append(f"{fname}: Missing mark-lesson-complete-btn")
    if 'lesson-pagination' not in content:
        errors.append(f"{fname}: Missing .lesson-pagination")
    if 'site-footer' not in content:
        errors.append(f"{fname}: Missing .site-footer")

    # Check interactive lab structure
    if 'interactive-lab-card' not in content:
        errors.append(f"{fname}: Missing .interactive-lab-card")
    if 'external-legend-bar' not in content:
        errors.append(f"{fname}: Missing .external-legend-bar")
    if 'chart-explanations-grid' not in content:
        errors.append(f"{fname}: Missing .chart-explanations-grid")
    if 'TRY THIS' not in content:
        warnings.append(f"{fname}: Missing 'TRY THIS' section")

# Check index.html
idx_path = os.path.join(m16_dir, 'index.html')
if not os.path.exists(idx_path):
    errors.append("Missing index.html")
else:
    with open(idx_path, 'r', encoding='utf-8') as f:
        idx_content = f.read()
    if '<style>' in idx_content:
        errors.append("index.html: Contains inline <style> tag!")
    if 'module-lessons-list' not in idx_content:
        errors.append("index.html: Missing .module-lessons-list")
    if 'site-footer' not in idx_content:
        errors.append("index.html: Missing .site-footer")

print("--- AUDIT RESULTS ---")
if not errors:
    print("ALL MODULE 16 PAGES PASSED PARITY AND NORMALIZATION AUDIT!")
else:
    print(f"FAILED with {len(errors)} error(s):")
    for err in errors:
        print("  [ERROR]", err)

if warnings:
    print(f"{len(warnings)} warning(s):")
    for w in warnings:
        print("  [WARN]", w)
