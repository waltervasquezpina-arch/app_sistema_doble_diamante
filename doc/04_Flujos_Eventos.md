# 4. Flujos de Trabajo y Eventos del Sistema

Este documento describe la interacción y el ciclo de vida de los eventos dentro del DOM y su respectivo procesamiento por la capa lógica en `app.js`.

## 4.1 Secuencia de Arranque (Bootstrapping)

1.  **Carga del DOM (`DOMContentLoaded` o Carga Asíncrona):** El navegador comienza a renderizar el HTML.
2.  **Inyección del Sidebar (`js/layout.js`):** El script busca la etiqueta `<main>` y antepone la estructura HTML (`<aside>`) de la navegación global. Simultáneamente, activa la clase CSS `bg-slate-800` en el enlace que hace match con el `window.location.pathname`.
3.  **Seed Data Evaluation (`data/seed.js`):** Se ejecuta el archivo semilla. Si el arreglo de proyectos está vacío, inserta registros por defecto para poblar los DataTables de demostración.
4.  **Carga de Controlador Maestro (`js/app.js`):**
    *   Se inician las instancias de DataTables (ej. `projectsTable = $('#projectsTable').DataTable(...)`).
    *   DataTables hace la petición a la capa de abstracción (`database.js`) mediante funciones como `obtenerProyectos()`.
    *   Se suscriben los Event Listeners para clicks y submits.

## 4.2 Flujo Principal: Selección de Proyecto Activo

**Problema a resolver:** El usuario necesita interactuar con herramientas específicas (ej. Plan de Acción) pero el sistema necesita saber a qué proyecto asignar esos nuevos registros.

**Secuencia de Eventos:**
1.  El usuario navega a la raíz (`index.html`).
2.  En el DataTable del Portafolio Institucional, el usuario hace click en el botón "Trabajar" de una fila específica.
3.  *Trigger:* `$('#projectsTable').on('click', '.btn-select-project', ...)` captura el evento.
4.  El controlador extrae el atributo `data-id` del botón.
5.  *Acción Lógica:* Se invoca `establecerProyectoActivoId(id)` la cual guarda el ID en el `localStorage` (Clave: `active_project_id`).
6.  *Re-renderizado:* El Sidebar visual se actualiza para mostrar un Badge verde con el nombre del Proyecto Activo. Se deshabilitan los botones "Trabajar" del proyecto ya activo en la tabla para prevenir redundancia.

## 4.3 Flujo Secundario: Vista Consolidada (Ficha de Proyecto)

Este flujo se ejecuta para visualizar un resumen panorámico de un proyecto.

**Secuencia de Eventos:**
1.  Click en el botón "Ficha" de la tabla del portafolio.
2.  *Acción Lógica:* El sistema invoca `mostrarFichaProyecto(projectId)`.
3.  La función hace un "Fetch" de toda la información (Proyectos, Observaciones, Arquetipos, Desafíos, etc.) relacionados a ese `projectId`.
4.  Se inyectan dinámicamente datos textuales (mediante `.textContent` o `.innerHTML` según corresponda por seguridad XSS) en los contenedores con ID específicos del Modal (ej. `#modalProjectTitle`, `#modalInfoStatus`).
5.  Se calcula algorítmicamente la fase activa (inspeccionando el objeto `project.phases`).
6.  *Manipulación DOM:* Se quita la clase `hidden` al contenedor `#projectModal`.

**Manejo de Pestañas (Tabs) dentro del Modal:**
*   Se basan en delegación de eventos simples en jQuery (`$('.modal-tab').on('click')`).
*   Alterna clases de CSS visuales (`active border-b-2`) entre el botón seleccionado y los inactivos.
*   Alterna clases de visibilidad (`block` vs `hidden`) usando el prefijo `tabContent-` concatenado con el atributo `data-tab` del botón.

## 4.4 Flujo Terciario: Inserción de Datos en Módulo de Herramienta

(Ejemplo usando el módulo **Matriz de Riesgos**).

1.  El usuario navega hacia `11-matriz-riesgos.html`.
2.  Al inicializar el módulo en `app.js`, el DataTable invoca `obtenerRiesgos().filter(r => r.projectId === obtenerProyectoActivoId())`.
    *   *Comportamiento Clave:* La tabla *solo* renderiza los riesgos pertenecientes al proyecto actual, ocultando el ruido de otros proyectos.
3.  El usuario llena el formulario HTML nativo (`#form-risk`) y hace click en "Guardar Riesgo".
4.  *Trigger:* `document.getElementById('form-risk').addEventListener('submit', ...)`
5.  Se previene el evento natural de recarga (`e.preventDefault()`).
6.  Se construye el Payload (JSON) extrayendo el `.value` de los inputs. **Crucial:** Se inserta forzosamente la propiedad `projectId: obtenerProyectoActivoId()`.
7.  Se invoca `guardarRiesgo(payload)`. La capa de abstracción muta el `localStorage`.
8.  *Re-renderizado:* Se invoca `risksTable.clear().rows.add(...).draw(false)` para actualizar visualmente la tabla sin perder la paginación actual. El formulario se limpia vía `form.reset()`.
