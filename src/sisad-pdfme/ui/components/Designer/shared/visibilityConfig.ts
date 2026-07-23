import type { SisadPdfmeVisibilityConfig } from '../../../../config/SisadPdfmeConfig.js';
import { asRecord } from './objectGuards.js';

type VisibilityConfigContext = {
  visibility?: SisadPdfmeVisibilityConfig;
  assignmentEnabled: boolean;
};

export type ReassignVisibilityState = {
  assignmentEnabled: boolean;
  reassignVisible: boolean;
  assignmentModalVisible: boolean;
};

export const resolveVisibilityConfig = (options: unknown): SisadPdfmeVisibilityConfig | undefined =>
  asRecord(asRecord(options)?.visibility) as SisadPdfmeVisibilityConfig | undefined;

export const resolveReassignVisibilityState = (options: unknown): ReassignVisibilityState => {
  const optionsRecord = asRecord(options);
  const visibility = resolveVisibilityConfig(options);
  const assignmentEnabled = asRecord(optionsRecord?.assignment)?.enabled === true;
  const actionsVisibility = asRecord(visibility?.actions);
  const modalsVisibility = asRecord(visibility?.modals);

  return {
    assignmentEnabled,
    reassignVisible: actionsVisibility?.reassign !== false && assignmentEnabled,
    assignmentModalVisible: modalsVisibility?.assignment !== false,
  };
};

export const shouldShowInspectorSection = (
  sectionKey: string,
  visibility?: SisadPdfmeVisibilityConfig,
): boolean => {
  const inspectorVisibility = visibility?.inspector;
  if (inspectorVisibility?.visible === false) return false;
  const sectionOverrides = asRecord(inspectorVisibility?.sections);
  if (sectionOverrides?.[sectionKey] === false) {
    return false;
  }

  if (sectionKey === 'advanced' && (inspectorVisibility?.showAdvanced === false || inspectorVisibility?.showTechnical === false)) {
    return false;
  }
  if (sectionKey === 'comments' && inspectorVisibility?.showComments === false) return false;
  if (sectionKey === 'collaboration' && inspectorVisibility?.showCollaboration === false) return false;

  return true;
};
