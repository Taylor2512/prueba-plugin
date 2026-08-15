import type { SisadPdfmeGlobalConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';

export type SisadPdfmeConfigChangeImpact = {
  touchedPaths: string[];
  presentationOnly: boolean;
  rebuildResources: boolean;
};

const keys = [
  'app',
  'runtime',
  'theme',
  'canvas',
  'sidebars',
  'visibility',
  'ui',
  'debug',
] as const;

const structuralKeys = [
  'schemas',
  'recipients',
  'collaboration',
  'assignment',
  'documents',
  'signatures',
  'persistence',
  'events',
] as const;

const isEqualJson = (left: unknown, right: unknown) => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

export const classifySisadPdfmeConfigChange = (
  previous: SisadPdfmeGlobalConfig,
  next: SisadPdfmeGlobalConfig,
): SisadPdfmeConfigChangeImpact => {
  const touchedPaths = [
    ...keys.filter((key) => !isEqualJson(previous?.[key], next?.[key])),
    ...structuralKeys.filter((key) => !isEqualJson(previous?.[key], next?.[key])),
  ];
  const structuralChanged = structuralKeys.some((key) => !isEqualJson(previous?.[key], next?.[key]));
  const presentationChanged = keys.some((key) => !isEqualJson(previous?.[key], next?.[key]));
  const runtimeModeChanged = !isEqualJson(previous?.runtime?.mode, next?.runtime?.mode);
  return {
    touchedPaths,
    presentationOnly: presentationChanged && !structuralChanged && !runtimeModeChanged,
    rebuildResources: structuralChanged || runtimeModeChanged,
  };
};
