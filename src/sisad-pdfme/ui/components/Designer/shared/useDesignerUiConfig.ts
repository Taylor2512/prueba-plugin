/**
 * useDesignerUiConfig — hook React del mapa consolidado de UI (TASK-RUNTIME-015).
 *
 * Lee las options del runtime (OptionsContext) y expone un
 * `ResolvedDesignerUiMap` memoizado. Los componentes preguntan al mapa; no
 * reconstruyen reglas de visibility/permisos por su cuenta.
 */
import { useContext, useMemo } from 'react';
import { OptionsContext } from '../../../contexts.js';
import { buildDesignerUiMap, type ResolvedDesignerUiMap } from './designerUiConfig.js';

export const useDesignerUiConfig = (): ResolvedDesignerUiMap => {
  const options = useContext(OptionsContext);
  return useMemo(() => buildDesignerUiMap(options), [options]);
};
