import PagesConfig from '../config/pagesConfig.json';
import { createHandlers } from '../helpers/handlerFactory.js';

const MULTI_USER_FAMILY_KEYS = ['text', 'choice', 'boolean', 'signature'];

const resolveFamilyGroups = (FAMILY, options = {}) => {
  const familyKeys = Array.isArray(options.familyKeys)
    ? options.familyKeys
    : options.familySource === 'multiUser'
      ? MULTI_USER_FAMILY_KEYS
      : options.familySource === 'all'
        ? FAMILY.map((family) => family.key)
        : null;

  const selectedFamilies = familyKeys
    ? FAMILY.filter((family) => familyKeys.includes(family.key))
    : FAMILY;

  return selectedFamilies.map((family) => ({
    title: family.title,
    types: family.types,
  }));
};

const templateBuilders = {
  showcaseTemplate: (buildShowcaseTemplate, FAMILY, options = {}) =>
    buildShowcaseTemplate(resolveFamilyGroups(FAMILY, options)),

  multiUserShowcase: (buildMultiUserShowcaseTemplate, FAMILY) =>
    buildMultiUserShowcaseTemplate(resolveFamilyGroups(FAMILY, { familyKeys: MULTI_USER_FAMILY_KEYS })),
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
  return createHandlers(config.handlers, { record, setTemplate, setState });
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
