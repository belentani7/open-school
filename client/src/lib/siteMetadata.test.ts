import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { INTRO_LESSONS } from './introLesson';

describe('Open School — metadata visible para buscadores', () => {
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

  it('describe un producto real sin certificados inventados', () => {
    const scripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi)];
    expect(scripts).toHaveLength(1);
    const data = JSON.parse(scripts[0][1]) as Record<string, string>;
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('WebSite');
    expect(data.name).toBe('Open School');
    expect(data.inLanguage).toBe('es');
    expect(data.description).toContain(String(INTRO_LESSONS.length) + ' unidades introductorias');
    expect(JSON.stringify(data).toLowerCase()).not.toMatch(/certificado|matriculados|rating|estudiantes inscritos/);
  });

  it('mantiene titulo, descripcion y un idioma declarados', () => {
    expect(html).toMatch(/<html lang="es">/);
    expect(html).toMatch(/<title>Open School/);
    expect(html).toMatch(/name="description"/);
    expect(html).not.toMatch(/noindex/i);
  });
});
