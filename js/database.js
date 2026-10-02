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




// Helper: Cálculo de severidad de riesgo (Semáforo de Gestión de Riesgos)
function calcularNivelRiesgo(prob, imp) {
    const p = String(prob || '').toLowerCase().trim();
    const i = String(imp || '').toLowerCase().trim();
    if ((p === 'alta' && (i === 'alto' || i === 'medio')) || (p === 'media' && i === 'alto')) {
        return 'Alto';
    }
    if ((p === 'baja' && (i === 'bajo' || i === 'medio')) || (p === 'media' && i === 'bajo')) {
        return 'Bajo';
    }
    return 'Medio';
}

// Inicializar base de datos (con migración de esquema inteligente + preservación de datos)
// Al actualizar seed.js, incrementar SCHEMA_VERSION para aplicar los 13 proyectos y nuevos contratos.
const SCHEMA_VERSION = PIIP_SEED_DATA._schemaVersion || 9;

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
                const idx = db.empathyMaps.findIndex(m => (seedMap.id && m.id === seedMap.id) || (m.projectId === seedMap.projectId && m.userProfile === seedMap.userProfile));
                if (idx === -1) {
                    db.empathyMaps.push({ ...seedMap });
                } else {
                    db.empathyMaps[idx] = { ...seedMap, ...db.empathyMaps[idx] };
                    if (!db.empathyMaps[idx].hears) db.empathyMaps[idx].hears = seedMap.hears;
                    if (!db.empathyMaps[idx].sees) db.empathyMaps[idx].sees = seedMap.sees;
                    if (!db.empathyMaps[idx].feels) db.empathyMaps[idx].feels = seedMap.feels;
                }
            });
        }
        db.empathyMaps.forEach((m, i) => {
            if (!m.id) m.id = i + 1;
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

        // 6. Normalizar colección H04: Personas / Arquetipos
        if (!db.personas) db.personas = [];
        if (initialState.personas) {
            initialState.personas.forEach(seedPer => {
                const exists = db.personas.some(p => p.id === seedPer.id);
                if (!exists) db.personas.push(seedPer);
            });
        }
        db.personas.forEach(p => {
            if (!p.projectCode && p.projectId) {
                const proj = db.projects.find(pr => pr.id === p.projectId);
                if (proj) p.projectCode = proj.code;
            }
            if (!p.archetypeName && p.name) p.archetypeName = p.name;
            if (!p.name && p.archetypeName) p.name = p.archetypeName;
            if (!p.demographics && p.age) p.demographics = `${p.age} años`;
            if (!p.bio) p.bio = p.motivation || 'Sin biografía registrada';
            if (!p.goals) p.goals = p.motivation ? [p.motivation] : [];
            if (!p.frustrations) p.frustrations = p.frustration ? [p.frustration] : [];
            if (!p.techTechSavviness) p.techTechSavviness = 'Medio';
        });

        // 7. Normalizar colección H05: Insights / Muro de Hallazgos
        if (!db.insights) db.insights = [];
        if (initialState.insights) {
            initialState.insights.forEach(seedIns => {
                const exists = db.insights.some(i => i.id === seedIns.id);
                if (!exists) db.insights.push(seedIns);
            });
        }
        db.insights.forEach(i => {
            if (!i.projectCode && i.projectId) {
                const proj = db.projects.find(pr => pr.id === i.projectId);
                if (proj) i.projectCode = proj.code;
            }
            if (!i.clusterCategory) i.clusterCategory = 'General';
            if (!i.findingTitle && i.title) i.findingTitle = i.title;
            if (!i.title && i.findingTitle) i.title = i.findingTitle;
            if (!i.evidenceText && i.text) i.evidenceText = i.text;
            if (!i.text && i.evidenceText) i.text = i.evidenceText;
            if (!i.sourceTool) i.sourceTool = 'Investigación de Campo';
            if (!i.priority) i.priority = 'Alta';
            if (!i.type) i.type = 'Muro';
        });

        // 8. Normalizar colección H06: Desafíos HMW
        if (!db.desafios) db.desafios = [];
        if (initialState.desafios) {
            initialState.desafios.forEach(seedDes => {
                const exists = db.desafios.some(d => d.id === seedDes.id);
                if (!exists) db.desafios.push(seedDes);
            });
        }
        db.desafios.forEach(d => {
            if (!d.projectCode && d.projectId) {
                const proj = db.projects.find(pr => pr.id === d.projectId);
                if (proj) d.projectCode = proj.code;
            }
            if (!d.targetUser) d.targetUser = 'los productores y directivos agrarios';
            if (!d.actionGoal) d.actionGoal = 'mejorar la gestión de sus procesos';
            if (!d.constraintOrPain) d.constraintOrPain = 'las limitaciones de conectividad y distancia';
            if (!d.hmwStatement && d.question) d.hmwStatement = d.question;
            if (!d.question && d.hmwStatement) d.question = d.hmwStatement;
            if (!d.status) d.status = 'Aprobado UPP';
        });

        // 9. Asegurar otras colecciones metodológicas
        const otherCollections = ['brainstorming', 'ideas', 'prototypes', 'actionPlans', 'risks'];
        for (const key of otherCollections) {
            if (db[key] === undefined || db[key] === null) {
                db[key] = initialState[key] || [];
            }
        }

        // 10. Normalizar colecciones de Fase 3: Idear (H07, H08, H09)
        if (!Array.isArray(db.brainstorming) || db.brainstorming.length === 0) {
            db.brainstorming = JSON.parse(JSON.stringify(initialState.brainstorming || []));
        } else {
            db.brainstorming.forEach(b => {
                if (!b.projectCode && b.projectId) {
                    const proj = db.projects.find(p => p.id === b.projectId);
                    if (proj) b.projectCode = proj.code;
                }
                if (!b.ideaTitle && b.idea) b.ideaTitle = b.idea;
                if (!b.idea && b.ideaTitle) b.idea = b.ideaTitle;
                if (!b.description) b.description = b.idea || '';
                if (!b.category) b.category = 'Tecnológica';
                if (!b.authorRole) b.authorRole = 'Especialista de Innovación';
                if (typeof b.votesCount !== 'number') b.votesCount = 0;
            });
        }

        if (!Array.isArray(db.ideas) || db.ideas.length === 0) {
            db.ideas = JSON.parse(JSON.stringify(initialState.ideas || []));
        } else {
            db.ideas.forEach(i => {
                if (!i.projectCode && i.projectId) {
                    const proj = db.projects.find(p => p.id === i.projectId);
                    if (proj) i.projectCode = proj.code;
                }
                if (!i.ideaTitle && i.title) i.ideaTitle = i.title;
                if (!i.title && i.ideaTitle) i.title = i.ideaTitle;
                if (typeof i.desirability !== 'number') i.desirability = 4;
                if (typeof i.feasibility !== 'number') i.feasibility = 4;
                if (typeof i.viability !== 'number') i.viability = 4;
                if (typeof i.impact !== 'number') i.impact = 4;
                if (typeof i.totalScore !== 'number') {
                    i.totalScore = i.desirability + i.feasibility + i.viability + i.impact;
                }
                if (typeof i.isWinningIdea !== 'boolean') i.isWinningIdea = false;
            });
        }

        if (!Array.isArray(db.prototypes) || db.prototypes.length === 0) {
            db.prototypes = JSON.parse(JSON.stringify(initialState.prototypes || []));
        } else {
            db.prototypes.forEach(p => {
                if (!p.projectCode && p.projectId) {
                    const proj = db.projects.find(pr => pr.id === p.projectId);
                    if (proj) p.projectCode = proj.code;
                }
                if (!p.prototypeTitle && p.name) p.prototypeTitle = p.name;
                if (!p.name && p.prototypeTitle) p.name = p.prototypeTitle;
                if (!p.prototypeType) p.prototypeType = 'Digital PWA';
                if (!Array.isArray(p.keyFeatures)) p.keyFeatures = ['Flujo conceptual', 'Validación de usuario'];
                if (!p.artifactUrlOrImage && p.imageUrl) p.artifactUrlOrImage = p.imageUrl;
                if (!p.imageUrl && p.artifactUrlOrImage) p.imageUrl = p.artifactUrlOrImage;
                if (!p.description) p.description = '';
                if (!p.testingGoal) p.testingGoal = 'Validar adopción y facilidad de uso por parte del usuario final.';
            });
        }

        // 11. Normalizar colecciones de Fase 4: Entregar (H10: actionPlans, H11: risks)
        if (!Array.isArray(db.actionPlans) || db.actionPlans.length === 0) {
            db.actionPlans = JSON.parse(JSON.stringify(initialState.actionPlans || []));
        } else {
            if (initialState.actionPlans) {
                initialState.actionPlans.forEach(seedPlan => {
                    const exists = db.actionPlans.some(p => p.id === seedPlan.id);
                    if (!exists) db.actionPlans.push(seedPlan);
                });
            }
            db.actionPlans.forEach(p => {
                if (!p.projectCode && p.projectId) {
                    const proj = db.projects.find(pr => pr.id === p.projectId);
                    if (proj) p.projectCode = proj.code;
                }
                if (!p.taskName && p.task) p.taskName = p.task;
                if (!p.task && p.taskName) p.task = p.taskName;
                if (!p.responsibleUnit && p.responsible) p.responsibleUnit = p.responsible;
                if (!p.responsible && p.responsibleUnit) p.responsible = p.responsibleUnit;
                if (!p.deliverable) p.deliverable = 'Entregable formal verificado';
                if (!p.startDate) p.startDate = '2026-03-01';
                if (!p.endDate && p.deadline) p.endDate = p.deadline;
                if (!p.deadline && p.endDate) p.deadline = p.endDate;
                if (!p.status) p.status = 'Pendiente';
            });
        }

        if (!Array.isArray(db.risks) || db.risks.length === 0) {
            db.risks = JSON.parse(JSON.stringify(initialState.risks || []));
        } else {
            if (initialState.risks) {
                initialState.risks.forEach(seedRisk => {
                    const exists = db.risks.some(r => r.id === seedRisk.id);
                    if (!exists) db.risks.push(seedRisk);
                });
            }
            db.risks.forEach(r => {
                if (!r.projectCode && r.projectId) {
                    const proj = db.projects.find(pr => pr.id === r.projectId);
                    if (proj) r.projectCode = proj.code;
                }
                if (!r.riskDescription && r.description) r.riskDescription = r.description;
                if (!r.description && r.riskDescription) r.description = r.riskDescription;
                if (!r.riskType) r.riskType = 'Operativo';
                if (!r.probability) r.probability = 'Media';
                if (!r.impact) r.impact = 'Medio';
                if (!r.level) {
                    r.level = calcularNivelRiesgo(r.probability, r.impact);
                }
                if (!r.mitigationStrategy && r.mitigation) r.mitigationStrategy = r.mitigation;
                if (!r.mitigation && r.mitigationStrategy) r.mitigation = r.mitigationStrategy;
                if (!r.testResult) r.testResult = 'Validación preliminar satisfactoria con usuarios piloto.';
            });
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
    if (!code) return null;
    const clean = String(code).trim().toUpperCase();
    const projects = obtenerProyectos();
    return projects.find(p => {
        const pCode = (p.code || '').toUpperCase();
        return pCode === clean || pCode.endsWith(clean) || clean.endsWith(pCode);
    }) || null;
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

    // Buscar registros en la semilla oficial para este proyecto
    const seedItems = (typeof initialState !== 'undefined' && initialState.aeiou) ?
        initialState.aeiou.filter(item => item.projectCode === proj.code || item.projectId === proj.id) : [];

    if (seedItems.length > 0) {
        const db = getDB();
        if (!db.aeiou) db.aeiou = [];
        let addedCount = 0;

        seedItems.forEach(seedObs => {
            const exists = db.aeiou.some(o => 
                (o.id === seedObs.id && o.projectCode === seedObs.projectCode) ||
                (o.projectCode === seedObs.projectCode && o.activity === seedObs.activity)
            );
            if (!exists) {
                const newId = db.aeiou.length ? Math.max(...db.aeiou.map(o => o.id || 0)) + 1 : 1;
                db.aeiou.push({
                    id: newId,
                    projectId: proj.id,
                    projectCode: proj.code,
                    activity: seedObs.activity || '',
                    environment: seedObs.environment || '',
                    interaction: seedObs.interaction || '',
                    object: seedObs.object || seedObs.objects || '',
                    objects: seedObs.object || seedObs.objects || '',
                    user: seedObs.user || seedObs.users || '',
                    users: seedObs.user || seedObs.users || '',
                    observer: seedObs.observer || 'Especialista AGROIDEAS',
                    observationDate: seedObs.observationDate || seedObs.date || new Date().toISOString().split('T')[0],
                    date: seedObs.observationDate || seedObs.date || new Date().toISOString().split('T')[0],
                    timestamp: new Date().toISOString()
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            saveDB(db);
            return db.aeiou.filter(o => o.projectCode === proj.code || o.projectId === proj.id);
        }
    }

    // Fallback: plantilla individual si no hay semillas específicas
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
// H02: Mapa de Empatía (Soporte multi-arquetipo por iniciativa)
// ==========================================================================
function obtenerMapasEmpatia(projectFilter = 'active') {
    const db = getDB();
    if (!db.empathyMaps) db.empathyMaps = [];

    // Compatibilidad legacy
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

    const list = db.empathyMaps.filter(m => {
        if (targetCode && m.projectCode && m.projectCode === targetCode) return true;
        if (targetId && m.projectId && m.projectId === targetId) return true;
        return false;
    });

    return list;
}

function obtenerMapaEmpatia(projectFilter = 'active', mapId = null) {
    const maps = obtenerMapasEmpatia(projectFilter);
    if (maps.length === 0) return null;
    if (mapId) {
        const found = maps.find(m => m.id === Number(mapId) || m.id === String(mapId));
        if (found) return found;
    }
    return maps[0];
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

    const mapId = mapa.id ? Number(mapa.id) : (mapa._id ? Number(mapa._id) : null);
    
    let idx = -1;
    if (mapId) {
        idx = db.empathyMaps.findIndex(m => m.id === mapId);
    } else if (mapa.userProfile) {
        idx = db.empathyMaps.findIndex(m => {
            const matchesProj = (targetCode && m.projectCode === targetCode) || (targetId && m.projectId === targetId);
            return matchesProj && m.userProfile && m.userProfile.toLowerCase().trim() === mapa.userProfile.toLowerCase().trim();
        });
    }

    const nextId = db.empathyMaps.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

    const newMap = {
        id: idx !== -1 && db.empathyMaps[idx].id ? db.empathyMaps[idx].id : (mapId || nextId),
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

function eliminarMapaEmpatia(id) {
    const db = getDB();
    if (!db.empathyMaps) return false;
    const numId = Number(id);
    const initialLen = db.empathyMaps.length;
    db.empathyMaps = db.empathyMaps.filter(m => Number(m.id) !== numId);
    if (db.empathyMaps.length < initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

// Precargar ejemplo metodológico de Mapa de Empatía
function precargarEjemploMapaEmpatia(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const db = getDB();
    if (!db.empathyMaps) db.empathyMaps = [];

    // Si existen semillas en initialState para este proyecto, cargarlas todas
    if (initialState && initialState.empathyMaps && initialState.empathyMaps.length > 0) {
        let addedCount = 0;
        initialState.empathyMaps.forEach(seedMap => {
            if (seedMap.projectCode === proj.code || seedMap.projectId === proj.id) {
                const idx = db.empathyMaps.findIndex(m => m.id === seedMap.id || (m.projectId === seedMap.projectId && m.userProfile === seedMap.userProfile));
                if (idx === -1) {
                    db.empathyMaps.push({ ...seedMap });
                    addedCount++;
                } else {
                    db.empathyMaps[idx] = { ...seedMap, ...db.empathyMaps[idx] };
                    addedCount++;
                }
            }
        });
        if (addedCount > 0) {
            saveDB(db);
            return db.empathyMaps.filter(m => m.projectCode === proj.code || m.projectId === proj.id);
        }
    }

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

// ==========================================================================
// H04: Ficha de Persona (Arquetipos)
// ==========================================================================
function obtenerPersonas(projectFilter = 'active') {
    const db = getDB();
    const personasList = db.personas || [];

    if (projectFilter === 'ALL' || projectFilter === null) {
        return personasList;
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

    return personasList.filter(item => {
        if (targetCode && item.projectCode && item.projectCode === targetCode) return true;
        if (targetId && item.projectId && item.projectId === targetId) return true;
        return false;
    });
}

function guardarPersona(persona) {
    const db = getDB();
    if (!db.personas) db.personas = [];

    const activeProj = obtenerProyectoActivo();
    const projectId = persona.projectId || (activeProj ? activeProj.id : 1);
    const projectCode = persona.projectCode || (activeProj ? activeProj.code : 'PIIP-2026-IN0001');

    const newId = db.personas.length ? Math.max(...db.personas.map(p => p.id || 0)) + 1 : 1;

    let goalsArr = Array.isArray(persona.goals) ? persona.goals : (persona.goals ? persona.goals.split('\n').map(g => g.trim()).filter(Boolean) : []);
    let frustArr = Array.isArray(persona.frustrations) ? persona.frustrations : (persona.frustrations ? persona.frustrations.split('\n').map(f => f.trim()).filter(Boolean) : []);

    const newPersona = {
        id: newId,
        projectId: projectId,
        projectCode: projectCode,
        archetypeName: persona.archetypeName || persona.name || 'Arquetipo Representativo',
        name: persona.archetypeName || persona.name || 'Arquetipo Representativo',
        role: persona.role || 'Productor Agrario',
        demographics: persona.demographics || (persona.age ? `${persona.age} años` : 'Ámbito rural'),
        age: parseInt(persona.age) || null,
        bio: persona.bio || persona.motivation || '',
        goals: goalsArr.length ? goalsArr : (persona.motivation ? [persona.motivation] : []),
        frustrations: frustArr.length ? frustArr : (persona.frustration ? [persona.frustration] : []),
        motivation: persona.motivation || goalsArr.join('. '),
        frustration: persona.frustration || frustArr.join('. '),
        techTechSavviness: persona.techTechSavviness || 'Medio',
        quote: persona.quote || 'Trabajamos por el desarrollo agropecuario de nuestra comunidad.',
        createdAt: new Date().toISOString()
    };

    db.personas.push(newPersona);
    saveDB(db);
    return newPersona;
}

function eliminarPersona(personaId) {
    const db = getDB();
    const initialLen = (db.personas || []).length;
    db.personas = (db.personas || []).filter(p => p.id !== parseInt(personaId));
    if (db.personas.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploPersona(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const db = getDB();
    if (!db.personas) db.personas = [];

    // Si existen semillas en initialState para este proyecto, cargarlas todas
    if (initialState && initialState.personas && initialState.personas.length > 0) {
        let addedCount = 0;
        initialState.personas.forEach(seedPer => {
            if (seedPer.projectCode === proj.code || seedPer.projectId === proj.id) {
                const idx = db.personas.findIndex(p => p.id === seedPer.id || (p.projectId === seedPer.projectId && p.archetypeName === seedPer.archetypeName));
                if (idx === -1) {
                    db.personas.push({ ...seedPer });
                    addedCount++;
                } else {
                    db.personas[idx] = { ...seedPer, ...db.personas[idx] };
                    addedCount++;
                }
            }
        });
        if (addedCount > 0) {
            saveDB(db);
            return db.personas.filter(p => p.projectCode === proj.code || p.projectId === proj.id);
        }
    }

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        archetypeName: `Mateo Quispe - Líder Agrario de "${proj.title.split(' ')[0]}"`,
        role: 'Presidente de Asociación de Productores',
        demographics: '48 años, ámbito rural, secundaria completa',
        age: 48,
        bio: `Productor agrario con 18 años de experiencia campesina. Lidera su organización comunitaria vinculada a la iniciativa "${proj.title}".`,
        goals: [
            'Acceder a incentivos de adopción tecnológica y reconversión de AGROIDEAS',
            'Mejorar la comercialización directa y rendimientos productivos de sus socios'
        ],
        frustrations: [
            'Trámites engorrosos en papel y demoras en visitas de evaluación',
            'Baja cobertura de internet para reportes y capacitaciones virtuales'
        ],
        techTechSavviness: 'Medio (Maneja WhatsApp para coordinaciones y consultas bancarias básicas)',
        quote: 'Queremos progresar con herramientas claras y apoyo real del Estado en nuestras parcelas.'
    };

    return guardarPersona(ejemplo);
}

// ==========================================================================
// H05: Muro de Hallazgos (Research Wall / Insights)
// ==========================================================================
function obtenerInsights(projectFilter = 'active') {
    const db = getDB();
    const insightsList = db.insights || [];

    if (projectFilter === 'ALL' || projectFilter === null) {
        return insightsList;
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

    return insightsList.filter(item => {
        if (targetCode && item.projectCode && item.projectCode === targetCode) return true;
        if (targetId && item.projectId && item.projectId === targetId) return true;
        return false;
    });
}

function guardarInsight(insight) {
    const db = getDB();
    if (!db.insights) db.insights = [];

    const activeProj = obtenerProyectoActivo();
    const projectId = insight.projectId || (activeProj ? activeProj.id : 1);
    const projectCode = insight.projectCode || (activeProj ? activeProj.code : 'PIIP-2026-IN0001');

    const newId = db.insights.length ? Math.max(...db.insights.map(i => i.id || 0)) + 1 : 1;

    const newInsight = {
        id: newId,
        type: 'Muro',
        projectId: projectId,
        projectCode: projectCode,
        clusterCategory: insight.clusterCategory || 'General',
        findingTitle: insight.findingTitle || insight.title || 'Hallazgo Relevante',
        title: insight.findingTitle || insight.title || 'Hallazgo Relevante',
        evidenceText: insight.evidenceText || insight.text || '',
        text: insight.evidenceText || insight.text || '',
        sourceTool: insight.sourceTool || 'Encuestas + AEIOU',
        priority: insight.priority || 'Alta',
        quote: insight.quote || '',
        image: insight.image || '',
        imageUrl: insight.image || insight.imageUrl || '',
        date: insight.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    db.insights.push(newInsight);
    saveDB(db);
    return newInsight;
}

function eliminarInsight(insightId) {
    const db = getDB();
    const initialLen = (db.insights || []).length;
    db.insights = (db.insights || []).filter(i => i.id !== parseInt(insightId));
    if (db.insights.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploInsight(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        clusterCategory: 'Accesibilidad y Conectividad',
        findingTitle: `Preferencia por formatos descargables offline en "${proj.title.split(' ')[0]}"`,
        evidenceText: 'Los beneficiarios descargan materiales técnicos cuando bajan a la capital distrital y los revisan sin señal en su caserío.',
        sourceTool: 'Encuestas de Campo + AEIOU',
        priority: 'Alta',
        quote: 'Cuando hay wifi en el pueblo guardamos los videos en el celular para verlos en la chacra.',
        date: new Date().toISOString().split('T')[0]
    };

    return guardarInsight(ejemplo);
}

// ==========================================================================
// H06: Definición del Desafío (How Might We - HMW)
// ==========================================================================
function obtenerDesafios(projectFilter = 'active') {
    const db = getDB();
    const desafiosList = db.desafios || [];

    if (projectFilter === 'ALL' || projectFilter === null) {
        return desafiosList;
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

    return desafiosList.filter(item => {
        if (targetCode && item.projectCode && item.projectCode === targetCode) return true;
        if (targetId && item.projectId && item.projectId === targetId) return true;
        return false;
    });
}

function guardarDesafio(desafio) {
    const db = getDB();
    if (!db.desafios) db.desafios = [];

    const activeProj = obtenerProyectoActivo();
    const projectId = desafio.projectId || (activeProj ? activeProj.id : 1);
    const projectCode = desafio.projectCode || (activeProj ? activeProj.code : 'PIIP-2026-IN0001');

    const newId = db.desafios.length ? Math.max(...db.desafios.map(d => d.id || 0)) + 1 : 1;

    let hmwText = (desafio.hmwStatement || desafio.question || '').trim();
    if (hmwText && !hmwText.toLowerCase().startsWith('¿cómo podríamos')) {
        hmwText = `¿Cómo podríamos ${hmwText}`;
    }

    const newDesafio = {
        id: newId,
        projectId: projectId,
        projectCode: projectCode,
        insightId: parseInt(desafio.insightId) || null,
        targetUser: desafio.targetUser || 'los productores y dirigentes de organizaciones agrarias',
        actionGoal: desafio.actionGoal || 'brindarles asistencia técnica y capacitación oportuna',
        constraintOrPain: desafio.constraintOrPain || 'las limitaciones de conectividad y distancia geográfica',
        hmwStatement: hmwText,
        question: hmwText,
        status: desafio.status || 'Borrador',
        createdAt: new Date().toISOString()
    };

    db.desafios.push(newDesafio);
    saveDB(db);
    return newDesafio;
}

function actualizarEstadoDesafio(desafioId, nuevoEstado) {
    const db = getDB();
    const idx = (db.desafios || []).findIndex(d => d.id === parseInt(desafioId));
    if (idx !== -1) {
        db.desafios[idx].status = nuevoEstado;
        db.desafios[idx].updatedAt = new Date().toISOString();
        saveDB(db);
        return db.desafios[idx];
    }
    return null;
}

function eliminarDesafio(desafioId) {
    const db = getDB();
    const initialLen = (db.desafios || []).length;
    db.desafios = (db.desafios || []).filter(d => d.id !== parseInt(desafioId));
    if (db.desafios.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploDesafio(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const insights = obtenerInsights(proj.code);
    const relatedInsightId = insights.length ? insights[0].id : 1;

    const targetUser = 'los directivos y comités técnicos de organizaciones agrarias';
    const actionGoal = `agilizar la implementación de "${proj.title.split(' ')[0]}" de forma descentralizada`;
    const constraintOrPain = 'las limitaciones de conectividad y barreras geográficas en campo';
    const hmw = `¿Cómo podríamos ${actionGoal} para ${targetUser} a pesar de ${constraintOrPain}?`;

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        insightId: relatedInsightId,
        targetUser: targetUser,
        actionGoal: actionGoal,
        constraintOrPain: constraintOrPain,
        hmwStatement: hmw,
        question: hmw,
        status: 'Aprobado UPP'
    };

    return guardarDesafio(ejemplo);
}

// ==========================================================================
// H07: Lluvia de Ideas y Crazy 8's (Brainstorming)
// ==========================================================================
function obtenerBrainstormings(projectFilter = 'active') {
    const db = getDB();
    const all = db.brainstorming || [];
    
    if (projectFilter === 'all') return all;
    
    let targetCode = null;
    let targetId = null;
    
    if (projectFilter === 'active') {
        const active = obtenerProyectoActivo();
        if (active) {
            targetCode = active.code;
            targetId = active.id;
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
    
    if (!targetCode && !targetId) return all;
    
    return all.filter(b => {
        if (targetCode && b.projectCode === targetCode) return true;
        if (targetId && b.projectId === targetId) return true;
        return false;
    });
}

function guardarBrainstorming(idea) {
    const db = getDB();
    if (!db.brainstorming) db.brainstorming = [];
    
    const active = obtenerProyectoActivo();
    const newId = db.brainstorming.length ? Math.max(...db.brainstorming.map(b => b.id || 0)) + 1 : 1;
    
    const newIdea = {
        id: newId,
        projectId: idea.projectId || (active ? active.id : 1),
        projectCode: idea.projectCode || (active ? active.code : 'PIIP-2026-IN0001'),
        desafioId: idea.desafioId ? parseInt(idea.desafioId) : null,
        ideaTitle: idea.ideaTitle || idea.idea || 'Idea sin título',
        idea: idea.idea || idea.ideaTitle || 'Idea sin título',
        description: idea.description || idea.idea || '',
        category: idea.category || 'Tecnológica',
        authorRole: idea.authorRole || 'Especialista de Innovación',
        votesCount: typeof idea.votesCount === 'number' ? idea.votesCount : 0
    };
    
    db.brainstorming.push(newIdea);
    saveDB(db);
    return newIdea;
}

function votarBrainstorming(id) {
    const db = getDB();
    const item = (db.brainstorming || []).find(b => b.id === parseInt(id));
    if (item) {
        item.votesCount = (item.votesCount || 0) + 1;
        saveDB(db);
        return item;
    }
    return null;
}

function eliminarBrainstorming(id) {
    const db = getDB();
    const initialLen = (db.brainstorming || []).length;
    db.brainstorming = (db.brainstorming || []).filter(b => b.id !== parseInt(id));
    if (db.brainstorming.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploBrainstorming(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const desafios = obtenerDesafios(proj.code);
    const desafioId = desafios.length ? desafios[0].id : null;

    const grounded = (initialState.brainstorming || []).find(b => b.projectCode === proj.code || b.projectId === proj.id);

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        desafioId: desafioId,
        ideaTitle: grounded ? grounded.ideaTitle : `Canal digital interactivo y asistido por IA para ${proj.title.split(' ')[0]}`,
        idea: grounded ? grounded.idea : `Canal digital interactivo y asistido por IA para ${proj.title.split(' ')[0]}`,
        description: grounded ? grounded.description : `Plataforma modular con soporte offline y micro-lecciones adaptadas a la realidad de las 12 Unidades Regionales.`,
        category: grounded ? grounded.category : 'Tecnológica',
        authorRole: grounded ? grounded.authorRole : 'Especialista en Innovación UPP',
        votesCount: grounded ? grounded.votesCount : 5
    };

    return guardarBrainstorming(ejemplo);
}

// ==========================================================================
// H08: Matriz de Priorización de Ideas
// ==========================================================================
function obtenerIdeas(projectFilter = 'active') {
    const db = getDB();
    const all = db.ideas || [];
    
    if (projectFilter === 'all') return all;
    
    let targetCode = null;
    let targetId = null;
    
    if (projectFilter === 'active') {
        const active = obtenerProyectoActivo();
        if (active) {
            targetCode = active.code;
            targetId = active.id;
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
    
    if (!targetCode && !targetId) return all;
    
    return all.filter(i => {
        if (targetCode && i.projectCode === targetCode) return true;
        if (targetId && i.projectId === targetId) return true;
        return false;
    });
}

function guardarIdea(idea) {
    const db = getDB();
    if (!db.ideas) db.ideas = [];
    
    const active = obtenerProyectoActivo();
    const newId = db.ideas.length ? Math.max(...db.ideas.map(i => i.id || 0)) + 1 : 1;
    
    const desirability = parseInt(idea.desirability || 4);
    const feasibility = parseInt(idea.feasibility || 4);
    const viability = parseInt(idea.viability || 4);
    const impact = parseInt(idea.impact || 4);
    const innovation = idea.innovation ? parseInt(idea.innovation) : 4;
    const totalScore = desirability + feasibility + viability + impact;
    
    const pCode = idea.projectCode || (active ? active.code : 'PIIP-2026-IN0001');
    const pId = idea.projectId || (active ? active.id : 1);
    const isWinning = !!idea.isWinningIdea;

    // Si se marca como ganadora, desmarcar otras del mismo proyecto
    if (isWinning) {
        db.ideas.forEach(i => {
            if (i.projectCode === pCode || i.projectId === pId) {
                i.isWinningIdea = false;
            }
        });
    }

    const newIdea = {
        id: newId,
        projectId: pId,
        projectCode: pCode,
        ideaId: idea.ideaId ? parseInt(idea.ideaId) : null,
        ideaTitle: idea.ideaTitle || idea.title || 'Idea de Solución Priorizada',
        title: idea.title || idea.ideaTitle || 'Idea de Solución Priorizada',
        desirability: desirability,
        feasibility: feasibility,
        viability: viability,
        impact: impact,
        innovation: innovation,
        totalScore: totalScore,
        isWinningIdea: isWinning
    };
    
    db.ideas.push(newIdea);
    saveDB(db);
    return newIdea;
}

function marcarIdeaGanadora(id) {
    const db = getDB();
    const target = (db.ideas || []).find(i => i.id === parseInt(id));
    if (!target) return null;

    db.ideas.forEach(i => {
        if (i.projectCode === target.projectCode || i.projectId === target.projectId) {
            i.isWinningIdea = (i.id === target.id);
        }
    });

    saveDB(db);
    return target;
}

function eliminarIdea(id) {
    const db = getDB();
    const initialLen = (db.ideas || []).length;
    db.ideas = (db.ideas || []).filter(i => i.id !== parseInt(id));
    if (db.ideas.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploMatriz(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const ideasH07 = obtenerBrainstormings(proj.code);
    const ideaRef = ideasH07.length ? ideasH07[0] : null;

    const grounded = (initialState.ideas || []).find(i => i.projectCode === proj.code || i.projectId === proj.id);

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        ideaId: ideaRef ? ideaRef.id : (grounded ? grounded.ideaId : null),
        ideaTitle: grounded ? grounded.ideaTitle : (ideaRef ? ideaRef.ideaTitle : `Solución integral de automatización para ${proj.title.split(' ')[0]}`),
        title: grounded ? grounded.title : (ideaRef ? ideaRef.ideaTitle : `Solución integral de automatización para ${proj.title.split(' ')[0]}`),
        desirability: grounded ? grounded.desirability : 5,
        feasibility: grounded ? grounded.feasibility : 4,
        viability: grounded ? grounded.viability : 5,
        impact: grounded ? grounded.impact : 5,
        innovation: grounded ? grounded.innovation : 4,
        isWinningIdea: true
    };

    return guardarIdea(ejemplo);
}

// ==========================================================================
// H09: Prototipado Rápido y Storyboard
// ==========================================================================
function obtenerPrototipos(projectFilter = 'active') {
    const db = getDB();
    const all = db.prototypes || [];
    
    if (projectFilter === 'all') return all;
    
    let targetCode = null;
    let targetId = null;
    
    if (projectFilter === 'active') {
        const active = obtenerProyectoActivo();
        if (active) {
            targetCode = active.code;
            targetId = active.id;
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
    
    if (!targetCode && !targetId) return all;
    
    return all.filter(p => {
        if (targetCode && p.projectCode === targetCode) return true;
        if (targetId && p.projectId === targetId) return true;
        return false;
    });
}

function guardarPrototipo(prototipo) {
    const db = getDB();
    if (!db.prototypes) db.prototypes = [];
    
    const active = obtenerProyectoActivo();
    const newId = db.prototypes.length ? Math.max(...db.prototypes.map(p => p.id || 0)) + 1 : 1;
    
    // Normalizar keyFeatures
    let features = [];
    if (Array.isArray(prototipo.keyFeatures)) {
        features = prototipo.keyFeatures.map(f => String(f).trim()).filter(Boolean);
    } else if (typeof prototipo.keyFeatures === 'string') {
        features = prototipo.keyFeatures.split(',').map(f => f.trim()).filter(Boolean);
    }
    if (features.length === 0) {
        features = ['Interacción clave', 'Flujo de usuario validado'];
    }

    const title = prototipo.prototypeTitle || prototipo.name || 'Prototipo Conceptual';
    const imgUrl = prototipo.artifactUrlOrImage || prototipo.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';

    const newPrototipo = {
        id: newId,
        projectId: prototipo.projectId || (active ? active.id : 1),
        projectCode: prototipo.projectCode || (active ? active.code : 'PIIP-2026-IN0001'),
        prototypeTitle: title,
        name: title,
        prototypeType: prototipo.prototypeType || 'Digital PWA',
        keyFeatures: features,
        artifactUrlOrImage: imgUrl,
        imageUrl: imgUrl,
        description: prototipo.description || '',
        testingGoal: prototipo.testingGoal || 'El 80% de los usuarios de prueba debe completar la interacción sin asistencia externa.'
    };
    
    db.prototypes.push(newPrototipo);
    saveDB(db);
    return newPrototipo;
}

function eliminarPrototipo(id) {
    const db = getDB();
    const initialLen = (db.prototypes || []).length;
    db.prototypes = (db.prototypes || []).filter(p => p.id !== parseInt(id));
    if (db.prototypes.length !== initialLen) {
        saveDB(db);
        return true;
    }
    return false;
}

function precargarEjemploPrototipos(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const grounded = (initialState.prototypes || []).find(p => p.projectCode === proj.code || p.projectId === proj.id);

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        prototypeTitle: grounded ? grounded.prototypeTitle : `Prototipo Funcional / PWA para ${proj.title.split(' ')[0]}`,
        name: grounded ? grounded.name : `Prototipo Funcional / PWA para ${proj.title.split(' ')[0]}`,
        prototypeType: grounded ? grounded.prototypeType : 'Digital PWA',
        keyFeatures: grounded ? grounded.keyFeatures : ['Modo offline-first', 'Notificaciones de alerta', 'Sincronización automática'],
        artifactUrlOrImage: grounded ? grounded.artifactUrlOrImage : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
        imageUrl: grounded ? grounded.imageUrl : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
        description: grounded ? grounded.description : `Maqueta de alta fidelidad que simula la interacción del usuario final y el flujo de trabajo descentralizado.`,
        testingGoal: grounded ? grounded.testingGoal : 'El 85% de los evaluadores zonales debe registrar y validar una acción en menos de 2 minutos.'
    };

    return guardarPrototipo(ejemplo);
}

// ==========================================================================
// H10: Plan de Acción y Hoja de Ruta (Roadmap Operativo)
// ==========================================================================

// Helper: Comparación flexible de códigos de proyecto (PIIP-2026-IN0001 vs IN0001)
function projectCodesMatch(codeA, codeB) {
    if (!codeA || !codeB) return false;
    const a = String(codeA).trim().toUpperCase();
    const b = String(codeB).trim().toUpperCase();
    return a === b || a.endsWith(b) || b.endsWith(a);
}

function obtenerPlanesAccion(projectFilter = 'active') {
    const db = getDB();
    const plans = db.actionPlans || [];
    if (!projectFilter || projectFilter === 'all') return plans;

    let proj = null;
    if (projectFilter === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectFilter === 'number') proj = obtenerProyectoPorId(projectFilter);
    else proj = obtenerProyectoPorCodigo(projectFilter);

    if (!proj) {
        return plans.filter(p => projectCodesMatch(p.projectCode, projectFilter));
    }
    return plans.filter(p => projectCodesMatch(p.projectCode, proj.code) || p.projectId === proj.id);
}

function guardarPlanAccion(tarea) {
    const db = getDB();
    if (!db.actionPlans) db.actionPlans = [];
    const newId = db.actionPlans.length ? Math.max(...db.actionPlans.map(p => p.id || 0)) + 1 : 1;
    const activeProj = obtenerProyectoActivo();

    const newTarea = {
        id: newId,
        projectId: tarea.projectId || (activeProj ? activeProj.id : 1),
        projectCode: tarea.projectCode || (activeProj ? activeProj.code : 'IN0001'),
        taskName: tarea.taskName || tarea.task || '',
        task: tarea.taskName || tarea.task || '',
        responsibleUnit: tarea.responsibleUnit || tarea.responsible || '',
        responsible: tarea.responsibleUnit || tarea.responsible || '',
        startDate: tarea.startDate || new Date().toISOString().split('T')[0],
        endDate: tarea.endDate || tarea.deadline || '',
        deadline: tarea.endDate || tarea.deadline || '',
        deliverable: tarea.deliverable || '',
        status: tarea.status || 'Pendiente'
    };

    db.actionPlans.push(newTarea);
    saveDB(db);
    return newTarea;
}

function actualizarPlanAccion(id, tarea) {
    const db = getDB();
    const idx = (db.actionPlans || []).findIndex(ap => ap.id === parseInt(id));
    if (idx !== -1) {
        db.actionPlans[idx] = { 
            ...db.actionPlans[idx], 
            ...tarea,
            task: tarea.taskName || tarea.task || db.actionPlans[idx].task,
            taskName: tarea.taskName || tarea.task || db.actionPlans[idx].taskName,
            responsible: tarea.responsibleUnit || tarea.responsible || db.actionPlans[idx].responsible,
            responsibleUnit: tarea.responsibleUnit || tarea.responsible || db.actionPlans[idx].responsibleUnit,
            deadline: tarea.endDate || tarea.deadline || db.actionPlans[idx].deadline,
            endDate: tarea.endDate || tarea.deadline || db.actionPlans[idx].endDate
        };
        saveDB(db);
        return db.actionPlans[idx];
    }
    return null;
}

function actualizarEstadoPlanAccion(id, nuevoEstado) {
    const db = getDB();
    const idx = (db.actionPlans || []).findIndex(ap => ap.id === parseInt(id));
    if (idx !== -1) {
        db.actionPlans[idx].status = nuevoEstado;
        saveDB(db);
        return db.actionPlans[idx];
    }
    return null;
}

function eliminarPlanAccion(id) {
    const db = getDB();
    if (!db.actionPlans) return;
    db.actionPlans = db.actionPlans.filter(ap => ap.id !== parseInt(id));
    saveDB(db);
}

function precargarEjemploPlanAccion(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const grounded = (initialState.actionPlans || []).find(p => projectCodesMatch(p.projectCode, proj.code) || p.projectId === proj.id);

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        taskName: grounded ? (grounded.taskName || grounded.task) : `Despliegue y marcha blanca para ${proj.title.split(' ')[0]}`,
        responsibleUnit: grounded ? (grounded.responsibleUnit || grounded.responsible) : 'Unidad de Planeamiento y Presupuesto / TI',
        startDate: grounded ? grounded.startDate : '2026-04-01',
        endDate: grounded ? (grounded.endDate || grounded.deadline) : '2026-05-30',
        deliverable: grounded ? grounded.deliverable : 'Informe técnico y acta de puesta en producción',
        status: grounded ? grounded.status : 'Pendiente'
    };

    return guardarPlanAccion(ejemplo);
}

// ==========================================================================
// H11: Matriz de Gestión de Riesgos y Testeo
// ==========================================================================

function obtenerRiesgos(projectFilter = 'active') {
    const db = getDB();
    const risks = db.risks || [];
    if (!projectFilter || projectFilter === 'all') return risks;

    let proj = null;
    if (projectFilter === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectFilter === 'number') proj = obtenerProyectoPorId(projectFilter);
    else proj = obtenerProyectoPorCodigo(projectFilter);

    if (!proj) {
        return risks.filter(r => projectCodesMatch(r.projectCode, projectFilter));
    }
    return risks.filter(r => projectCodesMatch(r.projectCode, proj.code) || r.projectId === proj.id);
}

function guardarRiesgo(riesgo) {
    const db = getDB();
    if (!db.risks) db.risks = [];
    const newId = db.risks.length ? Math.max(...db.risks.map(r => r.id || 0)) + 1 : 1;
    const activeProj = obtenerProyectoActivo();

    const prob = riesgo.probability || 'Media';
    const imp = riesgo.impact || 'Medio';
    const lvl = riesgo.level || calcularNivelRiesgo(prob, imp);

    const newRiesgo = {
        id: newId,
        projectId: riesgo.projectId || (activeProj ? activeProj.id : 1),
        projectCode: riesgo.projectCode || (activeProj ? activeProj.code : 'IN0001'),
        riskDescription: riesgo.riskDescription || riesgo.description || '',
        description: riesgo.riskDescription || riesgo.description || '',
        riskType: riesgo.riskType || 'Operativo',
        probability: prob,
        impact: imp,
        level: lvl,
        mitigationStrategy: riesgo.mitigationStrategy || riesgo.mitigation || '',
        mitigation: riesgo.mitigationStrategy || riesgo.mitigation || '',
        testResult: riesgo.testResult || 'En proceso de validación con actores de campo.'
    };

    db.risks.push(newRiesgo);
    saveDB(db);
    return newRiesgo;
}

function actualizarRiesgo(id, riesgo) {
    const db = getDB();
    const idx = (db.risks || []).findIndex(r => r.id === parseInt(id));
    if (idx !== -1) {
        const prob = riesgo.probability || db.risks[idx].probability || 'Media';
        const imp = riesgo.impact || db.risks[idx].impact || 'Medio';
        const lvl = riesgo.level || calcularNivelRiesgo(prob, imp);

        db.risks[idx] = { 
            ...db.risks[idx], 
            ...riesgo,
            riskDescription: riesgo.riskDescription || riesgo.description || db.risks[idx].riskDescription,
            description: riesgo.riskDescription || riesgo.description || db.risks[idx].description,
            probability: prob,
            impact: imp,
            level: lvl,
            mitigationStrategy: riesgo.mitigationStrategy || riesgo.mitigation || db.risks[idx].mitigationStrategy,
            mitigation: riesgo.mitigationStrategy || riesgo.mitigation || db.risks[idx].mitigation
        };
        saveDB(db);
        return db.risks[idx];
    }
    return null;
}

function eliminarRiesgo(id) {
    const db = getDB();
    if (!db.risks) return;
    db.risks = db.risks.filter(r => r.id !== parseInt(id));
    saveDB(db);
}

function precargarEjemploRiesgo(projectIdentifier = 'active') {
    let proj = null;
    if (projectIdentifier === 'active') proj = obtenerProyectoActivo();
    else if (typeof projectIdentifier === 'number') proj = obtenerProyectoPorId(projectIdentifier);
    else proj = obtenerProyectoPorCodigo(projectIdentifier);

    if (!proj) return null;

    const grounded = (initialState.risks || []).find(r => projectCodesMatch(r.projectCode, proj.code) || r.projectId === proj.id);

    const prob = grounded ? grounded.probability : 'Media';
    const imp = grounded ? grounded.impact : 'Alto';

    const ejemplo = {
        projectId: proj.id,
        projectCode: proj.code,
        riskDescription: grounded ? (grounded.riskDescription || grounded.description) : `Resistencia inicial o brecha digital en usuarios de ${proj.title.split(' ')[0]}`,
        riskType: grounded ? grounded.riskType : 'Operativo',
        probability: prob,
        impact: imp,
        level: grounded ? (grounded.level || calcularNivelRiesgo(prob, imp)) : calcularNivelRiesgo(prob, imp),
        mitigationStrategy: grounded ? (grounded.mitigationStrategy || grounded.mitigation) : 'Plan intensivo de alfabetización digital y acompañamiento presencial en campo.',
        testResult: grounded ? grounded.testResult : 'Prueba de usabilidad con 10 productores evidenció curva de aprendizaje menor a 3 días.'
    };

    return guardarRiesgo(ejemplo);
}

// Inicializar al importar
initDatabase();
