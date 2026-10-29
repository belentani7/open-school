/* ===================================================================
   REFRACTION — filtros SVG para el glass (manual §2)

   Un `backdrop-filter: blur()` a secas NO es liquid glass: difumina,
   pero no desvia la luz. El vidrio real refracta (Snell) y dispersa
   (los canales RGB se separan por indice).

   Aqui: feTurbulence genera el mapa de espesor, feDisplacementMap
   desvia el fondo, y se hacen TRES pasadas con escalas distintas
   (6 / 4 / 2, rango del manual) de las que se extrae un canal cada
   una. Al recomponerlas aparece la franja cromatica del borde.

   Solo Chromium aplica filtros SVG en backdrop-filter. El resto degrada
   al blur+saturate de `.glass` — que ya es correcto por si solo.
   Se monta una vez, en la raiz de la app.
   =================================================================== */

export function RefractionDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="lg-refract"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          {/* Mapa de espesor del vidrio. baseFrequency baja = ondulacion
              amplia, como vidrio soplado; alta = textura de escarcha. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.013"
            numOctaves="2"
            seed="7"
            result="thickness"
          />
          {/* Suavizar el ruido evita el aliasing de sal y pimienta. */}
          <feGaussianBlur in="thickness" stdDeviation="2.4" result="lens" />

          {/* --- Tres indices de refraccion --- */}
          <feDisplacementMap
            in="SourceGraphic" in2="lens" scale="6"
            xChannelSelector="R" yChannelSelector="G" result="dR"
          />
          <feDisplacementMap
            in="SourceGraphic" in2="lens" scale="4"
            xChannelSelector="R" yChannelSelector="G" result="dG"
          />
          <feDisplacementMap
            in="SourceGraphic" in2="lens" scale="2"
            xChannelSelector="R" yChannelSelector="G" result="dB"
          />

          {/* --- Un canal de cada pasada --- */}
          <feColorMatrix in="dR" type="matrix" result="cR"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0" />
          <feColorMatrix in="dG" type="matrix" result="cG"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0" />
          <feColorMatrix in="dB" type="matrix" result="cB"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0" />

          {/* --- Recomposicion aditiva --- */}
          <feComposite in="cR" in2="cG" operator="arithmetic"
            k1="0" k2="1" k3="1" k4="0" result="cRG" />
          <feComposite in="cRG" in2="cB" operator="arithmetic"
            k1="0" k2="1" k3="1" k4="0" result="chroma" />

          {/* Saturacion final: el vidrio concentra el color que atraviesa. */}
          <feColorMatrix in="chroma" type="saturate" values="1.35" />
        </filter>

        {/* Halo de bisel para iconos y bordes (P3: luz interna). */}
        <filter id="lg-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
