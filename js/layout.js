/**
   ==========================================================================
   AGROIDEAS PIIP - Layout Manager (Armonizado NT-GIP SGP-PCM)
   Inyecta el Sidebar segmentado en las 3 etapas de la NT-GIP, cabeceras,
   CDNs, Breadcrumb y control de sesión por perfiles (MPA)
   ========================================================================== */

(function() {
    // 1. Determinar el prefijo de ruta relativo
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    const isSubFolder = currentPath.includes('/fase1/') || 
                        currentPath.includes('/fase2/') || 
                        currentPath.includes('/fase3/') || 
                        currentPath.includes('/fase4/') ||
                        currentPath.includes('/iniciativas/') ||
                        currentPath.includes('/evaluacion/');
    const prefix = isSubFolder ? '../' : './';

    // 2. Determinar la herramienta o etapa activa en el menú
    const filename = currentPath.split('/').pop() || 'index.html';
    let activeView = 'dashboard';
    
    // Mapear etapas NT-GIP y las 11 herramientas del Doble Diamante
    if (filename.includes('presentacion')) activeView = 'etapa1-presentacion';
    else if (filename.includes('01-observacion')) activeView = 'fase1-01';
    else if (filename.includes('02-mapa-empatia')) activeView = 'fase1-02';
    else if (filename.includes('03-encuestas')) activeView = 'fase1-03';
    else if (filename.includes('04-ficha-persona')) activeView = 'fase2-04';
    else if (filename.includes('05-grupos-focales') || filename.includes('05-muro-hallazgos')) activeView = 'fase2-05';
    else if (filename.includes('06-definicion-desafio')) activeView = 'fase2-06';
    else if (filename.includes('07-lluvia-ideas')) activeView = 'fase3-07';
    else if (filename.includes('08-matriz-priorizacion')) activeView = 'fase3-08';
    else if (filename.includes('09-prototipado-rapido')) activeView = 'fase3-09';
    else if (filename.includes('10-plan-accion')) activeView = 'fase4-10';
    else if (filename.includes('11-matriz-riesgos')) activeView = 'fase4-11';
    else if (filename.includes('cierre')) activeView = 'etapa3-evaluacion';

    // Helper para cargar scripts secuencialmente
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => {
                console.warn('[PIIP Layout] No se pudo cargar script:', src);
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    // Helper para cargar hojas de estilo CSS
    function loadStyle(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Inyectar Sidebar segmentado según las 3 etapas de la NT-GIP (SGP-PCM)
    function injectSidebar() {
        const aside = document.createElement('aside');
        aside.className = 'sidebar w-72 border-r border-slate-200 flex flex-col h-screen shrink-0 bg-slate-50';

        const perfil = typeof window.obtenerPerfilActivo === 'function'
            ? window.obtenerPerfilActivo()
            : {
                nombre: 'Alex Dario Abad Escalante',
                cargo: 'Titular - Unidad de Modernización (UPP)',
                etiquetaRol: 'Servidor Unidad de Modernización (Titular)',
                iniciales: 'AA',
                badgeColor: 'bg-emerald-800 text-white',
                rol: 'modernizacion_titular'
            };

        const isEtapa2Active = activeView.startsWith('fase');

        aside.innerHTML = `
            <div class="p-5 border-b border-slate-200 bg-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-lg font-bold text-emerald-700 flex items-center gap-2">
                        <i data-lucide="leaf" class="w-5 h-5"></i> AGROIDEAS PIIP
                    </h1>
                    <span class="text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-white px-1.5 py-0.5">NT-GIP</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-0.5">Portafolio Institucional de Innovación Pública</p>
                
                <div class="px-2.5 py-1.5 mt-3 bg-emerald-50 border border-emerald-200 text-3xs font-semibold text-emerald-900 flex flex-col gap-0.5">
                    <div class="flex items-center justify-between">
                        <span class="uppercase tracking-wider text-[8px] text-emerald-700 font-bold">Proyecto Activo:</span>
                        <span id="sidebar-active-project-stage" class="text-[8px] font-mono bg-emerald-200/70 text-emerald-900 px-1">En Ejecución</span>
                    </div>
                    <span id="sidebar-active-project-name" class="truncate font-bold text-emerald-950 text-[11px]">Seleccionando...</span>
                </div>
            </div>
            
            <nav class="flex-1 overflow-y-auto py-3 px-2.5 space-y-3">
                <!-- PORTAFOLIO CENTRAL -->
                <div>
                    <a href="${prefix}index.html" class="sidebar__item flex items-center justify-between px-3 py-2 text-xs font-bold ${activeView === 'dashboard' ? 'sidebar__item--active' : 'text-slate-700'}" id="nav-dashboard">
                        <span class="flex items-center gap-2.5">
                            <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-700"></i> Portafolio Institucional (PIIP)
                        </span>
                        <span class="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 font-bold">Vista Central</span>
                    </a>
                </div>

                <!-- CABECERA DE CAJA DE HERRAMIENTAS SEGMENTADA SEGÚN NT-GIP -->
                <div class="px-2 pt-1">
                    <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Caja de Herramientas (NT-GIP SGP-PCM)</span>
                </div>

                <!-- =========================================================
                     ETAPA 1: PRESENTACIÓN DE INICIATIVAS (NT-GIP)
                     ========================================================= -->
                <div class="border border-slate-200 bg-white">
                    <button type="button" class="stage-accordion-btn w-full px-3 py-2 bg-slate-100 hover:bg-slate-200/70 flex items-center justify-between text-left border-b border-slate-200 transition-colors" data-target="stage-1-menu">
                        <div>
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Etapa 1 • NT-GIP</span>
                            <span class="text-xs font-bold text-slate-800">Presentación de Iniciativas</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500"></i>
                    </button>
                    <ul id="stage-1-menu" class="py-1.5 px-1.5 space-y-1">
                        <li>
                            <a href="${prefix}iniciativas/presentacion.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'etapa1-presentacion' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-etapa1-presentacion">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600"></i> 00. Problema y Lluvia de Ideas
                                </span>
                                <span class="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 font-bold">Etapa 1</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- =========================================================
                     ETAPA 2: EJECUCIÓN DE PROYECTOS (DOBLE DIAMANTE)
                     ========================================================= -->
                <div class="border border-slate-200 bg-white">
                    <button type="button" class="stage-accordion-btn w-full px-3 py-2 bg-emerald-950 text-white flex items-center justify-between text-left border-b border-slate-200 transition-colors" data-target="stage-2-menu">
                        <div>
                            <span class="text-[9px] font-bold text-emerald-300 uppercase tracking-wider block">Etapa 2 • NT-GIP (Doble Diamante)</span>
                            <span class="text-xs font-bold text-white">Ejecución de Proyectos</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-emerald-300"></i>
                    </button>
                    
                    <ul id="stage-2-menu" class="py-2 px-1.5 space-y-1 ${isEtapa2Active || activeView === 'dashboard' ? '' : ''}">
                        <!-- FASE 1: DESCUBRIR -->
                        <li class="pt-1 pb-0.5">
                            <span class="px-2 text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 1: Descubrir (Problema)</span>
                        </li>
                        <li>
                            <a href="${prefix}fase1/01-observacion.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase1-01' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-01">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> 01. Observación AEIOU
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D1</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase1/02-mapa-empatia.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase1-02' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-02">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="heart" class="w-3.5 h-3.5"></i> 02. Mapa de Empatía
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D1</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase1/03-encuestas.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase1-03' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-03">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> 03. Encuestas de Campo
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D1</span>
                            </a>
                        </li>
                        
                        <!-- FASE 2: DEFINIR -->
                        <li class="pt-2.5 pb-0.5">
                            <span class="px-2 text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 2: Definir (Síntesis)</span>
                        </li>
                        <li>
                            <a href="${prefix}fase2/04-ficha-persona.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase2-04' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-04">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="user" class="w-3.5 h-3.5"></i> 04. Ficha de Persona
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D2</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase2/05-grupos-focales.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase2-05' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-05">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="kanban" class="w-3.5 h-3.5"></i> 05. Muro de Hallazgos
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D2</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase2/06-definicion-desafio.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase2-06' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-06">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> 06. Desafío (HMW)
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">D2</span>
                            </a>
                        </li>
                        
                        <!-- FASE 3: IDEAR -->
                        <li class="pt-2.5 pb-0.5">
                            <span class="px-2 text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 3: Idear (Solución)</span>
                        </li>
                        <li>
                            <a href="${prefix}fase3/07-lluvia-ideas.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase3-07' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-07">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i> 07. Lluvia de Ideas (Crazy 8s)
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">I3</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase3/08-matriz-priorizacion.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase3-08' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-08">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> 08. Matriz Priorización
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">I3</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase3/09-prototipado-rapido.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase3-09' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-09">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="map" class="w-3.5 h-3.5"></i> 09. Prototipado Rápido
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">I3</span>
                            </a>
                        </li>
                        
                        <!-- FASE 4: ENTREGAR -->
                        <li class="pt-2.5 pb-0.5">
                            <span class="px-2 text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 4: Entregar (Validación)</span>
                        </li>
                        <li>
                            <a href="${prefix}fase4/10-plan-accion.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase4-10' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase4-10">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="milestone" class="w-3.5 h-3.5"></i> 10. Plan de Acción
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">E4</span>
                            </a>
                        </li>
                        <li>
                            <a href="${prefix}fase4/11-matriz-riesgos.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'fase4-11' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase4-11">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> 11. Matriz de Riesgos
                                </span>
                                <span class="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">E4</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- =========================================================
                     ETAPA 3: EVALUACIÓN Y SEGUIMIENTO (NT-GIP)
                     ========================================================= -->
                <div class="border border-slate-200 bg-white">
                    <button type="button" class="stage-accordion-btn w-full px-3 py-2 bg-slate-100 hover:bg-slate-200/70 flex items-center justify-between text-left border-b border-slate-200 transition-colors" data-target="stage-3-menu">
                        <div>
                            <span class="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Etapa 3 • NT-GIP</span>
                            <span class="text-xs font-bold text-slate-800">Evaluación y Cierre</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500"></i>
                    </button>
                    <ul id="stage-3-menu" class="py-1.5 px-1.5 space-y-1">
                        <li>
                            <a href="${prefix}evaluacion/cierre.html" class="sidebar__item flex items-center justify-between px-2.5 py-1.5 text-xs font-medium ${activeView === 'etapa3-evaluacion' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-etapa3-evaluacion">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="award" class="w-3.5 h-3.5 text-blue-700"></i> 12. Evaluación e Impacto SGP
                                </span>
                                <span class="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.5 font-bold">Etapa 3</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            
            <!-- PIE DEL SIDEBAR: SESIÓN FORMAL ACTIVA Y CAMBIO DE PERFIL (SGP-PCM) -->
            <div class="p-3.5 border-t border-slate-200 bg-white shrink-0 space-y-2.5">
                <div class="flex items-start gap-2.5">
                    <div class="w-8 h-8 ${perfil.badgeColor || 'bg-emerald-800 text-white'} font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ${perfil.iniciales || 'U'}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1">
                            <p class="text-xs font-bold text-slate-800 truncate" title="${perfil.nombre}">${perfil.nombre}</p>
                        </div>
                        <p class="text-[10px] font-semibold text-emerald-700 truncate" title="${perfil.etiquetaRol}">${perfil.etiquetaRol}</p>
                        <p class="text-[9px] text-slate-400 truncate">Sesión Autenticada • NT-GIP</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                    <button type="button" id="btn-open-formal-login" class="btn btn-secondary py-1 px-2 text-[10px] font-bold flex items-center justify-center gap-1 text-slate-700 hover:text-emerald-800">
                        <i data-lucide="key-round" class="w-3 h-3"></i> Cambiar Perfil
                    </button>
                    <a href="${prefix}login.html" class="btn btn-secondary py-1 px-2 text-[10px] font-bold flex items-center justify-center gap-1 text-slate-700 hover:text-slate-900">
                        <i data-lucide="log-out" class="w-3 h-3"></i> Login Formal
                    </a>
                </div>
            </div>
        `;
        
        document.body.insertBefore(aside, document.body.firstChild);

        // Eventos de acordeón de las 3 Etapas NT-GIP
        aside.querySelectorAll('.stage-accordion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetList = aside.querySelector('#' + targetId);
                if (targetList) {
                    targetList.classList.toggle('hidden');
                }
            });
        });

        // Evento de apertura de pantalla de Login formal
        const btnLogin = aside.querySelector('#btn-open-formal-login');
        if (btnLogin && typeof window.mostrarModalLoginFormal === 'function') {
            btnLogin.addEventListener('click', () => {
                window.mostrarModalLoginFormal(false);
            });
        }
    }

    // Inyectar Barra de Progreso Metodológico (Trazabilidad Transversal de las 3 Etapas NT-GIP + Doble Diamante)
    function injectBreadcrumb() {
        const mainEl = document.querySelector('main');
        if (!mainEl || activeView === 'dashboard') return;

        const isEtapa1 = activeView === 'etapa1-presentacion';
        const isEtapa3 = activeView === 'etapa3-evaluacion';
        const currentFaseNum = activeView.startsWith('fase1') ? 1 : 
                               activeView.startsWith('fase2') ? 2 : 
                               activeView.startsWith('fase3') ? 3 : 
                               activeView.startsWith('fase4') ? 4 : 0;

        const getPhaseClass = (num) => num === currentFaseNum ? 'text-emerald-700 font-bold' : (num < currentFaseNum ? 'text-slate-600' : 'text-slate-400');
        const getCircleClass = (num) => num === currentFaseNum ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : (num < currentFaseNum ? 'border-slate-300 bg-slate-100 text-slate-500 font-medium' : 'border-slate-200 text-slate-400');

        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'mb-6 bg-white border border-slate-200 p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between text-xs gap-3';
        
        breadcrumb.innerHTML = `
            <div class="flex items-center gap-2 text-slate-600 font-semibold">
                <i data-lucide="compass" class="w-4 h-4 text-emerald-700"></i>
                <span>Proceso Armonizado NT-GIP (SGP-PCM):</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 md:gap-3">
                <a href="${prefix}iniciativas/presentacion.html" class="flex items-center gap-1 px-2 py-0.5 border ${isEtapa1 ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold' : 'border-slate-200 text-slate-500 hover:text-slate-800'}">
                    <span class="text-[10px]">Etapa 1: Presentación</span>
                </a>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-300"></i>

                <div class="flex flex-wrap items-center gap-2 px-2.5 py-0.5 border ${currentFaseNum > 0 ? 'border-emerald-600 bg-emerald-50/40' : 'border-slate-200'}">
                    <span class="text-[10px] font-bold uppercase text-emerald-900 mr-1">Etapa 2 (Ejecución):</span>
                    <span class="flex items-center gap-1 ${getPhaseClass(1)}">
                        <span class="w-4 h-4 flex items-center justify-center border text-[9px] ${getCircleClass(1)}">1</span>
                        <span class="text-[11px]">Descubrir</span>
                    </span>
                    <span class="text-slate-300">/</span>
                    <span class="flex items-center gap-1 ${getPhaseClass(2)}">
                        <span class="w-4 h-4 flex items-center justify-center border text-[9px] ${getCircleClass(2)}">2</span>
                        <span class="text-[11px]">Definir</span>
                    </span>
                    <span class="text-slate-300">/</span>
                    <span class="flex items-center gap-1 ${getPhaseClass(3)}">
                        <span class="w-4 h-4 flex items-center justify-center border text-[9px] ${getCircleClass(3)}">3</span>
                        <span class="text-[11px]">Idear</span>
                    </span>
                    <span class="text-slate-300">/</span>
                    <span class="flex items-center gap-1 ${getPhaseClass(4)}">
                        <span class="w-4 h-4 flex items-center justify-center border text-[9px] ${getCircleClass(4)}">4</span>
                        <span class="text-[11px]">Entregar</span>
                    </span>
                </div>

                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-300"></i>
                <a href="${prefix}evaluacion/cierre.html" class="flex items-center gap-1 px-2 py-0.5 border ${isEtapa3 ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-slate-200 text-slate-500 hover:text-slate-800'}">
                    <span class="text-[10px]">Etapa 3: Evaluación</span>
                </a>
            </div>
        `;

        mainEl.insertBefore(breadcrumb, mainEl.firstChild);
    }

    // Inicialización del layout
    async function initLayout() {
        // Cargar CSS
        loadStyle('https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');
        loadStyle(`${prefix}css/style.css`);

        // Cargar scripts requeridos secuencialmente
        await loadScript('https://cdn.tailwindcss.com');
        await loadScript('https://code.jquery.com/jquery-3.7.0.min.js');
        await loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js');
        await loadScript('https://unpkg.com/lucide@latest');

        // Cargar módulos de gobernanza NT-GIP (Auth RBAC y Workflow)
        await loadScript(`${prefix}js/auth.js`);
        await loadScript(`${prefix}js/workflow.js`);

        // Inyectar Sidebar y Breadcrumb
        injectSidebar();
        injectBreadcrumb();

        // Aplicar restricciones de interfaz según el perfil activo
        if (typeof window.aplicarGuardsUI === 'function') {
            window.aplicarGuardsUI();
        }

        // Renderizar iconos de Lucide
        if (window.lucide) {
            lucide.createIcons();
        }

        // Renderizar el nombre y estado del proyecto activo en el sidebar
        if (typeof obtenerProyectos === 'function' && typeof obtenerProyectoActivoId === 'function') {
            const activeId = obtenerProyectoActivoId();
            const projects = obtenerProyectos();
            const activeProj = projects.find(p => p.id === activeId);
            const sidebarLabel = document.getElementById('sidebar-active-project-name');
            const sidebarStage = document.getElementById('sidebar-active-project-stage');
            if (sidebarLabel && activeProj) {
                sidebarLabel.textContent = `${activeProj.code}: ${activeProj.title}`;
                sidebarLabel.title = `${activeProj.code} - ${activeProj.title}`;
            }
            if (sidebarStage && activeProj) {
                sidebarStage.textContent = activeProj.workflowState || 'En Ejecución';
            }
        }

        // Marcar que el entorno está listo para los controladores
        window.layoutReady = true;
        document.dispatchEvent(new CustomEvent('layout-ready'));
    }

    // Ejecutar cuando el DOM inicial esté cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLayout);
    } else {
        initLayout();
    }
})();
