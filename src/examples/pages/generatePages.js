import React from 'react';
import { createUniversalPage } from './UniversalPage.jsx';
import { EXAMPLE_PRIMARY_ROUTES, EXAMPLE_ROUTE_MAP } from '../config/examplesManifest.js';
import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { buildMultiUserShowcaseTemplate } from '../builders/multiUserShowcase.js';
import { createDefaultTemplate } from '@/sisad-pdfme/devtools';
import { createDefaultSchema } from '@sisad-pdfme/schemas';
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { FAMILY } from '../catalog/familyCatalog.js';
import { DEMO_DOCUMENTS } from '../fixtures/documents.js';
import { MULTI_USER_RECIPIENTS } from '../fixtures/recipients.js';
import { CatalogPage } from './CatalogPage.jsx';
import { SchemaFamilyPage } from './SchemaFamilyPage.jsx';
import { SchemasCatalogPage } from './SchemasCatalogPage.jsx';
import { getSchemaRoute } from '../routes/routeDefinitions.js';
import { createDesignerSingleUserInstance, createDesignerMultiUserInstance, createRuntimeFormInstance, createRuntimeViewerInstance } from '../instances/Instances.js';

export const buildPageTemplate = (config, builders, FAMILY) => {
  const { builder, options } = config.template;
  const builderFn = builders[builder];
  if (!builderFn) throw new Error(`Template builder not found: ${builder}`);
  return builderFn(FAMILY, options);
};

export const createPageHandlers = (config, { record, setTemplate, setState }) => {
  const getNestedValue = (value, path) =>
    path.split('.').reduce((acc, part) => {
      if (acc == null) return undefined;
      if (part.includes('()')) return acc;
      return acc?.[part];
    }, value);

  const resolvePayloadValue = (payload, spec = {}) => {
    if (spec.format === 'nameValue') return `${payload?.name ?? 'campo'} = ${String(payload?.value ?? '')}`;
    if (spec.valuePath) return getNestedValue(payload, spec.valuePath);
    return payload;
  };

  return Object.fromEntries(Object.entries(config.handlers || {}).map(([name, spec]) => {
    if (spec.type === 'setState') {
      return [name, (payload) => {
        if (spec.field) {
          const nextValue = resolvePayloadValue(payload, spec);
          setState((prev) => ({ ...prev, [spec.field]: nextValue }));
        } else {
          setState(payload);
        }
        if (spec.record) record(name, payload);
      }];
    }
    if (spec.type === 'setTemplate') {
      return [name, (nextTemplate) => {
        setTemplate(nextTemplate);
        if (spec.record) record(name, { pages: nextTemplate?.schemas?.length ?? 0 });
      }];
    }
    if (spec.type === 'increment') {
      return [name, (payload) => {
        setState((prev) => ({ ...prev, [spec.field]: (prev[spec.field] ?? 0) + 1 }));
        if (spec.record) record(name, payload);
      }];
    }
    return [name, undefined];
  }).filter(([, handler]) => Boolean(handler)));
};

const getDigitalAgreementsSnapshot = () => EXAMPLE_PRIMARY_ROUTES.find((page) => page.id === 'runtime-form-digital-agreements')?.formSnapshot || {};

const buildDigitalAgreementsFormTemplate = () => {
  const visibleFields = (getDigitalAgreementsSnapshot().templateFields || []).filter((field) => field.isHidden !== true);
  const inputToSchemaType = { multiline: 'multiVariableText', 'datetime-local': 'dateTime', boolean: 'checkbox' };
  const schemas = visibleFields.map((field, index) => {
    const schema = createDefaultSchema(inputToSchemaType[field.type] || field.type || 'text', {
      id: field.indexName,
      schemaUid: field.indexName,
      pageNumber: 1,
      position: { x: 28 + (index % 4) * 170, y: 28 + Math.floor(index / 4) * 34 },
      existingSchemas: [],
    });

    return {
      ...schema,
      name: field.indexName,
      content: String(field.value ?? field.defaultValue ?? ''),
      required: Boolean(field.isRequired),
      readOnly: Boolean(field.isDesabled),
      placeholderText: field.indexNameShow || field.indexName,
    };
  });

  return createDefaultTemplate({
    schemas: [schemas],
    basePdf: { width: 595, height: 842, padding: [24, 24, 24, 24] },
  });
};

const buildDigitalAgreementsFormValues = () => {
  const template = buildDigitalAgreementsFormTemplate();
  const defaults = getInputFromTemplate(template);
  const valueByName = Object.fromEntries((getDigitalAgreementsSnapshot().templateFields || []).map((field) => [field.indexName, field.value]));
  return defaults.map((input) => ({
    ...input,
    value: valueByName[input.name] ?? input.value,
  }));
};

const templateBuilders = {
  showcaseTemplate: (_, options = {}) => {
    const families = options.familyKeys
      ? FAMILY.filter((family) => options.familyKeys.includes(family.key))
      : FAMILY;
    return buildShowcaseTemplate(families.map((family) => ({ title: family.title, types: family.types })));
  },
  multiUserShowcase: () => {
    const selectedKeys = ['text', 'choice', 'boolean', 'signature'];
    const families = FAMILY.filter((family) => selectedKeys.includes(family.key));
    return buildMultiUserShowcaseTemplate(families.map((family) => ({ title: family.title, types: family.types })));
  },
  digitalAgreementsForm: () => buildDigitalAgreementsFormTemplate(),
};

const instanceBuilders = {
  'designer-single-user': createDesignerSingleUserInstance,
  'designer-multi-user': createDesignerMultiUserInstance,
  'runtime-form': createRuntimeFormInstance,
  'runtime-form-digital-agreements': createRuntimeFormInstance,
  'runtime-viewer': createRuntimeViewerInstance,
};

export const generatePages = () =>
  Object.fromEntries(
    EXAMPLE_PRIMARY_ROUTES.filter((page) => page.instanceId).map((page) => [
      page.id,
      createUniversalPage(page.id, {
        templateBuilders,
        instanceBuilders,
        FAMILY,
        DEMO_DOCUMENTS,
        MULTI_USER_RECIPIENTS,
        valuesBuilders: {
          'runtime-form-digital-agreements': buildDigitalAgreementsFormValues,
        },
      }),
    ]),
  );

const generatedPages = generatePages();
export const GENERATED_PAGE_COMPONENTS = generatedPages;
export const DesignerSingleUserPage = generatedPages['designer-single-user'];
export const DesignerMultiUserPage = generatedPages['designer-multi-user'];
export const RuntimeFormPage = generatedPages['runtime-form'];
export const RuntimeViewerPage = generatedPages['runtime-viewer'];
export const GENERATED_ROUTES = Object.fromEntries(
  EXAMPLE_PRIMARY_ROUTES.map((page) => [page.id, page.path || EXAMPLE_ROUTE_MAP[page.id] || '/']).filter(([, path]) => Boolean(path)),
);

export const buildLab = () => [
  ...EXAMPLE_PRIMARY_ROUTES.map((route) => ({
    id: route.id,
    path: route.path || EXAMPLE_ROUTE_MAP[route.id] || '/',
    title: route.title,
    description: route.description,
    shell: route.shell || (route.id === 'catalog' || route.id === 'schemas' ? 'documentation' : 'immersive'),
    element:
      route.id === 'catalog'
        ? React.createElement(CatalogPage, { primaryRouteDefinitions: EXAMPLE_PRIMARY_ROUTES })
        : route.id === 'schemas'
          ? React.createElement(SchemasCatalogPage, null)
          : generatedPages[route.id]
            ? React.createElement(generatedPages[route.id], { currentPath: route.path || EXAMPLE_ROUTE_MAP[route.id] || '/' })
            : null,
  })),
  ...FAMILY.map((family) => ({
    id: family.key,
    path: getSchemaRoute(family.slug),
    title: family.title,
    description: family.description,
    shell: 'immersive',
    element: React.createElement(SchemaFamilyPage, { family, currentPath: getSchemaRoute(family.slug) }),
  })),
];
