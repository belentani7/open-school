# CANON — Open School

> Estado: documental; no certifica estado verde. Observación de producto anterior: 2026-10-15.

## Misión
Campus abierto y gratuito con rutas educativas, contenidos reutilizables y acceso sin barreras.

## Arquitectura observada
TypeScript/Vite con client, campus, assets, docs, tests, package.json, lockfiles y workflows. Hay separación entre experiencia, contenido y tooling.

## Producto
Catálogo, biblioteca, escuelas, dashboard y chat aparecen en la experiencia pública observada. Las cifras de módulos, horas o idiomas permanecen sin verificar hasta derivarlas del catálogo.

## Seguridad y privacidad
No incluir perfiles reales, secretos ni binarios contaminantes. Revisar seeds, assets y ZIP antes de decidir eliminación. Borrar del árbol no limpia el historial.

## Decisión
Producto CORE de educación abierta. Puede integrarse con un LMS mediante exportación documentada, pero no se reemplaza sin migración y pruebas de equivalencia.
