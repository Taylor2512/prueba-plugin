import Manifest from './examplesManifest.json';

export const EXAMPLES_MANIFEST = Manifest;
export const EXAMPLE_ROUTE_MAP = Manifest.routes;
export const EXAMPLE_PRIMARY_ROUTES = Manifest.primaryRoutes;

export const getExamplePageConfig = (pageKey) =>
  Manifest.primaryRoutes.find((page) => page.id === pageKey) || null;
