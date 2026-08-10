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

*   `index.html`: Dashboard principal y portafolio consolidado de proyectos.
*   `01-observacion.html` a `11-matriz-riesgos.html`: Módulos específicos correspondientes a las distintas herramientas metodológicas.
*   `js/database.js`: Capa de datos del cliente (CRUD hacia localStorage). Simula las transacciones y relaciones de entidades.
*   `js/app.js`: Lógica de la interfaz, eventos del DOM, manejo de Datatables y coordinación visual.
*   `js/layout.js`: Controlador que inyecta componentes globales como el menú lateral (Sidebar).
*   `data/seed.js`: Base de datos de prueba pre-cargada para facilitar la evaluación de la herramienta.
*   `doc/`: Carpeta de documentación técnica profunda.

## 📚 Documentación Técnica Detallada

Para comprender la arquitectura lógica, la relación de los datos y los flujos, consulte los siguientes archivos en la carpeta `/doc/`:

1.  [`01_Objetivo_Metodologia.md`](./doc/01_Objetivo_Metodologia.md): Descripción de los enfoques metodológicos.
2.  [`02_Arquitectura_Stack.md`](./doc/02_Arquitectura_Stack.md): Análisis detallado de la infraestructura front-end actual y ruta hacia el backend.
3.  [`03_Diccionario_Datos.md`](./doc/03_Diccionario_Datos.md): Esquema de entidades, relaciones y almacenamiento en localStorage.
4.  [`04_Flujos_Eventos.md`](./doc/04_Flujos_Eventos.md): Ciclo de vida de la aplicación y flujos de usuario principales.

## ⚙️ Instrucciones de Despliegue (Local)

Dado que es una solución puramente de front-end, no se requieren dependencias de Node.js o Python para su ejecución inicial.

1.  **Clonar el repositorio.**
2.  **Servidor Local:** Puede utilizar la extensión *Live Server* en VS Code o cualquier servidor estático local (`python -m http.server 8000`) ejecutado en la raíz del proyecto.
3.  **Apertura:** Acceda a `http://localhost:8000/index.html`.

---
*Documento generado automatizadamente para el Oficial/Desarrollador Web de AGROIDEAS.*
