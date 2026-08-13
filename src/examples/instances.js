/**
 * Fábrica de instancias del runtime reusable.
 *
 * El descriptor de cada ejemplo sale del manifest (`mode`, `collaboration`),
 * así que agregar un ejemplo nuevo no requiere registrar un builder aquí.
 */
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { defineSisadPdfmeInstance } from '@/sisad-pdfme';

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

/**
 * @param {{ id: string, mode: 'designer'|'form'|'viewer', collaboration?: boolean }} descriptor
 */
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
