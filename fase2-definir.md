# Plan de Implementación: Fase 2 - Definir (Herramientas H04, H05, H06)

## 1. Overview (Contexto y Propósito)
Este plan define las tareas técnicas, metodológicas y de interfaz para alinear los formularios, vistas y persistencia de la **Fase 2: Definir** del aplicativo **AGROIDEAS-PIIP** con la especificación técnica unificada `far-piip-v3.json` (documentada en `Document/propuesta_esquema_json/`).

Tras haber completado con éxito la **Fase 1: Descubrir** (H01, H02, H03) con aislamiento multitenant por `projectCode` y precarga metodológica, la Fase 2 es la fase de convergencia donde la investigación de campo se sintetiza en:
1. **H04: Ficha de Persona / Arquetipos (`04-ficha-persona.html`):** Caracterización de perfiles reales de usuarios (productores agrarios, evaluadores zonales, dirigentes comunales) con metas, frustraciones y competencia digital.
2. **H05: Muro de Hallazgos y Síntesis de Insights (`05-grupos-focales.html`):** Clasificación por clústeres temáticos y priorización de hallazgos cualitativos basados en evidencias de campo de Fase 1.
3. **H06: Definición del Desafío HMW (`06-definicion-desafio.html`):** Formulación estructurada de preguntas detonadoras "¿Cómo podríamos...?" mediante la descomposición de Usuario Objetivo, Acción de Mejora y Dolor/Obstáculo a superar, con flujo de aprobación UPP.

Actualmente, las vistas de Fase 2 presentan desalineaciones con los esquemas normativos (`h04_ficha_persona.json`, `h05_muro_hallazgos.json`, `h06_definicion_desafio_hmw.json`), carecen de banner de iniciativa activa, no tienen helpers de eliminación ni precarga metodológica por proyecto, y el formulario H06 no descompone los componentes de la fórmula HMW.

---

## 2. Project Type
- **Tipo:** `WEB` (Multi-Page Application Local-First con HTML5 Semántico, Tailwind CSS, Vanilla JS y persistencia en LocalStorage).
- **Agente Principal:** `project-planner` (Dirección del plan), `frontend-specialist` (Vistas, componentes y experiencia interactiva) y `backend-specialist` (Modelos de datos, CRUD y semillas).

---

## 3. Success Criteria (Criterios de Éxito Medibles)
- [x] **Alineación Normativa al 100%:** Cumplimiento exacto de los campos requeridos en `h04_ficha_persona.json`, `h05_muro_hallazgos.json` y `h06_definicion_desafio_hmw.json`.
- [x] **Aislamiento Multitenant Estricto (`projectCode` / `projectId`):** Arquetipos, Insights y Desafíos HMW guardados quedan asociados estrictamente a la iniciativa activa (IN0001 a IN0013) sin contaminación cruzada.
- [x] **Formulación Mad-libs / Dinámica de HMW en H06:** Descomposición asistida de la pregunta: `targetUser` (¿Para quién?), `actionGoal` (¿Qué queremos lograr?), `constraintOrPain` (¿A pesar de qué obstáculo?) generando automáticamente el `hmwStatement` ("¿Cómo podríamos...?") y gestionando el `status` ("Borrador", "Validado por Equipo", "Aprobado UPP").
- [x] **Muro de Post-its Interactivo en H05:** Agrupación visual por `clusterCategory`, etiquetas de `sourceTool` (AEIOU, Encuestas, Empatía), nivel de `priority` (Alta, Media, Baja) y filtrado dinámico.
- [x] **Ficha de Arquetipo Enriquecida en H04:** Visualización completa con biografía, objetivos (`goals`), frustraciones (`frustrations`), demografía y nivel de competencia digital (`techTechSavviness`).
- [x] **Empty States Interactivos y Precarga Metodológica:** Cada herramienta incluye botón "Cargar Ejemplo Metodológico" que inyecta datos grounded según la iniciativa activa.
- [x] **Trazabilidad y Flujo Secuencial:** Banners de iniciativa activa en el encabezado de las 3 páginas y botones footer de navegación secuencial: `H03` → `H04` → `H05` → `H06` → `H07 (Fase 3: Idear)`.
- [x] **Cumplimiento Estricto de Reglas de Diseño:** Respeto del **Purple Ban** (cero morados/violetas; paleta institucional esmeralda, pizarra, ámbar y azul técnico).

---

## 4. Tech Stack & Dependencias
- **Estructura:** HTML5 Semántico (formularios con labels asociados, inputs tipados, textareas accesibles y tablas con DataTables).
- **Estilos:** Tailwind CSS (CDN compilado) + `css/style.css` (clases modulares `.card`, `.btn`, `.sticky-note`, badges semánticos).
- **Lógica & Persistencia:** Vanilla JS ES6+ modular:
  - `data/seed.js`: Incremento de `_schemaVersion: 7`, datos grounded para H04, H05 y H06 en los proyectos IN0001 a IN0013.
  - `js/database.js`: Funciones CRUD con filtrado `projectFilter = 'active'`, normalización de arrays de texto, eliminación y precarga de ejemplos.
  - `js/app.js`: Controladores `initFichaPersonaView()`, `initMuroHallazgosView()` e `initDefinicionDesafioView()`.
  - `js/layout.js`: Sidebar institucional y breadcrumb de avance de 4 fases.
- **Componentes Externos:** jQuery 3.7.0, DataTables.js (para la tabla de desafíos HMW) y Lucide Icons.

---

## 5. File Structure (Archivos Afectados en Fase 2)
```
App_Sistema_Doble_Diamante/
├── data/
│   └── seed.js                                    # Semillas de Arquetipos (H04), Insights (H05) y Desafíos HMW (H06)
├── js/
│   ├── database.js                                # Métodos CRUD y migraciones para H04, H05 y H06
│   └── app.js                                     # Controladores de UI, generador Mad-libs HMW, filtrado de post-its
├── fase2/
│   ├── 04-ficha-persona.html                      # Banner iniciativa + formulario demográfico/digital + tarjetas enriquecidas
│   ├── 05-grupos-focales.html                     # Banner iniciativa + clústeres/prioridad/herramienta origen + muro post-its
│   └── 06-definicion-desafio.html                 # Banner iniciativa + Mad-libs HMW + estados UPP + DataTable HMW
└── Document/
    └── propuesta_esquema_json/                    # Referencia formal: h04, h05, h06 y far-piip-v3.json
```

---

## 6. Task Breakdown (Lista de Tareas Detallada)

### Tarea 2.1: Modelos de Datos, Métodos CRUD y Semillas en `database.js` y `seed.js`
- **Agente:** `backend-specialist` | **Skills:** `clean-code`, `database-design`
- **Prioridad:** P0 (Bloqueante)
- **Dependencias:** Ninguna
- **INPUT:**
  - Esquemas JSON: `h04_ficha_persona.json`, `h05_muro_hallazgos.json`, `h06_definicion_desafio_hmw.json`.
  - Archivos: `data/seed.js` y `js/database.js`.
- **OUTPUT:**
  - **`data/seed.js`:**
    - Subir `_schemaVersion` a `7`.
    - Normalizar array `personas` con campos: `projectCode`, `archetypeName` (con fallback de compatibilidad para `name`), `role`, `demographics` (edad/ubicación/educación), `bio`, `goals` (array), `frustrations` (array), `techTechSavviness`, `quote`.
    - Normalizar array `insights` con campos: `projectCode`, `clusterCategory`, `findingTitle` (fallback `title`), `evidenceText` (fallback `text`), `sourceTool`, `priority` (`Alta`, `Media`, `Baja`), `quote`, `image`.
    - Normalizar array `desafios` con campos: `projectCode`, `insightId`, `targetUser`, `actionGoal`, `constraintOrPain`, `hmwStatement` (fallback `question`), `status` (`Borrador`, `Validado por Equipo`, `Aprobado UPP`).
  - **`js/database.js`:**
    - Migración v7 no destructiva en `initDatabase()`.
    - `obtenerPersonas(projectFilter = 'active')`, `guardarPersona(persona)`, `eliminarPersona(id)`, `precargarEjemploPersona(projectIdentifier)`.
    - `obtenerInsights(projectFilter = 'active')`, `guardarInsight(insight)`, `eliminarInsight(id)`, `precargarEjemploInsight(projectIdentifier)`.
    - `obtenerDesafios(projectFilter = 'active')`, `guardarDesafio(desafio)`, `actualizarEstadoDesafio(id, nuevoEstado)`, `eliminarDesafio(id)`, `precargarEjemploDesafio(projectIdentifier)`.
- **VERIFY:**
  - Ejecutar verificación en Node.js de `database.js` y `seed.js` validando que las funciones devuelvan registros correctos vinculados a `projectCode`.

---

### Tarea 2.2: Intervención de Vista y Formulario H04: `fase2/04-ficha-persona.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 2.1
- **INPUT:**
  - Archivo `fase2/04-ficha-persona.html`.
  - Especificación `h04_ficha_persona.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Código, título y unidad responsable del proyecto activo, con botón de "Cargar Ejemplo Metodológico".
  - **Formulario Enriquecido H04:**
    - `archetypeName` (Nombre del Arquetipo, e.g. "Mateo Quispe - El Líder Agrario").
    - `role` (Rol / Ocupación).
    - `demographics` (Edad, Ubicación, Nivel Educativo).
    - `techTechSavviness` (Nivel de Competencia Digital: selector accesible con opciones Alto, Medio, Bajo y campo de contexto).
    - `bio` (Biografía y contexto de vida/trabajo).
    - `goals` (Objetivos y metas en el programa agrario).
    - `frustrations` (Dolores y frustraciones con los procesos institucionales).
    - `quote` (Frase textual o representativa).
  - **Panel de Fichas de Arquetipos:**
    - Tarjetas visuales de alto impacto estético con avatar temático, badges de demografía y competencia digital, listas ordenadas de objetivos y frustraciones, cita textual resaltada y botón para eliminar arquetipo.
    - Empty state motivacional cuando no existan arquetipos registrados para la iniciativa activa.
  - **Controlador en `js/app.js` (`initFichaPersonaView()`):**
    - Renderizado reactivo, guardado y eliminación en tiempo real.
    - Botones de navegación en footer: Volver a H03 (`../fase1/03-encuestas.html`) y Avanzar a H05 (`05-grupos-focales.html`).
- **VERIFY:**
  - Abrir `fase2/04-ficha-persona.html`, registrar un nuevo arquetipo, comprobar que se pinte en el grid con sus badges, probar el botón de precargar ejemplo metodológico y eliminar.

---

### Tarea 2.3: Intervención de Vista y Formulario H05: `fase2/05-grupos-focales.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 2.1
- **INPUT:**
  - Archivo `fase2/05-grupos-focales.html`.
  - Especificación `h05_muro_hallazgos.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Contexto del proyecto en curso con contador de insights registrados y botón de precarga.
  - **Formulario de Registro H05:**
    - `findingTitle`: Título del hallazgo / Insight clave.
    - `clusterCategory`: Selector / entrada de clúster temático (Accesibilidad y Conectividad, Gestión Comercial y Planes de Negocio, Procesos Administrativos, etc.).
    - `sourceTool`: Herramienta origen (AEIOU, Encuestas de Campo, Mapa de Empatía, Focus Group, Entrevista).
    - `priority`: Selector de prioridad (Alta, Media, Baja).
    - `evidenceText`: Evidencia cualitativa / Cita de campo.
    - `image`: URL opcional de fotografía de evidencia.
  - **Muro Interactivo (Research Wall):**
    - Post-its con estilo visual refinado (tarjetas estilo nota adhesiva en colores ámbar suave, esmeralda claro o slate cálido - respetando Purple Ban).
    - Badges de prioridad con semaforización clara (Alta: rojo tenue / Media: ámbar / Baja: slate).
    - Badge de herramienta origen.
    - Botón de eliminación en cada post-it.
    - Filtro rápido superior por clúster o prioridad.
    - Empty state cuando no haya insights registrados.
  - **Controlador en `js/app.js` (`initMuroHallazgosView()`):**
    - Integración de guardado, renderizado dinámico y precarga metodológica.
    - Navegación secuencial: Volver a H04 (`04-ficha-persona.html`) y Avanzar a H06 (`06-definicion-desafio.html`).
- **VERIFY:**
  - Registrar un insight en `05-grupos-focales.html`, verificar que aparezca en el muro con sus badges de origen y prioridad, y que persista bajo la iniciativa activa.

---

### Tarea 2.4: Intervención de Vista y Formulario H06: `fase2/06-definicion-desafio.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tareas 2.1, 2.3
- **INPUT:**
  - Archivo `fase2/06-definicion-desafio.html`.
  - Especificación `h06_definicion_desafio_hmw.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Identificación del proyecto y vinculación metodológica con la Fase 2.
  - **Formulario con Asistente Mad-libs HMW:**
    - Selector dinámico de Insight sostén (poblado con los insights del proyecto activo provenientes de H05).
    - Componente 1: `targetUser` (¿Para quién? - Usuario objetivo, e.g. "los directivos de organizaciones agrarias").
    - Componente 2: `actionGoal` (¿Qué queremos lograr? - Acción de mejora, e.g. "brindar capacitación técnica continua").
    - Componente 3: `constraintOrPain` (¿A pesar de qué obstáculo? - Dolor a superar, e.g. "la escasa conectividad en las parcelas").
    - Preview reactivo en vivo de la pregunta consolidada: `"¿Cómo podríamos [actionGoal] a [targetUser] a pesar de [constraintOrPain]?"`.
    - Campo editable directo de la pregunta HMW (`hmwStatement`) para ajustes de redacción.
    - Selector de `status`: `Borrador`, `Validado por Equipo`, `Aprobado UPP`.
  - **Tabla Dinámica DataTable de Desafíos HMW:**
    - Columnas: Código (`HMW-00X`), Insight Vinculado, Pregunta Detonadora Formativa, Estado (con badges interactivos de estado), Acciones (Cambiar estado, Eliminar).
    - Botón de "Cargar Ejemplo Metodológico HMW" y empty state contextual.
  - **Controlador en `js/app.js` (`initDefinicionDesafioView()`):**
    - Lógica de sincronización Mad-libs, filtrado por proyecto activo, cambio de estado y navegación a Fase 3 (`../fase3/07-lluvia-ideas.html`).
- **VERIFY:**
  - Interactuar con el Mad-libs, registrar el desafío, constatar que la tabla lo muestre con su estado y que se pueda cambiar a "Aprobado UPP".

---

### Tarea 2.5: Verificación de Trazabilidad, Gobernanza y Transición a Fase 3 (Idear)
- **Agente:** `orchestrator` / `project-planner` | **Skills:** `verify-changes`, `clean-code`
- **Prioridad:** P2
- **Dependencias:** Tareas 2.2, 2.3, 2.4
- **INPUT:**
  - Vistas completas de Fase 2 (`fase2/04-ficha-persona.html`, `fase2/05-grupos-focales.html`, `fase2/06-definicion-desafio.html`).
  - Script de navegación en `js/layout.js`.
- **OUTPUT:**
  - Verificación del cálculo de avance de Fase 2 en el Dashboard y Sidebar:
    - Cuando H04, H05 y H06 tienen registros válidos, la Fase 2 se marca como activa/completada y habilita formalmente el acceso a la Fase 3: Idear (`07-lluvia-ideas.html`).
  - Validación sintáctica completa con Node.js (`node -c`).
  - Verificación de la regla de diseño **Purple Ban** en todas las vistas de Fase 2.
- **VERIFY:**
  - Recorrer el flujo de Fase 2 completo en navegador o script de validación, cambiando entre iniciativas (ej. IN0001 e IN0002) y confirmando el aislamiento multitenant y la navegación continua.

---

## 7. Phase X: Verificación y Calidad (Checklist Obligatorio)

| Verificación | Herramienta / Método | Criterio de Aceptación |
| :--- | :--- | :--- |
| **Alineación de Esquemas** | Comparación contra `h04`, `h05`, `h06` JSON | Cumplimiento del 100% de los campos y tipos definidos en `Document/propuesta_esquema_json/` |
| **Aislamiento Multitenant** | Switcher de proyecto en Sidebar | Los arquetipos, insights y desafíos de `IN0001` no se mezclan con `IN0002` a `IN0013` |
| **Fórmula Metodológica HMW** | Asistente Mad-libs en H06 | Toda pregunta HMW comienza con "¿Cómo podríamos...?" y articula Usuario, Objetivo y Obstáculo |
| **Purple Ban (Prohibición)** | Auditoría de clases CSS | Cero tonos violeta/púrpura; uso exclusivo de esmeralda, pizarra, ámbar y azul institucional |
| **Interoperabilidad H05 → H06** | Selector de Insight en H06 | El dropdown de H06 se puebla exclusivamente con los insights del proyecto activo provenientes de H05 |
| **Integridad de Datos Semilla** | Migración en `database.js` | `_schemaVersion: 7` se ejecuta sin alterar datos históricos ni romper compatibilidad |
| **Validación Sintáctica** | `node -c js/database.js js/app.js data/seed.js` | Cero errores de sintaxis |
