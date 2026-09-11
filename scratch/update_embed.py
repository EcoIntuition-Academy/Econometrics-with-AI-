import base64

with open('Econometrics (7).pdf', 'rb') as f:
    pdf_b64 = base64.b64encode(f.read()).decode('utf-8')

html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="pdf.min.js"></script>
  <style>
    body {{ margin: 0; padding: 20px; background: #525659; text-align: center; }}
    canvas {{ display: block; margin: 0 auto; background: #fff; }}
  </style>
</head>
<body>
  <div id="status" style="color: white; font-family: sans-serif; margin-bottom: 10px;">Ready</div>
  <canvas id="pdfCanvas"></canvas>
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
        document.getElementById('status').textContent = 'Rendering page ' + pNum + '...';
        
        const loadingTask = pdfjsLib.getDocument({{
          data: uint8Array
        }});
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pNum);
        const viewport = page.getViewport({{ scale: 2.0 }});
        const canvas = document.getElementById('pdfCanvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({{ canvasContext: canvas.getContext('2d'), viewport }}).promise;
        document.getElementById('status').textContent = 'Page ' + pNum + ' Complete!';
        window.renderDone = true;
      }} catch (e) {{
        document.getElementById('status').textContent = 'Error: ' + e.message;
        console.error(e);
      }}
    }}
    init();
  </script>
</body>
</html>"""

with open('temp_pdf_render/index_embedded.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated index_embedded.html for PDF 7 successfully!')
