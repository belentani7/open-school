/*!
 * shell.js — Open School · cáscara del campus sin dependencias.
 * Sustituye al bundle React (274 KB) con las mismas capacidades:
 *   1. Paleta de búsqueda (Ctrl/Cmd+K o botón [data-search-open]) sobre search-index.json
 *   2. Alternancia de tema ([data-theme-toggle], persistida en localStorage "platform-theme")
 *   3. Barra de progreso de lectura (.reading-progress)
 * Núcleo puro expuesto en globalThis.__osShell para las pruebas unitarias.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Núcleo puro (sin DOM) — testeable con node:test
   * ------------------------------------------------------------------ */

  /** Minúsculas sin acentos ni diacríticos (NFD + marcas combinantes U+0300–U+036F). */
  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  /**
   * Filtra la paleta: sin consulta devuelve los primeros `idle` items;
   * con consulta, coincidencias en título+descripción+sección+href (hasta `limit`).
   */
  function filterItems(items, query, limit) {
    var list = Array.isArray(items) ? items : [];
    var q = normalize(query).trim();
    if (!q) return list.slice(0, idleLimit(limit));
    var max = typeof limit === 'number' && limit > 0 ? limit : 20;
    var out = [];
    for (var i = 0; i < list.length && out.length < max; i++) {
      var it = list[i] || {};
      var hay = normalize(
        (it.title || '') + ' ' + (it.description || '') + ' ' +
        (it.section || '') + ' ' + (it.href || '')
      );
      if (hay.indexOf(q) !== -1) out.push(it);
    }
    return out;
  }

  function idleLimit(limit) {
    return typeof limit === 'number' && limit > 0 ? limit : 12;
  }

  /** "https://host/ruta/assets/js/shell.js" → "https://host/ruta/" */
  function siteRootFromSrc(src) {
    var s = String(src || '').split('?')[0].split('#')[0];
    return s.replace(/assets\/js\/shell\.js$/, '');
  }

  var CORE = {
    normalize: normalize,
    filterItems: filterItems,
    siteRootFromSrc: siteRootFromSrc
  };
  if (typeof globalThis !== 'undefined') globalThis.__osShell = CORE;

  /* ------------------------------------------------------------------ *
   * Solo en navegador a partir de aquí
   * ------------------------------------------------------------------ */
  if (typeof document === 'undefined') return;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    var doc = document.documentElement;
    var config = window.__PLATFORM__ || {};
    var siteName = config.name || 'Open School';

    /* Raíz del sitio derivada de la propia URL del script: funciona en /,
       /lecciones/, /universal-modulos/, etc., sin configuración. */
    var root = './';
    var script = document.currentScript ||
      document.querySelector('script[src*="shell.js"]');
    if (script && script.src) root = siteRootFromSrc(script.src);

    /* ---------------------------- Tema ---------------------------- */
    initTheme();

    function initTheme() {
      var stored = null;
      try { stored = window.localStorage.getItem('platform-theme'); } catch (e) { /* modo privado */ }
      var prefersLight = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches;
      doc.dataset.theme = stored || (prefersLight ? 'light' : 'dark');

      var toggles = document.querySelectorAll('[data-theme-toggle]');
      function syncLabels() {
        var label = doc.dataset.theme === 'light'
          ? 'Activar tema oscuro'
          : 'Activar tema claro';
        toggles.forEach(function (btn) { btn.setAttribute('aria-label', label); });
      }
      toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
          doc.dataset.theme = doc.dataset.theme === 'light' ? 'dark' : 'light';
          try { window.localStorage.setItem('platform-theme', doc.dataset.theme); } catch (e) { /* ignorado */ }
          syncLabels();
        });
      });
      if (toggles.length) syncLabels();
    }

    /* ---------------------- Progreso de lectura --------------------- */
    var progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('data-progress', '');
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    var ticking = false;
    function updateProgress() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();

    /* --------------------------- Paleta ---------------------------- */
    initPalette();

    function initPalette() {
      var dlg = document.createElement('dialog');
      dlg.className = 'palette';
      dlg.setAttribute('aria-label', 'Buscar en ' + siteName);
      dlg.id = 'os-palette';

      var inputWrap = document.createElement('div');
      inputWrap.className = 'palette-input';
      inputWrap.innerHTML =
        '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>';

      var input = document.createElement('input');
      input.type = 'search';
      input.size = 18;
      input.placeholder = 'Buscar cursos, semanas, recursos…';
      input.setAttribute('aria-label', 'Buscar en la plataforma');
      input.autocomplete = 'off';

      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'palette-close';
      closeBtn.setAttribute('aria-label', 'Cerrar búsqueda');
      closeBtn.innerHTML =
        '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

      inputWrap.appendChild(input);
      inputWrap.appendChild(closeBtn);

      var sr = document.createElement('p');
      sr.className = 'sr-only';
      sr.textContent = 'Buscar en ' + siteName;

      var list = document.createElement('ul');
      list.className = 'palette-results';
      list.setAttribute('role', 'list');

      var hint = document.createElement('p');
      hint.className = 'palette-hint';
      hint.innerHTML = '<kbd>Ctrl</kbd> + <kbd>K</kbd> para abrir · ' +
        '<kbd>Esc</kbd> para cerrar';

      dlg.appendChild(sr);
      dlg.appendChild(inputWrap);
      dlg.appendChild(list);
      dlg.appendChild(hint);
      document.body.appendChild(dlg);

      var items = null;      // null = sin cargar; [] = error/vacío
      var active = -1;

      function ensureIndex() {
        if (items !== null) return Promise.resolve(items);
        return fetch(root + 'search-index.json')
          .then(function (res) { return res.ok ? res.json() : []; })
          .then(function (data) {
            items = Array.isArray(data) ? data : [];
            return items;
          })
          .catch(function () {
            items = [];
            return items;
          });
      }

      function render() {
        var results = filterItems(items || [], input.value, undefined);
        list.replaceChildren();
        active = -1;
        results.forEach(function (it, i) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = root + String(it.href || '').replace(/^\.?\//, '');
          var section = document.createElement('span');
          section.className = 'palette-section';
          section.textContent = it.section || '';
          var strong = document.createElement('strong');
          strong.textContent = it.title || '';
          var small = document.createElement('small');
          small.textContent = it.description || '';
          a.appendChild(section);
          a.appendChild(strong);
          a.appendChild(small);
          li.appendChild(a);
          li.dataset.index = String(i);
          list.appendChild(li);
        });
        if (results.length === 0) {
          var empty = document.createElement('li');
          empty.className = 'palette-empty';
          empty.textContent = 'Sin resultados para “' + input.value.trim() + '”.';
          list.appendChild(empty);
        }
      }

      function setActive(next) {
        var links = list.querySelectorAll('a');
        if (!links.length) { active = -1; return; }
        if (active >= 0 && links[active]) links[active].removeAttribute('aria-current');
        active = (next + links.length) % links.length;
        var el = links[active];
        el.setAttribute('aria-current', 'true');
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ block: 'nearest' });
        }
      }

      function openPalette() {
        if (dlg.open) return;
        ensureIndex().then(function () {
          render();
          if (typeof dlg.showModal === 'function') {
            dlg.showModal();
          } else {
            dlg.setAttribute('open', '');
          }
          input.focus();
          input.select();
        });
      }

      function closePalette() {
        if (!dlg.open) return;
        if (typeof dlg.close === 'function') dlg.close();
        else dlg.removeAttribute('open');
      }

      closeBtn.addEventListener('click', closePalette);
      dlg.addEventListener('click', function (ev) {
        if (ev.target === dlg) closePalette(); // clic en el backdrop
      });
      dlg.addEventListener('close', function () {
        input.value = '';
        list.replaceChildren();
      });

      input.addEventListener('input', function () {
        ensureIndex().then(render);
      });

      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(active + 1); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(active - 1); }
        else if (ev.key === 'Home' && list.querySelector('a')) { ev.preventDefault(); setActive(0); }
        else if (ev.key === 'End' && list.querySelector('a')) { ev.preventDefault(); setActive(-1); }
        else if (ev.key === 'Enter') {
          var links = list.querySelectorAll('a');
          var target = links[active >= 0 ? active : 0];
          if (target) { ev.preventDefault(); window.location.href = target.href; }
        }
      });

      document.addEventListener('keydown', function (ev) {
        if ((ev.metaKey || ev.ctrlKey) && String(ev.key).toLowerCase() === 'k') {
          ev.preventDefault();
          if (dlg.open) closePalette(); else openPalette();
        }
      });

      document.querySelectorAll('[data-search-open]').forEach(function (btn) {
        btn.addEventListener('click', openPalette);
      });
    }
  });
})();
