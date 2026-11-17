/**
 * ==========================================================================
 * AGROIDEAS PIIP - Módulo de Seguridad, Perfiles y Autenticación (RBAC)
 * Armonizado con los alcances de la SGP-PCM y la NT-GIP N° 003-2025-PCM-SGP
 * ========================================================================== */

(function () {
    if (window.PIIP_AUTH_LOADED) return;
    window.PIIP_AUTH_LOADED = true;

    const AUTH_STORAGE_KEY = 'piip_agroideas_session';

    // Directorio Institucional Simulado (Credenciales Formales para Demostración SGP-PCM)
    const CUENTAS_INSTITUCIONALES = [
        {
            id: 'usr-mod-titular',
            username: 'modernizacion1@agroideas.gob.pe',
            alias: 'titular.upp',
            password: 'Agro2026*',
            nombre: 'Alex Dario Abad Escalante',
            cargo: 'Titular - Unidad de Modernización (UPP)',
            unidad: 'Unidad de Planeamiento y Presupuesto (UPP)',
            rol: 'modernizacion_titular',
            etiquetaRol: 'Servidor Unidad de Modernización (Titular)',
            iniciales: 'AA',
            badgeColor: 'bg-emerald-800 text-white'
        },
        {
            id: 'usr-mod-suplente',
            username: 'modernizacion2@agroideas.gob.pe',
            alias: 'suplente.upp',
            password: 'Agro2026*',
            nombre: 'Especialista de Modernización PCC',
            cargo: 'Suplente - Unidad de Modernización (UPP)',
            unidad: 'Unidad de Planeamiento y Presupuesto (UPP)',
            rol: 'modernizacion_suplente',
            etiquetaRol: 'Servidor Unidad de Modernización (Suplente)',
            iniciales: 'SM',
            badgeColor: 'bg-teal-700 text-white'
        },
        {
            id: 'usr-equipo-innovacion',
            username: 'innovador@agroideas.gob.pe',
            alias: 'equipo.proyecto',
            password: 'Agro2026*',
            nombre: 'Fernando Ademir Loayza Choque',
            cargo: 'Integrante de Equipo de Proyecto / Servidor Innovador',
            unidad: 'Unidad de Negocios (UN) - AGROIDEAS',
            rol: 'equipo_proyecto',
            etiquetaRol: 'Servidor / Integrante de Equipo de Proyecto',
            iniciales: 'FL',
            badgeColor: 'bg-amber-600 text-white'
        }
    ];

    // Matriz de Permisos según Alcances SGP-PCM
    const MATRIZ_PERMISOS = {
        modernizacion_titular: [
            'ver_portafolio',
            'crear_proyecto_oficial',
            'editar_proyecto_oficial',
            'eliminar_proyecto_oficial',
            'dictaminar_admision_piip',
            'aprobar_cambio_fase',
            'postular_iniciativa_etapa1',
            'usar_herramientas_doble_diamante',
            'registrar_evaluacion_etapa3',
            'exportar_reporte_sgp',
            'resetear_semillas_qa',
            'ver_auditoria'
        ],
        modernizacion_suplente: [
            'ver_portafolio',
            'crear_proyecto_oficial',
            'editar_proyecto_oficial',
            'dictaminar_admision_piip',
            'aprobar_cambio_fase',
            'postular_iniciativa_etapa1',
            'usar_herramientas_doble_diamante',
            'registrar_evaluacion_etapa3',
            'exportar_reporte_sgp',
            'ver_auditoria'
        ],
        equipo_proyecto: [
            'ver_portafolio',
            'postular_iniciativa_etapa1',
            'usar_herramientas_doble_diamante'
        ]
    };

    // Obtener sesión actual (por defecto inicia con Titular si no se ha cerrado sesión explícitamente, o muestra login si fue cerrada)
    function obtenerSesionActiva() {
        try {
            const raw = localStorage.getItem(AUTH_STORAGE_KEY);
            if (!raw) {
                // Sesión inicial por defecto para evitar bloqueos en carga inicial, pero permite Login formal en cualquier momento
                const defaultUser = CUENTAS_INSTITUCIONALES[0];
                const initialSession = {
                    ...defaultUser,
                    loginTimestamp: new Date().toISOString(),
                    autenticado: true
                };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(initialSession));
                return initialSession;
            }
            const parsed = JSON.parse(raw);
            if (parsed && parsed.loggedOut === true) {
                return null;
            }
            return parsed;
        } catch (err) {
            console.error('[PIIP Auth] Error al leer sesión:', err);
            return CUENTAS_INSTITUCIONALES[0];
        }
    }

    function obtenerPerfilActivo() {
        return obtenerSesionActiva() || CUENTAS_INSTITUCIONALES[0];
    }

    function autenticarUsuario(identificador, password) {
        const cleanId = String(identificador || '').trim().toLowerCase();
        const cleanPass = String(password || '').trim();

        const cuenta = CUENTAS_INSTITUCIONALES.find(c =>
            c.username.toLowerCase() === cleanId ||
            c.alias.toLowerCase() === cleanId ||
            c.rol.toLowerCase() === cleanId
        );

        if (!cuenta) {
            return { ok: false, mensaje: 'Usuario institucional no encontrado en el directorio de AGROIDEAS.' };
        }

        if (cuenta.password !== cleanPass) {
            return { ok: false, mensaje: 'Contraseña incorrecta. Verifique sus credenciales.' };
        }

        const sesion = {
            ...cuenta,
            loginTimestamp: new Date().toISOString(),
            autenticado: true,
            loggedOut: false
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sesion));

        // Registrar evento en log de auditoría si database.js está disponible
        if (typeof registrarEventoAuditoria === 'function') {
            registrarEventoAuditoria('INICIO_SESION', `Inicio de sesión formal como ${cuenta.etiquetaRol}`, cuenta.nombre, cuenta.rol);
        }

        document.dispatchEvent(new CustomEvent('piip-session-changed', { detail: sesion }));
        return { ok: true, sesion };
    }

    function establecerPerfilActivo(rolOCuentaId) {
        const cuenta = CUENTAS_INSTITUCIONALES.find(c => c.rol === rolOCuentaId || c.id === rolOCuentaId) || CUENTAS_INSTITUCIONALES[0];
        const sesion = {
            ...cuenta,
            loginTimestamp: new Date().toISOString(),
            autenticado: true,
            loggedOut: false
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sesion));
        if (typeof registrarEventoAuditoria === 'function') {
            registrarEventoAuditoria('CAMBIO_PERFIL', `Cambio de sesión activa a ${cuenta.etiquetaRol}`, cuenta.nombre, cuenta.rol);
        }
        document.dispatchEvent(new CustomEvent('piip-session-changed', { detail: sesion }));
        return sesion;
    }

    function cerrarSesion() {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ loggedOut: true }));
        mostrarModalLoginFormal(true);
    }

    function tienePermiso(accion) {
        const sesion = obtenerSesionActiva();
        if (!sesion || !sesion.rol) return false;
        const lista = MATRIZ_PERMISOS[sesion.rol] || [];
        return lista.includes(accion);
    }

    function esUnidadModernizacion() {
        const sesion = obtenerSesionActiva();
        if (!sesion) return false;
        return sesion.rol === 'modernizacion_titular' || sesion.rol === 'modernizacion_suplente';
    }

    // Aplicar restricciones visuales en el DOM según el perfil activo
    function aplicarGuardsUI() {
        const sesion = obtenerSesionActiva();
        if (!sesion) {
            mostrarModalLoginFormal(true);
            return;
        }

        // 1. Elementos declarativos con data-permiso-requerido
        document.querySelectorAll('[data-permiso-requerido]').forEach(el => {
            const permiso = el.getAttribute('data-permiso-requerido');
            const modo = el.getAttribute('data-guard-mode') || 'hide'; // 'hide' o 'disable'
            if (!tienePermiso(permiso)) {
                if (modo === 'disable') {
                    el.setAttribute('disabled', 'disabled');
                    el.classList.add('opacity-50', 'cursor-not-allowed');
                    el.title = 'Acción reservada para la Unidad de Modernización (Titular/Suplente) según NT-GIP.';
                } else {
                    el.classList.add('hidden');
                }
            } else {
                if (modo === 'disable') {
                    el.removeAttribute('disabled');
                    el.classList.remove('opacity-50', 'cursor-not-allowed');
                } else {
                    el.classList.remove('hidden');
                }
            }
        });

        // 2. Botones maestros del Dashboard PIIP (index.html)
        const btnCreateProject = document.getElementById('btn-create-project');
        if (btnCreateProject) {
            if (!tienePermiso('crear_proyecto_oficial')) {
                btnCreateProject.classList.add('hidden');
            } else {
                btnCreateProject.classList.remove('hidden');
            }
        }

        const btnResetDb = document.getElementById('btn-reset-db');
        if (btnResetDb) {
            if (!tienePermiso('resetear_semillas_qa')) {
                btnResetDb.classList.add('hidden');
            } else {
                btnResetDb.classList.remove('hidden');
            }
        }

        // 3. Banner informativo de Rol en el Dashboard si es Equipo de Proyecto
        const dashboardHeader = document.querySelector('#view-dashboard header');
        let roleBanner = document.getElementById('rbac-info-banner');
        if (dashboardHeader && !esUnidadModernizacion()) {
            if (!roleBanner) {
                roleBanner = document.createElement('div');
                roleBanner.id = 'rbac-info-banner';
                roleBanner.className = 'mb-6 bg-amber-50 border-l-4 border-amber-600 p-4 flex items-center justify-between gap-4';
                const prefix = window.location.pathname.includes('/fase') || window.location.pathname.includes('/iniciativas') || window.location.pathname.includes('/evaluacion') ? '../' : './';
                roleBanner.innerHTML = `
                    <div class="flex items-start gap-3">
                        <i data-lucide="shield-check" class="w-5 h-5 text-amber-700 shrink-0 mt-0.5"></i>
                        <div>
                            <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider">Modo Servidor / Integrante de Equipo de Proyecto (NT-GIP)</h4>
                            <p class="text-xs text-amber-800 mt-0.5">
                                Tiene acceso de consulta al Portafolio Institucional y edición colaborativa completa en las <strong>11 Herramientas del Doble Diamante</strong>. Para proponer una nueva iniciativa, utilice la <strong>Etapa 1: Presentación de Iniciativas</strong>. El registro y modificación oficial del PIIP está custodiado por el Titular y Suplente de la Unidad de Modernización.
                            </p>
                        </div>
                    </div>
                    <a href="${prefix}iniciativas/presentacion.html" class="btn btn-primary text-xs whitespace-nowrap shrink-0">
                        Postular Iniciativa (Etapa 1)
                    </a>
                `;
                dashboardHeader.insertAdjacentElement('afterend', roleBanner);
                if (window.lucide) lucide.createIcons();
            }
        } else if (roleBanner && esUnidadModernizacion()) {
            roleBanner.remove();
        }
    }

    // Construir e inyectar Modal de Login Formal Institucional
    function mostrarModalLoginFormal(bloqueante = false) {
        let modal = document.getElementById('piip-formal-login-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'piip-formal-login-modal';
            modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
            document.body.appendChild(modal);
        }

        const sesionActual = obtenerSesionActiva();

        modal.innerHTML = `
            <div class="bg-white border-2 border-slate-800 shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                <!-- Columna Izquierda: Identidad Institucional y Alcances SGP-PCM -->
                <div class="md:col-span-5 bg-slate-900 text-white p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
                    <div>
                        <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">
                            <i data-lucide="shield" class="w-5 h-5"></i> MIDAGRI - AGROIDEAS
                        </div>
                        <h3 class="text-xl font-bold leading-tight text-white">Acceso al Sistema PIIP</h3>
                        <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                            Plataforma armonizada con la <strong>Norma Técnica de Gestión de la Innovación Pública (NT-GIP N° 003-2025-PCM-SGP)</strong> y los lineamientos de la Secretaría de Gestión Pública (SGP-PCM).
                        </p>

                        <div class="mt-6 space-y-3 border-t border-slate-800 pt-4">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Seleccionar Credencial para Demostración:</span>
                            
                            <button type="button" data-quick-user="modernizacion1@agroideas.gob.pe" data-quick-pass="Agro2026*" class="quick-credential-btn w-full text-left p-2.5 bg-slate-800/90 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 transition-colors">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-emerald-400">1. Unidad de Modernización (Titular)</span>
                                    <span class="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 font-bold uppercase">Custodio PIIP</span>
                                </div>
                                <p class="text-[11px] text-slate-200 font-medium mt-0.5">Alex Dario Abad Escalante</p>
                                <p class="text-[10px] text-slate-400 font-mono">modernizacion1@agroideas.gob.pe</p>
                            </button>

                            <button type="button" data-quick-user="modernizacion2@agroideas.gob.pe" data-quick-pass="Agro2026*" class="quick-credential-btn w-full text-left p-2.5 bg-slate-800/90 hover:bg-teal-950 border border-slate-700 hover:border-teal-500 transition-colors">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-teal-400">2. Unidad de Modernización (Suplente)</span>
                                    <span class="text-[9px] bg-teal-900 text-teal-200 px-1.5 py-0.5 font-bold uppercase">Suplente PIIP</span>
                                </div>
                                <p class="text-[11px] text-slate-200 font-medium mt-0.5">Especialista de Modernización PCC</p>
                                <p class="text-[10px] text-slate-400 font-mono">modernizacion2@agroideas.gob.pe</p>
                            </button>

                            <button type="button" data-quick-user="innovador@agroideas.gob.pe" data-quick-pass="Agro2026*" class="quick-credential-btn w-full text-left p-2.5 bg-slate-800/90 hover:bg-amber-950 border border-slate-700 hover:border-amber-500 transition-colors">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-amber-400">3. Servidor / Equipo de Proyecto</span>
                                    <span class="text-[9px] bg-amber-900 text-amber-200 px-1.5 py-0.5 font-bold uppercase">Innovador</span>
                                </div>
                                <p class="text-[11px] text-slate-200 font-medium mt-0.5">Fernando Ademir Loayza Choque</p>
                                <p class="text-[10px] text-slate-400 font-mono">innovador@agroideas.gob.pe</p>
                            </button>
                        </div>
                    </div>

                    <div class="mt-6 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>SGP-PCM / AGROIDEAS 2026</span>
                        <span class="font-mono">RBAC v2.0</span>
                    </div>
                </div>

                <!-- Columna Derecha: Formulario de Autenticación Formal -->
                <div class="md:col-span-7 p-6 md:p-8 bg-white flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Autenticación Institucional</span>
                                <h4 class="text-lg font-bold text-slate-800">Iniciar Sesión en la Plataforma Web</h4>
                            </div>
                            ${!bloqueante && sesionActual ? `
                                <button type="button" id="btn-close-login-modal" class="text-slate-400 hover:text-slate-700 p-1" title="Cerrar ventana">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            ` : ''}
                        </div>

                        <div id="login-error-box" class="hidden mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 font-medium"></div>

                        <form id="form-formal-login" class="space-y-4">
                            <div class="form__group">
                                <label class="form__label text-xs font-bold text-slate-700 uppercase tracking-wider" for="login-username">
                                    Correo Institucional o Usuario
                                </label>
                                <input type="text" id="login-username" class="form__input text-sm font-mono bg-slate-50" placeholder="modernizacion1@agroideas.gob.pe" value="${sesionActual ? sesionActual.username : 'modernizacion1@agroideas.gob.pe'}" required>
                            </div>

                            <div class="form__group">
                                <label class="form__label text-xs font-bold text-slate-700 uppercase tracking-wider" for="login-password">
                                    Contraseña de Acceso
                                </label>
                                <input type="password" id="login-password" class="form__input text-sm font-mono bg-slate-50" placeholder="•••••••••" value="Agro2026*" required>
                                <span class="text-[10px] text-slate-500 mt-1 block">Clave institucional de prueba para los 3 perfiles: <code class="font-bold text-slate-700">Agro2026*</code></span>
                            </div>

                            <div id="login-role-preview" class="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                                <div class="font-bold text-emerald-800 flex items-center gap-1.5">
                                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Alcance del Perfil Seleccionado:
                                </div>
                                <p id="login-role-preview-desc" class="text-[11px] text-slate-700 leading-relaxed">
                                    Haga clic en cualquiera de las tarjetas de la izquierda para autocompletar las credenciales y previsualizar sus privilegios normativos según la NT-GIP.
                                </p>
                            </div>

                            <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                                ${!bloqueante && sesionActual ? `
                                    <button type="button" id="btn-cancel-login-modal" class="btn btn-secondary text-xs font-bold uppercase tracking-wider px-4 py-2.5">
                                        Cancelar
                                    </button>
                                ` : ''}
                                <button type="submit" class="btn btn-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 flex items-center gap-2">
                                    <i data-lucide="log-in" class="w-4 h-4"></i> Ingresar con este Perfil
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Sesión actual: <strong class="text-slate-700">${sesionActual ? sesionActual.etiquetaRol : 'Sin sesión activa'}</strong></span>
                        <span class="text-emerald-700 font-semibold">Salvaguarda de Información NT-GIP</span>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();

        const descMap = {
            'modernizacion1@agroideas.gob.pe': '<strong>Titular de la Unidad de Modernización (UPP):</strong> Custodio principal del PIIP. Autorizado para registrar nuevas iniciativas oficiales, dictaminar admisión de postulaciones (generando código correlativo automático), aprobar cambios de fase y emitir reportes a la SGP-PCM.',
            'modernizacion2@agroideas.gob.pe': '<strong>Suplente de la Unidad de Modernización (UPP):</strong> Custodio alterno designado formalmente para garantizar la continuidad operativa del registro, actualización y seguimiento del Portafolio Institucional.',
            'innovador@agroideas.gob.pe': '<strong>Servidor de la Entidad / Equipo de Proyecto:</strong> Puede postular iniciativas en la Etapa 1 (Presentación y Lluvia de Ideas temprana) e interactuar con las 11 herramientas del Doble Diamante (Ficha de Persona, Matriz de Priorización, etc.), sin alterar los registros maestros del PIIP.'
        };

        const inputUser = modal.querySelector('#login-username');
        const inputPass = modal.querySelector('#login-password');
        const previewDesc = modal.querySelector('#login-role-preview-desc');

        function actualizarPreview(email) {
            if (previewDesc && descMap[email]) {
                previewDesc.innerHTML = descMap[email];
            }
        }
        actualizarPreview(inputUser.value);

        modal.querySelectorAll('.quick-credential-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const u = btn.getAttribute('data-quick-user');
                const p = btn.getAttribute('data-quick-pass');
                inputUser.value = u;
                inputPass.value = p;
                actualizarPreview(u);
                modal.querySelectorAll('.quick-credential-btn').forEach(b => b.classList.remove('ring-2', 'ring-emerald-400'));
                btn.classList.add('ring-2', 'ring-emerald-400');
            });
        });

        const closeModal = () => {
            modal.classList.add('hidden');
        };

        const btnClose = modal.querySelector('#btn-close-login-modal');
        const btnCancel = modal.querySelector('#btn-cancel-login-modal');
        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (btnCancel) btnCancel.addEventListener('click', closeModal);

        const form = modal.querySelector('#form-formal-login');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const res = autenticarUsuario(inputUser.value, inputPass.value);
            if (!res.ok) {
                const errBox = modal.querySelector('#login-error-box');
                errBox.textContent = res.mensaje;
                errBox.classList.remove('hidden');
                return;
            }
            closeModal();
            location.reload();
        });
    }

    // Exportar API global
    window.CUENTAS_INSTITUCIONALES = CUENTAS_INSTITUCIONALES;
    window.obtenerSesionActiva = obtenerSesionActiva;
    window.obtenerPerfilActivo = obtenerPerfilActivo;
    window.autenticarUsuario = autenticarUsuario;
    window.establecerPerfilActivo = establecerPerfilActivo;
    window.cerrarSesion = cerrarSesion;
    window.tienePermiso = tienePermiso;
    window.esUnidadModernizacion = esUnidadModernizacion;
    window.aplicarGuardsUI = aplicarGuardsUI;
    window.mostrarModalLoginFormal = mostrarModalLoginFormal;
})();

