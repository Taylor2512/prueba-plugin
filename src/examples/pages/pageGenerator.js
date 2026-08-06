import PagesConfig from '../config/pagesConfig.json';

const templateBuilders = {
  showcaseTemplate: (buildShowcaseTemplate, FAMILY, options = {}) => {
    if (options.familyKeys) {
      const filtered = FAMILY.filter((f) => options.familyKeys.includes(f.key));
      return buildShowcaseTemplate(filtered.map((f) => ({ title: f.title, types: f.types })));
    }
    if (options.familySource === 'all') {
      return buildShowcaseTemplate(FAMILY.map((f) => ({ title: f.title, types: f.types })));
    }
    return buildShowcaseTemplate([]);
  },

  multiUserShowcase: (buildMultiUserShowcaseTemplate, FAMILY, options = {}) => {
    const MULTI_USER_FAMILY_KEYS = ['text', 'choice', 'boolean', 'signature'];
    const filtered = FAMILY.filter((f) => MULTI_USER_FAMILY_KEYS.includes(f.key));
    return buildMultiUserShowcaseTemplate(filtered.map((f) => ({ title: f.title, types: f.types })));
  },
};

export const getPageConfig = (pageKey) => {
  const config = PagesConfig.pages[pageKey];
  if (!config) throw new Error(`Page not found: ${pageKey}`);
  return config;
};

export const getPageRoute = (pageKey) => {
  const route = PagesConfig.routes?.[pageKey];
  if (!route) throw new Error(`Route not found for page: ${pageKey}`);
  return route;
};

export const buildPageTemplate = (config, builders, FAMILY) => {
  const { builder, options } = config.template;
  const builderFn = builders[builder];
  if (!builderFn) throw new Error(`Template builder not found: ${builder}`);
  return builderFn(FAMILY, options);
};

export const createPageHandlers = (config, { record, setTemplate, setState }) => {
  const handlers = {};

  if (!config.handlers) return handlers;

  Object.entries(config.handlers).forEach(([key, spec]) => {
    if (spec.type === 'setState') {
      handlers[key] = (payload) => {
        setTemplate(payload);
        if (spec.record) record(key, payload);
      };
    } else if (spec.type === 'increment') {
      handlers[key] = (payload) => {
        setState((prev) => ({ ...prev, [spec.field]: (prev[spec.field] || 0) + 1 }));
        if (spec.record) record(key, payload);
      };
    }
  });

  return handlers;
};

export const getPageInfo = (config, state, computed = {}) => {
  const info = {};

  Object.entries(config.info || {}).forEach(([key, spec]) => {
    if (spec.type === 'state') {
      info[key] = state[key];
    } else if (spec.type === 'computed') {
      info[key] = computed[key];
    } else if (spec.path) {
      info[key] = getNestedValue(state, spec.path);
    }
  });

  return info;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    if (part.includes('()')) return acc; // Skip computed
    return acc?.[part];
  }, obj);
};

export const getPageActions = (config, state, setters) => {
  if (!config.actions) return null;

  return Object.entries(config.actions).reduce((acc, [key, actionSpec]) => {
    if (actionSpec.type === 'select' && state.activeRecipientId) {
      acc.actions = acc.actions || [];
      acc.actions.push({
        type: 'select',
        key,
        label: actionSpec.label,
        options: state.recipients || [],
      });
    }
    return acc;
  }, {});
};
