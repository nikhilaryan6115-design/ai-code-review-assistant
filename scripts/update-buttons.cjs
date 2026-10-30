const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src/pages'));

const replacements = [
  [/bg-wine hover:bg-wine-800 text-white text-xs font-semibold shadow-wine-glow/g, 'bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card'],
  [/bg-wine text-white text-xs font-semibold hover:bg-wine-800 shadow-wine-glow/g, 'bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card'],
  [/bg-wine text-white font-bold shadow-wine-glow/g, 'bg-pumpkin text-nocturne-bg font-semibold shadow-card'],
  [/bg-wine text-white font-bold/g, 'bg-pumpkin text-nocturne-bg font-semibold'],
  [/bg-wine text-white font-semibold/g, 'bg-pumpkin text-nocturne-bg font-semibold'],
  [/shadow-wine-glow/g, 'shadow-card'],
  [/shadow-warm-lg/g, 'shadow-dropdown'],
  [/shadow-warm-md/g, 'shadow-card'],
  [/text-wine(?!\w)/g, 'text-pumpkin'],
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  replacements.forEach(([regex, rep]) => {
    content = content.replace(regex, rep);
  });
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated:', f);
  }
});
