import base64, os

with open("g:/Econometrics-with-AI-/Econometrics (7).pdf", "rb") as f:
    pdf_b64 = base64.b64encode(f.read()).decode('utf-8')

html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="pdf.min.js"></script>
  <style>
    body {{ margin: 0; padding: 0; background: #fff; }}
    canvas {{ display: block; }}
  </style>
</head>
<body>
  <canvas id="pdfCanvas"></canvas>
  <div id="status">Loading</div>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    const pdfB64 = "{pdf_b64}";
    const raw = atob(pdfB64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {{
      uint8Array[i] = raw.charCodeAt(i);
    }}
    
    async function init() {{
      try {{
        const params = new URLSearchParams(window.location.search);
        const pNum = parseInt(params.get('page') || '1', 10);
        
        const loadingTask = pdfjsLib.getDocument({{ data: uint8Array }});
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pNum);
        const viewport = page.getViewport({{ scale: 2.0 }});
        const canvas = document.getElementById('pdfCanvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({{ canvasContext: canvas.getContext('2d'), viewport }}).promise;
        
        const dataUrl = canvas.toDataURL('image/png');
        const resDiv = document.createElement('div');
        resDiv.id = 'imgData';
        resDiv.textContent = dataUrl.split(',')[1];
        document.body.appendChild(resDiv);
        
        document.getElementById('status').textContent = 'DONE';
        window.done = true;
      }} catch (e) {{
        document.getElementById('status').textContent = 'ERROR: ' + e.message;
        console.error(e);
      }}
    }}
    init();
  </script>
</body>
</html>"""

with open("g:/Econometrics-with-AI-/temp_pdf_render/render_export7.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Created temp_pdf_render/render_export7.html successfully!")
