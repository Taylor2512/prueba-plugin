import type { ResolvedSisadPdfmeConfig, SisadPdfmeVisibilityConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';
import { shouldShowInspectorSection } from '@sisad-pdfme/ui/components/Designer/shared/visibilityConfig';

export type InspectorConfigurationResolver = {
  visibility: SisadPdfmeVisibilityConfig;
  inspectorVisible: boolean;
  showTechnicalInspector: boolean;
  showEmptySections: boolean;
  showAdvanced: boolean;
  showCollaboration: boolean;
  showComments: boolean;
  shouldShowSection(sectionKey: string): boolean;
};

export const createInspectorConfigurationResolver = (
  source: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
): InspectorConfigurationResolver => {
  const visibility = source.visibility;
  const inspectorVisibility = visibility.inspector;

  return {
    visibility,
    inspectorVisible: inspectorVisibility?.visible !== false,
    showTechnicalInspector: source.config.debug.showTechnicalInspector === true,
    showEmptySections: inspectorVisibility?.showEmptySections === true,
    showAdvanced: inspectorVisibility?.showAdvanced !== false,
    showCollaboration: inspectorVisibility?.showCollaboration !== false,
    showComments: inspectorVisibility?.showComments !== false,
    shouldShowSection: (sectionKey) => shouldShowInspectorSection(sectionKey, visibility),
  };
};
