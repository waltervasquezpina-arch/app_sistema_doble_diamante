/**
 * ==========================================================================
 * AGROIDEAS PIIP - Motor de Flujo de Trabajo y Custodia Institucional (Back-end)
 * Articulado con la NT-GIP N° 003-2025-PCM-SGP y lineamientos SGP-PCM
 * ========================================================================== */

(function () {
    if (window.PIIP_WORKFLOW_LOADED) return;
    window.PIIP_WORKFLOW_LOADED = true;

    const ESTADOS_FLUJO_NTGIP = [
        'Postulada',
        'En Evaluación',
        'Admitida al PIIP',
        'En Ejecución',
        'Evaluada',
        'Observada'
    ];

    // Dictaminar una iniciativa postulada en la Etapa 1 (Exclusivo Titular y Suplente de Modernización)
    function dictaminarIniciativaEtapa1(iniciativaId, decision, observaciones = '') {
        if (typeof esUnidadModernizacion === 'function' && !esUnidadModernizacion()) {
            throw new Error('Acceso denegado: Solo el Titular o Suplente de la Unidad de Modernización puede emitir dictámenes de admisión al PIIP.');
        }

        const db = getDB();
        if (!db.iniciativasPostuladas) db.iniciativasPostuladas = [];

        const idx = db.iniciativasPostuladas.findIndex(i => i.id === parseInt(iniciativaId, 10));
        if (idx === -1) {
            throw new Error('No se encontró la iniciativa postulada.');
        }

        const sesion = typeof obtenerPerfilActivo === 'function' ? obtenerPerfilActivo() : {
            nombre: 'Alex Dario Abad Escalante',
            etiquetaRol: 'Titular Modernización',
            rol: 'modernizacion_titular'
        };

        const inic = db.iniciativasPostuladas[idx];
        const revisorTexto = `${sesion.nombre} (${sesion.etiquetaRol})`;

        if (decision === 'Admitida al PIIP') {
            // 1. Generar automáticamente el código correlativo oficial (ej. PIIP-2026-IN0014)
            const nuevoCodigo = typeof generarSiguienteCodigoPIIP === 'function'
                ? generarSiguienteCodigoPIIP()
                : `PIIP-2026-IN${String((db.projects ? db.projects.length : 13) + 1).padStart(4, '0')}`;

            const newProjId = (db.projects && db.projects.length)
                ? Math.max(...db.projects.map(p => p.id || 0)) + 1
                : 14;

            const nuevoProyecto = {
                id: newProjId,
                code: nuevoCodigo,
                title: inic.title,
                status: 'Fase 1: Descubrir',
                workflowState: 'Admitida al PIIP',
                custodioTitular: 'Alex Dario Abad Escalante (Titular UPP)',
                custodioSuplente: 'Especialista de Modernización PCC (Suplente UPP)',
                responsible: inic.proposingUnit,
                contact: inic.proposerName,
                date: new Date().toISOString().split('T')[0],
                phases: {
                    descubrir: 'active',
                    definir: 'pending',
                    idear: 'pending',
                    entregar: 'pending'
                }
            };

            if (!db.projects) db.projects = [];
            db.projects.push(nuevoProyecto);

            // 2. Migrar las ideas tempranas de la Etapa 1 hacia la colección H07 (brainstorming) del nuevo proyecto
            if (Array.isArray(inic.earlyIdeas) && inic.earlyIdeas.length > 0) {
                if (!db.brainstorming) db.brainstorming = [];
                let maxBrainId = db.brainstorming.length ? Math.max(...db.brainstorming.map(b => b.id || 0)) : 0;
                inic.earlyIdeas.forEach(ideaTxt => {
                    maxBrainId += 1;
                    db.brainstorming.push({
                        id: maxBrainId,
                        projectId: newProjId,
                        projectCode: nuevoCodigo,
                        ideaTitle: ideaTxt,
                        idea: ideaTxt,
                        description: `Idea formulada en Etapa 1 (Presentación de Iniciativa) para resolver: ${inic.problemStatement}`,
                        category: 'Innovación de Servicio',
                        authorRole: inic.proposerName,
                        votesCount: 1
                    });
                });
            }

            // 3. Actualizar registro de la postulación
            inic.workflowState = 'Admitida al PIIP';
            inic.assignedPiipCode = nuevoCodigo;
            inic.dictamenNotes = observaciones || `Admitida oficialmente al PIIP con código correlativo ${nuevoCodigo}. Habilitada para iniciar Etapa 2 (Ejecución Doble Diamante).`;
            inic.reviewedBy = revisorTexto;
            inic.reviewedDate = new Date().toISOString().split('T')[0];

            saveDB(db);

            if (typeof registrarEventoAuditoria === 'function') {
                registrarEventoAuditoria(
                    'ADMISION_PIIP_OFICIAL',
                    `Iniciativa "${inic.title}" admitida al PIIP con código automático ${nuevoCodigo}.`,
                    sesion.nombre,
                    sesion.rol
                );
            }

            return { ok: true, estado: 'Admitida al PIIP', codigoAsignado: nuevoCodigo, proyecto: nuevoProyecto };
        } else {
            // En Evaluación u Observada
            inic.workflowState = decision;
            inic.dictamenNotes = observaciones || `Estado actualizado a "${decision}" por la Unidad de Modernización.`;
            inic.reviewedBy = revisorTexto;
            inic.reviewedDate = new Date().toISOString().split('T')[0];

            saveDB(db);

            if (typeof registrarEventoAuditoria === 'function') {
                registrarEventoAuditoria(
                    'REVISION_ETAPA1',
                    `Iniciativa "${inic.title}" marcada como "${decision}": ${inic.dictamenNotes}`,
                    sesion.nombre,
                    sesion.rol
                );
            }

            return { ok: true, estado: decision, codigoAsignado: null, iniciativa: inic };
        }
    }

    // Cambiar el estado formal NT-GIP de un proyecto ya admitido en el PIIP
    function cambiarEstadoFlujoProyecto(projectId, nuevoEstado, comentario = '') {
        if (typeof esUnidadModernizacion === 'function' && !esUnidadModernizacion()) {
            throw new Error('Acceso denegado: Solo el Titular o Suplente de la Unidad de Modernización puede modificar el estado oficial del flujo NT-GIP.');
        }

        const db = getDB();
        const idx = (db.projects || []).findIndex(p => p.id === parseInt(projectId, 10));
        if (idx === -1) return null;

        const sesion = typeof obtenerPerfilActivo === 'function' ? obtenerPerfilActivo() : {
            nombre: 'Alex Dario Abad Escalante',
            rol: 'modernizacion_titular'
        };

        const estadoAnterior = db.projects[idx].workflowState || 'En Ejecución';
        db.projects[idx].workflowState = nuevoEstado;
        db.projects[idx].lastUpdatedBy = sesion.nombre;
        db.projects[idx].lastUpdatedAt = new Date().toISOString().split('T')[0];

        saveDB(db);

        if (typeof registrarEventoAuditoria === 'function') {
            registrarEventoAuditoria(
                'ACTUALIZACION_FLUJO_PIIP',
                `Proyecto ${db.projects[idx].code}: Estado NT-GIP cambió de "${estadoAnterior}" a "${nuevoEstado}". ${comentario}`,
                sesion.nombre,
                sesion.rol
            );
        }

        return db.projects[idx];
    }

    function obtenerBadgeEstadoFlujoHTML(estado) {
        const st = estado || 'En Ejecución';
        const estilos = {
            'Postulada': 'bg-amber-100 text-amber-800 border-amber-300',
            'En Evaluación': 'bg-blue-100 text-blue-800 border-blue-300',
            'Admitida al PIIP': 'bg-teal-100 text-teal-800 border-teal-300',
            'En Ejecución': 'bg-emerald-100 text-emerald-800 border-emerald-300',
            'Evaluada': 'bg-slate-800 text-white border-slate-900',
            'Observada': 'bg-red-100 text-red-800 border-red-300'
        };
        const cls = estilos[st] || 'bg-slate-100 text-slate-700 border-slate-300';
        return `<span class="px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${cls}">${st}</span>`;
    }

    window.ESTADOS_FLUJO_NTGIP = ESTADOS_FLUJO_NTGIP;
    window.dictaminarIniciativaEtapa1 = dictaminarIniciativaEtapa1;
    window.cambiarEstadoFlujoProyecto = cambiarEstadoFlujoProyecto;
    window.obtenerBadgeEstadoFlujoHTML = obtenerBadgeEstadoFlujoHTML;
})();

