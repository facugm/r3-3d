/* =========================================================
   TERCERA CAPA EDITORIAL — JavaScript
   Rosario3 — Componentes interactivos integrados
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     0. UTILIDADES
     ------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /**
   * IntersectionObserver helper: aplica clase .tc-visible
   * cuando un elemento entra al viewport.
   */
  function observeEntrance(elements, options = {}) {
    const defaults = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
    const config = { ...defaults, ...options };

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('tc-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tc-visible');
          observer.unobserve(entry.target);
        }
      });
    }, config);

    elements.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
     1. NUMERACIÓN — "5 cambios clave" (staggered entrance)
     ------------------------------------------------------- */
  function initCambiosOverview() {
    const items = $$('.tc-cambio-item');
    if (!items.length) return;

    // Staggered entrance animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const children = $$('.tc-cambio-item', container);
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('tc-visible');
            }, i * 120);
          });
          observer.unobserve(container);
        }
      });
    }, { threshold: 0.1 });

    const container = $('.tc-cambios-overview');
    if (container) observer.observe(container);
  }

  /* -------------------------------------------------------
     2. ANTES / DESPUÉS — Comparador (tabs en mobile)
     ------------------------------------------------------- */
  function initComparador() {
    const tabs = $$('.tc-comparador-tab');
    const panels = $$('.tc-comparador-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');

        // Update tabs
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');

        // Update panels
        panels.forEach(p => p.setAttribute('aria-hidden', 'true'));
        const target = document.getElementById(targetId);
        if (target) target.setAttribute('aria-hidden', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     3. SLIDER DE POTENCIA — 85 kW
     ------------------------------------------------------- */
  function initSlider() {
    const slider = $('#tc-slider-potencia');
    if (!slider) return;

    const valorDisplay = $('#tc-slider-valor-num');
    const estadoContainer = $('#tc-slider-estado');
    const estadoTexto = $('#tc-slider-estado-texto');
    const equivDisplay = $('#tc-slider-equiv');
    const trackOptativo = $('.tc-slider-track-fill-optativo');
    const trackObligatorio = $('.tc-slider-track-fill-obligatorio');
    const trackRemaining = $('.tc-slider-track-remaining');

    const UMBRAL = 85;
    const MIN = 5;
    const MAX = 200;

    const equivalencias = [
      { desde: 5, hasta: 15, texto: 'Motor eléctrico de pesca o auxiliar pequeño' },
      { desde: 15, hasta: 30, texto: 'Motor típico de bote inflable o embarcación menor' },
      { desde: 30, hasta: 50, texto: 'Motor habitual para lanchas de paseo medianas' },
      { desde: 50, hasta: 75, texto: 'Motor de lancha de recreación estándar' },
      { desde: 75, hasta: 85, texto: 'Potencia alta, cerca del umbral de inscripción' },
      { desde: 85, hasta: 110, texto: 'Motor potente de lancha deportiva o moto de agua' },
      { desde: 110, hasta: 150, texto: 'Motor de alta potencia, embarcaciones rápidas' },
      { desde: 150, hasta: 201, texto: 'Motor de muy alta potencia, uso profesional o deportivo' },
    ];

    function getEquivalencia(kw) {
      const match = equivalencias.find(e => kw >= e.desde && kw < e.hasta);
      return match ? match.texto : '';
    }

    function updateSlider(value) {
      const kw = parseInt(value, 10);
      const esObligatorio = kw >= UMBRAL;
      const pct = ((kw - MIN) / (MAX - MIN)) * 100;
      const umbralPct = ((UMBRAL - MIN) / (MAX - MIN)) * 100;

      // Update value display
      if (valorDisplay) {
        valorDisplay.textContent = kw;
        valorDisplay.classList.toggle('tc-obligatorio', esObligatorio);
      }

      // Update slider class
      slider.classList.toggle('tc-obligatorio', esObligatorio);

      // Update estado
      if (estadoContainer) {
        estadoContainer.className = 'tc-slider-estado ' +
          (esObligatorio ? 'tc-slider-estado--obligatorio' : 'tc-slider-estado--optativo');
      }
      if (estadoTexto) {
        estadoTexto.textContent = esObligatorio ? 'Inscripción obligatoria' : 'Inscripción optativa';
      }

      // Update track fills
      if (trackOptativo) {
        const optWidth = Math.min(pct, umbralPct);
        trackOptativo.style.width = optWidth + '%';
      }
      if (trackObligatorio) {
        if (pct > umbralPct) {
          trackObligatorio.style.left = umbralPct + '%';
          trackObligatorio.style.width = (pct - umbralPct) + '%';
          trackObligatorio.style.display = 'block';
        } else {
          trackObligatorio.style.display = 'none';
        }
      }
      if (trackRemaining) {
        trackRemaining.style.left = pct + '%';
        trackRemaining.style.width = (100 - pct) + '%';
      }

      // Update equivalencia
      if (equivDisplay) {
        const equiv = getEquivalencia(kw);
        equivDisplay.innerHTML = equiv
          ? `<strong>${kw} kW</strong> — ${equiv}`
          : '';
      }
    }

    slider.addEventListener('input', (e) => updateSlider(e.target.value));

    // Set umbral marker position
    const umbralMarker = $('.tc-slider-umbral');
    if (umbralMarker) {
      const umbralPct = ((UMBRAL - MIN) / (MAX - MIN)) * 100;
      umbralMarker.style.left = umbralPct + '%';
    }

    // Initial update
    updateSlider(slider.value);
  }

  /* -------------------------------------------------------
     4. ¿QUÉ ME CAMBIA? — Herramienta personalizada
     ------------------------------------------------------- */
  function initTool() {
    const btns = $$('.tc-tool-btn');
    const resultados = $$('.tc-tool-resultado');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const isActive = btn.getAttribute('aria-pressed') === 'true';

        // Deactivate all
        btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
        resultados.forEach(r => r.classList.remove('tc-active'));

        // If clicking the same button, just close
        if (isActive) return;

        // Activate clicked
        btn.setAttribute('aria-pressed', 'true');
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('tc-active');
        }
      });
    });
  }

  /* -------------------------------------------------------
     5. TIMELINE — Scroll reveal
     ------------------------------------------------------- */
  function initTimeline() {
    const items = $$('.tc-timeline-item');
    if (!items.length) return;

    observeEntrance(items, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
  }

  /* -------------------------------------------------------
     6. EXPLORADOR DE CAMBIOS — Tabs
     ------------------------------------------------------- */
  function initExplorer() {
    const tabs = $$('.tc-explorer-tab');
    const panels = $$('.tc-explorer-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');

        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');

        panels.forEach(p => p.setAttribute('aria-hidden', 'true'));
        const target = document.getElementById(targetId);
        if (target) target.setAttribute('aria-hidden', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     7. MICROINTERACCIONES
     ------------------------------------------------------- */
  function initMicrointeracciones() {
    // Dato revelable
    $$('.tc-dato-revelable').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.add('tc-revelado');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.classList.add('tc-revelado');
        }
      });
    });

    // Counter animation
    $$('.tc-numero-animado[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let animated = false;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateCounter(el, target, suffix);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(el);
    });

    // Card expandible (using <details>)
    // Native behavior, no JS needed
  }

  function animateCounter(el, target, suffix) {
    const duration = 1200;
    const start = performance.now();

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target + suffix;
      return;
    }

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------
     8. SCROLL PROGRESS BAR
     ------------------------------------------------------- */
  function initScrollProgress() {
    const bar = $('.tc-scroll-progress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* -------------------------------------------------------
     8b. RANKING TABS ("Más popular": Notas / Protagonistas)
     ------------------------------------------------------- */
  function initRankingTabs() {
    const tabNotas = $('#rnk-notas-tab');
    const tabProtagonistas = $('#rnk-protagonistas-tab');
    const rnkNotas = $('#rnk-notas');
    const rnkProtagonistas = $('#rnk-protagonistas');

    if (!tabNotas || !tabProtagonistas || !rnkNotas || !rnkProtagonistas) return;

    tabNotas.addEventListener('click', () => {
      tabNotas.classList.add('active');
      tabProtagonistas.classList.remove('active');
      rnkNotas.classList.remove('hide');
      rnkProtagonistas.classList.add('hide');
    });

    tabProtagonistas.addEventListener('click', () => {
      tabProtagonistas.classList.add('active');
      tabNotas.classList.remove('active');
      rnkProtagonistas.classList.remove('hide');
      rnkNotas.classList.add('hide');
    });
  }

  /* -------------------------------------------------------
     9. INIT
     ------------------------------------------------------- */
  function init() {
    initCambiosOverview();
    initComparador();
    initSlider();
    initTool();
    initTimeline();
    initExplorer();
    initMicrointeracciones();
    initScrollProgress();
    initRankingTabs();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
