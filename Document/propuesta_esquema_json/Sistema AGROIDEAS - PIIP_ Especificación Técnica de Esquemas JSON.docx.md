**Sistema AGROIDEAS \- PIIP: Especificación Técnica de Esquemas JSON para Navegación, Trazabilidad y Gestión del Doble Diamante**

**Chat**. Revisar el proyecto de Aplicativo: AGROIDEAS \- PIIP, el cual de alinea con la Norma Técnica y los documentos para su desarrollo:

1. Doc\_Consulta-Lineamientos-desarrollo-proyectos-de-innovacion.pdf  
2. Doc\_Consulta-toolkit-de-innovacion.pdf En tal sentido vamos elaborar en forma gradual y progresivo el desarrollo de las vista conforme se ha registrado en las vista capturadas: PIIP-2026-IN0001: Plataforma Formativa Blended Learning para Organizaciones Agrarias  
3. Descubrir: Completado / 2\. Definir: Completado / 3\. Idear: En Curso/ 4\. Entregar: Pendiente Y Así sucesivamente, para cada registro. Como primer paso debemos definir la cabecera del documento de intercambio de datos JSON: este es un ejemplo usado en el cuaderno: AGROIDEAS \- Gestión del Conocimiento:

Estructura Arquitectónica del Esquema far-mc-v2.jsonEl esquema define la estructura obligatoria en 6 Secciones Principales para el caso del Desarrollo de Micro-Curso, de los cuales solo analizaremos los datos del código: "NavegacionYTrazabilidad":

Ejemplo 01: "\$schema": "./schemas/far-mc-v2.json", "NavegacionYTrazabilidad": { "ModuloNumero": 1, "ModuloNombre": "Módulo 1: Inducción en Modernización de la Gestión Pública", "EjeTematico": "EJE A: Inducción en Modernización de la Gestión Pública", "SubtemaCodigo": "M1.1", "SubtemaTitulo": "Finalidad y Principios de la Ley Marco de Modernización", "PosicionEnModulo": { "ParteActual": 1, "TotalPartesModulo": 3, "EtiquetaSecuencia": "1 de 3", "SubtemaAnteriorCodigo": null, "SubtemaSiguienteCodigo": "M1.2" Ejemplo 02: "\$schema": "./schemas/far-mc-v2.json", "NavegacionYTrazabilidad": { "ModuloNumero": 1, "ModuloNombre": "Módulo 1: Inducción en Modernización de la Gestión Pública", "EjeTematico": "EJE A: Inducción en Modernización de la Gestión Pública", "SubtemaCodigo": "M1.2", "SubtemaTitulo": "La Política Nacional de Modernización de la Gestión Pública (PNMGP al 2030)", "PosicionEnModulo": { "ParteActual": 2, "TotalPartesModulo": 3, "EtiquetaSecuencia": "2 de 3", "SubtemaAnteriorCodigo": "M1.1", "SubtemaSiguienteCodigo": "M1.3" Ejemplo 03: "\$schema": "./schemas/far-mc-v2.json", "NavegacionYTrazabilidad": { "ModuloNumero": 1, "ModuloNombre": "Módulo 1: Inducción en Modernización de la Gestión Pública", "EjeTematico": "EJE A: Inducción en Modernización de la Gestión Pública", "SubtemaCodigo": "M1.3", "SubtemaTitulo": "El Sistema Administrativo de Modernización (SAMGP) en AGROIDEAS", "PosicionEnModulo": { "ParteActual": 3, "TotalPartesModulo": 3, "EtiquetaSecuencia": "3 de 3", "SubtemaAnteriorCodigo": "M1.2", "SubtemaSiguienteCodigo": null Para nuestro caso de análisis que son las FIIP Registradas, revisar, analizar y proponer el esquema para el registro del campo: NavegacionYTrazabilidad, que debería de servir para el registro de todas las vistas del Aplicativo: "AGROIDEAS PIIP".

Para el desarrollo del **Aplicativo PIIP (AGROIDEAS)** —alineado con la Norma Técnica N.° 003-2025-PCM-SGP y la metodología del Doble Diamante—, el bloque **`NavegacionYTrazabilidad`** actúa como el contrato de datos estandarizado en la cabecera de cada objeto JSON.

Esta estructura permite rastrear en tiempo real el progreso de las 11 herramientas metodológicas, gestionar la persistencia *Local-First* en `LocalStorage` y garantizar la trazabilidad no lineal (principio de iteración **BR-01** / **RNF-03**) hacia el Portafolio Institucional de Innovación Pública (Anexo 5).

---

### **1\. Propuesta de Esquema JSON: Cabecera `NavegacionYTrazabilidad`**

A diferencia del modelo de Micro-Cursos (estructurado por Módulos y Ejes Temáticos), para las iniciativas **FIIP (Fichas de Iniciativa de Innovación Pública)** el esquema se organiza en torno a **4 niveles jerárquicos**:

1. **Identificación de la Iniciativa (FIIP)**  
2. **Estado Global de Fases del Doble Diamante** (Descubrir, Definir, Idear, Entregar)  
3. **Ubicación de la Herramienta / Vista Actual** (Herramientas 1 a 11\)  
4. **Controles de Secuencia e Iteración** (Anterior, Siguiente, Versión de Iteración)

---

### **2\. Estructura del Esquema `far-piip-v1.json`**

{  
  "\$schema": "./schemas/far-piip-v1.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "En Curso",  
      "Fase4\_Entregar": "Pendiente"  
    },  
    "UbicacionActual": {  
      "FaseNumero": 3,  
      "FaseNombre": "Fase 3: Idear",  
      "HerramientaNumero": 8,  
      "HerramientaCodigo": "H08",  
      "HerramientaNombre": "Matriz de Priorización de Ideas",  
      "VistaCodigo": "V08.1",  
      "VistaTitulo": "Evaluación Multicriterio de Ideas (Deseabilidad, Factibilidad, Viabilidad, Impacto)",  
      "VistaUrl": "08-matriz-priorizacion.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 8,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 8 de 11 (Fase 3: Idear)",  
      "PasoAnterior": {  
        "HerramientaCodigo": "H07",  
        "HerramientaNombre": "Crazy 8's y Lluvia de Ideas",  
        "VistaUrl": "07-lluvia-ideas.html"  
      },  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H09",  
        "HerramientaNombre": "Prototipado Rápido (Storyboarding)",  
        "VistaUrl": "09-prototipado-rapido.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": true,  
      "FechaUltimaActualizacion": "2026-09-27T10:15:00Z",  
      "UsuarioActualRol": "Facilitador Ágil"  
    }  
  }  
}

---

### **3\. Ejemplos Progresivos de Uso para la Iniciativa `PIIP-2026-IN0001`**

A continuación, se presentan tres ejemplos reales de payload JSON para la misma iniciativa (`PIIP-2026-IN0001`), mostrando la evolución de la cabecera en tres vistas distintas del flujo:

#### **Ejemplo 01: Vista en Fase 1 \- Descubrir (Herramienta 01: Observación AEIOU)**

*Estado del proyecto en esta vista: Fase 1 en curso, Fases 2, 3 y 4 pendientes.*

{  
  "\$schema": "./schemas/far-piip-v1.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "En Curso",  
      "Fase2\_Definir": "Pendiente",  
      "Fase3\_Idear": "Pendiente",  
      "Fase4\_Entregar": "Pendiente"  
    },  
    "UbicacionActual": {  
      "FaseNumero": 1,  
      "FaseNombre": "Fase 1: Descubrir",  
      "HerramientaNumero": 1,  
      "HerramientaCodigo": "H01",  
      "HerramientaNombre": "Observación (Método AEIOU)",  
      "VistaCodigo": "V01.1",  
      "VistaTitulo": "Registro de Observaciones de Campo (AEIOU)",  
      "VistaUrl": "01-observacion.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 1,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 1 de 11 (Fase 1: Descubrir)",  
      "PasoAnterior": null,  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H02",  
        "HerramientaNombre": "Mapa de Empatía",  
        "VistaUrl": "02-mapa-empatia.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": false,  
      "FechaUltimaActualizacion": "2026-09-15T08:30:00Z",  
      "UsuarioActualRol": "Ejecutor Multidisciplinario"  
    }  
  }  
}

---

#### **Ejemplo 02: Vista en Fase 3 \- Idear (Herramienta 08: Matriz de Priorización \- Vista Actual)**

*Estado del proyecto: Fase 1 y 2 completadas, Fase 3 en curso, Fase 4 pendiente.*

{  
  "\$schema": "./schemas/far-piip-v1.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "En Curso",  
      "Fase4\_Entregar": "Pendiente"  
    },  
    "UbicacionActual": {  
      "FaseNumero": 3,  
      "FaseNombre": "Fase 3: Idear",  
      "HerramientaNumero": 8,  
      "HerramientaCodigo": "H08",  
      "HerramientaNombre": "Matriz de Priorización de Ideas",  
      "VistaCodigo": "V08.1",  
      "VistaTitulo": "Ranking de Selección de la Idea Ganadora",  
      "VistaUrl": "08-matriz-priorizacion.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 8,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 8 de 11 (Fase 3: Idear)",  
      "PasoAnterior": {  
        "HerramientaCodigo": "H07",  
        "HerramientaNombre": "Lluvia de Ideas y Crazy 8's",  
        "VistaUrl": "07-lluvia-ideas.html"  
      },  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H09",  
        "HerramientaNombre": "Prototipado Rápido (Storyboarding)",  
        "VistaUrl": "09-prototipado-rapido.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": true,  
      "FechaUltimaActualizacion": "2026-09-27T10:15:00Z",  
      "UsuarioActualRol": "Facilitador Ágil"  
    }  
  }  
}

---

#### **Ejemplo 03: Vista en Fase 4 \- Entregar (Herramienta 11: Matriz de Riesgos y Tarjetas de Testeo)**

*Estado del proyecto: Fases 1, 2 y 3 completadas, Fase 4 en curso/cierre.*

{  
  "\$schema": "./schemas/far-piip-v1.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "Completado",  
      "Fase4\_Entregar": "En Curso"  
    },  
    "UbicacionActual": {  
      "FaseNumero": 4,  
      "FaseNombre": "Fase 4: Entregar",  
      "HerramientaNumero": 11,  
      "HerramientaCodigo": "H11",  
      "HerramientaNombre": "Matriz de Gestión de Riesgos y Testeo",  
      "VistaCodigo": "V11.1",  
      "VistaTitulo": "Evaluación de Riesgos y Tarjetas de Aprendizaje",  
      "VistaUrl": "11-matriz-riesgos.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 11,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 11 de 11 (Fase 4: Entregar)",  
      "PasoAnterior": {  
        "HerramientaCodigo": "H10",  
        "HerramientaNombre": "Hoja de Ruta (Plan de Acción)",  
        "VistaUrl": "10-plan-accion.html"  
      },  
      "PasoSiguiente": null  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 2,  
      "PermiteIteracionAnterior": true,  
      "FechaUltimaActualizacion": "2026-10-05T16:45:00Z",  
      "UsuarioActualRol": "Administrador UPP"  
    }  
  }  
}

---

### **4\. Desglose Técnico de los Campos y Reglas de Negocio Vinculadas**

1. **`IniciativaIdentificacion`**: Establece el contexto único del proyecto registrado en el Portafolio (Anexo 5). Sirve como clave de mapeo relacional (*Foreign Key*) en `LocalStorage`.  
2. **`EstadoMatrizDobleDiamante`**: Proporciona una lectura instantánea del progreso metodológico en las 4 fases. Permite renderizar indicadores visuales (*Badges*) en el *Dashboard* y en el *Sidebar* compartido.  
3. **`UbicacionActual`**: Identifica de forma determinista qué vista HTML y qué controlador JS (`01-observacion.js`, `08-matriz-priorizacion.js`, etc.) están procesando los datos.  
4. **`PosicionEnFlujo`**: Proporciona la navegación relativa (*Anterior / Siguiente / X de 11*), facilitando el renderizado de botones de navegación en el pie de los formularios.  
5. **`ControlIteracionYTrazabilidad`**:  
   * **`PermiteIteracionAnterior` (`true`)**: Cumple estrictamente con la **Regla de Negocio BR-01** y el **RNF-03**, que prohíben bloquear el retorno a fases anteriores si un prototipo falla en la prueba.  
   * **`VersionIteracion`**: Permite incrementar la versión (v1, v2, etc.) cuando se realiza un bucle de iteración (p. ej., regresar de Fase 4 a Fase 2 o 3\) guardando el histórico sin sobrescribir la evidencia previa.

---

💡 **Siguiente paso sugerido:** Con la estructura de la cabecera `NavegacionYTrazabilidad` definida, podemos proceder a diseñar el **Esquema JSON del Cuerpo de Datos (Body Data Contract)** para la vista en curso (**Fase 3 \- Herramienta 08: Matriz de Priorización de Ideas**), o maquetar la plantilla HTML correspondiente en Tailwind CSS / BEM.

**Chat**. Una consulta técnica, este esquema JSON me debería de servir para el registro de todas las vistasdel proyecto, es correcto, desde la 1era. vista: "app\_sistema\_doble\_diamante/index.html" hasta la última vista: "app\_sistema\_doble\_diamante/fase4/11-matriz-riesgos.html", es correcto, en tal sentido no ¿sería necesario hacerle ajustes o si amerita realizarle ajustes a la propuesta de esquema?.

**Sí, es conceptualmente correcto**: el esquema cubre la totalidad del ciclo de vida del proyecto desde la primera hasta la última vista. Sin embargo, **sí amerita tres (3) ajustes técnicos puntuales de flexibilidad** para que funcione de manera impecable en el 100% de las vistas sin generar errores de ejecución (*null pointer exceptions*) en JavaScript.

El motivo principal es que **`index.html`** no es una "Herramienta Metodológica" (H01 al H11) ni pertenece a una sola "Fase" (1 a 4), sino que es la **Vista General de Control / Dashboard del Portafolio**, desde la cual se monitorea el estado global de la iniciativa.

---

### **💡 Los 3 Ajustes Necesarios para Perfeccionar el Esquema**

1. **Incorporar el campo `TipoVista` en `UbicacionActual`**: Permite al controlador común de navegación (`NavegacionController.js`) saber instantáneamente si debe renderizar el panel gerencial (`DASHBOARD`), una pantalla metodológica (`HERRAMIENTA_METODOLOGICA`) o un documento formal (`REPORTE_EVALUACION`).  
2. **Permitir valores `0` o `null` en Fase y Herramienta para `index.html`**: En la vista de inicio no se está ejecutando una herramienta numerada. Asignar `FaseNumero: 0` y `HerramientaNumero: null` evita forzar datos ficticios.  
3. **Hacer dinámicos y opcionales los accesos directos en `PosicionEnFlujo`**:  
   * En **`index.html`**, no existe una secuencia lineal rígida (*Anterior/Siguiente*), sino accesos directos a cualquiera de las 4 fases.  
   * En la **primera vista** (`01-observacion.html`), `PasoAnterior` es `null` (su botón "Anterior" te regresa a `index.html`).  
   * En la **última vista** (`11-matriz-riesgos.html`), `PasoSiguiente` es `null` (su botón "Siguiente" activa el "Cierre de Fase / Generación de Informe").

---

### **📋 Esquema Ajustado Definitivo: `far-piip-v2.json`**

A continuación, se presenta la versión optimizada del objeto **`NavegacionYTrazabilidad`**, 100% compatible con todas las vistas de la aplicación:

{  
  "\$schema": "./schemas/far-piip-v2.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "En Curso",  
      "Fase4\_Entregar": "Pendiente",  
      "PorcentajeAvanceGlobal": 65.0  
    },  
    "UbicacionActual": {  
      "TipoVista": "HERRAMIENTA\_METODOLOGICA",  
      "FaseNumero": 3,  
      "FaseNombre": "Fase 3: Idear",  
      "HerramientaNumero": 8,  
      "HerramientaCodigo": "H08",  
      "HerramientaNombre": "Matriz de Priorización de Ideas",  
      "VistaCodigo": "V08.1",  
      "VistaTitulo": "Evaluación Multicriterio de Ideas (Deseabilidad, Factibilidad, Viabilidad, Impacto)",  
      "VistaUrl": "08-matriz-priorizacion.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 8,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 8 de 11 (Fase 3: Idear)",  
      "PasoAnterior": {  
        "HerramientaCodigo": "H07",  
        "HerramientaNombre": "Lluvia de Ideas y Crazy 8's",  
        "VistaUrl": "07-lluvia-ideas.html"  
      },  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H09",  
        "HerramientaNombre": "Prototipado Rápido (Storyboarding)",  
        "VistaUrl": "09-prototipado-rapido.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": true,  
      "FechaUltimaActualizacion": "2026-09-27T10:15:00Z",  
      "UsuarioActualRol": "Facilitador Ágil"  
    }  
  }  
}

---

### **🔍 Comparativa Práctica de Payloads: Primera vs. Última Vista**

#### **A. Payload para la 1era Vista: `index.html` (Dashboard General)**

Demuestra cómo el esquema se adapta a la pantalla principal sin romper el código:

{  
  "\$schema": "./schemas/far-piip-v2.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "En Curso",  
      "Fase4\_Entregar": "Pendiente",  
      "PorcentajeAvanceGlobal": 65.0  
    },  
    "UbicacionActual": {  
      "TipoVista": "DASHBOARD",  
      "FaseNumero": 0,  
      "FaseNombre": "Vista General / Portafolio",  
      "HerramientaNumero": null,  
      "HerramientaCodigo": "DASHBOARD",  
      "HerramientaNombre": "Tablero Principal del Doble Diamante",  
      "VistaCodigo": "V00.0",  
      "VistaTitulo": "Estado Global de la Iniciativa PIIP-2026-IN0001",  
      "VistaUrl": "index.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 0,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Inicio / Resumen del Proyecto",  
      "PasoAnterior": null,  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H01",  
        "HerramientaNombre": "Observación (Método AEIOU)",  
        "VistaUrl": "01-observacion.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": false,  
      "FechaUltimaActualizacion": "2026-09-27T10:15:00Z",  
      "UsuarioActualRol": "Facilitador Ágil"  
    }  
  }  
}

---

#### **B. Payload para la Última Vista: `fase4/11-matriz-riesgos.html` (Herramienta 11\)**

Muestra cómo se cierra el flujo y se prepara la emisión del reporte final:

{  
  "\$schema": "./schemas/far-piip-v2.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PIIP-2026-IN0001",  
      "IniciativaNombre": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "UnidadOrganicaResponsable": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "LiderProyecto": "Especialista en Capacitación Agraria"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "Completado",  
      "Fase2\_Definir": "Completado",  
      "Fase3\_Idear": "Completado",  
      "Fase4\_Entregar": "En Curso",  
      "PorcentajeAvanceGlobal": 100.0  
    },  
    "UbicacionActual": {  
      "TipoVista": "HERRAMIENTA\_METODOLOGICA",  
      "FaseNumero": 4,  
      "FaseNombre": "Fase 4: Entregar",  
      "HerramientaNumero": 11,  
      "HerramientaCodigo": "H11",  
      "HerramientaNombre": "Matriz de Gestión de Riesgos y Testeo",  
      "VistaCodigo": "V11.1",  
      "VistaTitulo": "Evaluación de Riesgos y Tarjetas de Aprendizaje",  
      "VistaUrl": "fase4/11-matriz-riesgos.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 11,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Paso 11 de 11 (Fase 4: Entregar)",  
      "PasoAnterior": {  
        "HerramientaCodigo": "H10",  
        "HerramientaNombre": "Hoja de Ruta (Plan de Acción)",  
        "VistaUrl": "fase4/10-plan-accion.html"  
      },  
      "PasoSiguiente": null  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": true,  
      "FechaUltimaActualizacion": "2026-10-05T18:00:00Z",  
      "UsuarioActualRol": "Facilitador Ágil"  
    }  
  }  
}

---

### **🎯 Conclusión**

Con la incorporación de **`TipoVista`**, **`PorcentajeAvanceGlobal`** y el manejo flexible de valores `null` en **`PosicionEnFlujo`**, el esquema **`far-piip-v2.json`** queda blindado para ser utilizado de forma universal en todas las vistas del prototipo.

**Chat**. Ahora vamos a proyectar el esquema JSON para cada unas de las vistas del aplicativo agrupadas bajo la etiqueta: "Proyecto Sistema AGROIDEAS \- PIIP", para las 13 fichas registradas: PIIP-2026-IN0001 \- Plataforma Formativa Blended Learning para Organizaciones Agrarias PIIP-2026-IN0002 \- Sistema Digital de Monitoreo de Planes de Negocio PIIP-2026-IN0003 \- Base de Datos Dinámica de Criterios Legales para Unidades Regionales PIIP-2026-IN0004 \- Lineamientos para la Digitalización Integral de Expedientes de Incentivos PIIP-2026-IN0005 \- Sistema de Alerta Temprana para Riesgos en Ejecución de Incentivos PIIP-2026-IN0006 \- Directiva para Fiscalización Posterior Basada en Riesgos PIIP-2026-IN0007 \- Sistema Digital de Evaluación de Elegibilidad con Georreferenciación (SDEG) PIIP-2026-IN0008 \- Nueva Arquitectura e Infraestructura del Sistema en Línea SEL v2.0 PIIP-2026-IN0009 \- Plataforma Digital de Gestión y Programación de Vacaciones del Personal PIIP-2026-IN0010 \- Implementación de Casilla Electrónica para Notificaciones Institucionales PIIP-2026-IN0011 \- Automatización del Proceso de Rendición de Cuentas de Organizaciones Agrarias PIIP-2026-IN0012 \- Portal de Transparencia Interactivo para Beneficiarios del Programa AGROIDEAS PIIP-2026-IN0013 \- Innovación en la ejecución y acceso a la Estrategia de Emprendimiento de la Mujer Rural e Indígena (EEMRI) Entonces, vamos a ir proyectando en forma progresiva y gradual el esquema documento JSON solicitado por cada vista. Empezar por el registro de: https://waltervasquezpina-arch.github.io/app\_sistema\_doble\_diamante/index.html Te adjunto la vista de la ventana modal del registro de fichas: Vista Registro FIIP \- Registro de Iniciativa 01.png.

Para la vista principal del **Portafolio Institucional de Innovación (PIIP)** (`https://waltervasquezpina-arch.github.io/app_sistema_doble_diamante/index.html`) y el modal **"Registrar Proyecto de Innovación"** capturemos la información de la interfaz.

---

### **1\. Análisis de la Interfaz y Ventana Modal (`index.html`)**

En la ventana modal de registro se identifican los siguientes campos obligatorios de captura de datos:

* **Título del Proyecto**: Campo de texto libre para la denominación de la iniciativa.  
* **Código de Ficha**: Identificador institucional estandarizado (ej. `PIIP-2026-IN0001` a `PIIP-2026-IN0013`).  
* **Fecha de Registro**: Selector de fecha en formato `DD/MM/AAAA`.  
* **Unidad Responsable**: Selector desplegable o texto con la unidad orgánica proponente (ej. `UPDC`, `Unidad de Negocios`, `UAJ`, `UPP`, `URIE`, `CTR`).  
* **Contacto / Líder**: Servidor responsable del proyecto y unidad de organización.  
* **Trazabilidad de Fases (Doble Diamante)**: Selectores individuales de estado para las 4 fases (*1\. Descubrir, 2\. Definir, 3\. Idear, 4\. Entregar*), con valores `Pendiente`, `En Curso` o `Completado`.

---

### **2\. Esquema JSON Completo para la Vista `index.html` y Modal de Registro (`far-piip-v2.json`)**

Este documento JSON representa el **contrato de datos** almacenado en `LocalStorage` bajo la clave `piip_projects`, combinando la **cabecera de navegación** de la vista principal con el **modelo de captura de la ventana modal** y el **listado de las 13 iniciativas del proyecto**:

{  
  "\$schema": "./schemas/far-piip-v2.json",  
  "NavegacionYTrazabilidad": {  
    "IniciativaIdentificacion": {  
      "IniciativaCodigo": "PORTAFOLIO-GLOBAL",  
      "IniciativaNombre": "Portafolio Institucional de Innovación Pública (PIIP) \- AGROIDEAS",  
      "UnidadOrganicaResponsable": "Unidad de Planeamiento y Presupuesto (UPP)",  
      "LiderProyecto": "Responsable de Modernización"  
    },  
    "EstadoMatrizDobleDiamante": {  
      "Fase1\_Descubrir": "En Curso",  
      "Fase2\_Definir": "En Curso",  
      "Fase3\_Idear": "En Curso",  
      "Fase4\_Entregar": "En Curso",  
      "PorcentajeAvanceGlobal": 50.0  
    },  
    "UbicacionActual": {  
      "TipoVista": "DASHBOARD",  
      "FaseNumero": 0,  
      "FaseNombre": "Vista General / Portafolio",  
      "HerramientaNumero": null,  
      "HerramientaCodigo": "DASHBOARD",  
      "HerramientaNombre": "Tablero Principal del Portafolio PIIP",  
      "VistaCodigo": "V00.0",  
      "VistaTitulo": "Portafolio Institucional de Innovación (PIIP) \- Listado Consolidado",  
      "VistaUrl": "index.html"  
    },  
    "PosicionEnFlujo": {  
      "PasoActual": 0,  
      "TotalPasosFlujo": 11,  
      "EtiquetaSecuencia": "Inicio / Control del Portafolio",  
      "PasoAnterior": null,  
      "PasoSiguiente": {  
        "HerramientaCodigo": "H01",  
        "HerramientaNombre": "Observación (Método AEIOU)",  
        "VistaUrl": "01-observacion.html"  
      }  
    },  
    "ControlIteracionYTrazabilidad": {  
      "VersionIteracion": 1,  
      "PermiteIteracionAnterior": false,  
      "FechaUltimaActualizacion": "2026-09-27T10:00:00Z",  
      "UsuarioActualRol": "Administrador UPP"  
    }  
  },  
  "ModalRegistroIniciativa": {  
    "FormularioConfiguracion": {  
      "ModalTitulo": "Registrar Proyecto de Innovación",  
      "CamposEntrada": {  
        "title": {  
          "CampoEtiqueta": "Título del Proyecto",  
          "CampoTipo": "String",  
          "Placeholder": "Ej. Plataforma Digital de...",  
          "Obligatorio": true  
        },  
        "code": {  
          "CampoEtiqueta": "Código de Ficha",  
          "CampoTipo": "String",  
          "Placeholder": "Ej. PIIP-2026-IN0013",  
          "Obligatorio": true  
        },  
        "date": {  
          "CampoEtiqueta": "Fecha de Registro",  
          "CampoTipo": "DateString",  
          "Formato": "DD/MM/AAAA",  
          "Obligatorio": true  
        },  
        "responsible": {  
          "CampoEtiqueta": "Unidad Responsable",  
          "CampoTipo": "SelectEnum",  
          "Opciones": \["UPDC", "UN", "UAJ", "UPP", "USE", "UA-TI", "URIE", "CTR"\],  
          "Obligatorio": true  
        },  
        "contact": {  
          "CampoEtiqueta": "Contacto / Líder",  
          "CampoTipo": "String",  
          "Placeholder": "Ej. Juan Pérez \- UPDC",  
          "Obligatorio": true  
        },  
        "phases\_status": {  
          "CampoEtiqueta": "Trazabilidad de Fases (Doble Diamante)",  
          "Subcampos": {  
            "descubrir": {"Tipo": "Enum", "Valores": \["Pendiente", "En Curso", "Completado"\]},  
            "definir": {"Tipo": "Enum", "Valores": \["Pendiente", "En Curso", "Completado"\]},  
            "idear": {"Tipo": "Enum", "Valores": \["Pendiente", "En Curso", "Completado"\]},  
            "entregar": {"Tipo": "Enum", "Valores": \["Pendiente", "En Curso", "Completado"\]}  
          }  
        }  
      },  
      "BotonesAccion": \[  
        {"Accion": "CANCELAR", "Tipo": "Dismiss"},  
        {"Accion": "GUARDAR PROYECTO", "Tipo": "Submit", "HandlerJS": "guardarNuevoProyecto()"}  
      \]  
    }  
  },  
  "PortafolioPIIP\_Coleccion": \[  
    {  
      "id": 1,  
      "code": "PIIP-2026-IN0001",  
      "title": "Plataforma Formativa Blended Learning para Organizaciones Agrarias",  
      "responsible": "Unidad de Promoción y Desarrollo de Capacidades (UPDC)",  
      "contact": "Especialista en Capacitación Agraria \- UPDC",  
      "date": "2026-09-15",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 2,  
      "code": "PIIP-2026-IN0002",  
      "title": "Sistema Digital de Monitoreo de Planes de Negocio",  
      "responsible": "Unidad de Negocios (UN)",  
      "contact": "Fernando Ademir Loayza Choque \- UN",  
      "date": "2026-09-16",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 3,  
      "code": "PIIP-2026-IN0003",  
      "title": "Base de Datos Dinámica de Criterios Legales para Unidades Regionales",  
      "responsible": "Unidad de Asesoría Jurídica (UAJ)",  
      "contact": "Especialista Legal \- UAJ",  
      "date": "2026-09-17",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 4,  
      "code": "PIIP-2026-IN0004",  
      "title": "Lineamientos para la Digitalización Integral de Expedientes de Incentivos",  
      "responsible": "Unidad de Planeamiento y Presupuesto (UPP)",  
      "contact": "Alex Dario Abad Escalante \- UPP",  
      "date": "2026-09-18",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 5,  
      "code": "PIIP-2026-IN0005",  
      "title": "Sistema de Alerta Temprana para Riesgos en Ejecución de Incentivos",  
      "responsible": "Unidad de Planeamiento y Presupuesto (UPP) / USE",  
      "contact": "Especialista en Monitoreo \- UPP",  
      "date": "2026-09-19",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 6,  
      "code": "PIIP-2026-IN0006",  
      "title": "Directiva para Fiscalización Posterior Basada en Riesgos",  
      "responsible": "Unidad de Planeamiento y Presupuesto (UPP)",  
      "contact": "Analista de Control \- UPP",  
      "date": "2026-09-20",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 7,  
      "code": "PIIP-2026-IN0007",  
      "title": "Sistema Digital de Evaluación de Elegibilidad con Georreferenciación (SDEG)",  
      "responsible": "Dirección Ejecutiva \- Coordinación Técnica Regional (CTR)",  
      "contact": "José Fernando Barturen Torres \- CTR",  
      "date": "2026-09-21",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 8,  
      "code": "PIIP-2026-IN0008",  
      "title": "Nueva Arquitectura e Infraestructura del Sistema en Línea SEL v2.0",  
      "responsible": "Unidad de Administración (UA) \- TI",  
      "contact": "Arquitecto de Software \- TI",  
      "date": "2026-09-22",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 9,  
      "code": "PIIP-2026-IN0009",  
      "title": "Plataforma Digital de Gestión y Programación de Vacaciones del Personal",  
      "responsible": "Unidad de Administración (UA) \- Recursos Humanos",  
      "contact": "Especialista en RRHH \- UA",  
      "date": "2026-09-23",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 10,  
      "code": "PIIP-2026-IN0010",  
      "title": "Implementación de Casilla Electrónica para Notificaciones Institucionales",  
      "responsible": "Unidad de Planeamiento y Presupuesto (UPP) / UA",  
      "contact": "Especialista en Trámite Documentario \- UPP",  
      "date": "2026-09-24",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 11,  
      "code": "PIIP-2026-IN0011",  
      "title": "Automatización del Proceso de Rendición de Cuentas de Organizaciones Agrarias",  
      "responsible": "Unidad de Reconversión e Intervenciones Especiales (URIE)",  
      "contact": "Sergio Antonio Haro Muñoz \- URIE",  
      "date": "2026-09-25",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 12,  
      "code": "PIIP-2026-IN0012",  
      "title": "Portal de Transparencia Interactivo para Beneficiarios del Programa AGROIDEAS",  
      "responsible": "Unidad de Reconversión e Intervenciones Especiales (URIE)",  
      "contact": "Sergio Antonio Haro Muñoz \- URIE",  
      "date": "2026-09-26",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    },  
    {  
      "id": 13,  
      "code": "PIIP-2026-IN0013",  
      "title": "Innovación en la ejecución y acceso a la Estrategia de Emprendimiento de la Mujer Rural e Indígena (EEMRI)",  
      "responsible": "Dirección Ejecutiva / URIE / UPDC",  
      "contact": "Jorge Augusto Amaya Castillo \- Director Ejecutivo",  
      "date": "2026-09-27",  
      "phases": {  
        "descubrir": "Completado",  
        "definir": "Completado",  
        "idear": "En Curso",  
        "entregar": "Pendiente"  
      }  
    }  
  \]  
}

---

### **3\. Aspectos Destacados de esta Primera Proyección**

1. **Atención a las Fuentes de Información**: Las 13 iniciativas se han mapeado con sus unidades proponentes reales asignadas en las Evaluaciones de Opinión Técnica (Anexos 4).  
2. **Conexión entre Modal y Persistencia**: Al hacer clic en *"GUARDAR PROYECTO"*, la función JavaScript lee los valores del modal y hace un `PUSH` al array `PortafolioPIIP_Coleccion`, guardando la actualización en `LocalStorage` sin recargar la página.  
3. **Estado Metodológico Progresivo**: Cada iniciativa muestra el estado actual correspondiente al avance de trabajo (*Fases 1 y 2 Completadas, Fase 3 Idear En Curso, Fase 4 Pendiente*).

---

**Chat**. Observo que tienes el código: "PortafolioPIIP\_Coleccion", con sus respectivos valores, asimismo, tienes el código: "NavegacionYTrazabilidad" con sus respectivos, valores, ahora hagamos el siguiente análisis: voy a tener un registro de una ficha en el  registro "código:valor" del campo: "PortafolioPIIP\_Coleccion", que a su ves tiene que vincularse con el registro de las diferentes herramientas que son once (11) que se desarrollan a través de las cuatro (4) fases,  entonces por ejemplo:

\- PIIP-2026-IN0001, podría tener registros en cinco (5) Herramientas en diferentes fases 

\- PIIP-2026-IN0002, podría tener registros en siete (7) Herramientas en diferentes fases 

\- PIIP-2026-IN0003, podría tener registros en cuatro (4) Herramientas en diferentes fases

El esquema actual me va a permitir que el sistema realice la trazabilidad de estos registros sin errar en la lectura carga, y posterior edicion de los mismos.

Revisar, asimismo, el registro como lo viene realizando actualmente el sistema, para lo cual revisar el documento: "Estructura del archivo: seed.json" agrupado bajo la etiqueta: "Proyecto Sistema AGROIDEAS \- PIIP".

Luego de revisar las fuentes y de haber ejecutado la revisión, análisis y evaluación, generar una respuesta y sustentar dicha respuesta.

 

