# Prototipo PIIP - Portafolio Institucional de Innovación Pública

Bienvenido al repositorio del **Prototipo PIIP** (Portafolio Institucional de Innovación Pública) para **AGROIDEAS**. Esta aplicación web sirve como una plataforma centralizada para la gestión, seguimiento y desarrollo de proyectos e iniciativas de innovación, alineándose estrechamente con la metodología del **Doble Diamante**.

## 📌 Finalidad y Alcance

El aplicativo fue concebido para dotar a AGROIDEAS de un entorno unificado donde los especialistas y responsables de área puedan registrar iniciativas innovadoras y conducirlas metódicamente a través de las 4 fases fundamentales del diseño centrado en el usuario: **Descubrir, Definir, Idear y Entregar**.

La herramienta proporciona una trazabilidad completa del estado y progreso de cada proyecto, facilitando el registro sistemático de:
*   Observaciones de campo y empatía con usuarios.
*   Arquetipos y desafíos (Problemas reales).
*   Lluvia de ideas, prototipados y validaciones ágiles.
*   Planificación estratégica (Planes de Acción) y gestión de riesgos.

## 🚀 Pila Tecnológica

Este proyecto se ha desarrollado siguiendo un enfoque **Vanilla / Frontend-Only** con persistencia en el navegador, para garantizar su rápido despliegue y validación conceptual antes de una escalabilidad en el backend institucional.

*   **Estructura y Estilos:** HTML5, Tailwind CSS (vía CDN para el prototipado), y componentes de diseño de UI modernos.
*   **Interactividad:** JavaScript (Vanilla ES6+).
*   **Iconografía:** Lucide Icons.
*   **Tablas y Manejo de Datos:** DataTables.js (con soporte de jQuery) optimizado para grandes volúmenes de registros y búsquedas fluidas.
*   **Persistencia:** `localStorage` nativo del navegador, simulando un motor de base de datos relacional mediante la gestión de entidades y claves foráneas (`projectId`).

## 📁 Estructura del Repositorio

Para el desarrollador institucional o líder técnico de AGROIDEAS que asumirá la implementación del servidor, el código fuente está organizado de manera semántica:

*   `index.html`: Dashboard principal y portafolio consolidado con 13 iniciativas oficiales.
*   `fase1/`: Módulos de la Fase 1 Descubrir (`01-observacion.html`, `02-mapa-empatia.html`, `03-encuestas.html`).
*   `fase2/`: Módulos de la Fase 2 Definir (`04-ficha-persona.html`, `05-grupos-focales.html`, `06-definicion-desafio.html`).
*   `fase3/`: Módulos de la Fase 3 Idear (`07-lluvia-ideas.html`, `08-matriz-priorizacion.html`, `09-prototipado-rapido.html`).
*   `fase4/`: Módulos de la Fase 4 Entregar (`10-plan-accion.html`, `11-matriz-riesgos.html`).
*   `js/database.js`: Capa Mock ORM Local-First (CRUD y migraciones hacia `localStorage`).
*   `js/app.js`: Controlador maestro de la interfaz, eventos del DOM, DataTables y asistentes interactivos.
*   `js/layout.js`: Gestor dinámico del Sidebar global, Breadcrumb metodológico y carga secuencial de dependencias.
*   `data/seed.js`: Base de datos semilla oficial precargada con las 13 iniciativas institucionales de AGROIDEAS.
*   `doc/`: Carpeta de documentación técnica profunda y documento orientador maestro.

## 📚 Documentación Técnica Detallada

Para comprender la arquitectura lógica, la relación de los datos y los flujos, consulte los archivos en la carpeta `/doc/`:

0.  [`00_DOCUMENTO_ORIENTADOR_SISTEMA_PIIP.md`](./doc/00_DOCUMENTO_ORIENTADOR_SISTEMA_PIIP.md): **Documento Orientador Maestro integral del aplicativo.**
1.  [`01_Objetivo_Metodologia.md`](./doc/01_Objetivo_Metodologia.md): Descripción de los enfoques metodológicos y las 11 herramientas.
2.  [`02_Arquitectura_Stack.md`](./doc/02_Arquitectura_Stack.md): Análisis detallado de la infraestructura front-end actual y ruta hacia el backend.
3.  [`03_Diccionario_Datos.md`](./doc/03_Diccionario_Datos.md): Esquema completo de entidades, relaciones y almacenamiento en `localStorage`.
4.  [`04_Flujos_Eventos.md`](./doc/04_Flujos_Eventos.md): Ciclo de vida de la aplicación, secuencia de arranque y flujos de usuario principales.

## ⚙️ Instrucciones de Despliegue (Local)

Dado que es una solución puramente de front-end, no se requieren dependencias de Node.js o Python para su ejecución inicial.

1.  **Clonar el repositorio.**
2.  **Servidor Local:** Puede utilizar la extensión *Live Server* en VS Code o cualquier servidor estático local (`python -m http.server 8000`) ejecutado en la raíz del proyecto.
3.  **Apertura:** Acceda a `http://localhost:8000/index.html`.

---
*Documento generado automatizadamente para el Oficial/Desarrollador Web de AGROIDEAS.*
