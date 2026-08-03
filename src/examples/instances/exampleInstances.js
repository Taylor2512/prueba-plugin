import { defineSisadPdfmeInstance } from '@/sisad-pdfme';

export const createDesignerSingleUserInstance = ({
  template,
  config,
  onTemplateChange,
  onSave,
  onControllerReady,
  onEvent,
}) =>
  defineSisadPdfmeInstance({
    id: 'designer-single-user',
    definition: {
      mode: 'designer',
      state: {
        template,
      },
    },
    resources: {
      config,
    },
    handlers: {
      onTemplateChange,
      onSave,
      onControllerReady,
      onEvent,
    },
  });

export const createDesignerMultiUserInstance = ({
  template,
  activeRecipientId,
  config,
  documents,
  recipients,
  onTemplateChange,
  onSave,
  onControllerReady,
  onEvent,
  onRecipientsChange,
  onActiveRecipientChange,
  onAssignmentChange,
}) =>
  defineSisadPdfmeInstance({
    id: 'designer-multi-user',
    definition: {
      mode: 'designer',
      state: {
        template,
        activeRecipientId,
      },
    },
    resources: {
      config,
      documents,
      recipients,
    },
    handlers: {
      onTemplateChange,
      onSave,
      onControllerReady,
      onEvent,
      onRecipientsChange,
      onActiveRecipientChange,
      onAssignmentChange,
    },
  });

export const createRuntimeFormInstance = ({ template, values, config, onInputChange }) =>
  defineSisadPdfmeInstance({
    id: 'runtime-form',
    definition: {
      mode: 'form',
      template,
      defaultState: {
        inputs: values,
      },
    },
    resources: {
      config,
    },
    handlers: {
      onInputChange,
    },
  });

export const createRuntimeViewerInstance = ({ template, config }) =>
  defineSisadPdfmeInstance({
    id: 'runtime-viewer',
    definition: {
      mode: 'viewer',
      template,
    },
    resources: {
      config,
    },
  });

export const createSchemaFamilyInstance = ({ familySlug, template, config, onTemplateChange }) =>
  defineSisadPdfmeInstance({
    id: `schema-family-${familySlug}`,
    definition: {
      mode: 'designer',
      state: {
        template,
      },
    },
    resources: {
      config,
    },
    handlers: {
      onTemplateChange,
    },
  });
