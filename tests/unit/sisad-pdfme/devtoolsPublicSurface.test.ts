import { describe, expect, it } from 'vitest';
import type {
  UsePdfmeRuntimeInstanceConfig,
  PdfmeRuntimeMode,
  PdfmeRuntimeConstructors,
  PdfmeRuntimeInstanceHandle,
  UsePdfmeArtifactsConfig,
  PdfmeArtifactsState,
} from '@/sisad-pdfme/devtools';

type _DevtoolsTypeContract = {
  runtimeConfig: UsePdfmeRuntimeInstanceConfig;
  runtimeMode: PdfmeRuntimeMode;
  runtimeConstructors: PdfmeRuntimeConstructors;
  runtimeHandle: PdfmeRuntimeInstanceHandle;
  artifactsConfig: UsePdfmeArtifactsConfig;
  artifactsState: PdfmeArtifactsState;
};

describe('sisad-pdfme devtools public surface', () => {
  it('exposes the opt-in devtools barrel and runtime hook exports', async () => {
    const devtoolsApi = await import('@/sisad-pdfme/devtools');

    expect(typeof devtoolsApi.usePdfmeArtifacts).toBe('function');
    expect(typeof devtoolsApi.usePdfmeRuntimeInstance).toBe('function');
    expect(typeof devtoolsApi.getTemplateSignature).toBe('function');
    expect(typeof devtoolsApi.scheduleDestroyInstance).toBe('function');
    expect(devtoolsApi.RUNTIME_MODES).toBeTruthy();
    expect(devtoolsApi.DEFAULT_UX_MODES).toBeTruthy();
    expect(typeof devtoolsApi.isValidRuntimeMode).toBe('function');
    expect(typeof devtoolsApi.getErrorMessage).toBe('function');
    expect(typeof devtoolsApi.formatPageStatus).toBe('function');
    expect(typeof devtoolsApi.resolveInitialUxMode).toBe('function');
    expect(typeof devtoolsApi.createPdfPreflightReport).toBe('function');
    expect(typeof devtoolsApi.generatePdfWithPreflight).toBe('function');
    expect(typeof devtoolsApi.createObjectUrl).toBe('function');
    expect(typeof devtoolsApi.revokeObjectUrls).toBe('function');
    expect(typeof devtoolsApi.downloadUrl).toBe('function');
    expect(typeof devtoolsApi.downloadJson).toBe('function');
    expect(typeof devtoolsApi.decorateCollaborationUsers).toBe('function');
    expect(devtoolsApi.LAB_COLLABORATOR_PALETTE).toBeTruthy();
    expect(typeof devtoolsApi.withAlpha).toBe('function');
    expect(typeof devtoolsApi.buildCollaboratorChipStyle).toBe('function');
    expect(typeof devtoolsApi.resolveCollaboratorById).toBe('function');
    expect(typeof devtoolsApi.resolveSchemaOwnerColor).toBe('function');
    expect(typeof devtoolsApi.decorateSchemaWithCollaboration).toBe('function');
    expect(typeof devtoolsApi.decorateTemplateWithCollaboration).toBe('function');
    expect(typeof devtoolsApi.createDefaultTemplate).toBe('function');
  });
});
