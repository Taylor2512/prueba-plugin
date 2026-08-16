/**
 * API pública del laboratorio de ejemplos del runtime reusable.
 *
 * `getLab()` devuelve las rutas ya resueltas para el router del host; el resto
 * de exports son la superficie que consumen tests e integraciones.
 */
import { buildRouteDefinitions } from './pages.jsx';

export function getLab() {
  return buildRouteDefinitions().map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
}
