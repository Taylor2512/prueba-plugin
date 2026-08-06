export const createHandlers = (spec, context) => {
  const { record, setState, setTemplate } = context;
  const handlers = {};

  Object.entries(spec || {}).forEach(([name, config]) => {
    if (config.type === 'setState') {
      handlers[name] = (payload) => {
        setState(payload);
        if (config.record) record(name, payload);
      };
    } else if (config.type === 'setTemplate') {
      handlers[name] = (nextTemplate) => {
        setTemplate(nextTemplate);
        if (config.record) record(name, { pages: nextTemplate?.schemas?.length ?? 0 });
      };
    } else if (config.type === 'increment') {
      handlers[name] = (payload) => {
        setState((prev) => ({ ...prev, [config.field]: (prev[config.field] ?? 0) + 1 }));
        if (config.record) record(name, payload);
      };
    } else if (config.type === 'custom' && typeof config.fn === 'function') {
      handlers[name] = config.fn(context);
    }
  });

  return handlers;
};

export const commonHandlers = {
  // Logging para eventos
  onEvent: (record) => (event) => record(event.name, event.payload),

  // Template changes
  onTemplateChange: (record, setTemplate) => (nextTemplate) => {
    setTemplate(nextTemplate);
    record('onTemplateChange', { páginas: nextTemplate?.schemas?.length ?? 0 });
  },

  // Recipients
  onRecipientsChange: (record) => (recipients) => {
    record('onRecipientsChange', { recipients });
  },

  onActiveRecipientChange: (record) => (recipient) => {
    record('onActiveRecipientChange', { recipient });
  },

  onAssignmentChange: (record, setState) => (payload) => {
    setState((prev) => ({ ...prev, assignments: (prev.assignments ?? 0) + 1 }));
    record('onAssignmentChange', { schemas: payload?.schemaIds ?? [] });
  },

  // Input handling
  onInputChange: (record, setState) => (payload) => {
    setState((prev) => ({ ...prev, lastInput: `${payload.name} = ${String(payload.value)}` }));
    record('onInputChange', { campo: payload.name, índice: payload.index });
  },

  // Save
  onSave: (record) => () => {
    record('onSave', { timestamp: new Date().toLocaleTimeString('es') });
  },
};

export const selectHandlers = (names, context) => {
  const result = {};
  names.forEach((name) => {
    const handler = commonHandlers[name];
    if (handler) {
      result[name] = handler(context.record, context.setState, context.setTemplate);
    }
  });
  return result;
};
