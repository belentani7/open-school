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
  it('mantiene el modo privado por defecto en las respuestas de privacidad', () => {
    expect(answer('¿Guardáis mis datos?').text).toContain('este dispositivo');
  });
});
