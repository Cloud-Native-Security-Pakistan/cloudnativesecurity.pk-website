/**
 * Copy the deployable site into an output folder for hosts that need one
 * (Vercel previews). Mirrors the prune list in .github/workflows/pages.yml.
 *
 *   node tools/site/export.ts dist
 */
import { cpSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './content.ts';

const out = process.argv[2] ?? 'dist';
const EXCLUDE = new Set([
  out,
  '.git',
  '.github',
  '.vercel',
  'node_modules',
  'tools',
  'tests',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'server.ps1',
  'vercel.json',
  '.gitignore',
  '.gitattributes',
]);

const target = join(ROOT, out);
rmSync(target, { recursive: true, force: true });
let n = 0;
for (const name of readdirSync(ROOT)) {
  if (EXCLUDE.has(name) || name.endsWith('.md')) continue;
  cpSync(join(ROOT, name), join(target, name), { recursive: true });
  n++;
}
console.log(`Exported ${n} top-level entries to ${out}/`);
