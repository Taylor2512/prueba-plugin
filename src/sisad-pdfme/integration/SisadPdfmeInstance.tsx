import React, { useMemo } from 'react';
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '../react/index.js';
import {
  resolveSisadPdfmeInstance,
  type SisadPdfmeInstanceMode,
  type SisadPdfmeInstanceProps,
  type SisadPdfmeInstanceResolution,
} from './resolveSisadPdfmeInstance.js';

const SURFACES: Record<SisadPdfmeInstanceMode, React.ComponentType<any>> = {
  designer: SisadPdfmeDesigner,
  form: SisadPdfmeForm,
  viewer: SisadPdfmeViewer,
};

export { resolveSisadPdfmeInstance };
export type {
  SisadPdfmeInstanceMode,
  SisadPdfmeInstanceProps,
  SisadPdfmeInstanceResolution,
} from './resolveSisadPdfmeInstance.js';

export const useSisadPdfmeInstance = (
  props: SisadPdfmeInstanceProps,
): SisadPdfmeInstanceResolution & { Component: React.ComponentType<any> } =>
  useMemo(() => {
    const resolved = resolveSisadPdfmeInstance(props);
    return {
      ...resolved,
      Component: SURFACES[resolved.surface],
    };
  }, [props]);

export const SisadPdfmeInstance = (props: SisadPdfmeInstanceProps) => {
  const { Component, props: resolvedProps } = useSisadPdfmeInstance(props);
  return <Component {...resolvedProps} />;
};
