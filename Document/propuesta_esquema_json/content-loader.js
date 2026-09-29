/**
 * content-loader.js
 * Módulo de Integración Dinámica y Renderizado DOM
 * Proyecto: Aplicativo para la Gestión de la Innovación Pública (PIIP) - AGROIDEAS
 * 
 * Vincula la interfaz HTML con la API StorageService.js, poblando formularios,
 * tablas dinámicas (DataTables.js), pizarras de post-its, matrices multicriterio
 * y gestionando el autoguardado Local-First y el breadcrumb de trazabilidad.
 */

const ContentLoader = (function () {
  'use strict';

  // Mapa de Claves de Herramienta hacia StorageKeys
  const TOOL_MAP = {
    'H01': 'H01_ObservacionAEIOU',
    'H02': 'H02_MapaEmpatia',
    'H03': 'H03_EncuestasCampo',
    'H04': 'H04_FichaPersona',
    'H05': 'H05_MuroHallazgos',
    'H06': 'H06_DefinicionDesafioHMW',
    'H07': 'H07_LluviaIdeas',
    'H08': 'H08_MatrizPriorizacion',
    'H09': 'H09_PrototipadoRapido',
    'H10': 'H10_PlanAccion',
    'H11': 'H11_MatrizRiesgos'
  };

  /**
   * Inicialización del cargador de contenidos
   */
  function init() {
    console.log('[ContentLoader] Inicializando integrador dinámico UI...');
    
    // 1. Asegurar la inicialización del Storage
    if (typeof StorageService !== 'undefined') {
      StorageService.init();
    } else {
      console.error('[ContentLoader] Error: StorageService no está cargado en el DOM.');
      return;
    }

    // 2. Renderizar componentes globales
    renderHeaderTrazabilidad();
    renderBreadcrumbNav();
    renderFooterControls();

    // 3. Detectar la vista activa e inicializar módulo específico
    const navState = StorageService.getNavigationState().NavegacionYTrazabilidad;
    const tipoVista = navState.UbicacionActual.TipoVista;
    const herramientaCodigo = navState.UbicacionActual.HerramientaCodigo;

    if (tipoVista === 'DASHBOARD') {
      initDashboardView();
    } else if (tipoVista === 'HERRAMIENTA_METODOLOGICA') {
      initToolView(herramientaCodigo);
    }

    // 4. Registrar manejadores de eventos globales (Modales, Toasts)
    setupGlobalEventListeners();
  }

  /**
   * Renderiza el encabezado institucional con el proyecto activo
   */
  function renderHeaderTrazabilidad() {
    const activeProject = StorageService.getActiveProject();
    const headerTitleEl = document.getElementById('project-active-title');
    const headerCodeEl = document.getElementById('project-active-code');
    const headerUnitEl = document.getElementById('project-active-unit');
    const progressBarEl = document.getElementById('global-progress-bar');
    const progressTextEl = document.getElementById('global-progress-text');

    if (!activeProject) return;

    if (headerTitleEl) headerTitleEl.textContent = activeProject.title;
    if (headerCodeEl) headerCodeEl.textContent = activeProject.code;
    if (headerUnitEl) headerUnitEl.textContent = activeProject.responsible || 'AGROIDEAS';

    // Recalcular porcentaje global
    const progress = calculateProgressPercentage(activeProject.phases);
    if (progressBarEl) progressBarEl.style.width = `${progress}%`;
    if (progressTextEl) progressTextEl.textContent = `${progress}% Avance`;
  }

  /**
   * Renderiza la barra de navegación relativa (Breadcrumbs y Badges de Fase)
   */
  function renderBreadcrumbNav() {
    const navState = StorageService.getNavigationState().NavegacionYTrazabilidad;
    const breadcrumbContainer = document.getElementById('breadcrumb-nav');

    if (!breadcrumbContainer) return;

    const loc = navState.UbicacionActual;
    const pos = navState.PosicionEnFlujo;
    const phases = navState.EstadoMatrizDobleDiamante;

    const html = `
      <div class="flex items-center justify-between bg-emerald-950 text-white p-3 rounded-lg shadow-md mb-4">
        <div class="flex items-center gap-3">
          <span class="bg-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            ${loc.FaseNombre || 'Portafolio'}
          </span>
          <h2 class="text-sm md:text-base font-semibold">
            ${loc.HerramientaCodigo ? `${loc.HerramientaCodigo}: ${loc.HerramientaNombre}` : loc.VistaTitulo}
          </h2>
        </div>
        <div class="flex items-center gap-2">
          ${renderPhaseBadge('Descubrir', phases.Fase1_Descubrir)}
          ${renderPhaseBadge('Definir', phases.Fase2_Definir)}
          ${renderPhaseBadge('Idear', phases.Fase3_Idear)}
          ${renderPhaseBadge('Entregar', phases.Fase4_Entregar)}
        </div>
      </div>
    `;

    breadcrumbContainer.innerHTML = html;
  }

  /**
   * Helper para Badges de Fase
   */
  function renderPhaseBadge(name, status) {
    let colorClass = 'bg-gray-700 text-gray-300';
    if (status === 'Completado' || status === 'completed') colorClass = 'bg-emerald-500 text-white';
    if (status === 'En Curso' || status === 'active') colorClass = 'bg-amber-500 text-black font-bold animate-pulse';

    return `<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded ${colorClass}">${name}</span>`;
  }

  /**
   * Renderiza el pie de página con botones de flujo (Anterior / Siguiente)
   */
  function renderFooterControls() {
    const footerContainer = document.getElementById('app-footer-controls');
    if (!footerContainer) return;

    const navState = StorageService.getNavigationState().NavegacionYTrazabilidad;
    const pos = navState.PosicionEnFlujo;

    const prevUrl = pos.PasoAnterior ? pos.PasoAnterior.VistaUrl : 'index.html';
    const nextUrl = pos.PasoSiguiente ? pos.PasoSiguiente.VistaUrl : null;

    let html = `
      <div class="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
        <a href="${prevUrl}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-md transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          ${pos.PasoAnterior ? `Anterior: ${pos.PasoAnterior.HerramientaNombre}` : 'Ir al Dashboard'}
        </a>
        <span class="text-xs text-gray-500 font-mono">${pos.EtiquetaSecuencia}</span>
    `;

    if (nextUrl) {
      html += `
        <a href="${nextUrl}" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm">
          Siguiente: ${pos.PasoSiguiente.HerramientaNombre}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      `;
    } else {
      html += `
        <button onclick="ContentLoader.cerrarFaseProyecto()" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-md transition-colors shadow-md">
          Finalizar y Registrar en Portafolio PIIP
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </button>
      `;
    }

    html += `</div>`;
    footerContainer.innerHTML = html;
  }

  /**
   * Inicializa la vista Dashboard General (index.html)
   */
  function initDashboardView() {
    console.log('[ContentLoader] Cargando Dashboard General...');
    const projects = StorageService.getAllProjects();
    const gridContainer = document.getElementById('portfolio-grid');

    if (!gridContainer) return;

    if (projects.length === 0) {
      gridContainer.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">No hay proyectos registrados en el Portafolio.</div>`;
      return;
    }

    gridContainer.innerHTML = projects.map(proj => renderProjectCard(proj)).join('');
  }

  /**
   * Renderiza la tarjeta individual para una iniciativa en el Dashboard
   */
  function renderProjectCard(proj) {
    const progress = calculateProgressPercentage(proj.phases);
    
    return `
      <div class="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ${proj.code}
            </span>
            <span class="text-xs text-gray-400 font-mono">${proj.date}</span>
          </div>
          <h3 class="font-bold text-gray-800 text-base mb-2 line-clamp-2 hover:text-emerald-700 cursor-pointer" onclick="ContentLoader.seleccionarIniciativa('${proj.code}')">
            ${proj.title}
          </h3>
          <p class="text-xs text-gray-600 mb-4 line-clamp-1">
            <strong class="text-gray-700">Responsable:</strong> ${proj.responsible}
          </p>
          
          <div class="grid grid-cols-4 gap-1 mb-4 text-center">
            ${renderPhaseStatusPill('Descubrir', proj.phases.descubrir)}
            ${renderPhaseStatusPill('Definir', proj.phases.definir)}
            ${renderPhaseStatusPill('Idear', proj.phases.idear)}
            ${renderPhaseStatusPill('Entregar', proj.phases.entregar)}
          </div>
        </div>

        <div>
          <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div class="bg-emerald-600 h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500">${progress}% Completado</span>
            <button onclick="ContentLoader.seleccionarIniciativa('${proj.code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md transition-colors">
              Abrir Cuaderno
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Helper para pastillas de estado en tarjetas
   */
  function renderPhaseStatusPill(name, status) {
    let bg = 'bg-gray-100 text-gray-400';
    if (status === 'completed' || status === 'Completado') bg = 'bg-emerald-100 text-emerald-800 font-bold';
    if (status === 'active' || status === 'En Curso') bg = 'bg-amber-100 text-amber-900 font-bold';

    return `<div class="text-[9px] uppercase px-1 py-1 rounded ${bg}">${name}</div>`;
  }

  /**
   * Selección de Iniciativa desde el Dashboard
   */
  function seleccionarIniciativa(code) {
    console.log(`[ContentLoader] Seleccionando iniciativa activa: ${code}`);
    StorageService.setActiveProjectCode(code);
    
    // Redirigir a la primera herramienta
    window.location.href = '01-observacion.html';
  }

  /**
   * Inicializa la vista de una herramienta específica (H01 al H11)
   */
  function initToolView(toolCode) {
    console.log(`[ContentLoader] Inicializando vista de herramienta: ${toolCode}`);
    const activeProjectCode = StorageService.getActiveProjectCode();
    const storageKey = TOOL_MAP[toolCode];

    if (!storageKey) {
      console.warn(`[ContentLoader] No se encontró clave de almacenamiento para ${toolCode}`);
      return;
    }

    const entries = StorageService.getToolEntries(storageKey, activeProjectCode);
    console.log(`[ContentLoader] ${entries.length} registros cargados para ${toolCode} (${activeProjectCode})`);

    // Renderizar según herramienta
    switch (toolCode) {
      case 'H01': renderAEIOUView(entries); break;
      case 'H02': renderMapaEmpatiaView(entries); break;
      case 'H05': renderMuroHallazgosView(entries); break;
      case 'H08': renderMatrizPriorizacionView(entries); break;
      default:
        renderGenericFormAndTable(toolCode, entries);
        break;
    }

    setupFormAutoSave(toolCode, storageKey);
  }

  /**
   * Renderiza la vista H01: Observación AEIOU
   */
  function renderAEIOUView(entries) {
    const listEl = document.getElementById('aeiou-entries-list');
    if (!listEl) return;

    if (entries.length === 0) {
      listEl.innerHTML = `<p class="text-sm text-gray-400 italic py-4">No hay observaciones registradas aún.</p>`;
      return;
    }

    listEl.innerHTML = entries.map(item => `
      <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">${item.category || 'AEIOU'}</span>
          <span class="text-[10px] text-gray-400 font-mono">${item.date || ''}</span>
        </div>
        <p class="text-xs text-gray-700">${item.observation || item.activity || ''}</p>
      </div>
    `).join('');
  }

  /**
   * Renderiza la vista H02: Mapa de Empatía
   */
  function renderMapaEmpatiaView(entries) {
    ['says', 'does', 'thinks', 'feels', 'pains', 'gains'].forEach(quadrant => {
      const container = document.getElementById(`quadrant-${quadrant}`);
      if (!container) return;

      const items = entries.filter(e => e.quadrant === quadrant || e[quadrant]);
      container.innerHTML = items.map(i => `
        <div class="p-2 bg-amber-50 border border-amber-200 text-xs rounded mb-1 text-amber-900 shadow-2xs">
          ${i.text || i[quadrant]}
        </div>
      `).join('');
    });
  }

  /**
   * Renderiza la vista H05: Muro de Hallazgos (Research Wall)
   */
  function renderMuroHallazgosView(entries) {
    const wallContainer = document.getElementById('research-wall-container');
    if (!wallContainer) return;

    wallContainer.innerHTML = entries.map(item => `
      <div class="p-3 bg-amber-100 border-t-4 border-amber-500 rounded-b shadow-sm text-xs font-sans text-gray-800 transform rotate-1 hover:rotate-0 transition-transform">
        <div class="font-bold text-amber-900 mb-1">${item.clusterName || 'Insight'}</div>
        <p class="mb-2">${item.insightText || item.finding}</p>
        <div class="text-[9px] text-amber-700 font-mono text-right">${item.author || 'Facilitador'}</div>
      </div>
    `).join('');
  }

  /**
   * Renderiza la vista H08: Matriz de Priorización de Ideas (DataTables.js)
   */
  function renderMatrizPriorizacionView(entries) {
    const tableBody = document.getElementById('matriz-priorizacion-tbody');
    if (!tableBody) return;

    // Ordenar de mayor a menor puntaje
    const sorted = [...entries].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

    tableBody.innerHTML = sorted.map((item, idx) => `
      <tr class="${idx === 0 ? 'bg-emerald-50 font-bold border-l-4 border-emerald-600' : 'hover:bg-gray-50'} border-b">
        <td class="p-3 text-xs text-center">${idx + 1}</td>
        <td class="p-3 text-xs">${item.ideaTitle || item.title}</td>
        <td class="p-3 text-xs text-center">${item.deseabilityScore || item.deseability || 0}</td>
        <td class="p-3 text-xs text-center">${item.feasibilityScore || item.feasibility || 0}</td>
        <td class="p-3 text-xs text-center">${item.viabilityScore || item.viability || 0}</td>
        <td class="p-3 text-xs text-center">${item.impactScore || item.impact || 0}</td>
        <td class="p-3 text-xs text-center font-mono font-bold text-emerald-700">${item.totalScore || 0}</td>
        <td class="p-3 text-xs text-center">
          ${idx === 0 ? '<span class="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Idea Ganadora</span>' : '<span class="text-gray-400 text-[10px]">Evaluada</span>'}
        </td>
      </tr>
    `).join('');
  }

  /**
   * Renderizador genérico de tabla para herramientas secundarias
   */
  function renderGenericFormAndTable(toolCode, entries) {
    const container = document.getElementById(`generic-entries-${toolCode}`);
    if (!container) return;

    container.innerHTML = entries.map((e, idx) => `
      <div class="p-3 border-b border-gray-100 flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-gray-700">#${idx + 1}</span>
          <span class="ml-2 text-gray-900">${e.title || e.activity || e.name || JSON.stringify(e)}</span>
        </div>
        <span class="text-[10px] text-gray-400 font-mono">${e.date || ''}</span>
      </div>
    `).join('');
  }

  /**
   * Configura el autoguardado de formularios para una herramienta
   */
  function setupFormAutoSave(toolCode, storageKey) {
    const formEl = document.getElementById(`form-${toolCode.toLowerCase()}`);
    if (!formEl) return;

    formEl.addEventListener('submit', function (evt) {
      evt.preventDefault();
      const formData = new FormData(formEl);
      const entryData = {};

      formData.forEach((value, key) => { entryData[key] = value; });
      entryData.date = new Date().toISOString().split('T')[0];

      StorageService.addToolEntry(storageKey, entryData);
      showToast('Registro guardado exitosamente en LocalStorage.');
      
      formEl.reset();
      initToolView(toolCode); // Re-renderizar
    });
  }

  /**
   * Cierre formal de fase y reporte
   */
  function cerrarFaseProyecto() {
    const activeProject = StorageService.getActiveProject();
    if (!activeProject) return;

    StorageService.updateProjectPhaseStatus(activeProject.code, 'entregar', 'completed');
    alert(`Iniciativa ${activeProject.code} completada y registrada exitosamente en el Portafolio PIIP.`);
    window.location.href = 'index.html';
  }

  /**
   * Helper para calcular porcentaje global de avance
   */
  function calculateProgressPercentage(phases) {
    if (!phases) return 0;
    const values = Object.values(phases);
    const completed = values.filter(v => v === 'completed' || v === 'Completado').length;
    return Math.round((completed / 4) * 100);
  }

  /**
   * Notificaciones flotantes (Toasts)
   */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-emerald-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg z-50 animate-bounce';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /**
   * Event Listeners Globales
   */
  function setupGlobalEventListeners() {
    // Manejo de Modal Nuevo Proyecto
    const btnNewProject = document.getElementById('btn-new-project');
    const modalNewProject = document.getElementById('modal-new-project');
    const formNewProject = document.getElementById('form-new-project');

    if (btnNewProject && modalNewProject) {
      btnNewProject.addEventListener('click', () => modalNewProject.classList.remove('hidden'));
    }

    if (formNewProject) {
      formNewProject.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(formNewProject);
        const newProj = {
          code: formData.get('code'),
          title: formData.get('title'),
          responsible: formData.get('responsible'),
          contact: formData.get('contact'),
          date: formData.get('date') || new Date().toISOString().split('T')[0],
          phases: {
            descubrir: formData.get('status_descubrir') || 'active',
            definir: 'pending',
            idear: 'pending',
            entregar: 'pending'
          }
        };

        StorageService.saveProject(newProj);
        modalNewProject.classList.add('hidden');
        showToast('Iniciativa registrada en el Portafolio.');
        initDashboardView();
      });
    }
  }

  // API Pública
  return {
    init: init,
    seleccionarIniciativa: seleccionarIniciativa,
    cerrarFaseProyecto: cerrarFaseProyecto
  };

})();

// Autoinvocación al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
  ContentLoader.init();
});
