/* ===================================================================
   GLASS — el material de 4 capas (P2) como componente.

   1 effect   backdrop-filter blur+saturate (+ refraccion SVG opcional)
   2 tint     color SOLIDO — sobre negro, el rgba puro es invisible
   3 shine    4 inset shadows = bisel iluminado
   4 content  el contenido, elevado sobre el material
   =================================================================== */

import type { ElementType, ReactNode } from 'react';

type GlassProps = {
  as?: ElementType;
  children: ReactNode;
  /** Refraccion SVG. Reservar para superficies grandes: tiene coste. */
  refract?: boolean;
  /** Elevacion + barrido especular al hover/focus. Para lo pulsable. */
  lift?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

export function Glass({
  as: Tag = 'div',
  children,
  refract = false,
  lift = false,
  className = '',
  style,
  ...rest
}: GlassProps) {
  const cls = [
    'glass',
    refract ? 'glass--refract' : '',
    lift ? 'glass--lift' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={cls} style={style} {...rest}>
      {lift && <span className="m-sheen" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
