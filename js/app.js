/**
 * ==========================================================================
 * AGROIDEAS PIIP - Controlador General (app.js)
 * Inicialización condicional y controladores de lógica de negocio (MPA)
 * ========================================================================== */

function initApp() {
    console.log('Iniciando controladores específicos de página...');

    // Helper global para actualizar indicador del proyecto activo en el Sidebar (todas las páginas)
    function actualizarIndicadorProyectoSidebar() {
        const sidebarLabel = document.getElementById('sidebar-active-project-name');
        if (sidebarLabel && typeof obtenerProyectoActivo === 'function') {
            const activeProj = obtenerProyectoActivo();
            if (activeProj) {
                sidebarLabel.textContent = `${activeProj.code}: ${activeProj.title}`;
                sidebarLabel.title = `${activeProj.code} - ${activeProj.title}`;
            }
        }
    }
    actualizarIndicadorProyectoSidebar();

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
    const aeiouRecordsContainer = document.getElementById('aeiou-records-container');
    const aeiouEmptyState = document.getElementById('aeiou-empty-state');
    const aeiouCounterBadge = document.getElementById('aeiou-counter-badge');
    const activeProjectTitleH01 = document.getElementById('active-project-title-h01');

    function renderObservacionesAEIOU() {
        if (!aeiouRecordsContainer) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;
        
        if (activeProjectTitleH01 && activeProj) {
            activeProjectTitleH01.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h01');
            const unitEl = document.getElementById('active-project-unit-h01');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        const dateInput = document.getElementById('aeiou-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        const observerInput = document.getElementById('aeiou-observer');
        if (observerInput && !observerInput.value && activeProj) {
            observerInput.value = activeProj.contact || 'Especialista en Innovación';
        }

        const list = typeof obtenerObservacionesAEIOU === 'function' ? obtenerObservacionesAEIOU('active') : [];
        if (aeiouCounterBadge) {
            aeiouCounterBadge.textContent = `${list.length} ${list.length === 1 ? 'hallazgo' : 'hallazgos'}`;
        }

        if (list.length === 0) {
            if (aeiouEmptyState) aeiouEmptyState.classList.remove('hidden');
            aeiouRecordsContainer.classList.add('hidden');
            aeiouRecordsContainer.innerHTML = '';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        if (aeiouEmptyState) aeiouEmptyState.classList.add('hidden');
        aeiouRecordsContainer.classList.remove('hidden');
        aeiouRecordsContainer.innerHTML = '';

        list.forEach((obs, index) => {
            const card = document.createElement('div');
            card.className = 'border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition shadow-xs';
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">#${index + 1}</span>
                        <div>
                            <span class="text-xs font-bold text-slate-800">${obs.observer || 'Especialista de Campo'}</span>
                            <span class="text-2xs text-slate-500 ml-2"><i data-lucide="calendar" class="w-3 h-3 inline"></i> ${obs.observationDate || obs.date || 'Sin fecha'}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn-delete-aeiou text-red-600 hover:text-red-800 font-semibold text-2xs flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" data-id="${obs.id}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Eliminar
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                    <div class="p-2.5 bg-white rounded border border-slate-150">
                        <span class="text-3xs uppercase font-bold text-emerald-800 block mb-1">A • Actividades</span>
                        <p class="text-slate-700 leading-relaxed text-2xs">${obs.activity || '-'}</p>
                    </div>
                    <div class="p-2.5 bg-white rounded border border-slate-150">
                        <span class="text-3xs uppercase font-bold text-emerald-800 block mb-1">E • Entorno</span>
                        <p class="text-slate-700 leading-relaxed text-2xs">${obs.environment || '-'}</p>
                    </div>
                    <div class="p-2.5 bg-white rounded border border-slate-150">
                        <span class="text-3xs uppercase font-bold text-emerald-800 block mb-1">I • Interacciones</span>
                        <p class="text-slate-700 leading-relaxed text-2xs">${obs.interaction || '-'}</p>
                    </div>
                    <div class="p-2.5 bg-white rounded border border-slate-150">
                        <span class="text-3xs uppercase font-bold text-emerald-800 block mb-1">O • Objetos</span>
                        <p class="text-slate-700 leading-relaxed text-2xs">${obs.object || obs.objects || '-'}</p>
                    </div>
                    <div class="p-2.5 bg-white rounded border border-slate-150">
                        <span class="text-3xs uppercase font-bold text-emerald-800 block mb-1">U • Usuarios</span>
                        <p class="text-slate-700 leading-relaxed text-2xs">${obs.user || obs.users || '-'}</p>
                    </div>
                </div>
            `;
            aeiouRecordsContainer.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (formAEIOU) {
        renderObservacionesAEIOU();

        formAEIOU.addEventListener('submit', (e) => {
            e.preventDefault();
            const obs = {
                observer: document.getElementById('aeiou-observer').value,
                observationDate: document.getElementById('aeiou-date').value,
                activity: document.getElementById('aeiou-a').value,
                environment: document.getElementById('aeiou-e').value,
                interaction: document.getElementById('aeiou-i').value,
                object: document.getElementById('aeiou-o').value,
                objects: document.getElementById('aeiou-o').value,
                user: document.getElementById('aeiou-u').value,
                users: document.getElementById('aeiou-u').value
            };
            guardarObservacionAEIOU(obs);
            alert('Observación de campo registrada con éxito.');
            formAEIOU.reset();
            renderObservacionesAEIOU();
        });

        const btnClearAeiou = document.getElementById('btn-clear-aeiou');
        if (btnClearAeiou) {
            btnClearAeiou.addEventListener('click', () => {
                formAEIOU.reset();
                const activeProj = obtenerProyectoActivo();
                if (activeProj) {
                    document.getElementById('aeiou-date').value = new Date().toISOString().split('T')[0];
                    document.getElementById('aeiou-observer').value = activeProj.contact || 'Especialista en Innovación';
                }
            });
        }

        const handlePreloadAeiou = () => {
            if (typeof precargarEjemploAEIOU === 'function') {
                precargarEjemploAEIOU('active');
                renderObservacionesAEIOU();
                alert('Ejemplo metodológico AEIOU precargado con éxito para esta iniciativa.');
            }
        };

        const btnPreloadAeiou = document.getElementById('btn-preload-aeiou');
        const btnEmptyPreloadAeiou = document.getElementById('btn-empty-preload-aeiou');
        if (btnPreloadAeiou) btnPreloadAeiou.addEventListener('click', handlePreloadAeiou);
        if (btnEmptyPreloadAeiou) btnEmptyPreloadAeiou.addEventListener('click', handlePreloadAeiou);

        if (aeiouRecordsContainer) {
            aeiouRecordsContainer.addEventListener('click', (e) => {
                const btnDelete = e.target.closest('.btn-delete-aeiou');
                if (btnDelete) {
                    const id = parseInt(btnDelete.getAttribute('data-id'));
                    if (confirm('¿Está seguro de eliminar esta observación de campo?')) {
                        eliminarObservacionAEIOU(id);
                        renderObservacionesAEIOU();
                    }
                }
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 1 - HERRAMIENTA 2: Mapa de Empatía
    // -------------------------------------------------------------
    const formEmpathy = document.getElementById('form-empathy');
    const canvasThink = document.getElementById('canvas-think');
    const canvasProfileBadge = document.getElementById('canvas-profile-badge');
    const activeProjectTitleH02 = document.getElementById('active-project-title-h02');

    function renderEmpathyMap() {
        if (!canvasThink) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        if (activeProjectTitleH02 && activeProj) {
            activeProjectTitleH02.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h02');
            const unitEl = document.getElementById('active-project-unit-h02');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        const data = typeof obtenerMapaEmpatia === 'function' ? obtenerMapaEmpatia('active') : null;
        if (data) {
            document.getElementById('emp-profile').value = data.userProfile || '';
            document.getElementById('emp-think').value = data.thinks || data.says || '';
            const feelInput = document.getElementById('emp-feel');
            if (feelInput) feelInput.value = data.feels || '';
            document.getElementById('emp-hear').value = data.hears || '';
            document.getElementById('emp-see').value = data.sees || '';
            const sayInput = document.getElementById('emp-say');
            if (sayInput) sayInput.value = data.says || '';
            const doInput = document.getElementById('emp-do');
            if (doInput) doInput.value = data.does || '';
            document.getElementById('emp-pain').value = data.pains || '';
            document.getElementById('emp-gain').value = data.gains || '';

            // Renderizar en el Canvas visual
            canvasThink.textContent = data.thinks || 'Sin registrar';
            const feelEl = document.getElementById('canvas-feel');
            if (feelEl) feelEl.textContent = data.feels || 'Sin registrar';
            document.getElementById('canvas-hear').textContent = data.hears || 'Sin registrar';
            document.getElementById('canvas-see').textContent = data.sees || 'Sin registrar';
            const sayEl = document.getElementById('canvas-say');
            if (sayEl) sayEl.textContent = data.says || 'Sin registrar';
            const doEl = document.getElementById('canvas-do');
            if (doEl) doEl.textContent = data.does || 'Sin registrar';
            document.getElementById('canvas-pain').textContent = data.pains || 'Sin registrar';
            document.getElementById('canvas-gain').textContent = data.gains || 'Sin registrar';
            if (canvasProfileBadge) {
                canvasProfileBadge.textContent = `Arquetipo: ${data.userProfile || 'General'}`;
                canvasProfileBadge.title = data.userProfile || '';
            }
        } else {
            // Limpiar si no hay datos
            document.getElementById('emp-profile').value = '';
            document.getElementById('emp-think').value = '';
            const feelInput = document.getElementById('emp-feel');
            if (feelInput) feelInput.value = '';
            document.getElementById('emp-hear').value = '';
            document.getElementById('emp-see').value = '';
            const sayInput = document.getElementById('emp-say');
            if (sayInput) sayInput.value = '';
            const doInput = document.getElementById('emp-do');
            if (doInput) doInput.value = '';
            document.getElementById('emp-pain').value = '';
            document.getElementById('emp-gain').value = '';
            canvasThink.textContent = 'Sin registrar';
            const feelEl = document.getElementById('canvas-feel');
            if (feelEl) feelEl.textContent = 'Sin registrar';
            document.getElementById('canvas-hear').textContent = 'Sin registrar';
            document.getElementById('canvas-see').textContent = 'Sin registrar';
            const sayEl = document.getElementById('canvas-say');
            if (sayEl) sayEl.textContent = 'Sin registrar';
            const doEl = document.getElementById('canvas-do');
            if (doEl) doEl.textContent = 'Sin registrar';
            document.getElementById('canvas-pain').textContent = 'Sin registrar';
            document.getElementById('canvas-gain').textContent = 'Sin registrar';
            if (canvasProfileBadge) canvasProfileBadge.textContent = 'Arquetipo: General';
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (formEmpathy) {
        renderEmpathyMap();

        formEmpathy.addEventListener('submit', (e) => {
            e.preventDefault();
            const mapData = {
                userProfile: document.getElementById('emp-profile').value,
                thinks: document.getElementById('emp-think').value,
                feels: document.getElementById('emp-feel') ? document.getElementById('emp-feel').value : '',
                hears: document.getElementById('emp-hear').value,
                sees: document.getElementById('emp-see').value,
                says: document.getElementById('emp-say') ? document.getElementById('emp-say').value : '',
                does: document.getElementById('emp-do') ? document.getElementById('emp-do').value : '',
                pains: document.getElementById('emp-pain').value,
                gains: document.getElementById('emp-gain').value
            };
            guardarMapaEmpatia(mapData, 'active');
            renderEmpathyMap();
            alert('Lienzo del Mapa de Empatía actualizado exitosamente.');
        });

        const btnPreloadEmpathy = document.getElementById('btn-preload-empathy');
        if (btnPreloadEmpathy) {
            btnPreloadEmpathy.addEventListener('click', () => {
                if (typeof precargarEjemploMapaEmpatia === 'function') {
                    precargarEjemploMapaEmpatia('active');
                    renderEmpathyMap();
                    alert('Ejemplo metodológico de Mapa de Empatía cargado para esta iniciativa.');
                }
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 1 - HERRAMIENTA 3: Encuestas de Campo
    // -------------------------------------------------------------
    const formSurvey = document.getElementById('form-survey');
    const surveysTableEl = document.getElementById('surveysTable');
    const surveysEmptyState = document.getElementById('surveys-empty-state');
    const surveysTableContainer = document.getElementById('surveys-table-container');
    const activeProjectTitleH03 = document.getElementById('active-project-title-h03');
    let surveysDataTable = null;

    function updateSurveysKPIs(list) {
        const kpiSampleSize = document.getElementById('kpi-sample-size');
        const kpiSatisfactionAvg = document.getElementById('kpi-satisfaction-avg');
        const kpiSentimentRatio = document.getElementById('kpi-sentiment-ratio');

        const total = list.length;
        if (kpiSampleSize) kpiSampleSize.textContent = `${total} ${total === 1 ? 'encuesta' : 'encuestas'}`;

        if (total === 0) {
            if (kpiSatisfactionAvg) kpiSatisfactionAvg.textContent = '0.0 / 5.0';
            if (kpiSentimentRatio) kpiSentimentRatio.textContent = '0% Positivo';
            return;
        }

        const sumSat = list.reduce((acc, curr) => acc + (parseInt(curr.satisfaction) || 0), 0);
        const avgSat = (sumSat / total).toFixed(1);
        if (kpiSatisfactionAvg) kpiSatisfactionAvg.textContent = `${avgSat} / 5.0`;

        const positiveCount = list.filter(s => s.sentiment === 'Positivo').length;
        const ratio = Math.round((positiveCount / total) * 100);
        if (kpiSentimentRatio) kpiSentimentRatio.textContent = `${ratio}% Positivo`;
    }

    function initSurveysView() {
        if (!surveysTableEl) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        if (activeProjectTitleH03 && activeProj) {
            activeProjectTitleH03.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h03');
            const unitEl = document.getElementById('active-project-unit-h03');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        const dateInput = document.getElementById('srv-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        const currentData = typeof obtenerEncuestas === 'function' ? obtenerEncuestas('active') : [];
        updateSurveysKPIs(currentData);

        if (currentData.length === 0) {
            if (surveysEmptyState) surveysEmptyState.classList.remove('hidden');
            if (surveysTableContainer) surveysTableContainer.classList.add('hidden');
        } else {
            if (surveysEmptyState) surveysEmptyState.classList.add('hidden');
            if (surveysTableContainer) surveysTableContainer.classList.remove('hidden');
        }

        if (typeof $ !== 'undefined') {
            if ($.fn.DataTable.isDataTable('#surveysTable')) {
                $('#surveysTable').DataTable().destroy();
            }

            surveysDataTable = $('#surveysTable').DataTable({
                data: currentData,
                columns: [
                    {
                        data: 'date',
                        defaultContent: '-',
                        render: (data) => `<span class="text-2xs text-slate-500 font-mono">${data || 'Sin fecha'}</span>`
                    },
                    {
                        data: 'respondent',
                        render: function(data, type, row) {
                            const coop = row.cooperative || row.organization || '';
                            return `
                                <div>
                                    <div class="font-bold text-slate-800 text-xs">${data || 'Productor'}</div>
                                    ${coop ? `<div class="text-3xs text-emerald-800 font-semibold">${coop}</div>` : ''}
                                </div>
                            `;
                        }
                    },
                    { 
                        data: 'satisfaction',
                        render: function(data) {
                            const val = parseInt(data) || 0;
                            let color = 'text-amber-500';
                            if (val <= 2) color = 'text-red-500';
                            else if (val >= 4) color = 'text-emerald-600';
                            return `<div class="flex items-center gap-1 font-bold ${color}">${val} <i data-lucide="star" class="w-3.5 h-3.5 fill-current inline"></i></div>`;
                        }
                    },
                    { 
                        data: 'comments',
                        render: (data) => `<p class="text-xs text-slate-700 italic max-w-sm line-clamp-2" title="${data || ''}">"${data || '-'}"</p>`
                    },
                    { 
                        data: 'sentiment',
                        render: function (data) {
                            let colorClass = 'bg-slate-100 text-slate-800';
                            if (data === 'Positivo') colorClass = 'bg-emerald-100 text-emerald-800 font-bold';
                            else if (data === 'Negativo') colorClass = 'bg-red-100 text-red-800 font-bold';
                            else if (data === 'Neutro') colorClass = 'bg-blue-100 text-blue-800 font-semibold';
                            return `<span class="px-2 py-0.5 text-3xs uppercase rounded border border-current ${colorClass}">${data}</span>`;
                        }
                    },
                    {
                        data: null,
                        orderable: false,
                        className: 'text-right',
                        render: function(data, type, row) {
                            return `
                                <button type="button" class="btn-delete-survey text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded" data-id="${row.id}" title="Eliminar encuesta">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
                                </button>
                            `;
                        }
                    }
                ],
                drawCallback: function() {
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                },
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
                }
            });
        }
    }

    if (formSurvey) {
        initSurveysView();

        formSurvey.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSrv = {
                respondent: document.getElementById('srv-respondent').value,
                cooperative: document.getElementById('srv-cooperative').value,
                satisfaction: parseInt(document.getElementById('srv-satisfaction').value),
                date: document.getElementById('srv-date').value,
                comments: document.getElementById('srv-comments').value
            };
            guardarEncuesta(newSrv);
            alert('Encuesta de campo registrada correctamente.');
            formSurvey.reset();
            initSurveysView();
        });

        const btnClearSurvey = document.getElementById('btn-clear-survey');
        if (btnClearSurvey) {
            btnClearSurvey.addEventListener('click', () => {
                formSurvey.reset();
                document.getElementById('srv-date').value = new Date().toISOString().split('T')[0];
            });
        }

        const handlePreloadSurveys = () => {
            if (typeof precargarEjemploEncuesta === 'function') {
                precargarEjemploEncuesta('active');
                initSurveysView();
                alert('Muestra metodológica de encuestas precargada con éxito para esta iniciativa.');
            }
        };

        const btnPreloadSurveys = document.getElementById('btn-preload-surveys');
        const btnEmptyPreloadSurveys = document.getElementById('btn-empty-preload-surveys');
        if (btnPreloadSurveys) btnPreloadSurveys.addEventListener('click', handlePreloadSurveys);
        if (btnEmptyPreloadSurveys) btnEmptyPreloadSurveys.addEventListener('click', handlePreloadSurveys);

        if (surveysTableEl) {
            $(surveysTableEl).on('click', '.btn-delete-survey', function() {
                const id = parseInt($(this).attr('data-id'));
                if (confirm('¿Desea eliminar esta encuesta?')) {
                    eliminarEncuesta(id);
                    initSurveysView();
                }
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 4: Ficha de Persona (Arquetipos)
    // -------------------------------------------------------------
    const formPersona = document.getElementById('form-persona');
    const personasContainer = document.getElementById('personas-container');
    const activeProjectTitleH04 = document.getElementById('active-project-title-h04');

    function initFichaPersonaView() {
        if (!personasContainer) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        if (activeProjectTitleH04 && activeProj) {
            activeProjectTitleH04.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h04');
            const unitEl = document.getElementById('active-project-unit-h04');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        renderPersonas();
    }

    function renderPersonas() {
        if (!personasContainer) return;
        personasContainer.innerHTML = '';
        const list = typeof obtenerPersonas === 'function' ? obtenerPersonas('active') : [];

        const countEl = document.getElementById('count-personas');
        if (countEl) {
            countEl.textContent = `${list.length} ${list.length === 1 ? 'arquetipo' : 'arquetipos'}`;
        }

        if (list.length === 0) {
            personasContainer.innerHTML = `
                <div class="col-span-1 md:col-span-2 bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <div class="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <i data-lucide="user-x" class="w-6 h-6"></i>
                    </div>
                    <h4 class="text-sm font-bold text-slate-700">Sin arquetipos registrados</h4>
                    <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">No hay fichas de persona formuladas aún para esta iniciativa. Puedes registrar una desde el formulario o cargar un ejemplo metodológico institucional.</p>
                    <button type="button" id="btn-empty-preload-persona" class="btn btn-secondary text-xs mt-4 inline-flex items-center gap-1.5 py-1.5 px-3">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
                        <span>Cargar Ejemplo Metodológico</span>
                    </button>
                </div>
            `;
            const emptyBtn = document.getElementById('btn-empty-preload-persona');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', handlePreloadPersona);
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        list.forEach(per => {
            const card = document.createElement('div');
            card.className = 'card border-slate-200 relative hover:border-emerald-300 transition-all flex flex-col justify-between';

            const nameStr = per.archetypeName || per.name || 'Arquetipo';
            const initial = nameStr.trim().charAt(0).toUpperCase();

            // Metas list
            const goalsList = Array.isArray(per.goals) ? per.goals : (per.goals ? per.goals.split('\n').filter(Boolean) : (per.motivation ? [per.motivation] : []));
            const frustList = Array.isArray(per.frustrations) ? per.frustrations : (per.frustrations ? per.frustrations.split('\n').filter(Boolean) : (per.frustration ? [per.frustration] : []));

            const goalsHtml = goalsList.map(g => `<li class="flex items-start gap-1.5 text-2xs text-slate-700"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i><span>${g}</span></li>`).join('');
            const frustHtml = frustList.map(f => `<li class="flex items-start gap-1.5 text-2xs text-slate-700"><i data-lucide="alert-circle" class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5"></i><span>${f}</span></li>`).join('');

            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 bg-emerald-800 text-white font-bold flex items-center justify-center text-base rounded shadow-xs shrink-0">
                                ${initial}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm leading-tight">${nameStr}</h4>
                                <p class="text-xs text-slate-500">${per.role || 'Productor'}</p>
                            </div>
                        </div>
                        <button type="button" class="btn-delete-persona text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors" data-id="${per.id}" title="Eliminar arquetipo">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Badges Demografía y Competencia Digital -->
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        <span class="text-3xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> ${per.demographics || 'Demografía no especificada'}
                        </span>
                        <span class="text-3xs bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                            <i data-lucide="smartphone" class="w-3 h-3 text-blue-500"></i> ${per.techTechSavviness || 'Medio'}
                        </span>
                    </div>

                    <!-- Cita Destacada -->
                    <blockquote class="italic text-xs text-slate-700 pl-3 border-l-2 border-emerald-600 mb-3 bg-emerald-50/40 py-1.5 pr-2">
                        "${per.quote || 'Sin lema registrado.'}"
                    </blockquote>

                    <!-- Biografía -->
                    ${per.bio ? `<p class="text-2xs text-slate-600 mb-3 leading-relaxed">${per.bio}</p>` : ''}

                    <!-- Grid Metas y Frustraciones -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <span class="text-3xs uppercase tracking-wider text-emerald-800 font-bold block mb-1.5 flex items-center gap-1">
                                <i data-lucide="target" class="w-3 h-3 text-emerald-600"></i> Objetivos y Metas
                            </span>
                            <ul class="space-y-1">
                                ${goalsHtml || '<li class="text-3xs text-slate-400 italic">Sin objetivos</li>'}
                            </ul>
                        </div>
                        <div>
                            <span class="text-3xs uppercase tracking-wider text-amber-800 font-bold block mb-1.5 flex items-center gap-1">
                                <i data-lucide="shield-alert" class="w-3 h-3 text-amber-600"></i> Frustraciones y Dolores
                            </span>
                            <ul class="space-y-1">
                                ${frustHtml || '<li class="text-3xs text-slate-400 italic">Sin frustraciones</li>'}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            personasContainer.appendChild(card);
        });

        // Event listener para eliminar
        personasContainer.querySelectorAll('.btn-delete-persona').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                if (confirm('¿Desea eliminar esta ficha de arquetipo?')) {
                    if (typeof eliminarPersona === 'function') {
                        eliminarPersona(id);
                        renderPersonas();
                    }
                }
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function handlePreloadPersona() {
        if (typeof precargarEjemploPersona === 'function') {
            precargarEjemploPersona('active');
            renderPersonas();
            alert('Ejemplo metodológico de arquetipo cargado para esta iniciativa.');
        }
    }

    if (formPersona) {
        initFichaPersonaView();

        formPersona.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalsText = document.getElementById('per-goals').value;
            const frustText = document.getElementById('per-frustrations').value;

            const persona = {
                archetypeName: document.getElementById('per-archetype').value,
                name: document.getElementById('per-archetype').value,
                role: document.getElementById('per-role').value,
                demographics: document.getElementById('per-demographics').value,
                techTechSavviness: document.getElementById('per-tech').value,
                quote: document.getElementById('per-quote').value,
                bio: document.getElementById('per-bio').value,
                goals: goalsText.split('\n').map(g => g.trim()).filter(Boolean),
                frustrations: frustText.split('\n').map(f => f.trim()).filter(Boolean)
            };

            guardarPersona(persona);
            renderPersonas();
            alert('Ficha de Arquetipo guardada exitosamente.');
            formPersona.reset();
        });

        const btnClearPersona = document.getElementById('btn-clear-persona');
        if (btnClearPersona) {
            btnClearPersona.addEventListener('click', () => {
                formPersona.reset();
            });
        }

        const btnPreloadPersona = document.getElementById('btn-preload-persona');
        if (btnPreloadPersona) {
            btnPreloadPersona.addEventListener('click', handlePreloadPersona);
        }
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 5: Muro de Hallazgos (Research Wall)
    // -------------------------------------------------------------
    const formInsight = document.getElementById('form-insight');
    const insightsGrid = document.getElementById('insights-grid');
    const activeProjectTitleH05 = document.getElementById('active-project-title-h05');
    const filterClusterSelect = document.getElementById('filter-cluster');

    function initMuroHallazgosView() {
        if (!insightsGrid) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        if (activeProjectTitleH05 && activeProj) {
            activeProjectTitleH05.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h05');
            const unitEl = document.getElementById('active-project-unit-h05');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        populateClusterFilter();
        renderInsightsGrid();
    }

    function populateClusterFilter() {
        if (!filterClusterSelect) return;
        const currentVal = filterClusterSelect.value || 'ALL';
        filterClusterSelect.innerHTML = '<option value="ALL">Todos los Clústeres</option>';

        const allInsights = typeof obtenerInsights === 'function' ? obtenerInsights('active') : [];
        const clusters = [...new Set(allInsights.map(i => i.clusterCategory || 'General').filter(Boolean))];

        clusters.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            filterClusterSelect.appendChild(opt);
        });

        if (clusters.includes(currentVal)) {
            filterClusterSelect.value = currentVal;
        } else {
            filterClusterSelect.value = 'ALL';
        }
    }

    function renderInsightsGrid() {
        if (!insightsGrid) return;
        insightsGrid.innerHTML = '';
        const allInsights = typeof obtenerInsights === 'function' ? obtenerInsights('active') : [];

        const countEl = document.getElementById('count-insights');
        if (countEl) {
            countEl.textContent = `${allInsights.length} ${allInsights.length === 1 ? 'nota' : 'notas'}`;
        }

        const selectedCluster = filterClusterSelect ? filterClusterSelect.value : 'ALL';
        const filtered = selectedCluster === 'ALL' 
            ? allInsights 
            : allInsights.filter(i => (i.clusterCategory || 'General') === selectedCluster);

        if (filtered.length === 0) {
            insightsGrid.innerHTML = `
                <div class="col-span-1 md:col-span-2 bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <div class="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <i data-lucide="sticky-note" class="w-6 h-6"></i>
                    </div>
                    <h4 class="text-sm font-bold text-slate-700">Sin hallazgos en este filtro</h4>
                    <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">No hay insights documentados para el criterio seleccionado. Registra una nueva revelación o carga el ejemplo metodológico.</p>
                    <button type="button" id="btn-empty-preload-insight" class="btn btn-secondary text-xs mt-4 inline-flex items-center gap-1.5 py-1.5 px-3">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
                        <span>Cargar Ejemplo Metodológico</span>
                    </button>
                </div>
            `;
            const emptyBtn = document.getElementById('btn-empty-preload-insight');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', handlePreloadInsight);
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        filtered.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'sticky-note relative flex flex-col justify-between hover:shadow-md transition-shadow';

            // Priority badge styling
            let priorityClass = 'bg-slate-200 text-slate-700 border-slate-300';
            const prio = (insight.priority || 'Alta').toLowerCase();
            if (prio.includes('alta')) priorityClass = 'bg-red-100 text-red-800 border-red-200';
            else if (prio.includes('media')) priorityClass = 'bg-amber-200 text-amber-900 border-amber-300';
            else if (prio.includes('baja')) priorityClass = 'bg-slate-200 text-slate-700 border-slate-300';

            const titleStr = insight.findingTitle || insight.title || 'Hallazgo';
            const textStr = insight.evidenceText || insight.text || '';
            const clusterStr = insight.clusterCategory || 'General';
            const sourceStr = insight.sourceTool || 'Investigación';
            const imgUrl = insight.image || insight.imageUrl || '';

            let imageHtml = '';
            if (imgUrl) {
                imageHtml = `<img src="${imgUrl}" alt="Evidencia" class="mt-2.5 w-full h-32 object-cover border border-[#fcd34d] rounded-xs">`;
            }

            card.innerHTML = `
                <div>
                    <!-- Encabezado de la nota -->
                    <div class="flex justify-between items-start gap-2 mb-2">
                        <span class="text-3xs uppercase tracking-wider font-bold bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded border border-amber-300/80">
                            ${clusterStr}
                        </span>
                        <div class="flex items-center gap-1">
                            <span class="text-3xs uppercase font-bold px-1.5 py-0.5 rounded border ${priorityClass}">
                                ${insight.priority || 'Alta'}
                            </span>
                            <button type="button" class="btn-delete-insight text-amber-900/60 hover:text-red-700 p-0.5 rounded transition-colors" data-id="${insight.id}" title="Eliminar insight">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Título -->
                    <h4 class="sticky-note__title text-sm font-bold leading-tight mb-2 text-amber-950">
                        ${titleStr}
                    </h4>

                    <!-- Texto evidencia -->
                    <p class="text-xs text-amber-950/90 mb-3 leading-relaxed">
                        ${textStr}
                    </p>

                    <!-- Cita textual -->
                    ${insight.quote ? `
                    <blockquote class="sticky-note__quote text-2xs italic text-amber-950/80 mb-2">
                        "${insight.quote}"
                    </blockquote>
                    ` : ''}

                    ${imageHtml}
                </div>

                <!-- Footer de la nota: Herramienta origen y fecha -->
                <div class="mt-3 pt-2 border-t border-[#fcd34d]/60 flex items-center justify-between text-3xs text-amber-950/70 font-mono">
                    <span class="truncate max-w-[150px]" title="Origen: ${sourceStr}">
                        <i data-lucide="compass" class="w-3 h-3 inline mr-0.5 text-amber-900"></i> ${sourceStr}
                    </span>
                    <span>${insight.date || '2026-09-29'}</span>
                </div>
            `;
            insightsGrid.appendChild(card);
        });

        // Event listener para eliminar insights
        insightsGrid.querySelectorAll('.btn-delete-insight').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                if (confirm('¿Desea retirar esta nota del muro de hallazgos?')) {
                    if (typeof eliminarInsight === 'function') {
                        eliminarInsight(id);
                        populateClusterFilter();
                        renderInsightsGrid();
                    }
                }
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function handlePreloadInsight() {
        if (typeof precargarEjemploInsight === 'function') {
            precargarEjemploInsight('active');
            populateClusterFilter();
            renderInsightsGrid();
            alert('Ejemplo metodológico fijado en el muro para esta iniciativa.');
        }
    }

    if (formInsight) {
        initMuroHallazgosView();

        if (filterClusterSelect) {
            filterClusterSelect.addEventListener('change', () => {
                renderInsightsGrid();
            });
        }

        formInsight.addEventListener('submit', (e) => {
            e.preventDefault();
            const newInsight = {
                clusterCategory: document.getElementById('insight-cluster').value,
                findingTitle: document.getElementById('insight-title').value,
                title: document.getElementById('insight-title').value,
                sourceTool: document.getElementById('insight-source').value,
                priority: document.getElementById('insight-priority').value,
                evidenceText: document.getElementById('insight-text').value,
                text: document.getElementById('insight-text').value,
                quote: document.getElementById('insight-quote').value,
                image: document.getElementById('insight-image').value,
                date: new Date().toISOString().split('T')[0]
            };

            guardarInsight(newInsight);
            populateClusterFilter();
            renderInsightsGrid();
            alert('Insight fijado en el muro exitosamente.');
            formInsight.reset();
        });

        const btnClearInsight = document.getElementById('btn-clear-insight');
        if (btnClearInsight) {
            btnClearInsight.addEventListener('click', () => {
                formInsight.reset();
            });
        }

        const btnPreloadInsight = document.getElementById('btn-preload-insight');
        if (btnPreloadInsight) {
            btnPreloadInsight.addEventListener('click', handlePreloadInsight);
        }
    }

    // -------------------------------------------------------------
    // FASE 2 - HERRAMIENTA 6: Definición del Desafío HMW
    // -------------------------------------------------------------
    const formDesafio = document.getElementById('form-desafio');
    const desInsightSelect = document.getElementById('des-insight-select');
    const desafiosTableEl = document.getElementById('desafiosTable');
    const activeProjectTitleH06 = document.getElementById('active-project-title-h06');
    let desafiosDataTable = null;

    function initDefinicionDesafioView() {
        if (!desafiosTableEl) return;
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        if (activeProjectTitleH06 && activeProj) {
            activeProjectTitleH06.textContent = activeProj.title;
            const codeEl = document.getElementById('active-project-code-h06');
            const unitEl = document.getElementById('active-project-unit-h06');
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'AGROIDEAS';
        }

        populateInsightSelect();
        renderDesafiosTable();
        initMadLibsAssistant();
    }

    function populateInsightSelect() {
        if (!desInsightSelect) return;
        desInsightSelect.innerHTML = '';
        const list = typeof obtenerInsights === 'function' ? obtenerInsights('active') : [];

        if (list.length === 0) {
            const opt = document.createElement('option');
            opt.value = "";
            opt.textContent = "Ningún Insight registrado para esta iniciativa (Revisa H05 Muro de Hallazgos)";
            desInsightSelect.appendChild(opt);
            return;
        }

        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.textContent = "-- Selecciona un Insight validado en H05 --";
        desInsightSelect.appendChild(defaultOpt);

        list.forEach(ins => {
            const opt = document.createElement('option');
            opt.value = ins.id;
            const titleStr = ins.findingTitle || ins.title || 'Hallazgo';
            const clusterStr = ins.clusterCategory || 'General';
            opt.textContent = `[${clusterStr}] ${titleStr}`;
            desInsightSelect.appendChild(opt);
        });
    }

    function initMadLibsAssistant() {
        const targetUserEl = document.getElementById('des-target-user');
        const actionGoalEl = document.getElementById('des-action-goal');
        const constraintEl = document.getElementById('des-constraint');
        const previewEl = document.getElementById('hmw-preview-text');
        const questionEl = document.getElementById('des-question');

        if (!targetUserEl || !actionGoalEl || !constraintEl || !previewEl || !questionEl) return;

        let userTouchedQuestion = false;
        questionEl.addEventListener('input', () => {
            userTouchedQuestion = true;
        });

        function updatePreview() {
            const user = targetUserEl.value.trim();
            const goal = actionGoalEl.value.trim();
            const pain = constraintEl.value.trim();

            const userDisplay = user || '[Usuario Objetivo]';
            const goalDisplay = goal || '[Acción de Mejora]';
            const painDisplay = pain || '[Obstáculo a Superar]';

            previewEl.innerHTML = `"¿Cómo podríamos <span class="text-emerald-700 underline">${goalDisplay}</span> para <span class="text-blue-700 underline">${userDisplay}</span> a pesar de <span class="text-amber-700 underline">${painDisplay}</span>?"`;

            if (!userTouchedQuestion) {
                if (user || goal || pain) {
                    questionEl.value = `¿Cómo podríamos ${goal || '...'} para ${user || '...'} a pesar de ${pain || '...'}?`;
                } else {
                    questionEl.value = '¿Cómo podríamos ';
                }
            }
        }

        targetUserEl.addEventListener('input', updatePreview);
        actionGoalEl.addEventListener('input', updatePreview);
        constraintEl.addEventListener('input', updatePreview);
    }

    function renderDesafiosTable() {
        if (!desafiosTableEl || typeof $ === 'undefined') return;

        const currentData = typeof obtenerDesafios === 'function' ? obtenerDesafios('active') : [];

        const countEl = document.getElementById('count-desafios');
        if (countEl) {
            countEl.textContent = `${currentData.length} ${currentData.length === 1 ? 'desafío' : 'desafíos'}`;
        }

        if ($.fn.DataTable.isDataTable('#desafiosTable')) {
            $('#desafiosTable').DataTable().destroy();
        }

        desafiosDataTable = $('#desafiosTable').DataTable({
            data: currentData,
            columns: [
                { 
                    data: 'id',
                    render: (data) => `<span class="font-mono text-2xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">HMW-${String(data).padStart(3, '0')}</span>`
                },
                { 
                    data: 'insightId',
                    render: function (data) {
                        const allInsights = typeof obtenerInsights === 'function' ? obtenerInsights('ALL') : [];
                        const insightObj = allInsights.find(i => i.id === parseInt(data));
                        if (insightObj) {
                            const titleStr = insightObj.findingTitle || insightObj.title || 'Insight';
                            const clusterStr = insightObj.clusterCategory || 'General';
                            return `
                                <div>
                                    <span class="text-3xs uppercase text-slate-500 font-semibold block">${clusterStr}</span>
                                    <span class="text-xs font-medium text-slate-800">${titleStr}</span>
                                </div>
                            `;
                        }
                        return `<span class="text-xs text-slate-500">Insight #${data || 'General'}</span>`;
                    }
                },
                { 
                    data: null,
                    render: function(data, type, row) {
                        const hmwStr = row.hmwStatement || row.question || '-';
                        return `
                            <div>
                                <p class="text-xs font-semibold text-slate-800 leading-snug">${hmwStr}</p>
                                ${row.targetUser ? `<span class="text-3xs text-slate-500 mt-1 block">Para: ${row.targetUser}</span>` : ''}
                            </div>
                        `;
                    }
                },
                {
                    data: 'status',
                    render: function (data) {
                        const statusVal = data || 'Borrador';
                        let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
                        if (statusVal === 'Aprobado UPP') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                        else if (statusVal === 'Validado por Equipo') colorClass = 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
                        return `<span class="px-2 py-0.5 text-3xs uppercase rounded border ${colorClass}">${statusVal}</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-right',
                    render: function(data, type, row) {
                        return `
                            <div class="flex items-center justify-end gap-1.5">
                                <button type="button" class="btn-toggle-status text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-50 rounded" data-id="${row.id}" data-status="${row.status || 'Borrador'}" title="Avanzar estado institucional">
                                    <i data-lucide="check-circle" class="w-4 h-4 inline"></i>
                                </button>
                                <button type="button" class="btn-delete-desafio text-slate-400 hover:text-red-700 p-1 hover:bg-red-50 rounded" data-id="${row.id}" title="Eliminar desafío">
                                    <i data-lucide="trash-2" class="w-4 h-4 inline"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            drawCallback: function() {
                if (typeof lucide !== 'undefined') lucide.createIcons();
            },
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });
    }

    function handlePreloadDesafio() {
        if (typeof precargarEjemploDesafio === 'function') {
            precargarEjemploDesafio('active');
            renderDesafiosTable();
            alert('Ejemplo metodológico de desafío HMW formulado y aprobado para esta iniciativa.');
        }
    }

    if (formDesafio) {
        initDefinicionDesafioView();

        formDesafio.addEventListener('submit', (e) => {
            e.preventDefault();
            const questionVal = document.getElementById('des-question').value.trim();
            
            // Forzar estructura metodológica
            if (!questionVal.toLowerCase().startsWith('¿cómo podríamos')) {
                alert('Por regla metodológica del Doble Diamante, la pregunta DEBE comenzar con "¿Cómo podríamos...?"');
                return;
            }

            const insId = desInsightSelect.value;
            if (!insId) {
                alert('Debe vincular un Insight sostén proveniente de la investigación de campo.');
                return;
            }

            const newDes = {
                insightId: parseInt(insId),
                targetUser: document.getElementById('des-target-user').value.trim(),
                actionGoal: document.getElementById('des-action-goal').value.trim(),
                constraintOrPain: document.getElementById('des-constraint').value.trim(),
                hmwStatement: questionVal,
                question: questionVal,
                status: document.getElementById('des-status').value
            };

            guardarDesafio(newDes);
            renderDesafiosTable();
            alert('Desafío de Innovación (HMW) registrado y vinculado a la Fase 2.');
            
            formDesafio.reset();
            document.getElementById('des-question').value = '¿Cómo podríamos ';
            const previewEl = document.getElementById('hmw-preview-text');
            if (previewEl) {
                previewEl.innerHTML = '"¿Cómo podríamos <span class="text-emerald-700 underline">[Acción]</span> para <span class="text-blue-700 underline">[Usuario Objetivo]</span> a pesar de <span class="text-amber-700 underline">[Obstáculo]</span>?"';
            }
        });

        const btnClearDesafio = document.getElementById('btn-clear-desafio');
        if (btnClearDesafio) {
            btnClearDesafio.addEventListener('click', () => {
                formDesafio.reset();
                document.getElementById('des-question').value = '¿Cómo podríamos ';
                const previewEl = document.getElementById('hmw-preview-text');
                if (previewEl) {
                    previewEl.innerHTML = '"¿Cómo podríamos <span class="text-emerald-700 underline">[Acción]</span> para <span class="text-blue-700 underline">[Usuario Objetivo]</span> a pesar de <span class="text-amber-700 underline">[Obstáculo]</span>?"';
                }
            });
        }

        const btnPreloadDesafio = document.getElementById('btn-preload-desafio');
        if (btnPreloadDesafio) {
            btnPreloadDesafio.addEventListener('click', handlePreloadDesafio);
        }

        // Delegación de eventos en la tabla para cambiar estado y eliminar
        if (desafiosTableEl) {
            $(desafiosTableEl).on('click', '.btn-toggle-status', function() {
                const id = parseInt($(this).attr('data-id'));
                const currentStatus = $(this).attr('data-status');
                let nextStatus = 'Aprobado UPP';
                if (currentStatus === 'Borrador') nextStatus = 'Validado por Equipo';
                else if (currentStatus === 'Validado por Equipo') nextStatus = 'Aprobado UPP';
                else nextStatus = 'Borrador';

                if (typeof actualizarEstadoDesafio === 'function') {
                    actualizarEstadoDesafio(id, nextStatus);
                    renderDesafiosTable();
                }
            });

            $(desafiosTableEl).on('click', '.btn-delete-desafio', function() {
                const id = parseInt($(this).attr('data-id'));
                if (confirm('¿Desea eliminar este desafío metodológico?')) {
                    if (typeof eliminarDesafio === 'function') {
                        eliminarDesafio(id);
                        renderDesafiosTable();
                    }
                }
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 7: Lluvia de Ideas
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 7: Lluvia de Ideas y Crazy 8's
    // -------------------------------------------------------------
    const formBrainstorming = document.getElementById('form-brainstorming');
    const brainDesafioSelect = document.getElementById('brain-desafio-select');
    const h07BannerTitle = document.getElementById('active-project-title-h07');
    
    if (formBrainstorming || h07BannerTitle) {
        function updateH07Banner() {
            const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;
            if (activeProj) {
                if (h07BannerTitle) h07BannerTitle.textContent = activeProj.title;
                const codeEl = document.getElementById('active-project-code-h07');
                if (codeEl) codeEl.textContent = activeProj.code;
                const unitEl = document.getElementById('active-project-unit-h07');
                if (unitEl) unitEl.textContent = activeProj.unit;
            }
        }

        function populateDesafiosDropdown() {
            if (!brainDesafioSelect) return;
            brainDesafioSelect.innerHTML = '';
            const list = typeof obtenerDesafios === 'function' ? obtenerDesafios('active') : [];
            
            if (list.length === 0) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.textContent = "Ningún Desafío HMW Registrado (Ir a Fase 2 - H06)";
                brainDesafioSelect.appendChild(opt);
                return;
            }

            list.forEach(des => {
                const opt = document.createElement('option');
                opt.value = des.id;
                opt.textContent = `${des.hmwStatement || des.question || ('Desafío HMW-' + des.id)} [${des.status || 'Borrador'}]`;
                brainDesafioSelect.appendChild(opt);
            });
        }

        function renderBrainstormingBoard() {
            const colTech = document.getElementById('col-tecnológica');
            const colProc = document.getElementById('col-procesos');
            const colNorm = document.getElementById('col-normativa');
            const colCap = document.getElementById('col-capacitación');

            if (!colTech || !colProc || !colNorm || !colCap) return;

            colTech.innerHTML = '';
            colProc.innerHTML = '';
            colNorm.innerHTML = '';
            colCap.innerHTML = '';

            const ideas = typeof obtenerBrainstormings === 'function' ? obtenerBrainstormings('active') : [];
            const desafiosList = typeof obtenerDesafios === 'function' ? obtenerDesafios('all') : [];

            let countTech = 0, countProc = 0, countNorm = 0, countCap = 0;
            let totalVotes = 0;

            ideas.forEach(item => {
                totalVotes += (item.votesCount || 0);

                const card = document.createElement('div');
                card.className = 'bg-white p-3.5 border border-slate-200 shadow-2xs relative hover:shadow-xs transition-all flex flex-col justify-between group';
                
                const desObj = desafiosList.find(d => d.id === parseInt(item.desafioId));
                const desText = desObj ? (desObj.hmwStatement || desObj.question) : (item.desafioId ? `Desafío HMW-${item.desafioId}` : 'Sin desafío vinculado');
                const titleText = item.ideaTitle || item.idea || 'Idea sin título';
                const descText = item.description || item.idea || '';
                const roleText = item.authorRole || 'Especialista de Innovación';
                const votes = item.votesCount || 0;

                card.innerHTML = `
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                        <h5 class="text-xs font-bold text-slate-800 leading-snug">${titleText}</h5>
                        <button type="button" class="btn-delete-brain text-slate-300 hover:text-red-500 transition-colors p-1" data-id="${item.id}" title="Eliminar idea">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <p class="text-2xs text-slate-600 leading-relaxed mb-3">${descText}</p>
                    <div class="border-t border-slate-100 pt-2 flex flex-col gap-1.5 text-3xs text-slate-500">
                        <div class="flex items-center justify-between">
                            <span class="font-semibold text-slate-600 flex items-center gap-1">
                                <i data-lucide="user" class="w-2.5 h-2.5 text-slate-400"></i> ${roleText}
                            </span>
                            <button type="button" class="btn-vote-brain flex items-center gap-1 font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded transition-all cursor-pointer" data-id="${item.id}" title="Votar (+1 Voto)">
                                <i data-lucide="thumbs-up" class="w-3 h-3 text-amber-500"></i>
                                <span class="vote-num font-mono font-bold">${votes}</span>
                            </button>
                        </div>
                        <div class="flex items-center gap-1 text-emerald-800 italic truncate" title="${desText}">
                            <i data-lucide="help-circle" class="w-2.5 h-2.5 shrink-0 text-emerald-600"></i>
                            <span class="truncate">${desText}</span>
                        </div>
                    </div>
                `;

                // Mapear según categoría normalizada
                const cat = (item.category || '').toLowerCase();
                if (cat.includes('tecno')) {
                    colTech.appendChild(card);
                    countTech++;
                } else if (cat.includes('proceso') || cat.includes('gesti')) {
                    colProc.appendChild(card);
                    countProc++;
                } else if (cat.includes('normat')) {
                    colNorm.appendChild(card);
                    countNorm++;
                } else {
                    colCap.appendChild(card);
                    countCap++;
                }
            });

            // Actualizar contadores
            const cTechEl = document.getElementById('counter-tecnologica');
            if (cTechEl) cTechEl.textContent = countTech;
            const cProcEl = document.getElementById('counter-procesos');
            if (cProcEl) cProcEl.textContent = countProc;
            const cNormEl = document.getElementById('counter-normativa');
            if (cNormEl) cNormEl.textContent = countNorm;
            const cCapEl = document.getElementById('counter-capacitacion');
            if (cCapEl) cCapEl.textContent = countCap;

            const ideasCountEl = document.getElementById('h07-ideas-counter');
            if (ideasCountEl) ideasCountEl.textContent = ideas.length;
            const votesCountEl = document.getElementById('h07-votes-counter');
            if (votesCountEl) votesCountEl.textContent = totalVotes;

            // Empty states para columnas sin tarjetas
            const cols = [
                { el: colTech, count: countTech, cat: 'Tecnológica' },
                { el: colProc, count: countProc, cat: 'Procesos / Gestión' },
                { el: colNorm, count: countNorm, cat: 'Normativa' },
                { el: colCap, count: countCap, cat: 'Capacitación' }
            ];
            cols.forEach(c => {
                if (c.count === 0) {
                    c.el.innerHTML = `
                        <div class="border border-dashed border-slate-200 rounded p-4 text-center text-slate-400 text-3xs italic flex flex-col items-center justify-center gap-1 min-h-[140px]">
                            <i data-lucide="lightbulb-off" class="w-4 h-4 text-slate-300"></i>
                            <span>Sin ideas en ${c.cat}</span>
                        </div>
                    `;
                }
            });

            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }

        // Delegación de eventos para Dot-Voting y Eliminación
        document.addEventListener('click', function(e) {
            const voteBtn = e.target.closest('.btn-vote-brain');
            if (voteBtn) {
                e.preventDefault();
                const id = parseInt(voteBtn.getAttribute('data-id'));
                if (typeof votarBrainstorming === 'function') {
                    votarBrainstorming(id);
                    renderBrainstormingBoard();
                }
                return;
            }

            const delBtn = e.target.closest('.btn-delete-brain');
            if (delBtn) {
                e.preventDefault();
                const id = parseInt(delBtn.getAttribute('data-id'));
                if (confirm('¿Desea eliminar esta idea de solución?')) {
                    if (typeof eliminarBrainstorming === 'function') {
                        eliminarBrainstorming(id);
                        renderBrainstormingBoard();
                    }
                }
                return;
            }
        });

        // Botón Precargar Ejemplo Metodológico H07
        const btnPreloadH07 = document.getElementById('btn-preload-example-h07');
        if (btnPreloadH07) {
            btnPreloadH07.addEventListener('click', () => {
                if (typeof precargarEjemploBrainstorming === 'function') {
                    const res = precargarEjemploBrainstorming('active');
                    if (res) {
                        renderBrainstormingBoard();
                        alert('Ejemplo metodológico de idea incorporado al tablero.');
                    } else {
                        alert('No se pudo precargar el ejemplo para la iniciativa activa.');
                    }
                }
            });
        }

        // Temporizador Crazy 8's
        const timerDisplay = document.getElementById('timer-display');
        const btnTimerStart = document.getElementById('btn-timer-start');
        const btnTimerPause = document.getElementById('btn-timer-pause');
        const btnTimerReset = document.getElementById('btn-timer-reset');

        if (timerDisplay && btnTimerStart) {
            let timerSeconds = 480; // 8 minutos
            let timerInterval = null;

            function formatTime(s) {
                const mins = Math.floor(s / 60);
                const secs = s % 60;
                return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }

            btnTimerStart.addEventListener('click', () => {
                if (timerInterval) return;
                btnTimerStart.classList.add('hidden');
                btnTimerPause.classList.remove('hidden');

                timerInterval = setInterval(() => {
                    if (timerSeconds > 0) {
                        timerSeconds--;
                        timerDisplay.textContent = formatTime(timerSeconds);
                    } else {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        btnTimerStart.classList.remove('hidden');
                        btnTimerPause.classList.add('hidden');
                        alert('¡Tiempo de Crazy 8\'s completado! Es momento de revisar y votar las ideas.');
                    }
                }, 1000);
            });

            btnTimerPause.addEventListener('click', () => {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                btnTimerPause.classList.add('hidden');
                btnTimerStart.classList.remove('hidden');
            });

            btnTimerReset.addEventListener('click', () => {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                timerSeconds = 480;
                timerDisplay.textContent = '08:00';
                btnTimerPause.classList.add('hidden');
                btnTimerStart.classList.remove('hidden');
            });
        }

        // Formulario de Envío
        if (formBrainstorming) {
            formBrainstorming.addEventListener('submit', (e) => {
                e.preventDefault();
                const dId = brainDesafioSelect ? brainDesafioSelect.value : null;
                const titleInput = document.getElementById('brain-idea-title') || document.getElementById('brain-idea');
                const descInput = document.getElementById('brain-idea-desc');
                const catInput = document.getElementById('brain-category');
                const roleInput = document.getElementById('brain-author-role');

                const titleVal = titleInput ? titleInput.value.trim() : '';
                const descVal = descInput ? descInput.value.trim() : titleVal;
                const catVal = catInput ? catInput.value : 'Tecnológica';
                const roleVal = roleInput ? roleInput.value.trim() : 'Especialista de Innovación';

                if (!titleVal) {
                    alert('Por favor, ingrese un título para la propuesta.');
                    return;
                }

                const newIdea = {
                    desafioId: dId ? parseInt(dId) : null,
                    ideaTitle: titleVal,
                    idea: titleVal,
                    description: descVal,
                    category: catVal,
                    authorRole: roleVal,
                    votesCount: 0
                };

                if (typeof guardarBrainstorming === 'function') {
                    guardarBrainstorming(newIdea);
                    renderBrainstormingBoard();
                    alert('Idea de solución incorporada al tablero.');
                    if (titleInput) titleInput.value = '';
                    if (descInput) descInput.value = '';
                }
            });
        }

        // Inicialización de la vista
        updateH07Banner();
        populateDesafiosDropdown();
        renderBrainstormingBoard();
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 8: Matriz de Priorización de Ideas
    // -------------------------------------------------------------
    const formIdea = document.getElementById('form-idea');
    const ideasTableEl = document.getElementById('ideasTable');
    const h08BannerTitle = document.getElementById('active-project-title-h08');

    if (formIdea || ideasTableEl || h08BannerTitle) {
        let dtIdeasInstance = null;

        function updateH08Banner() {
            const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;
            if (activeProj) {
                if (h08BannerTitle) h08BannerTitle.textContent = activeProj.title;
                const codeEl = document.getElementById('active-project-code-h08');
                if (codeEl) codeEl.textContent = activeProj.code;
                const unitEl = document.getElementById('active-project-unit-h08');
                if (unitEl) unitEl.textContent = activeProj.unit;
            }
        }

        function populateIdeasSourceDropdown() {
            const sourceSelect = document.getElementById('idea-select-source');
            if (!sourceSelect) return;

            sourceSelect.innerHTML = '<option value="">-- Cargar desde Lluvia de Ideas o ingresar abajo --</option>';
            const h07List = typeof obtenerBrainstormings === 'function' ? obtenerBrainstormings('active') : [];

            h07List.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = `${item.ideaTitle || item.idea} (${item.category || 'Idea'}) [${item.votesCount || 0} votos]`;
                opt.setAttribute('data-title', item.ideaTitle || item.idea);
                sourceSelect.appendChild(opt);
            });

            sourceSelect.addEventListener('change', function() {
                const selectedOpt = sourceSelect.options[sourceSelect.selectedIndex];
                const titleVal = selectedOpt ? selectedOpt.getAttribute('data-title') : '';
                const titleInput = document.getElementById('idea-title');
                if (titleVal && titleInput) {
                    titleInput.value = titleVal;
                }
            });
        }

        function updatePodioGanadora() {
            const podioContainer = document.getElementById('podio-ganadora-container');
            const podioTitle = document.getElementById('podio-title');
            const podioScoreBadge = document.getElementById('podio-score-badge');

            if (!podioContainer) return;

            const list = typeof obtenerIdeas === 'function' ? obtenerIdeas('active') : [];
            const winner = list.find(i => i.isWinningIdea);

            if (winner) {
                podioContainer.classList.remove('hidden');
                if (podioTitle) podioTitle.textContent = winner.ideaTitle || winner.title;
                if (podioScoreBadge) podioScoreBadge.textContent = `${winner.totalScore} / 20 Pts`;
            } else {
                podioContainer.classList.add('hidden');
            }

            const counterEl = document.getElementById('h08-ideas-counter');
            if (counterEl) counterEl.textContent = list.length;
        }

        function updateLiveScore() {
            const desInput = document.getElementById('idea-desirability');
            const feasInput = document.getElementById('idea-feasibility');
            const viabInput = document.getElementById('idea-viability');
            const impInput = document.getElementById('idea-impact');

            if (!desInput || !feasInput || !viabInput || !impInput) return;

            const des = parseInt(desInput.value) || 4;
            const feas = parseInt(feasInput.value) || 4;
            const viab = parseInt(viabInput.value) || 4;
            const imp = parseInt(impInput.value) || 4;

            const valDes = document.getElementById('val-desirability');
            if (valDes) valDes.textContent = `${des} / 5`;
            const valFeas = document.getElementById('val-feasibility');
            if (valFeas) valFeas.textContent = `${feas} / 5`;
            const valViab = document.getElementById('val-viability');
            if (valViab) valViab.textContent = `${viab} / 5`;
            const valImp = document.getElementById('val-impact');
            if (valImp) valImp.textContent = `${imp} / 5`;

            const total = des + feas + viab + imp;
            const totalScoreLive = document.getElementById('total-score-live');
            if (totalScoreLive) totalScoreLive.textContent = total;

            const labelEl = document.getElementById('score-category-label');
            if (labelEl) {
                if (total >= 16) {
                    labelEl.textContent = 'Prioridad Alta (Excelente alternativa)';
                    labelEl.className = 'text-2xs font-bold text-emerald-700';
                } else if (total >= 11) {
                    labelEl.textContent = 'Prioridad Media (Requiere ajustes)';
                    labelEl.className = 'text-2xs font-semibold text-amber-700';
                } else {
                    labelEl.textContent = 'Prioridad Baja (Descartar o replantear)';
                    labelEl.className = 'text-2xs font-semibold text-slate-500';
                }
            }
        }

        // Event listeners para sliders
        ['idea-desirability', 'idea-feasibility', 'idea-viability', 'idea-impact'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', updateLiveScore);
        });

        function renderIdeasTable() {
            if (!ideasTableEl) return;

            const list = typeof obtenerIdeas === 'function' ? obtenerIdeas('active') : [];

            if ($.fn.DataTable.isDataTable('#ideasTable')) {
                $('#ideasTable').DataTable().destroy();
            }

            const tbody = ideasTableEl.querySelector('tbody');
            if (tbody) tbody.innerHTML = '';

            list.forEach(item => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50/80 transition-colors border-b border-slate-100';

                const titleText = item.ideaTitle || item.title || 'Idea sin título';
                const isWinner = !!item.isWinningIdea;
                const winnerBadge = isWinner 
                    ? `<span class="inline-flex items-center gap-1 font-bold text-3xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded ml-1.5"><i data-lucide="crown" class="w-2.5 h-2.5 text-amber-500"></i> Ganadora</span>`
                    : '';

                const scoreColor = item.totalScore >= 16 ? 'text-emerald-700 bg-emerald-50' : (item.totalScore >= 11 ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-50');

                tr.innerHTML = `
                    <td class="py-2.5 px-3">
                        <span class="font-bold text-slate-800 text-xs">${titleText}</span>
                        ${winnerBadge}
                    </td>
                    <td class="py-2.5 px-2 text-center font-mono font-semibold text-blue-700 text-xs">${item.desirability || 4}</td>
                    <td class="py-2.5 px-2 text-center font-mono font-semibold text-emerald-700 text-xs">${item.feasibility || 4}</td>
                    <td class="py-2.5 px-2 text-center font-mono font-semibold text-amber-700 text-xs">${item.viability || 4}</td>
                    <td class="py-2.5 px-2 text-center font-mono font-semibold text-sky-700 text-xs">${item.impact || 4}</td>
                    <td class="py-2.5 px-2 text-center font-mono font-extrabold text-sm ${scoreColor}">${item.totalScore || 16}</td>
                    <td class="py-2.5 px-2 text-center">
                        ${isWinner 
                            ? `<span class="text-3xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Ganadora</span>` 
                            : `<button type="button" class="btn-mark-winner text-3xs font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 px-2 py-0.5 rounded transition-all" data-id="${item.id}">Hacer Ganadora</button>`}
                    </td>
                    <td class="py-2.5 px-2 text-right">
                        <button type="button" class="btn-delete-idea text-slate-300 hover:text-red-500 transition-colors p-1" data-id="${item.id}" title="Eliminar evaluación">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </td>
                `;

                if (tbody) tbody.appendChild(tr);
            });

            dtIdeasInstance = $('#ideasTable').DataTable({
                order: [[5, 'desc']], // Ordenar por Total Score descendente
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
                },
                pageLength: 10,
                autoWidth: false
            });

            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }

            updatePodioGanadora();
        }

        // Delegación de eventos en tabla
        $(ideasTableEl).on('click', '.btn-mark-winner', function() {
            const id = parseInt($(this).attr('data-id'));
            if (typeof marcarIdeaGanadora === 'function') {
                marcarIdeaGanadora(id);
                renderIdeasTable();
            }
        });

        $(ideasTableEl).on('click', '.btn-delete-idea', function() {
            const id = parseInt($(this).attr('data-id'));
            if (confirm('¿Desea eliminar la evaluación de esta idea?')) {
                if (typeof eliminarIdea === 'function') {
                    eliminarIdea(id);
                    renderIdeasTable();
                }
            }
        });

        // Botón Precargar Ejemplo H08
        const btnPreloadH08 = document.getElementById('btn-preload-example-h08');
        if (btnPreloadH08) {
            btnPreloadH08.addEventListener('click', () => {
                if (typeof precargarEjemploMatriz === 'function') {
                    const res = precargarEjemploMatriz('active');
                    if (res) {
                        renderIdeasTable();
                        alert('Evaluación metodológica de ejemplo incorporada.');
                    } else {
                        alert('No se pudo precargar el ejemplo para la iniciativa activa.');
                    }
                }
            });
        }

        // Envío del Formulario
        if (formIdea) {
            formIdea.addEventListener('submit', (e) => {
                e.preventDefault();
                const sourceSelect = document.getElementById('idea-select-source');
                const titleInput = document.getElementById('idea-title');
                const desInput = document.getElementById('idea-desirability');
                const feasInput = document.getElementById('idea-feasibility');
                const viabInput = document.getElementById('idea-viability');
                const impInput = document.getElementById('idea-impact');
                const winInput = document.getElementById('idea-is-winning');

                const titleVal = titleInput ? titleInput.value.trim() : '';
                if (!titleVal) {
                    alert('Por favor, ingrese un título para la propuesta.');
                    return;
                }

                const idea = {
                    ideaId: sourceSelect && sourceSelect.value ? parseInt(sourceSelect.value) : null,
                    ideaTitle: titleVal,
                    title: titleVal,
                    desirability: desInput ? parseInt(desInput.value) : 4,
                    feasibility: feasInput ? parseInt(feasInput.value) : 4,
                    viability: viabInput ? parseInt(viabInput.value) : 4,
                    impact: impInput ? parseInt(impInput.value) : 4,
                    isWinningIdea: winInput ? winInput.checked : false
                };

                if (typeof guardarIdea === 'function') {
                    guardarIdea(idea);
                    renderIdeasTable();
                    alert('Idea ponderada y registrada en el ranking.');
                    formIdea.reset();
                    updateLiveScore();
                }
            });
        }

        // Inicialización de la vista
        updateH08Banner();
        populateIdeasSourceDropdown();
        updateLiveScore();
        renderIdeasTable();
    }

    // -------------------------------------------------------------
    // FASE 3 - HERRAMIENTA 9: Prototipado Rápido y Storyboard
    // -------------------------------------------------------------
    const formPrototype = document.getElementById('form-prototype');
    const prototypesContainer = document.getElementById('prototypes-container');
    const h09BannerTitle = document.getElementById('active-project-title-h09');

    if (formPrototype || prototypesContainer || h09BannerTitle) {
        function updateH09Banner() {
            const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;
            if (activeProj) {
                if (h09BannerTitle) h09BannerTitle.textContent = activeProj.title;
                const codeEl = document.getElementById('active-project-code-h09');
                if (codeEl) codeEl.textContent = activeProj.code;
                const unitEl = document.getElementById('active-project-unit-h09');
                if (unitEl) unitEl.textContent = activeProj.unit;
            }

            // Actualizar banner de Solución Ganadora (H08)
            const winningTitleEl = document.getElementById('h09-winning-title');
            if (winningTitleEl) {
                const ideas = typeof obtenerIdeas === 'function' ? obtenerIdeas('active') : [];
                const winner = ideas.find(i => i.isWinningIdea);
                if (winner) {
                    winningTitleEl.textContent = `${winner.ideaTitle || winner.title} (${winner.totalScore}/20 Pts)`;
                    winningTitleEl.className = 'text-xs font-bold text-emerald-900';
                } else {
                    winningTitleEl.textContent = 'Sin idea ganadora seleccionada en H08 (Haga clic para evaluar en la Matriz de Priorización)';
                    winningTitleEl.className = 'text-xs font-medium text-amber-700 italic';
                }
            }
        }

        function renderPrototypes() {
            if (!prototypesContainer) return;
            prototypesContainer.innerHTML = '';
            const list = typeof obtenerPrototipos === 'function' ? obtenerPrototipos('active') : [];

            const counterEl = document.getElementById('h09-protos-counter');
            if (counterEl) counterEl.textContent = list.length;

            if (list.length === 0) {
                prototypesContainer.innerHTML = `
                    <div class="col-span-1 md:col-span-2 border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400 bg-white shadow-2xs flex flex-col items-center justify-center">
                        <i data-lucide="layers" class="w-10 h-10 text-slate-300 mb-2"></i>
                        <h4 class="text-sm font-bold text-slate-700">Sin Prototipos Registrados</h4>
                        <p class="text-xs text-slate-500 max-w-md mt-1">Materialice la solución ganadora seleccionada en H08 mediante una maqueta PWA, storyboard o simulación de servicio.</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
                return;
            }

            list.forEach(proto => {
                const card = document.createElement('div');
                card.className = 'card border-slate-200 p-0 overflow-hidden flex flex-col shadow-2xs hover:shadow-xs transition-shadow bg-white';
                
                const titleText = proto.prototypeTitle || proto.name || 'Prototipo Conceptual';
                const pType = proto.prototypeType || 'Digital PWA';
                const imgUrl = proto.artifactUrlOrImage || proto.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500';
                const descText = proto.description || '';
                const testingGoalText = proto.testingGoal || 'Validar adopción y facilidad de uso por parte del usuario final.';

                // Color del badge según tipo
                let badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                if (pType.includes('Papel') || pType.includes('Físico')) {
                    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                } else if (pType.includes('Storyboard') || pType.includes('Guion')) {
                    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
                } else if (pType.includes('Servicio')) {
                    badgeClass = 'bg-sky-100 text-sky-800 border-sky-200';
                }

                // Renderizar tags de características
                let featuresHtml = '';
                if (Array.isArray(proto.keyFeatures) && proto.keyFeatures.length > 0) {
                    featuresHtml = `
                        <div class="flex flex-wrap gap-1 mt-2 mb-2">
                            ${proto.keyFeatures.map(f => `<span class="text-3xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">#${f}</span>`).join('')}
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div class="relative bg-slate-100 border-b border-slate-200">
                        <img src="${imgUrl}" alt="${titleText}" class="w-full h-44 object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500';">
                        <div class="absolute top-2 left-2">
                            <span class="text-3xs font-extrabold px-2 py-0.5 rounded uppercase border shadow-2xs ${badgeClass}">
                                ${pType}
                            </span>
                        </div>
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-start justify-between gap-2 mb-1">
                                <h4 class="font-bold text-slate-800 text-sm leading-snug">${titleText}</h4>
                                <button type="button" class="btn-delete-proto text-slate-300 hover:text-red-500 transition-colors p-1" data-id="${proto.id}" title="Eliminar prototipo">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">${descText}</p>
                            ${featuresHtml}
                        </div>

                        <!-- Criterio de Éxito del Testeo -->
                        <div class="bg-emerald-50/70 border border-emerald-200 rounded p-2.5 mt-3">
                            <span class="text-3xs uppercase tracking-wider font-extrabold text-emerald-800 flex items-center gap-1">
                                <i data-lucide="target" class="w-3 h-3 text-emerald-600"></i>
                                <span>Criterio de Éxito del Testeo:</span>
                            </span>
                            <p class="text-2xs text-slate-700 mt-0.5 italic leading-relaxed">${testingGoalText}</p>
                        </div>

                        <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-3xs text-slate-400 font-mono">ID #${proto.id}</span>
                            <a href="${imgUrl}" target="_blank" class="btn btn-secondary text-2xs px-2.5 py-1 flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-800">
                                <span>Ver Maqueta / Enlace</span>
                                <i data-lucide="external-link" class="w-3 h-3"></i>
                            </a>
                        </div>
                    </div>
                `;
                prototypesContainer.appendChild(card);
            });

            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }

        // Delegación de eventos para eliminación
        document.addEventListener('click', function(e) {
            const delBtn = e.target.closest('.btn-delete-proto');
            if (delBtn) {
                e.preventDefault();
                const id = parseInt(delBtn.getAttribute('data-id'));
                if (confirm('¿Desea eliminar este artefacto de prototipo?')) {
                    if (typeof eliminarPrototipo === 'function') {
                        eliminarPrototipo(id);
                        renderPrototypes();
                    }
                }
            }
        });

        // Botón Precargar Ejemplo H09
        const btnPreloadH09 = document.getElementById('btn-preload-example-h09');
        if (btnPreloadH09) {
            btnPreloadH09.addEventListener('click', () => {
                if (typeof precargarEjemploPrototipos === 'function') {
                    const res = precargarEjemploPrototipos('active');
                    if (res) {
                        renderPrototypes();
                        alert('Prototipo conceptual de ejemplo incorporado a la galería.');
                    } else {
                        alert('No se pudo precargar el prototipo para la iniciativa activa.');
                    }
                }
            });
        }

        // Formulario de Registro
        if (formPrototype) {
            formPrototype.addEventListener('submit', (e) => {
                e.preventDefault();
                const titleInput = document.getElementById('proto-title') || document.getElementById('proto-name');
                const typeInput = document.getElementById('proto-type');
                const featInput = document.getElementById('proto-features');
                const imgInput = document.getElementById('proto-image');
                const descInput = document.getElementById('proto-desc');
                const goalInput = document.getElementById('proto-testing-goal');

                const titleVal = titleInput ? titleInput.value.trim() : '';
                if (!titleVal) {
                    alert('Por favor, ingrese el nombre del prototipo.');
                    return;
                }

                const proto = {
                    prototypeTitle: titleVal,
                    name: titleVal,
                    prototypeType: typeInput ? typeInput.value : 'Digital PWA',
                    keyFeatures: featInput ? featInput.value : '',
                    artifactUrlOrImage: imgInput ? imgInput.value.trim() : '',
                    imageUrl: imgInput ? imgInput.value.trim() : '',
                    description: descInput ? descInput.value.trim() : '',
                    testingGoal: goalInput ? goalInput.value.trim() : ''
                };

                if (typeof guardarPrototipo === 'function') {
                    guardarPrototipo(proto);
                    renderPrototypes();
                    alert('Prototipo conceptual guardado en la galería.');
                    formPrototype.reset();
                }
            });
        }

        // Inicialización de la vista
        updateH09Banner();
        renderPrototypes();
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
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        // Banner de Contexto de Iniciativa Activa
        const titleEl = document.getElementById('active-project-title-h10');
        const codeEl = document.getElementById('active-project-code-h10');
        const unitEl = document.getElementById('active-project-unit-h10');
        if (activeProj) {
            if (titleEl) titleEl.textContent = activeProj.title;
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'Unidad Orgánica / Equipo de Innovación';
        }

        // Banner de Enlace con Prototipo de Fase 3 (H09)
        const protoTitleEl = document.getElementById('h10-prototype-title');
        if (protoTitleEl) {
            const protos = typeof obtenerPrototipos === 'function' ? obtenerPrototipos('active') : [];
            if (protos.length > 0) {
                const p = protos[0];
                protoTitleEl.textContent = `${p.prototypeTitle || p.name} (${p.prototypeType || 'Digital PWA'})`;
            } else if (activeProj) {
                protoTitleEl.textContent = `Prototipo Funcional PWA para ${activeProj.title.split(' ')[0]} (Listo para Roadmap)`;
            } else {
                protoTitleEl.textContent = 'Solución validada en Fase 3 lista para implementación operativa.';
            }
        }

        function actualizarContadoresH10() {
            const plans = typeof obtenerPlanesAccion === 'function' ? obtenerPlanesAccion('active') : [];
            const completed = plans.filter(p => p.status === 'Completado' || p.status === 'Completada').length;
            const compEl = document.getElementById('h10-completed-counter');
            const totEl = document.getElementById('h10-total-counter');
            if (compEl) compEl.textContent = completed;
            if (totEl) totEl.textContent = plans.length;
        }

        const actionPlansTable = $('#actionPlansTable').DataTable({
            data: typeof obtenerPlanesAccion === 'function' ? obtenerPlanesAccion('active') : [],
            responsive: true,
            columns: [
                { 
                    data: 'taskName',
                    render: function(data, type, row) {
                        const name = data || row.task || 'Sin nombre';
                        return `<div class="font-bold text-slate-800">${name}</div>`;
                    }
                },
                { 
                    data: 'responsibleUnit',
                    render: function(data, type, row) {
                        const unit = data || row.responsible || 'Sin asignar';
                        return `<span class="text-2xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">${unit}</span>`;
                    }
                },
                { 
                    data: 'deliverable',
                    render: function(data) {
                        return `<span class="text-2xs font-semibold text-emerald-850 flex items-center gap-1"><i data-lucide="file-check" class="w-3 h-3 text-emerald-600 shrink-0"></i> ${data || 'Entregable formal'}</span>`;
                    }
                },
                { 
                    data: 'startDate',
                    render: function(data, type, row) {
                        const start = data || '2026-03-01';
                        const end = row.endDate || row.deadline || '2026-04-30';
                        return `<div class="text-2xs text-slate-600 whitespace-nowrap"><span class="font-semibold">${start}</span> al <span class="font-semibold text-slate-800">${end}</span></div>`;
                    }
                },
                { 
                    data: 'status',
                    className: 'text-center',
                    render: function (data, type, row) {
                        const st = data || 'Pendiente';
                        let colorClass = 'bg-slate-100 text-slate-700 border-slate-300';
                        if (st === 'Completado' || st === 'Completada') {
                            colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                        } else if (st === 'En Proceso') {
                            colorClass = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
                        }
                        return `
                            <button type="button" class="btn-toggle-ap-status px-2 py-1 text-3xs uppercase tracking-wider rounded border ${colorClass} hover:opacity-80 transition-all cursor-pointer" data-id="${row.id}" data-current="${st}" title="Clic para alternar estado">
                                ${st}
                            </button>
                        `;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        return `
                            <div class="flex items-center justify-center gap-1">
                                <button class="btn-edit-ap bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 text-2xs rounded font-bold transition-colors cursor-pointer" data-id="${row.id}" title="Editar">
                                    <i data-lucide="edit-2" class="w-3 h-3 inline"></i>
                                </button>
                                <button class="btn-delete-ap bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-2xs rounded font-bold transition-colors cursor-pointer" data-id="${row.id}" title="Eliminar">
                                    <i data-lucide="trash-2" class="w-3 h-3 inline"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            },
            drawCallback: function() {
                if (typeof lucide !== 'undefined') lucide.createIcons();
                actualizarContadoresH10();
            }
        });

        // Toggle rápido de estado al hacer clic en el badge
        $('#actionPlansTable').on('click', '.btn-toggle-ap-status', function() {
            const id = parseInt($(this).attr('data-id'));
            const current = $(this).attr('data-current');
            let next = 'En Proceso';
            if (current === 'Pendiente') next = 'En Proceso';
            else if (current === 'En Proceso') next = 'Completado';
            else next = 'Pendiente';

            actualizarEstadoPlanAccion(id, next);
            actionPlansTable.clear().rows.add(obtenerPlanesAccion('active')).draw();
        });

        // Eventos Editar y Eliminar
        $('#actionPlansTable').on('click', '.btn-edit-ap', function() {
            const id = parseInt($(this).attr('data-id'));
            const record = obtenerPlanesAccion('active').find(ap => ap.id === id);
            if (record) {
                editingApId = id;
                document.getElementById('ap-activity').value = record.taskName || record.task || '';
                document.getElementById('ap-leader').value = record.responsibleUnit || record.responsible || '';
                document.getElementById('ap-deliverable').value = record.deliverable || '';
                document.getElementById('ap-start').value = record.startDate || '';
                document.getElementById('ap-end').value = record.endDate || record.deadline || '';
                document.getElementById('ap-status').value = record.status || 'Pendiente';
                
                const formTitle = document.getElementById('form-h10-title');
                if (formTitle) formTitle.textContent = 'Editar Actividad del Roadmap';

                const submitBtn = document.getElementById('btn-submit-action-plan');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline-block mr-1"></i> Actualizar Actividad';
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700');
                }
                const cancelBtn = document.getElementById('btn-cancel-action-plan');
                if (cancelBtn) cancelBtn.classList.remove('hidden');

                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });

        $('#actionPlansTable').on('click', '.btn-delete-ap', function() {
            const id = parseInt($(this).attr('data-id'));
            if (confirm('¿Está seguro de que desea eliminar esta actividad de la hoja de ruta?')) {
                eliminarPlanAccion(id);
                actionPlansTable.clear().rows.add(obtenerPlanesAccion('active')).draw();
            }
        });

        if (formActionPlan) {
            formActionPlan.addEventListener('submit', (e) => {
                e.preventDefault();
                const planData = {
                    taskName: document.getElementById('ap-activity').value.trim(),
                    task: document.getElementById('ap-activity').value.trim(),
                    responsibleUnit: document.getElementById('ap-leader').value.trim(),
                    responsible: document.getElementById('ap-leader').value.trim(),
                    deliverable: document.getElementById('ap-deliverable').value.trim(),
                    startDate: document.getElementById('ap-start').value,
                    endDate: document.getElementById('ap-end').value,
                    deadline: document.getElementById('ap-end').value,
                    status: document.getElementById('ap-status').value
                };
                
                if (editingApId !== null) {
                    actualizarPlanAccion(editingApId, planData);
                    alert('Actividad actualizada en la hoja de ruta.');
                    editingApId = null;
                } else {
                    guardarPlanAccion(planData);
                    alert('Actividad incorporada con éxito a la hoja de ruta.');
                }
                
                resetActionPlanForm();
                actionPlansTable.clear().rows.add(obtenerPlanesAccion('active')).draw();
            });

            const cancelBtn = document.getElementById('btn-cancel-action-plan');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    resetActionPlanForm();
                });
            }

            function resetActionPlanForm() {
                editingApId = null;
                formActionPlan.reset();
                const formTitle = document.getElementById('form-h10-title');
                if (formTitle) formTitle.textContent = 'Registrar Actividad del Roadmap';
                const submitBtn = document.getElementById('btn-submit-action-plan');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i data-lucide="plus" class="w-4 h-4 inline-block mr-1"></i> Guardar Actividad';
                    submitBtn.className = 'btn btn-primary w-full text-xs font-bold py-2.5';
                }
                if (cancelBtn) cancelBtn.classList.add('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

        // Botón Precargar Ejemplo Metodológico (H10)
        const btnPreloadH10 = document.getElementById('btn-preload-example-h10');
        if (btnPreloadH10) {
            btnPreloadH10.addEventListener('click', () => {
                const res = precargarEjemploPlanAccion('active');
                if (res) {
                    actionPlansTable.clear().rows.add(obtenerPlanesAccion('active')).draw();
                    alert(`Se ha precargado la actividad de roadmap: "${res.taskName}"`);
                }
            });
        }
    }

    // -------------------------------------------------------------
    // FASE 4 - HERRAMIENTA 11: Matriz de Gestión de Riesgos y Testeo (CRUD completo)
    // -------------------------------------------------------------
    const formRisk = document.getElementById('form-risk');
    const risksTableEl = document.getElementById('risksTable');
    let editingRiskId = null;

    if (risksTableEl && typeof $ !== 'undefined') {
        const activeProj = typeof obtenerProyectoActivo === 'function' ? obtenerProyectoActivo() : null;

        // Banner de Contexto de Iniciativa Activa
        const titleEl = document.getElementById('active-project-title-h11');
        const codeEl = document.getElementById('active-project-code-h11');
        const unitEl = document.getElementById('active-project-unit-h11');
        if (activeProj) {
            if (titleEl) titleEl.textContent = activeProj.title;
            if (codeEl) codeEl.textContent = activeProj.code;
            if (unitEl) unitEl.textContent = activeProj.responsible || 'Unidad Orgánica / Equipo de Innovación';
        }

        function actualizarContadoresH11() {
            const risks = typeof obtenerRiesgos === 'function' ? obtenerRiesgos('active') : [];
            let cAlto = 0, cMedio = 0, cBajo = 0;
            risks.forEach(r => {
                const lvl = r.level || calcularNivelRiesgo(r.probability, r.impact);
                if (lvl === 'Alto') cAlto++;
                else if (lvl === 'Medio') cMedio++;
                else cBajo++;
            });

            const elAlto = document.getElementById('counter-risk-alto');
            const elMedio = document.getElementById('counter-risk-medio');
            const elBajo = document.getElementById('counter-risk-bajo');
            if (elAlto) elAlto.textContent = cAlto;
            if (elMedio) elMedio.textContent = cMedio;
            if (elBajo) elBajo.textContent = cBajo;
        }

        const risksTable = $('#risksTable').DataTable({
            data: typeof obtenerRiesgos === 'function' ? obtenerRiesgos('active') : [],
            responsive: true,
            columns: [
                { 
                    data: 'riskType',
                    render: function(data) {
                        const type = data || 'Operativo';
                        let badgeClass = 'bg-slate-100 text-slate-700';
                        if (type.includes('Tecno')) badgeClass = 'bg-sky-100 text-sky-800 border-sky-200';
                        else if (type.includes('Legal')) badgeClass = 'bg-slate-200 text-slate-800 border-slate-300';
                        else if (type.includes('Presu')) badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        else badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';

                        return `<span class="px-2 py-0.5 rounded text-3xs font-bold border uppercase ${badgeClass}">${type}</span>`;
                    }
                },
                { 
                    data: 'riskDescription',
                    render: function(data, type, row) {
                        const desc = data || row.description || 'Sin descripción';
                        return `<div class="font-bold text-slate-800 text-xs">${desc}</div>`;
                    }
                },
                { 
                    data: 'probability',
                    className: 'text-center',
                    render: function(data, type, row) {
                        const prob = data || 'Media';
                        const imp = row.impact || 'Medio';
                        return `<span class="text-3xs font-semibold text-slate-600">${prob} / ${imp}</span>`;
                    }
                },
                { 
                    data: 'level',
                    className: 'text-center',
                    render: function(data, type, row) {
                        const lvl = data || calcularNivelRiesgo(row.probability, row.impact);
                        let colorClass = 'bg-slate-100 text-slate-800';
                        if (lvl === 'Alto') colorClass = 'bg-red-100 text-red-800 border-red-300 font-bold';
                        else if (lvl === 'Medio') colorClass = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
                        else if (lvl === 'Bajo') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
                        
                        return `<span class="px-2.5 py-0.5 text-2xs uppercase rounded border ${colorClass}">${lvl}</span>`;
                    }
                },
                { 
                    data: 'mitigationStrategy',
                    render: function(data, type, row) {
                        const mit = data || row.mitigation || 'Sin plan de mitigación';
                        return `<p class="text-2xs text-slate-600 leading-snug">${mit}</p>`;
                    }
                },
                { 
                    data: 'testResult',
                    render: function(data) {
                        return `<div class="text-2xs text-emerald-900 bg-emerald-50/70 p-1.5 rounded border border-emerald-150 leading-tight"><i data-lucide="check" class="w-3 h-3 text-emerald-600 inline mr-0.5"></i> ${data || 'Pendiente de prueba'}</div>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        return `
                            <div class="flex items-center justify-center gap-1">
                                <button class="btn-edit-risk bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 text-2xs rounded font-bold transition-colors cursor-pointer" data-id="${row.id}" title="Editar">
                                    <i data-lucide="edit-2" class="w-3 h-3 inline"></i>
                                </button>
                                <button class="btn-delete-risk bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-2xs rounded font-bold transition-colors cursor-pointer" data-id="${row.id}" title="Eliminar">
                                    <i data-lucide="trash-2" class="w-3 h-3 inline"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            },
            drawCallback: function() {
                if (typeof lucide !== 'undefined') lucide.createIcons();
                actualizarContadoresH11();
            }
        });

        // Actualizador dinámico del Semáforo en el formulario
        function updateLiveSemáforo() {
            const prob = document.getElementById('risk-prob')?.value || 'Media';
            const imp = document.getElementById('risk-impact')?.value || 'Medio';
            const lvl = calcularNivelRiesgo(prob, imp);
            const badge = document.getElementById('risk-level-badge');
            if (badge) {
                badge.textContent = lvl;
                badge.className = 'px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border transition-all';
                if (lvl === 'Alto') {
                    badge.classList.add('bg-red-100', 'text-red-800', 'border-red-300');
                } else if (lvl === 'Medio') {
                    badge.classList.add('bg-amber-100', 'text-amber-800', 'border-amber-300');
                } else {
                    badge.classList.add('bg-emerald-100', 'text-emerald-800', 'border-emerald-300');
                }
            }
        }

        const probSelect = document.getElementById('risk-prob');
        const impactSelect = document.getElementById('risk-impact');
        if (probSelect) probSelect.addEventListener('change', updateLiveSemáforo);
        if (impactSelect) impactSelect.addEventListener('change', updateLiveSemáforo);

        // Eventos Editar y Eliminar
        $('#risksTable').on('click', '.btn-edit-risk', function() {
            const id = parseInt($(this).attr('data-id'));
            const record = obtenerRiesgos('active').find(r => r.id === id);
            if (record) {
                editingRiskId = id;
                document.getElementById('risk-desc').value = record.riskDescription || record.description || '';
                document.getElementById('risk-type').value = record.riskType || 'Operativo';
                document.getElementById('risk-prob').value = record.probability || 'Media';
                document.getElementById('risk-impact').value = record.impact || 'Medio';
                document.getElementById('risk-mitigation').value = record.mitigationStrategy || record.mitigation || '';
                document.getElementById('risk-test-result').value = record.testResult || '';
                
                updateLiveSemáforo();

                const formTitle = document.getElementById('form-h11-title');
                if (formTitle) formTitle.textContent = 'Editar Evaluación de Riesgo';

                const submitBtn = document.getElementById('btn-submit-risk');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline-block mr-1"></i> Actualizar Riesgo';
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700');
                }
                const cancelBtn = document.getElementById('btn-cancel-risk');
                if (cancelBtn) cancelBtn.classList.remove('hidden');

                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });

        $('#risksTable').on('click', '.btn-delete-risk', function() {
            const id = parseInt($(this).attr('data-id'));
            if (confirm('¿Está seguro de que desea eliminar este riesgo de la matriz?')) {
                eliminarRiesgo(id);
                risksTable.clear().rows.add(obtenerRiesgos('active')).draw();
            }
        });

        if (formRisk) {
            formRisk.addEventListener('submit', (e) => {
                e.preventDefault();
                const prob = document.getElementById('risk-prob').value;
                const imp = document.getElementById('risk-impact').value;
                const level = calcularNivelRiesgo(prob, imp);

                const riskData = {
                    riskDescription: document.getElementById('risk-desc').value.trim(),
                    description: document.getElementById('risk-desc').value.trim(),
                    riskType: document.getElementById('risk-type').value,
                    probability: prob,
                    impact: imp,
                    level: level,
                    mitigationStrategy: document.getElementById('risk-mitigation').value.trim(),
                    mitigation: document.getElementById('risk-mitigation').value.trim(),
                    testResult: document.getElementById('risk-test-result').value.trim()
                };
                
                if (editingRiskId !== null) {
                    actualizarRiesgo(editingRiskId, riskData);
                    alert('Riesgo actualizado en la matriz.');
                    editingRiskId = null;
                } else {
                    guardarRiesgo(riskData);
                    alert('Riesgo evaluado e incorporado a la matriz con éxito.');
                }
                
                resetRiskForm();
                risksTable.clear().rows.add(obtenerRiesgos('active')).draw();
            });

            const cancelBtn = document.getElementById('btn-cancel-risk');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    resetRiskForm();
                });
            }

            function resetRiskForm() {
                editingRiskId = null;
                formRisk.reset();
                updateLiveSemáforo();
                const formTitle = document.getElementById('form-h11-title');
                if (formTitle) formTitle.textContent = 'Registrar y Evaluar Riesgo';
                const submitBtn = document.getElementById('btn-submit-risk');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i data-lucide="shield" class="w-4 h-4 inline-block mr-1"></i> Registrar Riesgo';
                    submitBtn.className = 'btn btn-primary w-full text-xs font-bold py-2.5';
                }
                if (cancelBtn) cancelBtn.classList.add('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

        // Botón Precargar Ejemplo Metodológico (H11)
        const btnPreloadH11 = document.getElementById('btn-preload-example-h11');
        if (btnPreloadH11) {
            btnPreloadH11.addEventListener('click', () => {
                const res = precargarEjemploRiesgo('active');
                if (res) {
                    risksTable.clear().rows.add(obtenerRiesgos('active')).draw();
                    alert(`Se ha precargado el riesgo: "${res.riskDescription}"`);
                }
            });
        }

        // Botón Certificar y Marcar como Completado el Doble Diamante
        const btnCertify = document.getElementById('btn-certify-phase4');
        if (btnCertify) {
            btnCertify.addEventListener('click', () => {
                if (activeProj) {
                    const newPhases = {
                        ...(activeProj.phases || {}),
                        descubrir: 'completed',
                        definir: 'completed',
                        idear: 'completed',
                        entregar: 'completed'
                    };
                    actualizarFasesProyecto(activeProj.id, newPhases);
                    alert(`¡Felicitaciones! La iniciativa [${activeProj.code}] "${activeProj.title}" ha completado formalmente el ciclo completo del Doble Diamante (Fases 1, 2, 3 y 4).\n\nRedirigiendo al Portafolio General...`);
                    window.location.href = '../index.html';
                }
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
                        <th class="border-b border-slate-200 p-2 font-bold">Actividad / Tarea</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Responsable</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Entregable Verificable</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Plazo</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        actionPlan.forEach(ap => {
            const taskText = ap.taskName || ap.task || ap.activity || 'Actividad';
            const respText = ap.responsibleUnit || ap.responsible || ap.leader || 'Unidad';
            const delivText = ap.deliverable || 'Entregable formal';
            const startText = ap.startDate || '-';
            const endText = ap.endDate || ap.deadline || '-';
            const st = ap.status || 'Pendiente';
            const stColor = (st === 'Completado' || st === 'Completada') ? 'bg-emerald-100 text-emerald-800' : (st === 'En Proceso' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600');

            apHtml += `
                <tr>
                    <td class="border-b border-slate-100 p-2 font-semibold text-slate-800">${taskText}</td>
                    <td class="border-b border-slate-100 p-2 text-slate-600">${respText}</td>
                    <td class="border-b border-slate-100 p-2 text-emerald-900 font-medium">${delivText}</td>
                    <td class="border-b border-slate-100 p-2 whitespace-nowrap">${startText} a ${endText}</td>
                    <td class="border-b border-slate-100 p-2"><span class="px-2 py-0.5 rounded-full text-2xs font-semibold ${stColor}">${st}</span></td>
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
                        <th class="border-b border-slate-200 p-2 font-bold">Tipo</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Riesgo / Amenaza</th>
                        <th class="border-b border-slate-200 p-2 font-bold text-center">P / I</th>
                        <th class="border-b border-slate-200 p-2 font-bold text-center">Nivel</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Plan de Mitigación</th>
                        <th class="border-b border-slate-200 p-2 font-bold">Evidencia / Testeo</th>
                    </tr>
                </thead>
                <tbody>
        `;
        risks.forEach(r => {
            const desc = r.riskDescription || r.description || '-';
            const type = r.riskType || 'Operativo';
            const prob = r.probability || 'Media';
            const imp = r.impact || 'Medio';
            const lvl = r.level || calcularNivelRiesgo(prob, imp);
            const mit = r.mitigationStrategy || r.mitigation || '-';
            const test = r.testResult || 'Sin evidencia consignada';

            const levelClass = lvl === 'Alto' ? 'bg-red-100 text-red-800 border-red-200' : lvl === 'Medio' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-100 text-green-800 border-green-200';
            risksHtml += `
                <tr>
                    <td class="border-b border-slate-100 p-2"><span class="px-1.5 py-0.5 rounded text-3xs font-semibold bg-slate-100 text-slate-700">${type}</span></td>
                    <td class="border-b border-slate-100 p-2 font-semibold text-slate-800">${desc}</td>
                    <td class="border-b border-slate-100 p-2 text-center text-3xs">${prob} / ${imp}</td>
                    <td class="border-b border-slate-100 p-2 text-center"><span class="px-2 py-0.5 rounded border text-2xs font-bold ${levelClass}">${lvl}</span></td>
                    <td class="border-b border-slate-100 p-2 text-slate-600">${mit}</td>
                    <td class="border-b border-slate-100 p-2 text-emerald-900 text-2xs font-medium">${test}</td>
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
