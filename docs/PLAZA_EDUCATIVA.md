# Plaza Educativa — entrega incremental verificable

## Propósito e identidad
Ampliación **dentro del repositorio existente** `open-school`, no una plataforma duplicada.
Audiencia: personas sin acceso a formación formal, recién llegadas, adolescentes y adultos.
La interfaz conserva la identidad visual, privacidad y accesibilidad existentes del proyecto.

## Lo que esta entrega incorpora
- Ruta `/plaza`, enlazada desde la navegación principal.
- Cinco itinerarios originales de cuatro unidades cada uno: autonomía digital, lengua cotidiana ES/PT, empleo y derechos, IA responsable, salud y orientación segura.
- Cada unidad contiene objetivo explícito, explicación, caso ficticio, ejercicio transferible, pregunta con tres opciones y explicación de respuesta.
- Cada itinerario tiene proyecto final y tres criterios de autoevaluación.
- Progreso local por **unidad contestada correctamente**, sin cuenta, cookies, seguimiento ni endpoint.
- «Doctor de aprendizaje» como **selector de orientación pedagógica por reglas**, no diagnóstico clínico ni alegación de IA generativa.
- Enlace al tutor ya existente en `/chat`, cuyo uso de modelo remoto requiere activación explícita.
- Pruebas de integridad de contenido y de correspondencia de recomendaciones.

## Alcance real (sin métricas inventadas)
**20 unidades breves, no 20 cursos profesionales certificados.** El proyecto final es autoevaluado y no existe emisión de diplomas ni sincronización entre dispositivos.
Las duraciones son orientativas. El contenido educativo sobre salud nunca realiza triaje, prescribe, diagnostica ni almacena síntomas.

## Protección de datos
El cuestionario solo permite seleccionar un objetivo de aprendizaje predefinido.
La clave de `localStorage` es `open-school:plaza:completed:v1`; guarda identificadores de unidades, no texto libre ni datos sanitarios.
Si el almacenamiento está bloqueado, el progreso de la sesión funciona en memoria.

## Comprobaciones reproducibles
```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
corepack pnpm test
corepack pnpm build
```

Validación humana pendiente: navegación móvil con siete enlaces, lector de pantalla,
contraste en estados activos, PWA sin conexión, el ciclo de pregunta incorrecta/correcta,
y que el enlace al tutor nunca habilite un proveedor por sí solo.

## Fuentes pedagógicas y convenciones
El itinerario de IA se alinea conceptualmente con el marco de competencias de estudiantes
de UNESCO (pensamiento crítico, ética, técnicas y diseño). Esta propuesta no afirma
acreditación ni aval de UNESCO:
https://www.unesco.org/en/articles/ai-competency-framework-students

El módulo de salud se limita a alfabetización informacional y preparación de preguntas.
Cualquier guía clínica o jurídica local deberá mantener fecha, territorio y revisión profesional.

## Evolución posterior sin repetir contenidos
1. Consolidar el progreso con las unidades ya existentes de `/courses/:id`, manteniendo
   compatibilidad de claves y opción de borrado.
2. Añadir contenido supervisado por docentes a las rutas más demandadas, con rúbrica,
   procedencia, revisión lingüística PT/ES/CA/EN y control de versiones.
3. Agregar evaluaciones de proyectos con consentimiento, no certificados automáticos.
4. Integrar conectores solo si hay necesidad real y pruebas de privacidad/accesibilidad.

## Estado de verificación
- Código y contenido: **añadidos a rama de trabajo**, sin cambios de visibilidad.
- Pruebas CI, build, verificación visual y despliegue: **pendientes de ejecución**.
- Ningún repo archivado ni variante se ha fusionado, borrado o publicado.
