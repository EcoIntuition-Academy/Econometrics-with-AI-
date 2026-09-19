import os
import re

pcts = ['17%', '33%', '50%', '67%', '83%', '100%']
all_pass = True

for i in range(1, 7):
    fpath = os.path.join('modules', 'module-17', f'lesson-0{i}.html')
    with open(fpath, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    issues = []
    hero_idx = c.find('class="lesson-hero"')
    header_part = c[:hero_idx] if hero_idx != -1 else c[:1000]
    if 'nav-separator' in c or '<span class="nav-separator">' in header_part:
        issues.append('has nav-separator / stray slash in header')
    if '<select' in c or 'Lessons Menu' in c:
        issues.append('has native select or Lessons Menu')
    if 'Greene' in c:
        issues.append('has Greene citation')
    if 'class="lesson-dropdown-toggle"' not in c or 'View Lessons' not in c:
        issues.append('missing canonical View Lessons dropdown toggle')
    pct = pcts[i-1]
    if f'>{pct}<' not in c or f'width: {pct};' not in c:
        issues.append(f'incorrect progress (expected {pct})')
    if 'class="objectives-card"' not in c:
        issues.append('missing canonical objectives-card')
    if 'class="lesson-section"' not in c:
        issues.append('missing canonical lesson-section')
    if 'main.js' not in c or 'progress.js' not in c or 'interactions.js' not in c:
        issues.append('missing required js scripts')
    if 'dropdown.js' in c or 'lesson.js' in c:
        issues.append('contains obsolete script dropdown.js or lesson.js')
    if 'class="top-lesson-nav"' not in c or 'class="top-lesson-nav-inner"' not in c:
        issues.append('malformed top-lesson-nav shell')
    
    if issues:
        all_pass = False
        print(f"FAIL: {fpath} -> {', '.join(issues)}")
    else:
        print(f"PASS: {fpath} (Progress: {pct}, Clean shell, No Greene, Canonical Dropdown)")

if all_pass:
    print("\nALL MODULE 17 LESSONS MEET THE CANONICAL MODULE 1 SPECIFICATION 100%!")
else:
    print("\nSOME LESSONS FAILED AUDIT!")
