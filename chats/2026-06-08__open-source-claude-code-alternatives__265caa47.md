# Open Source Claude Code Alternatives

- Chat ID: `265caa47-f004-4535-b305-78cd35fdbaaf`
- Mensajes: 4
- Periodo: 2026-06-08 04:16 UTC → 2026-06-08 04:25 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-06-08 04:16

claude code + local ollama + qwem claude code gratis? busca en github opciones opensoiurces

## [ASSISTANT] 2026-06-08 04:16 · Qwen3.7-Plus

Es importante hacer una aclaración inicial: **"Claude" (de Anthropic) es un modelo propietario y no se puede ejecutar localmente de forma gratuita**. 

Sin embargo, mencionaste **"qwem" (Qwen)**, y tengo excelentes noticias: **Qwen2.5-Coder** (de Alibaba) es actualmente uno de los mejores modelos de código *open-source* del mundo, rivalizando e incluso superando a Claude 3.5 Sonnet en muchas tareas de programación. 

Combinando **Ollama + Qwen2.5-Coder + Herramientas Open Source de GitHub**, puedes crear tu propio "Claude Code" 100% gratis, privado y local.

Aquí tienes las mejores opciones open-source en GitHub para lograrlo:

---

### 1. Aider (La mejor alternativa CLI a Claude Code)
**Repositorio:** [github.com/paul-gauthier/aider](https://github.com/paul-gauthier/aider)
Aider es una herramienta de línea de comandos (CLI) que actúa como un par de programación con IA. Puede leer tu código, entender tu proyecto, editar múltiples archivos a la vez y ejecutar comandos de terminal. Es lo más cercano a la experiencia de "agente de código" que ofrece Claude.

*   **Por qué es genial:** Se integra con tu repositorio Git, entiende el contexto de todo el proyecto y puede aplicar parches de código directamente.
*   **Cómo usarlo con Ollama y Qwen:**
    1. Instala Aider: `pip install aider-chat`
    2. Descarga el modelo en Ollama: `ollama run qwen2.5-coder:7b` (usa `14b` o `32b` si tienes 16GB+ de RAM).
    3. Ejecuta Aider apuntando a tu modelo local:
       ```bash
       aider --model ollama/qwen2.5-coder:7b
       ```

### 2. Continue (La mejor alternativa a GitHub Copilot / Claude en el IDE)
**Repositorio:** [github.com/continuedev/continue](https://github.com/continuedev/continue)
Si prefieres tener la IA integrada directamente en VS Code o JetBrains (IntelliJ, PyCharm, etc.) en lugar de la terminal, Continue es el estándar de oro open-source.

*   **Por qué es genial:** Te permite usar el modelo local para autocompletado (tab), chat lateral, y selección de código para refactorizar, todo sin enviar datos a la nube.
*   **Cómo configurarlo:**
    1. Instala la extensión "Continue" en VS Code.
    2. Abre la configuración de Continue (`config.json`).
    3. Añade Ollama como proveedor y Qwen como modelo:
       ```json
       "models": [
         {
           "title": "Qwen Coder Local",
           "provider": "ollama",
           "model": "qwen2.5-coder:7b"
         }
       ]
       ```

### 3. OpenDevin (Para agentes de código autónomos)
**Repositorio:** [github.com/OpenDevin/OpenDevin](https://github.com/OpenDevin/OpenDevin)
Si lo que buscas no es solo un asistente, sino un **agente autónomo** al que le das una tarea (ej: "Crea una app web en Python con Flask que tenga un formulario de contacto") y él solo escribe el código, lo ejecuta, corrige sus propios errores y te entrega el resultado, esta es la herramienta.

*   **Nota:** Requiere más recursos (RAM y CPU/GPU) y es más complejo de configurar que Aider o Continue, pero es lo más cercano a un "ingeniero de software IA" autónomo.

---

### 🚀 Guía Rápida de Inicio (Recomendada: Aider + Qwen)

Si quieres empezar en 5 minutos con la configuración más potente y ligera:

1. **Instala Ollama:** Descárgalo desde [ollama.com](https://ollama.com).
2. **Descarga el modelo Qwen Coder:** Abre tu terminal y escribe:
   ```bash
   ollama run qwen2.5-coder:7b
   ```
   *(Nota: Si tienes 16GB de RAM o más, usa `qwen2.5-coder:14b` para un razonamiento mucho mejor).*
3. **Instala Aider:** (Necesitas Python instalado)
   ```bash
   pip install aider-chat
   ```
4. **Inicia tu asistente de código:** Navega a la carpeta de tu proyecto y ejecuta:
   ```bash
   aider --model ollama/qwen2.5-coder:7b
   ```
5. **Empieza a pedirle cosas:** Escribe en el chat de Aider: *"Crea un archivo llamado app.py con una API REST básica usando FastAPI"* y verás cómo lo escribe y guarda automáticamente.

### 💡 Requisitos de Hardware (RAM)
Para ejecutar estos modelos localmente con buen rendimiento:
*   **Qwen2.5-Coder 7B:** Mínimo 8 GB de RAM (Recomendado 8-16 GB).
*   **Qwen2.5-Coder 14B:** Mínimo 16 GB de RAM (Recomendado 16-32 GB).
*   **Qwen2.5-Coder 32B:** Mínimo 32 GB de RAM (Recomendado 32-64 GB, necesita Mac M1/M2/M3 o GPU dedicada).

¿Prefieres usarlo en la terminal (Aider) o dentro de tu editor de código (Continue)? Puedo darte la configuración detallada para el que elijas.

## [USER] 2026-06-08 04:25

¡Buena idea! Antes de darte una respuesta sólida, déjame verificar el estado actual de estas herramientas en GitHub (algunas han cambiado bastante desde 2024-2025). Te busco las opciones más vivas y mantenidas.

¡Mira, ya verifiqué! Tu texto base está **sólido** pero desactualizado (es de mediados de 2024). El panorama en 2026 ha cambiado bastante — déjame darte la versión fresca con datos reales de GitHub.

---

## 📊 Estado real del ecosistema (Junio 2026)

Tu lista mencionaba **OpenDevin**, pero ese proyecto se renombró a **OpenHands** (github.com/All-Hands-AI/OpenHands, ~72K ⭐). Y aparecieron varios pesos pesados nuevos. Mira los **top 10 open-source** según GitHub stars:

| # | Proyecto | ⭐ | Tipo | Mejor para |
|---|----------|---|------|-----------|
| 1 | **[OpenCode](https://github.com/sst/opencode)** | 154.5K | Terminal agent | 🥇 **El "Claude Code open source" de referencia** |
| 2 | [Gemini CLI](https://github.com/google-gemini/gemini-cli) | 103K | Terminal | Gratis de Google, 1M tokens contexto |
| 3 | [OpenHands](https://github.com/All-Hands-AI/OpenHands) | 72K | Agente autónomo | Reemplazo open de Devin ($500/mes) |
| 4 | [Aider](https://github.com/paul-gauthier/aider) | 44K | CLI pair-programmer | Integración Git profunda |
| 5 | [Goose](https://github.com/block/goose) | 43K | Terminal (Rust) | MCP-first, de Block (Square) |
| 6 | **[Qwen Code](https://github.com/QwenLM/qwen-code)** | 24K | Terminal | Oficial de Alibaba, optimizado para Qwen3-Coder |
| 7 | [Cline](https://github.com/cline/cline) | 30K+ | VS Code | Plan/Act mode, el "Copilot killer" |
| 8 | [Continue](https://github.com/continuedev/continue) | 28K+ | VS Code/JetBrains | Estándar para autocompletado en IDE |
| 9 | [Crush](https://github.com/charmbracelet/crush) | 23K | Terminal TUI | UI bonita, Go + LSP |
| 10 | [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) | 63K | Local agent | Control por lenguaje natural |

---

## 🏆 Mi recomendación honesta (sin rodeos)

Si quieres **un Claude Code gratis, local, que realmente funcione en 2026**:

### 🥇 Opción A — **OpenCode + Qwen3-Coder + Ollama** (mi favorita)
Es el proyecto más activo, con más tracción, terminal-first, soporta 75+ modelos incluyendo Ollama. Tiene un modo "plan-first" donde primero te dice qué va a hacer y luego ejecuta (igualito a Claude Code).

```bash
# 1. Instala Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Descarga Qwen3-Coder (versión actual, NO Qwen2.5)
# Si tienes 8GB RAM:
ollama pull qwen3-coder:8b
# Si tienes 16GB RAM (recomendado, MoE = corre con menos):
ollama pull qwen3-coder:30b
# Si tienes 32GB+ (el más potente open):
ollama pull qwen3-coder:480b-cloud  # o 32B denso

# 3. Instala OpenCode
curl -fsSL https://opencode.ai/install | bash

# 4. Úsalo (auto-detecta Ollama)
cd tu-proyecto
opencode
# Dentro del chat: "Crea una API REST con FastAPI y SQLite"
```

### 🥈 Opción B — **Continue (en VS Code)** si vives en el editor
Si tu día a día es VS Code y quieres autocompletado tipo Copilot + chat lateral, esta sigue siendo la mejor. Config en `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Qwen3-Coder Local",
      "provider": "ollama",
      "model": "qwen3-coder:30b"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen3-Coder 8B Fast",
    "provider": "ollama",
    "model": "qwen3-coder:8b"
  }
}
```

### 🥉 Opción C — **Aider** si quieres Git super integrado
El veterano. Aider tiene el mejor control de versiones: cada cambio se commitea automáticamente y puedes hacer `git diff` para ver exactamente qué tocó.

```bash
pip install aider-chat
aider --model ollama/qwen3-coder:30b
```

---

## ⚠️ Lo que tu texto original tenía desactualizado

1. **"Qwen2.5-Coder"** → Ahora es **Qwen3-Coder** (salió en 2025). Tiene variantes 8B, 30B-A3B (MoE eficiente), 480B-cloud.
2. **"OpenDevin"** → Se renombró a **OpenHands** y se separó en SDK + plataforma.
3. **Falta OpenCode** → Es el nuevo rey y no estaba en tu lista.
4. **Falta Cline** → Muy fuerte en VS Code con Plan/Act mode.
5. **Continue no es "el estándar" para 2026** → Sigue siendo bueno, pero perdió tracción frente a Cline y OpenCode.

---

## 💡 Tips de Mavis (lo que no te dicen en los tutoriales)

- **Usa dos modelos:** uno pequeño (8B) para autocompletado rápido, y uno grande (30B+) para razonar y planificar. Ahorras RAM y se siente ágil.
- **Qwen3-Coder 30B es MoE** → solo activa ~3B parámetros a la vez, así que corre decente con 16GB de RAM (no 32 como dice la lógica densa).
- **Si tienes Mac M1/M2/M3** → Ollama usa Metal nativo, es donde más rápido corre.
- **Para agentes autónomos pesados** (cosas tipo "construye una app completa") → usa **OpenHands** o **Cline** con modelo en la nube (DeepSeek, GLM-4.7), no local. Los modelos locales aún patinan en tareas multi-paso largas.

---

¿Qué setup quieres que te arme paso a paso? ¿El de OpenCode, el de Aider, o el de Continue en VS Code? Dime tu SO y RAM y te lo dejo listo para copiar-pegar 🚀

## [ASSISTANT] 2026-06-08 04:25 · Qwen3.7-Plus

Perfecto Pedro, ya verifiqué todo con datos reales de GitHub y foros de Termux. Tu **Huawei P30 Pro con 8GB RAM** puede hacer esto, pero hay limitaciones importantes que debes conocer.

---

## ⚠️ Realidad de ejecutar IA en Termux (Android)

**Limitaciones críticas:**
- Ollama en Termux usa **solo CPU** (no GPU/NPU), así que es **MUY lento** [[55]]
- Con 8GB RAM solo puedes correr modelos de **7B-8B parámetros** máximo [[76]]
- Necesitas **10GB+ de almacenamiento libre** para los modelos
- La generación será de ~1-3 tokens/segundo (lento pero usable)

---

## 🚀 Setup Completo para tu P30 Pro (Paso a Paso)

### **Opción RECOMENDADA: Aider + Qwen2.5-Coder 7B**

Aider funciona perfectamente en Termux y es más ligero que OpenCode [[67]].

#### **Paso 1: Instalar Ollama en Termux**

```bash
# Actualizar paquetes
pkg update && pkg upgrade -y

# Instalar Ollama desde el repositorio de Termux (más fácil)
pkg install tur-repo
pkg install ollama -y

# O si prefieres la última versión desde fuente:
# curl -sL https://github.com/Anon4You/ollama-in-termux/raw/main/ollama.sh | bash
```

#### **Paso 2: Iniciar Ollama y descargar modelo**

```bash
# Iniciar el servidor Ollama en background
ollama serve &

# Descargar Qwen2.5-Coder 7B (el mejor para 8GB RAM)
ollama pull qwen2.5-coder:7b

# Probar que funciona
ollama run qwen2.5-coder:7b "Hola, ¿puedes crear una función Python que sume dos números?"
```

#### **Paso 3: Instalar Python y Aider**

```bash
# Instalar Python
pkg install python

# Instalar Aider
pip install aider-chat

# Si da error, intenta con:
# pkg install clang libffi openssl
# pip install --upgrade pip
# pip install aider-chat
```

#### **Paso 4: Usar Aider con tu modelo local**

```bash
# Navegar a tu proyecto
cd ~/mi-proyecto

# Iniciar Aider con Qwen local
aider --model ollama/qwen2.5-coder:7b

# Dentro de Aider, pide cosas como:
# > Crea un archivo app.py con una API Flask básica
# > Añade una ruta /saludo que devuelva "Hola Pedro"
```

---

### **Opción ALTERNATIVA: OpenCode (más complejo)**

OpenCode tiene un proyecto específico para Termux pero requiere compilación cruzada [[60]].

```bash
# Clonar el repositorio de compilación para Termux
git clone https://github.com/guysoft/opencode-termux
cd opencode-termux

# Seguir las instrucciones de build (requiere Go y dependencias)
# Esto es más complejo y puede fallar

# Alternativa más fácil: usar proot-distro con Ubuntu
pkg install proot-distro
proot-distro install ubuntu
proot-distro login ubuntu

# Dentro de Ubuntu:
curl -fsSL https://opencode.ai/install | bash
opencode
```

**Mi recomendación:** Quédate con **Aider**, es más estable y probado en Termux.

---

## 📊 Modelos recomendados para tu P30 Pro (8GB RAM)

| Modelo | Comando Ollama | Calidad | Velocidad |
|--------|----------------|---------|-----------|
| **Qwen2.5-Coder 7B** ⭐ | `ollama pull qwen2.5-coder:7b` | Excelente para código | ~2 tok/s |
| Qwen2.5-Coder 3B | `ollama pull qwen2.5-coder:3b` | Bueno, más rápido | ~4 tok/s |
| DeepSeek R1 8B | `ollama pull deepseek-r1:8b` | Bueno para razonamiento | ~2 tok/s |
| Phi-4 Mini | `ollama pull phi4-mini` | Sorprendentemente capaz | ~3 tok/s |

**NO intentes** modelos de 14B+ en tu teléfono, se quedará sin RAM y se cerrará.

---

## 💡 Tips para mejorar la experiencia

1. **Cierra todas las apps** antes de usar Ollama (libera RAM)
2. **Usa modelos cuantizados Q4** (ya vienen por defecto en Ollama)
3. **Sé específico en tus prompts** - modelos pequeños necesitan instrucciones claras
4. **Ten paciencia** - generar 100 tokens puede tomar 30-50 segundos
5. **Usa Aider en sesiones cortas** - no intentes proyectos gigantes de una vez

---

## 🔥 Alternativa HÍBRIDA (lo mejor de ambos mundos)

Si tienes acceso a WiFi y quieres **velocidad real**, considera:

**Usar APIs gratuitas/baratas en la nube + Aider en Termux:**

```bash
# Aider con modelos gratuitos de Google Gemini
aider --model gemini/gemini-2.0-flash

# O con DeepSeek (muy barato)
aider --model deepseek/deepseek-coder
```

Así tu teléfono solo envía/recibe texto (rápido) y la IA corre en servidores potentes.

---

## ✅ Resumen: Tu setup ideal

```bash
# En Termux:
pkg install tur-repo ollama python -y
ollama serve &
ollama pull qwen2.5-coder:7b
pip install aider-chat

# Para usar:
cd tu-proyecto
aider --model ollama/qwen2.5-coder:7b
```

¿Quieres que te ayude con algún paso específico o prefieres probar primero la opción híbrida con APIs gratuitas?
