import { afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { escapeLearningHtml, generateLearningLibrary } from './staticLearningExport';

let output = '';

function htmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const file = join(directory, name);
    return statSync(file).isDirectory() ? htmlFiles(file) : file.endsWith('.html') ? [file] : [];
  });
}

afterEach(() => {
  if (output) rmSync(output, { recursive: true, force: true });
  output = '';
});

describe('biblioteca HTML de Open School', () => {
  it('publica 204 páginas reales y resuelve todos los enlaces locales', () => {
    output = mkdtempSync(join(tmpdir(), 'open-school-learning-library-'));
    const manifest = generateLearningLibrary(output);
    const files = htmlFiles(output);
    expect(manifest.courseUnits).toBe(12);
    expect(manifest.plazaUnits).toBe(20);
    expect(manifest.coursePageCount).toBe(84);
    expect(manifest.plazaPageCount).toBe(120);
    expect(manifest.pageCount).toBeGreaterThanOrEqual(200);
    expect(files).toHaveLength(manifest.pageCount + 1);
    expect(new Set(files).size).toBe(files.length);
    expect(existsSync(join(output, 'learning-library.css'))).toBe(true);

    for (const file of files) {
      const html = readFileSync(file, 'utf8');
      expect(html).toContain('<html lang="es">');
      expect(html).toContain('name="viewport"');
      expect(html).toContain('class="skip"');
      expect(html.match(/<h1\b/g) ?? []).toHaveLength(1);
      expect(html).not.toMatch(/<script\b/i);
      expect(html.length).toBeGreaterThan(450);

      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (href.startsWith('#') || /^https?:/i.test(href)) continue;
        if (href.startsWith('../../../../courses/') || href === '../../../../plaza') {
          const appTarget = resolve(dirname(file), href);
          expect(appTarget.startsWith(resolve(output, '..') + sep)).toBe(true);
          continue;
        }
        const target = resolve(dirname(file), href);
        expect(target.startsWith(output + sep)).toBe(true);
        expect(existsSync(target), href + ' from ' + file).toBe(true);
      }
    }

    const index = readFileSync(join(output, 'index.html'), 'utf8');
    expect(index).toContain('courses/');
    expect(index).toContain('plaza/');
    const css = readFileSync(join(output, 'learning-library.css'), 'utf8');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media print');
    expect(css).toContain('prefers-reduced-motion');
  });


  it('mantiene sincronizada la biblioteca HTML versionada con el currículo fuente', () => {
    output = mkdtempSync(join(tmpdir(), 'open-school-learning-library-parity-'));
    const generated = generateLearningLibrary(output);
    const committed = resolve(process.cwd(), 'client/public/learning-library');
    expect(JSON.parse(readFileSync(join(committed, 'manifest.json'), 'utf8'))).toEqual(generated);
    for (const file of generated.files) {
      expect(readFileSync(join(committed, file), 'utf8')).toBe(readFileSync(join(output, file), 'utf8'));
    }
  });

  it('escapa el contenido editorial antes de insertarlo en HTML', () => {
    expect(escapeLearningHtml(`<img src=x onerror="alert(1)">&'`))
      .toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');
  });
});
