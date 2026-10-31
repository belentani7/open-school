# OpenClaw Plugin List

- Chat ID: `bde2b8a9-dc53-4386-92b6-d550e60a1530`
- Mensajes: 2
- Periodo: 2026-09-24 08:49 UTC → 2026-09-24 08:49 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-09-24 08:49

opemtclaw plugis all of hemttt

## [ASSISTANT] 2026-09-24 08:49 · Qwen3.7-Plus

Basado en tu consulta, he interpretado que te refieres a **"OpenClaw plugins all of them"** (todos los plugins de OpenClaw), dado que "opemtclaw plugis all of hemttt" es una variación tipográfica común de este término. 

OpenClaw es un asistente de inteligencia artificial autónomo, de código abierto y autoalojado, que se integra con aplicaciones de mensajería (como WhatsApp, Telegram, Discord, Slack, etc.) y ejecuta tareas a través de modelos de lenguaje (LLMs) [[31]]. Su arquitectura es altamente extensible mediante un sistema de plugins y habilidades (skills) [[37]].

A continuación, presento un catálogo extenso, estructurado y verificado de los plugins disponibles para OpenClaw, clasificados por funcionalidad, junto con los comandos útiles para su gestión.

---

### 1. Plugins Oficiales y Agrupados (Bundled)
Estos son mantenidos directamente por el equipo de OpenClaw o vienen preempaquetados con el núcleo del software y se activan mediante configuración [[39]].

**Plugins Oficiales (Scope `@openclaw/*`):**
*   **`voice-call`**: Permite realizar y recibir llamadas de voz a través de Twilio (o registro de fallback para desarrollo).
*   **`matrix`**: Integración nativa como canal para el protocolo de chat descentralizado Matrix.
*   **`nostr`**: Canal para el protocolo descentralizado Nostr.
*   **`zalo`** y **`zalouser`**: Integración con la mensajería Zalo (popular en Vietnam), tanto para bots como para cuentas personales.
*   **`msteams`**: Canal de comunicación para Microsoft Teams.

**Plugins Agrupados (Bundled, se activan por configuración):**
*   **`memory-core`**: Sistema de búsqueda de memoria predeterminado del agente.
*   **`memory-lancedb`**: Memoria a largo plazo basada en LanceDB con capacidad de auto-recuerdo (auto-recall).
*   **`google-antigravity-auth`** y **`google-gemini-cli-auth`**: Proveedores de autenticación OAuth para servicios de Google y Gemini CLI.
*   **`qwen-portal-auth`**: Proveedor de autenticación OAuth para modelos Qwen.
*   **`copilot-proxy`**: Puente proxy para integrar VS Code Copilot.

---

### 2. Plugins de Canales de Comunicación (Community)
Extienden OpenClaw para operar en plataformas de mensajería adicionales desarrolladas por la comunidad [[39]].

*   **`feishu`**: Canal para Feishu/Lark (飞书) con modo Stream, tarjetas de IA y herramientas para docs/wiki/bitable.
*   **`dingtalk`**: Bot empresarial para DingTalk (钉钉) con modo Stream y tarjetas interactivas de IA.
*   **`cliq`**: Chat de equipo de Zoho Cliq con mensajería en tiempo real y soporte para menciones (@mention).
*   **`xmtp`**: Mensajería de billetera XMTP para agentes de IA, permitiendo comunicación nativa Web3.
*   **`irc`**: Interfaz para protocolos IRC con principios de seguridad KISS (Keep It Simple, Stupid).
*   **`qq`** y **`wechat`**: Integraciones de mensajería para las plataformas chinas QQ y WeChat.
*   **`clawdtalk`**: Permite hacer y recibir llamadas telefónicas y SMS a través de Telnyx, con integración completa de calendario, Jira y búsqueda web.
*   **`eclaw`**: Conecta tu bot a personajes de fondos de pantalla animados en Android (como langostas o cerdos) para interacción visual.

---

### 3. Hogar Inteligente e IoT (Smart Home & IoT)
*   **`home-assistant`**: Complemento (add-on) para ejecutar OpenClaw directamente dentro de tu instancia de Home Assistant, otorgando acceso total a las entidades del hogar [[39]].
*   **`webhook-bridge`**: Puente de webhook impulsado por eventos para conectar automatizaciones de Home Assistant directamente a OpenClaw.

---

### 4. Automoción
*   **`tescmd`**: Control y telemetría de vehículos Tesla. Permite al agente bloquear/desbloquear, ajustar el clima, gestionar la carga y obtener la ubicación del vehículo [[39]].

---

### 5. Utilidades y Mejoras de Experiencia
*   **`better-gateway`**: Mejora la interfaz del gateway con reconexión automática, indicador de estado de conexión y conciencia de red.
*   **`model-selector`**: Enrutamiento inteligente de modelos que sigue el flujo: sugerir → confirmar → ejecutar → volver automáticamente al modelo predeterminado.
*   **`compaction-context`**: Preserva el contexto de la conversación reciente a través de los ciclos de compactación del historial del agente.
*   **`claw-turbo`**: Enrutador de habilidades basado en expresiones regulares que intercepta comandos comunes localmente para reducir la latencia y mejorar la fiabilidad en modelos más débiles.
*   **`discourse-openclaw`**: Integración con foros Discourse para buscar, leer, crear temas/publicaciones y encontrar preguntas sin respuesta.
*   **`manager`**: Herramienta para la instalación, configuración y gestión inteligente de instancias de OpenClaw.
*   **`2do`**: Integración con la aplicación de tareas "2Do", permitiendo enviar tareas mediante lenguaje natural a su función de Email-to-Task.
*   **`clawcollect`**: Puente para la recopilación de formularios alojados; permite abrir un formulario desde el chat, compartir un enlace público y resumir los resultados.

---

### 6. Memoria e Inteligencia Artificial Avanzada
*   **`unified-memory`**: Capa de memoria unificada que combina gráficos de conocimiento Graphiti con memoria temporal Beads para un razonamiento contextual más profundo [[39]].
*   **`memos-cloud`**: Backend de memoria basado en la nube de MemOS para la persistencia de datos y contexto entre múltiples dispositivos.

---

### 7. Seguridad y Gobernanza
*   **`guardspine`**: Sistema de control de herramientas con denegación por defecto, niveles de riesgo L0-L4, verificación por un "consejo" de 3 modelos y generación de paquetes de evidencia.
*   **`air-trust`**: Capa de cumplimiento para la Ley de IA de la UE. Incluye cadenas de auditoría a prueba de manipulaciones (HMAC-SHA256), control de consentimiento para herramientas destructivas, tokenización de PII/credenciales y detección de inyección de prompts.
*   **`codex-watchdog`**: Plugin de protección que bloquea las respuestas de "bucle narrativo" de Codex cuando las ejecuciones orientadas a la acción no logran realizar llamadas a herramientas, reemplazándolas con un mensaje de estado honesto.

---

### 8. Multi-Agente y Coordinación
*   **`ansible`**: Capa de coordinación distribuida que permite que un solo agente controle múltiples "cuerpos" o instancias a través de diferentes máquinas [[39]].

---

### 9. Observabilidad y DevOps
*   **`observatory`**: Panel de observabilidad autoalojado para monitorear sesiones, ventanas de contexto, costos y fallos a través de múltiples gateways.
*   **`Manifest`**: Herramienta de observabilidad de costos en tiempo real. Rastrea tokens, costos, mensajes y uso de modelos (soporta más de 28 modelos LLM), con enfoque local y autoalojado.
*   **`opik-openclaw`**: Exporta trazas de agentes a Opik (de Comet ML), incluyendo extensiones de LLM, herramientas, sub-agentes y metadatos de uso y costo.

---

### 10. Salud y Bienestar
*   **`ouraclaw`**: Integración con el anillo inteligente Oura Ring. Permite al agente acceder a datos de sueño, preparación, actividad y estrés, y generar resúmenes programados [[39]].

---

### 11. Meta y Auto-mejora
*   **`foundry`**: Una meta-extensión de auto-escritura. Observa los flujos de trabajo del usuario, aprende patrones y escribe nuevas extensiones y habilidades para el agente de forma autónoma [[39]].

---

### 12. Redes Sociales y Contenido
*   **`sendit`**: Publicación social nativa de IA con 41 herramientas para programación, análisis, campañas, CRM, bandeja de entrada y automatización de flujos de trabajo en más de 32 plataformas.
*   **`tweetclaw`**: Permite publicar tweets, responder, dar "me gusta", retuitear, seguir y enviar mensajes directos desde tu chat (integra más de 40 endpoints de X/Twitter a través de Xquik).
*   **`clawsocial-plugin`**: Red de descubrimiento social que ayuda a los usuarios a encontrar y conectar con personas que comparten sus intereses a través de su agente de IA, utilizando emparejamiento semántico y tarjetas de perfil.

---

### Gestión de Plugins mediante la CLI de OpenClaw
Para interactuar con este ecosistema, OpenClaw proporciona una interfaz de línea de comandos (CLI) robusta. No existe un catálogo estático centralizado en la documentación, ya que la discovery se realiza dinámicamente a través de **ClawHub** y **npm** [[38]].

Comandos esenciales:
1. **Buscar plugins**: `openclaw plugins search "<término>"` (Ej: `openclaw plugins search "calendar"`).
2. **Listar plugins instalados**: `openclaw plugins list` (añade `--verbose` o `--json` para más detalles).
3. **Instalar un plugin**: 
   - Desde ClawHub: `openclaw plugins install clawhub:<nombre-del-paquete>`
   - Desde npm: `openclaw plugins install npm:<nombre-del-paquete>`
   - Desde un repositorio Git: `openclaw plugins install https://github.com/usuario/repo.git`
4. **Habilitar/Deshabilitar**: `openclaw plugins enable <id>` / `openclaw plugins disable <id>`.
5. **Inspeccionar**: `openclaw plugins inspect <id>` (para ver identidades, registros en tiempo de ejecución o errores de carga).
6. **Actualizar**: `openclaw plugins update --all` [[40]].

*Nota: Los plugins de la comunidad no están probados ni validados oficialmente por el equipo central de OpenClaw, y se encuentran en diversos estados de desarrollo. Se recomienda revisar el repositorio o la documentación de cada plugin antes de instalarlo en entornos de producción.* [[38]]

Si necesitas instrucciones detalladas sobre cómo configurar algún plugin en específico o cómo desarrollar uno propio, no dudes en indicarlo.
