import subprocess
import os
import sys

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_dir = r"g:\Econometrics-with-AI-\scripts\screenshots"
os.makedirs(out_dir, exist_ok=True)

lessons = [
    "modules/module-05/index.html",
    "modules/module-05/lesson-01.html",
    "modules/module-05/lesson-02.html",
    "modules/module-05/lesson-03.html",
    "modules/module-05/lesson-04.html",
    "modules/module-05/lesson-05.html",
    "modules/module-05/lesson-06.html",
    "modules/module-05/lesson-07.html"
]

viewports = [
    (1920, 1080, "desktop_1080p"),
    (1366, 768, "laptop_1366"),
    (768, 1024, "tablet_768"),
    (390, 844, "mobile_390")
]

print("=== RUNNING EDGE HEADLESS MULTI-VIEWPORT AUDIT ===")
all_passed = True

for lesson in lessons:
    url = f"http://localhost:8126/{lesson}"
    lesson_name = os.path.basename(lesson).replace(".html", "")
    print(f"\nChecking {lesson}...")
    for width, height, vp_name in viewports:
        shot_path = os.path.join(out_dir, f"{lesson_name}_{vp_name}.png")
        cmd = [
            edge_path,
            "--headless=new",
            "--disable-gpu",
            f"--window-size={width},{height}",
            f"--screenshot={shot_path}",
            url
        ]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            if os.path.exists(shot_path) and os.path.getsize(shot_path) > 1000:
                print(f"  [OK] {vp_name} ({width}x{height}) -> {os.path.basename(shot_path)} ({os.path.getsize(shot_path)} bytes)")
            else:
                print(f"  [FAIL] {vp_name} ({width}x{height}) failed to generate screenshot")
                all_passed = False
        except Exception as e:
            print(f"  [ERR] {vp_name}: {e}")
            all_passed = False

if all_passed:
    print("\nALL MULTI-VIEWPORT SCREENSHOTS GENERATED SUCCESSFULLY!")
else:
    print("\nSOME SCREENSHOTS FAILED!")
