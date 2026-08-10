/**
   ==========================================================================
   AGROIDEAS PIIP - Layout Manager
   Inyecta el Sidebar, cabeceras, CDNs y Breadcrumb de forma dinámica (MPA)
   ========================================================================== */

(function() {
    // 1. Determinar el prefijo de ruta relativo
    const currentPath = window.location.pathname;
    const isSubFolder = currentPath.includes('/fase1/') || 
                          currentPath.includes('/fase2/') || 
                          currentPath.includes('/fase3/') || 
                          currentPath.includes('/fase4/');
    const prefix = isSubFolder ? '../' : './';

    // 2. Determinar la herramienta activa en el menú
    const filename = currentPath.split('/').pop() || 'index.html';
    let activeView = 'dashboard';
    
    // Mapear los 11 archivos de herramientas
    if (filename.includes('01-observacion')) activeView = 'fase1-01';
    else if (filename.includes('02-mapa-empatia')) activeView = 'fase1-02';
    else if (filename.includes('03-encuestas')) activeView = 'fase1-03';
    else if (filename.includes('04-ficha-persona')) activeView = 'fase2-04';
    else if (filename.includes('05-grupos-focales')) activeView = 'fase2-05';
    else if (filename.includes('06-definicion-desafio')) activeView = 'fase2-06';
    else if (filename.includes('07-lluvia-ideas')) activeView = 'fase3-07';
    else if (filename.includes('08-matriz-priorizacion')) activeView = 'fase3-08';
    else if (filename.includes('09-prototipado-rapido')) activeView = 'fase3-09';
    else if (filename.includes('10-plan-accion')) activeView = 'fase4-10';
    else if (filename.includes('11-matriz-riesgos')) activeView = 'fase4-11';

    // Helper para cargar scripts secuencialmente
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
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

    // Inyectar Sidebar en el Body
    function injectSidebar() {
        const aside = document.createElement('aside');
        aside.className = 'sidebar w-64 border-r border-slate-200 flex flex-col h-screen shrink-0';
        
        aside.innerHTML = `
            <div class="p-6 border-b border-slate-200">
                <h1 class="text-xl font-bold text-emerald-700 flex items-center gap-2">
                    <i data-lucide="leaf"></i> AGROIDEAS PIIP
                </h1>
                <p class="text-xs text-slate-500 mt-1">Gestión de Innovación Pública</p>
                <div class="px-2.5 py-1.5 mt-3 bg-emerald-50 border border-emerald-150 rounded text-3xs font-semibold text-emerald-800 flex flex-col gap-0.5">
                    <span class="uppercase tracking-wider text-[8px] opacity-70">Proyecto Activo:</span>
                    <span id="sidebar-active-project-name" class="truncate font-bold text-emerald-950">Ninguno</span>
                </div>
            </div>
            
            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1 px-3">
                    <li>
                        <a href="${prefix}index.html" class="sidebar__item flex items-center gap-3 px-3 py-2 text-sm font-medium ${activeView === 'dashboard' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-dashboard">
                            <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Portafolio Institucional
                        </a>
                    </li>
                    
                    <!-- FASE 1: DESCUBRIR -->
                    <li class="pt-4 pb-1">
                        <span class="px-3 text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 1: Descubrir</span>
                    </li>
                    <li>
                        <a href="${prefix}fase1/01-observacion.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase1-01' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-01">
                            <span class="flex items-center gap-2">
                                <i data-lucide="eye" class="w-3.5 h-3.5"></i> 01. Observación AEIOU
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase1/02-mapa-empatia.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase1-02' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-02">
                            <span class="flex items-center gap-2">
                                <i data-lucide="heart" class="w-3.5 h-3.5"></i> 02. Mapa de Empatía
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase1/03-encuestas.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase1-03' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase1-03">
                            <span class="flex items-center gap-2">
                                <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> 03. Encuestas
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    
                    <!-- FASE 2: DEFINIR -->
                    <li class="pt-4 pb-1">
                        <span class="px-3 text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 2: Definir</span>
                    </li>
                    <li>
                        <a href="${prefix}fase2/04-ficha-persona.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase2-04' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-04">
                            <span class="flex items-center gap-2">
                                <i data-lucide="user" class="w-3.5 h-3.5"></i> 04. Ficha de Persona
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase2/05-grupos-focales.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase2-05' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-05">
                            <span class="flex items-center gap-2">
                                <i data-lucide="kanban" class="w-3.5 h-3.5"></i> 05. Muro de Hallazgos
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase2/06-definicion-desafio.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase2-06' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase2-06">
                            <span class="flex items-center gap-2">
                                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> 06. Desafío (HMW)
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    
                    <!-- FASE 3: IDEAR -->
                    <li class="pt-4 pb-1">
                        <span class="px-3 text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 3: Idear</span>
                    </li>
                    <li>
                        <a href="${prefix}fase3/07-lluvia-ideas.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase3-07' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-07">
                            <span class="flex items-center gap-2">
                                <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i> 07. Lluvia de Ideas
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase3/08-matriz-priorizacion.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase3-08' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-08">
                            <span class="flex items-center gap-2">
                                <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> 08. Matriz Priorización
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase3/09-prototipado-rapido.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase3-09' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase3-09">
                            <span class="flex items-center gap-2">
                                <i data-lucide="map" class="w-3.5 h-3.5"></i> 09. Prototipado Rápido
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    
                    <!-- FASE 4: ENTREGAR -->
                    <li class="pt-4 pb-1">
                        <span class="px-3 text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fase 4: Entregar</span>
                    </li>
                    <li>
                        <a href="${prefix}fase4/10-plan-accion.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase4-10' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase4-10">
                            <span class="flex items-center gap-2">
                                <i data-lucide="milestone" class="w-3.5 h-3.5"></i> 10. Plan de Acción
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                    <li>
                        <a href="${prefix}fase4/11-matriz-riesgos.html" class="sidebar__item flex items-center justify-between px-3 py-1.5 text-xs font-medium ${activeView === 'fase4-11' ? 'sidebar__item--active' : 'text-slate-600'}" id="nav-fase4-11">
                            <span class="flex items-center gap-2">
                                <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> 11. Matriz de Riesgos
                            </span>
                            <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold">Activo</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <div class="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-emerald-700 text-white font-bold flex items-center justify-center">
                        A
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-800">Admin UPP</p>
                        <p class="text-[10px] text-slate-500">Rol: Administrador</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertBefore(aside, document.body.firstChild);
    }

    // Inyectar Barra de Progreso Metodológico (Trazabilidad Transversal)
    function injectBreadcrumb() {
        const mainEl = document.querySelector('main');
        if (!mainEl || activeView === 'dashboard') return;

        // Determinar en qué fase se encuentra la herramienta activa
        const currentFaseNum = activeView.startsWith('fase1') ? 1 : 
                               activeView.startsWith('fase2') ? 2 : 
                               activeView.startsWith('fase3') ? 3 : 
                               activeView.startsWith('fase4') ? 4 : 0;

        const getPhaseClass = (num) => num === currentFaseNum ? 'text-emerald-700 font-bold' : (num < currentFaseNum ? 'text-slate-600' : 'text-slate-400');
        const getCircleClass = (num) => num === currentFaseNum ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : (num < currentFaseNum ? 'border-slate-300 bg-slate-100 text-slate-500 font-medium' : 'border-slate-200 text-slate-400');

        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'mb-6 bg-white border border-slate-200 p-3 flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-3';
        
        breadcrumb.innerHTML = `
            <div class="flex items-center gap-2 text-slate-500 font-medium">
                <i data-lucide="compass" class="w-4 h-4"></i>
                <span>Trazabilidad de Innovación (Doble Diamante):</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 md:gap-4">
                <span class="flex items-center gap-1.5 ${getPhaseClass(1)}">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${getCircleClass(1)}">1</span>
                    <span>Descubrir</span>
                </span>
                <i data-lucide="chevron-right" class="w-3 h-3 text-slate-300"></i>
                
                <span class="flex items-center gap-1.5 ${getPhaseClass(2)}">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${getCircleClass(2)}">2</span>
                    <span>Definir</span>
                </span>
                <i data-lucide="chevron-right" class="w-3 h-3 text-slate-300"></i>
                
                <span class="flex items-center gap-1.5 ${getPhaseClass(3)}">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${getCircleClass(3)}">3</span>
                    <span>Idear</span>
                </span>
                <i data-lucide="chevron-right" class="w-3 h-3 text-slate-300"></i>
                
                <span class="flex items-center gap-1.5 ${getPhaseClass(4)}">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${getCircleClass(4)}">4</span>
                    <span>Entregar</span>
                </span>
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

        // Inyectar Sidebar y Breadcrumb
        injectSidebar();
        injectBreadcrumb();

        // Renderizar iconos de Lucide
        if (window.lucide) {
            lucide.createIcons();
        }

        // Renderizar el nombre del proyecto activo en el sidebar
        if (typeof obtenerProyectos === 'function' && typeof obtenerProyectoActivoId === 'function') {
            const activeId = obtenerProyectoActivoId();
            const projects = obtenerProyectos();
            const activeProj = projects.find(p => p.id === activeId);
            const sidebarLabel = document.getElementById('sidebar-active-project-name');
            if (sidebarLabel && activeProj) {
                sidebarLabel.textContent = activeProj.title;
                sidebarLabel.title = activeProj.title;
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
