/**
 * Zero-dependency static server for local preview.
 *   node tools/site/serve.ts [port]
 * Serves the repository root the way GitHub Pages does: /path/ -> /path/index.html.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { ROOT } from './content.ts';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const port = Number(process.argv[2] ?? 4321);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let rel = normalize(decodeURIComponent(url.pathname)).replace(/^([\\/])+/, '');
    if (rel.includes('..')) throw new Error('bad path');
    let file = join(ROOT, rel);
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { location: `${url.pathname}/` }).end();
        return;
      }
      file = join(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' }).end(body);
  } catch {
    const notFound = await readFile(join(ROOT, '404.html')).catch(() => Buffer.from('Not found'));
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(notFound);
  }
}).listen(port, () => console.log(`Preview at http://localhost:${port}/`));
