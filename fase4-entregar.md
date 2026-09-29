# Plan de Implementación: Fase 4 - Entregar (Herramientas H10 y H11)

## 1. Overview (Contexto y Propósito)
Este plan define las tareas técnicas, metodológicas y de interfaz para alinear los formularios, vistas y persistencia de la **Fase 4: Entregar** del aplicativo **AGROIDEAS-PIIP** con la especificación técnica unificada `far-piip-v3.json` (documentada en `Document/propuesta_esquema_json/`).

Tras haber completado las fases metodológicas previas del Doble Diamante:
- **Fase 1 (Descubrir):** Análisis del Problema (H01), Mapeo de Actores (H02) y Entrevistas/Encuestas (H03).
- **Fase 2 (Definir):** Arquetipos de Persona (H04), Muro de Hallazgos/Insights (H05) y Desafíos HMW aprobados (H06).
- **Fase 3 (Idear):** Lluvia de Ideas y Crazy 8's con Dot-voting (H07), Matriz de Priorización Multicriterio con Solución Ganadora (H08) y Prototipado Rápido con Métrica de Testeo (H09).

La **Fase 4: Entregar** es la fase de convergencia final del proceso de innovación, donde los prototipos testeados se transforman en una solución pública estructurada y sostenible para la entidad:
1. **H10: Plan de Acción y Hoja de Ruta (`10-plan-accion.html`):** Cronograma de despliegue operativo estructurado en tareas clave (`taskName`), asignación de unidad orgánica responsable (`responsibleUnit`), fechas de ejecución (`startDate`, `endDate`), entregable formal esperado (`deliverable`) y estado de avance (`status`: Pendiente, En Proceso, Completado).
2. **H11: Matriz de Gestión de Riesgos y Testeo (`11-matriz-riesgos.html`):** Evaluación integral de amenazas al proyecto mediante la tipificación del riesgo (`riskType`: Tecnológico, Operativo, Legal / Normativo, Presupuestal), calibración de probabilidad e impacto para cálculo de severidad, estrategia de mitigación preventiva/correctiva (`mitigationStrategy`) y documentación formal del resultado del testeo de campo y lecciones aprendidas (`testResult`). Representa el cierre metodológico formal del Doble Diamante de Innovación Pública.

Actualmente, las vistas de Fase 4 presentan discrepancias con los esquemas normativos (`h10_plan_accion.json`, `h11_matriz_riesgos_testeo.json`), carecen de banner de iniciativa activa con selector de proyecto, no tienen helpers de precarga grounded ni cálculo interactivo del semáforo de riesgo en H11, y H10 no incluye el campo formal de entregable institucional.

---

## 2. Project Type
- **Tipo:** `WEB` (Multi-Page Application Local-First con HTML5 Semántico, Tailwind CSS, Vanilla JS y persistencia en LocalStorage).
- **Agente Principal:** `project-planner` (Planificación y gobernanza), `frontend-specialist` (Diseño UI/UX interactivo) y `backend-specialist` (Modelos de datos, CRUD y migraciones de semillas).

---

## 3. Success Criteria (Criterios de Éxito Medibles)
- [ ] **Alineación Normativa al 100%:** Cumplimiento estricto de los campos y tipos definidos en `h10_plan_accion.json` y `h11_matriz_riesgos_testeo.json`.
- [ ] **Aislamiento Multitenant Estricto (`projectCode` / `projectId`):** Planes de acción y matrices de riesgo se asocian y filtran estrictamente por la iniciativa activa (`PIIP-2026-IN0001` a `IN0013`).
- [ ] **Trazabilidad y Cierre del Doble Diamante (H09 → H10 → H11 → Dashboard):**
  - H10 toma como referencia el prototipo conceptual validado en H09.
  - H11 recoge las evidencias de testeo y aprendizajes de campo para blindar la sostenibilidad del proyecto.
  - H11 incluye el panel de cierre de ciclo metodológico con certificación de fase completada y retorno al Dashboard institucional (`index.html`).
- [ ] **Hoja de Ruta Interactiva en H10:**
  - Formulario con campos: `taskName`, `responsibleUnit`, `startDate`, `endDate`, `deliverable` y `status`.
  - Tabla DataTable con semáforo de estado (Pendiente: ámbar, En Proceso: azul, Completado: esmeralda).
  - Selector/botón rápido para conmutar estado de tarea y edición en línea.
- [ ] **Matriz de Riesgos y Resultados de Testeo en H11:**
  - Tipificación formal: `Tecnológico`, `Operativo`, `Legal / Normativo`, `Presupuestal`.
  - Cálculo dinámico de severidad (Nivel: Alto / Medio / Bajo) combinando Probabilidad (Alta, Media, Baja) e Impacto (Alto, Medio, Bajo).
  - Documentación obligatoria de `mitigationStrategy` y `testResult` (resultado de validación de campo).
  - DataTable con filtros rápidos por nivel de riesgo y tipo.
- [ ] **Empty States y Precarga Metodológica Grounded:** Botón "Cargar Ejemplo Metodológico" en H10 y H11 que inyecta datos reales contextualizados de la iniciativa activa.
- [ ] **Banners de Iniciativa Activa y Navegación Secuencial:** Encabezados unificados con código de proyecto, unidad orgánica y estado, más botones footer: `H09` → `H10` → `H11` → `Portafolio PIIP (Dashboard)`.
- [ ] **Cumplimiento Estricto del Purple Ban:** Cero tonos morados/violetas; empleo exclusivo de colores institucionales (esmeralda, pizarra, ámbar, azul técnico, sky, rojo tenue para riesgos altos).

---

## 4. Tech Stack & Dependencias
- **Estructura:** HTML5 Semántico (formularios modulares, tablas DataTables interactivas y modales/paneles de cierre).
- **Estilos:** Tailwind CSS + `css/style.css` (clases modulares `.card`, `.btn`, semáforos de riesgo y badges de estado).
- **Lógica & Persistencia:** Vanilla JS ES6+:
  - `data/seed.js`: Incremento a `_schemaVersion: 9`, enriquecimiento de `actionPlans` y `risks` con `projectCode` y campos oficiales para las iniciativas institucionales.
  - `js/database.js`: Migración v9 no destructiva, métodos CRUD con aislamiento multitenant, conmutación de estado de tareas y precargas grounded.
  - `js/app.js`: Controladores `initPlanAccionView()` e `initMatrizRiesgosView()`.
  - `js/layout.js`: Inyección de sidebar, selector de iniciativas activas y breadcrumb metodológico de las 4 fases.
- **Librerías Externas:** jQuery 3.7.0, DataTables.js (para cronogramas y matrices de riesgo) y Lucide Icons.

---

## 5. File Structure (Archivos Afectados en Fase 4)
```
App_Sistema_Doble_Diamante/
├── data/
│   └── seed.js                                    # Semillas de Plan de Acción (H10) y Matriz de Riesgos/Testeo (H11)
├── js/
│   ├── database.js                                # Métodos CRUD, cambio de estado y precarga para Fase 4
│   └── app.js                                     # Controladores de UI, semáforo de riesgo y tabla de cronograma
├── fase4/
│   ├── 10-plan-accion.html                        # Banner activo + Formulario entregables + Cronograma DataTable
│   └── 11-matriz-riesgos.html                     # Banner activo + Severidad de riesgo + Resultado testeo + Cierre PIIP
└── Document/
    └── propuesta_esquema_json/                    # Referencia formal: h10, h11 y far-piip-v3.json
```

---

## 6. Task Breakdown (Lista de Tareas Detallada)

### Tarea 4.1: Modelos de Datos, Métodos CRUD y Semillas en `database.js` y `seed.js`
- **Agente:** `backend-specialist` | **Skills:** `clean-code`, `database-design`
- **Prioridad:** P0 (Bloqueante)
- **Dependencias:** Ninguna
- **INPUT:**
  - Esquemas JSON: `Document/propuesta_esquema_json/h10_plan_accion.json`, `h11_matriz_riesgos_testeo.json`.
  - Archivos: `data/seed.js` y `js/database.js`.
- **OUTPUT:**
  - **`data/seed.js`:**
    - Subir `_schemaVersion` a `9`.
    - Normalizar array `actionPlans` (H10):
      - Campos: `id`, `projectCode`, `taskName` (fallback `activity`), `responsibleUnit` (fallback `leader`), `startDate`, `endDate`, `deliverable`, `status` (`Pendiente`, `En Proceso`, `Completado`).
    - Normalizar array `risks` (H11):
      - Campos: `id`, `projectCode`, `riskDescription` (fallback `description`), `riskType` (`Tecnológico`, `Operativo`, `Legal / Normativo`, `Presupuestal`), `probability` (`Alta`, `Media`, `Baja`), `impact` (`Alto`, `Medio`, `Bajo`), `level` (`Alto`, `Medio`, `Bajo`), `mitigationStrategy` (fallback `mitigation`), `testResult`.
  - **`js/database.js`:**
    - Migración v9 no destructiva en `initDatabase()`.
    - `obtenerPlanesAccion(projectFilter = 'active')`, `guardarPlanAccion(tarea)`, `actualizarEstadoPlanAccion(id, nuevoEstado)`, `eliminarPlanAccion(id)`, `precargarEjemploPlanAccion(projectIdentifier)`.
    - `obtenerRiesgos(projectFilter = 'active')`, `guardarRiesgo(riesgo)`, `eliminarRiesgo(id)`, `precargarEjemploRiesgo(projectIdentifier)`.
- **VERIFY:**
  - Script en Node.js validando que `obtenerPlanesAccion()` y `obtenerRiesgos()` operen con aislamiento multitenant y calculen los niveles de riesgo apropiadamente.

---

### Tarea 4.2: Intervención de Vista y Formulario H10: `fase4/10-plan-accion.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 4.1
- **INPUT:**
  - Archivo `fase4/10-plan-accion.html`.
  - Especificación `h10_plan_accion.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Título del proyecto, código institucional, contador de hitos programados y botón de precarga metodológica.
  - **Callout de Prototipo Rector:** Muestra el prototipo validado en H09 como base de la hoja de ruta operativa.
  - **Formulario de Registro H10:**
    - `taskName`: Nombre de la tarea / actividad operativa.
    - `responsibleUnit`: Unidad orgánica responsable (UPDC, UN, UAJ, UPP, OTI o campo texto).
    - `startDate`: Selector de fecha de inicio.
    - `endDate`: Selector de fecha de término.
    - `deliverable`: Entregable esperado tangible (e.g. "Módulo PWA empaquetado para distribución").
    - `status`: Selector de estado (`Pendiente`, `En Proceso`, `Completado`).
  - **Tabla Dinámica DataTable de la Hoja de Ruta:**
    - Columnas: Tarea / Actividad, Unidad Responsable, Período (Inicio - Fin), Entregable Tangible, Estado (badge semántico interactivo con conmutador rápido), Acciones (Cambiar estado, Eliminar).
    - Resumen de avance del roadmap (porcentaje de tareas completadas).
  - **Controlador en `js/app.js` (`initPlanAccionView()`):**
    - Renderizado filtrado por proyecto, recálculo de avance y navegación: Volver a H09 (`../fase3/09-prototipado-rapido.html`) y Avanzar a H11 (`11-matriz-riesgos.html`).
- **VERIFY:**
  - Abrir `fase4/10-plan-accion.html`, registrar una actividad con entregable, cambiar su estado a "Completado" y verificar persistencia en LocalStorage.

---

### Tarea 4.3: Intervención de Vista y Matriz H11: `fase4/11-matriz-riesgos.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tareas 4.1, 4.2
- **INPUT:**
  - Archivo `fase4/11-matriz-riesgos.html`.
  - Especificación `h11_matriz_riesgos_testeo.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Código y título de la iniciativa con contador de riesgos mitigados y botón de precarga metodológica.
  - **Formulario de Gestión de Riesgos y Testeo:**
    - `riskDescription`: Descripción del riesgo institucional o técnico.
    - `riskType`: Selector de tipología (`Tecnológico`, `Operativo`, `Legal / Normativo`, `Presupuestal`).
    - `probability`: Selector de probabilidad (`Alta`, `Media`, `Baja`).
    - `impact`: Selector de impacto (`Alto`, `Medio`, `Bajo`).
    - Indicador en vivo de Severidad / Nivel de Riesgo (Semáforo visual: Rojo = Alto, Ámbar = Medio, Verde = Bajo).
    - `mitigationStrategy`: Estrategia preventiva o plan de contingencia.
    - `testResult`: Documentación del resultado del testeo de campo y aprendizaje generado.
  - **Tabla Dinámica DataTable de Riesgos:**
    - Columnas: Riesgo Identificado, Tipología, Probabilidad, Impacto, Nivel de Severidad, Estrategia de Mitigación, Resultado de Testeo, Acciones (Eliminar).
    - Tarjeta resumen con mapa de calor (Severidad Alta, Media, Baja).
  - **Panel de Cierre de Ciclo Metodológico (Doble Diamante Completo):**
    - Banner de felicitación institucional que certifica que la iniciativa ha completado exitosamente las 4 fases (11 herramientas).
    - Botón de acción principal: *"Finalizar y Retornar al Portafolio (Dashboard)"* (`../index.html`).
  - **Controlador en `js/app.js` (`initMatrizRiesgosView()`):**
    - Sincronización del semáforo en vivo, persistencia y trazabilidad de cierre.
- **VERIFY:**
  - Registrar un riesgo en `fase4/11-matriz-riesgos.html`, verificar el cálculo del semáforo, constatar la visualización del resultado de testeo y validar el enlace de retorno al Dashboard.

---

### Tarea 4.4: Sincronización Integral del Dashboard y Layout (`index.html` y `layout.js`)
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tareas 4.1 a 4.3
- **INPUT:**
  - `index.html` (Dashboard general del Portafolio PIIP).
  - `js/layout.js` (Sidebar, barra de navegación y cálculo global de progreso).
- **OUTPUT:**
  - Verificación del cálculo de porcentaje de avance global de cada proyecto (IN0001 a IN0013) considerando las 4 fases y 11 herramientas.
  - Verificación de que la Fase 4 figure como completable al tener registros válidos en H10 y H11.
  - Indicadores visuales de estado "Completado" en el timeline del proyecto.
- **VERIFY:**
  - Navegar a `index.html`, comprobar que la tabla de iniciativas y los indicadores de avance reflejen coherentemente las 4 fases completadas para IN0001.

---

### Tarea 4.5: Verificación Integral, Trazabilidad Metodológica y Suite de Calidad
- **Agente:** `orchestrator` / `project-planner` | **Skills:** `verify-changes`, `clean-code`
- **Prioridad:** P2
- **Dependencias:** Tareas 4.1 a 4.4
- **INPUT:**
  - Archivos: `fase4/10-plan-accion.html`, `fase4/11-matriz-riesgos.html`, `data/seed.js`, `js/database.js`, `js/app.js`.
- **OUTPUT:**
  - Suite automatizada de pruebas en Node.js que valide:
    1. Esquemas v9 en `seed.js` y `database.js`.
    2. Aislamiento multitenant de `actionPlans` y `risks`.
    3. Conmutación de estado en H10.
    4. Cálculo de severidad de riesgo en H11.
    5. Presencia de campos de entregable y resultado de testeo.
    6. Verificación estricta de cero clases violeta/morado (**Purple Ban**).
    7. Verificación sintáctica completa (`node -c`).
- **VERIFY:**
  - Ejecutar la suite completa y constatar salida 100% libre de errores.

---

## 7. Phase X: Verificación y Calidad (Checklist Obligatorio)

| Verificación | Herramienta / Método | Criterio de Aceptación |
| :--- | :--- | :--- |
| **Alineación Normativa** | Comparación contra esquemas JSON | Cumplimiento del 100% de los campos de `h10` y `h11` |
| **Aislamiento Multitenant** | Selector de proyectos en Sidebar | Datos de `IN0001` no se mezclan con `IN0002` a `IN0013` |
| **Cronograma y Entregables H10** | Formulario y Tabla H10 | Cada actividad define `startDate`, `endDate`, `deliverable` y estado conmutador |
| **Cálculo de Severidad H11** | Matriz Probabilidad x Impacto | Severidad Alta (Rojo), Media (Ámbar) o Baja (Verde) calculada automáticamente |
| **Documentación de Testeo H11** | Campo `testResult` en H11 | Evidencias y métricas de testeo de campo documentadas en cada riesgo mitigado |
| **Cierre del Doble Diamante** | Banner final en H11 | Certificación de flujo completado y enlace fluido al Portafolio Institucional |
| **Purple Ban (Prohibición)** | Auditoría de código CSS/HTML | Cero clases moradas/púrpuras; uso de esmeralda, pizarra, ámbar, azul técnico y rojo alerta |
| **Integridad de Migración** | Carga de `database.js` | `_schemaVersion: 9` migra datos sin pérdida de información histórica |
| **Validación de Sintaxis** | `node -c js/database.js js/app.js data/seed.js` | Cero errores de sintaxis en consola |
