import { describe, expect, it } from 'vitest';
import { answer } from './Chat';

describe('tutor local — hechos y limites', () => {
  it('no afirma emitir certificados que no existen', () => {
    const reply = answer('¿Qué ruta da certificado?');
    expect(reply.text).toContain('todavía no emite ni verifica certificados');
    expect(reply.text).not.toContain('emiten certificado con código');
  });
  it('no diagnostica ni recomienda un tratamiento individual', () => {
    for (const input of ['¿Qué diagnóstico tengo?', '¿Debo cambiar mi tratamiento?', 'Tengo síntomas']) {
      const text = answer(input).text;
      expect(text).toContain('no diagnostico');
      expect(text).toContain('profesionales sanitarios');
    }
  });
  it('no promete programas completos ni reconocimiento de voz local sin evidencias', () => {
    const secure = answer('seguridad digital').text;
    expect(secure).toContain('unidades introductorias publicadas');
    expect(secure).toContain('todavía no están disponibles');
    expect(secure).not.toContain('funciona sin conexión');
    const languages = answer('quiero aprender portugués').text;
    expect(languages).toContain('motor de voz completo está pendiente');
    expect(languages).not.toContain('el audio no se sube');
  });
  it('distingue diseño offline de disponibilidad offline verificada', () => {
    const reply = answer('¿Puedo usarlo sin internet?').text;
    expect(reply).toContain('disponibilidad offline real depende');
    expect(reply).not.toContain('siguen funcionando sin conexión');
  });
  it('mantiene el modo privado por defecto en las respuestas de privacidad', () => {
    expect(answer('¿Guardáis mis datos?').text).toContain('este dispositivo');
  });
});
