**DOCUMENTACIÓN TÉCNICA DE INTERFACES Y COMPONENTES UI**

Especificación Arquitectónica de las 11 Herramientas del Doble Diamante y Dashboard de Portafolio en el Aplicativo AGROIDEAS \- PIIP

# **1\. Arquitectura General de Layout y Sistema de Diseño UI**

El Aplicativo para la Gestión de la Innovación Pública (PIIP) implementa una arquitectura de interfaz modular basada en componentes desacoplados. La estructura visual garantiza consistencia entre la vista principal del Portafolio (**index.html**) y las 11 herramientas metodológicas del Doble Diamante, utilizando TailwindCSS y la metodología BEM (Block Element Modifier) para el estilizado sin dependencias pesadas.

| Componente UI | Identificador / Selector HTML | Función TÉCNICA y Eventos |
| :---- | :---- | :---- |
| **Header Institucional** | \#app-header / .main-header | Inyección dinámicos de logotipos oficiales (MIDAGRI / AGROIDEAS), badge del rol activo y selector de sesión. |
| **Barra de Trazabilidad** | \#breadcrumb-nav / .nav-breadcrumbs | Renderizado del estado de la cabecera (NavegacionYTrazabilidad). Muestra Fase actual, paso relativo (X de 11\) y breadcrumbs. |
| **Contenedor Principal** | \#main-content / .tool-canvas | Área de renderizado dinámico de la herramienta. Aloja formularios, tableros Kanban, lienzos de arrastre o matrices. |
| **Footer de Navegación** | \#app-footer / .flow-controls | Contiene botones de acción 'Anterior' / 'Siguiente', indicador de autoguardado en LocalStorage y disparador de Cierre de Fase. |

# **2\. Especificación Detallada de Interfaces y Vistas**

## **2.1. Vista General de Control: Dashboard y Modal de Registro (index.html)**

El Dashboard principal consolida el listado de las 13 iniciativas de AGROIDEAS mediante una grilla adaptativa de tarjetas. La ventana modal **Registrar Proyecto de Innovación** permite la captura estructurada de nuevas Fichas de Iniciativa (FIIP).

| Campo Modal UI | Tipo de Control HTML | Validación y Comportamiento |
| :---- | :---- | :---- |
| **Título del Proyecto** | input\[type='text'\] | Requerido. Nombre completo de la iniciativa (ej. Plataforma Formativa...). |
| **Código de Ficha** | input\[type='text'\] | Requerido. Formato 'PIIP-2026-INXXXX'. Clave única de mapeo relacional. |
| **Fecha de Registro** | input\[type='date'\] | Requerido. Captura la fecha de formalización en formato DD/MM/AAAA. |
| **Unidad Responsable** | select.form-control | Requerido. Selección de la unidad orgánica proponente (UPDC, UN, UAJ, UPP, URIE, etc.). |
| **Trazabilidad Fases** | 4 x select (Enum) | Permite fijar individualmente el estado ('Pendiente', 'En Curso', 'Completado') para cada fase. |

## **2.2. Fase 1: Descubrir \- Herramientas 01 a 04**

Comprende la inmersión y recopilación de evidencia cualitativa y cuantitativa en campo:

* **H01 \- Observación AEIOU (01-observacion.html):** Interfaz tabulada en 5 dimensiones (Actividades, Entorno, Interacciones, Objetos, Usuarios). Incluye soporte de adjuntos multimedia y sello de tiempo de campo.  
* **H02 \- Mapa de Empatía (02-mapa-empatia.html):** Lienzo en cuadrante (Qué Dice, Qué Hace, Qué Piensa, Qué Siente) con cajas secundarias para Frustraciones y Necesidades del productor agrario.  
* **H03 \- Encuestas de Campo (03-encuestas.html):** Generador dinámico de preguntas de escala Likert y opción múltiple con barra de progreso de muestra alcanzada.  
* **H04 \- Ficha de Persona (04-ficha-persona.html):** Tarjeta de arquetipo de usuario que consolida perfil demográfico, hábitos tecnológicos, dolores principales y nivel de adopción digital.

## **2.3. Fase 2: Definir \- Herramientas 05 y 06**

* **H05 \- Muro de Hallazgos / Research Wall (05-muro-hallazgos.html):** Pizarra virtual interactiva con post-its codificados por colores según la fuente. Permite agrupamiento drag-and-drop y asignación de prioridades a los Insights.  
* **H06 \- Definición del Desafío HMW (06-definicion-desafio.html):** Formulario guiado con estructura de plantilla Mad-libs ('¿Cómo podríamos...?'). Sintetiza la variable de acción, usuario objetivo, beneficio y restricción.

## **2.4. Fase 3: Idear \- Herramientas 07 y 08**

* **H07 \- Lluvia de Ideas y Crazy 8's (07-lluvia-ideas.html):** Tablero de bocetado rápido con temporizador regressivo de 8 minutos integrado. Permite votación silenciosa (dot-moting) de ideas por el equipo.  
* **H08 \- Matriz de Priorización de Ideas (08-matriz-priorizacion.html):** Grilla interactiva impulsada por DataTables.js. Evalúa cada idea de 1 a 5 en Deseabilidad, Factibilidad, Viabilidad e Impacto, reordenando automáticamente para destacar la 'Idea Ganadora'.

## **2.5. Fase 4: Entregar \- Herramientas 09 a 11**

* **H09 \- Prototipado Rápido (09-prototipado-rapido.html):** Visor de maquetas PWA/Storyboards con checklist de criterios de aceptación antes del testeo empírico.  
* **H10 \- Plan de Acción y Hoja de Ruta (10-plan-accion.html):** Tabla de actividades por Sprints de 3 semanas, asignación de unidades responsables (OTI, UAJ, Unidades de Línea) y entregables clave.  
* **H11 \- Matriz de Riesgos y Testeo (11-matriz-riesgos.html):** Semáforo de riesgos (Tecnológico, Operativo, Legal) y Tarjetas de Aprendizaje encadenadas directamente al Tablero Kanban de gestión del proyecto.

# **3\. Ciclo de Eventos y Controlador de Persistencia (StorageService.js)**

El flujo de datos entre la interfaz gráfica (HTML) y la capa de almacenamiento LocalStorage se gestiona mediante el controlador JavaScript **StorageService.js**. Este servicio ejecuta las operaciones CRUD en milisegundos sin requerir llamadas HTTP externas, garantizando la arquitectura Local-First y costo S/. 0.00.

| Evento UI / Trigger | Método JS Ejecutado | Acción en LocalStorage / DOM |
| :---- | :---- | :---- |
| **DOMContentLoaded** | StorageService.init() | Carga el dataset semilla seed\_panoramico\_piip.json si el LocalStorage está vacío. |
| **Selección de Proyecto** | StorageService.setNavigationState() | Guarda el IniciativaCodigoActiva en LocalStorage y actualiza el breadcrumb global. |
| **Submit de Formulario** | StorageService.addToolEntry() | Inserta la nueva entrada en la colección relacional de la herramienta con su projectCode. |
| **Cambio de Criterio (H08)** | StorageService.updateToolEntry() | Recalcula los puntajes ponderados en tiempo real y reordena la tabla de la Matriz de Priorización. |

