import type React from 'react';

/**
 * Contexto entregado al header contextual del sidebar derecho.
 *
 * Permite que el host renderice un header distinto según el panel activo
 * y la cantidad de schemas seleccionados sin acoplarse a `RightSidebar`.
 */
export type RightSidebarContextHeaderContext = {
  /** Modo/panel efectivo que se está mostrando en el sidebar. */
  mode: 'list' | 'detail' | 'bulk' | 'docs' | 'comments';

  /** Cantidad de schemas activos/seleccionados. */
  activeCount: number;
};

/**
 * Definición flexible del header contextual del sidebar derecho.
 *
 * Puede ser:
 *
 * - un nodo React estático;
 * - una función que recibe contexto y devuelve un nodo;
 * - undefined/null, en cuyo caso no se renderiza contenido extra.
 */
export type RightSidebarContextHeader = React.ReactNode | ((ctx: RightSidebarContextHeaderContext) => React.ReactNode);

/**
 * Resuelve el contenido contextual del header del sidebar derecho.
 *
 * @param contextHeader Nodo o factory provisto por el host.
 * @param context Contexto del modo activo y cantidad de selección.
 * @returns Nodo React final o null cuando no existe header contextual.
 */
export const resolveRightSidebarContextHeader = (
  contextHeader: RightSidebarContextHeader | undefined,
  context: RightSidebarContextHeaderContext,
): React.ReactNode => {
  if (typeof contextHeader === 'function') {
    return contextHeader(context);
  }

  return contextHeader ?? null;
};
