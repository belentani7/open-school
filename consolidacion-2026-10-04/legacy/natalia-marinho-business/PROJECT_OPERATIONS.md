# Operación del proyecto

Este documento reemplaza los apuntes dispersos. Contiene únicamente la información necesaria para mantener, validar y ampliar la plataforma de Natalia Marinho.

## Estado de la plataforma

La aplicación es un negocio digital bilingüe para **Natty/Natalia en Barcelona**, con home editorial, blog de activismo, prensa y colaboraciones, Método de Presencia, catálogo Shopify, carrito/checkout, captación de leads, reservas con bloqueo backend de franjas, y panel privado de gestión.

La identidad pública debe mantenerse separada de cualquier contenido técnico de PVC-U. Los adjuntos PVC-U/IA fueron clasificados como **material descartado para esta marca**: no aportan relevancia, utilidad ni identidad al negocio de Natalia. No se convierten en copy, productos, datos ni funcionalidades.

## Documentación conservada

| Archivo | Clasificación | Uso |
|---|---|---|
| `README.md` | Operativo | Arquitectura, desarrollo y convenciones del scaffold. |
| `PROJECT_OPERATIONS.md` | Operativo consolidado | Estado real, decisiones ejecutables y validación mínima. |
| `references/shopify.md` | Técnico operativo | Integración Storefront/Shopify y restricciones del scaffold. |
| `todo.md` | Control de ejecución | Historial de requisitos, bloqueadores y tareas pendientes. |

Los antiguos planes de negocio, calendarios, auditorías y revisiones de adjuntos fueron **redundantes como archivos independientes**. Su información accionable queda resumida aquí o permanece trazable en `todo.md`; no se mantienen copias paralelas.

## Reglas de ejecución

No se inventan testimonios, pedidos, ingresos, credenciales, disponibilidad, datos de campo ni resultados de clientes. La tienda utiliza únicamente los procedimientos `commerce.*` y el contexto de carrito existente. Las reservas se validan en backend y la base de datos impide duplicados.

Las integraciones externas pendientes —email transaccional, fulfillment privado de productos digitales y Shopify Admin API para pedidos— solo se activan con credenciales y autorizaciones reales. Storefront no se presenta como Admin API. Los testimonios solo se publican cuando Natalia entregue autorizaciones verificables.

## Validación mínima antes de guardar cambios

```text
pnpm check
pnpm test
pnpm build
pnpm audit --prod
```

También deben comprobarse las rutas públicas `/`, `/blog`, `/prensa` y `/metodo`, y el acceso protegido de `/gestion`. Cualquier mejora se aplica solo si tiene evidencia verificable en código, tests, build, auditoría, navegador o métricas reproducibles.

## Auditoría honesta

La reauditoría posterior a la limpieza y a la validación compartida queda trazada así:

| Dimensión | Evidencia posterior a los cambios | Resultado real |
|---|---|---|
| Backend | Contratos compartidos en `shared/validation.ts`, 4 tests nuevos y check/build correctos. | Mejorado; no 10/10 por integraciones externas pendientes. |
| Frontend | Cinco rutas capturadas después de los cambios; lazy loading y chunks separados conservados. | Verificado; Lighthouse previo mantiene oportunidades de contraste y LCP. |
| Utilidad | Flujo de leads, reservas, colaboraciones, Shopify y panel operativo comprobados. | Verificado en el alcance disponible. |
| Relevancia | PVC-U/IA excluido de la marca; posicionamiento Natty en Barcelona intacto. | Verificado. |
| Potencial | Embudo, ofertas, captación y reservas reales conservados; pedidos Admin no disponibles. | Verificado parcialmente. |
| Identidad | Documentación pública consolidada alrededor de Natalia/Natty; no se mezclan adjuntos técnicos. | Verificado. |

La versión máxima demostrable no debe declararse 60/60 mientras sigan pendientes las integraciones externas, la evidencia de campo y las mejoras restantes de rendimiento/accesibilidad. El repositorio GitHub nuevo solo se crea cuando la auditoría alcance realmente 10/10 en las seis dimensiones.

## Próxima ejecución

La prioridad es corregir errores reales de entorno o producto, no añadir documentación. Después de cada cambio se ejecutan las validaciones mínimas y se actualiza `todo.md` con una sola línea verificable.

## Dirección visual 2026 aplicada

La investigación actual confirma tres líneas útiles para esta marca: **tipografía editorial contundente**, **profundidad ligera tipo vidrio** y **animación ligada al scroll mediante CSS**, evitando WebGL pesado y efectos que oculten contenido. Figma recoge en su panorama 2026 la tipografía fuerte, el movimiento y la profundidad como tendencias relevantes; la API `animation-timeline: view()` permite animaciones de entrada sin JavaScript adicional.

Para imágenes de terceros, las fuentes de referencia son [Unsplash](https://unsplash.com/license) y [Pexels](https://www.pexels.com/license/). Sus licencias permiten uso comercial bajo condiciones; aun así, no se incorporan imágenes de búsqueda directamente sin verificar autoría, contexto de personas identificables y licencia del activo concreto. La plataforma conserva como activos principales las imágenes editoriales ya autorizadas.

La aplicación inmediata es deliberadamente ligera: `content-visibility` para secciones fuera de pantalla, composición editorial crema/negro/dorado, profundidad por capas y animaciones transform/opacity compatibles con `prefers-reduced-motion`. No se añade una librería de efectos ni un banco de imágenes externo al bundle hasta disponer de un activo seleccionado y documentado.

### Medición posterior de rendimiento

Lighthouse se ejecutó después del efecto scroll-driven y de priorizar/precargar la imagen hero. El resultado reproducible fue: rendimiento **0,55**, accesibilidad **0,88**, buenas prácticas **0,82**, SEO **1,00**, FCP **13,3 s**, LCP **23,2 s** y CLS **0,001**. La puntuación no mejoró frente a la línea base anterior; por tanto, el efecto se conserva como mejora de identidad progresiva y no se presenta como una optimización cuantitativa de rendimiento. El siguiente salto de LCP requiere optimización real del activo hero o infraestructura de entrega, no más efectos CSS.
