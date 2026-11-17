# PLAN DE IMPLEMENTACIÓN: ALCANCES SGP-PCM (NT-GIP)
## Modernización del Portafolio Institucional de Innovación Pública (PIIP) - AGROIDEAS

**Slug:** `plan-sgp-pcm`  
**Archivo:** `./plan-sgp-pcm.md`  
**Referencia:** `Document/analisis-requerimientos-sgp-pcm.md` y `Document/Correo - Comentarios_Presentación PIIP AGROIDEAS.pdf`  
**Norma Aplicable:** NT-GIP N° 003-2025-PCM-SGP  
**Modo:** PLANNING ONLY (Sin código generado)

---

## 1. OVERVIEW & OBJETIVO

### ¿Qué vamos a construir?
Transformar el prototipo del PIIP AGROIDEAS desde un entorno enfocado exclusivamente en la ejecución del Doble Diamante hacia una **plataforma integral de Gestión de la Innovación Pública**, armonizada con los tres requerimientos solicitados por la **Secretaría de Gestión Pública (SGP-PCM)**:
1. **Segmentación de la caja de herramientas (Front-end):** Reestructurar la navegación en las 3 macro-etapas de la NT-GIP (Presentación de Iniciativas, Ejecución de Proyectos, Evaluación), incorporando un submódulo de ideación temprana y comprensión del problema.
2. **Flujo de trabajo y custodia de información (Back-end / Lógica):** Diseñar un flujo interno de estados formales (*Postulada ➔ En Evaluación ➔ Admitida PIIP ➔ En Ejecución ➔ Evaluada*), salvaguardando la información mediante la figura del **Titular y Suplente** en la Unidad de Modernización.
3. **Definición de perfiles de usuario (Full-stack / RBAC):** Implementar control de accesos para diferenciar al **Servidor de la Unidad de Modernización** (administrador del portafolio) del **Servidor de la Entidad / Equipo de Proyecto** (usuario de herramientas de diseño colaborativo).

---

## 2. PROJECT TYPE & TECH STACK

* **Tipo de Proyecto:** WEB (Arquitectura Multipage Application - MPA Local-First)
* **Frontend:** HTML5 semántico, Tailwind CSS (CDN), Lucide Icons, DataTables.js (jQuery)
* **Persistencia y Lógica:** JavaScript Vanilla ES6+, LocalStorage Engine relacional simulado (`js/database.js`), máquina de estados (`js/workflow.js`) y control de accesos (`js/auth.js`)
* **Compatibilidad Futura:** Diseñado bajo contratos de datos desacoplados (JSON Schemas) listos para migración a API REST / PostgreSQL institucional.

---

## 3. SUCCESS CRITERIA (CRITERIOS DE ÉXITO MEDIBLES)

1. **Segmentación NT-GIP en Sidebar:** El menú lateral organiza visiblemente las opciones en 3 etapas colapsables: (1) Presentación, (2) Ejecución (las 4 fases del Doble Diamante y 11 herramientas), y (3) Evaluación.
2. **Herramienta de Presentación Activa:** Existe una nueva vista (`iniciativas/presentacion.html`) donde cualquier servidor puede formular un problema y registrar una lluvia de ideas preliminar.
3. **Herramienta de Evaluación Activa:** Existe una nueva vista (`evaluacion/cierre.html`) para registrar métricas de valor público y cierre institucional.
4. **Roles RBAC Operativos:** Un selector en la interfaz permite alternar entre:
   * *Perfil 1: Unidad de Modernización (Titular / Suplente)*.
   * *Perfil 2: Servidor de la Entidad / Equipo de Proyecto*.
5. **Restricción de Acciones Críticas:** Cuando está activo el Perfil 2, los botones de "Registrar Nueva Iniciativa", "Recargar Datos Semilla (QA)" y aprobación de fases en el PIIP quedan deshabilitados u ocultos, mostrando avisos de restricción según la norma.
6. **Flujo de Vida y Custodia:** Toda nueva iniciativa nace como `Postulada` y solo un usuario con rol de Titular/Suplente de Modernización puede emitir el dictamen que la promueve a `Admitida al PIIP` con código oficial.

---

## 4. ESTRUCTURA DE ARCHIVOS PROYECTADA

```plaintext
App_Sistema_Doble_Diamante/
├── index.html                        # Dashboard PIIP con badges de estado NT-GIP y filtros
├── plan-sgp-pcm.md                   # Este plan de implementación
│
├── iniciativas/                      # [NUEVO] ETAPA 1: PRESENTACIÓN (NT-GIP)
│   └── presentacion.html             # Buzón de postulación, lluvia de ideas inicial y problema
│
├── fase1/ ... fase4/                 # ETAPA 2: EJECUCIÓN (DOBLE DIAMANTE - H01 a H11)
│   ├── 01-observacion.html ... 11-matriz-riesgos.html
│
├── evaluacion/                       # [NUEVO] ETAPA 3: EVALUACIÓN (NT-GIP)
│   └── cierre.html                   # Medición de valor público, lecciones aprendidas y reporte PCM
│
├── js/
│   ├── auth.js                       # [NUEVO] Motor RBAC (Roles, permisos, sesión activa)
│   ├── workflow.js                   # [NUEVO] Máquina de estados y log de auditoría
│   ├── layout.js                     # [MODIFICAR] Sidebar segmentado en 3 etapas NT-GIP + Switch de Perfil
│   ├── database.js                   # [MODIFICAR] Esquema v19 (estados, titular/suplente, buzón)
│   └── app.js                        # [MODIFICAR] Integración de dictamen y guards visuales
│
└── data/
    └── seed.js                       # [MODIFICAR] Semillas con estados de workflow y buzón inicial
```

---

## 5. TASK BREAKDOWN (PLAN DE TAREAS DETALLADAS)

### BLOQUE 1: GOBERNANZA Y CONTROL DE ACCESOS (FULL-STACK / RBAC)

#### `TASK-01: Creación del Módulo de Autenticación y RBAC (js/auth.js)`
* **Agente:** `backend-specialist`
* **Skills:** `clean-code`, `api-patterns`
* **Prioridad:** P0 (Bloqueante)
* **Dependencias:** Ninguna
* **INPUT:** Definición de los 2 perfiles exigidos por SGP-PCM (`modernizacion_titular`, `modernizacion_suplente`, `equipo_proyecto`).
* **OUTPUT:** Archivo `js/auth.js` con funciones: `obtenerPerfilActivo()`, `establecerPerfilActivo(rol)`, `tienePermiso(accion)`, y constantes de permisos por rol.
* **VERIFY:** Ejecución en consola: `establecerPerfilActivo('equipo_proyecto'); tienePermiso('crear_proyecto_oficial')` debe retornar `false`; con `modernizacion_titular` debe retornar `true`.

#### `TASK-02: Selector de Perfil y Guards de Seguridad en el Layout (js/layout.js)`
* **Agente:** `frontend-specialist`
* **Skills:** `frontend-design`, `clean-code`
* **Prioridad:** P0
* **Dependencias:** `TASK-01`
* **INPUT:** Componente de pie de sidebar en `js/layout.js`.
* **OUTPUT:** Inyección en el footer del Sidebar de un selector dinámico (Switch/Dropdown) para alternar entre "Modernización (Titular/Suplente)" y "Servidor / Equipo de Proyecto", más función `aplicarGuardsUI()` que oculta elementos con `data-permiso-requerido`.
* **VERIFY:** Al seleccionar "Equipo de Proyecto", el botón `#btn-reset-db` y `#btn-create-project` en `index.html` desaparecen o quedan bloqueados visualmente con un tooltip explicativo.

---

### BLOQUE 2: SEGMENTACIÓN DE LA CAJA DE HERRAMIENTAS (FRONT-END / UI)

#### `TASK-03: Reestructuración de la Barra Lateral según la NT-GIP (js/layout.js)`
* **Agente:** `frontend-specialist`
* **Skills:** `frontend-design`, `clean-code`
* **Prioridad:** P1
* **Dependencias:** `TASK-02`
* **INPUT:** Lista plana de 4 fases del Doble Diamante en `js/layout.js`.
* **OUTPUT:** Menú agrupado en 3 acordeones o bloques semánticos:
  1. **Etapa 1: Presentación de Iniciativas** (Nueva: Postulación y Lluvia de Ideas Inicial).
  2. **Etapa 2: Ejecución de Proyectos** (Fase 1 Descubrir, Fase 2 Definir, Fase 3 Idear, Fase 4 Entregar con sus 11 herramientas).
  3. **Etapa 3: Evaluación y Cierre** (Nueva: Medición de Impacto y Reporte SGP-PCM).
* **VERIFY:** En cualquier página del sistema, el Sidebar muestra claramente los 3 encabezados normativos con navegación fluida y estados activos correctos.

#### `TASK-04: Desarrollo de la Vista "Presentación de Iniciativas" (iniciativas/presentacion.html)`
* **Agente:** `frontend-specialist`
* **Skills:** `frontend-design`, `clean-code`
* **Prioridad:** P1
* **Dependencias:** `TASK-03`
* **INPUT:** Requerimiento SGP-PCM de facilitar lluvia de ideas y comprensión temprana del problema.
* **OUTPUT:** Nueva vista HTML completa con estilos Tailwind y layout integrado, que incluye:
  * Formulario de necesidad u oportunidad detectada en el servicio agrario.
  * Muro ágil de lluvia de ideas inicial (post-its rápidos de formulación del problema).
  * Listado de iniciativas postuladas pendientes de revisión por Modernización.
  * Botón de precarga contextual con ejemplos de postulación.
* **VERIFY:** Abrir `iniciativas/presentacion.html` en el navegador, completar el formulario y confirmar que la iniciativa queda registrada en el buzón en estado `Postulada`.

#### `TASK-05: Desarrollo de la Vista "Evaluación y Cierre de Proyectos" (evaluacion/cierre.html)`
* **Agente:** `frontend-specialist`
* **Skills:** `frontend-design`, `clean-code`
* **Prioridad:** P2
* **Dependencias:** `TASK-03`
* **INPUT:** Requerimiento SGP-PCM de evaluación ex-post y lecciones aprendidas.
* **OUTPUT:** Vista HTML completa con layout integrado que presenta:
  * Ficha de cierre de proyecto con evaluación de valor público (ahorros, tiempos, satisfacción de productores).
  * Repositorio de lecciones aprendidas durante la experimentación.
  * Botón para exportar el Reporte Consolidado en formato compatible con el Portafolio Nacional SGP-PCM.
* **VERIFY:** Abrir `evaluacion/cierre.html`, asociar el proyecto activo y validar el guardado de la ficha de evaluación.

---

### BLOQUE 3: FLUJO DE TRABAJO, CUSTODIA Y BASE DE DATOS (BACK-END / LÓGICA)

#### `TASK-06: Extensión del Esquema de Datos y Semillas (data/seed.js y js/database.js)`
* **Agente:** `database-architect`
* **Skills:** `database-design`, `clean-code`
* **Prioridad:** P1
* **Dependencias:** `TASK-01`
* **INPUT:** Esquema actual de iniciativas (`PIIP_SEED_DATA`).
* **OUTPUT:** 
  * Incremento a `SCHEMA_VERSION: 19`.
  * Incorporación de nuevos campos en entidad proyecto: `estado_flujo` (`postulada`, `en_evaluacion`, `admitida_piip`, `en_ejecucion`, `evaluada`), `custodio_titular`, `custodio_suplente`, `fecha_admision`, `historial_estados`.
  * Colección nueva `iniciativas_postuladas` para el buzón previo.
  * Migración suave en `js/database.js` para mantener intactos los datos existentes.
* **VERIFY:** `localStorage` migra exitosamente a v19 sin corromper los 13 proyectos actuales.

#### `TASK-07: Motor de Workflow y Auditoría (js/workflow.js)`
* **Agente:** `backend-specialist`
* **Skills:** `api-patterns`, `clean-code`
* **Prioridad:** P1
* **Dependencias:** `TASK-06`
* **INPUT:** Reglas de transición de estados y salvaguarda institucional.
* **OUTPUT:** Archivo `js/workflow.js` con métodos:
  * `admitirIniciativaAlPIIP(iniciativaId, dictamen, usuarioOperador)` (Genera código `PIIP-2026-INxxxx`).
  * `avanzarEstadoProyecto(projectId, proximoEstado, usuarioOperador)`.
  * `obtenerHistorialAuditoria(projectId)`.
* **VERIFY:** Intento de admisión con rol de `equipo_proyecto` lanza excepción de seguridad; con `modernizacion_titular` actualiza el estado y registra el log de auditoría con fecha y firma.

#### `TASK-08: Actualización del Dashboard PIIP y Modal de Dictamen (index.html y js/app.js)`
* **Agente:** `frontend-specialist`
* **Skills:** `frontend-design`, `nextjs-react-expert`
* **Prioridad:** P1
* **Dependencias:** `TASK-07`
* **INPUT:** Tabla DataTables de `index.html` y modal de gestión.
* **OUTPUT:**
  * Columna visual adicional en DataTables para el "Estado de Gestión NT-GIP" con semáforo específico.
  * Nuevo botón de acción "Dictamen de Admisión" visible únicamente para el Titular/Suplente de Modernización en proyectos en estado `Postulada`/`En Evaluación`.
  * Ventana modal para registrar observaciones o aprobar el ingreso al PIIP oficial.
* **VERIFY:** En `index.html`, los proyectos muestran su estado formal de flujo y el modal de dictamen opera correctamente.

---

## 6. PHASE X: VERIFICATION CHECKLIST (MANDATORIO)

Al finalizar la implementación de las tareas anteriores, se ejecutarán las siguientes validaciones:

- [x] **Cumplimiento de Roles:** Cambiar a Perfil "Equipo de Proyecto" y constatar que es imposible crear iniciativas oficiales directas ni reiniciar la BD.
- [x] **Ciclo Completo NT-GIP:**
  1. Registrar iniciativa en `iniciativas/presentacion.html` (Etapa 1).
  2. Iniciar sesión como Titular de Modernización y admitirla al PIIP en `index.html` con nuevo código oficial correlativo automático (`PIIP-2026-IN0014`).
  3. Trabajar en una herramienta del Doble Diamante (Etapa 2).
  4. Registrar la evaluación en `evaluacion/cierre.html` (Etapa 3).
- [x] **Preservación de Datos:** Los 13 proyectos oficiales precargados de AGROIDEAS conservan toda su evidencia de H01 a H11 intacta (`SCHEMA_VERSION: 19`).
- [x] **Sin Colores Prohibidos:** Verificación de paleta institucional (Emerald, Slate, Amber) sin violetas ni púrpuras.
- [x] **Responsive & Cross-browser:** El nuevo Sidebar segmentado y los acordeones funcionan fluidamente en resoluciones de escritorio y tablet.

---

## 7. DECISIONES VALIDADAS E IMPLEMENTADAS

1. **Gestión de la Sesión y Perfiles (Opción B):**  
   * Se implementó una pantalla de Login formal institucional ([login.html](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/17.%20PROPUESTA%20DE%20AUTOMATIZACI%C3%93N%20PIIP%20-%20DOBLE%20DIAMENTE/App_Sistema_Doble_Diamante/login.html)) y un modal de autenticación en tiempo real ([js/auth.js](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/17.%20PROPUESTA%20DE%20AUTOMATIZACI%C3%93N%20PIIP%20-%20DOBLE%20DIAMENTE/App_Sistema_Doble_Diamante/js/auth.js)) con las tres credenciales simuladas oficiales (`modernizacion1@agroideas.gob.pe`, `modernizacion2@agroideas.gob.pe`, `innovador@agroideas.gob.pe`).
2. **Nivel de Automatización del Código PIIP:**  
   * El código oficial se genera **automáticamente de forma correlativa** (`PIIP-2026-IN0014`, `PIIP-2026-IN0015`, etc.) tanto al admitir una iniciativa postulada en Etapa 1 como al registrar un nuevo proyecto en el Dashboard.

## ✅ PHASE X COMPLETE
- Lint & Architecture: ✅ Pass
- Security & RBAC: ✅ No critical issues (Guards UI + Validaciones de Rol activas)
- Build / MPA Integration: ✅ Success
- Date: 2026-11-12

