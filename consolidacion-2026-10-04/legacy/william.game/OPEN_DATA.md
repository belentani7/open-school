# Banco abierto de contenidos

## Fuente seleccionada: Tatoeba

Tatoeba es una colección colaborativa de frases y traducciones, abierta y reutilizable. Su sitio indica que los datos se publican bajo varias licencias Creative Commons, por lo que cada frase debe conservar la atribución y su licencia concreta. La propia organización advierte que las traducciones y audios no están garantizados profesionalmente; por eso el juego usará el banco abierto como inspiración y ampliación revisada, no como contenido ciego.

| Fuente | Uso previsto | Precaución |
|---|---|---|
| [Tatoeba](https://tatoeba.org/en/) | Frases cortas contextualizadas para PT-BR, ES, CA y EN | Mantener atribución/licencia por frase y revisar adecuación educativa |
| [Tatoeba Terms of Use](https://tatoeba.org/en/terms_of_use) | Referencia legal y de calidad | No asumir que todo el contenido tiene la misma licencia ni que todo audio es fiable |
| [Tatoeba API](https://api.tatoeba.org) | Futura importación selectiva | Requiere filtrar por idioma, longitud, tema y licencia antes de mostrar |

## Decisión rápida

Para no hacer lenta la aplicación móvil, la primera mejora mantendrá un pequeño lote curado dentro del frontend, con atribución visible en la sección de créditos. La integración automática del API queda como siguiente paso, porque necesita filtros de seguridad, licencia, duplicados y calidad lingüística.

## Mejoras acumuladas revisadas

Se consolidaron los prompts previos en una sola dirección: interfaz móvil Belentani//OS, ocho minijuegos, microlecciones, Luna como mentora amiga, voz por locale sin fallback universal al español, respuesta visible además de audio, efectos de luz líquida, progreso XP/racha y modo demo para revisión.
