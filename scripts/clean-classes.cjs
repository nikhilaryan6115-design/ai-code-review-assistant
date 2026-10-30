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

const files = walk(path.join(__dirname, '../src'));

const fixes = [
  [/bg-nocturne-wine\/30\/80/g, 'bg-nocturne-charcoal'],
  [/bg-nocturne-wine\/30\/70/g, 'bg-nocturne-charcoal'],
  [/bg-nocturne-wine\/30\/60/g, 'bg-nocturne-charcoal'],
  [/bg-nocturne-wine\/30\/50/g, 'bg-nocturne-charcoal'],
  [/hover:bg-nocturne-wine\/30\/50/g, 'hover:bg-nocturne-wine/40'],
  [/hover:bg-nocturne-wine\/30/g, 'hover:bg-nocturne-wine'],
  [/bg-nocturne-wine\/30/g, 'bg-nocturne-charcoal'],
  [/border-nocturne-border\/80/g, 'border-nocturne-border'],
  [/border-nocturne-border\/60/g, 'border-nocturne-border'],
  [/border-nocturne-borderStrong/g, 'border-nocturne-borderSubtle'],
  [/text-red-950/g, 'text-red-200'],
  [/text-emerald-950/g, 'text-emerald-200'],
  [/bg-emerald-950\/40\/40/g, 'bg-[#0F1C16]'],
  [/bg-emerald-950\/40\/70/g, 'bg-[#0F1C16]'],
  [/border-red-900\/40\/80/g, 'border-red-900/40'],
  [/border-emerald-800\/40\/80/g, 'border-emerald-800/40'],
  [/placeholder-warm-dim/g, 'placeholder-nocturne-grey'],
];

let updatedCount = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  fixes.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Cleaned:', f);
    updatedCount++;
  }
});

console.log(`Total cleaned files: ${updatedCount}`);
