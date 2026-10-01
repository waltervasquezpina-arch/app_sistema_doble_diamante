# Plan de Implementación: Fase 3 - Idear (Herramientas H07, H08, H09)

## 1. Overview (Contexto y Propósito)
Este plan define las tareas técnicas, metodológicas y de interfaz para alinear los formularios, vistas y persistencia de la **Fase 3: Idear** del aplicativo **AGROIDEAS-PIIP** con la especificación técnica unificada `far-piip-v3.json` (documentada en `Document/propuesta_esquema_json/`).

Tras haber completado las fases de investigación y definición:
- **Fase 1 (Descubrir):** Análisis del Problema (H01), Mapeo de Actores (H02) y Entrevistas/Encuestas (H03).
- **Fase 2 (Definir):** Arquetipos de Persona (H04), Muro de Hallazgos/Insights (H05) y Desafíos HMW aprobados (H06).

La **Fase 3: Idear** representa el segundo diamante del proceso de innovación (Divergencia creativa → Convergencia evaluativa → Materialización rápida), estructurada en:
1. **H07: Lluvia de Ideas y Crazy 8's (`07-lluvia-ideas.html`):** Divergencia guiada por los desafíos HMW de la iniciativa, generación de propuestas clasificadas en 4 categorías institucionales y votación silenciosa (Dot-Voting) con acumulación de votos.
2. **H08: Matriz de Priorización de Ideas (`08-matriz-priorizacion.html`):** Evaluación multicriterio convergente de las ideas de H07 bajo 4 dimensiones formales (Deseabilidad de usuarios, Factibilidad técnica OTI, Viabilidad legal/presupuestal UAJ/UPP e Impacto en valor público), cálculo automático de puntaje total (4 a 20) y selección de la "Idea Ganadora" que pasará a prototipado.
3. **H09: Prototipado Rápido y Storyboarding (`09-prototipado-rapido.html`):** Materialización de la solución priorizada en arquetipos de prototipo (Digital PWA, Físico / Papel, Guion / Storyboard, Simulación de Servicio), definición de características clave a probar, métrica/criterio de éxito de campo (`testingGoal`) y co-creación asistida por el Consultor de IA Gemini.

Actualmente, las vistas de Fase 3 presentan inconsistencias con los esquemas normativos (`h07_lluvia_ideas_crazy8.json`, `h08_matriz_priorizacion.json`, `h09_prototipado_rapido.json`), no cuentan con banner de iniciativa activa con selector de proyecto, no tienen mecanismo de Dot-voting interactivo en H07, la matriz H08 no vincula las ideas de H07 ni utiliza las dimensiones formales SGP/AGROIDEAS, y H09 no desglosa el tipo formal de prototipo ni el criterio de éxito del testeo.

---

## 2. Project Type
- **Tipo:** `WEB` (Multi-Page Application Local-First con HTML5 Semántico, Tailwind CSS, Vanilla JS y persistencia en LocalStorage).
- **Agente Principal:** `project-planner` (Planificación y gobernanza), `frontend-specialist` (Diseño UI/UX interactivo) y `backend-specialist` (Modelos de datos, CRUD y migraciones de semillas).

---

## 3. Success Criteria (Criterios de Éxito Medibles)
- [x] **Alineación Normativa al 100%:** Cumplimiento estricto de los campos y tipos definidos en `h07_lluvia_ideas_crazy8.json`, `h08_matriz_priorizacion.json` y `h09_prototipado_rapido.json`.
- [x] **Aislamiento Multitenant Estricto (`projectCode` / `projectId`):** Ideas de lluvia de ideas, matrices de priorización y prototipos se asocian y filtran estrictamente por la iniciativa activa (`PIIP-2026-IN0001` a `IN0013`).
- [x] **Trazabilidad Inter-herramientas (H06 → H07 → H08 → H09):**
  - H07 carga y asocia las propuestas a los desafíos HMW registrados en H06.
  - H08 permite evaluar ideas directamente originadas en H07.
  - H09 resalta y vincula el prototipo a la "Idea Ganadora" seleccionada en H08.
- [x] **Votación Silenciosa / Dot-Voting en H07:** Cada tarjeta de idea en el tablero Kanban por categorías cuenta con botón interactivo de votación (`+1 Voto`) que actualiza reactivamente el campo `votesCount` en el LocalStorage y en la interfaz.
- [x] **Evaluación Multicriterio Dinámica en H08:**
  - 4 dimensiones normativas valoradas de 1 a 5: `desirability` (Deseabilidad), `feasibility` (Factibilidad OTI), `viability` (Viabilidad UAJ/UPP) e `impact` (Impacto).
  - Cálculo instantáneo del `totalScore` (4 a 20) al mover sliders/inputs.
  - Tabla DataTable con ordenamiento descendente y toggle para marcar la "Idea Ganadora" (`isWinningIdea`) con insignia destacada.
- [x] **Galería Enriquecida de Prototipos en H09:**
  - Desglose de `prototypeTitle`, `prototypeType` (Digital PWA, Físico / Papel, Guion / Storyboard, Simulación de Servicio), `keyFeatures` (etiquetas visuales), `artifactUrlOrImage` y `testingGoal` (criterio de validación).
  - Asistente de IA Gemini con prompt enriquecido con el contexto de la iniciativa y la solución evaluada.
- [x] **Empty States y Precarga Metodológica Grounded:** Cada una de las 3 herramientas cuenta con botón "Cargar Ejemplo Metodológico" que inyecta datos contextualizados según la iniciativa seleccionada.
- [x] **Banners de Iniciativa Activa y Navegación Secuencial:** Encabezados unificados con código de proyecto, unidad ejecutora y estado, más botones footer: `H06` → `H07` → `H08` → `H09` → `H10 (Fase 4: Entregar)`.
- [x] **Cumplimiento del Purple Ban:** Cero tonos morados/violetas; empleo estricto de colores institucionales (esmeralda, pizarra, ámbar, azul técnico, sky).

---

## 4. Tech Stack & Dependencias
- **Estructura:** HTML5 Semántico (formularios modulares, tableros Kanban, tablas de puntuación y galerías de tarjetas).
- **Estilos:** Tailwind CSS + `css/style.css` (clases reutilizables `.card`, `.btn`, badges semánticos, sin frameworks pesados adicionales).
- **Lógica & Persistencia:** Vanilla JS ES6+:
  - `data/seed.js`: Incremento a `_schemaVersion: 8`, enriquecimiento de `brainstorming`, `ideas` y `prototypes` con `projectCode` y estructura oficial.
  - `js/database.js`: Migración v8 no destructiva, métodos CRUD y de votación/priorización con aislamiento multitenant.
  - `js/app.js`: Controladores `initLluviaIdeasView()`, `initMatrizPriorizacionView()` e `initPrototipadoRapidoView()`.
  - `js/layout.js`: Inyección de sidebar, selector de iniciativas activas y breadcrumb metodológico.
- **Librerías Externas:** jQuery 3.7.0, DataTables.js (ordenamiento automático en H08) y Lucide Icons.

---

## 5. File Structure (Archivos Afectados en Fase 3)
```
App_Sistema_Doble_Diamante/
├── data/
│   └── seed.js                                    # Semillas de Brainstorming (H07), Ideas evaluadas (H08) y Prototipos (H09)
├── js/
│   ├── database.js                                # Métodos CRUD, votación (H07), ganador (H08) y precarga para Fase 3
│   └── app.js                                     # Controladores de UI, Dot-voting, cálculo de scores y galería de maquetas
├── fase3/
│   ├── 07-lluvia-ideas.html                       # Banner activo + Tablero 4 categorías + Dot-Voting + Crazy 8's
│   ├── 08-matriz-priorizacion.html                # Banner activo + 4 criterios 1-5 + Score dinámico + Idea ganadora + DataTable
│   └── 09-prototipado-rapido.html                 # Banner activo + Tipos de prototipo + Criterio testeo + Galería + IA Gemini
└── Document/
    └── propuesta_esquema_json/                    # Referencia formal: h07, h08, h09 y far-piip-v3.json
```

---

## 6. Task Breakdown (Lista de Tareas Detallada)

### Tarea 3.1: Modelos de Datos, Métodos CRUD y Semillas en `database.js` y `seed.js`
- **Agente:** `backend-specialist` | **Skills:** `clean-code`, `database-design`
- **Prioridad:** P0 (Bloqueante)
- **Dependencias:** Ninguna
- **INPUT:**
  - Esquemas JSON: `Document/propuesta_esquema_json/h07_lluvia_ideas_crazy8.json`, `h08_matriz_priorizacion.json`, `h09_prototipado_rapido.json`.
  - Archivos base: `data/seed.js` y `js/database.js`.
- **OUTPUT:**
  - **`data/seed.js`:**
    - Incrementar `_schemaVersion` a `8`.
    - Normalizar array `brainstorming` (H07):
      - Campos: `id`, `projectCode`, `desafioId`, `ideaTitle` (con fallback `idea`), `description`, `category` (`Tecnológica`, `Procesos / Gestión`, `Normativa`, `Capacitación`), `authorRole`, `votesCount`.
    - Normalizar array `ideas` (H08):
      - Campos: `id`, `projectCode`, `ideaId`, `ideaTitle` (fallback `title`), `desirability` (1-5), `feasibility` (1-5), `viability` (1-5), `impact` (1-5), `totalScore` (suma calculada 4-20), `isWinningIdea` (booleano).
    - Normalizar array `prototypes` (H09):
      - Campos: `id`, `projectCode`, `prototypeTitle` (fallback `name`), `prototypeType` (`Digital PWA`, `Físico / Papel`, `Guion / Storyboard`, `Simulación de Servicio`), `keyFeatures` (array de strings), `artifactUrlOrImage` (fallback `imageUrl`), `testingGoal`, `description`.
  - **`js/database.js`:**
    - Migración v8 no destructiva en `initDatabase()`.
    - `obtenerBrainstormings(projectFilter = 'active')`, `guardarBrainstorming(idea)`, `votarBrainstorming(id)`, `eliminarBrainstorming(id)`, `precargarEjemploBrainstorming(projectIdentifier)`.
    - `obtenerIdeas(projectFilter = 'active')`, `guardarIdea(idea)`, `marcarIdeaGanadora(id)`, `eliminarIdea(id)`, `precargarEjemploMatriz(projectIdentifier)`.
    - `obtenerPrototipos(projectFilter = 'active')`, `guardarPrototipo(prototipo)`, `eliminarPrototipo(id)`, `precargarEjemploPrototipos(projectIdentifier)`.
- **VERIFY:**
  - Script en Node.js validando que `obtenerBrainstormings()`, `votarBrainstorming()`, `obtenerIdeas()`, `marcarIdeaGanadora()` y `obtenerPrototipos()` operen correctamente y aíslen los datos por `projectCode`.

---

### Tarea 3.2: Intervención de Vista y Tablero H07: `fase3/07-lluvia-ideas.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 3.1
- **INPUT:**
  - Archivo `fase3/07-lluvia-ideas.html`.
  - Especificación `h07_lluvia_ideas_crazy8.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Código y nombre de la iniciativa seleccionada, con botón para precargar ideas de ejemplo y chip del Desafío HMW rector.
  - **Formulario de Ideación H07:**
    - Selector dinámico de Desafío HMW (poblado con los desafíos de H06 del proyecto activo).
    - `ideaTitle`: Título conciso del concepto de solución.
    - `description`: Descripción breve de la mecánica de la solución.
    - `category`: Selector con las 4 categorías normalizadas (`Tecnológica`, `Procesos / Gestión`, `Normativa`, `Capacitación`).
    - `authorRole`: Rol o autor que propone la idea (e.g. "Especialista UPDC", "Especialista Zonal", "Productor Líder").
  - **Tablero de Cocreación (Kanban por Categorías):**
    - 4 columnas con cabeceras estilizadas:
      - 🔵 Tecnológica (Azul técnico)
      - 🟢 Procesos / Gestión (Esmeralda)
      - 🟠 Normativa (Ámbar)
      - 🩵 Capacitación (Sky/Cyan)
    - Tarjetas de ideas con:
      - Título en negrita y descripción.
      - Rol de autoría e indicación del Desafío HMW asociado.
      - Botón interactivo de **Dot-Voting** (`+1 Voto`) con contador visible de votos (`votesCount`).
      - Botón discreto para eliminar idea.
  - **Asistente Crazy 8's (Módulo de Dinámica Rápida):**
    - Sección desplegable / modal con instrucciones para la técnica de 8 ideas en 8 minutos con temporizador visual de apoyo.
  - **Controlador en `js/app.js` (`initLluviaIdeasView()`):**
    - Renderizado del tablero filtrado por proyecto, sincronización del dropdown HMW, gestión de votos y navegación: Volver a H06 (`../fase2/06-definicion-desafio.html`) y Avanzar a H08 (`08-matriz-priorizacion.html`).
- **VERIFY:**
  - Abrir `fase3/07-lluvia-ideas.html`, registrar una idea, votar por ella constatando que suba el contador de votos, cambiar de iniciativa y comprobar que no se mezclen las ideas.

---

### Tarea 3.3: Intervención de Vista y Matriz H08: `fase3/08-matriz-priorizacion.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tareas 3.1, 3.2
- **INPUT:**
  - Archivo `fase3/08-matriz-priorizacion.html`.
  - Especificación `h08_matriz_priorizacion.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Indicador del proyecto en evaluación, contador de ideas calificadas y botón de precarga.
  - **Formulario de Calificación Multicriterio:**
    - Selector dinámico de ideas originadas en H07 (con opción alternativa de ingresar título manual).
    - 4 dimensiones metodológicas evaluadas del 1 al 5:
      - `desirability` (Deseabilidad - Usuarios / Productores)
      - `feasibility` (Factibilidad Técnica - OTI)
      - `viability` (Viabilidad Legal y Presupuestal - UAJ/UPP)
      - `impact` (Impacto en Valor Público)
    - Indicador reactivo del `totalScore` calculado en tiempo real (de 4 a 20 puntos) con etiqueta de nivel (Prioridad Alta: 16-20, Media: 11-15, Baja: ≤10).
    - Checkbox/Switch para marcar si es seleccionada como la "Idea Ganadora" (`isWinningIdea`).
  - **Tabla DataTable de Clasificación y Ranking:**
    - Columnas: Título de la Idea, Deseabilidad (1-5), Factibilidad (1-5), Viabilidad (1-5), Impacto (1-5), Total Score (destacado), Estado Ganadora (Badge esmeralda con icono de corona/trofeo), Acciones (Marcar Ganadora, Eliminar).
    - Ordenamiento automático por defecto por `totalScore` descendente.
  - **Podio de la Solución Ganadora:**
    - Panel destacado superior que muestra la solución ganadora seleccionada con enlace directo a H09 para comenzar su prototipado.
  - **Controlador en `js/app.js` (`initMatrizPriorizacionView()`):**
    - Sincronización del selector de ideas de H07, cálculo automático del score, persistencia y navegación a H09 (`09-prototipado-rapido.html`).
- **VERIFY:**
  - Calificar 2 ideas en `08-matriz-priorizacion.html`, verificar que la tabla las ordene por score total, marcar una como idea ganadora y constatar que se actualice el podio.

---

### Tarea 3.4: Intervención de Vista y Galería H09: `fase3/09-prototipado-rapido.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tareas 3.1, 3.3
- **INPUT:**
  - Archivo `fase3/09-prototipado-rapido.html`.
  - Especificación `h09_prototipado_rapido.json`.
- **OUTPUT:**
  - **Banner de Iniciativa Activa:** Indicador del proyecto, banner con la Idea Ganadora transferida desde H08 y botón de precarga metodológica.
  - **Formulario de Prototipado H09:**
    - `prototypeTitle`: Nombre del Prototipo / Maqueta.
    - `prototypeType`: Selector de formato (`Digital PWA`, `Físico / Papel`, `Guion / Storyboard`, `Simulación de Servicio`).
    - `keyFeatures`: Entrada de características clave a probar (ingreso separado por comas o tags).
    - `artifactUrlOrImage`: Enlace a Figma, Canva o URL de imagen de la maqueta (con soporte de preview).
    - `testingGoal`: Métrica o criterio de éxito del testeo en campo (e.g. "El 80% de usuarios completa la tarea en <3 min").
    - `description`: Descripción del flujo o interacción.
  - **Galería de Prototipos Interactiva:**
    - Tarjetas de diseño premium con:
      - Imagen de maqueta con fallback visual SVG si no carga.
      - Badge con el `prototypeType`.
      - Título y descripción del flujo.
      - Tags de `keyFeatures`.
      - Caja destacada con la métrica `testingGoal` en fondo esmeralda tenue.
      - Botones para abrir maqueta externa, consultar con la IA o eliminar prototipo.
  - **Asistente de IA Gemini Contextual:**
    - Mantiene el módulo existente para consultar a Gemini, alimentando el prompt automáticamente con el contexto de la iniciativa activa, la idea ganadora de H08 y los prototipos registrados.
  - **Navegación Secuencial:** Volver a H08 (`08-matriz-priorizacion.html`) y Avanzar formalmente a la Fase 4: Entregar (`../fase4/10-plan-accion.html`).
- **VERIFY:**
  - Registrar un prototipo en `09-prototipado-rapido.html`, verificar la visualización correcta de los tags de features y la métrica de éxito, probar el fallback de imagen y la vinculación con la iniciativa activa.

---

### Tarea 3.5: Verificación Integral, Trazabilidad Metodológica y Transición a Fase 4
- **Agente:** `orchestrator` / `project-planner` | **Skills:** `verify-changes`, `clean-code`
- **Prioridad:** P2
- **Dependencias:** Tareas 3.1 a 3.4
- **INPUT:**
  - Vistas completas de Fase 3: `fase3/07-lluvia-ideas.html`, `fase3/08-matriz-priorizacion.html`, `fase3/09-prototipado-rapido.html`.
  - `data/seed.js`, `js/database.js`, `js/app.js`.
- **OUTPUT:**
  - Script automatizado de pruebas en Node.js validando:
    1. Aislamiento por `projectCode` en las 3 herramientas.
    2. Incremento correcto de votos en H07.
    3. Cálculo y ordenamiento de scores en H08.
    4. Persistencia de prototipos y criterio de testeo en H09.
  - Comprobación del cálculo de avance de Fase 3 en el layout y sidebar.
  - Verificación estricta de cero clases violeta/morado (**Purple Ban**).
  - Verificación de sintaxis de todos los archivos JS (`node -c`).
- **VERIFY:**
  - Ejecutar script de verificación de Fase 3 con salida 100% exitosa.

---

## 7. Phase X: Verificación y Calidad (Checklist Obligatorio)

| Verificación | Herramienta / Método | Criterio de Aceptación |
| :--- | :--- | :--- |
| **Alineación Normativa** | Comparación contra esquemas JSON | Cumplimiento del 100% de los campos de `h07`, `h08` y `h09` |
| **Aislamiento Multitenant** | Selector de proyectos en Sidebar | Datos de `IN0001` no se mezclan con `IN0002` a `IN0013` |
| **Dot-Voting en H07** | Interacción en Tablero Kanban | Cada clic en "+1 Voto" incrementa `votesCount` y persiste en LocalStorage |
| **Cálculo Multicriterio H08** | Sliders/Inputs en H08 | `totalScore` calcula la suma (4-20) y DataTables ordena descendentemente |
| **Selección Idea Ganadora** | Toggle en H08 | Se marca `isWinningIdea: true`, se muestra la corona y se transmite conceptualmente a H09 |
| **Criterio de Testeo en H09** | Formulario y Tarjetas H09 | Cada prototipo incluye obligatoriamente `testingGoal` y tipo de prototipo formal |
| **Purple Ban (Prohibición)** | Auditoría de código CSS/HTML | Cero clases moradas/púrpuras; uso de esmeralda, pizarra, ámbar y azul técnico |
| **Integridad de Migración** | Carga de `database.js` | `_schemaVersion: 8` migra datos sin pérdida de información histórica |
| **Validación de Sintaxis** | `node -c js/database.js js/app.js data/seed.js` | Cero errores de sintaxis en consola |
