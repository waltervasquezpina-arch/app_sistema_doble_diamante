# 1. Objetivo y Metodología (PIIP - AGROIDEAS)

## 1.1 Objetivo del Proyecto

El aplicativo web **Prototipo PIIP (Portafolio Institucional de Innovación Pública)** ha sido diseñado como la infraestructura digital que soporta la gestión, formulación, seguimiento y trazabilidad de las iniciativas de innovación pública en **AGROIDEAS** (MIDAGRI), en conformidad con la Norma Técnica de Gestión de la Innovación Pública (**NT-GIP N° 003-2025-PCM-SGP**).

Su propósito principal es estandarizar y facilitar el registro estructurado, análisis colaborativo y desarrollo iterativo de soluciones centradas en el usuario (productores agrarios, cooperativas y servidores de AGROIDEAS), garantizando que los equipos formuladores no omitan etapas críticas en la construcción de valor público.

### Objetivos Específicos
1. **Centralización del Portafolio Institucional:** Disponer de un repositorio unificado (Dashboard Principal en `index.html`) con 13 iniciativas institucionales oficiales precargadas (`PIIP-2026-IN0001` a `PIIP-2026-IN0013`), permitiendo el monitoreo del estado y nivel de madurez metodológica de cada una.
2. **Estandarización Metodológica Guíada:** Conducir a los equipos a través de las 4 fases secuenciales del marco **Doble Diamante**, implementando 11 herramientas estructuradas distribuidas en submódulos especializados.
3. **Trazabilidad y Evidencia Integral:** Interconectar observaciones de campo, mapas de empatía, perfiles de usuario, desafíos, ideas priorizadas, prototipos y matrices de riesgo bajo un identificador común de iniciativa (`projectId` / `projectCode`).
4. **Demostración y Validación Inmediata (Local-First):** Facilitar la evaluación funcional y pedagógica mediante persistencia en el navegador (`localStorage`) y botones de precarga contextual que alimentan cada herramienta con datos reales de la iniciativa activa.

---

## 1.2 Base Metodológica: El Doble Diamante

El sistema digitaliza el marco de trabajo del **Doble Diamante** (Design Council), estructurando el flujo en dos grandes áreas: el **Área del Problema** (Fases 1 y 2) y el **Área de la Solución** (Fases 3 y 4).

### 🔷 Fase 1: Descubrir (Pensamiento Divergente - Área del Problema)
* **Objetivo:** Exploración profunda del contexto, inmersión en campo y recolección de evidencia empírica con productores agrarios y colaboradores.
* **Herramientas Implementadas en la estructura del proyecto:**
  * **H01. Observación (Método AEIOU)** (`fase1/01-observacion.html`): Registro cualitativo de Actividades, Entornos, Interacciones, Objetos y Usuarios.
  * **H02. Mapa de Empatía** (`fase1/02-mapa-empatia.html`): Matriz de 6 cuadrantes (¿Qué piensa y siente?, ¿Qué oye?, ¿Qué ve?, ¿Qué dice y hace?, Dolores/Frustraciones y Alegrías/Motivaciones).
  * **H03. Encuestas de Campo** (`fase1/03-encuestas.html`): Formulario estructurado para registro de muestras, segmentos, canales y nivel de satisfacción de beneficiarios.

### 🔷 Fase 2: Definir (Pensamiento Convergente - Área del Problema)
* **Objetivo:** Sintetizar la evidencia recopilada, identificar arquetipos de usuario y formular desafíos concretos de innovación accionables.
* **Herramientas Implementadas en la estructura del proyecto:**
  * **H04. Ficha de Persona / Arquetipos** (`fase2/04-ficha-persona.html`): Modelado de perfiles arquetípicos (demografía, objetivos, puntos de dolor y comportamientos clave).
  * **H05. Muro de Hallazgos / Grupos Focales** (`fase2/05-grupos-focales.html` y `fase2/05-muro-hallazgos.html`): Pizarra visual tipo Kanban para consolidar citas, patrones e insights cualitativos de investigación.
  * **H06. Definición del Desafío de Innovación** (`fase2/06-definicion-desafio.html`): Formulación estructurada de preguntas detonadoras bajo la fórmula *How Might We* ("¿Cómo podríamos...?"), asistida por un generador Mad-Libs integrado.

### 🔶 Fase 3: Idear (Pensamiento Divergente - Área de la Solución)
* **Objetivo:** Co-creación masiva de alternativas de solución, selección sistemática multicriterio y representación rápida.
* **Herramientas Implementadas en la estructura del proyecto:**
  * **H07. Lluvia de Ideas y Dinámica Crazy 8's** (`fase3/07-lluvia-ideas.html`): Captura ágil de propuestas con temporizador de 8 minutos integrado y sistema de votación rápida.
  * **H08. Matriz de Priorización de Ideas** (`fase3/08-matriz-priorizacion.html`): Algoritmo de ponderación en tiempo real evaluando Impacto, Viabilidad, Factibilidad e Innovación (escala 1 a 5) con selección de idea ganadora.
  * **H09. Prototipado Rápido y Storyboard** (`fase3/09-prototipado-rapido.html`): Registro de bocetos, flujos y maquetas visuales, complementado con un simulador de Asistente IA (Gemini) para generación de descripciones y escenas.

### 🔶 Fase 4: Entregar (Pensamiento Convergente - Área de la Solución)
* **Objetivo:** Planificación operativa, experimentación y mitigación de incertidumbres para la transferencia e implementación.
* **Herramientas Implementadas en la estructura del proyecto:**
  * **H10. Plan de Acción y Roadmap** (`fase4/10-plan-accion.html`): Planificador de hitos, responsables institucionales, fechas límite y semáforo de estado (Pendiente, En curso, Completado).
  * **H11. Matriz de Gestión de Riesgos y Testeo** (`fase4/11-matriz-riesgos.html`): Matriz de probabilidad vs. impacto con cálculo automático de severidad (Alto, Medio, Bajo), estrategias de mitigación y resultados de validación.

---

## 1.3 Ciclo de Vida y Experiencia de Usuario en el Aplicativo

1. **Exploración del Portafolio (`index.html`):** El usuario visualiza la tabla dinámica de 13 iniciativas oficiales con semáforos de avance en cada fase del Doble Diamante (D1, D2, I3, E4).
2. **Selección del "Proyecto Activo":** Al hacer clic en el botón **"Trabajar"** de una fila, el sistema almacena su identificador en `localStorage` (`active_project_id`). El Sidebar global y el Breadcrumb superior actualizan de inmediato el nombre y código de la iniciativa seleccionada.
3. **Navegación Modular Guiada:** El usuario recorre las 11 herramientas a través del menú lateral persistente. Cada página filtra automáticamente la información para mostrar únicamente los registros asociados al proyecto activo.
4. **Autocompletado Contextual:** En cada herramienta, el usuario puede presionar **"Precargar Ejemplo"** para cargar instantáneamente datos institucionales reales asociados a ese proyecto específico, facilitando la evaluación y comprensión del método.
5. **Consulta Consolidada (Ficha de Proyecto):** Desde el Dashboard, el botón **"Ficha"** despliega un modal interactivo con 5 pestañas temáticas (General, Descubrir, Definir, Idear, Entregar) que consolida toda la información recopilada a lo largo del proceso.
