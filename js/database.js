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




// Inicializar base de datos (con migración de esquema inteligente + preservación de datos)
// Al actualizar seed.js, incrementar SCHEMA_VERSION para aplicar los 13 proyectos y nuevos contratos.
const SCHEMA_VERSION = PIIP_SEED_DATA._schemaVersion || 6;

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

    // Migración de esquema suave si la versión es anterior a SCHEMA_VERSION
    if (!db._schemaVersion || db._schemaVersion < SCHEMA_VERSION) {
        console.log(`[PIIP DB] Migrando base de datos de v${db._schemaVersion || 0} a v${SCHEMA_VERSION}...`);
        
        // 1. Asegurar los 13 proyectos oficiales sin borrar proyectos agregados por el usuario
        if (!db.projects) db.projects = [];
        initialState.projects.forEach(seedProj => {
            const exists = db.projects.some(p => p.code === seedProj.code || p.id === seedProj.id);
            if (!exists) {
                db.projects.push(seedProj);
            }
        });

        // 2. Asegurar campos de fase en todos los proyectos
        db.projects.forEach(p => {
            if (!p.phases) {
                p.phases = { descubrir: 'completed', definir: 'active', idear: 'pending', entregar: 'pending' };
            }
        });

        // 3. Normalizar colección AEIOU con projectCode y metadatos
        if (!db.aeiou) db.aeiou = [];
        initialState.aeiou.forEach(seedAeiou => {
            const exists = db.aeiou.some(a => a.id === seedAeiou.id);
            if (!exists) {
                db.aeiou.push(seedAeiou);
            }
        });
        db.aeiou.forEach(a => {
            if (!a.projectCode && a.projectId) {
                const proj = db.projects.find(p => p.id === a.projectId);
                if (proj) a.projectCode = proj.code;
            }
            if (!a.object && a.objects) a.object = a.objects;
            if (!a.objects && a.object) a.objects = a.object;
            if (!a.user && a.users) a.user = a.users;
            if (!a.users && a.user) a.users = a.user;
            if (!a.observer) a.observer = 'Especialista AGROIDEAS';
            if (!a.observationDate) a.observationDate = a.date || '2026-09-15';
        });

        // 4. Normalizar colección Mapa de Empatía
        if (!db.empathyMaps) db.empathyMaps = [];
        if (db.empathyMap && db.empathyMaps.length === 0) {
            db.empathyMaps.push(db.empathyMap);
        }
        if (initialState.empathyMaps) {
            initialState.empathyMaps.forEach(seedMap => {
                const exists = db.empathyMaps.some(m => m.projectId === seedMap.projectId);
                if (!exists) db.empathyMaps.push(seedMap);
            });
        }
        db.empathyMaps.forEach(m => {
            if (!m.projectCode && m.projectId) {
                const proj = db.projects.find(p => p.id === m.projectId);
                if (proj) m.projectCode = proj.code;
            }
        });

        // 5. Normalizar colección de Encuestas
        if (!db.surveys) db.surveys = [];
        initialState.surveys.forEach(seedSurvey => {
            const exists = db.surveys.some(s => s.id === seedSurvey.id);
            if (!exists) db.surveys.push(seedSurvey);
        });
        db.surveys.forEach(s => {
            if (!s.projectCode && s.projectId) {
                const proj = db.projects.find(p => p.id === s.projectId);
                if (proj) s.projectCode = proj.code;
            }
            if (!s.cooperative && s.respondent) {
                const match = s.respondent.match(/\(([^)]+)\)/);
                if (match) s.cooperative = match[1];
            }
        });

        // 6. Asegurar otras colecciones metodológicas
        const otherCollections = ['personas', 'desafios', 'brainstorming', 'prototypes', 'actionPlans'];
        for (const key of otherCollections) {
            if (db[key] === undefined || db[key] === null) {
                db[key] = initialState[key] || [];
            }
        }

        db._schemaVersion = SCHEMA_VERSION;
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        console.log(`[PIIP DB] Actualización a v${SCHEMA_VERSION} completada con éxito. Registros de usuario conservados.`);
        return;
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

function obtenerProyectoPorId(id) {
    const projects = obtenerProyectos();
    return projects.find(p => p.id === parseInt(id)) || null;
}

function obtenerProyectoPorCodigo(code) {
    const projects = obtenerProyectos();
    return projects.find(p => p.code === code) || null;
}

function obtenerProyectoActivo() {
    const id = obtenerProyectoActivoId();
    return obtenerProyectoPorId(id) || obtenerProyectos()[0] || null;
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

// ==========================================================================
// H01: Observación (Método AEIOU)
// ==========================================================================
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

// Obtener observaciones AEIOU con filtrado por proyecto
// projectFilter: 'active' (default), 'ALL' (todas), o id numérico / código string
function obtenerObservacionesAEIOU(projectFilter = 'active') {
    const db = getDB();
    const aeiouList = db.aeiou || [];

    if (projectFilter === 'ALL' || projectFilter === null) {
        return aeiouList;
    }

    let targetId = null;
    let targetCode = null;

    if (projectFilter === 'active') {
        const activeProj = obtenerProyectoActivo();
        if (activeProj) {
            targetId = activeProj.id;
            targetCode = activeProj.code;
        }
    } else if (typeof projectFilter === 'number') {
        targetId = projectFilter;
        const proj = obtenerProyectoPorId(projectFilter);
        if (proj) targetCode = proj.code;
    } else if (typeof projectFilter === 'string') {
        targetCode = projectFilter;
        const proj = obtenerProyectoPorCodigo(projectFilter);
        if (proj) targetId = proj.id;
    }

    return aeiouList.filter(item => {
        if (targetCode && item.projectCode && item.projectCode === targetCode) return true;
        if (targetId && item.projectId && item.projectId === targetId) return true;
        return false;
    });
}

// Guardar o registrar observación directa de H01
function guardarObservacionAEIOU(obs) {
    const db = getDB();
    if (!db.aeiou) db.aeiou = [];

    const activeProj = obtenerProyectoActivo();
    const projectId = obs.projectId || (activeProj ? activeProj.id : 1);
    const projectCode = obs.projectCode || (activeProj ? activeProj.code : 'PIIP-2026-IN0001');

    const newId = db.aeiou.length ? Math.max(...db.aeiou.map(o => o.id || 0)) + 1 : 1;
    const newObs = {
        id: newId,
        projectId: projectId,
        projectCode: projectCode,
        activity: obs.activity || '',
        environment: obs.environment || '',
        interaction: obs.interaction || '',
        object: obs.object || obs.objects || '',
        objects: obs.object || obs.objects || '',
        user: obs.user || obs.users || '',
        users: obs.user || obs.users || '',
        observer: obs.observer || 'Especialista AGROIDEAS',
        observationDate: obs.observationDate || obs.date || new Date().toISOString().split('T')[0],
        date: obs.observationDate || obs.date || new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };

    db.aeiou.push(newObs);
    saveDB(db);
    return newObs;
}

// Actualizar observación AEIOU existente
function actualizarObservacionAEIOU(obsId, obsData) {
    const db = getDB();
    const index = (db.aeiou || []).findIndex(o => o.id === parseInt(obsId));
    if (index !== -1) {
        db.aeiou[index] = {
            ...db.aeiou[index],
            ...obsData,
            object: obsData.object || obsData.objects || db.aeiou[index].object,
            objects: obsData.object || obsData.objects || db.aeiou[index].objects,
            user: obsData.user || obsData.users || db.aeiou[index].user,
            users: obsData.user || obsData.users || db.aeiou[index].users,
            updatedAt: new Date().toISOString()
        };
        saveDB(db);
        return db.aeiou[index];
    }
    return null;
}

// Eliminar observación AEIOU
function eliminarObservacionAEIOU(obsId) {
    const db = getDB();
    const initialLen = (db.aeiou || []).length;
    db.aeiou = (db.aeiou || []).filter(o => o.id !== parseInt(obsId));
    if (db.aeiou.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

// Precargar ejemplo metodológico AEIOU para un proyecto
function precargarEjemploAEIOU(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        activity: `Supervisión y relevamiento de campo para la iniciativa "${proj.title}".`,
        environment: 'Sede de organización agraria en ámbito rural; espacio comunitario con acceso intermitente a energía y red móvil.',
        interaction: 'Intercambio directo entre facilitador de AGROIDEAS, dirigentes comunales y productores agrarios sobre procedimientos del incentivo.',
        object: 'Cuadernos de actas manuscritos, formatos de solicitud impresos, smartphone con notas y cámara fotográfica.',
        user: 'Directivos de la Organización Agraria, socios productores agrícolas y especialista evaluador de la Unidad Regional.',
        observer: proj.contact || 'Especialista en Innovación - AGROIDEAS',
        observationDate: new Date().toISOString().split('T')[0]
    };

    return guardarObservacionAEIOU(ejemplo);
}

// ==========================================================================
// H02: Mapa de Empatía
// ==========================================================================
function obtenerMapaEmpatia(projectFilter = 'active') {
    const db = getDB();
    if (!db.empathyMaps) db.empathyMaps = [];

    // Migración de compatibility si existe empathyMap legacy suelto
    if (db.empathyMap && db.empathyMaps.length === 0) {
        db.empathyMaps.push(db.empathyMap);
    }

    let targetId = null;
    let targetCode = null;

    if (projectFilter === 'active') {
        const activeProj = obtenerProyectoActivo();
        if (activeProj) {
            targetId = activeProj.id;
            targetCode = activeProj.code;
        }
    } else if (typeof projectFilter === 'number') {
        targetId = projectFilter;
        const proj = obtenerProyectoPorId(projectFilter);
        if (proj) targetCode = proj.code;
    } else if (typeof projectFilter === 'string') {
        targetCode = projectFilter;
        const proj = obtenerProyectoPorCodigo(projectFilter);
        if (proj) targetId = proj.id;
    }

    const found = db.empathyMaps.find(m => {
        if (targetCode && m.projectCode && m.projectCode === targetCode) return true;
        if (targetId && m.projectId && m.projectId === targetId) return true;
        return false;
    });

    return found || null;
}

function guardarMapaEmpatia(mapa, projectFilter = 'active') {
    const db = getDB();
    if (!db.empathyMaps) db.empathyMaps = [];

    let targetId = 1;
    let targetCode = 'PIIP-2026-IN0001';

    if (projectFilter === 'active') {
        const activeProj = obtenerProyectoActivo();
        if (activeProj) {
            targetId = activeProj.id;
            targetCode = activeProj.code;
        }
    } else if (typeof projectFilter === 'number') {
        targetId = projectFilter;
        const proj = obtenerProyectoPorId(projectFilter);
        if (proj) targetCode = proj.code;
    } else if (typeof projectFilter === 'string') {
        targetCode = projectFilter;
        const proj = obtenerProyectoPorCodigo(projectFilter);
        if (proj) targetId = proj.id;
    }

    const idx = db.empathyMaps.findIndex(m => {
        if (targetCode && m.projectCode && m.projectCode === targetCode) return true;
        if (targetId && m.projectId && m.projectId === targetId) return true;
        return false;
    });

    const newMap = {
        projectId: targetId,
        projectCode: targetCode,
        userProfile: mapa.userProfile || 'Productor Agrario / Beneficiario del Programa',
        thinks: mapa.thinks || '',
        feels: mapa.feels || '',
        hears: mapa.hears || '',
        sees: mapa.sees || '',
        says: mapa.says || '',
        does: mapa.does || '',
        pains: mapa.pains || '',
        gains: mapa.gains || '',
        updatedAt: new Date().toISOString()
    };

    if (idx !== -1) {
        db.empathyMaps[idx] = { ...db.empathyMaps[idx], ...newMap };
    } else {
        db.empathyMaps.push(newMap);
    }

    // Mantener sincronizado el alias legacy
    if (targetId === obtenerProyectoActivoId()) {
        db.empathyMap = newMap;
    }

    saveDB(db);
    return newMap;
}

// Precargar ejemplo metodológico de Mapa de Empatía
function precargarEjemploMapaEmpatia(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const ejemplo = {
        userProfile: `Presidente o Directivo de Organización Agraria vinculada a "${proj.title}"`,
        thinks: 'Preocupación por la sostenibilidad del plan de negocios y la lentitud burocrática de los trámites estatales.',
        feels: 'Inseguridad ante procesos digitales complejos y deseo de ver crecer los ingresos de su comunidad.',
        hears: 'Opiniones diversas de socios sobre demoras en desembolsos y noticias de programas de fomento agrario.',
        sees: 'Falta de cobertura de internet en las parcelas y expedientes en papel acumulados en oficinas zonales.',
        says: '"Queremos trabajar de manera moderna y transparente, pero necesitamos capacitaciones prácticas y en nuestro territorio."',
        does: 'Coordina reuniones con los productores comunales, viaja a la capital de provincia para averiguar avances y gestiona actas.',
        pains: 'Pérdida de campañas agrícolas por aprobaciones a destiempo, gastos en transporte y rechazo de documentos por errores formales.',
        gains: 'Aprobación ágil del incentivo de adopción tecnológica, asesoría técnica permanente y monitoreo claro desde su teléfono móvil.'
    };

    return guardarMapaEmpatia(ejemplo, proj.code);
}

// ==========================================================================
// H03: Encuestas de Campo
// ==========================================================================
function guardarEncuesta(encuesta) {
    const db = getDB();
    if (!db.surveys) db.surveys = [];

    const activeProj = obtenerProyectoActivo();
    const projectId = encuesta.projectId || (activeProj ? activeProj.id : 1);
    const projectCode = encuesta.projectCode || (activeProj ? activeProj.code : 'PIIP-2026-IN0001');

    const newId = db.surveys.length ? Math.max(...db.surveys.map(s => s.id || 0)) + 1 : 1;
    
    // Análisis de sentimiento automático en español si no viene definido
    let sentiment = encuesta.sentiment || 'Neutro';
    if (!encuesta.sentiment) {
        const commentsLower = (encuesta.comments || '').toLowerCase();
        const positiveWords = ['bueno', 'excelente', 'rápido', 'amable', 'ayuda', 'bien', 'gusta', 'satisfecho', 'facil', 'fácil', 'ágil', 'agil'];
        const negativeWords = ['lento', 'malo', 'demora', 'burocracia', 'complejo', 'pérdida', 'retraso', 'cae', 'falla', 'costoso', 'difícil', 'dificil'];
        
        const countPos = positiveWords.filter(word => commentsLower.includes(word)).length;
        const countNeg = negativeWords.filter(word => commentsLower.includes(word)).length;
        
        if (countPos > countNeg) sentiment = 'Positivo';
        else if (countNeg > countPos) sentiment = 'Negativo';
    }

    const newEncuesta = {
        id: newId,
        projectId: projectId,
        projectCode: projectCode,
        respondent: encuesta.respondent || 'Productor Anónimo',
        cooperative: encuesta.cooperative || encuesta.organization || 'Organización Agraria de Campo',
        satisfaction: parseInt(encuesta.satisfaction) || 3,
        comments: encuesta.comments || '',
        sentiment: sentiment,
        date: encuesta.date || new Date().toISOString().split('T')[0]
    };

    db.surveys.push(newEncuesta);
    saveDB(db);
    return newEncuesta;
}

function obtenerEncuestas(projectFilter = 'active') {
    const db = getDB();
    const surveysList = db.surveys || [];

    if (projectFilter === 'ALL' || projectFilter === null) {
        return surveysList;
    }

    let targetId = null;
    let targetCode = null;

    if (projectFilter === 'active') {
        const activeProj = obtenerProyectoActivo();
        if (activeProj) {
            targetId = activeProj.id;
            targetCode = activeProj.code;
        }
    } else if (typeof projectFilter === 'number') {
        targetId = projectFilter;
        const proj = obtenerProyectoPorId(projectFilter);
        if (proj) targetCode = proj.code;
    } else if (typeof projectFilter === 'string') {
        targetCode = projectFilter;
        const proj = obtenerProyectoPorCodigo(projectFilter);
        if (proj) targetId = proj.id;
    }

    return surveysList.filter(item => {
        if (targetCode && item.projectCode && item.projectCode === targetCode) return true;
        if (targetId && item.projectId && item.projectId === targetId) return true;
        return false;
    });
}

function eliminarEncuesta(surveyId) {
    const db = getDB();
    const initialLen = (db.surveys || []).length;
    db.surveys = (db.surveys || []).filter(s => s.id !== parseInt(surveyId));
    if (db.surveys.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploEncuesta(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const ejemplos = [
        {
            projectId: proj.id,
            projectCode: proj.code,
            respondent: 'Segundo Quispe Mamani',
            cooperative: 'Cooperativa Agraria de Productores Locales',
            satisfaction: 2,
            comments: 'El trámite demora mucho y el analista no nos responde a tiempo. Necesitamos información más clara en campo.',
            date: new Date().toISOString().split('T')[0]
        },
        {
            projectId: proj.id,
            projectCode: proj.code,
            respondent: 'Rosa Elena Condori',
            cooperative: 'Asociación de Productoras Agropecuarias',
            satisfaction: 4,
            comments: 'Muy buena iniciativa y la capacitación fue de gran ayuda, aunque la plataforma móvil a veces es lenta con poca señal.',
            date: new Date().toISOString().split('T')[0]
        }
    ];

    ejemplos.forEach(ej => guardarEncuesta(ej));
    return obtenerEncuestas(proj.code);
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
