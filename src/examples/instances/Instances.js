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
    handlers: Object.fromEntries(Object.entries(handlers).filter(([, v]) => v)),
  });
};

const instanceFactories = {
  'designer-single-user': ({ template, config, ...handlers }) =>
    createInstance('designer-single-user', {
      mode: 'designer',
      template,
      state: { template },
      resources: { config },
      handlers,
    }),

  'designer-multi-user': ({ template, config, documents, recipients, activeRecipientId, ...handlers }) =>
    createInstance('designer-multi-user', {
      mode: 'designer',
      template,
      state: { template, activeRecipientId },
      resources: { config, documents, recipients },
      handlers,
    }),

  'runtime-form': ({ template, values, config, ...handlers }) =>
    createInstance('runtime-form', {
      mode: 'form',
      template,
      resources: { config },
      defaultState: { inputs: values },
      handlers,
    }),

  'runtime-viewer': ({ template, config, inputs, ...handlers }) =>
    createInstance('runtime-viewer', {
      mode: 'viewer',
      template,
      resources: { config },
      defaultState: { inputs: Array.isArray(inputs) ? inputs : getInputFromTemplate(template) },
      handlers,
    }),

  'schema-family': (familySlug, { template, config, ...handlers }) =>
    createInstance(`schema-family-${familySlug}`, {
      mode: 'designer',
      template,
      state: { template },
      resources: { config },
      handlers,
    }),
};

export const createDesignerSingleUserInstance = (props) => instanceFactories['designer-single-user'](props);
export const createDesignerMultiUserInstance = (props) => instanceFactories['designer-multi-user'](props);
export const createRuntimeFormInstance = (props) => instanceFactories['runtime-form'](props);
export const createRuntimeViewerInstance = (props) => instanceFactories['runtime-viewer'](props);
export const createSchemaFamilyInstance = ({ familySlug, ...props }) =>
  instanceFactories['schema-family'](familySlug, props);

export const createSisadInstance = (type, props) => {
  const factory = instanceFactories[type];
  if (!factory) throw new Error(`Unknown instance type: ${type}`);
  return factory(props);
};
