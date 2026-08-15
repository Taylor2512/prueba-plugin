import type React from 'react';
import type {
  SisadPdfmeInstanceDefinition,
  SisadPdfmeInstanceHandlers,
  SisadPdfmeInstanceResources,
} from '@sisad-pdfme/integration/resolveSisadPdfmeInstance';

export type SisadPdfmeRegisteredInstance = {
  id: string;
  revision?: string | number;
  definition: SisadPdfmeInstanceDefinition;
  resources?: SisadPdfmeInstanceResources;
  handlers?: SisadPdfmeInstanceHandlers;
  className?: string;
  style?: React.CSSProperties;
};

export type SisadPdfmeInstanceInput =
  | {
      instance: SisadPdfmeRegisteredInstance;
      className?: string;
      style?: React.CSSProperties;
    }
  | {
      instanceKey?: string | number;
      definition: SisadPdfmeInstanceDefinition;
      resources?: SisadPdfmeInstanceResources;
      handlers?: SisadPdfmeInstanceHandlers;
      className?: string;
      style?: React.CSSProperties;
    };

export const defineSisadPdfmeInstance = (
  input: SisadPdfmeRegisteredInstance,
): SisadPdfmeRegisteredInstance => ({
  id: String(input.id ?? '').trim() || 'instance',
  revision: input.revision,
  definition: input.definition,
  resources: input.resources,
  handlers: input.handlers,
  className: input.className,
  style: input.style,
});
