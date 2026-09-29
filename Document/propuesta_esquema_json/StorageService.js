/**
 * StorageService.js
 * Módulo Controlador de Datos y Persistencia Local-First (LocalStorage)
 * Proyecto: Aplicativo para la Gestión de la Innovación Pública (PIIP) - AGROIDEAS
 * Arquitectura: Esquema Unificado far-piip-v3.json
 */

const StorageService = (function () {
  // Claves de almacenamiento en LocalStorage
  const KEYS = {
    UI_STATE: 'piip_ui_navigation_state',
    PROJECTS: 'piip_projects_master',
    TOOLS_DATA: 'piip_tools_collections'
  };

  // Referencia al esquema / seed fallback
  let seedCache = null;

  /**
   * Carga inicial y siembra de datos (Seed) en LocalStorage si está vacío
   */
  async function init(seedUrl = './seed_panoramico_piip.json') {
    try {
      if (!localStorage.getItem(KEYS.PROJECTS) || !localStorage.getItem(KEYS.TOOLS_DATA)) {
        console.log('[StorageService] Inicializando LocalStorage con el dataset semilla...');
        const response = await fetch(seedUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        seedCache = await response.json();

        localStorage.setItem(KEYS.UI_STATE, JSON.stringify(seedCache.NavegacionYTrazabilidad));
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(seedCache.PortafolioPIIP_Coleccion));
        localStorage.setItem(KEYS.TOOLS_DATA, JSON.stringify(seedCache.HerramientasMetodologicas_Coleccion));
        console.log('[StorageService] Dataset inicializado correctamente.');
      } else {
        console.log('[StorageService] LocalStorage ya contiene datos persistidos.');
      }
      return true;
    } catch (error) {
      console.error('[StorageService] Error al inicializar datos:', error);
      return false;
    }
  }

  // ==========================================
  // CAPA A: NAVEGACIÓN Y ESTADO DE SESIÓN (UI)
  // ==========================================

  function getNavigationState() {
    const data = localStorage.getItem(KEYS.UI_STATE);
    return data ? JSON.parse(data) : null;
  }

  function setNavigationState(navState) {
    localStorage.setItem(KEYS.UI_STATE, JSON.stringify(navState));
  }

  function updateActiveView(tipoVista, faseNum, herramientaCodigo, herramientaNombre, vistaUrl, proyectoCodigo = null) {
    const nav = getNavigationState() || {};
    if (proyectoCodigo) nav.IniciativaCodigoActiva = proyectoCodigo;

    nav.UbicacionActual = {
      TipoVista: tipoVista, // 'DASHBOARD' | 'HERRAMIENTA_METODOLOGICA' | 'REPORTE'
      FaseNumero: faseNum,
      HerramientaCodigo: herramientaCodigo,
      HerramientaNombre: herramientaNombre,
      VistaUrl: vistaUrl
    };

    nav.ControlIteracionYTrazabilidad = nav.ControlIteracionYTrazabilidad || {};
    nav.ControlIteracionYTrazabilidad.FechaUltimaActualizacion = new Date().toISOString();

    setNavigationState(nav);
  }

  // ==========================================
  // CAPA B: PORTAFOLIO MAESTRO DE INICIATIVAS
  // ==========================================

  function getAllProjects() {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  }

  function getProjectByCode(projectCode) {
    const projects = getAllProjects();
    return projects.find(p => p.code === projectCode) || null;
  }

  function saveProject(projectData) {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.code === projectData.code);

    if (index >= 0) {
      projects[index] = { ...projects[index], ...projectData };
    } else {
      projectData.id = projects.length > 0 ? Math.max(...projects.map(p => p.id || 0)) + 1 : 1;
      projects.push(projectData);
    }

    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    return projectData;
  }

  function updateProjectPhaseStatus(projectCode, phaseKey, newStatus) {
    const project = getProjectByCode(projectCode);
    if (!project) return false;

    if (!project.phases) project.phases = {};
    project.phases[phaseKey] = newStatus;

    // Recalcular porcentaje global aproximado
    const values = Object.values(project.phases);
    const completedCount = values.filter(v => v === 'completed' || v === 'Completado').length;
    const inProgressCount = values.filter(v => v === 'active' || v === 'En Curso').length;
    project.PorcentajeAvanceGlobal = Math.round(((completedCount * 25) + (inProgressCount * 12.5)) * 10) / 10;

    saveProject(project);
    return true;
  }

  // ==========================================
  // CAPA C: REGISTROS DE HERRAMIENTAS (1 A 11)
  // ==========================================

  function getToolsCollection() {
    const data = localStorage.getItem(KEYS.TOOLS_DATA);
    return data ? JSON.parse(data) : {};
  }

  function saveToolsCollection(collection) {
    localStorage.setItem(KEYS.TOOLS_DATA, JSON.stringify(collection));
  }

  function getToolEntries(toolCollectionKey, projectCode) {
    const collection = getToolsCollection();
    const toolList = collection[toolCollectionKey] || [];
    return toolList.filter(item => item.projectCode === projectCode);
  }

  function addToolEntry(toolCollectionKey, projectCode, entryData) {
    const collection = getToolsCollection();
    if (!collection[toolCollectionKey]) collection[toolCollectionKey] = [];

    const toolList = collection[toolCollectionKey];
    const newId = toolList.length > 0 ? Math.max(...toolList.map(t => t.id || 0)) + 1 : 1;

    const newEntry = {
      id: newId,
      projectCode: projectCode,
      fechaCreacion: new Date().toISOString(),
      ...entryData
    };

    toolList.push(newEntry);
    saveToolsCollection(collection);
    return newEntry;
  }

  function updateToolEntry(toolCollectionKey, entryId, updatedFields) {
    const collection = getToolsCollection();
    const toolList = collection[toolCollectionKey] || [];
    const index = toolList.findIndex(item => item.id === entryId);

    if (index >= 0) {
      toolList[index] = { ...toolList[index], ...updatedFields, fechaModificacion: new Date().toISOString() };
      saveToolsCollection(collection);
      return toolList[index];
    }
    return null;
  }

  function deleteToolEntry(toolCollectionKey, entryId) {
    const collection = getToolsCollection();
    const toolList = collection[toolCollectionKey] || [];
    const filtered = toolList.filter(item => item.id !== entryId);

    if (filtered.length !== toolList.length) {
      collection[toolCollectionKey] = filtered;
      saveToolsCollection(collection);
      return true;
    }
    return false;
  }

  /**
   * Resumen de trazabilidad: Cuántas herramientas tiene registradas un proyecto
   */
  function getProjectTrazabilitySummary(projectCode) {
    const collection = getToolsCollection();
    const summary = {};
    let totalEntries = 0;

    Object.keys(collection).forEach(toolKey => {
      const count = collection[toolKey].filter(item => item.projectCode === projectCode).length;
      summary[toolKey] = count;
      if (count > 0) totalEntries += count;
    });

    return {
      projectCode,
      totalEntries,
      toolBreakdown: summary
    };
  }

  // API Pública del Módulo
  return {
    init,
    getNavigationState,
    setNavigationState,
    updateActiveView,
    getAllProjects,
    getProjectByCode,
    saveProject,
    updateProjectPhaseStatus,
    getToolEntries,
    addToolEntry,
    updateToolEntry,
    deleteToolEntry,
    getProjectTrazabilitySummary,
    exportDataset: () => ({
      NavegacionYTrazabilidad: getNavigationState(),
      PortafolioPIIP_Coleccion: getAllProjects(),
      HerramientasMetodologicas_Coleccion: getToolsCollection()
    }),
    resetToSeed: () => {
      localStorage.removeItem(KEYS.UI_STATE);
      localStorage.removeItem(KEYS.PROJECTS);
      localStorage.removeItem(KEYS.TOOLS_DATA);
      return init();
    }
  };
})();

// Exportación para entornos ES6 o Node si aplica
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
}
