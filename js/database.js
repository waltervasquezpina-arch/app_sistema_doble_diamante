/**
 * ==========================================================================
 * AGROIDEAS PIIP - Capa de Datos (LocalStorage CRUD)
 *
 * Los datos semilla viven en: data/seed.js → const PIIP_SEED_DATA
 * Este archivo SOLO contiene la lógica de persistencia y CRUD.
 * Para modificar los datos del sistema, editar data/seed.js.
 * ========================================================================== */

const DB_KEY = 'piip_agroideas_db';

// Guard: verificar que seed.js fue cargado antes que database.js
if (typeof PIIP_SEED_DATA === 'undefined') {
    throw new Error('[PIIP DB] ERROR CRÍTICO: data/seed.js debe cargarse ANTES que database.js. ' +
        'Revisa el orden de los <script> en tu HTML.');
}

// Alias local para compatibilidad interna
const initialState = PIIP_SEED_DATA;




// Inicializar base de datos (con migración de esquema suave + detección de corrupción)
// IMPORTANTE: Al actualizar seed.js, incrementar SCHEMA_VERSION para forzar la migración.
const SCHEMA_VERSION = PIIP_SEED_DATA._schemaVersion || 4;

function initDatabase() {
    const existing = localStorage.getItem(DB_KEY);

    if (!existing) {
        // Primera ejecución: cargar semillas completas
        const seed = { ...initialState, _schemaVersion: SCHEMA_VERSION };
        localStorage.setItem(DB_KEY, JSON.stringify(seed));
        console.log('[PIIP DB] Base de datos inicializada con semillas completas del Doble Diamante.');
        return;
    }

    const db = JSON.parse(existing);

    // Si la versión de esquema no coincide o no existe, forzar reset limpio
    // Esto maneja datos corruptos del prototipo SPA anterior
    if (!db._schemaVersion || db._schemaVersion < SCHEMA_VERSION) {
        const freshSeed = { ...initialState, _schemaVersion: SCHEMA_VERSION };
        localStorage.setItem(DB_KEY, JSON.stringify(freshSeed));
        console.log(`[PIIP DB] Actualización de esquema v${SCHEMA_VERSION}: datos semilla aplicados correctamente.`);
        return;
    }

    // Migración suave: añadir colecciones faltantes sin borrar datos del usuario
    let migrated = false;

    const collections = ['aeiou', 'empathyMap', 'surveys', 'personas', 'desafios', 'brainstorming', 'prototypes', 'actionPlans'];
    for (const key of collections) {
        if (db[key] === undefined || db[key] === null) {
            db[key] = initialState[key];
            migrated = true;
            console.log(`[PIIP DB] Migración: colección "${key}" añadida.`);
        }
    }

    // Migrar el campo "phases" en los proyectos existentes
    if (db.projects) {
        db.projects.forEach(p => {
            if (!p.phases) {
                p.phases = { descubrir: 'completed', definir: 'active', idear: 'pending', entregar: 'pending' };
                migrated = true;
            }
        });
    }

    if (migrated) {
        db._schemaVersion = SCHEMA_VERSION;
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        console.log('[PIIP DB] Migración de esquema completada correctamente.');
    }
}


// Helper: Obtener base de datos completa
function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY));
}

// Helper: Guardar base de datos completa
function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// Helper: Resetear a estado semilla (útil para QA y pruebas)
function resetDatabase() {
    localStorage.setItem(DB_KEY, JSON.stringify(initialState));
    console.log('[PIIP DB] Base de datos restablecida a estado semilla inicial.');
}


// ==========================================================================
// Métodos CRUD por Módulo / Herramienta
// ==========================================================================

// Proyectos y Trazabilidad de Fases
function obtenerProyectos() {
    return getDB().projects;
}

function guardarProyecto(proyecto) {
    const db = getDB();
    const newId = db.projects.length ? db.projects[db.projects.length - 1].id + 1 : 1;
    
    // Determinar estado legible inicial en base a fases
    let status = 'Fase 1: Descubrir';
    const phases = proyecto.phases || { descubrir: 'active', definir: 'pending', idear: 'pending', entregar: 'pending' };
    if (phases.entregar === 'completed') status = 'Fase 4: Entregar (Completado)';
    else if (phases.entregar === 'active') status = 'Fase 4: Entregar';
    else if (phases.idear === 'active') status = 'Fase 3: Idear';
    else if (phases.definir === 'active') status = 'Fase 2: Definir';
    
    const newProject = { 
        id: newId, 
        code: proyecto.code,
        title: proyecto.title,
        status: status,
        responsible: proyecto.responsible,
        contact: proyecto.contact,
        date: proyecto.date,
        phases: phases
    };
    db.projects.push(newProject);
    saveDB(db);
    return newProject;
}

function actualizarProyecto(projectId, proyecto) {
    const db = getDB();
    const idx = db.projects.findIndex(p => p.id === parseInt(projectId));
    if (idx !== -1) {
        let status = 'Fase 1: Descubrir';
        const phases = proyecto.phases || db.projects[idx].phases;
        if (phases.entregar === 'completed') status = 'Fase 4: Entregar (Completado)';
        else if (phases.entregar === 'active') status = 'Fase 4: Entregar';
        else if (phases.idear === 'active') status = 'Fase 3: Idear';
        else if (phases.definir === 'active') status = 'Fase 2: Definir';

        db.projects[idx] = { 
            ...db.projects[idx], 
            code: proyecto.code,
            title: proyecto.title,
            status: status,
            responsible: proyecto.responsible,
            contact: proyecto.contact,
            date: proyecto.date,
            phases: phases
        };
        saveDB(db);
        return db.projects[idx];
    }
    return null;
}

function eliminarProyecto(projectId) {
    const db = getDB();
    db.projects = db.projects.filter(p => p.id !== parseInt(projectId));
    saveDB(db);
}

function obtenerProyectoActivoId() {
    const activeId = localStorage.getItem('piip_active_project_id');
    return activeId ? parseInt(activeId) : 1;
}

function establecerProyectoActivoId(id) {
    localStorage.setItem('piip_active_project_id', parseInt(id));
}

function actualizarFasesProyecto(projectId, phases) {
    const db = getDB();
    const project = db.projects.find(p => p.id === parseInt(projectId));
    if (project) {
        project.phases = { ...project.phases, ...phases };
        
        // Ajustar estado legible según fases
        if (phases.entregar === 'completed') project.status = 'Fase 4: Entregar (Completado)';
        else if (phases.entregar === 'active') project.status = 'Fase 4: Entregar';
        else if (phases.idear === 'active') project.status = 'Fase 3: Idear';
        else if (phases.definir === 'active') project.status = 'Fase 2: Definir';
        else project.status = 'Fase 1: Descubrir';
        
        saveDB(db);
    }
    return project;
}

// H1: Observación AEIOU
function guardarInsight(insight) {
    const db = getDB();
    const newId = db.insights.length ? db.insights[db.insights.length - 1].id + 1 : 1;
    const newInsight = { id: newId, ...insight };
    db.insights.push(newInsight);
    saveDB(db);
    return newInsight;
}

function obtenerInsights() {
    return getDB().insights;
}

// Guardar observación directa de H1
function guardarObservacionAEIOU(obs) {
    const db = getDB();
    const newId = db.aeiou.length ? db.aeiou[db.aeiou.length - 1].id + 1 : 1;
    const newObs = { id: newId, ...obs };
    db.aeiou.push(newObs);
    saveDB(db);
    return newObs;
}

function obtenerObservacionesAEIOU() {
    return getDB().aeiou;
}

// H2: Mapa de Empatía
function guardarMapaEmpatia(mapa) {
    const db = getDB();
    if (!db.empathyMaps) {
        db.empathyMaps = [];
    }
    if (db.empathyMap && db.empathyMaps.length === 0) {
        db.empathyMaps.push(db.empathyMap);
        delete db.empathyMap;
    }
    const activeId = obtenerProyectoActivoId();
    const idx = db.empathyMaps.findIndex(m => m.projectId === activeId);
    const newMap = { projectId: activeId, ...mapa };
    if (idx !== -1) {
        db.empathyMaps[idx] = newMap;
    } else {
        db.empathyMaps.push(newMap);
    }
    saveDB(db);
    return newMap;
}

function obtenerMapaEmpatia() {
    const db = getDB();
    if (!db.empathyMaps) {
        db.empathyMaps = [];
    }
    if (db.empathyMap && db.empathyMaps.length === 0) {
        db.empathyMaps.push(db.empathyMap);
    }
    const activeId = obtenerProyectoActivoId();
    return db.empathyMaps.find(m => m.projectId === activeId) || null;
}

// H3: Encuestas
function guardarEncuesta(encuesta) {
    const db = getDB();
    const newId = db.surveys.length ? db.surveys[db.surveys.length - 1].id + 1 : 1;
    
    // Análisis simple de sentimiento automático
    let sentiment = 'Neutro';
    const commentsLower = (encuesta.comments || '').toLowerCase();
    const positiveWords = ['bueno', 'excelente', 'rápido', 'amable', 'ayuda', 'bien', 'gusta'];
    const negativeWords = ['lento', 'malo', 'demora', 'burocracia', 'complejo', 'pérdida', 'retraso'];
    
    const countPos = positiveWords.filter(word => commentsLower.includes(word)).length;
    const countNeg = negativeWords.filter(word => commentsLower.includes(word)).length;
    
    if (countPos > countNeg) sentiment = 'Positivo';
    else if (countNeg > countPos) sentiment = 'Negativo';

    const newEncuesta = { id: newId, ...encuesta, sentiment };
    db.surveys.push(newEncuesta);
    saveDB(db);
    return newEncuesta;
}

function obtenerEncuestas() {
    return getDB().surveys;
}

// H4: Ficha de Persona
function guardarPersona(persona) {
    const db = getDB();
    const newId = db.personas.length ? db.personas[db.personas.length - 1].id + 1 : 1;
    const newPersona = { id: newId, ...persona };
    db.personas.push(newPersona);
    saveDB(db);
    return newPersona;
}

function obtenerPersonas() {
    return getDB().personas;
}

// H6: Desafío de Innovación (HMW)
function guardarDesafio(desafio) {
    const db = getDB();
    const newId = db.desafios.length ? db.desafios[db.desafios.length - 1].id + 1 : 1;
    const newDesafio = { id: newId, ...desafio };
    db.desafios.push(newDesafio);
    saveDB(db);
    return newDesafio;
}

function obtenerDesafios() {
    return getDB().desafios;
}

// H7: Lluvia de Ideas (Brainstorming)
function guardarBrainstorming(idea) {
    const db = getDB();
    const newId = db.brainstorming.length ? db.brainstorming[db.brainstorming.length - 1].id + 1 : 1;
    const newIdea = { id: newId, ...idea };
    db.brainstorming.push(newIdea);
    saveDB(db);
    return newIdea;
}

function obtenerBrainstormings() {
    return getDB().brainstorming;
}

// H8: Matriz de Priorización (Carga e ideas evaluadas)
function guardarIdea(idea) {
    const db = getDB();
    const newId = db.ideas.length ? db.ideas[db.ideas.length - 1].id + 1 : 1;
    const totalScore = parseInt(idea.impact) + parseInt(idea.viability) + parseInt(idea.feasibility) + parseInt(idea.innovation);
    const newIdea = { id: newId, ...idea, totalScore };
    db.ideas.push(newIdea);
    saveDB(db);
    return newIdea;
}

function obtenerIdeas() {
    return getDB().ideas;
}

// H9: Prototipado Rápido
function guardarPrototipo(prototipo) {
    const db = getDB();
    const newId = db.prototypes.length ? db.prototypes[db.prototypes.length - 1].id + 1 : 1;
    const newPrototipo = { id: newId, ...prototipo };
    db.prototypes.push(newPrototipo);
    saveDB(db);
    return newPrototipo;
}

function obtenerPrototipos() {
    return getDB().prototypes;
}

// H10: Plan de Acción
function guardarPlanAccion(tarea) {
    const db = getDB();
    const newId = db.actionPlans.length ? db.actionPlans[db.actionPlans.length - 1].id + 1 : 1;
    const newTarea = { id: newId, ...tarea };
    db.actionPlans.push(newTarea);
    saveDB(db);
    return newTarea;
}

function obtenerPlanesAccion() {
    return getDB().actionPlans;
}

// H11: Matriz de Riesgos
function guardarRiesgo(riesgo) {
    const db = getDB();
    const newId = db.risks.length ? db.risks[db.risks.length - 1].id + 1 : 1;
    const newRiesgo = { id: newId, ...riesgo };
    db.risks.push(newRiesgo);
    saveDB(db);
    return newRiesgo;
}

function obtenerRiesgos() {
    return getDB().risks;
}

// Métodos CRUD adicionales para Modificar y Eliminar en Fase 4
function eliminarPlanAccion(id) {
    const db = getDB();
    db.actionPlans = db.actionPlans.filter(ap => ap.id !== parseInt(id));
    saveDB(db);
}

function actualizarPlanAccion(id, tarea) {
    const db = getDB();
    const idx = db.actionPlans.findIndex(ap => ap.id === parseInt(id));
    if (idx !== -1) {
        db.actionPlans[idx] = { ...db.actionPlans[idx], ...tarea };
        saveDB(db);
        return db.actionPlans[idx];
    }
    return null;
}

function eliminarRiesgo(id) {
    const db = getDB();
    db.risks = db.risks.filter(r => r.id !== parseInt(id));
    saveDB(db);
}

function actualizarRiesgo(id, riesgo) {
    const db = getDB();
    const idx = db.risks.findIndex(r => r.id === parseInt(id));
    if (idx !== -1) {
        db.risks[idx] = { ...db.risks[idx], ...riesgo };
        saveDB(db);
        return db.risks[idx];
    }
    return null;
}

// Inicializar al importar
initDatabase();
