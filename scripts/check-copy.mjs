import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const rules = JSON.parse(readFileSync('scripts/copy-rules.json', 'utf8'));
const roots = ['src/messages', 'src/content', 'src/emails'];
const exts = new Set(['.json', '.md', '.mdx', '.txt', '.html']);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const checks = [
  ...rules.banned.map((w) => ['banned word', w]),
  ...rules.technical.map((w) => ['technical term', w]),
].map(([kind, w]) => ({
  kind,
  w,
  re: new RegExp(`(^|[^\\p{L}])${esc(w)}([^\\p{L}]|$)`, 'iu'),
}));

function* walk(dir) {
  let names = [];
  try { names = readdirSync(dir); } catch { return; }
  for (const name of names) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (exts.has(extname(p))) yield p;
  }
}

function* strings(value, path) {
  if (typeof value === 'string') yield [path, value];
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, `${path}.${k}`);
}

let failures = 0;
const report = (where, kind, w) => {
  console.error(`${where}  ${kind}: "${w}"`);
  failures += 1;
};

for (const root of roots) {
  for (const file of walk(root)) {
    const text = readFileSync(file, 'utf8');
    if (extname(file) === '.json') {
      try {
        for (const [path, s] of strings(JSON.parse(text), file))
          for (const c of checks) if (c.re.test(s)) report(path, c.kind, c.w);
      } catch (err) {
        console.error(`Invalid JSON: ${file}`);
      }
    } else {
      text.split('\n').forEach((line, i) => {
        for (const c of checks) if (c.re.test(line)) report(`${file}:${i + 1}`, c.kind, c.w);
      });
    }
  }
}

if (failures) {
  console.error(`\n${failures} problem(s). See Section 6.10 of the design document.`);
  process.exit(1);
}
console.log('Copy check passed.');
