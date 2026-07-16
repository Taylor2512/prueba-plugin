# Playbook — continuidad visual y migración Tailwind

## 1. Intake

- Confirmar una sola tarjeta activa.
- Cargar contexto, regla principal y checklist de este paquete.
- Anotar baseline de `@apply`, estilos inline y selectores de la región.

## 2. Trazabilidad

- Ubicar componente, constantes, CSS y pruebas de la región.
- Construir una tabla selector → consumidor → estado → reemplazo JSX/TSX.
- Identificar contratos que deben permanecer en CSS.

## 3. Cambio mínimo

- Mover utilidades estáticas al elemento propietario.
- Sustituir concatenaciones inseguras por mapas de clases completas.
- Mantener estilos calculados por runtime como valores dinámicos.
- Eliminar solamente reglas sin consumidores comprobados.

## 4. Validación

- Ejecutar `scripts/tailwind-continuity-audit.sh`.
- Ejecutar typecheck, lint y pruebas focalizadas disponibles.
- Verificar `/lab/multi-document-routing` en los estados definidos por la tarjeta.
- Comparar baseline y capturas a viewport fijo.

## 5. Cierre

- Registrar archivos, conteos y evidencia.
- Si pasa, mover la tarjeta a `completed/` y activar una sola dependencia lista.
- Si falla, conservar la tarjeta activa y documentar el bloqueo sin encadenar arreglos ajenos.
