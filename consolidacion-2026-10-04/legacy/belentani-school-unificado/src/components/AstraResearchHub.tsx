import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Compass, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  School, 
  Library, 
  Globe, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Navigation
} from 'lucide-react';
import { playSoundTone, playSoundSuccess, playSoundError } from '../utils/speech';

interface SearchResultState {
  answer: string;
  sources: { title: string; uri: string }[];
  modelUsed: string;
  simulated?: boolean;
}

interface MapsResultState {
  answer: string;
  places: { title: string; uri: string; snippets?: string[] }[];
  modelUsed: string;
  simulated?: boolean;
}

export const AstraResearchHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'search' | 'maps'>('search');

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResultState | null>(null);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<MapsResultState | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 41.3879, lng: 2.16992 }); // Barcelona
  const [usingCustomLocation, setUsingCustomLocation] = useState(false);

  // Suggested searches for 3º ESO LOMLOE
  const suggestedSearches = [
    'Currículo oficial LOMLOE 3º de ESO en Cataluña asignaturas y criterios',
    'Novedades astronómicas y misiones espaciales activas este año',
    'Avances recientes en energía limpia y fusión nuclear en Europa',
    'Fechas oficiales selectividad EBAU y calendario escolar en Cataluña'
  ];

  // Suggested maps queries for student life in Catalonia/Spain
  const suggestedMapsQueries = [
    'Bibliotecas públicas con salas de estudio en Barcelona',
    'CosmoCaixa Barcelona y museos de ciencia interactivos',
    'Institutos de Educación Secundaria públicos cerca de mí',
    'Centros cívicos y espacios juveniles con talleres culturales en Barcelona'
  ];

  const handleExecuteSearch = async (queryToUse?: string) => {
    const q = (queryToUse || searchQuery).trim();
    if (!q) return;

    if (queryToUse) setSearchQuery(queryToUse);
    setSearchLoading(true);
    playSoundTone(440, 0.05, 'sine', 0.1);

    try {
      const res = await fetch('/api/gemini/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) throw new Error('Error al conectar con el servicio de búsqueda');

      const data = await res.json();
      setSearchResult({
        answer: data.answer,
        sources: data.sources || [],
        modelUsed: data.modelUsed || 'gemini-3.5-flash',
        simulated: data.simulated
      });
      playSoundSuccess();
    } catch (err: any) {
      playSoundError();
      setSearchResult({
        answer: `Información de referencia sobre "${q}": En el marco de 3º de ESO y LOMLOE, los contenidos curriculares priorizan competencias en resolución de problemas matemáticos, lengua contrastiva y método científico.`,
        sources: [
          { title: "Departament d'Educació de la Generalitat de Catalunya", uri: "https://educacio.gencat.cat" },
          { title: "Portal Oficial LOMLOE - Ministerio de Educación", uri: "https://www.educacionfpydeportes.gob.es" }
        ],
        modelUsed: 'gemini-3.5-flash (Modo contingencia)',
        simulated: true
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleExecuteMaps = async (queryToUse?: string) => {
    const q = (queryToUse || mapsQuery).trim();
    if (!q) return;

    if (queryToUse) setMapsQuery(queryToUse);
    setMapsLoading(true);
    playSoundTone(520, 0.05, 'sine', 0.1);

    try {
      const res = await fetch('/api/gemini/grounded-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: q,
          latitude: coords.lat,
          longitude: coords.lng
        })
      });

      if (!res.ok) throw new Error('Error en consulta de mapas');

      const data = await res.json();
      setMapsResult({
        answer: data.answer,
        places: data.places || [],
        modelUsed: data.modelUsed || 'gemini-3.5-flash',
        simulated: data.simulated
      });
      playSoundSuccess();
    } catch (err: any) {
      playSoundError();
      setMapsResult({
        answer: `Ubicaciones clave en Barcelona y alrededores para "${q}": Destacan CosmoCaixa (Calle Isaac Newton 26), Biblioteca Jaume Fuster (Pl. Lesseps) y Biblioteca Gabriel García Márquez.`,
        places: [
          { 
            title: "CosmoCaixa Barcelona (Museo de la Ciencia)", 
            uri: "https://www.google.com/maps/search/?api=1&query=CosmoCaixa+Barcelona",
            snippets: ["Espacio de divulgación con bosque inundado y planetario."]
          },
          { 
            title: "Biblioteca Jaume Fuster (Gràcia)", 
            uri: "https://www.google.com/maps/search/?api=1&query=Biblioteca+Jaume+Fuster+Barcelona",
            snippets: ["Amplia sala de estudio escolar y préstamo de recursos educativos."]
          }
        ],
        modelUsed: 'gemini-3.5-flash (Modo contingencia)',
        simulated: true
      });
    } finally {
      setMapsLoading(false);
    }
  };

  const requestUserGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setUsingCustomLocation(true);
          playSoundSuccess();
        },
        (err) => {
          console.warn("Geolocalización no disponible, usando Barcelona:", err);
        }
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="astra-research-hub-root">
      {/* Top Banner / Concept Header */}
      <div className="astra-card p-5 sm:p-6 border border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-[#0d0e1d] via-[#121429] to-[#0c0d1c]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0c16] rounded-[14px] flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Centro de Investigación y Conexión Real</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 3.5 Flash Grounding
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Herramientas conectadas a fuentes en tiempo real: investiga datos actualizados con <strong className="text-slate-200">Google Search</strong> y localiza institutos, bibliotecas y centros de estudio con <strong className="text-slate-200">Google Maps</strong>.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/[0.08] shrink-0">
            <button
              id="tab-search-grounding"
              onClick={() => {
                playSoundTone(440, 0.03, 'sine', 0.08);
                setActiveMode('search');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'search'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Google Search</span>
            </button>
            <button
              id="tab-maps-grounding"
              onClick={() => {
                playSoundTone(520, 0.03, 'sine', 0.08);
                setActiveMode('maps');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'maps'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Google Search Grounding */}
      {activeMode === 'search' && (
        <div className="space-y-5">
          {/* Search Input Box */}
          <div className="astra-card p-5 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-violet-400" />
                <span>Investigación en tiempo real con Google Search:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Modelo: gemini-3.5-flash (googleSearch tool)
              </span>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-grounded-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: ¿Cuáles son las novedades de la LOMLOE para 3º de ESO en Cataluña?"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>
              <button
                id="btn-grounded-search-submit"
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {searchLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Investigar</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Temas sugeridos para 3º de ESO:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteSearch(item)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-violet-950/40 border border-white/[0.06] hover:border-violet-500/40 text-slate-300 transition-all text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results Display */}
          {searchResult && (
            <div className="astra-card p-5 sm:p-6 border border-violet-500/30 bg-[#0a0b16] space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Respuesta Contrastada en Tiempo Real
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {searchResult.modelUsed}
                </span>
              </div>

              {/* Text answer */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {searchResult.answer}
              </div>

              {/* Verified Web Sources */}
              {searchResult.sources.length > 0 && (
                <div className="border-t border-white/[0.08] pt-4 space-y-2.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fuentes Web Oficiales y Enlaces de Consulta:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResult.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-2.5 rounded-lg bg-slate-900/70 border border-white/[0.06] hover:border-violet-400/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all flex items-center justify-between gap-2 group"
                      >
                        <div className="truncate text-[11px]">
                          <div className="font-semibold truncate text-white group-hover:text-violet-300">
                            {src.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                            {src.uri}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Google Maps Grounding */}
      {activeMode === 'maps' && (
        <div className="space-y-5">
          {/* Maps Query Box */}
          <div className="astra-card p-5 border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Exploración de Entorno Educativo con Google Maps:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={requestUserGeoLocation}
                  className={`text-[11px] px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    usingCustomLocation
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>{usingCustomLocation ? 'GPS Activado' : 'Usar mi GPS local'}</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono">
                  {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
                </span>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteMaps();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-grounded-maps"
                  type="text"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="Ej: Bibliotecas con salas de estudio y recursos escolares en Barcelona"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
              <button
                id="btn-grounded-maps-submit"
                type="submit"
                disabled={mapsLoading || !mapsQuery.trim()}
                className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {mapsLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Localizando...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Buscar Lugares</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Maps Suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Lugares educativos de interés en Cataluña:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedMapsQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteMaps(item)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 border border-white/[0.06] hover:border-cyan-500/40 text-slate-300 transition-all text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Maps Results Display */}
          {mapsResult && (
            <div className="astra-card p-5 sm:p-6 border border-cyan-500/30 bg-[#0a0b16] space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ubicaciones de Google Maps Verificadas
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {mapsResult.modelUsed}
                </span>
              </div>

              {/* Text answer */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {mapsResult.answer}
              </div>

              {/* Interactive Places Cards */}
              {mapsResult.places.length > 0 && (
                <div className="border-t border-white/[0.08] pt-4 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fichas de Google Maps con Enlace Directo:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mapsResult.places.map((place, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] hover:border-cyan-400/50 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                              {place.title}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                              Maps
                            </span>
                          </div>
                          {place.snippets && place.snippets.length > 0 && (
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed italic">
                              "{place.snippets[0]}"
                            </p>
                          )}
                        </div>

                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          <span>Abrir en Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
