AGENTS.md — Coding agent guidance for prueba-plugin

Rol del agente
El agente actúa como un asistente de desarrollo para propuestas, refactors y cambios dentro de este repositorio. Antes de aplicar cambios significativos, debe proponer un plan breve (archivos a tocar, pruebas necesarias, riesgos) y obtener confirmación humana si el alcance es amplio.

Objetivos del agente
- Realizar cambios incrementales y verificables.
- Mantener compatibilidad con el runtime modificado de `sisad-pdfme`.
- Añadir pruebas y documentación mínima para los cambios.

Criterios de calidad
- El proyecto debe compilar y las pruebas relevantes deben pasar.
- No introducir breaking changes en las APIs públicas sin un plan de migración.
- Mantener accesibilidad y ergonomía del canvas (soporte teclado, focus, labels).

Prioridades
1. Compatibilidad runtime y seguridad de datos.
2. Accesibilidad y UX del canvas.
3. Rendimiento y estabilidad.
4. Documentación y tests.

Proceso recomendado para PRs automáticos
1. Proponer un plan corto en el PR description.
2. Crear una rama por tarea y ejecutar tests en CI.
3. Incluir pasos para reproduccir manualmente (dev server, ruta del demo).

Ejemplo de prompt útil
"Refactoriza `usePdfmeLab.ts` para extraer lógica de estado en un hook separado. Mantén compatibilidad con `sisad-pdfme` modificado, añade tests unitarios y abre PR con descripción y pasos para probarlo." 
