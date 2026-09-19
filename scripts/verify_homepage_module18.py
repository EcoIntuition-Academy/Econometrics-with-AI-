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

print("=== VERIFYING HOMEPAGE (index.html) MODULE 18 INTEGRATION ===\n")

# 1. Hero badge
check("Hero badge has '18 Modules'", '18 Modules • Beginner → Advanced' in html)
check("No old '17 Modules' in hero badge", '17 Modules • Beginner → Advanced' not in html)

# 2. Tier 4 heading & count
check("Tier 4 count is 'Modules 10 – 18'", 'Modules 10 – 18' in html)
check("Tier 4 comment is 'Modules 10 - 18'", 'Modules 10 - 18' in html)

# 3. Navbar dropdown
check("Navbar has .nav-dropdown", 'class="nav-dropdown"' in html)
check("Navbar dropdown contains Module 18 link", '<a href="modules/module-18/index.html"' in html)
check("Navbar dropdown item text contains Module 18", 'Module 18 — Multinomial &amp; Conditional Logit Models' in html or 'Module 18: Multinomial' in html)
check("Module 18 appears immediately after Module 17 in dropdown", html.find('modules/module-17/index.html') < html.find('modules/module-18/index.html') < html.find('</nav>'))

# 4. Module 18 Card Placement
pos_mod17 = html.find('<!-- Module 17 -->')
pos_mod18 = html.find('<!-- Module 18 -->')
check("Module 17 exists", pos_mod17 > 0)
check("Module 18 exists", pos_mod18 > 0)
check("Module 18 appears immediately after Module 17", pos_mod18 > pos_mod17)

# Verify no other module card in between
between_17_18 = html[pos_mod17:pos_mod18]
check("No other module card between Module 17 and 18", between_17_18.count('class="module-card"') == 1)

# 5. Module 18 Card Content & Components
mod18_section = html[pos_mod18:html.find('</article>', pos_mod18) + 10]

check("Card has .module-card class", 'class="module-card"' in mod18_section)
check("Module number is 18", '<span class="module-number">18</span>' in mod18_section)
check("Module group tag is 'Multinomial & Conditional Logit'", 'Multinomial &amp; Conditional Logit' in mod18_section)
check("Micro-visual SVG present", '<div class="module-micro-viz"' in mod18_section and '<svg' in mod18_section)
check("Title matches", '<h3 class="module-title">18 Multinomial &amp; Conditional Logit Models</h3>' in mod18_section)
check("Description matches", 'Model choices among multiple unordered alternatives' in mod18_section)

# 6. Key Themes Pills
expected_pills = [
    "Multinomial Choice",
    "Random Utility",
    "Gumbel Errors",
    "Base Category",
    "Relative Log-Odds",
    "Marginal Effects",
    "Predicted Choice",
    "McFadden Pseudo-R²",
    "Wald Tests",
    "Conditional Logit"
]

for pill in expected_pills:
    check(f"Key Themes contains pill: '{pill}'", f'<li class="module-topic-tag">{pill}</li>' in mod18_section)

# 7. Progress & Button
check("Progress label is 'Curriculum Core'", '<span>Curriculum Core</span>' in mod18_section)
check("Progress text id is progress-text-module-18", 'id="progress-text-module-18"' in mod18_section)
check("Progress fill id is progress-fill-module-18", 'id="progress-fill-module-18"' in mod18_section)
check("View Module 18 button text and link", '<a href="modules/module-18/index.html" class="btn btn-primary btn-sm" style="width: 100%;">View Module 18</a>' in mod18_section)

# 8. Footer check
check("Footer mentions 10–18", '10–18' in html)

# 9. Check progress.js
with open('assets/js/progress.js', 'r', encoding='utf-8') as f:
    js = f.read()

check("progress.js has 'module-18': 5", "'module-18': 5" in js)

# 10. Check no module18-specific CSS added to course.css, main.css, variables.css
for css_file in ['assets/css/variables.css', 'assets/css/main.css', 'assets/css/course.css', 'assets/css/responsive.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        css = f.read()
    check(f"No module-18 specific classes in {css_file}", '.module-18' not in css and '#module-18' not in css)

print("\n--- SUMMARY ---")
passed = sum(1 for _, c in checks if c)
total = len(checks)
print(f"Passed: {passed}/{total}")

if passed == total:
    print("\nALL HOMEPAGE MODULE 18 INTEGRATION CHECKS PASSED PERFECTLY! 🚀")
    sys.exit(0)
else:
    print(f"\n{total - passed} check(s) failed.")
    sys.exit(1)
