**DOCUMENTACIÓN TÉCNICA Y ESPECIFICACIÓN DETALLADA DE INTERFACES Y COMPONENTES UI**

*Aplicativo para la Gestión de la Innovación Pública (PIIP) \- AGROIDEAS*  
*Modelo Doble Diamante SGP-PCM & Metodología SIPA*

| DOCUMENTO TÉCNICO MAESTRO DE ARQUITECTURA DE INTERFAZPrograma: Programa de Compensaciones para la Competitividad (AGROIDEAS) / MIDAGRIUnidad Responsable: Unidad de Planeamiento y Presupuesto (UPP) \- ModernizaciónAlcance: Especificación exhaustiva de 13 Iniciativas FIIP, 11 Herramientas Metodológicas, 4 Fases del Doble Diamante, Contratos de Datos JSON (far-piip-v3.json), Componentes TailwindCSS/BEM y Eventos JS (StorageService.js). |
| :---- |

# **1\. Arquitectura General de Interfaz y Sistema de Diseño UI**

El **Aplicativo para la Gestión de la Innovación Pública (PIIP)** ha sido diseñado como una Single Page Application (SPA) liviana y modular con enfoque Local-First. La arquitectura UI garantiza la interoperabilidad visual y la consistencia operativa entre el Dashboard del Portafolio (**index.html**) y las 11 herramientas del Doble Diamante de la PCM. El sistema utiliza **TailwindCSS** para las utilidades de diseño responsivo y la metodología **BEM (Block Element Modifier)** para garantizar la mantenibilidad y modularidad de los estilos sin dependencias de frameworks externos pesados.

## **1.1. Layout Global y Componentes Contenedores Compartidos**

| Componente UI | Selector HTML / BEM | Especificación Técnica y Responsabilidad |
| ----- | ----- | ----- |
| **Header Institucional** | \#app-header.main-header | Barra superior fija. Despliega los logotipos oficiales de MIDAGRI y AGROIDEAS, badge dinámico del rol de usuario (Facilitador Ágil, UPP, Ejecutor) y el selector de proyecto activo. |
| **Navegación Trazable** | \#breadcrumb-nav.nav-breadcrumbs | Barra de migas de pan sincronizada con la cabecera NavegacionYTrazabilidad. Muestra Fase activa, número de paso relativo (X de 11\) y botones de retorno al Portafolio. |
| **Lienzo de Herramienta** | \#main-content.tool-canvas | Contenedor principal interactivo. Carga dinámicamente el layout específico de la herramienta (cuadrantes de empatía, pizarras virtuales, matrices DataTables.js, tableros Kanban). |
| **Footer de Navegación** | \#app-footer.flow-controls | Barra inferior de control de flujo. Aloja botones 'Anterior' y 'Siguiente', indicador de estado de autoguardado en LocalStorage y botón de disparo para 'Cerrar Fase'. |

# **2\. Mapeo Panorámico de las 13 Iniciativas FIIP en la Interfaz**

El aplicativo soporta el registro, monitoreo y ejecución de las 13 Fichas de Iniciativa de Innovación Pública (FIIP) evaluadas y priorizadas por la Unidad de Planeamiento y Presupuesto (UPP) de AGROIDEAS. Cada iniciativa posee un ciclo completo de trazabilidad en las 4 fases del Doble Diamante dentro del Portafolio.

| Código FIIP | Nombre de la Iniciativa | Unidad Responsable | Estado de Fases |
| :---: | ----- | :---: | :---: |
| **PIIP-2026-IN0001** | Plataforma Formativa Blended Learning para Organizaciones Agrarias | UPDC | Fase 3: Idear |
| **PIIP-2026-IN0002** | Sistema Digital de Monitoreo de Planes de Negocio | Unidad de Negocios | Fase 3: Idear |
| **PIIP-2026-IN0003** | Base de Datos Dinámica de Criterios Legales para Unidades Regionales | Asesoría Jurídica | Fase 3: Idear |
| **PIIP-2026-IN0004** | Lineamientos para la Digitalización Integral de Expedientes | Planeamiento (UPP) | Fase 3: Idear |
| **PIIP-2026-IN0005** | Sistema de Alerta Temprana para Riesgos en Ejecución de Incentivos | UPP / USE | Fase 3: Idear |
| **PIIP-2026-IN0006** | Directiva para Fiscalización Posterior Basada en Riesgos | Planeamiento (UPP) | Fase 3: Idear |
| **PIIP-2026-IN0007** | Sistema Digital de Evaluación de Elegibilidad con Georreferenciación | Coord. Regional (CTR) | Fase 3: Idear |
| **PIIP-2026-IN0008** | Nueva Arquitectura e Infraestructura del Sistema en Línea SEL v2.0 | Administración (TI) | Fase 3: Idear |
| **PIIP-2026-IN0009** | Plataforma Digital de Gestión y Programación de Vacaciones | Administración (RRHH) | Fase 3: Idear |
| **PIIP-2026-IN0010** | Implementación de Casilla Electrónica para Notificaciones | UPP / UA-Trámite | Fase 3: Idear |
| **PIIP-2026-IN0011** | Automatización del Proceso de Rendición de Cuentas | Reconversión (URIE) | Fase 3: Idear |
| **PIIP-2026-IN0012** | Portal de Transparencia Interactivo para Beneficiarios | Reconversión (URIE) | Fase 3: Idear |
| **PIIP-2026-IN0013** | Estrategia Emprendimiento Mujer Rural e Indígena (EEMRI) | Dirección Ejecutiva | Fase 3: Idear |

# **3\. Especificación Detallada de Vistas e Interfaces por Fase**

## **3.1. Dashboard General del Portafolio y Modal de Registro (index.html)**

La vista principal (**index.html**) actúa como el centro de mando del Portafolio Institucional de Innovación Pública (PIIP). Presenta dos componentes clave:

* **Grilla Adaptativa del Portafolio (\#portfolio-grid):** Renderiza las 13 tarjetas de proyecto. Cada tarjeta incluye código FIIP, título, área responsable, avance porcentual global y botones de acceso directo a cada fase.  
* **Modal 'Registrar Proyecto de Innovación' (\#modal-add-project):** Formulario emergente que captura título, código oficial, fecha de registro, unidad responsable y estado inicial de las 4 fases. Los datos se persisten en LocalStorage mediante el controlador StorageService.js.

## **3.2. FASE 1: DESCUBRIR (Comprender el Problema Publico)**

### **Herramienta 01: Observación AEIOU (01-observacion.html)**

Estructura en 5 pestañas interactivas basadas en el método AEIOU: **Actividades, Entorno, Interacciones, Objetos y Usuarios**. Permite registrar observaciones cualitativas de campo, adjuntar fotografías, asignar etiquetas de severidad y registrar la ubicación de la prueba.

### **Herramienta 02: Mapa de Empatía (02-mapa-empatia.html)**

Canvas cuadrante simétrico centrado en el arquetipo del productor agrario. Se divide en 4 secciones primarias: **¿Qué Dice?, ¿Qué Hace?, ¿Qué Piensa? y ¿Qué Siente?**, complementado con dos paneles inferiores dedicados a Frustraciones (Dolores) y Motivaciones (Necesidades).

### **Herramienta 03: Encuestas de Campo (03-encuestas.html)**

Módulo de captura cuantitativa en territorio. Permite configurar encuestas con preguntas de opción múltiple y escalas de Likert (1 a 5). Incluye indicador de muestra alcanzada (ej. 45 de 50 encuestas) y renderizado de gráficos de torta/barras para análisis rápido.

### **Herramienta 04: Ficha de Persona (04-ficha-persona.html)**

Diseño de tarjeta de arquetipo de usuario (User Persona). Captura foto/avatar del perfil, datos demográficos, nivel de adopción tecnológica, objetivos de desarrollo agrario y principales barreras en la tramitación con AGROIDEAS.

## **3.3. FASE 2: DEFINIR (Focalizar el Desafío de Innovación)**

### **Herramienta 05: Muro de Hallazgos / Research Wall (05-muro-hallazgos.html)**

Pizarra virtual interactiva que simula notas adhesivas (Post-its) codificadas por color. Los ejecutores pueden arrastrar, agrupar por categorías (Clústeres) y sintetizar 'Insights' o hallazgos clave derivados de la Fase 1\.

### **Herramienta 06: Definición del Desafío HMW (06-definicion-desafio.html)**

Formulario de estructura forzada tipo Mad-libs. Concatena 4 variables para construir automáticamente la pregunta del Desafío de Innovación:

***«¿Cómo podríamos \[ACCIÓN DE MEJORA\] para que \[USUARIO OBJETIVO\] pueda \[BENEFICIO ESPERADO\] a pesar de \[OBSTÁCULO O RESTRICCIÓN\]?»***

## **3.4. FASE 3: IDEAR (Generar y Seleccionar Soluciones)**

### **Herramienta 07: Lluvia de Ideas y Crazy 8's (07-lluvia-ideas.html)**

Tablero de co-creación divergente. Incorpora un temporizador regresivo de 8 minutos para la dinámica Crazy 8's y un widget de votación por puntos (Dot-voting) para seleccionar las ideas más prometedoras.

### **Herramienta 08: Matriz de Priorización de Ideas (08-matriz-priorizacion.html)**

Tabla interactiva avanzada desarrollada con **DataTables.js**. Evalúa cada idea de 1 a 5 en cuatro criterios ponderados: **Deseabilidad, Factibilidad, Viabilidad e Impacto**. El sistema calcula el puntaje total en tiempo real y resalta automáticamente la fila de la **«Idea Ganadora»** que pasará a la etapa de prototipado.

## **3.5. FASE 4: ENTREGAR (Validar la Solución en Campo)**

### **Herramienta 09: Prototipado Rápido (09-prototipado-rapido.html)**

Galería de exhibición del prototipo (maquetas PWA, storyboards, diagramas de flujo). Incluye una lista de chequeo de criterios mínimos de éxito antes de realizar las pruebas empíricas con usuarios reales.

### **Herramienta 10: Plan de Acción y Hoja de Ruta (10-plan-accion.html)**

Cronograma operativo de implementación estructurado en Sprints de 3 semanas. Asigna responsabilidades directas a las unidades orgánicas (Unidades de Línea, OTI, UAJ) y define entregables e hitos de control.

### **Herramienta 11: Matriz de Riesgos y Testeo (11-matriz-riesgos.html)**

Panel de gestión de riesgos con semaforización visual (Riesgo Tecnológico, Operativo, Legal) y bitácora de Tarjetas de Aprendizaje. Las tareas derivadas de los testeos se encadenan automáticamente al Tablero Kanban del proyecto.

# **4\. Esquema de Datos JSON (far-piip-v3.json) y API StorageService.js**

La persistencia de datos opera bajo una arquitectura **Local-First** utilizando el estándar **far-piip-v3.json**. El esquema desacopla la navegación, el catálogo maestro y los datos relacionales de las herramientas.

## **4.1. Métodos de la API StorageService.js**

| Método API JS | Capa de Datos | Descripción y Comportamiento |
| ----- | ----- | ----- |
| **getNavigationState()** | Capa A (UI State) | Obtiene el objeto activo de NavegacionYTrazabilidad con la vista, fase y rol actual. |
| **getAllProjects()** | Capa B (Catálogo) | Retorna el listado completo de las 13 iniciativas almacenadas en LocalStorage. |
| **saveProject(project)** | Capa B (Catálogo) | Inserta un nuevo proyecto o actualiza la metadata y estados de fase de uno existente. |
| **getToolEntries(tool, code)** | Capa C (Herramientas) | Filtra y retorna exclusivamente los registros de la herramienta pertenecientes al projectCode. |
| **addToolEntry(tool, data)** | Capa C (Herramientas) | Crea un nuevo registro en la herramienta especificada asignando un ID único y la clave relacional. |

# **5\. Matriz de Control de Acceso Basado en Roles (RBAC)**

El aplicativo implementa control de permisos diferenciado según el rol del servidor civil dentro de AGROIDEAS:

| Rol en el Aplicativo | Actor Institucional | Permisos y Responsabilidades |
| ----- | ----- | ----- |
| **Administrador UPP** | Unidad de Planeamiento y Presupuesto | Acceso global de lectura/escritura. Aplica la Rúbrica de Evaluación (Anexo 2), emite Opinión Técnica (Anexo 4\) y gestiona el Portafolio (Anexo 5). |
| **Instancia Decisora** | Dirección Ejecutiva (Alta Dirección) | Lector Ejecutivo. Visualiza dashboards de avance y aprueba formalmente el inicio de proyectos o cierres de fase mediante actos administrativos. |
| **Facilitador Ágil** | Líder de Proyecto Asignado | Editor Principal de la iniciativa. Administra herramientas, lidera dinámicas, gestiona el Tablero Kanban (Anexo 7\) y solicita Cierre de Fase. |
| **Ejecutor Multidisciplinario** | Unidades de Línea, OTI, UAJ | Editor Colaborativo. Ingresa observaciones en campo, propone ideas, evalúa en matriz y carga maquetas de prototipos. |
| **Usuario / Ciudadano** | Productores Agrarios / Administrados | Acceso restringido externo. Interactúan únicamente mediante enlaces de encuestas o pantallas de testeo de prototipos. |

