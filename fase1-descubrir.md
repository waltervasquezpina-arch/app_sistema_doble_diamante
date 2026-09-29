# Plan de Implementación: Fase 1 - Descubrir (Herramientas H01, H02, H03)

## 1. Overview (Contexto y Propósito)
Este plan define las tareas técnicas y metodológicas para alinear los campos, formularios y almacenamiento de la **Fase 1: Descubrir** del aplicativo **AGROIDEAS-PIIP** con la especificación técnica del esquema unificado `far-piip-v3.json` (documentado en `Document/propuesta_esquema_json/`).

Actualmente, las vistas de Fase 1 (`01-observacion.html`, `02-mapa-empatia.html`, `03-encuestas.html`) presentan discrepancias con el contrato formal:
1. **Falta de vinculación estricta por proyecto (`projectCode` / `projectId`):** Algunas herramientas guardan datos globales sin vincular al proyecto activo seleccionado en el Sidebar.
2. **Campos incompletos frente al esquema JSON:** Faltan metadatos clave como `observer`, `observationDate`, `sampleSize`, y la estructura formal de cuadrantes y resultados clave.
3. **Ausencia de vistas tabulares/listado de registros históricos:** En herramientas como `01-observacion.html`, el usuario registra pero no visualiza el histórico de hallazgos AEIOU de su iniciativa.
4. **Desconexión con `StorageService` y `far-piip-v3.json`:** Se requiere estandarizar el guardado Local-First y la carga de datos semilla contextualizados a los 13 proyectos oficiales (IN0001 a IN0013).

Este plan aborda la intervención integral de la Fase 1, sentando las bases de arquitectura reutilizable para las Fases 2, 3 y 4.

---

## 2. Project Type
- **Tipo:** `WEB` (Progressive Web Application / Multi-Page Application Local-First con HTML5, Tailwind CSS, Vanilla JS y LocalStorage).
- **Agente Principal:** `frontend-specialist` (UI/UX y formularios) coordinado con `backend-specialist` (arquitectura de datos y contratos JSON en `StorageService` / `database.js`).

---

## 3. Success Criteria (Criterios de Éxito Medibles)
- [x] **Alineación de Campos (100%):** Cada formulario de Fase 1 cuenta con todos los atributos requeridos por `h01_observacion_aeiou.json`, `h02_mapa_empatia.json` y `h03_encuestas_campo.json`.
- [x] **Filtrado Multitenant por Proyecto:** Al cambiar de proyecto activo en el portafolio, las 3 herramientas cargan exclusivamente los datos correspondientes a dicho `projectCode`.
- [x] **Visualización de Registros:** `01-observacion.html` y `03-encuestas.html` cuentan con tablas dinámicas de registros existentes con opciones de edición/eliminación y exportación de datos.
- [x] **Lienzo Interactivo de Empatía:** `02-mapa-empatia.html` refleja en tiempo real los 6 cuadrantes normativos (`says`, `does`, `thinks`, `feels`, `pains`, `gains`) y permite guardar múltiples arquetipos por iniciativa.
- [x] **Compatibilidad con `seed_panoramico_piip.json`:** Los 13 proyectos precargados muestran sus observaciones y encuestas reales sin errores de consola ni pérdida de reactividad.
- [x] **Cero Violaciones de Diseño:** Cumplimiento de la paleta institucional esmeralda/pizarra sin violeta/púrpura (Purple Ban) y navegación fluida tipo breadcrumb.

---

## 4. Tech Stack & Dependencias
- **HTML5 Semántico:** Formularios accesibles con atributos `id`, `name`, `required`, labels explícitos y textos de ayuda metodológica.
- **CSS / Tailwind CSS (CDN compilado) + Vanilla CSS:** Estilos coherentes con el diseño del sistema (`css/styles.css`).
- **JavaScript ES6+ (Sin frameworks externos pesados):** Módulos nativos desacoplados:
  - `data/seed.js` / `Document/propuesta_esquema_json/seed_panoramico_piip.json` (Fuentes de verdad de datos).
  - `js/database.js` / `StorageService.js` (Capa de persistencia CRUD y cálculo de avance).
  - `js/app.js` (Controladores de eventos de formulario y renderizado DOM).
  - `js/layout.js` (Sidebar, Header con proyecto activo y Breadcrumb).
- **Lucide Icons & DataTables.js:** Iconografía institucional y tablas interactivas con paginación/búsqueda.

---

## 5. File Structure (Archivos Afectados en Fase 1)
```
App_Sistema_Doble_Diamante/
├── data/
│   └── seed.js                                    # Actualización de dataset semilla para H01, H02, H03 alineado a v3
├── js/
│   ├── database.js                                # Métodos CRUD con soporte projectCode y schema v3
│   └── app.js                                     # Controladores de formulario, validaciones y renderizado de tablas
├── fase1/
│   ├── 01-observacion.html                        # Intervención de campos AEIOU + tabla de hallazgos
│   ├── 02-mapa-empatia.html                       # Intervención de cuadrantes + canvas interactivo
│   └── 03-encuestas.html                          # Intervención de preguntas, escala Likert y tabulación
└── Document/
    └── propuesta_esquema_json/                    # Referencia normativa de esquemas y seeds de validación
```

---

## 6. Task Breakdown (Lista de Tareas Detallada)

### Tarea 1.1: Estandarización de Esquema de Datos y Métodos CRUD en `js/database.js`
- **Agente:** `backend-specialist` | **Skills:** `clean-code`, `database-design`
- **Prioridad:** P0 (Bloqueante)
- **Dependencias:** Ninguna
- **INPUT:**
  - Esquemas JSON: `h01_observacion_aeiou.json`, `h02_mapa_empatia.json`, `h03_encuestas_campo.json`.
  - Estructura actual de `js/database.js`.
- **OUTPUT:**
  - Métodos actualizados en `js/database.js`:
    - `obtenerObservacionesAEIOU(projectCode)`: Filtrado estricto por proyecto.
    - `guardarObservacionAEIOU(obs)`: Soporte de campos `projectCode`, `activity`, `environment`, `interaction`, `object`, `user`, `observer`, `observationDate`, `timestamp`.
    - `eliminarObservacionAEIOU(obsId)`: Para gestión del ciclo de vida.
    - `obtenerMapaEmpatia(projectCode)` y `guardarMapaEmpatia(mapa)`: Estructura normalizada de 6 cuadrantes (`userProfile`, `says`, `does`, `thinks`, `feels`, `pains`, `gains`).
    - `obtenerEncuestas(projectCode)` y `guardarEncuesta(encuesta)`: Soporte de campos `respondent`, `cooperative`, `satisfaction`, `comments`, `sentiment`, `keyResults`.
  - Sincronización de semillas en `data/seed.js` para proyectos IN0001 a IN0013.
- **VERIFY:**
  - Ejecutar en consola del navegador o script de prueba y verificar que cada función almacene y recupere objetos válidos vinculados al `projectCode` activo sin contaminar otros proyectos.

---

### Tarea 1.2: Revisión e Intervención de Vista y Formulario H01: `fase1/01-observacion.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 1.1
- **INPUT:**
  - Archivo actual `fase1/01-observacion.html`.
  - Especificación `h01_observacion_aeiou.json`.
- **OUTPUT:**
  - Formulario enriquecido con:
    - Campos de metadatos de campo: `observer` (Observador/Evaluador) y `observationDate` (Fecha de observación).
    - Inputs semánticos para las 5 dimensiones AEIOU con tooltips y placeholders con ejemplos reales de AGROIDEAS.
  - Tabla dinámica interactiva debajo del formulario (`#aeiou-table`):
    - Columnas: Fecha, Observador, Actividades, Entorno, Interacciones, Objetos, Usuarios y Acciones (Editar/Eliminar).
    - Mensaje amigable cuando el proyecto no cuenta con observaciones registradas aún.
    - Contador de observaciones sincronizado en el header.
  - Controlador JS en `js/app.js` (`initObservacionView()`) para carga, guardado, limpieza de formulario y refresco de tabla.
- **VERIFY:**
  - Abrir `fase1/01-observacion.html`, registrar una observación y validar que se visualice inmediatamente en la tabla y se guarde en `LocalStorage` bajo el `projectCode` activo.

---

### Tarea 1.3: Revisión e Intervención de Vista y Formulario H02: `fase1/02-mapa-empatia.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 1.1
- **INPUT:**
  - Archivo actual `fase1/02-mapa-empatia.html`.
  - Especificación `h02_mapa_empatia.json`.
- **OUTPUT:**
  - Formulario estructurado para mapeo empático:
    - Selector/Input de perfil de usuario (`userProfile` / Tipo: Productor, Dirigente OPA, Evaluador, Especialista).
    - Cuadrantes superiores: ¿Qué piensa y siente? (`thinks`, `feels`), ¿Qué ve? (`sees`), ¿Qué oye? (`hears`), ¿Qué dice y hace? (`says`, `does`).
    - Cuadrantes inferiores de dolor y beneficio: Frustraciones/Dolores (`pains`), Deseos/Ganancias (`gains`).
  - Lienzo visual sincronizado:
    - Actualización reactiva de las tarjetas del canvas al editar o guardar.
    - Badges visuales para dolores (fondo ámbar/rojo tenue) y ganancias (fondo esmeralda tenue).
    - Botón para exportar el mapa a JSON o imprimir tarjeta.
  - Controlador JS en `js/app.js` (`initMapaEmpatiaView()`) para carga inicial por proyecto y persistencia reactiva.
- **VERIFY:**
  - Modificar los campos del mapa para `PIIP-2026-IN0001`, guardar, recargar la página y constatar persistencia y reflejo fiel en el lienzo visual.

---

### Tarea 1.4: Revisión e Intervención de Vista y Formulario H03: `fase1/03-encuestas.html`
- **Agente:** `frontend-specialist` | **Skills:** `frontend-design`, `clean-code`
- **Prioridad:** P1
- **Dependencias:** Tarea 1.1
- **INPUT:**
  - Archivo actual `fase1/03-encuestas.html`.
  - Especificación `h03_encuestas_campo.json`.
- **OUTPUT:**
  - Formulario de captura cuantitativa y cualitativa:
    - Datos del informante: Nombre/Código anónimo, Organización Agraria / Cooperativa, Región/Sede.
    - Escala de satisfacción Likert (1 a 5) con indicadores visuales (estrellas o badges con colorimetría accesible).
    - Categorización del hallazgo (Trámites, Conectividad, Asistencia Técnica, Financiamiento).
    - Comentarios y análisis de sentimiento automatizado en tiempo real (Positivo / Neutro / Negativo).
  - Panel analítico y tabla consolidada:
    - Indicadores KPI superiores: Total encuestados (`sampleSize`), Satisfacción promedio (escala 1-5), % Sentimiento Positivo/Negativo.
    - Tabla con DataTables.js filtrable por cooperativa y nivel de satisfacción.
  - Controlador JS en `js/app.js` (`initEncuestasView()`) con cálculo estadístico dinámico.
- **VERIFY:**
  - Agregar una encuesta con texto crítico, verificar que el análisis de sentimiento lo catalogue correctamente y recalcule los KPIs superiores en tiempo real.

---

### Tarea 1.5: Verificación de Trazabilidad, Gobernanza y Transición a Fase 2
- **Agente:** `orchestrator` / `project-planner` | **Skills:** `plan-writing`, `verify-changes`
- **Prioridad:** P2
- **Dependencias:** Tareas 1.2, 1.3, 1.4
- **INPUT:**
  - Vistas completadas de Fase 1.
  - Barra de estado de fases en `js/layout.js`.
- **OUTPUT:**
  - Verificación del cálculo automático de avance de Fase 1 en el Header y Dashboard:
    - Si H01, H02 y H03 tienen datos registrados para el proyecto activo, el badge de `Fase 1: Descubrir` se marca como `Completado` (o listo para Acta de Cierre).
    - Los botones de navegación "Siguiente" en el footer de cada vista conducen secuencialmente: `01-observacion.html` → `02-mapa-empatia.html` → `03-encuestas.html` → `fase2/04-ficha-persona.html`.
  - Documento de lecciones aprendidas y plantilla para la apertura del plan de **Fase 2 (Definir)**.
- **VERIFY:**
  - Navegar secuencialmente por el flujo de Fase 1 con una iniciativa de prueba y verificar el incremento del porcentaje de avance en el encabezado.

---

## 7. Phase X: Verificación y Calidad (Checklist Obligatorio)

| Verificación | Herramienta / Método | Criterio de Aceptación |
| :--- | :--- | :--- |
| **Integridad de Esquemas** | Inspección de `LocalStorage` | Cumple 100% con los campos requeridos en `Document/propuesta_esquema_json/` |
| **Aislamiento Multitenant** | Switcher de proyecto en Sidebar | Los datos de `IN0001` no se mezclan con `IN0002` a `IN0013` |
| **UX & Accesibilidad** | `accessibility_checker.py` / WCAG AA | Contraste adecuado, labels asociados con `for="id"`, navegación por teclado |
| **Purple Ban (Prohibición)** | Revisión visual de estilos | Cero tonos violeta/púrpura; uso exclusivo de la paleta institucional esmeralda/pizarra |
| **Responsive Design** | Pruebas viewport (Mobile / Desktop) | Formularios y tablas operables en 375px, 768px y 1280px |
| **Flujo Continuo** | Botones de navegación footer | Enlaces previos y siguientes funcionando sin rutas rotas |
