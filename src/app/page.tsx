export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gradient">
          open-school
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Instituto educativo digital universal — cursos modulares, certificaciones verificables, accesibilidad WCAG, offline-first
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <a href="/cursos" className="glass p-6 rounded-xl hover:shadow-glowGold transition">
            <h2 className="text-xl font-semibold mb-2">📚 Cursos</h2>
            <p className="text-gray-400">Catálogo modular con progresión CEFR</p>
          </a>
          <a href="/certificaciones" className="glass p-6 rounded-xl hover:shadow-glowGold transition">
            <h2 className="text-xl font-semibold mb-2">🏆 Certificaciones</h2>
            <p className="text-gray-400">Verificables, blockchain-ready</p>
          </a>
          <a href="/accesibilidad" className="glass p-6 rounded-xl hover:shadow-glowGold transition">
            <h2 className="text-xl font-semibold mb-2">♿ Accesibilidad</h2>
            <p className="text-gray-400">WCAG AAA, offline-first</p>
          </a>
        </div>
        <div className="mt-12 p-6 glass rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Parte del ecosistema Belentani</h2>
          <div className="flex flex-wrap gap-4">
            <a href="https://manosabiertas.vercel.app" className="px-4 py-2 glass rounded-lg">ManosAbiertas</a>
            <a href="https://secure-t.vercel.app" className="px-4 py-2 glass rounded-lg">secure-t</a>
            <a href="https://linguaforge.vercel.app" className="px-4 py-2 glass rounded-lg">linguaforge</a>
            <a href="https://belentani.es" className="px-4 py-2 glass rounded-lg">belentani.es</a>
            <a href="https://belentani-cv-ai.vercel.app" className="px-4 py-2 glass rounded-lg">Belentani.cv-ai</a>
          </div>
        </div>
      </div>
    </main>
  )
}