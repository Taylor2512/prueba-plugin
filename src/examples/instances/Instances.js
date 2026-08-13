import { getInputFromTemplate } from '@sisad-pdfme/common';
import { defineSisadPdfmeInstance } from '@/sisad-pdfme';

const createInstance = (id, { mode, template, state = {}, resources = {}, handlers = {}, defaultState }) => {
  const definition = { mode };
  if (template) definition.template = template;
  if (defaultState) definition.defaultState = defaultState;
  if (Object.keys(state).length > 0) definition.state = state;

  return defineSisadPdfmeInstance({
    id,
    definition,
    resources,
    handlers: Object.fromEntries(Object.entries(handlers).filter(([, value]) => Boolean(value))),
  });
};

const buildRuntimeDefaults = (mode, descriptor, props) => {
  const defaultInputs = Array.isArray(props.inputs) ? props.inputs : getInputFromTemplate(props.template);

  if (mode === 'designer') {
    return {
      state: { template: props.template, ...(descriptor.state || {}), ...(props.state || {}) },
      resources: { ...(descriptor.resources || {}), ...(props.resources || {}) },
      defaultState: descriptor.defaultState,
    };
  }

  if (mode === 'form') {
    return {
      state: { ...(descriptor.state || {}), ...(props.state || {}) },
      resources: { ...(descriptor.resources || {}), ...(props.resources || {}) },
      defaultState: { inputs: props.values ?? defaultInputs },
    };
  }

  return {
    state: { ...(descriptor.state || {}), ...(props.state || {}) },
    resources: { ...(descriptor.resources || {}), ...(props.resources || {}) },
    defaultState: { inputs: defaultInputs },
  };
};

export const createSisadInstance = (descriptor, props = {}) => {
  const { handlers: explicitHandlers, ...runtimeProps } = props;
  const runtimeHandlers = explicitHandlers || Object.fromEntries(
    Object.entries(runtimeProps).filter(([key]) => /^on[A-Z]/.test(key)),
  );
  const runtime = buildRuntimeDefaults(descriptor.mode, descriptor, props);
  return createInstance(descriptor.id, {
    mode: descriptor.mode,
    template: props.template,
    state: runtime.state,
    resources: {
      ...runtime.resources,
      config: props.config ?? runtime.resources.config,
      documents: props.documents ?? runtime.resources.documents,
      recipients: props.recipients ?? runtime.resources.recipients,
    },
    handlers: runtimeHandlers,
    defaultState: runtime.defaultState,
  });
};

export const createDesignerSingleUserInstance = (props) =>
  createSisadInstance(
    {
      id: 'designer-single-user',
      mode: 'designer',
      state: { template: null },
      handlers: { onTemplateChange: true },
    },
    props,
  );

export const createDesignerMultiUserInstance = (props) =>
  createSisadInstance(
    {
      id: 'designer-multi-user',
      mode: 'designer',
      state: { template: null, activeRecipientId: null },
      handlers: { onTemplateChange: true, onActiveRecipientChange: true, onAssignmentChange: true },
    },
    props,
  );

export const createRuntimeFormInstance = (props) =>
  createSisadInstance(
    {
      id: 'runtime-form',
      mode: 'form',
      handlers: { onInputChange: true },
    },
    props,
  );

export const createRuntimeViewerInstance = (props) =>
  createSisadInstance(
    {
      id: 'runtime-viewer',
      mode: 'viewer',
    },
    props,
  );

export const createSchemaFamilyInstance = ({ familySlug, ...props }) =>
  createSisadInstance(
    {
      id: `schema-family-${familySlug}`,
      mode: 'designer',
      state: { template: null },
      handlers: { onTemplateChange: true },
    },
    props,
  );
