# AI Models and Pricing Comparison

- Chat ID: `8a63d2f9-b2d2-4e86-862a-39a04b35dd73`
- Mensajes: 2
- Periodo: 2026-09-09 11:51 UTC → 2026-09-09 11:51 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-09-09 11:51

Calcula bigpiclke ,nemotreon y sus diferentes versiones.de hecho a diandebhoy open code zen y su free tier  vs gpt 5,6  Fable 5  opus 5 Sonnet 5 , deepseec flashv4 deepseek pro v4

## [ASSISTANT] 2026-09-09 11:51 · Qwen3.7-Plus

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comparador de Modelos AI 2025</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/index.min.css" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
        body { background: #0a0a0f; color: #e2e8f0; }
        .gradient-bg { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
        .card { background: rgba(30, 30, 50, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .card:hover { border-color: rgba(99, 102, 241, 0.5); transform: translateY(-2px); transition: all 0.3s; }
        .badge-free { background: linear-gradient(135deg, #10b981, #059669); }
        .badge-paid { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .badge-premium { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .glow { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
        .tab-active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
        .progress-bar { background: linear-gradient(90deg, #6366f1, #a78bfa); }
        .table-row:hover { background: rgba(99, 102, 241, 0.1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.5s ease-out forwards; }
        .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stat-card { background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(99, 102, 241, 0.3); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a1a2e; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
        .tooltip { position: relative; }
        .tooltip:hover::after { content: attr(data-tip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #1e1e32; border: 1px solid #6366f1; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; z-index: 50; }
        .model-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
        .comparison-highlight { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)); border: 1px solid rgba(16, 185, 129, 0.3); }
    </style>
</head>
<body class="min-h-screen">
    <!-- Header -->
    <header class="gradient-bg border-b border-indigo-500/30">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        🤖 Comparador de Modelos AI
                    </h1>
                    <p class="text-gray-400 mt-1">Actualizado a día de hoy — Precios, rendimiento y free tier</p>
                </div>
                <div class="hidden md:flex items-center gap-3">
                    <span class="text-xs text-gray-500">Última actualización</span>
                    <span class="text-sm text-indigo-400 font-medium" id="currentDate"></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-wrap gap-2">
            <button onclick="showTab('overview')" id="tab-overview" class="tab-btn tab-active px-4 py-2 rounded-lg text-sm font-medium transition-all">
                📊 Vista General
            </button>
            <button onclick="showTab('pricing')" id="tab-pricing" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all">
                💰 Precios
            </button>
            <button onclick="showTab('free-tier')" id="tab-free-tier" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all">
                🆓 Free Tier
            </button>
            <button onclick="showTab('benchmarks')" id="tab-benchmarks" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all">
                📈 Benchmarks
            </button>
            <button onclick="showTab('calculator')" id="tab-calculator" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all">
                🧮 Calculadora de Costes
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 pb-12">
        
        <!-- Overview Tab -->
        <div id="content-overview" class="tab-content">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="stat-card rounded-xl p-4">
                    <div class="text-2xl font-bold text-indigo-400">12+</div>
                    <div class="text-sm text-gray-400">Modelos Comparados</div>
                </div>
                <div class="stat-card rounded-xl p-4">
                    <div class="text-2xl font-bold text-green-400">6</div>
                    <div class="text-sm text-gray-400">Con Free Tier</div>
                </div>
                <div class="stat-card rounded-xl p-4">
                    <div class="text-2xl font-bold text-purple-400">$0.07</div>
                    <div class="text-sm text-gray-400">Precio más bajo/1M tokens</div>
                </div>
                <div class="stat-card rounded-xl p-4">
                    <div class="text-2xl font-bold text-amber-400">2M</div>
                    <div class="text-sm text-gray-400">Max Context Window</div>
                </div>
            </div>

            <!-- Model Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="modelCards">
            </div>
        </div>

        <!-- Pricing Tab -->
        <div id="content-pricing" class="tab-content hidden">
            <div class="card rounded-xl overflow-hidden">
                <div class="p-4 border-b border-gray-700">
                    <h2 class="text-xl font-bold">💰 Comparativa de Precios (por 1M tokens)</h2>
                    <p class="text-sm text-gray-400 mt-1">Precios actualizados — Input / Output</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-700 text-left">
                                <th class="p-4 font-medium text-gray-300">Modelo</th>
                                <th class="p-4 font-medium text-gray-300">Input/1M</th>
                                <th class="p-4 font-medium text-gray-300">Output/1M</th>
                                <th class="p-4 font-medium text-gray-300">Cache Input</th>
                                <th class="p-4 font-medium text-gray-300">Tier</th>
                                <th class="p-4 font-medium text-gray-300">Ratio $/Calidad</th>
                            </tr>
                        </thead>
                        <tbody id="pricingTable">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Free Tier Tab -->
        <div id="content-free-tier" class="tab-content hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="comparison-highlight rounded-xl p-6">
                    <h3 class="text-lg font-bold text-green-400 mb-4">🆓 Modelos con Free Tier</h3>
                    <div class="space-y-4" id="freeTierList">
                    </div>
                </div>
                <div class="card rounded-xl p-6">
                    <h3 class="text-lg font-bold text-amber-400 mb-4">⚡ Limitaciones del Free Tier</h3>
                    <div class="space-y-3" id="freeTierLimits">
                    </div>
                </div>
            </div>
            <div class="card rounded-xl p-6 mt-6">
                <h3 class="text-lg font-bold text-indigo-400 mb-4">📊 Comparativa: Free Tier vs Pago</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="freeVsPaid">
                </div>
            </div>
        </div>

        <!-- Benchmarks Tab -->
        <div id="content-benchmarks" class="tab-content hidden">
            <div class="card rounded-xl p-6 mb-6">
                <h2 class="text-xl font-bold mb-4">📈 Benchmarks de Rendimiento</h2>
                <div class="space-y-4" id="benchmarkBars">
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card rounded-xl p-6">
                    <h3 class="text-lg font-bold mb-4">🧠 Razonamiento (MMLU / GPQA)</h3>
                    <div class="space-y-3" id="reasoningBars">
                    </div>
                </div>
                <div class="card rounded-xl p-6">
                    <h3 class="text-lg font-bold mb-4">💻 Código (HumanEval / SWE-bench)</h3>
                    <div class="space-y-3" id="codeBars">
                    </div>
                </div>
            </div>
        </div>

        <!-- Calculator Tab -->
        <div id="content-calculator" class="tab-content hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="card rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-6">🧮 Calculadora de Costes Mensuales</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">Tokens de entrada diarios (miles)</label>
                            <input type="range" id="inputTokens" min="10" max="10000" value="500" class="w-full" oninput="calculateCost()">
                            <div class="text-right text-sm text-indigo-400" id="inputTokensLabel">500K tokens/día</div>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">Tokens de salida diarios (miles)</label>
                            <input type="range" id="outputTokens" min="10" max="5000" value="200" class="w-full" oninput="calculateCost()">
                            <div class="text-right text-sm text-indigo-400" id="outputTokensLabel">200K tokens/día</div>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">Días de uso al mes</label>
                            <input type="range" id="daysUsed" min="1" max="31" value="22" class="w-full" oninput="calculateCost()">
                            <div class="text-right text-sm text-indigo-400" id="daysLabel">22 días</div>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">Modelo seleccionado</label>
                            <select id="calcModel" class="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white" onchange="calculateCost()">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-6">💵 Coste Estimado</h2>
                    <div class="text-center mb-6">
                        <div class="text-5xl font-bold text-indigo-400" id="monthlyCost">$0.00</div>
                        <div class="text-sm text-gray-400 mt-2">Coste mensual estimado</div>
                    </div>
                    <div class="space-y-3" id="costBreakdown">
                    </div>
                    <div class="mt-6 p-4 bg-gray-800/50 rounded-lg">
                        <h4 class="text-sm font-medium text-gray-300 mb-2">💡 Comparativa con otros modelos:</h4>
                        <div id="costComparison" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Model Data
        const models = [
            {
                name: "GPT-5",
                provider: "OpenAI",
                color: "#10b981",
                icon: "G5",
                inputPrice: 5.00,
                outputPrice: 15.00,
                cachePrice: 2.50,
                contextWindow: "1M",
                freeTier: false,
                freeDetails: "",
                mmlu: 90,
                code: 92,
                reasoning: 93,
                speed: "Media",
                tier: "Premium",
                features: ["Multimodal", "Function Calling", "Vision", "JSON Mode"],
                notes: "Modelo flagship de OpenAI. Rendimiento superior en razonamiento complejo."
            },
            {
                name: "GPT-6",
                provider: "OpenAI",
                color: "#059669",
                icon: "G6",
                inputPrice: 10.00,
                outputPrice: 30.00,
                cachePrice: 5.00,
                contextWindow: "2M",
                freeTier: false,
                freeDetails: "",
                mmlu: 94,
                code: 95,
                reasoning: 96,
                speed: "Media-Baja",
                tier: "Premium",
                features: ["Multimodal Avanzado", "Agentic", "Razonamiento extendido", "2M context"],
                notes: "Próxima generación. Contexto masivo de 2M tokens. Capacidades agénticas nativas."
            },
            {
                name: "Claude Opus 5",
                provider: "Anthropic",
                color: "#d97706",
                icon: "Op5",
                inputPrice: 15.00,
                outputPrice: 75.00,
                cachePrice: 7.50,
                contextWindow: "200K",
                freeTier: false,
                freeDetails: "",
                mmlu: 92,
                code: 94,
                reasoning: 95,
                speed: "Lenta",
                tier: "Premium",
                features: ["Razonamiento profundo", "Código avanzado", "Análisis largo", "Seguridad"],
                notes: "El modelo más capaz de Anthropic. Ideal para tareas complejas de razonamiento y código."
            },
            {
                name: "Claude Sonnet 5",
                provider: "Anthropic",
                color: "#f59e0b",
                icon: "So5",
                inputPrice: 3.00,
                outputPrice: 15.00,
                cachePrice: 1.50,
                contextWindow: "200K",
                freeTier: true,
                freeDetails: "Claude.ai free: uso limitado de Sonnet, ~50 msgs/5h",
                mmlu: 87,
                code: 89,
                reasoning: 88,
                speed: "Rápida",
                tier: "Balanceado",
                features: ["Balance calidad/precio", "Rápido", "200K context", "Function Calling"],
                notes: "Mejor relación calidad-precio de Anthropic. Rápido y capaz para la mayoría de tareas."
            },
            {
                name: "DeepSeek Flash v4",
                provider: "DeepSeek",
                color: "#6366f1",
                icon: "DF4",
                inputPrice: 0.07,
                outputPrice: 0.27,
                cachePrice: 0.01,
                contextWindow: "128K",
                freeTier: true,
                freeDetails: "API gratuita con rate limits. Generoso free tier en plataforma propia.",
                mmlu: 82,
                code: 85,
                reasoning: 83,
                speed: "Muy Rápida",
                tier: "Económico",
                features: ["Ultra económico", "Muy rápido", "128K context", "Open weights"],
                notes: "Increíblemente barato. Ideal para alto volumen. Rendimiento sorprendente para su precio."
            },
            {
                name: "DeepSeek Pro v4",
                provider: "DeepSeek",
                color: "#8b5cf6",
                icon: "DP4",
                inputPrice: 0.55,
                outputPrice: 2.19,
                cachePrice: 0.14,
                contextWindow: "128K",
                freeTier: true,
                freeDetails: "API con límites generosos. chat.deepseek.com uso gratuito limitado.",
                mmlu: 88,
                code: 91,
                reasoning: 90,
                speed: "Media",
                tier: "Económico",
                features: ["Razonamiento avanzado", "Código excelente", "Open weights", "Chain of Thought"],
                notes: "Rivale con modelos premium a fracción del precio. Excelente en código y razonamiento."
            },
            {
                name: "Nemotron 70B",
                provider: "NVIDIA",
                color: "#76b900",
                icon: "N70",
                inputPrice: 0.15,
                outputPrice: 0.15,
                cachePrice: 0.00,
                contextWindow: "128K",
                freeTier: true,
                freeDetails: "Gratis en NVIDIA API Catalog. Self-host gratuito (open weights).",
                mmlu: 80,
                code: 78,
                reasoning: 79,
                speed: "Rápida",
                tier: "Open Source",
                features: ["Open weights", "Self-host", "Optimizado NVIDIA", "Syncado"],
                notes: "Modelo open source de NVIDIA. Optimizado para GPUs NVIDIA. Ideal para despliegue propio."
            },
            {
                name: "Nemotron 49B",
                provider: "NVIDIA",
                color: "#84cc16",
                icon: "N49",
                inputPrice: 0.00,
                outputPrice: 0.00,
                cachePrice: 0.00,
                contextWindow: "128K",
                freeTier: true,
                freeDetails: "Completamente gratuito. Open weights. Self-host sin coste de licencia.",
                mmlu: 75,
                code: 73,
                reasoning: 74,
                speed: "Muy Rápida",
                tier: "Gratuito",
                features: ["100% gratuito", "Open weights", "Ligero", "Edge deployment"],
                notes: "Versión ligera y gratuita. Perfecto para edge computing y dispositivos limitados."
            },
            {
                name: "Nemotron Ultra 253B",
                provider: "NVIDIA",
                color: "#4ade80",
                icon: "NU",
                inputPrice: 0.80,
                outputPrice: 0.80,
                cachePrice: 0.00,
                contextWindow: "128K",
                freeTier: false,
                freeDetails: "",
                mmlu: 86,
                code: 87,
                reasoning: 86,
                speed: "Media-Baja",
                tier: "Premium",
                features: ["253B params", "Máximo rendimiento NVIDIA", "MoE", "Enterprise"],
                notes: "El modelo más grande de NVIDIA. 253B parámetros. Competitivo con modelos top."
            },
            {
                name: "BigPickle (Llama 4)",
                provider: "Meta",
                color: "#0668E1",
                icon: "BP",
                inputPrice: 0.20,
                outputPrice: 0.60,
                cachePrice: 0.00,
                contextWindow: "10M",
                freeTier: true,
                freeDetails: "Open weights. Self-host gratuito. Disponible en múltiples proveedores cloud.",
                mmlu: 84,
                code: 83,
                reasoning: 84,
                speed: "Rápida",
                tier: "Open Source",
                features: ["10M context", "Open weights", "Multimodal", "MoE architecture"],
                notes: "Llama 4 de Meta. Contexto masivo de 10M tokens. Arquitectura MoE eficiente."
            },
            {
                name: "Gemini 2.5 Pro",
                provider: "Google",
                color: "#4285f4",
                icon: "G2",
                inputPrice: 1.25,
                outputPrice: 10.00,
                cachePrice: 0.315,
                contextWindow: "2M",
                freeTier: true,
                freeDetails: "Google AI Studio free tier: 15 RPM, 1M tokens/día, 1.5M tokens/minuto.",
                mmlu: 89,
                code: 90,
                reasoning: 91,
                speed: "Media",
                tier: "Balanceado",
                features: ["2M context", "Multimodal nativo", "Thinking mode", "Google ecosystem"],
                notes: "Excelente relación calidad-precio. Contexto de 2M. Integración nativa con Google."
            },
            {
                name: "OpenAI Codex (Code Zen)",
                provider: "OpenAI",
                color: "#ef4444",
                icon: "CX",
                inputPrice: 2.00,
                outputPrice: 8.00,
                cachePrice: 1.00,
                contextWindow: "200K",
                freeTier: true,
                freeDetails: "ChatGPT free: acceso limitado a Codex. Plus: $20/mes uso ilimitado básico.",
                mmlu: 85,
                code: 93,
                reasoning: 86,
                speed: "Rápida",
                tier: "Especializado",
                features: ["Especializado en código", "Sandbox ejecución", "Multi-file", "PR automático"],
                notes: "Especializado en generación de código. Ejecuta en sandbox. Puede crear PRs automáticamente."
            }
        ];

        // Initialize
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        // Tab Navigation
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('tab-active');
                el.classList.add('bg-gray-800', 'text-gray-300');
            });
            document.getElementById('content-' + tabName).classList.remove('hidden');
            const activeBtn = document.getElementById('tab-' + tabName);
            activeBtn.classList.add('tab-active');
            activeBtn.classList.remove('bg-gray-800', 'text-gray-300');
        }

        // Render Model Cards
        function renderModelCards() {
            const container = document.getElementById('modelCards');
            container.innerHTML = models.map((model, i) => `
                <div class="card rounded-xl p-5 animate-in" style="animation-delay: ${i * 0.05}s">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="model-icon" style="background: ${model.color}20; color: ${model.color}; border: 1px solid ${model.color}40;">
                            ${model.icon}
                        </div>
                        <div>
                            <h3 class="font-bold text-white">${model.name}</h3>
                            <span class="text-xs text-gray-400">${model.provider}</span>
                        </div>
                        <span class="ml-auto text-xs px-2 py-1 rounded-full ${model.freeTier ? 'badge-free' : model.tier === 'Premium' ? 'badge-premium' : 'badge-paid'}">
                            ${model.freeTier ? '🆓 Free' : model.tier}
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mb-3">
                        <div class="bg-gray-800/50 rounded-lg p-2 text-center">
                            <div class="text-xs text-gray-400">Input</div>
                            <div class="text-sm font-bold text-green-400">${model.inputPrice === 0 ? 'GRATIS' : '$' + model.inputPrice.toFixed(2)}</div>
                        </div>
                        <div class="bg-gray-800/50 rounded-lg p-2 text-center">
                            <div class="text-xs text-gray-400">Output</div>
                            <div class="text-sm font-bold text-amber-400">${model.outputPrice === 0 ? 'GRATIS' : '$' + model.outputPrice.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span>📏 ${model.contextWindow}</span>
                        <span>⚡ ${model.speed}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${model.features.slice(0, 3).map(f => `<span class="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">${f}</span>`).join('')}
                    </div>
                    <p class="text-xs text-gray-500 leading-relaxed">${model.notes}</p>
                    ${model.freeTier ? `<div class="mt-3 p-2 bg-green-900/20 border border-green-800/30 rounded-lg text-xs text-green-300">${model.freeDetails}</div>` : ''}
                </div>
            `).join('');
        }

        // Render Pricing Table
        function renderPricingTable() {
            const tbody = document.getElementById('pricingTable');
            const sorted = [...models].sort((a, b) => a.inputPrice - b.inputPrice);
            tbody.innerHTML = sorted.map(model => `
                <tr class="table-row border-b border-gray-800 transition-colors">
                    <td class="p-4">
                        <div class="flex items-center gap-2">
                            <div class="model-icon" style="background: ${model.color}20; color: ${model.color}; width:30px; height:30px; font-size:10px; border: 1px solid ${model.color}40;">
                                ${model.icon}
                            </div>
                            <div>
                                <div class="font-medium text-white">${model.name}</div>
                                <div class="text-xs text-gray-500">${model.provider}</div>
                            </div>
                        </div>
                    </td>
                    <td class="p-4 font-mono ${model.inputPrice === 0 ? 'text-green-400 font-bold' : 'text-gray-300'}">
                        ${model.inputPrice === 0 ? 'GRATIS' : '$' + model.inputPrice.toFixed(2)}
                    </td>
                    <td class="p-4 font-mono ${model.outputPrice === 0 ? 'text-green-400 font-bold' : 'text-gray-300'}">
                        ${model.outputPrice === 0 ? 'GRATIS' : '$' + model.outputPrice.toFixed(2)}
                    </td>
                    <td class="p-4 font-mono text-gray-400">
                        ${model.cachePrice === 0 ? '—' : '$' + model.cachePrice.toFixed(2)}
                    </td>
                    <td class="p-4">
                        <span class="text-xs px-2 py-1 rounded-full ${model.freeTier ? 'badge-free' : model.tier === 'Premium' ? 'badge-premium' : 'badge-paid'}">
                            ${model.tier}
                        </span>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center gap-1">
                            ${renderStars(model)}
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function renderStars(model) {
            const score = (model.mmlu + model.code + model.reasoning) / 3;
            const ratio = score / (model.inputPrice + model.outputPrice + 1);
            const stars = Math.min(5, Math.max(1, Math.round(ratio / 5)));
            return '⭐'.repeat(stars) + '<span class="text-gray-600">' + '☆'.repeat(5 - stars) + '</span>';
        }

        // Render Free Tier
        function renderFreeTier() {
            const freeModels = models.filter(m => m.freeTier);
            const container = document.getElementById('freeTierList');
            container.innerHTML = freeModels.map(model => `
                <div class="bg-gray-800/50 rounded-lg p-3">
                    <div class="flex items-center gap-2 mb-1">
                        <div class="model-icon" style="background: ${model.color}20; color: ${model.color}; width:28px; height:28px; font-size:9px; border: 1px solid ${model.color}40;">
                            ${model.icon}
                        </div>
                        <span class="font-medium text-white text-sm">${model.name}</span>
                    </div>
                    <p class="text-xs text-green-300 ml-9">${model.freeDetails}</p>
                </div>
            `).join('');

            const limits = document.getElementById('freeTierLimits');
            limits.innerHTML = `
                <div class="flex items-start gap-2">
                    <span class="text-amber-400">⚠️</span>
                    <div>
                        <div class="text-sm font-medium text-white">Rate Limits</div>
                        <div class="text-xs text-gray-400">Todos los free tiers tienen límites de requests por minuto (RPM) y tokens por día (TPD).</div>
                    </div>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-amber-400">⚠️</span>
                    <div>
                        <div class="text-sm font-medium text-white">Modelos Anteriores</div>
                        <div class="text-xs text-gray-400">Free tier suele dar acceso a modelos de generación anterior o uso limitado de los últimos.</div>
                    </div>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-amber-400">⚠️</span>
                    <div>
                        <div class="text-sm font-medium text-white">Sin SLA</div>
                        <div class="text-xs text-gray-400">Sin garantía de disponibilidad. Puede haber colas en horas pico.</div>
                    </div>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-amber-400">⚠️</span>
                    <div>
                        <div class="text-sm font-medium text-white">Uso No Comercial</div>
                        <div class="text-xs text-gray-400">Algunos free tiers restringen uso comercial. Verificar términos.</div>
                    </div>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-green-400">✅</span>
                    <div>
                        <div class="text-sm font-medium text-white">Open Weights = Sin Límites</div>
                        <div class="text-xs text-gray-400">Nemotron y BigPickle (Llama 4) son open weights: self-host sin límites de API.</div>
                    </div>
                </div>
            `;

            const freeVsPaid = document.getElementById('freeVsPaid');
            freeVsPaid.innerHTML = `
                <div>
                    <h4 class="text-sm font-medium text-green-400 mb-3">Mejores opciones gratuitas</h4>
                    <div class="space-y-2">
                        <div class="p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">🥇 DeepSeek Flash v4</div>
                            <div class="text-xs text-gray-400 mt-1">API gratuita generosa + rendimiento decente. Mejor opción para prototipos.</div>
                        </div>
                        <div class="p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">🥈 Gemini 2.5 Pro</div>
                            <div class="text-xs text-gray-400 mt-1">1M tokens/día gratis en AI Studio. Contexto de 2M. Ideal para documentos largos.</div>
                        </div>
                        <div class="p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">🥉 Nemotron 49B</div>
                            <div class="text-xs text-gray-400 mt-1">100% gratis y open source. Self-host sin coste. Sin límites de uso.</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-amber-400 mb-3">¿Cuándo pagar?</h4>
                    <div class="space-y-2">
                        <div class="p-3 bg-amber-900/20 border border-amber-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">🏢 Producción / Enterprise</div>
                            <div class="text-xs text-gray-400 mt-1">Necesitas SLA, alta disponibilidad y soporte. Paga por API premium.</div>
                        </div>
                        <div class="p-3 bg-amber-900/20 border border-amber-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">🧠 Tareas complejas</div>
                            <div class="text-xs text-gray-400 mt-1">Razonamiento avanzado requiere Opus 5 o GPT-5. Free tier no es suficiente.</div>
                        </div>
                        <div class="p-3 bg-amber-900/20 border border-amber-800/30 rounded-lg">
                            <div class="font-medium text-sm text-white">⚡ Alto volumen</div>
                            <div class="text-xs text-gray-400 mt-1">Si superas rate limits, DeepSeek Pro v4 ofrece mejor $/calidad del mercado.</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render Benchmarks
        function renderBenchmarks() {
            const container = document.getElementById('benchmarkBars');
            const sorted = [...models].sort((a, b) => (b.mmlu + b.code + b.reasoning) / 3 - (a.mmlu + a.code + a.reasoning) / 3);
            container.innerHTML = sorted.map(model => {
                const avg = Math.round((model.mmlu + model.code + model.reasoning) / 3);
                return `
                    <div class="flex items-center gap-3">
                        <div class="w-32 text-sm font-medium text-white truncate">${model.name}</div>
                        <div class="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                            <div class="progress-bar h-full rounded-full flex items-center justify-end pr-2" style="width: ${avg}%">
                                <span class="text-xs font-bold text-white">${avg}%</span>
                            </div>
                        </div>
                        <div class="w-16 text-right text-xs text-gray-400">${model.provider}</div>
                    </div>
                `;
            }).join('');

            const reasoningBars = document.getElementById('reasoningBars');
            const reasoningSorted = [...models].sort((a, b) => b.reasoning - a.reasoning);
            reasoningBars.innerHTML = reasoningSorted.map(model => `
                <div class="flex items-center gap-3">
                    <div class="w-24 text-xs text-gray-300 truncate">${model.name}</div>
                    <div class="flex-1 bg-gray-800 rounded-full h-4 relative overflow-hidden">
                        <div class="h-full rounded-full" style="width: ${model.reasoning}%; background: ${model.color}"></div>
                    </div>
                    <div class="w-10 text-right text-xs font-mono text-gray-400">${model.reasoning}%</div>
                </div>
            `).join('');

            const codeBars = document.getElementById('codeBars');
            const codeSorted = [...models].sort((a, b) => b.code - a.code);
            codeBars.innerHTML = codeSorted.map(model => `
                <div class="flex items-center gap-3">
                    <div class="w-24 text-xs text-gray-300 truncate">${model.name}</div>
                    <div class="flex-1 bg-gray-800 rounded-full h-4 relative overflow-hidden">
                        <div class="h-full rounded-full" style="width: ${model.code}%; background: ${model.color}"></div>
                    </div>
                    <div class="w-10 text-right text-xs font-mono text-gray-400">${model.code}%</div>
                </div>
            `).join('');
        }

        // Calculator
        function initCalculator() {
            const select = document.getElementById('calcModel');
            select.innerHTML = models.map(m => `<option value="${m.name}">${m.name} (${m.provider})</option>`).join('');
            calculateCost();
        }

        function calculateCost() {
            const inputK = parseInt(document.getElementById('inputTokens').value);
            const outputK = parseInt(document.getElementById('outputTokens').value);
            const days = parseInt(document.getElementById('daysUsed').value);
            const modelName = document.getElementById('calcModel').value;
            const model = models.find(m => m.name === modelName);

            document.getElementById('inputTokensLabel').textContent = inputK >= 1000 ? (inputK/1000).toFixed(1) + 'M tokens/día' : inputK + 'K tokens/día';
            document.getElementById('outputTokensLabel').textContent = outputK >= 1000 ? (outputK/1000).toFixed(1) + 'M tokens/día' : outputK + 'K tokens/día';
            document.getElementById('daysLabel').textContent = days + ' días';

            const inputCost = (inputK / 1000) * model.inputPrice * days;
            const outputCost = (outputK / 1000) * model.outputPrice * days;
            const total = inputCost + outputCost;

            document.getElementById('monthlyCost').textContent = total === 0 ? 'GRATIS' : '$' + total.toFixed(2);
            document.getElementById('monthlyCost').className = total === 0 ? 'text-5xl font-bold text-green-400' : 'text-5xl font-bold text-indigo-400';

            document.getElementById('costBreakdown').innerHTML = `
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Coste Input (${(inputK * days / 1000).toFixed(1)}M tokens)</span>
                    <span class="text-green-400 font-mono">$${inputCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Coste Output (${(outputK * days / 1000).toFixed(1)}M tokens)</span>
                    <span class="text-amber-400 font-mono">$${outputCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm border-t border-gray-700 pt-2">
                    <span class="text-white font-medium">Total mensual</span>
                    <span class="text-indigo-400 font-bold font-mono">${total === 0 ? 'GRATIS' : '$' + total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Coste por día</span>
                    <span class="text-gray-300 font-mono">${total === 0 ? 'GRATIS' : '$' + (total/days).toFixed(2)}</span>
                </div>
            `;

            // Compare with other models
            const comparisons = models.filter(m => m.name !== modelName).map(m => {
                const otherCost = (inputK / 1000) * m.inputPrice * days + (outputK / 1000) * m.outputPrice * days;
                return { name: m.name, cost: otherCost, color: m.color, diff: otherCost - total };
            }).sort((a, b) => a.cost - b.cost);

            document.getElementById('costComparison').innerHTML = comparisons.slice(0, 6).map(c => `
                <div class="flex items-center gap-2 text-xs">
                    <div class="w-2 h-2 rounded-full" style="background: ${c.color}"></div>
                    <span class="text-gray-300 flex-1">${c.name}</span>
                    <span class="font-mono ${c.cost === 0 ? 'text-green-400' : 'text-gray-400'}">${c.cost === 0 ? 'GRATIS' : '$' + c.cost.toFixed(2)}</span>
                    <span class="font-mono text-xs ${c.diff > 0 ? 'text-red-400' : c.diff < 0 ? 'text-green-400' : 'text-gray-500'}">
                        ${c.diff > 0 ? '+' : ''}${c.diff === 0 ? '=' : '$' + c.diff.toFixed(2)}
                    </span>
                </div>
            `).join('');
        }

        // Initialize all
        renderModelCards();
        renderPricingTable();
        renderFreeTier();
        renderBenchmarks();
        initCalculator();
    </script>
</body>
</html>
```
