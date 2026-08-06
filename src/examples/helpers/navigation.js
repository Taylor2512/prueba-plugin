import PagesConfig from '../config/pagesConfig.json';
import { useNavigate } from 'react-router-dom';
import { getSchemaRoute } from '../routes/routeDefinitions.js';

const routeEntries = Object.entries(PagesConfig.routes || {});

const toHelperName = (pageKey) =>
  `to${pageKey
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;

export const navigationHelpers = {
  toCatalog: () => '/',
  toSchemas: () => '/schemas',
  toSchemaFamily: (familySlug) => getSchemaRoute(familySlug),
  toGeneratedPage: (pageKey) => {
    const route = PagesConfig.routes?.[pageKey];
    if (!route) throw new Error(`Route not found for page: ${pageKey}`);
    return route;
  },
  ...Object.fromEntries(routeEntries.map(([pageKey, route]) => [toHelperName(pageKey), () => route])),
};

export function useNavigation() {
  const navigate = useNavigate();
  const go = (path) => navigate(path);
  const resolveNavigate = (resolver) => (...args) => navigate(resolver(...args));

  return {
    go,
    ...Object.fromEntries(
      Object.entries(navigationHelpers).map(([name, resolver]) => [
        name,
        typeof resolver === 'function' ? resolveNavigate(resolver) : resolver,
      ]),
    ),
  };
}
