/**
 * useDesignerUiConfig — hook React del mapa consolidado de UI (TASK-RUNTIME-015).
 *
 * Lee la configuración canónica del provider de SISAD PDFME cuando existe y
 * cae a `OptionsContext` para compatibilidad .
 */
import { useContext, useMemo } from 'react';
import { OptionsContext } from '@sisad-pdfme/ui/contexts';
import { SisadPdfmeContext } from '@sisad-pdfme/react/SisadPdfmeContext';
import { buildDesignerUiMap, buildDesignerUiMapFromResolvedConfig, type ResolvedDesignerUiMap } from '@sisad-pdfme/ui/components/Designer/shared/designerUiConfig';

export const useDesignerUiConfig = (): ResolvedDesignerUiMap => {
  const providerValue = useContext(SisadPdfmeContext);
  const options = useContext(OptionsContext);
  return useMemo(
    () =>
      providerValue
        ? buildDesignerUiMapFromResolvedConfig(providerValue.config)
        : buildDesignerUiMap(options),
    [options, providerValue],
  );
};
