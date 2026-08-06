import { createUniversalPage } from './UniversalPage.jsx';
import PagesConfig from '../config/pagesConfig.json';
import {
  buildShowcaseTemplate,
} from '../builders/showcaseTemplate.js';
import {
  buildMultiUserShowcaseTemplate,
} from '../builders/multiUserShowcase.js';
import {
  createDesignerSingleUserInstance,
  createDesignerMultiUserInstance,
  createRuntimeFormInstance,
  createRuntimeViewerInstance,
} from '../instances/Instances.js';
import { FAMILY } from '../catalog/familyCatalog.js';
import { DEMO_DOCUMENTS } from '../fixtures/documents.js';
import { MULTI_USER_RECIPIENTS } from '../fixtures/recipients.js';

const templateBuilders = {
  showcaseTemplate: (FAMILY, options) => {
    if (options.familyKeys) {
      const filtered = FAMILY.filter((f) => options.familyKeys.includes(f.key));
      return buildShowcaseTemplate(filtered.map((f) => ({ title: f.title, types: f.types })));
    }
    return buildShowcaseTemplate(FAMILY.map((f) => ({ title: f.title, types: f.types })));
  },
  multiUserShowcase: (FAMILY) => {
    const MULTI_USER_FAMILY_KEYS = ['text', 'choice', 'boolean', 'signature'];
    const filtered = FAMILY.filter((f) => MULTI_USER_FAMILY_KEYS.includes(f.key));
    return buildMultiUserShowcaseTemplate(filtered.map((f) => ({ title: f.title, types: f.types })));
  },
};

const instanceBuilders = {
  'designer-single-user': createDesignerSingleUserInstance,
  'designer-multi-user': createDesignerMultiUserInstance,
  'runtime-form': createRuntimeFormInstance,
  'runtime-viewer': createRuntimeViewerInstance,
};

export const generatePages = () =>
  Object.fromEntries(
    Object.keys(PagesConfig.pages).map((pageKey) => [
      pageKey,
      createUniversalPage(pageKey, {
        templateBuilders,
        instanceBuilders,
        FAMILY,
        DEMO_DOCUMENTS,
        MULTI_USER_RECIPIENTS,
      }),
    ]),
  );

const generatedPages = generatePages();
export const GENERATED_PAGE_COMPONENTS = generatedPages;

export const DesignerSingleUserPage = generatedPages['designer-single-user'];
export const DesignerMultiUserPage = generatedPages['designer-multi-user'];
export const RuntimeFormPage = generatedPages['runtime-form'];
export const RuntimeViewerPage = generatedPages['runtime-viewer'];

export const GENERATED_ROUTES = PagesConfig.routes;
