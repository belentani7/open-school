import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

export function preparePagesLibrary(directory) {
  const root = resolve(directory);
  assert.ok(existsSync(join(root, 'manifest.json')), 'Generated learning library manifest is required');
  const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
  const pages = htmlFiles(root);
  assert.equal(pages.length, manifest.pageCount + 1, 'Static page count must match the source manifest');
  let rewrittenLinks = 0;

  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    const rewritten = html.replace(/href="\.\.\/\.\.\/\.\.\/\.\.\/(?:courses\/[a-z0-9-]+|plaza)"/g, () => {
      rewrittenLinks += 1;
      return 'href="../../../app/"';
    });
    writeFileSync(page, rewritten);
  }

  assert.equal(rewrittenLinks, manifest.pageCount * 2, 'Each lesson page must link back to the app twice');
  return { pageCount: manifest.pageCount, htmlFiles: pages.length, rewrittenLinks };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = preparePagesLibrary(process.argv[2] || '_pages/learning-library');
  console.log('GitHub Pages library prepared: ' + report.pageCount + ' content pages, ' + report.htmlFiles + ' HTML files, ' + report.rewrittenLinks + ' app links.');
}
