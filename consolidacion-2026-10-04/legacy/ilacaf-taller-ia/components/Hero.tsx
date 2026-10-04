"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header
      id="inicio"
      className="relative overflow-hidden pt-24 pb-16 px-6 border-b border-white/10"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 inline-block">
            Septiembre 23, 24 y 25 — Cupos Limitados
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Inteligencia Artificial <br />{" "}
            <span className="text-blue-500">para Profesionales</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Domina el futuro de la auditoría, el derecho y las finanzas. No es
            solo aprender a usar herramientas, es liderar la transformación
            digital con IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#inscripcion"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 text-center"
            >
              Asegurar mi cupo ahora
            </a>
            <a
              href="#temario"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all text-center"
            >
              Ver temario completo
            </a>
          </div>
        </motion.div>
      </div>
    </header>
  );
}