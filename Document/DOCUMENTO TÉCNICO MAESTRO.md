# **DOCUMENTO TÉCNICO MAESTRO: APLICATIVO PARA LA GESTIÓN DE LA INNOVACIÓN PÚBLICA (PIIP) \- AGROIDEAS**

¡Perfecto\! A continuación, presento el **Documento Técnico Maestro** consolidado en un solo bloque estructurado. Este esquema contiene toda la ingeniería de requerimientos, reglas de negocio, flujos de Inteligencia Artificial y gobernanza listos para ser exportados o ingresados como un "Prompt Maestro" en herramientas de desarrollo como Google Gemini o para el equipo de Google Antigravity.

---

## **1\. INTRODUCCIÓN Y CONTEXTO ESTRATÉGICO**

**1.1. Objetivo del Documento Técnico** Establecer los requerimientos funcionales, metodológicos y de arquitectura de datos para el desarrollo de un aplicativo destinado a la Gestión de Proyectos de Innovación Pública. Su diseño permitirá que motores de Inteligencia Artificial y equipos de desarrollo procesen la información sin ambigüedades, facilitando la generación automática de bases de datos, flujos de interacción y código base.

**1.2. Finalidad del Aplicativo/Sistema** Facilitar, estandarizar y democratizar la innovación pública dentro de AGROIDEAS, brindando asistencia a los equipos para el desarrollo ágil de soluciones. Busca ser un motor de trazabilidad que consolide de manera segura toda la información generada para **alimentar de forma centralizada y automatizada el Portafolio Institucional de Innovación Pública (PIIP)**, garantizando el cumplimiento normativo (NT-GIP N° 003-2025-PCM-SGP) y la provisión de evidencia a la Alta Dirección.

**1.3. Alcance (Producto Mínimo Viable \- MVP)** El alcance del sistema contempla la digitalización del **Modelo de Doble Diamante** (Descubrir, Definir, Idear y Entregar). La Versión 1.0 (MVP) se concentra en los requerimientos obligatorios: Módulo Transversal de Seguridad (RBAC), formularios estructurados para el problema, Muro de Hallazgos básico, Matriz dinámica de Priorización de Ideas y formularios de Testeo/Riesgos, soportados por una base de datos iterativa no lineal.

---

## **2\. ARQUITECTURA METODOLÓGICA (EL DOBLE DIAMANTE)**

El aplicativo estructurará su flujo alternando fases de pensamiento divergente y convergente, divididas en el **Área del Problema** (Fases 1 y 2\) y el **Área de la Solución** (Fases 3 y 4). El diseño permite la iteración, conservando el histórico de datos en la base de datos sin sobrescribirlos.

* **2.1. Fase 1: DESCUBRIR:** Módulos para ingresar el problema y mapear visualmente a los actores. Incluye un panel de control de tareas para planificar la investigación en campo y generar Guías de Observación móviles.  
* **2.2. Fase 2: DEFINIR:** Procesamiento de datos cualitativos mediante una Pizarra Virtual ("Muro de Hallazgos"), matrices del "Viaje del Usuario" e integración de formularios rígidos (*Mad-libs*) para estructurar el Desafío de Innovación.  
* **2.3. Fase 3: IDEAR:** Entornos digitales de alta concurrencia para proponer ideas (ej. temporizador "Crazy 8's") y un motor de cálculo matemático (Matriz de Priorización) para evaluarlas bajo 4 criterios normativos cruzados.  
* **2.4. Fase 4: ENTREGAR:** Funciona como bitácora de experimentación. Incluye repositorio de archivos multimedia (prototipos), matrices de semaforización de riesgos automáticas y formularios duales encadenados para documentar la prueba ciudadana (Tarjetas de Testeo y Aprendizaje).

---

## **3\. ESPECIFICACIONES FUNCIONALES POR HERRAMIENTA (CORE DEL SISTEMA)**

### **FASE 1: DESCUBRIR**

**3.1. Herramienta 1: Observación (Método AEIOU)**

* **Inputs:** Campos de texto (Actividades, Espacio, Interacciones, Objetos, Usuarios) y carga multimedia.  
* **Procesamiento IA:** Transcripción automática de audios y extracción de palabras clave. Sincronización offline-online.  
* **Outputs:** Ficha PDF descargable y tarjetas migradas al "Muro de Hallazgos".

**3.2. Herramienta 2: Mapa de Empatía**

* **Inputs:** Interfaz gráfica (6 cuadrantes) y selector de perfiles de usuario.  
* **Procesamiento IA:** Minería de datos de Fichas de Observación para sugerir autocompletado en "Esfuerzos" y "Resultados".  
* **Outputs:** Lienzo visual interactivo exportable.

**3.3. Herramienta 3: Encuestas**

* **Inputs:** Constructor de plantillas (Likert, abiertas) y captura en campo.  
* **Procesamiento IA:** Análisis de Sentimiento automático (Positivo, Neutral, Negativo).  
* **Outputs:** *Dashboard* estadístico en tiempo real.

### **FASE 2: DEFINIR**

**3.4. Herramienta 4: Mapa de Experiencia (Viaje del Usuario)**

* **Inputs:** Grid matricial (Antes, Durante, Después) con selector de Emojis y campos de Puntos de Dolor.  
* **Procesamiento IA:** Semaforización automática (mapa de calor) y etiquetado automático del tipo de problema.  
* **Outputs:** Gráfico de curva emocional y ranking de Momentos Críticos.

**3.5. Herramienta 5: Grupos Focales / Insights**

* **Inputs:** Evidencias (audios/texto) y formulario de 4 campos (Título, Texto, Cita textual obligatoria, Imagen).  
* **Procesamiento IA:** Motor de NLP que genera borradores automáticos de "Insights" agrupando comentarios recurrentes.  
* **Outputs:** Tarjetas de Insights validadas.

### **FASE 3: IDEAR**

**3.6. Herramienta 6: Mapas Mentales**

* **Inputs:** Nodo central (Desafío) y nodos secundarios generados concurrentemente.  
* **Procesamiento IA:** Auto-Layout visual y sugerencias de referencias análogas de otras entidades del Estado.  
* **Outputs:** Lienzo gráfico de relaciones.

**3.7. Herramienta 7: ¿Cómo podríamos?**

* **Inputs:** Tabla cruzando el *Insight* con un campo forzado a iniciar con "¿Cómo podríamos...?" y su idea de respuesta.  
* **Procesamiento IA:** Botón generativo para sugerir reformulaciones de la pregunta detonadora.  
* **Outputs:** Banco de ideas de solución estructuradas.

**3.8. Herramienta 8: Matriz de Priorización de Ideas (Votación)**

* **Inputs:** Tabla de votación. Selectores numéricos (1 al 5\) para: Impacto, Viabilidad, Factibilidad e Innovación.  
* **Procesamiento IA:** Cálculo ponderado en tiempo real y ordenamiento automático de filas.  
* **Outputs:** Ranking dinámico y autollenado de la ficha "Captura del Concepto" con la idea ganadora.

### **FASE 4: ENTREGAR**

**3.9. Herramienta 9: Propuesta de Valor**

* **Inputs:** Lienzo dual vinculando "Frustraciones del usuario" con "Aliviadores del producto".  
* **Procesamiento IA:** *Matchmaking* semántico que lanza alertas si detecta "frustraciones huérfanas" (sin solución asignada).  
* **Outputs:** Gráfico de encaje producto-mercado.

**3.10. Herramienta 10: Prototipado**

* **Inputs:** Carga de maquetas o *Wireframes*, y panel de *Storyboard*.  
* **Procesamiento IA:** Asistente generativo visual (*Text-to-Image*) para bocetar escenas de *Storyboards* a partir de texto.  
* **Outputs:** Galería centralizada del prototipo.

**3.11. Herramienta 11: Evaluación de Iteración (Testeo)**

* **Inputs:** Formularios de lecciones (*¿Qué funcionó?, ¿Qué debe mejorar?*) y compromisos correctivos.  
* **Procesamiento IA:** Conversión automática de compromisos a tareas (Tickets) en el Tablero Kanban del proyecto.  
* **Outputs:** Informe Final de Iteración e interconexión automática de estado hacia el Portafolio Institucional (PIIP).

---

## **4\. GESTIÓN DE ACTORES, ROLES Y PERMISOS (RBAC)**

* **4.1. Administrador (Unidad de Modernización / UPP):** Superusuario. Acceso de lectura/escritura global al PIIP (Anexo 5\) y uso exclusivo de la "Rúbrica de Evaluación" (Anexo 2\) para asignar permisos a nuevos equipos.  
* **4.2. Instancia Decisora (Alta Dirección):** Lector ejecutivo. Acceso a *Dashboards* gerenciales y alertas para emitir aprobaciones finales ("Aprobar", "Archivar") con firma digital.  
* **4.3. Líder de Proyecto (Facilitador Ágil):** Permisos CRUD sobre las herramientas de su proyecto. Gestiona el avance del flujo ("Cerrar Fase"), la asignación de tareas Kanban y el uso de los agentes de IA.  
* **4.4. Equipo Innovador (Ejecutores):** Editores colaborativos. Permisos para trabajar en tiempo real en los lienzos y matrices, pero con restricción para "Aprobar Fases".  
* **4.5. Ciudadano (Productor Agrario):** Sin cuenta interna. Interactúa externamente mediante módulos efímeros generados por el sistema (encuestas web o links de testeo de prototipos).

---

## **5\. REQUERIMIENTOS TÉCNICOS Y NO FUNCIONALES (NFR)**

* **RNF-01 (Latencia UI):** Las pizarras colaborativas deben sincronizar cambios en tiempo real con latencia menor a 2 segundos. Predominio de diseño *Drag-and-Drop* y selectores visuales.  
* **RNF-02 (Concurrencia):** Soporte para 50 usuarios interactuando simultáneamente por proyecto (vital para dinámicas como *Crazy 8's* temporizadas).  
* **RNF-03 (Versionamiento de BD):** Arquitectura iterativa (no lineal) que permita retornar a fases anteriores sin sobrescribir el histórico de experimentación.  
* **RNF-04 (Interoperabilidad):** Generación de APIs REST y XML para enviar datos estructurados al Portafolio Institucional (PIIP) y al Portafolio Nacional (SGP-PCM).  
* **RNF-05 (Seguridad y Privacidad):** Autenticación mediante el Directorio Activo de AGROIDEAS. Encriptación en tránsito y reposo de datos ciudadanos sensibles, e integración de marcas de agua (*Watermarking*) automáticas con GPS/hora en las fotografías de campo para prevención de fraudes.  
* **RNF-06 (Offline):** Caché de almacenamiento para levantamiento de datos y encuestas en zonas rurales sin internet, con sincronización automática posterior.

---

## **6\. PLAN DE TRABAJO Y PROGRAMACIÓN (ROADMAP DEL MVP)**

Basado en la metodología de priorización estratégica **"DI NO"** y en el Plan de Implementación de la NT-GIP de AGROIDEAS (2026-2027):

* **6.1. Hito 1: Arquitectura Base y Generación IA (Feb \- Mar 2026):** Ingreso del documento a Inteligencia Artificial para el modelado de *Wireframes* y Bases de Datos (JSON). Configuración de servidores, RBAC y base de datos iterativa.  
* **6.2. Hito 2: Desarrollo del MVP \- Versión 1.0 (Abr \- Jun 2026):** Codificación de los módulos **Obligatorios \[O\]**: Seguridad transversal, PIIP Básico, Rúbricas de UPP, Formularios AEIOU, Muro de Hallazgos simplificado, Matriz de Priorización matemática y Evaluación de Prototipos.  
* **6.3. Hito 3: Escalamiento \- Versión 2.0 (Jul \- Dic 2026):** Codificación de módulos **Importantes \[I\]**: Herramientas de alta concurrencia visual (*Crazy 8's*), Viaje del Usuario con Emojis, e interoperabilidad API total.  
* **6.4. Estrategia de Validación Temprana:** Aplicación estricta de *Mock-ups* con los servidores de UPP, testeo de estrés de concurrencia (50 usuarios) y un *checklist* de inspección de reglas de negocio metodológicas (ej. validación cruzada obligatoria en la Matriz de Ideación).

Como Desarrollador de Aplicaciones Web Especializado en Inteligencia Artificial y Herramientas Agénticas (Google Antigravity/Gemini), he diseñado la propuesta técnica para estructurar el desarrollo del **Aplicativo PIIP**.

Para garantizar que el software se construya sin errores ("alucinaciones de código") y cumpla estrictamente con la normativa de AGROIDEAS, aplicaremos el **Flujo de Trabajo "Agent-First" y VibeCoding**. Este modelo integrará las 11 herramientas del Doble Diamante en un conjunto modular.

A continuación, presento la propuesta para ser incorporada como un nuevo anexo o capítulo de implementación en el **"03\_DOCUMENTO TÉCNICO MAESTRO"**.

---

### **7\. PLAN DE TRABAJO Y FLUJO DE DESARROLLO AGÉNTICO (Google Antigravity)**

**7.1. Objetivo de la Orquestación Agéntica** Definir la secuencia de ejecución obligatoria, las reglas de arquitectura y el flujo de trabajo (Workflows) que los agentes de IA (Google Antigravity) y el equipo de desarrollo deberán seguir para codificar el aplicativo PIIP. Este enfoque garantiza una construcción modular, donde cada fase del Doble Diamante (Descubrir, Definir, Idear, Entregar) se desarrolla iterativamente respetando la soberanía de datos (Local-First).

#### **7.2. Reglas Base del Entorno Agéntico (The ".agent" Directory)**

Antes de escribir cualquier línea de código, se configurará el "cerebro" del proyecto creando el directorio `.agent` en la raíz del repositorio. Este contendrá las leyes inmutables para la IA:

1. **Regla de Scaffolding Obligatorio (Paso 0):** En todos los módulos, el agente ejecutará primero los comandos de creación de directorios vacíos (ej. `mkdir -p app/models app/views public/css`) para evitar errores de rutas inexistentes.  
2. **Arquitectura Agnóstica y Soberanía de Datos (Local-First):** El sistema utilizará persistencia local y bases de datos relacionales (ej. MySQL con PDO estricto o LocalStorage para offline) para asegurar que la información de AGROIDEAS no salga de sus servidores.  
3. **Metodología BEM y UI/UX:** El agente `frontend-specialist` generará las vistas utilizando la metodología BEM (Block Element Modifier) para el CSS, garantizando interfaces modulares y escalables, complementadas con Bootstrap 5 para el diseño responsivo.  
4. **Desarrollo "Spec-Driven" (Sin código prematuro):** Prohibido generar código sin un `PLAN.md` validado. Los agentes se guiarán estrictamente por los "Contratos de Datos" (JSON/API) definidos previamente.

#### **7.3. Flujo de Trabajo Secuencial para Cada Módulo (Herramientas Doble Diamante)**

Para cada una de las 11 herramientas del Doble Diamante, el desarrollo modular se ejecutará siguiendo el flujo agéntico de 6 fases:

* **Fase 1: Planificación (`/plan`):** El agente `project-planner` crea el `PLAN.md` de la herramienta (ej. Matriz de Priorización), definiendo campos, fórmulas y roles.  
* **Fase 2: Base de Datos (`modelado_base_datos.md`):** El `database-architect` genera los esquemas SQL o modelos JSON, garantizando la integridad de datos (ej. perfiles, hallazgos, prototipos).  
* **Fase 3: Lógica Backend (`implementacion_backend.md`):** El `backend-specialist` codifica los controladores y modelos MVC (ej. cálculos de la Matriz de Priorización cruzando deseabilidad, factibilidad, viabilidad e impacto).  
* **Fase 4: Desarrollo Frontend (`desarrollo_frontend.md`):** Invocando `/ui-ux-pro-max`, se construyen las pizarras interactivas (Muro de Hallazgos, Mapas Mentales) usando JavaScript y Canvas.  
* **Fase 5: Calidad y Pruebas (`/test`, `pruebas_y_control_de_calidad.md`):** El `test-engineer` ejecuta pruebas TDD (Test-Driven Development) simulando estrés concurrente y verificando reglas de negocio.  
* **Fase 6: Guías y Despliegue (`/deploy`):** Generación automática de manuales de usuario y validación pre-vuelo para asegurar que no existan vulnerabilidades.

---

#### **7.4. ROADMAP: Desarrollo Progresivo y Gradual del MVP (Versión 1.0)**

La construcción del software se dividirá en *Sprints* de orquestación, construyendo el sistema desde sus cimientos hasta el "Entregar" final:

**Sprint 0: Cimientos y Arquitectura Base** 

* **Ejecución Agéntica:** Configuración de `.agent/rules/architecture-standards.md`.  
* **Módulo a desarrollar:** Sistema de Login (Directorio Activo), Gestión de Usuarios RBAC (Roles: Administrador UPP, Líder, Equipo, Ciudadano).  
* **BD/Vistas:** Esquema global `proyecto_innovacion` y vistas del *Dashboard* principal (PIIP Básico).

**Sprint 1: Módulo Fase 1 \- Descubrir** 

* **Herramientas a codificar:** Formulario Inicial del Problema, Método AEIOU y Mapa de Actores.  
* **Flujo Técnico:** El agente de DB creará las tablas para recolectar las hipótesis. El frontend desarrollará la vista interactiva concéntrica (Diana) para arrastrar actores (*Drag-and-Drop*). Soporte para *offline* (LocalStorage) en encuestas de campo.

**Sprint 2: Módulo Fase 2 \- Definir** 

* **Herramientas a codificar:** Muro de Hallazgos (*Research Wall*), Viaje del Usuario y Desafío de Innovación.  
* **Flujo Técnico:** Implementación de Pizarra Virtual colaborativa mediante *WebSockets* o persistencia local rápida. El backend forzará la estructura algorítmica *Mad-libs* (¿Cómo podríamos...?).

**Sprint 3: Módulo Fase 3 \- Idear** 

* **Herramientas a codificar:** Mapas Mentales, Crazy 8's y Matriz de Priorización de Ideas.  
* **Flujo Técnico:** Alta complejidad frontend. El agente `frontend-specialist` programará temporizadores asíncronos para el *Crazy 8's*. El `backend-specialist` codificará el motor matemático multicriterio que generará el ranking automático en tiempo real.

**Sprint 4: Módulo Fase 4 \- Entregar** 

* **Herramientas a codificar:** Tarjetas de Testeo/Aprendizaje, Registro de Prototipos y Matriz de Riesgos.  
* **Flujo Técnico:** Formularios duales encadenados en base de datos (Testeo \-\> Aprendizaje). UI semaforizada para riesgos cruzando "probabilidad vs impacto".

**Sprint 5: Consolidación, APIs y Auditoría Final** 

* **Ejecución Agéntica:** Invocación de los workflows `analisis_refactorizacion_codigo.md` y `automatizacion_despliegue_nube.md`.  
* **Flujo Técnico:** Desarrollo del motor de plantillas (Templating Engine) para consolidar todos los datos estructurados en un reporte exportable oficial (Portafolio Institucional \- PIIP). Auditoría de seguridad final con el agente `security-auditor` mediante el comando `/deploy check`.

#### **7.5. Entregables Finales por Módulo**

Al finalizar cada Sprint, el sistema agéntico generará de forma automática:

1. **Código Fuente:** MVC completo (Modelos, Controladores y Vistas en HTML5/CSS BEM/JS).  
2. **Base de Datos:** Script `schema.sql` y `seeds.sql` (datos de prueba).  
3. **Documentación:** Comentarios JSDoc/PHPDoc, Guía de Uso del Módulo (`README.md` automatizado) y reportes de cobertura de QA generados por el agente `test-engineer`.

---

Este bloque consolida el 100% del ecosistema metodológico y tecnológico. Puedes copiarlo directamente y utilizarlo en tu gestor de proyectos, documentaciones oficiales, o insertarlo en la consola de IA (Google Antigravity / Gemini) para comenzar de inmediato con la arquitectura de código y el diseño de la interfaz gráfica.

