import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = []

def check(desc, cond):
    checks.append((desc, bool(cond)))
    status = "[PASS]" if cond else "[FAIL]"
    print(f"{status} {desc}")

print("=== VERIFYING HOMEPAGE (index.html) MODULE 17 INTEGRATION ===\n")

# 1. Hero badge
check("Hero badge has '17 Modules'", '17 Modules • Beginner → Advanced' in html)
check("No old '15 Modules' in hero badge", '15 Modules • Beginner → Advanced' not in html)

# 2. Tier 4 heading & count
check("Tier 4 count is 'Modules 10 – 17'", 'Modules 10 – 17' in html)
check("Tier 4 comment is 'Modules 10 - 17'", 'Modules 10 - 17' in html)

# 3. Navbar dropdown
check("Navbar has .nav-dropdown", 'class="nav-dropdown"' in html)
check("Navbar dropdown contains Module 17 link", '<a href="modules/module-17/index.html"' in html)
check("Navbar dropdown item text contains Module 17", 'Module 17 — Hypothesis, Specification Tests &amp; GMM' in html or 'Module 17: Hypothesis' in html)
check("Module 17 appears immediately after Module 16 in dropdown", html.find('modules/module-16/index.html') < html.find('modules/module-17/index.html') < html.find('</nav>'))

# 4. Module 17 Card Placement
pos_mod16 = html.find('<!-- Module 16 -->')
pos_mod17 = html.find('<!-- Module 17 -->')
check("Module 16 exists", pos_mod16 > 0)
check("Module 17 exists", pos_mod17 > 0)
check("Module 17 appears immediately after Module 16", pos_mod17 > pos_mod16)

# Verify no other module card in between
between_16_17 = html[pos_mod16:pos_mod17]
check("No other module card between Module 16 and 17", between_16_17.count('class="module-card"') == 1)

# 5. Module 17 Card Content & Components
mod17_section = html[pos_mod17:html.find('</article>', pos_mod17) + 10]

check("Card has .module-card class", 'class="module-card"' in mod17_section)
check("Module number is 17", '<span class="module-number">17</span>' in mod17_section)
check("Module group tag is 'Specification Tests & GMM'", 'Specification Tests &amp; GMM' in mod17_section)
check("Micro-visual SVG present", '<div class="module-micro-viz"' in mod17_section and '<svg' in mod17_section)
check("Title matches", '<h3 class="module-title">17 Hypothesis, Specification Tests &amp; Generalized Method of Moments</h3>' in mod17_section)
check("Description matches", 'Learn how econometricians test parameter restrictions' in mod17_section)

# 6. Key Themes Pills
expected_pills = [
    "Likelihood Ratio Test",
    "Wald Test",
    "LM / Score Test",
    "LR–Wald–LM Comparison",
    "Moment Conditions",
    "GMM",
    "OLS as GMM",
    "IV &amp; Overidentification",
    "Optimal Weighting",
    "Efficient GMM",
    "Hansen J-Test"
]

for pill in expected_pills:
    check(f"Key Themes contains pill: '{pill}'", f'<li class="module-topic-tag">{pill}</li>' in mod17_section)

# 7. Progress & Button
check("Progress label is 'Curriculum Core'", '<span>Curriculum Core</span>' in mod17_section)
check("Progress text id is progress-text-module-17", 'id="progress-text-module-17"' in mod17_section)
check("Progress fill id is progress-fill-module-17", 'id="progress-fill-module-17"' in mod17_section)
check("View Module 17 button text and link", '<a href="modules/module-17/index.html" class="btn btn-primary btn-sm" style="width: 100%;">View Module 17</a>' in mod17_section)

# 8. Footer check
check("Footer mentions 10–17", '10–17' in html)

# 9. Check progress.js
with open('assets/js/progress.js', 'r', encoding='utf-8') as f:
    js = f.read()

check("progress.js has 'module-17': 6", "'module-17': 6" in js)

# 10. Check no module17-specific CSS added to course.css, main.css, variables.css
for css_file in ['assets/css/variables.css', 'assets/css/main.css', 'assets/css/course.css', 'assets/css/responsive.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        css = f.read()
    check(f"No module-17 specific classes in {css_file}", '.module-17' not in css and '#module-17' not in css)

print("\n--- SUMMARY ---")
passed = sum(1 for _, c in checks if c)
total = len(checks)
print(f"Passed: {passed}/{total}")

if passed == total:
    print("\nALL HOMEPAGE MODULE 17 INTEGRATION CHECKS PASSED PERFECTLY! 🚀")
    sys.exit(0)
else:
    print(f"\n{total - passed} check(s) failed.")
    sys.exit(1)
