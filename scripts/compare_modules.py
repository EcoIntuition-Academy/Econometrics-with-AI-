import subprocess
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_dir = r"g:\Econometrics-with-AI-\scripts\screenshots"

module_lessons = [
    ("m1_l1", "modules/module-01/lesson-01.html"),
    ("m2_l1", "modules/module-02/lesson-01.html"),
    ("m3_l1", "modules/module-03/lesson-01.html"),
    ("m4_l1", "modules/module-04/lesson-01.html"),
    ("m5_l1", "modules/module-05/lesson-01.html")
]

for label, rel_path in module_lessons:
    url = f"http://localhost:8126/{rel_path}"
    out_file = os.path.join(out_dir, f"compare_{label}.png")
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1366,768",
        f"--screenshot={out_file}",
        url
    ]
    subprocess.run(cmd, check=True)
    print(f"Captured {label} -> {out_file}")

print("All module comparisons captured successfully!")
