import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('el enlace Volver arriba del pie global', () => {
  it('usa la parte superior del documento y no un ancla exclusiva de la portada', () => {
    const source = readFileSync(new URL('../client/src/components/Footer.tsx', import.meta.url), 'utf8');

    // Footer está en App para /catalog, /biblia, /escuelas, etc.,
    // mientras que la ancla #top solo existe en Home.
    expect(source).toContain('href="#"');
    expect(source).not.toContain('href="#top"');
  });
});
