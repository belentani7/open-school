/* ===================================================================
   Guardia de superficie XSS.

   El codigo de React escapa el texto por defecto; el unico modo de
   abrir un agujero es inyectar HTML a mano. Esta suite escanea todo
   client/src y falla si aparece cualquier primitiva de ese tipo, para
   que un copiar-pegar de internet no cuele la puerta trasera.
   =================================================================== */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcDir = fileURLToPath(new URL('..', import.meta.url));

function sourceFiles(): string[] {
  return readdirSync(srcDir, { recursive: true })
    .map(String)
    .filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'));
}

const FORBIDDEN: Array<{ name: string; pattern: RegExp }> = [
  { name: 'dangerouslySetInnerHTML', pattern: /dangerouslySetInnerHTML/ },
  { name: 'innerHTML', pattern: /\.innerHTML\b/ },
  { name: 'outerHTML', pattern: /\.outerHTML\b/ },
  { name: 'document.write', pattern: /document\.write\s*\(/ },
  { name: 'eval()', pattern: /\beval\s*\(/ },
  { name: 'new Function()', pattern: /new\s+Function\s*\(/ },
  // Solo en posicion de URL (href/src/action), para no confundir prosa
  // del glosario que hable de "javascript:".
  { name: 'javascript: URL', pattern: /(href|src|action)\s*[=:]\s*["'`{]?\s*javascript:/i },
];

describe('superficie XSS en client/src', () => {
  const files = sourceFiles();

  it('hay ficheros que escanear (el test no pasa por vacio)', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each(FORBIDDEN)('no aparece $name en ningun fichero', ({ pattern }) => {
    const offenders: string[] = [];
    for (const relative of files) {
      const content = readFileSync(join(srcDir, relative), 'utf8');
      if (pattern.test(content)) offenders.push(relative);
    }
    expect(offenders).toEqual([]);
  });

  it('los enlaces externos abiertos en pestana nueva llevan rel="noopener"', () => {
    const offenders: string[] = [];
    for (const relative of files) {
      const content = readFileSync(join(srcDir, relative), 'utf8');
      if (!content.includes('target="_blank"')) continue;
      // Cada aparicion de target="_blank" debe ir acompanada de rel=...
      const blanks = content.match(/target="_blank"/g)?.length ?? 0;
      const rels = content.match(/rel="[^"]*noopener[^"]*"/g)?.length ?? 0;
      if (rels < blanks) offenders.push(relative);
    }
    expect(offenders).toEqual([]);
  });
});
