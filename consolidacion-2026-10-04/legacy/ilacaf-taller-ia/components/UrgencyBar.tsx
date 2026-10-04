"use client";

import { motion } from "framer-motion";

const TOTAL = 150;
const SOLD = 142;
const LEFT = TOTAL - SOLD;

export default function UrgencyBar() {
  const pct = Math.round((SOLD / TOTAL) * 100);
  return (
    <section id="progreso" className="py-12 bg-slate-900/50 border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-between items-end mb-4 gap-4 flex-wrap">
          <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Progreso de Inscripción
          </span>
          <span className="text-blue-400 font-bold">
            {SOLD} de {TOTAL} cupos vendidos
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
        </div>
        <p className="mt-4 text-sm text-slate-500 italic">
          Solo quedan{" "}
          <span className="text-red-400 font-bold not-italic">{LEFT}</span>{" "}
          lugares disponibles para esta cohorte.
        </p>
      </div>
    </section>
  );
}