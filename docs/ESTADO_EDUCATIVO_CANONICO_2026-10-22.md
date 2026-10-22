# Estado educativo canónico — corte 2026-10-22

Este documento distingue **código existente**, **declaraciones en README** y
**verificación pendiente**. No crea repositorios, no mueve ramas y no fusiona
identidades solo porque sus nombres o temáticas se parezcan.

| Repositorio real | Función diferenciada | Evidencia revisada | Pendiente antes de declarar «completo» |
|---|---|---|---|
| `belentani7/open-school` | Instituto digital y entrada al ecosistema | README: 6 rutas previstas; **12 unidades evaluables en main**, tutor local + Ollama opt-in | CI/build y revisión en navegador; PR de Plaza añade **20 unidades** solo si se integra |
| `belentani7/ManosAbiertas` | Acogida, IA, ofimática, CV, derechos | README y scripts de plataforma Next/Prisma | Auditar contenido curso a curso, formularios, accesibilidad, configuración real de hosting |
| `belentani7/WILLIAMSCHOOL` | ESO/Bachillerato, puentes PT/ES/CA y compañero | README declara `curriculum.json` con 205 módulos y 1025 pasos importados de Aprende Brasil; vídeo verificado | No confundir integración de Aprende Brasil con 205 módulos propios; ejecutar `check:modules`, test y build |
| `belentani7/aprende-brasil` | Alfabetización brasileña autónoma | README documenta 205 módulos / 1025 etapas + FastAPI opcional, JSON offline | Pruebas reales de contenido, procedencia y legibilidad; no deduplicar su identidad con WILLIAMSCHOOL |
| `belentani7/linguaforge` | Lenguas MCER y repetición espaciada | README describe 10 idiomas, niveles A1–C2, SRS y fuentes Tatoeba | Verificar cobertura efectiva por par de idiomas: piloto no equivale a corpus completo |
| `belentani7/lingua-aberta` | Variante de aprendizaje de lenguas | README de main es un **template genérico**; package declara React 18 / Vite 5 | Reconstruir contrato de producto desde ramas y compararlo con LinguaForge antes de publicar; no inventar funcionalidades |
| `belentani7/linguaforge-v2` | Variante independiente | Repositorio accesible, 635 KiB reportados | Comparación de árbol/historia/propósito antes de decidir canónico |
| `belentani7/open-school-private` | Histórico archivado | GitHub marca archived | Conservar intacto mientras se comprueba su contenido y derechos |

## Contrato de finalización (por cada **unidad**, no por landing)

1. Objetivo observable y prerrequisitos declarados.
2. Texto didáctico completo, nivel lingüístico adecuado y ejemplo realista.
3. Actividad que la persona puede realizar con recursos accesibles.
4. Evaluación alineada con el objetivo, respuesta explicada y recuperación tras error.
5. Rúbrica o criterio observable para el resultado.
6. Materiales citados con procedencia, fecha y licencia cuando proceda.
7. Alternativa de texto a audio/vídeo e interacción por teclado.
8. Progreso real: no contar «terminado» hasta verificar la actividad.
9. Tutor con límites, consentimiento y protección de datos.
10. Pruebas ejecutadas + enlace vivo que corresponda al proyecto.

## Arquitectura de una plaza común sin destruir los productos

- **Open School** es la plaza y puerta de orientación.
- **ManosAbiertas** conserva los materiales de acogida/empleo/IA y su propia navegación.
- **Aprende Brasil** conserva el corpus y tutor Nilo; WILLIAMSCHOOL puede enlazarlo,
  pero sus métricas deben atribuir qué procede de su plataforma fuente.
- **LinguaForge** es motor de progresión SRS; no copiar bases de frases a cada app.
- El índice solo debe incluir **metadatos públicos revisados**, nunca enumerar
  rutas de repositorios privados ni inventarios sensibles.

## Alcance de la rama Plaza

En `feature/plaza-aprendizaje-modulos-20261022` hay cinco micro-itinerarios
con 20 unidades verificables por cuestionarios breves. Esto **no** convierte
automáticamente en completos los programas extensos existentes.

El «Doctor de aprendizaje» ofrece orientación pedagógica por reglas; no es
médico, no diagnostica trastornos de aprendizaje ni usa IA generativa por sí mismo.
El tutor de `/chat` mantiene su política independiente de consentimiento.

## Evidencia y puertas de publicación

Inspeccionados por conector GitHub: metadata y README/package de los repos
identificados. No se ha ejecutado un `clone --mirror` ni explorado cada rama.
Las URL citadas por los README no se consideran comprobadas por el mero hecho
de estar escritas. El PR debe permanecer **draft** mientras fallen CI, seguridad
y verificación visual o no exista presupuesto de despliegue.
