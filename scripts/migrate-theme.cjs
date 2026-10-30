#!/usr/bin/env node
// Global class name replacement script for Halloween theme migration
const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  ['bg-warm-white', 'bg-nocturne-plum'],
  ['bg-warm-bg', 'bg-nocturne-bg'],
  ['bg-warm-subtle', 'bg-nocturne-wine/30'],
  ['bg-warm-subtle/60', 'bg-nocturne-wine/20'],
  ['bg-warm-subtle/50', 'bg-nocturne-wine/15'],
  ['bg-warm-subtle/80', 'bg-nocturne-wine/25'],
  ['bg-warm-subtle/70', 'bg-nocturne-wine/20'],
  ['bg-buttercream/50', 'bg-nocturne-plum/80'],
  ['bg-buttercream/30', 'bg-wine-900/20'],
  ['bg-buttercream', 'bg-nocturne-charcoal'],
  // Borders
  ['border-warm-border', 'border-nocturne-border'],
  ['border-warm-borderStrong', 'border-nocturne-border'],
  ['border-warm-borderGold', 'border-nocturne-borderGold'],
  ['border-warm-border/60', 'border-nocturne-border/60'],
  ['border-warm-border/50', 'border-nocturne-border/50'],
  ['border-warm-border/40', 'border-nocturne-border/40'],
  // Text colours
  ['text-warm-charcoal', 'text-nocturne-ivory'],
  ['text-warm-muted', 'text-nocturne-grey'],
  ['text-warm-dim', 'text-nocturne-grey/60'],
  ['text-tobacco-800', 'text-tobacco-400'],
  ['text-tobacco-700', 'text-tobacco-400'],
  ['text-tobacco-900', 'text-tobacco-300'],
  // Wine colours in old context - keep as wine
  // Accent: warm buttons, links
  ['hover:bg-warm-subtle', 'hover:bg-nocturne-wine/30'],
  ['hover:bg-warm-subtle/50', 'hover:bg-nocturne-wine/20'],
  ['hover:text-warm-charcoal', 'hover:text-nocturne-ivory'],
  ['divide-warm-border', 'divide-nocturne-border'],
  // Shadows
  ['shadow-warm-sm', 'shadow-card'],
  ['shadow-warm-lg', 'shadow-dropdown'],
  ['shadow-warm-dropdown', 'shadow-dropdown'],
  ['shadow-wine-sm', 'shadow-wine-glow'],
  // Merged borders
  ['ring-warm-border', 'ring-nocturne-border'],
  // Old green
  ['text-emerald-700', 'text-emerald-400'],
  ['bg-emerald-50', 'bg-emerald-950/40'],
  ['border-emerald-200', 'border-emerald-800/40'],
  ['text-emerald-800', 'text-emerald-400'],
  // Old red
  ['bg-red-50/70', 'bg-red-950/40'],
  ['bg-red-50', 'bg-red-950/40'],
  ['border-red-200', 'border-red-900/40'],
  ['text-red-800', 'text-red-400'],
  ['text-red-700', 'text-red-400'],
  ['bg-red-900/20', 'bg-red-950/30'],
  ['hover:bg-red-50', 'hover:bg-red-900/20'],
  // Old amber
  ['bg-amber-50/70', 'bg-pumpkin-dark/15'],
  ['bg-amber-50', 'bg-pumpkin-dark/15'],
  ['border-amber-200', 'border-pumpkin/25'],
  ['border-amber-300', 'border-pumpkin/30'],
  ['text-amber-900', 'text-pumpkin'],
  ['text-amber-800', 'text-pumpkin'],
  ['text-amber-700', 'text-pumpkin'],
  // Old wine text references
  ['text-wine-700', 'text-wine-400'],
  ['text-wine-800', 'text-pumpkin'],
  ['text-wine-900', 'text-pumpkin'],
  ['bg-wine-50', 'bg-wine-900/30'],
  ['border-wine-200', 'border-wine-700/40'],
  // Old buttercream/tobacco combos in tags  
  ['bg-tobacco-50', 'bg-nocturne-wine/30'],
  ['border-tobacco-200', 'border-nocturne-border'],
  ['text-tobacco-800', 'text-tobacco-400'],
  // Font families in prose contexts
  ['font-heading', 'font-heading'],  // keep
];

const targetFiles = process.argv.slice(2);

targetFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [from, to] of replacements) {
    if (from === to) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    if (regex.test(content)) {
      content = content.replace(new RegExp(escaped, 'g'), to);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } else {
    console.log(`— No changes: ${filePath}`);
  }
});
