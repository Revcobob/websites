/* One-shot transform that replaces the three static people grids in
 * cms-pages/mhlc-foundation.html with data-cms-list placeholders the
 * runtime injector fills from the board_members table. Runs once;
 * idempotent — already-replaced grids are skipped.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'cms-pages', 'mhlc-foundation.html');
let html = fs.readFileSync(filePath, 'utf8');

// Match a <div class="...">...</div> block by an exact opening-class
// signature, balancing nested <div>/</div> pairs to find the right close.
function replaceGridByOpeningClass(source, openingClass, slotKey, gridClasses) {
  const open = `<div class="${openingClass}">`;
  const start = source.indexOf(open);
  if (start === -1) return source;

  // walk forward, counting nested <div>/</div>
  let i = start + open.length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    const nextOpen = source.indexOf('<div', i);
    const nextClose = source.indexOf('</div>', i);
    if (nextClose === -1) return source;
    if (nextOpen !== -1 && nextOpen < nextClose) { depth++; i = nextOpen + 4; }
    else { depth--; i = nextClose + 6; }
  }
  const end = i;
  const replacement = `<div data-cms-list="${slotKey}" class="${gridClasses}"></div>`;
  return source.slice(0, start) + replacement + source.slice(end);
}

// 1. Officers — 3-col grid on lg, single signature
if (!html.includes('data-cms-list="officers"')) {
  html = replaceGridByOpeningClass(
    html,
    'mt-12 grid lg:grid-cols-3 gap-5 reveal-stagger',
    'officers',
    'mt-12 grid lg:grid-cols-3 gap-5'
  );
}

// 2. Board members — 2-col md, 3-col lg
if (!html.includes('data-cms-list="board_members"')) {
  html = replaceGridByOpeningClass(
    html,
    'mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger',
    'board_members',
    'mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5'
  );
}

// 3. Staff & advisors — first 2-col grid under "Staff and advisors".
//    There are two grids that share the same class. Pick the first
//    occurrence (which lives under the staff heading).
if (!html.includes('data-cms-list="staff_advisors"')) {
  html = replaceGridByOpeningClass(
    html,
    'mt-4 grid md:grid-cols-2 gap-5 reveal-stagger',
    'staff_advisors',
    'mt-4 grid md:grid-cols-2 gap-5'
  );
}

fs.writeFileSync(filePath, html);
console.log('Foundation page rewired.');
console.log('  officers slot:        ', html.includes('data-cms-list="officers"'));
console.log('  board_members slot:   ', html.includes('data-cms-list="board_members"'));
console.log('  staff_advisors slot:  ', html.includes('data-cms-list="staff_advisors"'));
