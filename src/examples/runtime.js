/**
 * Runtime support for the example lab: instance construction and shared hooks.
 * The manifest remains the source of behavior; this module only adapts it to
 * React and the reusable SISAD-PDFME instance contract.
 */
import { useCallback, useMemo, useRef, useState } from 'react';

import { getInputFromTemplate } from '@sisad-pdfme/common';
import { defineSisadPdfmeInstance } from '@/sisad-pdfme';

import { createRuntimeConfig } from './catalog.js';

const DESIGNER_STATE = { template: null };
const DESIGNER_COLLABORATIVE_STATE = { template: null, activeRecipientId: null };

const buildRuntimeDefaults = (mode, descriptor, props) => {
  const defaultInputs = Array.isArray(props.inputs) ? props.inputs : getInputFromTemplate(props.template);
  const state = { ...(descriptor.state || {}), ...(props.state || {}) };
  const resources = { ...(descriptor.resources || {}), ...(props.resources || {}) };

  if (mode === 'designer') {
    return { state: { template: props.template, ...state }, resources, defaultState: descriptor.defaultState };
  }

  if (mode === 'form') {
    return { state, resources, defaultState: { inputs: props.values ?? defaultInputs } };
  }

  return { state, resources, defaultState: { inputs: defaultInputs } };
};

/** @param {{ id: string, mode: 'designer'|'form'|'viewer', collaboration?: boolean }} descriptor */
export const createExampleInstance = (descriptor, props = {}) => {
  const { handlers: explicitHandlers, ...runtimeProps } = props;
  const handlers = explicitHandlers || Object.fromEntries(
    Object.entries(runtimeProps).filter(([key]) => /^on[A-Z]/.test(key)),
  );

  const resolved = {
    ...descriptor,
    state: descriptor.state
      ?? (descriptor.mode === 'designer'
        ? (descriptor.collaboration ? DESIGNER_COLLABORATIVE_STATE : DESIGNER_STATE)
        : undefined),
  };

  const runtime = buildRuntimeDefaults(resolved.mode, resolved, props);
  const definition = { mode: resolved.mode };

  if (props.template) definition.template = props.template;
  if (runtime.defaultState) definition.defaultState = runtime.defaultState;
  if (Object.keys(runtime.state).length > 0) definition.state = runtime.state;

  return defineSisadPdfmeInstance({
    id: resolved.id,
    definition,
    resources: {
      ...runtime.resources,
      config: props.config ?? runtime.resources.config,
      documents: props.documents ?? runtime.resources.documents,
      recipients: props.recipients ?? runtime.resources.recipients,
    },
    handlers: Object.fromEntries(Object.entries(handlers).filter(([, value]) => Boolean(value))),
  });
};

export function useRuntimeConfig(profile) {
  return useMemo(() => createRuntimeConfig(profile), [profile]);
}

export function useEventLog(maxEntries = 40) {
  const [events, setEvents] = useState([]);

  const record = useCallback((name, detail) => {
    setEvents((current) => [
      ...current.slice(-Math.max(0, maxEntries - 1)),
      { id: `${Date.now()}-${current.length}`, name, detail, at: new Date().toLocaleTimeString('es') },
    ]);
  }, [maxEntries]);

  const clear = useCallback(() => setEvents([]), []);
  return { events, record, clear };
}

export function useController() {
  const controllerRef = useRef(null);
  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);
  const getController = useCallback(() => controllerRef.current, []);
  return { controllerRef, handleControllerReady, getController };
}
