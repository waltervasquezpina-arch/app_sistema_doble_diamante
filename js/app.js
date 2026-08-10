/**
 * ==========================================================================
 * AGROIDEAS PIIP - Controlador General (app.js)
 * Inicialización condicional y controladores de lógica de negocio (MPA)
 * ========================================================================== */

function initApp() {
    console.log('Iniciando controladores específicos de página...');

    // -------------------------------------------------------------
    // VISTA: Dashboard (Portafolio Institucional)
    // -------------------------------------------------------------
    const projectsTableEl = document.getElementById('projectsTable');
    if (projectsTableEl && typeof $ !== 'undefined') {
        const projectsTable = $('#projectsTable').DataTable({
            data: obtenerProyectos(),
            columns: [
                { 
                    data: 'code',
                    render: function (data, type, row) {
                        const activeId = obtenerProyectoActivoId();
                        const isActive = row.id === activeId;
                        if (isActive) {
                            return `<div class="flex items-center gap-1.5 font-bold text-emerald-800">${data} <span class="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Activo</span></div>`;
                        }
                        return data;
                    }
                },
                { data: 'title' },
                { 
                    data: 'phases',
                    render: function (data, type, row) {
                        if (!data) return row.status;
                        
                        const steps = [
                            { key: 'descubrir', label: 'D1', title: 'Fase 1: Descubrir' },
                            { key: 'definir', label: 'D2', title: 'Fase 2: Definir' },
                            { key: 'idear', label: 'I3', title: 'Fase 3: Idear' },
                            { key: 'entregar', label: 'E4', title: 'Fase 4: Entregar' }
                        ];
                        
                        let html = '<div class="flex items-center gap-1.5">';
                        steps.forEach((step, idx) => {
                            const status = data[step.key];
                            let circleClass = 'bg-slate-100 text-slate-400 border-slate-200';
                            if (status === 'completed') {
                                circleClass = 'bg-emerald-600 text-white border-emerald-600';
                            } else if (status === 'active') {
                                circleClass = 'bg-amber-500 text-white border-amber-500 font-bold';
                            }
                            
                            html += `
                                <div class="flex items-center">
                                    <span class="w-6 h-6 rounded-none border text-[9px] flex items-center justify-center font-semibold ${circleClass}" title="${step.title}: ${status}">
                                        ${step.label}
                                    </span>
                                    ${idx < steps.length - 1 ? '<span class="w-2 border-b border-slate-300"></span>' : ''}
                                </div>
                            `;
                        });
                        html += '</div>';
                        return html;
                    }
                },
                { 
                    data: 'responsible', 
                    defaultContent: '-',
                    render: function (data, type, row) {
                        if (!data) return '-';
                        if (type === 'display') {
                            const match = data.match(/\(([^)]+)\)/);
                            if (match) return match[1];
                            
                            const mappings = {
                                'unidad de negocios': 'UN',
                                'dirección ejecutiva - coordinación técnica regional': 'CTR',
                                'coordinación técnica regional': 'CTR',
                                'unidad de administración': 'UA',
                                'recursos humanos': 'UA-RRHH'
                            };
                            const lower = data.toLowerCase();
                            for (const [key, val] of Object.entries(mappings)) {
                                if (lower.includes(key)) {
                                    return val;
                                }
                            }
                        }
                        return data;
                    }
                },
                { data: 'date' },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        const activeId = obtenerProyectoActivoId();
                        const isActive = row.id === activeId;
                        return `
                            <div class="flex flex-wrap gap-1.5 text-2xs">
                                <button class="btn-view-project text-emerald-700 hover:text-emerald-950 font-bold hover:underline" data-id="${row.id}">Ficha</button>
                                <span class="text-slate-300">|</span>
                                <button class="btn-select-project ${isActive ? 'text-slate-400 cursor-not-allowed font-medium' : 'text-blue-700 hover:text-blue-900 font-bold hover:underline'}" data-id="${row.id}" ${isActive ? 'disabled' : ''}>Trabajar</button>
                                <span class="text-slate-300">|</span>
                                <button class="btn-edit-project text-amber-700 hover:text-amber-950 font-bold hover:underline" data-id="${row.id}">Editar</button>
                                <span class="text-slate-300">|</span>
                                <button class="btn-delete-project text-red-700 hover:text-red-950 font-bold hover:underline" data-id="${row.id}">Eliminar</button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        let editingProjectId = null;
        const projectFormModal = document.getElementById('projectFormModal');
        const formProject = document.getElementById('form-project');

        // Helper para actualizar sidebar
        function actualizarIndicadorProyectoSidebar() {
            const sidebarLabel = document.getElementById('sidebar-active-project-name');
            if (sidebarLabel && typeof obtenerProyectoActivoId === 'function' && typeof obtenerProyectos === 'function') {
                const activeId = obtenerProyectoActivoId();
                const activeProj = obtenerProyectos().find(p => p.id === activeId);
                if (activeProj) {
                    sidebarLabel.textContent = activeProj.title;
                    sidebarLabel.title = activeProj.title;
                }
            }
        }

        // Mostrar Modal Ficha de Proyecto
        function mostrarFichaProyecto(projectId) {
            const project = obtenerProyectos().find(p => p.id === projectId);
            if (!project) return;
            
            // Llenar datos generales
            document.getElementById('modalProjectTitle').textContent = project.title;
            document.getElementById('modalProjectCode').textContent = project.code;
            document.getElementById('modalInfoResponsible').textContent = project.responsible;
            document.getElementById('modalInfoContact').textContent = project.contact;
            document.getElementById('modalInfoDate').textContent = project.date;
            
            const phases = project.phases || { descubrir: 'pending', definir: 'pending', idear: 'pending', entregar: 'pending' };
            const phaseNames = { descubrir: '1. Descubrir', definir: '2. Definir', idear: '3. Idear', entregar: '4. Entregar' };
            const statusMap = { pending: 'Pendiente', active: 'En Curso', completed: 'Completado' };
            
            let activePhase = '1. Descubrir';
            if (phases.entregar === 'active' || phases.entregar === 'completed') activePhase = '4. Entregar';
            else if (phases.idear === 'active' || phases.idear === 'completed') activePhase = '3. Idear';
            else if (phases.definir === 'active' || phases.definir === 'completed') activePhase = '2. Definir';
            
            document.getElementById('modalInfoStatus').textContent = `Fase Actual: ${activePhase}`;
            
            let progressHtml = '<div class="flex flex-wrap gap-2">';
            for (const [key, val] of Object.entries(phases)) {
                let color = 'bg-slate-100 text-slate-500 border-slate-200';
                if (val === 'completed') color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                if (val === 'active') color = 'bg-blue-100 text-blue-700 border-blue-200';
                progressHtml += `<span class="px-2 py-1 rounded text-[10px] font-bold border uppercase ${color}">${phaseNames[key]}: ${statusMap[val]}</span>`;
            }
            progressHtml += '</div>';
            document.getElementById('modalInfoPhasesProgress').innerHTML = progressHtml;

            // Mostrar el modal
            document.getElementById('projectModal').classList.remove('hidden');
        }

        // Tabs del Modal
        $('.modal-tab').on('click', function() {
            $('.modal-tab').removeClass('active border-b-2 border-emerald-600 text-emerald-700').addClass('text-slate-600 hover:text-slate-800');
            $(this).addClass('active border-b-2 border-emerald-600 text-emerald-700').removeClass('text-slate-600 hover:text-slate-800');
            const tabId = $(this).attr('data-tab');
            $('.modal-tab-content').addClass('hidden').removeClass('block');
            $('#tabContent-' + tabId).removeClass('hidden').addClass('block');
        });

        // Cerrar Modal Ficha
        $('#modalCloseBtn, #modalCloseFooterBtn').on('click', function() {
            $('#projectModal').addClass('hidden');
        });

        // Evento click en "Ver Ficha" de la tabla
        $('#projectsTable').on('click', '.btn-view-project', function() {
            const projectId = parseInt($(this).attr('data-id'));
            establecerProyectoActivoId(projectId);
            mostrarFichaProyecto(projectId);
            projectsTable.clear().rows.add(obtenerProyectos()).draw(false);
            actualizarIndicadorProyectoSidebar();
        });

        // Evento click en "Trabajar"
        $('#projectsTable').on('click', '.btn-select-project', function() {
            const projectId = parseInt($(this).attr('data-id'));
            establecerProyectoActivoId(projectId);
            alert('Proyecto seleccionado como activo. Las herramientas del Doble Diamante operarán bajo este proyecto.');
            projectsTable.clear().rows.add(obtenerProyectos()).draw(false);
            actualizarIndicadorProyectoSidebar();
        });

        // Evento click en "Editar" proyecto
        $('#projectsTable').on('click', '.btn-edit-project', function() {
            const projectId = parseInt($(this).attr('data-id'));
            const project = obtenerProyectos().find(p => p.id === projectId);
            if (project) {
                editingProjectId = projectId;
                document.getElementById('formModalTitle').textContent = 'Editar Proyecto de Innovación';
                document.getElementById('proj-title').value = project.title;
                document.getElementById('proj-code').value = project.code;
                document.getElementById('proj-date').value = project.date;
                document.getElementById('proj-responsible').value = project.responsible;
                document.getElementById('proj-contact').value = project.contact;
                
                const phases = project.phases || { descubrir: 'pending', definir: 'pending', idear: 'pending', entregar: 'pending' };
                document.getElementById('phase-descubrir').value = phases.descubrir;
                document.getElementById('phase-definir').value = phases.definir;
                document.getElementById('phase-idear').value = phases.idear;
                document.getElementById('phase-entregar').value = phases.entregar;
                
                projectFormModal.classList.remove('hidden');
            }
        });

        // Evento click en "Eliminar" proyecto
        $('#projectsTable').on('click', '.btn-delete-project', function() {
            const projectId = parseInt($(this).attr('data-id'));
            const project = obtenerProyectos().find(p => p.id === projectId);
            if (project) {
                if (confirm(`¿Está seguro de que desea eliminar el proyecto "${project.title}"?\n\nEsta acción NO eliminará sus datos relacionados pero ya no serán accesibles en el portafolio.`)) {
                    eliminarProyecto(projectId);
                    if (obtenerProyectoActivoId() === projectId) {
                        establecerProyectoActivoId(1);
                    }
                    projectsTable.clear().rows.add(obtenerProyectos()).draw(false);
                    actualizarIndicadorProyectoSidebar();
                    alert('Proyecto eliminado exitosamente.');
                }
            }
        });

        // Abrir modal de creación
        const btnCreateProject = document.getElementById('btn-create-project');
        if (btnCreateProject) {
            btnCreateProject.addEventListener('click', () => {
                editingProjectId = null;
                document.getElementById('formModalTitle').textContent = 'Registrar Proyecto de Innovación';
                formProject.reset();
                document.getElementById('proj-date').value = new Date().toISOString().split('T')[0];
                document.getElementById('phase-descubrir').value = 'active';
                document.getElementById('phase-definir').value = 'pending';
                document.getElementById('phase-idear').value = 'pending';
                document.getElementById('phase-entregar').value = 'pending';
                projectFormModal.classList.remove('hidden');
            });
        }

        // Cerrar modal de formulario
        const formModalCloseBtn = document.getElementById('formModalCloseBtn');
        const formModalCancelBtn = document.getElementById('formModalCancelBtn');
        function hideFormModal() {
            projectFormModal.classList.add('hidden');
        }
        if (formModalCloseBtn) formModalCloseBtn.addEventListener('click', hideFormModal);
        if (formModalCancelBtn) formModalCancelBtn.addEventListener('click', hideFormModal);

        // Envío de formulario
        if (formProject) {
            formProject.addEventListener('submit', (e) => {
                e.preventDefault();
                const projectData = {
                    title: document.getElementById('proj-title').value,
                    code: document.getElementById('proj-code').value,
                    date: document.getElementById('proj-date').value,
                    responsible: document.getElementById('proj-responsible').value,
                    contact: document.getElementById('proj-contact').value,
                    phases: {
                        descubrir: document.getElementById('phase-descubrir').value,
                        definir: document.getElementById('phase-definir').value,
                        idear: document.getElementById('phase-idear').value,
                        entregar: document.getElementById('phase-entregar').value
                    }
                };

                if (editingProjectId !== null) {
                    actualizarProyecto(editingProjectId, projectData);
                    alert('Proyecto actualizado correctamente.');
                } else {
                    const newProj = guardarProyecto(projectData);
                    establecerProyectoActivoId(newProj.id);
                    alert('Proyecto registrado e iniciado como activo.');
                }

                hideFormModal();
                projectsTable.clear().rows.add(obtenerProyectos()).draw(false);
                actualizarIndicadorProyectoSidebar();
            });
        }
    }

    // Modal de Ficha Proyecto
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        const closeBtn = document.getElementById('modalCloseBtn');
        const closeFooterBtn = document.getElementById('modalCloseFooterBtn');
        
        function hideModal() {
            projectModal.classList.add('hidden');
        }
        
        if (closeBtn) closeBtn.addEventListener('click', hideModal);
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', hideModal);
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) hideModal();
        });
        
        // Cambio de pestañas
        const tabs = projectModal.querySelectorAll('.modal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => {
                    t.classList.remove('active', 'border-b-2', 'border-emerald-600', 'text-emerald-700');
                    t.classList.add('text-slate-600');
                });
                
                this.classList.add('active', 'border-b-2', 'border-emerald-600', 'text-emerald-700');
                this.classList.remove('text-slate-600');
                
                projectModal.querySelectorAll('.modal-tab-content').forEach(c => {
                    c.classList.add('hidden');
                    c.classList.remove('block');
                });
                
                const targetTab = this.getAttribute('data-tab');
                const targetContent = document.getElementById(`tabContent-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    targetContent.classList.add('block');
                }
            });
        });
    }

    // Reset de semillas (botón QA del Dashboard)
    const btnReset = document.getElementById('btn-reset-db');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('¿Desea restablecer todos los datos de prueba a su estado semilla inicial?\n\nEsta acción NO SE PUEDE deshacer.')) {
                resetDatabase();
                alert('✔ Datos restablecidos. La página se recargará.');
                location.reload();
            }
        });
    }

    // -------------------------------------------------------------
    // FASE 1 - HERRAMIENTA 1: Observación AEIOU
    // -------------------------------------------------------------
    const formAEIOU = document.getElementById('form-aeiou');
    if (formAEIOU) {
        formAEIOU.addEventListener('submit', (e) => {
            e.preventDefault();
            const obs = {
                projectId: obtenerProyectoActivoId(),
                activity: document.getElementById('aeiou-a').value,
                environment: document.getElementById('aeiou-e').value,
                interaction: document.getElementById('aeiou-i').value,
                objects: document.getElementById('aeiou-o').value,
                users: document.getElementById('aeiou-u').value,
                date: new Date().toISOString().split('T')[0]
            };
            guardarObservacionAEIOU(obs);
            alert('Observación de campo registrada con éxito.');
            formAEIOU.reset();
        });
    }

    // -------------------------------------------------------------
    // FASE 1 - HERRAMIENTA 2: Mapa de Empatía
    // -------------------------------------------------------------
    const formEmpathy = document.getElementById('form-empathy');
    const canvasThink = document.getElementById('canvas-think');
    
    function renderEmpathyMap() {
        if (!canvasThink) return;
        const data = obtenerMapaEmpatia();
        if (data) {
            document.getElementById('emp-profile').value = data.userProfile || '';
            document.getElementById('emp-think').value = data.says || '';
            document.getElementById('emp-hear').value = data.hears || '';
            document.getElementById('emp-see').value = data.sees || '';
            document.getElementById('emp-say').value = data.does || '';
            document.getElementById('emp-pain').value = data.pains || '';
            document.getElementById('emp-gain').value = data.gains || '';

            // Renderizar en el Canvas visual
            canvasThink.textContent = data.says || 'Sin registrar';
            document.getElementById('canvas-hear').textContent = data.hears || 'Sin registrar';
            document.getElementById('canvas-see').textContent = data.sees || 'Sin registrar';
            document.getElementById('canvas-say').textContent = data.does || 'Sin registrar';
            document.getElementById('canvas-pain').textContent = data.pains || 'Sin registrar';
            document.getElementById('canvas-gain').textContent = data.gains || 'Sin registrar';
        } else {
            // Limpiar si no hay datos
            document.getElementById('emp-profile').value = '';
            document.getElementById('emp-think').value = '';
            document.getElementById('emp-hear').value = '';
            document.getElementById('emp-see').value = '';
            document.getElementById('emp-say').value = '';
            document.getElementById('emp-pain').value = '';
            document.getElementById('emp-gain').value = '';
            canvasThink.textContent = 'Sin registrar';
            document.getElementById('canvas-hear').textContent = 'Sin registrar';
            document.getElementById('canvas-see').textContent = 'Sin registrar';
            document.getElementById('canvas-say').textContent = 'Sin registrar';
            document.getElementById('canvas-pain').textContent = 'Sin registrar';
            document.getElementById('canvas-gain').textContent = 'Sin registrar';
        }
    }

    if (formEmpathy) {
        renderEmpathyMap();

        formEmpathy.addEventListener('submit', (e) => {
            e.preventDefault();
            const mapData = {
                userProfile: document.getElementById('emp-profile').value,
                says: document.getElementById('emp-think').value,
                hears: document.getElementById('emp-hear').value,
                sees: document.getElementById('emp-see').value,
                does: document.getElementById('emp-say').value,
                pains: document.getElementById('emp-pain').value,
                gains: document.getElementById('emp-gain').value
            };
            guardarMapaEmpatia(mapData);
            renderEmpathyMap();
            alert('Lienzo del Mapa de Empatía actualizado.');
        });
    }

    // -------------------------------------------------------------
    // FASE 1 - HERRAMIENTA 3: Encuestas de Campo
    // -------------------------------------------------------------
    const formSurvey = document.getElementById('form-survey');
    const surveysTableEl = document.getElementById('surveysTable');
    if (surveysTableEl && typeof $ !== 'undefined') {
        const surveysTable = $('#surveysTable').DataTable({
            data: obtenerEncuestas().filter(s => s.projectId === obtenerProyectoActivoId()),
            columns: [
                { data: 'respondent' },
                { 
                    data: 'satisfaction',
                    render: (data) => `${data} / 5`
                },
                { data: 'comments' },
                { 
                    data: 'sentiment',
                    render: function (data) {
                        let colorClass = 'bg-slate-100 text-slate-800';
                        if (data === 'Positivo') colorClass = 'bg-emerald-100 text-emerald-800 font-semibold';
                        else if (data === 'Negativo') colorClass = 'bg-red-100 text-red-800 font-bold';
                        return `<span class="px-2 py-0.5 text-2xs uppercase ${colorClass}">${data}</span>`;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        if (formSurvey) {
            formSurvey.addEventListener('submit', (e) => {
                e.preventDefault();
                const newSrv = {
                    projectId: obtenerProyectoActivoId(),
                    respondent: document.getElementById('srv-respondent').value,
                    satisfaction: parseInt(document.getElementById('srv-satisfaction').value),
                    comments: document.getElementById('srv-comments').value
                };
                const saved = guardarEncuesta(newSrv);
                surveysTable.row.add(saved).draw(false);
                alert('Encuesta registrada correctamente.');
                formSurvey.reset();
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 4: Ficha de Persona
    // -------------------------------------------------------------
    const formPersona = document.getElementById('form-persona');
    const personasContainer = document.getElementById('personas-container');

    function renderPersonas() {
        if (!personasContainer) return;
        personasContainer.innerHTML = '';
        const list = obtenerPersonas().filter(p => p.projectId === obtenerProyectoActivoId());

        if (list.length === 0) {
            personasContainer.innerHTML = '<p class="text-slate-500 text-sm col-span-2">Aún no hay arquetipos de usuario registrados para este proyecto.</p>';
            return;
        }

        list.forEach(per => {
            const card = document.createElement('div');
            card.className = 'card border-slate-200 relative';
            card.innerHTML = `
                <div class="flex items-center gap-4 mb-4 pb-3 border-b border-slate-100">
                    <div class="w-12 h-12 bg-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                        ${per.name[0]}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-base">${per.name}</h4>
                        <p class="text-xs text-slate-500">${per.role} (Edad: ${per.age} años)</p>
                    </div>
                </div>
                <blockquote class="italic text-xs text-slate-600 pl-3 border-l-2 border-emerald-600 mb-4 bg-slate-50 py-1.5 pr-2">
                    "${per.quote}"
                </blockquote>
                <div class="space-y-2 text-xs">
                    <div>
                        <strong class="text-slate-700 block mb-0.5">Motivaciones:</strong>
                        <p class="text-slate-600">${per.motivation}</p>
                    </div>
                    <div>
                        <strong class="text-slate-700 block mb-0.5">Frustraciones y Dolores:</strong>
                        <p class="text-slate-600">${per.frustration}</p>
                    </div>
                </div>
            `;
            personasContainer.appendChild(card);
        });
    }

    if (formPersona) {
        renderPersonas();

        formPersona.addEventListener('submit', (e) => {
            e.preventDefault();
            const persona = {
                projectId: obtenerProyectoActivoId(),
                name: document.getElementById('per-name').value,
                role: document.getElementById('per-role').value,
                age: parseInt(document.getElementById('per-age').value),
                quote: document.getElementById('per-quote').value,
                motivation: document.getElementById('per-motivation').value,
                frustration: document.getElementById('per-frustration').value
            };
            guardarPersona(persona);
            renderPersonas();
            alert('Arquetipo guardado en el sistema.');
            formPersona.reset();
        });
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 5: Muro de Hallazgos
    // -------------------------------------------------------------
    const formInsight = document.getElementById('form-insight');
    const insightsGrid = document.getElementById('insights-grid');

    function renderInsightsGrid() {
        if (!insightsGrid) return;
        insightsGrid.innerHTML = '';
        const insights = obtenerInsights();
        const wallInsights = insights.filter(i => i.type === 'Muro' && i.title && i.projectId === obtenerProyectoActivoId());
        
        if (wallInsights.length === 0) {
            insightsGrid.innerHTML = '<p class="text-slate-500 text-sm col-span-2">Aún no hay insights registrados para este proyecto.</p>';
            return;
        }

        wallInsights.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'sticky-note';
            
            let imageHtml = '';
            if (insight.image) {
                imageHtml = `<img src="${insight.image}" alt="Evidencia" class="mt-3 w-full h-32 object-cover border border-[#fcd34d]">`;
            }

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="sticky-note__title text-sm">${insight.title}</h4>
                    <span class="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 font-bold uppercase">Insight</span>
                </div>
                <p class="text-xs text-amber-950 mb-3 leading-relaxed">${insight.text}</p>
                <blockquote class="sticky-note__quote">
                    "${insight.quote}"
                </blockquote>
                ${imageHtml}
            `;
            insightsGrid.appendChild(card);
        });
    }

    if (formInsight) {
        renderInsightsGrid();

        formInsight.addEventListener('submit', (e) => {
            e.preventDefault();
            const insight = {
                projectId: obtenerProyectoActivoId(),
                type: 'Muro',
                title: document.getElementById('insight-title').value,
                text: document.getElementById('insight-text').value,
                quote: document.getElementById('insight-quote').value,
                image: document.getElementById('insight-image').value,
                date: new Date().toISOString().split('T')[0]
            };
            guardarInsight(insight);
            renderInsightsGrid();
            alert('Insight agregado exitosamente.');
            formInsight.reset();
        });
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 6: Definición del Desafío HMW
    // -------------------------------------------------------------
    const formDesafio = document.getElementById('form-desafio');
    const desInsightSelect = document.getElementById('des-insight-select');
    const desafiosTableEl = document.getElementById('desafiosTable');
    if (desafiosTableEl && typeof $ !== 'undefined') {
        const desafiosTable = $('#desafiosTable').DataTable({
            data: obtenerDesafios().filter(d => d.projectId === obtenerProyectoActivoId()),
            columns: [
                { 
                    data: 'id',
                    render: (data) => `HMW-${String(data).padStart(3, '0')}`
                },
                { 
                    data: 'insightId',
                    render: function (data) {
                        const insightObj = obtenerInsights().find(i => i.id === parseInt(data));
                        return insightObj ? insightObj.title : `Insight ID ${data}`;
                    }
                },
                { data: 'question' }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        // Poblado del selector de Insights
        function populateInsightSelect() {
            if (!desInsightSelect) return;
            desInsightSelect.innerHTML = '';
            const list = obtenerInsights().filter(i => i.type === 'Muro' && i.projectId === obtenerProyectoActivoId());
            
            if (list.length === 0) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.textContent = "Ningún Insight Registrado para este proyecto (Ir a H5)";
                desInsightSelect.appendChild(opt);
                return;
            }

            list.forEach(ins => {
                const opt = document.createElement('option');
                opt.value = ins.id;
                opt.textContent = ins.title;
                desInsightSelect.appendChild(opt);
            });
        }

        populateInsightSelect();

        if (formDesafio) {
            formDesafio.addEventListener('submit', (e) => {
                e.preventDefault();
                const questionVal = document.getElementById('des-question').value.trim();
                
                // Forzar estructura metodológica
                if (!questionVal.toLowerCase().startsWith('¿cómo podríamos')) {
                    alert('Por regla metodológica, la pregunta DEBE comenzar con "¿Cómo podríamos...?"');
                    return;
                }

                const insId = desInsightSelect.value;
                if (!insId) {
                    alert('Debe seleccionar un Insight válido.');
                    return;
                }

                const newDes = {
                    projectId: obtenerProyectoActivoId(),
                    insightId: parseInt(insId),
                    question: questionVal
                };

                const saved = guardarDesafio(newDes);
                desafiosTable.row.add(saved).draw(false);
                alert('Desafío registrado exitosamente.');
                
                // Resetear con prefijo forzado
                document.getElementById('des-question').value = '¿Cómo podríamos ';
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 7: Lluvia de Ideas
    // -------------------------------------------------------------
    const formBrainstorming = document.getElementById('form-brainstorming');
    const brainDesafioSelect = document.getElementById('brain-desafio-select');
    
    function renderBrainstormingBoard() {
        // Encontrar las 4 columnas del tablero
        const colTech = document.getElementById('col-tecnológica');
        const colFisica = document.getElementById('col-física-canales');
        const colProc = document.getElementById('col-procesos');
        const colNorm = document.getElementById('col-normativa');

        if (!colTech) return; // Si no está en el DOM

        colTech.innerHTML = '';
        colFisica.innerHTML = '';
        colProc.innerHTML = '';
        colNorm.innerHTML = '';

        const ideas = obtenerBrainstormings().filter(b => b.projectId === obtenerProyectoActivoId());
        const desafiosList = obtenerDesafios();

        ideas.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white p-3 border border-slate-200 shadow-2xs relative hover:shadow-xs transition-shadow';
            
            const desObj = desafiosList.find(d => d.id === parseInt(item.desafioId));
            const desText = desObj ? desObj.question : `Desafío ID ${item.desafioId}`;
            
            card.innerHTML = `
                <p class="text-xs text-slate-800 font-medium mb-2 leading-relaxed">${item.idea}</p>
                <div class="border-t border-slate-100 pt-1.5 mt-2 flex flex-col gap-0.5">
                    <span class="text-[9px] text-slate-400 font-semibold uppercase">Desafío Relacionado:</span>
                    <span class="text-[10px] text-emerald-800 italic truncate" title="${desText}">${desText}</span>
                </div>
            `;

            // Mapear según categoría
            if (item.category === 'Tecnológica') colTech.appendChild(card);
            else if (item.category === 'Física/Canales') colFisica.appendChild(card);
            else if (item.category === 'Procesos') colProc.appendChild(card);
            else if (item.category === 'Normativa') colNorm.appendChild(card);
        });

        // Validar columnas vacías
        const cols = [colTech, colFisica, colProc, colNorm];
        cols.forEach(col => {
            if (col.children.length === 0) {
                col.innerHTML = '<p class="text-slate-400 text-2xs italic text-center py-4">Sin propuestas</p>';
            }
        });
    }

    if (brainDesafioSelect) {
        // Cargar desafíos en el dropdown
        function populateDesafiosDropdown() {
            brainDesafioSelect.innerHTML = '';
            const list = obtenerDesafios().filter(d => d.projectId === obtenerProyectoActivoId());
            
            if (list.length === 0) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.textContent = "Ningún Desafío Registrado para este proyecto (Ir a H6)";
                brainDesafioSelect.appendChild(opt);
                return;
            }

            list.forEach(des => {
                const opt = document.createElement('option');
                opt.value = des.id;
                opt.textContent = des.question;
                brainDesafioSelect.appendChild(opt);
            });
        }

        populateDesafiosDropdown();
        renderBrainstormingBoard();

        if (formBrainstorming) {
            formBrainstorming.addEventListener('submit', (e) => {
                e.preventDefault();
                const dId = brainDesafioSelect.value;
                if (!dId) {
                    alert('Debe registrar y seleccionar un Desafío HMW primero.');
                    return;
                }

                const newIdea = {
                    projectId: obtenerProyectoActivoId(),
                    desafioId: parseInt(dId),
                    idea: document.getElementById('brain-idea').value,
                    category: document.getElementById('brain-category').value
                };
                guardarBrainstorming(newIdea);
                renderBrainstormingBoard();
                alert('Idea de solución incorporada al tablero.');
                document.getElementById('brain-idea').value = '';
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 8: Matriz de Priorización
    // -------------------------------------------------------------
    const formIdea = document.getElementById('form-idea');
    const ideasTableEl = document.getElementById('ideasTable');
    if (ideasTableEl && typeof $ !== 'undefined' && !document.getElementById('surveysTable')) { // Evitar choques
        const ideasTable = $('#ideasTable').DataTable({
            data: obtenerIdeas().filter(i => i.projectId === obtenerProyectoActivoId()),
            columns: [
                { data: 'title' },
                { data: 'impact' },
                { data: 'viability' },
                { data: 'feasibility' },
                { data: 'innovation' },
                { data: 'totalScore' }
            ],
            order: [[5, 'desc']],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        if (formIdea) {
            formIdea.addEventListener('submit', (e) => {
                e.preventDefault();
                const idea = {
                    projectId: obtenerProyectoActivoId(),
                    title: document.getElementById('idea-title').value,
                    impact: parseInt(document.getElementById('idea-impact').value),
                    viability: parseInt(document.getElementById('idea-viability').value),
                    feasibility: parseInt(document.getElementById('idea-feasibility').value),
                    innovation: parseInt(document.getElementById('idea-innovation').value)
                };
                const savedIdea = guardarIdea(idea);
                ideasTable.row.add(savedIdea).draw(false);
                alert('Idea calificada y ordenada exitosamente.');
                formIdea.reset();
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 9: Prototipado Rápido
    // -------------------------------------------------------------
    const formPrototype = document.getElementById('form-prototype');
    const prototypesContainer = document.getElementById('prototypes-container');

    function renderPrototypes() {
        if (!prototypesContainer) return;
        prototypesContainer.innerHTML = '';
        const list = obtenerPrototipos().filter(p => p.projectId === obtenerProyectoActivoId());

        if (list.length === 0) {
            prototypesContainer.innerHTML = '<p class="text-slate-500 text-sm col-span-2">Aún no hay prototipos conceptuales registrados para este proyecto.</p>';
            return;
        }

        list.forEach(proto => {
            const card = document.createElement('div');
            card.className = 'card border-slate-200 p-0 overflow-hidden flex flex-col';
            card.innerHTML = `
                <img src="${proto.imageUrl}" alt="${proto.name}" class="w-full h-48 object-cover border-b border-slate-200">
                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-1">${proto.name}</h4>
                        <p class="text-xs text-slate-600 leading-relaxed">${proto.description}</p>
                    </div>
                    <span class="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 mt-3 self-start font-bold uppercase">Prototipo V1.0</span>
                </div>
            `;
            prototypesContainer.appendChild(card);
        });
    }

    if (formPrototype) {
        renderPrototypes();

        formPrototype.addEventListener('submit', (e) => {
            e.preventDefault();
            const proto = {
                projectId: obtenerProyectoActivoId(),
                name: document.getElementById('proto-name').value,
                imageUrl: document.getElementById('proto-image').value,
                description: document.getElementById('proto-desc').value
            };
            guardarPrototipo(proto);
            renderPrototypes();
            alert('Escenario de prototipo guardado en la galería.');
            formPrototype.reset();
        });
    }

    // -------------------------------------------------------------
    // FASE 3 - ASISTENTE IA GEMINI (Prototipado Rápido)
    // -------------------------------------------------------------
    const geminiKeyInput = document.getElementById('gemini-key');
    if (geminiKeyInput) {
        const btnSaveKey = document.getElementById('btn-save-key');
        const btnDeleteKey = document.getElementById('btn-delete-key');
        const keyStatus = document.getElementById('key-status');
        const btnSubmitAi = document.getElementById('btn-submit-ai');
        const aiResponseContainer = document.getElementById('ai-response-container');
        const aiResponseText = document.getElementById('ai-response-text');
        const aiRoleSelect = document.getElementById('ai-role');
        const aiPromptInput = document.getElementById('ai-prompt');

        // Cargar clave guardada
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            geminiKeyInput.value = savedKey;
            btnDeleteKey.classList.remove('hidden');
            keyStatus.textContent = '✔ Clave cargada desde el almacenamiento local.';
            keyStatus.className = 'text-3xs text-emerald-600 mt-1 font-semibold';
        }

        // Guardar clave
        btnSaveKey.addEventListener('click', () => {
            const keyVal = geminiKeyInput.value.trim();
            if (!keyVal) {
                alert('Por favor, ingrese una clave válida.');
                return;
            }
            localStorage.setItem('gemini_api_key', keyVal);
            btnDeleteKey.classList.remove('hidden');
            keyStatus.textContent = '✔ Clave guardada correctamente.';
            keyStatus.className = 'text-3xs text-emerald-600 mt-1 font-semibold';
            alert('API Key de Gemini guardada localmente.');
        });

        // Borrar clave
        btnDeleteKey.addEventListener('click', () => {
            localStorage.removeItem('gemini_api_key');
            geminiKeyInput.value = '';
            btnDeleteKey.classList.add('hidden');
            keyStatus.textContent = 'La clave se almacena localmente en su navegador.';
            keyStatus.className = 'text-3xs text-slate-400 mt-1';
            alert('API Key de Gemini eliminada localmente.');
        });

        // Consultar Gemini
        btnSubmitAi.addEventListener('click', async () => {
            const apiKey = geminiKeyInput.value.trim() || localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                alert('Por favor, ingrese o guarde una API Key de Gemini para continuar.');
                return;
            }

            const promptText = aiPromptInput.value.trim();
            if (!promptText) {
                alert('Por favor, escriba una consulta o prompt para el asistente.');
                return;
            }

            // Cambiar estado del botón a cargando
            const originalBtnText = btnSubmitAi.innerHTML;
            btnSubmitAi.disabled = true;
            btnSubmitAi.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Procesando con Gemini...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            try {
                // Obtener contexto relacional del proyecto
                const db = getDB();
                const currentProjectId = obtenerProyectoActivoId();
                const project = db.projects.find(p => p.id === currentProjectId) || {};
                const aeiou = (db.aeiou || []).filter(o => o.projectId === currentProjectId);
                const empMaps = db.empathyMaps || (db.empathyMap ? [db.empathyMap] : []);
                const empathyMap = empMaps.find(m => m.projectId === currentProjectId) || {};
                const personas = (db.personas || []).filter(p => p.projectId === currentProjectId);
                const desafios = (db.desafios || []).filter(d => d.projectId === currentProjectId);
                const ideas = (db.ideas || []).filter(i => i.projectId === currentProjectId);
                const prototypes = (db.prototypes || []).filter(p => p.projectId === currentProjectId);

                const context = {
                    proyecto: {
                        titulo: project.title,
                        codigo: project.code,
                        responsable: project.responsible,
                        fecha: project.date
                    },
                    fase1_descubrir: {
                        observaciones_aeiou: aeiou,
                        mapa_empatia: empathyMap
                    },
                    fase2_definir: {
                        arquetipos_persona: personas,
                        desafios_hmw: desafios
                    },
                    fase3_idear: {
                        ideas_solucion: ideas,
                        prototipos_actuales: prototypes
                    }
                };

                const role = aiRoleSelect.value;
                const systemInstruction = `Actúas como un ${role} para el Portafolio Institucional de Innovación Pública (PIIP) de AGROIDEAS.
Tu objetivo es evaluar y proponer mejoras mecánicas, de usabilidad y viabilidad sobre los prototipos/maquetas del proyecto basándote en la información real provista del contexto.
Tu respuesta debe ser profesional, directa, con viabilidad práctica para el sector público agrícola, y estructurada en viñetas claras (sin rodeos inútiles).`;

                const fullPrompt = `${systemInstruction}

CONTEXTO DEL PROYECTO ACTUAL:
${JSON.stringify(context, null, 2)}

PREGUNTA/SOLICITUD DEL USUARIO:
"${promptText}"

Por favor, genera tus recomendaciones detalladas y viables ahora:`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: fullPrompt
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Error HTTP ${response.status}`);
                }

                const result = await response.json();
                const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No se recibió respuesta del modelo.';

                aiResponseText.textContent = textResponse;
                aiResponseContainer.classList.remove('hidden');
            } catch (err) {
                console.error(err);
                alert(`Error al conectar con Gemini API:\n${err.message}`);
            } finally {
                btnSubmitAi.disabled = false;
                btnSubmitAi.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // -------------------------------------------------------------
    // FASE 4 - HERRAMIENTA 10: Plan de Acción / Roadmap (CRUD completo)
    // -------------------------------------------------------------
    const formActionPlan = document.getElementById('form-action-plan');
    const actionPlansTableEl = document.getElementById('actionPlansTable');
    let editingApId = null;

    if (actionPlansTableEl && typeof $ !== 'undefined') {
        const actionPlansTable = $('#actionPlansTable').DataTable({
            data: obtenerPlanesAccion().filter(ap => ap.projectId === obtenerProyectoActivoId()),
            columns: [
                { data: 'phase' },
                { data: 'activity' },
                { data: 'leader' },
                { data: 'startDate' },
                { data: 'endDate' },
                { 
                    data: 'status',
                    render: function (data) {
                        let colorClass = 'bg-slate-100 text-slate-800';
                        if (data === 'Completada') colorClass = 'bg-emerald-100 text-emerald-800';
                        else if (data === 'En Proceso') colorClass = 'bg-amber-100 text-amber-800 font-semibold';
                        return `<span class="px-2 py-0.5 text-2xs uppercase ${colorClass}">${data}</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        return `
                            <div class="flex gap-1 px-1">
                                <button class="btn-edit-ap bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 text-2xs rounded font-bold transition-colors" data-id="${row.id}">Editar</button>
                                <button class="btn-delete-ap bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-2xs rounded font-bold transition-colors" data-id="${row.id}">Eliminar</button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        // Eventos Editar y Eliminar
        $('#actionPlansTable').on('click', '.btn-edit-ap', function() {
            const id = parseInt($(this).attr('data-id'));
            const record = obtenerPlanesAccion().find(ap => ap.id === id);
            if (record) {
                editingApId = id;
                document.getElementById('ap-phase').value = record.phase;
                document.getElementById('ap-activity').value = record.activity;
                document.getElementById('ap-leader').value = record.leader;
                document.getElementById('ap-start').value = record.startDate;
                document.getElementById('ap-end').value = record.endDate;
                document.getElementById('ap-status').value = record.status;
                
                const submitBtn = formActionPlan.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Actualizar Actividad';
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700');
            }
        });

        $('#actionPlansTable').on('click', '.btn-delete-ap', function() {
            const id = parseInt($(this).attr('data-id'));
            if (confirm('¿Está seguro de que desea eliminar esta actividad de la hoja de ruta?')) {
                eliminarPlanAccion(id);
                actionPlansTable.clear().rows.add(obtenerPlanesAccion().filter(ap => ap.projectId === obtenerProyectoActivoId())).draw();
            }
        });

        if (formActionPlan) {
            formActionPlan.addEventListener('submit', (e) => {
                e.preventDefault();
                const planData = {
                    projectId: obtenerProyectoActivoId(),
                    phase: document.getElementById('ap-phase').value,
                    activity: document.getElementById('ap-activity').value,
                    leader: document.getElementById('ap-leader').value,
                    startDate: document.getElementById('ap-start').value,
                    endDate: document.getElementById('ap-end').value,
                    status: document.getElementById('ap-status').value
                };
                
                if (editingApId !== null) {
                    actualizarPlanAccion(editingApId, planData);
                    alert('Actividad actualizada en la hoja de ruta.');
                    editingApId = null;
                    const submitBtn = formActionPlan.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Guardar Actividad';
                    submitBtn.className = 'btn btn-primary w-full';
                } else {
                    guardarPlanAccion(planData);
                    alert('Actividad incorporada a la hoja de ruta.');
                }
                
                actionPlansTable.clear().rows.add(obtenerPlanesAccion().filter(ap => ap.projectId === obtenerProyectoActivoId())).draw();
                formActionPlan.reset();
            });

            formActionPlan.addEventListener('reset', () => {
                editingApId = null;
                const submitBtn = formActionPlan.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Guardar Actividad';
                submitBtn.className = 'btn btn-primary w-full';
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 4 - HERRAMIENTA 11: Matriz de Riesgos (CRUD completo)
    // -------------------------------------------------------------
    const formRisk = document.getElementById('form-risk');
    const risksTableEl = document.getElementById('risksTable');
    let editingRiskId = null;

    if (risksTableEl && typeof $ !== 'undefined') {
        const risksTable = $('#risksTable').DataTable({
            data: obtenerRiesgos().filter(r => r.projectId === obtenerProyectoActivoId()),
            columns: [
                { data: 'description' },
                { data: 'probability' },
                { data: 'impact' },
                { 
                    data: 'level',
                    render: function(data) {
                        let colorClass = 'bg-slate-100 text-slate-800';
                        if (data === 'Alto') colorClass = 'bg-red-100 text-red-800 font-bold';
                        else if (data === 'Medio') colorClass = 'bg-amber-100 text-amber-800 font-semibold';
                        else if (data === 'Bajo') colorClass = 'bg-emerald-100 text-emerald-800';
                        
                        return `<span class="px-2 py-0.5 text-2xs font-semibold uppercase ${colorClass}">${data}</span>`;
                    }
                },
                { data: 'mitigation' },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        return `
                            <div class="flex gap-1 px-1 font-sans">
                                <button class="btn-edit-risk bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 text-2xs rounded font-bold transition-colors" data-id="${row.id}">Editar</button>
                                <button class="btn-delete-risk bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-2xs rounded font-bold transition-colors" data-id="${row.id}">Eliminar</button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        // Eventos Editar y Eliminar
        $('#risksTable').on('click', '.btn-edit-risk', function() {
            const id = parseInt($(this).attr('data-id'));
            const record = obtenerRiesgos().find(r => r.id === id);
            if (record) {
                editingRiskId = id;
                document.getElementById('risk-desc').value = record.description;
                document.getElementById('risk-prob').value = record.probability;
                document.getElementById('risk-impact').value = record.impact;
                document.getElementById('risk-mitigation').value = record.mitigation;
                
                const submitBtn = formRisk.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Actualizar Riesgo';
                submitBtn.classList.remove('btn-danger');
                submitBtn.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700');
            }
        });

        $('#risksTable').on('click', '.btn-delete-risk', function() {
            const id = parseInt($(this).attr('data-id'));
            if (confirm('¿Está seguro de que desea eliminar este riesgo de la matriz?')) {
                eliminarRiesgo(id);
                risksTable.clear().rows.add(obtenerRiesgos().filter(r => r.projectId === obtenerProyectoActivoId())).draw();
            }
        });

        if (formRisk) {
            formRisk.addEventListener('submit', (e) => {
                e.preventDefault();
                const prob = document.getElementById('risk-prob').value;
                const imp = document.getElementById('risk-impact').value;
                
                let level = 'Bajo';
                if (prob === 'Alta' && imp === 'Alto') level = 'Alto';
                else if (prob === 'Alta' && imp === 'Medio') level = 'Alto';
                else if (prob === 'Media' && imp === 'Alto') level = 'Alto';
                else if (prob === 'Baja' && imp === 'Bajo') level = 'Bajo';
                else level = 'Medio';

                const riskData = {
                    projectId: obtenerProyectoActivoId(),
                    description: document.getElementById('risk-desc').value,
                    probability: prob,
                    impact: imp,
                    level: level,
                    mitigation: document.getElementById('risk-mitigation').value
                };
                
                if (editingRiskId !== null) {
                    actualizarRiesgo(editingRiskId, riskData);
                    alert('Riesgo actualizado en la matriz.');
                    editingRiskId = null;
                    const submitBtn = formRisk.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Registrar Riesgo';
                    submitBtn.className = 'btn btn-danger w-full';
                } else {
                    guardarRiesgo(riskData);
                    alert('Riesgo evaluado e incorporado a la matriz.');
                }
                
                risksTable.clear().rows.add(obtenerRiesgos().filter(r => r.projectId === obtenerProyectoActivoId())).draw();
                formRisk.reset();
            });

            formRisk.addEventListener('reset', () => {
                editingRiskId = null;
                const submitBtn = formRisk.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Registrar Riesgo';
                submitBtn.className = 'btn btn-danger w-full';
            });
        }
    }
}

// Función para mostrar la Ficha Técnica Consolidada del Proyecto (Doble Diamante)
function mostrarFichaProyecto(projectId) {
    const db = getDB();
    const project = db.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Títulos de cabecera
    document.getElementById('modalProjectTitle').textContent = project.title;
    document.getElementById('modalProjectCode').textContent = `Código: ${project.code}`;
    
    // Pestaña: General
    document.getElementById('modalInfoResponsible').textContent = project.responsible || '-';
    document.getElementById('modalInfoContact').textContent = project.contact || '-';
    document.getElementById('modalInfoDate').textContent = project.date || '-';
    document.getElementById('modalInfoStatus').textContent = project.status || '-';
    
    // Progreso metodológico de las 4 fases
    const phases = project.phases || { descubrir: 'pending', definir: 'pending', idear: 'pending', entregar: 'pending' };
    let progressHtml = '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">';
    const steps = [
        { key: 'descubrir', label: '1. Descubrir' },
        { key: 'definir', label: '2. Definir' },
        { key: 'idear', label: '3. Idear' },
        { key: 'entregar', label: '4. Entregar' }
    ];
    steps.forEach((step) => {
        const status = phases[step.key];
        let badgeColor = 'bg-slate-100 text-slate-500 border-slate-200';
        if (status === 'completed') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        else if (status === 'active') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
        
        progressHtml += `
            <div class="flex flex-col p-2 rounded border ${badgeColor} text-center">
                <span class="text-3xs uppercase tracking-wider opacity-70">${step.label}</span>
                <span class="text-xs font-bold mt-0.5">${status.toUpperCase()}</span>
            </div>
        `;
    });
    progressHtml += '</div>';
    document.getElementById('modalInfoPhasesProgress').innerHTML = progressHtml;
    
    // Pestaña: Fase 1 (AEIOU, Mapa Empatía)
    const observations = (db.aeiou || []).filter(o => o.projectId === projectId);
    let aeiouHtml = '';
    if (observations.length === 0) {
        aeiouHtml = '<p class="text-xs text-slate-500 italic">No hay observaciones AEIOU registradas.</p>';
    } else {
        observations.forEach(o => {
            aeiouHtml += `
                <div class="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><strong class="text-slate-600">A (Actividades):</strong> ${o.activity}</div>
                        <div><strong class="text-slate-600">E (Entorno):</strong> ${o.environment}</div>
                        <div><strong class="text-slate-600">I (Interacciones):</strong> ${o.interaction}</div>
                        <div><strong class="text-slate-600">O (Objetos):</strong> ${o.objects}</div>
                    </div>
                    <div class="pt-2 border-t border-slate-250 mt-1"><strong class="text-slate-600">U (Usuarios):</strong> ${o.users}</div>
                </div>
            `;
        });
    }
    document.getElementById('modalAEIOUContainer').innerHTML = aeiouHtml;
    
    // Mapa de empatía
    const empMaps = db.empathyMaps || (db.empathyMap ? [db.empathyMap] : []);
    const emp = empMaps.find(m => m.projectId === projectId);
    let empathyHtml = '';
    if (!emp) {
        empathyHtml = '<p class="text-xs text-slate-500 italic">No hay mapa de empatía registrado para este proyecto.</p>';
    } else {
        empathyHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>Perfil Arquetipo:</strong><p class="mt-1 text-slate-600">${emp.userProfile || '-'}</p></div>
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>¿Qué piensa y siente?:</strong><p class="mt-1 text-slate-600">${emp.says || '-'}</p></div>
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>¿Qué oye?:</strong><p class="mt-1 text-slate-600">${emp.hears || '-'}</p></div>
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>¿Qué ve?:</strong><p class="mt-1 text-slate-600">${emp.sees || '-'}</p></div>
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>¿Qué dice y hace?:</strong><p class="mt-1 text-slate-600">${emp.does || '-'}</p></div>
                <div class="bg-slate-50 p-3 rounded border border-slate-200"><strong>Dolores/Esfuerzos:</strong><p class="mt-1 text-slate-600">${emp.pains || '-'}</p></div>
                <div class="bg-emerald-50/50 p-3 rounded border border-emerald-100 md:col-span-2"><strong>Resultados/Necesidades:</strong><p class="mt-1 text-emerald-950 font-semibold">${emp.gains || '-'}</p></div>
            </div>
        `;
    }
    document.getElementById('modalEmpathyContainer').innerHTML = empathyHtml;
    
    // Pestaña: Fase 2 (Arquetipo Persona, Desafíos HMW)
    const personas = (db.personas || []).filter(p => p.projectId === projectId);
    let personasHtml = '';
    if (personas.length === 0) {
        personasHtml = '<p class="text-xs text-slate-500 italic">No hay arquetipos de persona registrados.</p>';
    } else {
        personas.forEach(p => {
            personasHtml += `
                <div class="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5">
                    <div class="flex items-center justify-between font-bold text-slate-800 border-b pb-1">
                        <span>${p.name} (${p.age} años)</span>
                        <span class="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-3xs uppercase tracking-wider">${p.role}</span>
                    </div>
                    <div class="italic text-slate-600 mt-1 pl-2 border-l-2 border-slate-300">"${p.quote}"</div>
                    <div class="mt-2"><strong>Motivaciones:</strong> ${p.motivation}</div>
                    <div><strong>Frustraciones / Dolores:</strong> ${p.frustration}</div>
                </div>
            `;
        });
    }
    document.getElementById('modalPersonaContainer').innerHTML = personasHtml;
    
    const desafios = (db.desafios || []).filter(d => d.projectId === projectId);
    let desafiosHtml = '';
    if (desafios.length === 0) {
        desafiosHtml = '<p class="text-xs text-slate-500 italic">No hay desafíos HMW registrados.</p>';
    } else {
        desafios.forEach(d => {
            desafiosHtml += `
                <div class="bg-amber-50/50 border border-amber-200 rounded p-3 text-xs">
                    <strong class="text-amber-900 flex items-center gap-1"><i data-lucide="help-circle" class="w-3.5 h-3.5"></i> Desafío HMW:</strong>
                    <p class="text-slate-800 font-semibold mt-1">${d.question}</p>
                </div>
            `;
        });
    }
    document.getElementById('modalDesafiosContainer').innerHTML = desafiosHtml;
    
    // Pestaña: Fase 3 (Ideas, Prototipos)
    const ideas = (db.ideas || []).filter(i => i.projectId === projectId);
    let ideasHtml = '';
    if (ideas.length === 0) {
        ideasHtml = '<p class="text-xs text-slate-500 italic">No hay ideas de solución registradas.</p>';
    } else {
        ideasHtml += '<ul class="space-y-2">';
        ideas.forEach(i => {
            ideasHtml += `
                <li class="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex justify-between items-center gap-4">
                    <div>
                        <strong class="text-slate-800">${i.title}</strong>
                        <div class="text-2xs text-slate-500 mt-0.5">Impacto: ${i.impact} | Viabilidad: ${i.viability} | Factibilidad: ${i.feasibility} | Innovación: ${i.innovation}</div>
                    </div>
                    <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-2xs whitespace-nowrap">Score: ${i.totalScore || (i.impact + i.viability + i.feasibility + i.innovation)} / 20</span>
                </li>
            `;
        });
        ideasHtml += '</ul>';
    }
    document.getElementById('modalIdeasContainer').innerHTML = ideasHtml;
    
    const prototypes = (db.prototypes || []).filter(p => p.projectId === projectId);
    let protoHtml = '';
    if (prototypes.length === 0) {
        protoHtml = '<p class="text-xs text-slate-500 italic col-span-2">No hay bocetos de prototipo registrados.</p>';
    } else {
        prototypes.forEach(p => {
            protoHtml += `
                <div class="border border-slate-200 rounded overflow-hidden bg-white shadow-sm">
                    <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-36 object-cover border-b border-slate-200">
                    <div class="p-3 text-xs">
                        <strong class="text-slate-800">${p.name}</strong>
                        <p class="text-slate-600 mt-1">${p.description}</p>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('modalPrototiposContainer').innerHTML = protoHtml;
    
    // Pestaña: Fase 4 (Action Plan, Risks)
    const actionPlan = (db.actionPlans || []).filter(ap => ap.projectId === projectId);
    let apHtml = '';
    if (actionPlan.length === 0) {
        apHtml = '<p class="text-xs text-slate-500 italic">No hay actividades del roadmap registradas.</p>';
    } else {
        apHtml += `
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-slate-100">
                        <th class="border-b border-slate-200 p-2 font-bold">Fase</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Actividad</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Responsable</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Inicio / Fin</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        actionPlan.forEach(ap => {
            apHtml += `
                <tr>
                    <td class="border-b border-slate-100 p-2">${ap.phase}</td>
                    <td class="border-b border-slate-100 p-2 font-semibold text-slate-800">${ap.activity}</td>
                    <td class="border-b border-slate-100 p-2">${ap.leader}</td>
                    <td class="border-b border-slate-100 p-2 whitespace-nowrap">${ap.startDate} a ${ap.endDate}</td>
                    <td class="border-b border-slate-100 p-2"><span class="px-2 py-0.5 rounded-full text-2xs font-semibold ${ap.status === 'Completada' ? 'bg-emerald-100 text-emerald-800' : ap.status === 'En Proceso' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">${ap.status}</span></td>
                </tr>
            `;
        });
        apHtml += '</tbody></table>';
    }
    document.getElementById('modalActionPlanContainer').innerHTML = apHtml;
    
    const risks = (db.risks || []).filter(r => r.projectId === projectId);
    let risksHtml = '';
    if (risks.length === 0) {
        risksHtml = '<p class="text-xs text-slate-500 italic">No hay riesgos registrados.</p>';
    } else {
        risksHtml += `
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-slate-100">
                        <th class="border-b border-slate-200 p-2 font-bold">Riesgo</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Probabilidad</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Impacto</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Nivel</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Mitigación</th>
                    </tr>
                </thead>
                <tbody>
        `;
        risks.forEach(r => {
            const levelClass = r.level === 'Alto' ? 'bg-red-100 text-red-800 border-red-200' : r.level === 'Medio' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-100 text-green-800 border-green-200';
            risksHtml += `
                <tr>
                    <td class="border-b border-slate-100 p-2 font-semibold text-slate-800">${r.description}</td>
                    <td class="border-b border-slate-100 p-2">${r.probability}</td>
                    <td class="border-b border-slate-100 p-2">${r.impact}</td>
                    <td class="border-b border-slate-100 p-2"><span class="px-2 py-0.5 rounded border text-2xs font-bold ${levelClass}">${r.level}</span></td>
                    <td class="border-b border-slate-100 p-2 text-slate-600">${r.mitigation}</td>
                </tr>
            `;
        });
        risksHtml += '</tbody></table>';
    }
    document.getElementById('modalRisksContainer').innerHTML = risksHtml;
    
    // Re-inicializar iconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Mostrar modal
    const modal = document.getElementById('projectModal');
    modal.classList.remove('hidden');
    
    // Resetear a pestaña General por defecto
    const generalTab = modal.querySelector('[data-tab="general"]');
    if (generalTab) generalTab.click();
}

// -------------------------------------------------------------
// Control de ciclo de vida seguro contra race conditions
// -------------------------------------------------------------
if (window.layoutReady) {
    initApp();
} else {
    document.addEventListener('layout-ready', initApp);
}
