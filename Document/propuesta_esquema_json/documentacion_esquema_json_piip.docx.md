**DOCUMENTO TÉCNICO DE ESPECIFICACIÓN DEL ESQUEMA Y ESTRUCTURA DE DATOS JSON**

*Modelo de Datos Unificado, Contrato API y Estructura por Herramientas del Doble Diamante (Esquema far-piip-v3.json) para el Aplicativo AGROIDEAS-PIIP*

| Entidad Gubernamental: | Programa Sectorial de Irrigaciones y Desarrollo Agrario (AGROIDEAS \- MIDAGRI) |
| :---- | :---- |
| **Órganos Responsables:** | Unidad de Planeamiento y Presupuesto (UPP) / Unidad de Administración \- TI |
| **Marco Normativo Base:** | Norma Técnica N.° 003-2025-PCM/SGP (Gestión de la Innovación Pública) |
| **Identificador del Esquema:** | far-piip-v3.json (Versión 3.0 Final Consolidada) |
| **Fecha de Especificación:** | 27 de Septiembre de 2026 |

# **1\. Marco Conceptual y Propósito de la Arquitectura JSON**

El desarrollo del aplicativo web para el Portafolio Institucional de Innovación Pública (AGROIDEAS-PIIP) exige un estándar técnico de persistencia de datos capaz de unificar la información generada en las 13 Fichas de Iniciativas de Innovación Pública (FIIP IN0001 a IN0013). Para garantizar la autonomía operativa en sedes regionales con conectividad limitada, el sistema adopta un modelo de arquitectura **Local-First (Progressive Web App)**, donde el archivo JSON actúa como contrato único de datos, estado de aplicación y repositorio inmutable de evidencia metodológica.

| 💡 PRINCIPIO ARQUITECTÓNICO CLAVEEl esquema far-piip-v3.json estandariza la estructura de datos para las 11 herramientas del Doble Diamante de la SGP-PCM, permitiendo la lectura y escritura offline, la validación estricta de tipos de datos y la sincronización asíncrona con el backend institucional. |
| :---- |

Entre los objetivos centrales que cumple la especificación de este esquema se destacan:

* **Desacoplamiento Total del Frontend y Backend:** Permite que la interfaz cargue dinámicamente cualquier iniciativa utilizando un único controlador de renderizado (content-loader.js).  
* **Trazabilidad e Inmutabilidad de Fases:** Registra formalmente las actas de cierre de cada fase (Descubrir, Definir, Idear, Entregar) asegurando el cumplimiento de la norma técnica.  
* **Soporte para Persistencia Local-First:** Compatible con LocalStorage e IndexedDB, garantizando que no se pierda información de las evaluaciones de campo.  
* **Escalabilidad para el Portafolio (Anexo 5):** Estructura optimizada para compilar los expedientes de las 13 Unidades Orgánicas en una matriz consolidada (seed\_panoramico\_piip.json).

# **2\. Estructura Global y Secciones Raíz del Esquema (far-piip-v3.json)**

La raíz del esquema JSON se organiza en tres (3) bloques jerárquicos de nivel superior que dividen la metadata institucional, el control de gobernanza y el contenido metodológico exhaustivo:

| Bloque Principal JSON | Tipo de Dato / Estructura | Descripción y Propósito Funcional |
| :---- | :---- | :---- |
| **IniciativaIdentificacion** | Object (Atributos Clave) | Almacena los datos maestros de la iniciativa: Código FIIP (IN0001 a IN0013), Nombre, Unidad Orgánica Responsable, Líder del Proyecto y Porcentaje de Avance Global. |
| **CierreFaseFormal** | Object (Gobernanza) | Registra la trazabilidad legal del estado de las fases (Descubrir, Definir, Idear, Entregar), actas de cierre, aprobaciones de UPP y timestamps de transición. |
| **RegistrosHerramientasMetodologicas** | Object (Contenedor de 4 Fases) | Agrupa el contenido completo generado en las 11 herramientas metodológicas (H01 a H11) ordenadas jerárquicamente por las 4 fases del Doble Diamante. |

**Representación Sintáctica del Bloque Raíz:**

| 💡 ESTRUCTURA RAÍZ JSON{  "\$schema": "./schemas/far-piip-v3.json",  "IniciativaIdentificacion": {    "IniciativaCodigo": "PIIP-2026-IN0001",    "IniciativaNombre": "Plataforma Formativa Blended Learning...",    "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",    "LiderProyecto": "Especialista en Capacitación Agraria \- UPDC",    "PorcentajeAvanceGlobal": 100.0  },  "CierreFaseFormal": { ... },  "RegistrosHerramientasMetodologicas": { ... }} |
| :---- |

# **3\. Diccionario Técnico de Datos por Fases y Herramientas Metodológicas**

A continuación se especifica la estructura interna de los objetos JSON para cada una de las 11 herramientas distribuidas a lo largo del ciclo del Doble Diamante SGP-PCM:

## **Fase 1: Descubrir (Herramientas H01 a H04)**

**• H01\_ObservacionAEIOU \[Array de Objetos\]:** Registra hallazgos cualitativos estructurados por las 5 dimensiones observacionales (Actividades, Entorno, Interacciones, Objetos, Usuarios). Cada entrada posee id, dimension, observation y timestamp.

**• H02\_MapaEmpatia \[Objeto Estructurado\]:** Mapea el perfil cualitativo del usuario objetivo divido en 6 cuadrantes: userProfile, says, does, thinks, feels, pains, gains.

**• H03\_EncuestasCampo \[Objeto Estadístico\]:** Consolida la evidencia cuantitativa de campo. Incluye sampleSize, targetAudience y el arreglo keyResults con preguntas, porcentajes y opciones preferidas.

**• H04\_FichaPersona \[Objeto Arquetipo\]:** Representa el arquetipo de usuario clave del proyecto con atributos: archetypeCode, name, role, age, digitalLiteracy, primaryGoal.

## **Fase 2: Definir (Herramientas H05 y H06)**

**• H05\_MuroHallazgos \[Array de Clústeres\]:** Sistematiza la información cualitativa agrupándola en hallazgos priorizados. Atributos: clusterId, clusterName, insight, priority (ALTA/MEDIA/BAJA).

**• H06\_DefinicionDesafioHMW \[Objeto Mad-libs\]:** Estructura la formulación estandarizada del desafío mediante la técnica How Might We (¿Cómo podríamos...?). Campos: hmwCode, action, targetUser, benefit, constraint, finalHMWStatement.

## **Fase 3: Idear (Herramientas H07 y H08)**

**• H07\_LluviaIdeasCrazy8s \[Array de Propuestas\]:** Recopila las ideas brutas de solución. Campos: ideaId, title, author, votes.

**• H08\_MatrizPriorizacion \[Objeto Multicriterio\]:** Evalúa las soluciones en 4 dimensiones (Deseabilidad, Factibilidad, Viabilidad, Impacto) en escala 1-5. Calcula scoreTotal (0-20), asigna isWinningIdea (booleano) y genera el objeto winningIdeaSummary con el sustento estratégico.

## **Fase 4: Entregar (Herramientas H09 a H11)**

**• H09\_PrototipadoRapido \[Objeto de Prototipo\]:** Especifica las características técnicas del prototipo. Incluye prototypeId, prototypeType, screens (array con screenId, name, description) y acceptanceCriteria (array de strings).

**• H10\_PlanAccion \[Objeto Hoja de Ruta\]:** Organiza la implementación en Sprints. Incluye roadmapCode y el arreglo sprints con sprintNumber, duration, focus, leadUnit y deliverable.

**• H11\_MatrizRiesgosTesteo \[Objeto Experimento\]:** Consolida la mitigación de riesgos y validación de campo. Contiene risks (array de riesgos y acciones), testCard (experimento, métrica, criterio de éxito y resultado) y kanbanTicket (estado final para ingreso al Portafolio).

# **4\. Contrato de Interfaz API (StorageService.js) y Carga Dinámica**

Para interactuar de manera segura con el esquema JSON, el aplicativo implementa la clase JavaScript **StorageService.js**, la cual abstrae las operaciones de lectura, escritura, validación y sincronización en LocalStorage. A continuación se resumen los métodos fundamentales:

| Método API JavaScript | Parámetros de Entrada | Descripción y Comportamiento |
| :---- | :---- | :---- |
| **getNavigationState()** | Ninguno | Devuelve la iniciativa activa actualmente, la fase activa y la lista de proyectos registrados. |
| **getAllProjects()** | Ninguno | Obtiene el catálogo panorámico de los 13 proyectos compilados desde seed\_panoramico\_piip.json. |
| **saveProject(projectObj)** | Object projectObj | Guarda o actualiza un expediente completo JSON en LocalStorage garantizando persistencia. |
| **getToolEntries(projectCode, toolKey)** | String projectCode, String toolKey | Recupera de manera aislada el objeto o arreglo de datos registrado para una herramienta específica (ej. H08\_MatrizPriorizacion). |
| **closePhase(projectCode, phaseKey, actaInfo)** | String projectCode, String phaseKey, Object actaInfo | Ejecuta el cierre formal de fase, actualizando los badges de estado a 'completed' y habilitando la siguiente fase a 'active'. |

# **5\. Conclusiones y Reglas de Mantenimiento del Esquema**

La implementación exitosa del esquema **far-piip-v3.json** asegura la interoperabilidad total del sistema AGROIDEAS-PIIP. Para garantizar el adecuado mantenimiento técnico se establecen las siguientes directrices:

* **Validación Continua mediante JSON Schema:** Todo nuevo registro en LocalStorage o exportación en lote debe ser validado contra el archivo de definición formal ./schemas/far-piip-v3.json antes de ser admitido.  
* **Respaldo y Exportación de Seguridad:** Se recomienda disponer del botón de descarga 'Exportar Backup JSON' en el Dashboard de la aplicación para permitir a los usuarios respaldar su trabajo en archivos locales.  
* **Versionado de Esquema:** Cualquier modificación estructural en los campos debe incrementar la versión del archivo (\$schema) a v3.1 o superior, manteniendo compatibilidad hacia atrás con los archivos seed creados.