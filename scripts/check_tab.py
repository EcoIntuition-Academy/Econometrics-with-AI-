import subprocess
import json
import time
import urllib.request

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "http://localhost:8126/modules/module-05/lesson-06.html"
])

time.sleep(3)

try:
    tabs = json.loads(urllib.request.urlopen("http://localhost:9222/json").read().decode())
    print("Tabs found:", len(tabs))
    for t in tabs:
        print(t.get("url"), t.get("title"))
finally:
    proc.terminate()
