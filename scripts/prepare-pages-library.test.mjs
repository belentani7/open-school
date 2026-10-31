import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { after, describe, it } from 'node:test';
import { preparePagesLibrary } from './prepare-pages-library.mjs';

const temporary = mkdtempSync(join(tmpdir(), 'open-school-pages-'));
after(() => rmSync(temporary, { recursive: true, force: true }));

describe('GitHub Pages library adapter', () => {
  it('keeps relative library links and routes the two app actions to /app/', () => {
    const root = join(temporary, 'learning-library');
    const unit = join(root, 'courses', 'secure-t', 'unit-01');
    mkdirSync(unit, { recursive: true });
    writeFileSync(join(root, 'manifest.json'), JSON.stringify({ pageCount: 1 }));
    writeFileSync(join(root, 'index.html'), '<a href="courses/secure-t/unit-01/00.html">Lesson</a>');
    const page = join(unit, '00.html');
    writeFileSync(page, '<a href="../../../../courses/secure-t">Open course</a><a href="../../../../plaza">Open plaza</a><a href="../../../index.html">Catalogue</a>');

    const report = preparePagesLibrary(root);
    const html = readFileSync(page, 'utf8');
    assert.deepEqual(report, { pageCount: 1, htmlFiles: 2, rewrittenLinks: 2 });
    assert.equal((html.match(/href="\.\.\/\.\.\/\.\.\/app\//g) ?? []).length, 2);
    assert.match(html, /href="\.\.\/\.\.\/\.\.\/index\.html"/);
    assert.match(readFileSync(join(root, 'index.html'), 'utf8'), /courses\/secure-t/);
  });
});
