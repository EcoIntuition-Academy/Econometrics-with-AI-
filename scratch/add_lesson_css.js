const fs = require('fs');
const path = require('path');
const dir = 'g:/Econometrics-with-AI-/modules/module-07';
const files = ['lesson-01.html', 'lesson-02.html', 'lesson-03.html', 'lesson-04.html', 'lesson-05.html'];

for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('assets/css/lesson.css')) {
    content = content.replace(
      '<link rel="stylesheet" href="../../assets/css/course.css">',
      '<link rel="stylesheet" href="../../assets/css/course.css">\n  <link rel="stylesheet" href="../../assets/css/lesson.css">'
    );
    fs.writeFileSync(p, content, 'utf8');
    console.log('Added lesson.css to:', f);
  }
}
console.log('Done adding lesson.css');
