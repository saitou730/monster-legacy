// Issue #40: deploy the canonical root game, never the Chapter 1 workspace.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '_site');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('id="bootStart"') || !html.includes('src/app.js')) {
  throw new Error('Pages entry must be the root game runtime');
}
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target);
for (const name of ['index.html', 'src', 'styles', 'assets', 'data']) {
  fs.cpSync(path.join(root, name), path.join(target, name), { recursive: true });
}
fs.writeFileSync(path.join(target, '.nojekyll'), '');
console.log('Staged canonical root runtime with official assets; prototype excluded.');
