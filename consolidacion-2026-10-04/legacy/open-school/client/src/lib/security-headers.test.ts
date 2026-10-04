/* ===================================================================
   Test de regresión de la superficie publica.

   Vercel no ejecuta estos tests: si alguien añade un origen externo a
   la CSP, quita nosniff o mete 'unsafe-inline' en script-src, esta
   suite falla antes de que el cambio llegue a produccion.
   =================================================================== */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface VercelConfig {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
}

function header(config: VercelConfig, source: string, key: string): string | undefined {
  const block = (config.headers ?? []).find((h) => h.source === source);
  return block?.headers.find((h) => h.key === key)?.value;
}

const config = JSON.parse(
  readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8')
) as VercelConfig;

describe('cabeceras de seguridad (vercel.json)', () => {
  const csp = header(config, '/(.*)', 'Content-Security-Policy') ?? '';

  it('define una CSP estricta por defecto', () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('script-src no admite codigo inline ni eval', () => {
    const scriptSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('script-src '));
    expect(scriptSrc).toBe("script-src 'self'");
    expect(scriptSrc).not.toContain('unsafe-inline');
    expect(scriptSrc).not.toContain('unsafe-eval');
  });

  it('no permite conectar (exfiltrar datos) con nadie fuera del propio origen', () => {
    expect(csp).toContain("connect-src 'self'");
    expect(csp).not.toMatch(/connect-src[^;]*https?:/);
  });

  it('las fuentes son propias: ni fonts.googleapis.com ni fonts.gstatic.com', () => {
    const fontSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('font-src '));
    expect(fontSrc).toBe("font-src 'self'");
    expect(csp).not.toContain('fonts.gstatic.com');
    expect(csp).not.toContain('fonts.googleapis.com');
  });

  it('las cabeceras de proteccion de navegacion estan presentes', () => {
    expect(header(config, '/(.*)', 'X-Content-Type-Options')).toBe('nosniff');
    expect(header(config, '/(.*)', 'X-Frame-Options')).toBe('DENY');
    expect(header(config, '/(.*)', 'Referrer-Policy')).toBe('no-referrer');

    const permissions = header(config, '/(.*)', 'Permissions-Policy') ?? '';
    expect(permissions).toContain('camera=()');
    expect(permissions).toContain('geolocation=()');
    // el microfono solo para la propia app (reconocimiento de voz local)
    expect(permissions).toContain('microphone=(self)');
  });

  it('los assets versionados se sirven inmutables', () => {
    expect(header(config, '/assets/(.*)', 'Cache-Control')).toBe(
      'public, max-age=31536000, immutable'
    );
  });
});

describe('cero terceros en el arranque', () => {
  it('index.html no referencia ningun origen externo', () => {
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('preconnect');
  });

  it('la hoja de estilos no importa nada de fuera', () => {
    const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
    expect(css).not.toMatch(/@import\s+url\(\s*["']?https?:/);
    expect(css).not.toContain('fonts.googleapis.com');
    expect(css).toContain('@import "./fonts/fonts.css"');
  });
});
