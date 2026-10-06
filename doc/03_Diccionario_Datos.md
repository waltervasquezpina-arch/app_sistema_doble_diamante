# 3. Diccionario de Datos y Entidades

El aplicativo implementa un modelo de datos documental **Local-First** almacenado bajo una única clave principal en el navegador: `localStorage.getItem('piip_agroideas_db')`.

Dicho objeto JSON raíz actúa como una base de datos relacional simulada, donde las claves de primer nivel corresponden a colecciones (tablas), los arreglos de objetos representan filas (registros) y las propiedades definen atributos con tipos de datos e integridad referencial forzada vía `projectId` y `projectCode`.

---

## 3.1 Metadatos Globales de la Base de Datos

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `_schemaVersion` | `Integer` | Versión del esquema actual (ej. 18). Permite migraciones automáticas incrementales desde `seed.js`. |
| `_source` | `String` | Fuente documental de los datos ("Fichas de Iniciativa IN0001-IN0013"). |
| `_generated` | `DateString` | Fecha de generación del seed (YYYY-MM-DD). |
| `active_project_id` | `Integer / Null` | Clave de sesión que determina la iniciativa activa en el contexto global de la UI. |

---

## 3.2 Colección de Usuarios y Roles (`users`)

Define los actores del sistema para simular permisos y trazabilidad de autoría (RBAC simplificado).

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria única. |
| `name` | `String` | Nombre completo del usuario / especialista. |
| `role` | `String` | Rol institucional: `'Administrador'`, `'Líder'`, `'Equipo'`, `'Instancia Decisora'`. |

---

## 3.3 Entidad Maestra: Proyectos e Iniciativas (`projects`)

Tabla central del Portafolio Institucional (PIIP) que consolida las 13 iniciativas de innovación.

| Campo | Tipo | Descripción y Reglas de Negocio |
| :--- | :--- | :--- |
| `id` | `Integer` | Identificador autoincremental primario (1 a 13). |
| `code` | `String` | Código único oficial (ej. `PIIP-2026-IN0001` a `PIIP-2026-IN0013`). |
| `title` | `String` | Título oficial de la iniciativa de innovación pública. |
| `status` | `String` | Fase resumen actual (ej. "Fase 1: Descubrir", "Fase 3: Idear"). |
| `responsible` | `String` | Unidad orgánica responsable (UPDC, UPP, UN, UAJ, etc.). |
| `contact` | `String` | Especialista responsable o datos de contacto. |
| `date` | `DateString` | Fecha de formulación o registro (YYYY-MM-DD). |
| `phases` | `Object` | Objeto que registra el avance por fase metodológica: `{ descubrir, definir, idear, entregar }`. Cada clave contiene un ENUM: `'pending'`, `'active'`, `'completed'`. |

---

## 3.4 Entidades de la Fase 1: Descubrir

### Observaciones AEIOU (`aeiou`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | Clave foránea referenciando a `projects.id`. |
| `projectCode`| `String` | Código del proyecto asociado (`PIIP-2026-IN00xx`). |
| `activity` | `String` | Acciones y tareas observadas que realizan los usuarios. |
| `environment`| `String` | Características del entorno físico o digital. |
| `interactions`| `String` | Relaciones sociales y dinámicas entre personas y sistemas. |
| `objects` / `object` | `String` | Dispositivos, formularios o herramientas empleadas. |
| `users` | `String` | Roles y actores identificados en la observación. |
| `date` | `DateString` | Fecha de ejecución del levantamiento de información. |

### Mapas de Empatía (`empathyMap`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK vinculada a `projects.id`. |
| `projectCode`| `String` | FK de código institucional. |
| `segment` | `String` | Segmento o tipología de usuario (ej. "Productor Agrario Cacaotero"). |
| `think_feel` | `String` | ¿Qué piensa y siente el usuario? (Preocupaciones y anhelos). |
| `hear` | `String` | ¿Qué escucha en su entorno? (Influencia comunitaria). |
| `see` | `String` | ¿Qué observa en su contexto cotidiano? |
| `say_do` | `String` | ¿Qué expresa y cómo actúa en la práctica? |
| `pain` | `String` | Dolores, frustraciones y obstáculos que enfrenta. |
| `gain` | `String` | Beneficios esperados, logros y deseos de éxito. |

### Encuestas de Campo (`surveys`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código institucional asociado. |
| `title` | `String` | Nombre o propósito del instrumento aplicado. |
| `sampleSize` | `Integer` | Número de ciudadanos o productores encuestados. |
| `targetSegment`| `String` | Grupo objetivo encuestado. |
| `channel` | `String` | Canal de recolección (Presencial en campo, Teléfono, WhatsApp, Web). |
| `keyFindings` | `String` | Hallazgos estadísticos y cualitativos más relevantes. |
| `satisfactionScore`| `Number` | Calificación promedio (escala 1 a 5 o porcentaje). |
| `date` | `DateString` | Fecha del levantamiento de la encuesta. |

---

## 3.5 Entidades de la Fase 2: Definir

### Ficha de Persona / Arquetipos (`personas`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `name` | `String` | Nombre ficticio representativo del arquetipo. |
| `role` | `String` | Ocupación o posición (ej. "Presidente de Cooperativa"). |
| `demographics`| `String` | Ubicación, edad, lengua materna y nivel tecnológico. |
| `goals` | `String` | Metas clave que busca alcanzar. |
| `frustrations`| `String` | Puntos de dolor principales y fricciones normativas. |
| `behavior` | `String` | Hábitos y pautas de comportamiento comunes. |
| `quote` | `String` | Cita textual verídica ("voz del usuario"). |

### Muro de Hallazgos e Insights (`insights`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `title` | `String` | Enunciado sintético del insight revelador. |
| `description`| `String` | Contexto explicativo de la evidencia encontrada. |
| `category` | `String` | Clasificación cualitativa (Operativo, Tecnológico, Legal, Cultural). |
| `evidenceQuote`| `String` | Cita de respaldo obtenida en campo o focus groups. |
| `importance` | `String` | Nivel de relevancia: `'Alta'`, `'Media'`, `'Baja'`. |
| `validated` | `Boolean` | Flag indicando si el insight ha sido verificado por el equipo. |

### Definición del Desafío HMW (`desafios`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `hmw` | `String` | Pregunta formulada: "¿Cómo podríamos [acción] para [usuario] de modo que [impacto]?". |
| `userNeed` | `String` | Necesidad central no satisfecha identificada. |
| `insight` | `String` | Insight sobre el cual se sustenta la formulación. |
| `impact` | `String` | Impacto proyectado: `'Alto'`, `'Medio'`, `'Bajo'`. |
| `feasibility` | `String` | Factibilidad técnica e institucional estimada. |
| `status` | `String` | Estado de priorización: `'Priorizado'`, `'En evaluación'`, `'Descartado'`. |

---

## 3.6 Entidades de la Fase 3: Idear

### Lluvia de Ideas y Crazy 8's (`brainstorming`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `idea` | `String` | Enunciado de la idea de solución planteada. |
| `category` | `String` | Categoría temática (Digital, Procesos, Normativa, Capacitación). |
| `votes` | `Integer` | Contador acumulado de votos otorgados por el equipo ágil. |
| `author` | `String` | Miembro del equipo o actor formulador de la propuesta. |

### Matriz de Priorización de Ideas (`ideas`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `title` | `String` | Título descriptivo de la alternativa evaluada. |
| `impact` | `Integer (1-5)`| Nivel de impacto en valor público y beneficiarios. |
| `viability` | `Integer (1-5)`| Viabilidad presupuestal y de gobernanza interna. |
| `feasibility`| `Integer (1-5)`| Factibilidad técnica y regulatoria. |
| `innovation` | `Integer (1-5)`| Grado de novedad o diferenciación de la solución. |
| `totalScore` | `Integer (4-20)`| Suma ponderada automática (`impact + viability + feasibility + innovation`). |
| `isWinner` | `Boolean` | Identificador de la idea ganadora seleccionada para prototipado. |

### Prototipos y Storyboards (`prototypes`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `name` | `String` | Nombre del prototipo (Storyboard, Maqueta, Wireframe, Flujo). |
| `type` | `String` | Modalidad de prototipo (Conceptual, Funcional, Servicio). |
| `imageUrl` | `String` | Enlace a recurso visual o storyboard representativo. |
| `description`| `String` | Explicación detallada de la hipótesis y flujo probado. |
| `feedback` | `String` | Retroalimentación preliminar obtenida de los usuarios. |

---

## 3.7 Entidades de la Fase 4: Entregar

### Plan de Acción y Roadmap (`actionPlans`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `phase` | `String` | Etapa del plan (ej. "Piloto Fase 1", "Diseño Técnico", "Despliegue"). |
| `activity` | `String` | Tarea específica a ejecutar. |
| `leader` | `String` | Servidor o unidad responsable de la actividad. |
| `startDate` | `DateString` | Fecha inicial proyectada (YYYY-MM-DD). |
| `endDate` | `DateString` | Fecha de entrega comprometida (YYYY-MM-DD). |
| `status` | `String` | Estado de ejecución: `'Pendiente'`, `'En curso'`, `'Completado'`. |

### Matriz de Gestión de Riesgos y Testeo (`risks`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria. |
| `projectId` | `Integer` | FK hacia `projects.id`. |
| `projectCode`| `String` | Código del proyecto. |
| `riskDescription` / `description` | `String` | Descripción del evento adverso potencial. |
| `riskType` | `String` | Categoría (Operativo, Tecnológico, Legal, Social/Cultural). |
| `probability`| `String` | Nivel de probabilidad: `'Alta'`, `'Media'`, `'Baja'`. |
| `impact` | `String` | Nivel de impacto institucional: `'Alto'`, `'Medio'`, `'Bajo'`. |
| `level` | `String` | Severidad calculada algorítmicamente (`'Alto'`, `'Medio'`, `'Bajo'`). |
| `mitigationStrategy` / `mitigation` | `String` | Medidas y planes de contingencia para neutralizar el riesgo. |
| `testResult` | `String` | Resultado de la validación o tarjeta de aprendizaje con usuarios. |

