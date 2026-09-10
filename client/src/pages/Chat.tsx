// Open School — AI Chat Page (Ollama powered)
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Mic, X, Sparkles, Brain } from 'lucide-react';

interface Message {
  role: 'student' | 'ai';
  text: string;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hola. ¿Qué quieres aprender hoy?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorVisible, setTutorVisible] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    
    setMessages(prev => [...prev, { role: 'student', text, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    
    try {
      // In production: call Ollama API endpoint
      // const res = await fetch('http://localhost:11434/api/generate', { ... });
      
      // Simulated response for now
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `Buena pregunta. Vamos a desglosarla en partes más pequeñas para encontrar la respuesta paso a paso. ¿Qué parte quieres explorar primero?`, 
          timestamp: new Date() 
        }]);
        setLoading(false);
      }, 1200);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'El asistente IA no está disponible. Verifica que Ollama esté corriendo en localhost:11434.', 
        timestamp: new Date() 
      }]);
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explícame un concepto nuevo',
    'Ponme a prueba con un quiz',
    'Dame un ejercicio práctico',
    'Resume lo que aprendí hoy',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-nclr-red/20 text-nclr-red">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm">Astra · AI Mentor</h1>
            <p className="text-[10px] text-green-400">● governed · ollama-local</p>
          </div>
        </div>
        <button onClick={() => setTutorVisible(false)} className="ncl-btn ncl-btn--glass text-xs">
          <X className="w-3 h-3" /> CERRAR
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : ''}`}>
            <div className={`max-w-[80%] ${msg.role === 'student' ? 'order-2' : ''}`}>
              <div className="flex items-start gap-3">
                {msg.role === 'ai' && (
                  <div className="grid size-7 shrink-0 place-items-center rounded-md bg-nclr-red/15 text-nclr-red mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`${msg.role === 'student' ? 'ncl-glass' : 'bg-white/[0.02]'}`}>
                  <div className="p-4">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="px-4 pb-3">
                    <span className="text-[10px] text-muted font-mono">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-nclr-red/15 text-nclr-red">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-white/[0.02] rounded-xl p-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-nclr-red animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-nclr-red animate-pulse" style={{animationDelay: '0.15s'}}></div>
                <div className="w-2 h-2 rounded-full bg-nclr-red animate-pulse" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="text-xs text-muted mb-3 font-mono tracking-wider">PREGUNTAS RÁPIDAS</div>
          <div className="flex gap-2 flex-wrap">
            {quickPrompts.map(q => (
              <button key={q} onClick={() => { setInput(q); }} className="ncl-chip hover:!text-white hover:!border-nclr-red/30 cursor-pointer">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-white/5 bg-black/30 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-center">
          <button className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/5 text-nclr-red hover:bg-white/10 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Pregúntale a Astra..." 
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/25"
            autoFocus
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()}
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-nclr-red text-white hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
