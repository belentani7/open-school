// campus app: quiz player + stagger + audit (sin dependencias)
document.documentElement.classList.add('js');

const $ = (sel, root = document) => root.querySelector(sel);

function loadQuiz(url) {
  const box = $('.quiz-box');
  if (!box) return;
  fetch(url).then(r => {
    if (!r.ok) throw new Error('No se pudo cargar el quiz');
    return r.json();
  }).then(items => {
    if (!Array.isArray(items) || items.length === 0 ||
        items.some(q => typeof q.pregunta !== 'string' ||
          !Array.isArray(q.opciones) || q.opciones.length < 2 ||
          !Number.isInteger(q.correcta) || q.correcta < 0 ||
          q.correcta >= q.opciones.length || typeof q.explicacion !== 'string')) {
      throw new Error('Datos del quiz no válidos');
    }
    let idx = 0, score = 0;
    const titulo = $('.quiz-titulo', box);
    const opciones = $('.opciones', box);
    const feedback = $('.feedback', box);
    const marcador = $('.marcador', box);
    const btn = $('.quiz-siguiente', box);
    const render = () => {
      const q = items[idx];
      titulo.textContent = `${idx + 1}/${items.length} · ${q.pregunta}`;
      opciones.replaceChildren();
      q.opciones.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'opcion';
        b.textContent = o;
        b.addEventListener('click', () => {
          [...opciones.children].forEach((el, j) => {
            if (j === q.correcta) el.classList.add('correcta');
            else if (j === i) el.classList.add('fallo');
            el.disabled = true;
          });
          const ok = i === q.correcta;
          if (ok) score++;
          feedback.textContent = ok
            ? `Correcto. ${q.explicacion}`
            : `Incorrecto. ${q.explicacion}`;
          marcador.textContent = `Aciertos: ${score}`;
          btn.textContent = idx === items.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
          btn.hidden = false;
        });
        opciones.appendChild(b);
      });
      btn.hidden = true;
    };
    titulo.setAttribute('tabindex', '-1');
    btn.addEventListener('click', () => {
      idx++;
      if (idx >= items.length) {
        titulo.textContent = `Terminado: ${score}/${items.length}`;
        titulo.focus();
        opciones.replaceChildren();
        feedback.textContent = score >= items.length * 0.7
          ? 'Nivel superado.' : 'Repasa y vuelve a intentarlo.';
        btn.hidden = true;
        marcador.textContent = '';
        return;
      }
      render();
      titulo.focus();
    });
    render();
  }).catch(() => {
    $('.quiz-titulo', box).textContent = 'No se pudo cargar el cuestionario. Revisa la conexión e inténtalo más tarde.';
  });
}

// stagger sutil de tarjetas (respeta reduced-motion)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
  document.querySelectorAll('.card').forEach((el, i) => {
    el.style.animation = 'rise var(--dur-slow) var(--ease-out) both';
    el.style.animationDelay = `${Math.min(i * 60, 300)}ms`;
  });
  const st = document.createElement('style');
  st.textContent = '@keyframes rise{from{opacity:0;transform:translateY(8px)}}';
  document.head.appendChild(st);
}

// auditoria rapida de accesibilidad (consola)
window.uiAudit = () => {
  const issues = [];
  document.querySelectorAll('img:not([alt])').forEach(() =>
    issues.push('img sin alt'));
  document.querySelectorAll('a, button').forEach(el => {
    const r = el.getBoundingClientRect();
    if ((r.width < 44 || r.height < 44) && !el.disabled)
      issues.push(`Target pequeno: ${el.tagName}`);
  });
  return issues;
};

// registro offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

document.querySelectorAll('.quiz-json').forEach(el => loadQuiz(el.dataset.src));
