# NicheLang: Diseño de Interfaz Móvil

## Visión General
Aplicación móvil para aprender idiomas especializados por nichos profesionales (logística, medicina, ventas, turismo, etc.). Diseño enfocado en **una sola mano**, **orientación vertical (9:16)**, siguiendo estándares iOS HIG con interactividad fluida y gamificación.

---

## Pantallas Principales

### 1. **Onboarding / Bienvenida**
- Presentación visual del concepto: "Aprende idiomas en tu profesión"
- Selector de idioma base (ES, EN, FR, DE, PT)
- Selector de idioma objetivo (ES, EN, FR, DE, PT, ZH, JA)
- Botón "Comenzar" → Pantalla de selección de nicho

### 2. **Selección de Nicho**
- Grid de 6-8 tarjetas con iconos:
  - 🚚 Logística (shipping, tracking, customs)
  - 💊 Medicina (diagnóstico, medicamentos, síntomas)
  - 💼 Ventas (pitch, negociación, cierre)
  - ✈️ Turismo (reservas, recomendaciones, quejas)
  - 🏗️ Construcción (materiales, seguridad, planos)
  - 🍽️ Gastronomía (recetas, ingredientes, técnicas)
  - 📱 Tecnología (desarrollo, soporte, APIs)
  - 💰 Finanzas (inversión, crédito, impuestos)
- Cada tarjeta muestra: ícono, nombre, "X lecciones"
- Selección múltiple permitida (usuario puede estudiar varios nichos)

### 3. **Home / Dashboard**
- **Header**: Saludo personalizado + nivel actual + racha (streak)
- **Sección "Hoy"**: 
  - Tarjeta destacada con lección recomendada del día
  - Progreso visual (barra de progreso diario)
  - Botón "Comenzar lección"
- **Sección "Mis Nichos"**: 
  - Carrusel horizontal de nichos suscritos
  - Cada nicho muestra: ícono, nombre, % completado, próxima lección
- **Sección "Estadísticas"**: 
  - Tarjeta con: días seguidos, palabras aprendidas, lecciones completadas
- **Tab bar inferior**: Home, Lecciones, Progreso, Perfil

### 4. **Pantalla de Lecciones**
- **Header**: Nombre del nicho + filtros (Todas, Nuevas, Favoritas)
- **Lista de lecciones** (FlatList):
  - Cada lección: 
    - Ícono de estado (bloqueada 🔒, disponible ✓, completada ✅)
    - Título + descripción corta
    - Duración estimada (5-15 min)
    - Barra de progreso (si está en curso)
    - Botón "Continuar" o "Comenzar"
- **Buscador**: Filtrar por palabra clave

### 5. **Pantalla de Lección (Contenido)**
- **Header**: Nicho + Lección N/Total + Botón cerrar
- **Contenido modular** (ScrollView):
  - **Introducción**: Contexto real (ej: "Necesitas enviar un paquete urgente a Alemania")
  - **Vocabulario**: Tarjetas interactivas (frente/reverso, pronunciación)
  - **Diálogo**: Conversación bilingüe con audio (tap para escuchar)
  - **Ejercicio interactivo**: 
    - Opción múltiple
    - Completar la frase
    - Emparejar palabras
    - Escribir respuesta
  - **Resumen**: Palabras clave aprendidas
- **Botones inferiores**: 
  - "Anterior" (disabled si es primera sección)
  - "Siguiente" o "Completar lección"

### 6. **Pantalla de Progreso / Estadísticas**
- **Gráfico de actividad**: Heatmap de últimos 30 días (verde = completado)
- **Estadísticas globales**:
  - Palabras aprendidas (total)
  - Lecciones completadas
  - Tiempo invertido
  - Racha actual (días)
- **Desglose por nicho**: 
  - Tabla con: Nicho, Lecciones completadas/Total, % avance
- **Logros/Badges**: 
  - "Primer día" ✓
  - "Racha de 7 días" 🔥
  - "100 palabras" 🎓

### 7. **Pantalla de Perfil**
- **Avatar + Nombre + Email**
- **Opciones**:
  - Cambiar idioma base/objetivo
  - Gestionar nichos (agregar/remover)
  - Preferencias de notificaciones
  - Descargar datos (GDPR)
  - Eliminar cuenta (GDPR)
- **Información legal**: Privacidad, Términos, Acerca de

---

## Flujos de Usuario Principales

### Flujo 1: Primer Uso (Onboarding)
1. Pantalla de bienvenida
2. Seleccionar idiomas (base + objetivo)
3. Seleccionar nichos iniciales
4. Ir a Home → Lección del día

### Flujo 2: Aprender una Lección
1. Home → Tarjeta destacada o Lecciones
2. Seleccionar lección
3. Recorrer módulos (vocabulario → diálogo → ejercicio)
4. Completar lección → Notificación de éxito
5. Volver a Home (racha actualizada)

### Flujo 3: Seguimiento de Progreso
1. Home → Tab "Progreso"
2. Ver heatmap, estadísticas, logros
3. Opcional: Compartir racha en redes (botón compartir)

### Flujo 4: Procesos en Segundo Plano
1. App en background → Notificación diaria (9:00 AM)
2. Usuario abre → Lección recomendada basada en nicho menos estudiado
3. Sincronización automática de progreso (si hay conexión)
4. Actualización de racha (medianoche UTC)

---

## Componentes de Interactividad

### Tarjetas de Vocabulario
- Frente: Palabra en idioma objetivo
- Reverso: Traducción + pronunciación + ejemplo
- Tap para voltear, swipe para siguiente
- Botón ❤️ para marcar como favorita

### Diálogos Interactivos
- Conversación bilingüe lado a lado
- Tap en palabra → Tooltip con definición
- Botón 🔊 para reproducir audio (con control de velocidad: 0.75x, 1x, 1.25x)

### Ejercicios
- **Opción múltiple**: 4 opciones, feedback inmediato (✓ correcto / ✗ incorrecto)
- **Completar frase**: Campo de texto con sugerencias (autocomplete)
- **Emparejar**: Drag-and-drop de palabras
- **Escribir**: Reconocimiento de voz (opcional) o teclado

### Gamificación
- Barra de progreso diario (visual)
- Racha en días (contador + ícono 🔥)
- Badges/Logros desbloqueables
- Sonido/Haptic feedback al completar ejercicio

---

## Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Primario | #0A7EA4 (Azul profesional) | Botones, headers, acentos |
| Secundario | #FF6B35 (Naranja energético) | Racha, notificaciones, logros |
| Éxito | #22C55E (Verde) | Ejercicio correcto, lección completada |
| Error | #EF4444 (Rojo) | Ejercicio incorrecto, errores |
| Fondo | #FFFFFF (Blanco) / #151718 (Gris oscuro) | Modo claro/oscuro |
| Superficie | #F5F5F5 / #1E2022 | Tarjetas, contenedores |
| Texto primario | #11181C / #ECEDEE | Títulos, cuerpo |
| Texto secundario | #687076 / #9BA1A6 | Subtítulos, metadatos |

---

## Tipografía

- **Títulos (H1)**: 32px, Bold, Spacing -0.5px
- **Subtítulos (H2)**: 24px, SemiBold
- **Cuerpo (Body)**: 16px, Regular, LineHeight 1.5
- **Pequeño (Caption)**: 12px, Regular, Color secundario
- **Monoespaciado** (Código/Términos técnicos): SF Mono / Courier

---

## Comportamiento en Segundo Plano

### Notificaciones Locales
- **Diaria**: 9:00 AM - "¿Listo para aprender hoy?"
- **Racha en riesgo**: Si no estudia en 24h - "¡No pierdas tu racha! 🔥"
- **Logro desbloqueado**: Al completar badge

### Sincronización
- Cada 5 minutos (si hay conexión): Enviar progreso al servidor
- Al abrir app: Descargar lecciones nuevas si existen
- Almacenamiento local: AsyncStorage + SQLite para datos offline

### Actualizaciones de Progreso
- Racha se actualiza a medianoche (UTC)
- Contador de "días seguidos" se resetea si no hay actividad en 24h
- Estadísticas se recalculan en tiempo real

---

## Accesibilidad

- **Contraste**: Ratio mínimo 4.5:1 para texto
- **Tamaño de toque**: Mínimo 44x44 pt
- **VoiceOver/TalkBack**: Todas las imágenes con alt text
- **Modo oscuro**: Soportado automáticamente
- **Tipografía dinámica**: Respeta tamaño de fuente del sistema

---

## Consideraciones de Rendimiento

- **Imágenes**: WebP optimizado, lazy loading
- **Listas**: FlatList con `maxToRenderPerBatch={10}`
- **Audio**: Precarga de archivos pequeños, streaming para largos
- **Almacenamiento**: Límite de 50 MB de datos locales
- **Modo lite**: Desactiva animaciones en conexiones lentas (2G/3G)

---

## Seguridad & Privacidad (GDPR)

- **Consentimiento explícito**: Primer uso pide permiso para datos
- **Derecho al olvido**: Botón "Eliminar cuenta" borra todo en 30 días
- **Encriptación local**: AsyncStorage encriptado en iOS/Android
- **Sin tracking**: No se envían datos de comportamiento a terceros
- **Datos mínimos**: Solo se almacena: idiomas, nichos, progreso, email (opcional)

