# 3. Diccionario de Datos y Entidades

El aplicativo utiliza `localStorage` simulando una estructura de Base de Datos Documental / Relacional. Los objetos JSON almacenados actúan como tablas, las matrices como filas y las propiedades de objetos como columnas.

A continuación, la estructura técnica que el desarrollador Backend deberá traducir a esquemas de Base de Datos (ej. SQL o NoSQL).

## 3.1 Entidad: Proyectos (`piip_projects`)

Tabla maestra que consolida cada iniciativa de innovación.

| Campo | Tipo de Dato (JS) | Descripción / Reglas de Negocio |
| :--- | :--- | :--- |
| `id` | `Integer` | Clave primaria autoincremental. |
| `title` | `String` | Título de la iniciativa/proyecto. |
| `code` | `String` | Código identificador institucional (Ej. PIIP-2026-IN0013). |
| `date` | `DateString` | Fecha de registro en formato YYYY-MM-DD. |
| `responsible` | `String` | Unidad orgánica responsable (Ej. UPDC, UPP). |
| `contact` | `String` | Nombre y cargo del especialista o líder del proyecto. |
| `phases` | `Object` | Objeto embebido que rastrea el progreso metodológico. Contiene 4 claves (`descubrir`, `definir`, `idear`, `entregar`) con los posibles valores ENUM: `'pending'`, `'active'`, `'completed'`. |

## 3.2 Entidades Dependientes (Fase 1: Descubrir)

### AEIOU / Observaciones (`piip_observations`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | PK. |
| `projectId` | `Integer` | FK vinculada a `piip_projects.id`. |
| `activity` | `String` | Descripción de las actividades observadas. |
| `environment`| `String` | Descripción del entorno físico o digital. |
| `interactions`| `String` | Descripción de interacciones. |
| `objects` | `String` | Descripción de herramientas u objetos empleados. |
| `users` | `String` | Descripción de los usuarios involucrados. |
| `date` | `DateString` | Fecha de la observación. |

### Mapas de Empatía (`piip_empathy`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | PK. |
| `projectId` | `Integer` | FK. |
| `segment` | `String` | Segmento de usuario analizado (Ej. Productor Cacaotero). |
| `think_feel` | `String` | ¿Qué piensa y siente? |
| `hear` | `String` | ¿Qué escucha? |
| `see` | `String` | ¿Qué ve? |
| `say_do` | `String` | ¿Qué dice y hace? |
| `pain` | `String` | Frustraciones (Pain). |
| `gain` | `String` | Alegrías o motivaciones (Gain). |

## 3.3 Entidades Dependientes (Fase 2: Definir)

### Personas/Arquetipos (`piip_personas`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | PK. |
| `projectId` | `Integer` | FK. |
| `name` | `String` | Nombre representativo del arquetipo. |
| `role` | `String` | Rol, cargo u ocupación. |
| `demographics`| `String` | Datos demográficos. |
| `goals` | `String` | Objetivos principales. |
| `frustrations`| `String` | Puntos de dolor. |
| `behavior` | `String` | Comportamientos típicos o hábitos. |

### Desafíos de Innovación (`piip_desafios`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Integer` | PK. |
| `projectId` | `Integer` | FK. |
| `hmw` | `String` | Pregunta "How Might We..." (Cómo podríamos...). |
| `insight` | `String` | Hallazgo revelador que origina la pregunta. |
| `impact` | `String` | ENUM: 'Alto', 'Medio', 'Bajo'. |
| `feasibility` | `String` | ENUM: 'Alta', 'Media', 'Baja'. |

## 3.4 Entidades Dependientes (Fase 3 y 4)

(Nota: El patrón de FK `projectId` se repite consistentemente para Lluvia de Ideas (`piip_ideas`), Prototipos (`piip_prototypes`), Plan de Acción (`piip_action_plans`) y Matriz de Riesgos (`piip_risks`)).

## 3.5 Estructura Clave Valor (KV)

*   `active_project_id`: Almacena un entero (`Integer`). Si el valor es null, indica que el usuario debe seleccionar un proyecto en el dashboard antes de usar las herramientas.
