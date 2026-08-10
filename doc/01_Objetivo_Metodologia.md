# 1. Objetivo y Metodología (PIIP - AGROIDEAS)

## 1.1 Objetivo del Proyecto

El aplicativo web **Prototipo PIIP** ha sido diseñado como la infraestructura digital que soporta el Portafolio Institucional de Innovación Pública (PIIP) de AGROIDEAS. Su propósito principal es estandarizar y facilitar el registro, análisis y desarrollo iterativo de soluciones innovadoras, proporcionando herramientas guiadas a los responsables de proyectos para que no omitan etapas críticas en la construcción de productos, servicios y procesos con valor público.

### Objetivos Específicos
1.  **Centralización de Iniciativas:** Contar con un repositorio único de innovación (Dashboard) que ofrezca trazabilidad de la madurez de los proyectos.
2.  **Alfabetización y Estandarización Metodológica:** Guiar a los equipos internos a través del proceso sistemático del Doble Diamante.
3.  **Registro de Evidencias:** Disponer de una base de datos estructurada donde las observaciones de campo, los arquetipos, desafíos, ideas y riesgos estén interconectados.

## 1.2 Base Metodológica: El Doble Diamante

El diseño del software se encuentra inherentemente acoplado al marco de trabajo del **Doble Diamante**, propuesto por el Design Council. Este marco divide la innovación en cuatro fases secuenciales:

### Fase 1: Descubrir (Divergencia)
*   **Enfoque:** Exploración profunda del problema, recolección de datos cualitativos e inmersión en el contexto del usuario final (ej. Productores agrarios, cooperativas).
*   **Herramientas Implementadas en el Sistema:**
    *   **Observación (Método AEIOU):** Registro estructurado de Actividades, Entornos, Interacciones, Objetos y Usuarios.
    *   **Mapa de Empatía:** Análisis profundo sobre lo que el usuario piensa, siente, oye, ve, dice y hace.
    *   **Encuestas y Entrevistas:** Banco de información estructurada.

### Fase 2: Definir (Convergencia)
*   **Enfoque:** Sintetizar los hallazgos de la fase de descubrimiento para identificar un problema accionable y perfilar a los beneficiarios.
*   **Herramientas Implementadas en el Sistema:**
    *   **Persona (Perfil de Usuario):** Construcción del arquetipo (frustraciones, alegrías, trabajos por hacer).
    *   **Desafío de Innovación:** Formulación del problema bajo el esquema "Cómo Podríamos... (HMW)".

### Fase 3: Idear (Divergencia)
*   **Enfoque:** Generación masiva de posibles soluciones sin restricciones iniciales.
*   **Herramientas Implementadas en el Sistema:**
    *   **Lluvia de Ideas:** Captura ágil de propuestas.
    *   **Matriz de Priorización:** Evaluación de viabilidad e impacto.
    *   **Prototipado Rápido:** Registro de maquetas conceptuales y storyboarding.

### Fase 4: Entregar (Convergencia)
*   **Enfoque:** Ejecución planificada, gestión de riesgos operativos e institucionales, y despliegue iterativo.
*   **Herramientas Implementadas en el Sistema:**
    *   **Plan de Acción:** Cronograma y responsables.
    *   **Matriz de Riesgos:** Análisis de probabilidad e impacto (mitigación).

## 1.3 Ciclo de Vida del Proyecto en la Aplicación

1.  **Creación:** Un especialista crea un proyecto desde el *Dashboard* y se genera un identificador único (ID de Proyecto).
2.  **Selección de Contexto:** El usuario selecciona la acción **"Trabajar"** sobre un proyecto. A partir de este momento, cualquier dato registrado en los módulos transversales (AEIOU, Ideas, Riesgos, etc.) hereda automáticamente el ID del proyecto activo.
3.  **Progresión:** Las fases se actualizan manualmente conforme el proyecto supera hitos (Pendiente -> En Curso -> Completado).
4.  **Consulta Integral:** El botón **"Ver Ficha"** consolida toda la información recopilada en un único modal interrelacionado.
