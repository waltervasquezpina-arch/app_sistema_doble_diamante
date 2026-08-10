# 2. Arquitectura de Software y Pila Tecnológica

## 2.1 Visión Arquitectónica (Prototipo Actual vs. Producción)

Actualmente, el **Prototipo PIIP** funciona bajo una arquitectura **Client-Side Rendering (CSR)** pura, orientada a la validación rápida (Mock Architecture). Toda la capa de persistencia se inyecta en el navegador (Local Storage), lo cual permite una interacción de cero latencia, pero carece de centralización real de datos institucionales.

La visión a futuro (Paso a Producción) exige migrar este diseño a una arquitectura cliente-servidor tradicional o Serverless, donde `js/database.js` sea reemplazado por llamadas asíncronas (`fetch` / `axios`) a una API RESTful o GraphQL.

## 2.2 Stack Tecnológico Frontend (Capa de Presentación)

*   **HTML5 Semántico:** Múltiples Entry Points (Multipage Application - MPA) agrupados por herramientas (ej. `01-observacion.html`).
*   **Tailwind CSS (v3.x / CDN):** Framework utilitario de CSS.
    *   *Nota Técnica para Producción:* El uso actual mediante `<script src="https://cdn.tailwindcss.com"></script>` está reservado estrictamente para desarrollo/prototipado. El Oficial de Desarrollo de AGROIDEAS **deberá** integrar Tailwind mediante Node.js/PostCSS (`npm install tailwindcss`) y generar un bundle de CSS estático para eliminar el warning en consola y optimizar los tiempos de carga en producción.
*   **JavaScript (ES6+):** Uso de Vanilla JS para la lógica de negocio del frontend. Sin frameworks reactivos (React/Vue/Angular) para facilitar el mantenimiento por desarrolladores con perfiles tradicionales de Backend/Fullstack.
*   **jQuery y DataTables.js:** Librerías estándar adoptadas para el manejo avanzado de tablas de datos, debido a su robustez en paginación, filtros y ordenamiento del portafolio.
*   **Lucide Icons:** Conjunto de iconografía vectorial ligera. Se inicializan globalmente vía `lucide.createIcons()`.

## 2.3 Estructura de Componentes JS

El código está modularizado (dentro de los límites de una arquitectura sin empaquetador) en los siguientes núcleos:

1.  **`js/layout.js`:** Componente transversal. Evalúa el DOM al cargar e inyecta dinámicamente la barra de navegación lateral (Sidebar). Se encarga de la lógica de menús colapsables y la iluminación (active state) del enlace correspondiente a la URL actual.
2.  **`js/database.js`:** Capa de abstracción de datos (Mock ORM). Todas las funciones expuestas simulan un CRUD asíncrono sincrónico hacia el `localStorage`.
    *   Implementa funciones relacionales como `guardarObservacion()` que exigen un `projectId` válido.
    *   Gestiona el "Proyecto Activo" de la sesión del usuario.
3.  **`data/seed.js`:** Script de inicialización (Seeders). Pre-puebla el `localStorage` con proyectos falsos (Mock Data) si detecta que la base de datos local está vacía, para permitir una experiencia de demostración inmediata.
4.  **`js/app.js`:** Controlador Maestro. Maneja los selectores del DOM, inicialización de DataTables, validaciones de formularios HTML, formateo de fechas y delegación de eventos (`onClick`, `onSubmit`).

## 2.4 Patrón de Estado: "Proyecto Activo"

Dado que el aplicativo requiere el uso de casi una docena de herramientas sobre un mismo proyecto, se implementó el patrón de estado **Global Active Entity**.
En el `localStorage`, existe una clave `active_project_id`.
Cada vez que un usuario ingresa a una herramienta (ej. Mapa de Empatía) e intenta crear un registro, el frontend inyecta automáticamente este `active_project_id` en el Payload del nuevo registro. Esto garantiza la integridad referencial sin tener que pasar parámetros constantes por la URL.
